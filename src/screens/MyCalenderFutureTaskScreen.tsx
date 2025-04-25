import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  Image,
} from 'react-native';
import {s as tw} from 'react-native-wind';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CalendarPicker from 'react-native-calendar-picker';
import BottomNavigation from './BottomNavigation';
import Icon from 'react-native-vector-icons/Ionicons';

const MyCalenderFutureTaskScreen = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const toggleStar = async (taskId: string) => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      const taskList = storedTasks ? JSON.parse(storedTasks) : [];

      const updatedList = taskList.map((task: any) => {
        if (task.id === taskId) {
          return {...task, isStarred: !task.isStarred};
        }
        return task;
      });

      await AsyncStorage.setItem('tasks', JSON.stringify(updatedList));
      setTasks(updatedList); // Update UI
    } catch (error) {
      console.error('Error toggling star:', error);
    }
  };
  // টাস্ক ফিল্টারিং হেল্পার ফাংশন
  const isTaskVisible = (task: any, currentDate: Date): boolean => {
    currentDate.setHours(0, 0, 0, 0);

    // ডেইলি রুটিন টাস্ক
    if (
      !task.scheduleType &&
      !task.endDate &&
      !task.selectedDays?.length &&
      !task.selectedDate?.length &&
      !task.selectedMonths?.length
    ) {
      return true;
    }

    // Specific For (2 days/weeks/months)
    if (task.endDate && task.startDate) {
      const start = new Date(task.startDate);
      const end = new Date(task.endDate);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      return currentDate >= start && currentDate <= end;
    }

    // Weekly (Thu, Fri)
    if (task.selectedDays?.length > 0) {
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const currentDay = dayNames[currentDate.getDay()];
      return task.selectedDays.includes(currentDay);
    }

    // Monthly (2,15,20)
    if (task.selectedDate?.length > 0) {
      const dayOfMonth = currentDate.getDate();
      return task.selectedDate.includes(dayOfMonth);
    }

    // Yearly (25 April)
    if (task.selectedDates?.length > 0 && task.selectedMonths?.length > 0) {
      const day = currentDate.getDate();
      const month = currentDate.toLocaleString('en', {month: 'short'});
      return (
        task.selectedDates.includes(day) && task.selectedMonths.includes(month)
      );
    }

    return false;
  };

  // টাস্ক ফিল্টারিং ইফেক্ট
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const storedTasks = await AsyncStorage.getItem('tasks');
        const taskList = storedTasks ? JSON.parse(storedTasks) : [];

        const filtered = taskList.filter((task: any) =>
          isTaskVisible(task, new Date(selectedDate)),
        );

        setTasks(filtered);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [selectedDate]);

  // বাকি ফাংশন (toggleStar, handleDelete, openUpdateModal, handleUpdateTask)

  return (
    <View style={tw`flex-1 bg-white p-4`}>
      {/* ক্যালেন্ডার সেকশন */}
      <CalendarPicker
        onDateChange={(date: Date) => setSelectedDate(date)}
        selectedStartDate={selectedDate}
        allowRangeSelection={false}
        selectedDayColor="#3f51b5"
        selectedDayTextColor="#fff"
        scaleFactor={375}
        textStyle={{fontFamily: 'Roboto'}}
      />

      <Text style={tw`text-2xl font-semibold my-4`}>
        Tasks for {selectedDate.toDateString()}
      </Text>

      {loading ? (
        <Text style={tw`text-center text-gray-500`}>Loading tasks...</Text>
      ) : (
        <ScrollView contentContainerStyle={tw`pb-10`}>
          {tasks.length === 0 ? (
            <Text style={tw`text-center text-gray-500`}>
              No tasks for this date
            </Text>
          ) : (
            tasks.map((task: any) => (
              <View
                key={task.id}
                style={tw`bg-gray-100 p-4 mb-4 rounded-lg relative`}>
                {/* টাস্ক নাম ও স্টার আইকন */}
                {task.icon && (
                  <View style={tw`flex-row items-center gap-2 mb-2`}>
                    <Image source={task.icon} style={tw`w-8 h-8`} />
                    <Text style={tw`text-lg font-bold`}>{task.name}</Text>
                  </View>
                )}

                {!task.icon && (
                  <Text style={tw`text-lg font-bold mb-2`}>{task.name}</Text>
                )}

                <TouchableOpacity
                  onPress={() => toggleStar(task.id)}
                  style={tw`absolute top-3 right-3`}>
                  <Icon
                    name={task.isStarred ? 'star' : 'star-outline'}
                    size={24}
                    color={task.isStarred ? 'gold' : 'gray'}
                  />
                </TouchableOpacity>

                {/* ডেইলি রুটিন ট্যাগ */}
                {!task.scheduleType &&
                  !task.endDate &&
                  !task.selectedDays?.length &&
                  !task.selectedDate?.length &&
                  !task.selectedDates?.length &&
                  !task.selectedMonths?.length && (
                    <Text style={tw`text-sm text-green-700 mb-1`}>
                      🔁 This task is part of your Daily Routine
                    </Text>
                  )}

                {/* ডেইলি টার্গেট (শুধু ভ্যালু থাকলে) */}
                {task.dailyTarget && (
                  <Text style={tw`text-sm text-gray-600 mb-1`}>
                    Set Daily Target:{' '}
                    {task.dailyTarget
                      ? `${task.dailyTarget} ${task.targetType}`
                      : 'N/A'}
                  </Text>
                )}

                {/* স্পেসিফিক ফর (শুধু ভ্যালু থাকলে) */}
                {task.specificFor && task.specificForValue && (
                  <Text style={tw`text-sm text-gray-600 mb-1`}>
                    Specific For: {task.specificForValue} {task.specificFor}
                  </Text>
                )}

                {/* সাপ্তাহিক দিন (শুধু ভ্যালু থাকলে) */}
                {task.selectedDays?.length > 0 && (
                  <Text style={tw`text-sm text-gray-600 mb-1`}>
                    Weekly: {task.selectedDays.join(', ')}
                  </Text>
                )}

                {/* মাসিক তারিখ (শুধু ভ্যালু থাকলে) */}
                {task.selectedDate?.length > 0 && (
                  <Text style={tw`text-sm text-gray-600 mb-1`}>
                    Monthly: {task.selectedDate.join(', ')}
                  </Text>
                )}

                {/* বার্ষিক তারিখ (শুধু ভ্যালু থাকলে) */}
                {task.selectedDates?.length > 0 &&
                  task.selectedMonths?.length > 0 && (
                    <Text style={tw`text-sm text-gray-600 mb-1`}>
                      Yearly: {task.selectedDates.join(', ')} -{' '}
                      {task.selectedMonths.join(', ')}
                    </Text>
                  )}

                {/* সময়সীমা (শুধু endDate থাকলে) */}
                {task.endDate && (
                  <Text style={tw`text-sm text-purple-600 mt-2`}>
                    Valid until: {new Date(task.endDate).toLocaleDateString()}
                  </Text>
                )}
              </View>
            ))
          )}
        </ScrollView>
      )}

      {/* মডাল এবং বাকি কম্পোনেন্ট */}

      <BottomNavigation />
    </View>
  );
};

export default MyCalenderFutureTaskScreen;
