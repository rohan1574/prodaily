import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageBackground,
  Modal,
  TextInput,
} from 'react-native';
import {s as tw} from 'react-native-wind';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomNavigation from './BottomNavigation';
import Icon from 'react-native-vector-icons/Ionicons';
import {SafeAreaView} from 'react-native-safe-area-context';
import {usePoints} from '../context/PointsContext';
import {Keyboard} from 'react-native';
interface Task {
  id: string;
  isStarred: boolean;
  completed: boolean;
  name: string;

  // Existing properties

  specificFor?: string;
  specificForValue?: string;
  // নতুন প্রপার্টি
  dailyTarget?: number;
  currentProgress?: number;
  targetType?: string;
  // নতুন প্রপার্টি যোগ করুন
  scheduleType?: string; // 'daily', 'weekly', 'monthly', 'yearly' ইত্যাদি
  endDate?: string; // তারিখ স্ট্রিং হিসেবে (যেমন: '2024-05-30')
  selectedDays?: string[]; // সাপ্তাহিক দিনের নাম (যেমন: ['Monday', 'Friday'])
  selectedDate?: number[]; // মাসিক তারিখ (যেমন: [5, 15, 25])
  selectedDates?: number[]; // বার্ষিক তারিখ (যেমন: [15]
  selectedMonths?: string[]; // বার্ষিক মাস (যেমন: ['January', 'December'])
}
const TodaysTaskToDoScreen = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState(false);
  const {addPoints} = usePoints();

  // Add this state
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  // Add this useEffect
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setIsKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setIsKeyboardVisible(false);
      },
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const inputRefs = useRef<{[key: string]: TextInput | null}>({});

  // ইনপুট ফোকাস হ্যান্ডলার
  const handleFocus = (taskId: string) => {
    inputRefs.current[taskId]?.focus();
  };

  // ইনপুট ব্লার হ্যান্ডলার
  const handleBlur = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    let finalValue = task.currentProgress;
    if (finalValue > task.dailyTarget || isNaN(finalValue)) {
      finalValue = task.dailyTarget;
    }
    if (finalValue < 0) finalValue = 0;

    const updatedTasks = tasks.map(t => ({
      ...t,
      currentProgress: t.id === taskId ? finalValue : t.currentProgress,
    }));

    setTasks(updatedTasks);
    await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
    inputRefs.current[taskId]?.blur();
  };
  // time
  const selectedDate = new Date(); // অথবা আপনার নির্দিষ্ট তারিখ

  const month = selectedDate.toLocaleString('en-US', {month: 'long'});
  const day = selectedDate.getDate();
  const weekday = selectedDate.toLocaleString('en-US', {weekday: 'long'});

  const formattedDate = `${month} ${day}, ${weekday}`;

  const handleProgressInputChange = (taskId: string, text: string) => {
    const numericValue = parseInt(text, 10) || 0;
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        return {...task, currentProgress: numericValue};
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  const handleProgressBlur = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    let finalValue = task.currentProgress;
    if (finalValue > task.dailyTarget) {
      finalValue = task.dailyTarget;
    } else if (finalValue < 0) {
      finalValue = 0;
    }

    const updatedTasks = tasks.map(t => ({
      ...t,
      currentProgress: t.id === taskId ? finalValue : t.currentProgress,
    }));

    setTasks(updatedTasks);
    await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  // প্রোগ্রেস বাড়ানোর ফাংশন
  const incrementProgress = async (taskId: string) => {
    try {
      const updatedTasks = tasks.map(task => {
        if (task.id === taskId && task.dailyTarget) {
          const newProgress = (task.currentProgress || 0) + 1;
          return {
            ...task,
            currentProgress:
              newProgress > task.dailyTarget ? task.dailyTarget : newProgress,
          };
        }
        return task;
      });
      setTasks(updatedTasks);
      await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
    } catch (error) {
      console.error('Error incrementing progress:', error);
    }
  };

  // প্রোগ্রেস কমানোর ফাংশন
  const decrementProgress = async (taskId: string) => {
    try {
      const updatedTasks = tasks.map(task => {
        if (task.id === taskId) {
          const newProgress = Math.max((task.currentProgress || 0) - 1, 0);
          return {...task, currentProgress: newProgress};
        }
        return task;
      });
      setTasks(updatedTasks);
      await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
    } catch (error) {
      console.error('Error decrementing progress:', error);
    }
  };

  // Sorting helper function
  const sortTasks = (tasks: any[]) => {
    const group1 = tasks.filter(task => task.isStarred && !task.completed);
    const group2 = tasks.filter(task => !task.isStarred && !task.completed);
    const group3 = tasks.filter(task => task.isStarred && task.completed);
    const group4 = tasks.filter(task => !task.isStarred && task.completed);
    return [...group1, ...group2, ...group3, ...group4];
  };

  // Toggle completion with sorting and persistence
  const filterTasksForToday = (taskList: Task[]): Task[] => {
    const currentDate = new Date();

    return taskList.filter((task: Task) => {
      // Daily Routine টাস্ক (কোনো সিডিউল না থাকলে)
      if (
        !task.scheduleType &&
        !task.endDate &&
        !task.selectedDays?.length &&
        !task.selectedDate?.length &&
        !task.selectedDates?.length &&
        !task.selectedMonths?.length
      ) {
        return true;
      }

      // দিনভিত্তিক টাস্ক (endDate পর্যন্ত)
      if (task.endDate) {
        const taskEndDate = new Date(task.endDate);
        return taskEndDate >= currentDate;
      }

      // সাপ্তাহিক টাস্ক চেক
      if ((task.selectedDays?.length ?? 0) > 0) {
        const todayName = currentDate.toLocaleDateString('en-US', {
          weekday: 'short',
        });
        return task.selectedDays?.includes(todayName) ?? false; // Optional Chaining + Nullish Coalescing
      }

      // মাসিক টাস্ক চেক
      if ((task.selectedDate?.length ?? 0) > 0) {
        const todayDate = currentDate.getDate();
        return task.selectedDate?.includes(todayDate) ?? false;
      }

      // বার্ষিক টাস্কের জন্য সংশোধিত কোড
      if (
        (task.selectedDates?.length ?? 0) > 0 &&
        (task.selectedMonths?.length ?? 0) > 0
      ) {
        const todayDay = currentDate.getDate();
        const todayMonth = currentDate.toLocaleString('default', {
          month: 'short',
        });
        return (
          (task.selectedDates?.includes(todayDay) ?? false) &&
          (task.selectedMonths?.includes(todayMonth) ?? false)
        );
      }
      return false;
    });
  };

  // টগল ফাংশনগুলিতে ফিল্টারিং যোগ করুন
  const toggleComplete = async (id: string) => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      let taskList: Task[] = storedTasks ? JSON.parse(storedTasks) : [];

      taskList = taskList.map(task =>
        task.id === id ? {...task, completed: !task.completed} : task,
      );

      const sortedAndFiltered = filterTasksForToday(sortTasks(taskList)); // ফিল্টার যোগ
      await AsyncStorage.setItem('tasks', JSON.stringify(taskList));
      setTasks(sortedAndFiltered); // শুধুমাত্র ফিল্টার্ড টাস্ক সেট করুন
    } catch (error) {
      console.error('Error toggling completion:', error);
    }
  };

  const toggleStar = async (taskId: string) => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      let taskList: Task[] = storedTasks ? JSON.parse(storedTasks) : [];

      taskList = taskList.map(task =>
        task.id === taskId ? {...task, isStarred: !task.isStarred} : task,
      );

      const sortedAndFiltered = filterTasksForToday(sortTasks(taskList)); // ফিল্টার যোগ
      await AsyncStorage.setItem('tasks', JSON.stringify(taskList));
      setTasks(sortedAndFiltered); // শুধুমাত্র ফিল্টার্ড টাস্ক সেট করুন
    } catch (error) {
      console.error('Error toggling star:', error);
    }
  };
  useEffect(() => {
    if (tasks.length > 0 && tasks.every(task => task.completed)) {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  }, [tasks]);

  // টাস্ক ফিল্টার করার সময় currentProgress ইনিশিয়ালাইজ করুন
  useEffect(() => {
    const fetchAndFilterTasks = async () => {
      try {
        const storedTasks = await AsyncStorage.getItem('tasks');
        let taskList: Task[] = storedTasks ? JSON.parse(storedTasks) : [];

        // currentProgress ইনিশিয়ালাইজ করুন
        taskList = taskList.map(task => ({
          ...task,
          currentProgress: task.currentProgress || 0,
        }));

        const filtered = filterTasksForToday(taskList);
        setTasks(sortTasks(filtered));
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndFilterTasks();
  }, []);

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-200`}>
      {/* Header - Fixed at top */}
      <ImageBackground
        source={require('../../assets/images/vec.png')}
        style={[tw`rounded-lg mx-4 top-4`, {height: 138}]}
        imageStyle={tw`rounded-lg`}>
        <View style={tw`absolute inset-0 bg-black bg-opacity-30`}></View>

        <View style={tw`p-4`}>
          <View style={tw`flex-row justify-between items-start`}>
            <View style={tw`top-2`}>
              <Text style={[tw`text-xl font-medium`, {color: '#DEEAFF'}]}>
                Today
              </Text>
              <Text style={[tw`font-normal`, {color: '#DEEAFF', fontSize: 15}]}>
                {formattedDate}
              </Text>
            </View>

            <View style={tw`items-end z-10`}>
              <Image
                source={require('../../assets/images/rony.png')}
                style={[
                  tw`rounded-full mb-2 border-2 border-white`,
                  {width: 36, height: 36},
                ]}
                resizeMode="cover"
              />
              <Text
                style={[
                  tw`text-base font-medium bottom-2`,
                  {color: '#DEEAFF'},
                ]}>
                Mr Rony
              </Text>
              <Text
                style={[
                  tw`text-xs font-light text-white bottom-2`,
                  {letterSpacing: 1},
                ]}>
                mrony@gmail.com
              </Text>
            </View>
          </View>

          <View style={tw`flex-row items-center space-x-2`}>
            <Image
              source={require('../../assets/images/vector.png')}
              style={[tw``, {width: 20, height: 22, color: '#DEEAFF'}]}
              resizeMode="contain"
            />
            <Text
              style={[
                tw` font-light left-2`,
                {color: '#DEEAFF', letterSpacing: 0.7,fontSize:10},
              ]}>
              Time is the most valuable thing a man can spend.
            </Text>
          </View>
        </View>
      </ImageBackground>

      {/* Scrollable Content */}
      <View style={tw`flex-1`}>
        {loading ? (
          <Text style={tw`text-center text-gray-500`}>Loading tasks...</Text>
        ) : (
          <ScrollView
            contentContainerStyle={tw`pb-28 mx-4 top-4`} // pb-20 adds padding for bottom navigation
            style={tw`mt-4`}>
            {tasks.length === 0 ? (
              <Text style={tw`text-center text-gray-500`}>
                No tasks for today. Enjoy your day!
              </Text>
            ) : (
              tasks.map((task: any) => (
                <View
                  key={task.id}
                  style={[
                    tw`p-2 mb-2 rounded-lg`,
                    {backgroundColor: task.completed ? '#E6F4E7' : '#f3f3f3'},
                  ]}>
                  <View style={tw`flex-row items-center justify-between`}>
                    <TouchableOpacity onPress={() => toggleComplete(task.id)}>
                      {task.completed ? (
                        <Image
                          source={require('../../assets/images/check.png')}
                          style={{width: 24, height: 24, tintColor: '#3580FF'}}
                          resizeMode="contain"
                        />
                      ) : (
                        <Image
                          source={require('../../assets/images/Circle.png')}
                          style={{width: 24, height: 24, tintColor: 'gray'}}
                          resizeMode="contain"
                        />
                      )}
                    </TouchableOpacity>

                    <View style={tw`flex-row items-center flex-1 mx-3`}>
                      {task.icon && (
                        <Image
                          source={task.icon}
                          style={[tw`mr-2`, {width: 30, height: 30}]}
                        />
                      )}

                      <Text style={tw`text-sm font-medium flex-1 left-2`}>
                        {task.name.slice(0, 15) +
                          (task.name.length > 15 ? '...' : '')}
                      </Text>

                      {task.dailyTarget && (
                        <View style={[tw`flex-row items-center right-4`]}>
                          {!task.completed ? (
                            // শো করবে যখন টাস্ক কমপ্লিট নয়
                            <View style={tw`flex-row items-center rounded-lg`}>
                              <TouchableOpacity
                                onPress={() => decrementProgress(task.id)}
                                style={tw`right-1`}>
                                <Text style={tw`text-gray-700 text-base`}>
                                  -
                                </Text>
                              </TouchableOpacity>

                              <TextInput
                                style={[
                                  tw`px-1 py-1 border rounded text-center`,
                                  {
                                    borderColor: '#E3E8F1',
                                    width: 32,
                                    height: 23,
                                    fontSize: 12,
                                  },
                                ]}
                                value={String(task.currentProgress)}
                                onChangeText={text =>
                                  handleProgressInputChange(task.id, text)
                                }
                                keyboardType="numeric"
                                onBlur={() => handleProgressBlur(task.id)}
                                maxLength={3}
                              />

                              <TouchableOpacity
                                onPress={() => incrementProgress(task.id)}
                                style={tw`left-1`}>
                                <Text style={tw`text-gray-700 text-sm`}>+</Text>
                              </TouchableOpacity>
                              <Text
                                style={[
                                  tw`text-gray-400 font-medium left-2`,
                                  {fontSize: 10},
                                ]}>
                                /{task.dailyTarget}
                                {task.targetType
                                  ? task.targetType.charAt(0).toLowerCase()
                                  : ''}
                              </Text>
                            </View>
                          ) : (
                            // শো করবে যখন টাস্ক কমপ্লিট
                            <Text
                              style={[
                                tw`text-gray-700 font-medium left-2`,
                                {fontSize: 12},
                              ]}>
                              {task.currentProgress}/<Text  style={[
                                tw`text-gray-500 font-medium `,
                                {fontSize: 10},
                              ]}>{task.dailyTarget}
                              {task.targetType
                                ? task.targetType.charAt(0).toLowerCase()
                                : ''}</Text>
                            </Text>
                          )}
                        </View>
                      )}
                    </View>

                    <TouchableOpacity onPress={() => toggleStar(task.id)}>
                      <View style={tw`right-2`}>
                        <Icon
                          name={task.isStarred ? 'star' : 'star-outline'}
                          size={24}
                          color={task.isStarred ? '#3580FF' : '#8D99AE'}
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </ScrollView>
        )}
      </View>
      <Modal
        visible={showModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}>
        <SafeAreaView
          style={tw`flex-1 bg-blue-500 items-center justify-center`}>
          {/* Back Button */}
          <TouchableOpacity
            style={tw`absolute top-4 left-4`}
            onPress={() => setShowModal(false)}>
            <Icon name="chevron-back" size={24} color="white" />
          </TouchableOpacity>

          {/* Badge and Glow */}
          <View style={tw`items-center justify-center mb-8`}>
            <View
              style={tw`w-32 h-32 rounded-full bg-yellow-400 items-center justify-center shadow-lg`}>
              <Text style={tw`text-3xl font-bold text-white`}>10</Text>
            </View>
          </View>

          {/* Congrats Text */}
          <Text style={tw`text-white text-2xl font-bold mb-2`}>Congrats!</Text>
          <Text style={tw`text-white text-base mb-4`}>
            All the Daily Task Done!
          </Text>

          {/* Description */}
          <Text style={tw`text-center text-white text-xs px-8 mb-10`}>
            You deserve this badge for your commitment to yourself. Stay with us
            and earn more Points to get rewards.
          </Text>

          {/* Claim Button */}
          <TouchableOpacity
            onPress={() => {
              addPoints(10);
              setShowModal(false);
            }}
            style={tw`bg-white rounded-full px-8 py-3`}>
            <Text style={tw`text-blue-500 font-semibold`}>Claim</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>

      {/* Fixed Bottom Navigation */}
      <View style={tw`absolute bottom-0 w-full`}>
        {!isKeyboardVisible && <BottomNavigation />}
      </View>
    </SafeAreaView>
  );
};

export default TodaysTaskToDoScreen;
