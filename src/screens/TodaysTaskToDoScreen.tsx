import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
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
  dailyTarget?: string;
  specificFor?: string;
  specificForValue?: string;

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
          weekday: 'long',
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

  // প্রথম লোডে এবং তারিখ পরিবর্তনে ফিল্টার প্রয়োগ
  useEffect(() => {
    const fetchAndFilterTasks = async () => {
      try {
        const storedTasks = await AsyncStorage.getItem('tasks');
        const taskList = storedTasks ? JSON.parse(storedTasks) : [];
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
  // Delete task handler
  const handleDelete = async (id: string) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const storedTasks = await AsyncStorage.getItem('tasks');
              const taskList = storedTasks ? JSON.parse(storedTasks) : [];
              const updatedList = taskList.filter(
                (task: any) => task.id !== id,
              );
              await AsyncStorage.setItem('tasks', JSON.stringify(updatedList));
              setTasks(updatedList);
            } catch (error) {
              console.error('Error deleting task:', error);
            }
          },
        },
      ],
      {cancelable: true},
    );
  };

  return (
    <View style={tw`flex-1 bg-white p-4`}>
      <Text style={tw`text-2xl font-semibold mb-4`}>Today's Tasks</Text>

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
              <View key={task.id} style={tw`bg-gray-100 p-4 mb-4 rounded-lg`}>
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

                  <TouchableOpacity onPress={() => toggleStar(task.id)}>
                    <Icon
                      name={task.isStarred ? 'star' : 'star-outline'}
                      size={24}
                      color={task.isStarred ? 'gold' : 'gray'}
                    />
                  </TouchableOpacity>
                </View>

                <View style={tw`mt-2`}>
                  {task.icon && (
                    <Image source={task.icon} style={tw`w-10 h-10 mb-2`} />
                  )}
                  <Text style={tw`text-lg font-bold`}>{task.name}</Text>

                  {(!task.scheduleType || task.scheduleType === '') &&
                    !task.endDate &&
                    (!task.selectedDays || task.selectedDays.length === 0) &&
                    (!task.selectedDate || task.selectedDate.length === 0) &&
                    (!task.selectedDates || task.selectedDates.length === 0) &&
                    (!task.selectedMonths ||
                      task.selectedMonths.length === 0) && (
                      <Text style={tw`text-sm text-green-700 mb-1`}>
                        🔁 This task is part of your Daily Routine
                      </Text>
                    )}

                  <Text style={tw`text-sm text-gray-600 mb-1`}>
                    Set Daily Target: {task.dailyTarget || 'N/A'}
                  </Text>

                  {/* Add Specific For */}
                  {task.specificFor && task.specificForValue ? (
                    <Text style={tw`text-sm text-gray-600 mb-1`}>
                      Add Specific For: {task.specificForValue}{' '}
                      {task.specificFor}
                    </Text>
                  ) : (
                    <Text style={tw`text-sm text-gray-600 mb-1`}>
                      Add Specific For: N/A
                    </Text>
                  )}

                  {/* Add Specific Day On (Weekly) */}
                  {task.selectedDays?.length > 0 && (
                    <Text style={tw`text-sm text-gray-600 mb-1`}>
                      Add Specific Day On (Weekly):{' '}
                      {task.selectedDays.join(', ')} {task.selectedDate}
                    </Text>
                  )}

                  {/* Add Specific Day On (Monthly) */}
                  {task.selectedDate?.length > 0 && (
                    <Text style={tw`text-sm text-gray-600 mb-1`}>
                      Add Specific Day On (Monthly):{' '}
                      {task.selectedDate.join(', ')}
                    </Text>
                  )}

                  {/* Add Specific Day On (Yearly) */}
                  {task.selectedDates &&
                    task.selectedDates.length > 0 &&
                    task.selectedMonths &&
                    task.selectedMonths.length > 0 && (
                      <Text style={tw`text-sm text-gray-600 mb-1`}>
                        Selected Dates: {task.selectedDates.join(', ')},{' '}
                        {task.selectedMonths.join(', ')}
                      </Text>
                    )}
                </View>

                <TouchableOpacity
                  onPress={() => handleDelete(task.id)}
                  style={tw`bg-red-500 mt-3 py-2 rounded-lg`}>
                  <Text style={tw`text-white text-center font-semibold`}>
                    Delete Task
                  </Text>
                </TouchableOpacity>
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
