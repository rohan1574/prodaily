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
    <View style={[tw`flex-1 `,{backgroundColor:"#F7FAFF"}]}>
      <View style={tw`mb-4 top-2 left-4 `}>
      <Text style={tw`text-xl font-bold `}>My Calendar</Text>
      <Text style={[tw` `,{fontSize:16,color:"#8D99AE"}]}>Your added tasks on the selected calendar day.</Text>
      </View>
      {/* ক্যালেন্ডার সেকশন */}
    <View style={tw`bg-white mb-2 mx-2 rounded-lg`}>
    <CalendarPicker
        onDateChange={(date: Date) => setSelectedDate(date)}
        selectedStartDate={selectedDate}
        allowRangeSelection={false}
        selectedDayColor="#3f51b5"
        selectedDayTextColor="#fff"
        scaleFactor={375}
        textStyle={{fontFamily: 'Roboto'}}
      
      />
    </View>

      {/* <Text style={tw`text-2xl font-semibold my-4`}>
        {selectedDate.toDateString()}
      </Text> */}

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
                style={[tw`bg-white mx-4 mb-2 rounded-lg relative`,]}>
                {/* টাস্ক নাম ও স্টার আইকন */}
                {task.icon && (
                  <View style={tw`flex-row items-center p-2`}>
                    <Image source={task.icon} style={[tw`left-2`,{width: 32, height: 32}]} />
                    <Text style={[tw`text-base font-medium left-6`,{color:"#2B2D42"}]}>{task.name}</Text>
                  </View>
                )}

                {!task.icon && (
                  <Text style={tw`text-lg font-bold `}>{task.name}</Text>
                )}
              </View>
            ))
          )}
          
        </ScrollView>
        
      )}
    <View style={tw``}>
    <BottomNavigation />
    </View>
    </View>
  );
};

export default MyCalenderFutureTaskScreen;
