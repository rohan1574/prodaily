import React, {useEffect, useState} from 'react';
import {View, Text, ScrollView, TouchableOpacity, Image} from 'react-native';
import {s as tw} from 'react-native-wind';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomNavigation from './BottomNavigation';
import Icon from 'react-native-vector-icons/Ionicons';
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
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
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
    <View style={tw`flex-1 bg-gray-200`}>
      {/* Header */}
      <View style={tw`bg-blue-500 p-4 flex-row justify-between items-center`}>
        <View>
          <Text style={tw`text-white text-lg font-bold`}>Today</Text>
          <Text style={tw`text-white text-sm`}>March 12, Friday</Text>
          <Text style={tw`text-2xl font-semibold my-4`}>
            {selectedDate.toDateString()}
          </Text>
        </View>
        <View style={tw`flex-row items-center`}>
          <Image
            source={require('../../assets/images/sun.png')}
            style={tw`w-10 h-10 rounded-full mr-3`}
          />
          <View>
            <Text style={tw`text-white text-lg font-bold`}>Mr Rony</Text>
            <Text style={tw`text-white text-sm`}>mrrony1574@gmail.com</Text>
          </View>
        </View>
      </View>

      {loading ? (
        <Text style={tw`text-center text-gray-500`}>Loading tasks...</Text>
      ) : (
        <ScrollView contentContainerStyle={tw`pb-10`}>
          {tasks.length === 0 ? (
            <Text style={tw`text-center text-gray-500`}>
              No tasks for today. Enjoy your day!
            </Text>
          ) : (
            tasks.map((task: any) => (
              <View
                key={task.id}
                style={tw`p-4 mb-4 rounded-lg ${
                  task.completed ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                <View style={tw`flex-row items-center justify-between`}>
                  <TouchableOpacity onPress={() => toggleComplete(task.id)}>
                    <Icon
                      name={
                        task.completed ? 'checkmark-circle' : 'ellipse-outline'
                      }
                      size={24}
                      color={task.completed ? 'green' : 'gray'}
                    />
                  </TouchableOpacity>
                  {task.icon && (
                    <Image source={task.icon} style={tw`w-6 h-8 right-12`} />
                  )}
                  <Text style={tw`text-lg font-bold right-24,${task.completed ? 'line-through text-green-200' : 'text-gray-800'}`}>
                    {task.name}
                  </Text>

                  <TouchableOpacity onPress={() => toggleStar(task.id)}>
                    <Icon
                      name={task.isStarred ? 'star' : 'star-outline'}
                      size={24}
                      color={task.isStarred ? 'gold' : 'gray'}
                    />
                  </TouchableOpacity>
                </View>
                {task.dailyTarget && (
                  <View style={tw`flex-row items-center mt-2`}>
                    <Text style={tw`mr-2 font-semibold`}>
                      {task.dailyTarget}
                    </Text>
                    <View
                      style={tw`flex-row items-center border border-gray-400 rounded-lg`}>
                      <TouchableOpacity
                        onPress={() => decrementProgress(task.id)}
                        style={tw`px-3 py-1 bg-gray-100 rounded-l-lg`}>
                        <Text style={tw`text-gray-700`}>-</Text>
                      </TouchableOpacity>
                      <Text style={tw`px-3 py-1 bg-white`}>
                        {task.currentProgress}
                      </Text>
                      <TouchableOpacity
                        onPress={() => incrementProgress(task.id)}
                        disabled={task.currentProgress >= task.dailyTarget}
                        style={tw`px-3 py-1 bg-gray-100 rounded-r-lg ${
                          task.currentProgress >= task.dailyTarget
                            ? 'opacity-50'
                            : ''
                        }`}>
                        <Text style={tw`text-gray-700`}>+</Text>
                      </TouchableOpacity>
                    </View>
                    <Text style={tw`ml-2 text-gray-600`}>
                      {task.targetType}
                    </Text>
                  </View>
                )}
              </View>
            ))
          )}
        </ScrollView>
      )}

      <BottomNavigation />
    </View>
  );
};

export default TodaysTaskToDoScreen;
