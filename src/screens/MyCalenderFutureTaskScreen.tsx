import React, {useEffect, useState} from 'react';
import {View, Text, ScrollView, Image} from 'react-native';
import {s as tw} from 'react-native-wind';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CalendarPicker from 'react-native-calendar-picker';
import BottomNavigation from './BottomNavigation';
import Icon from 'react-native-vector-icons/Ionicons'; // <- Icon import

const MyCalenderFutureTaskScreen = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Task filtering helper
  const isTaskVisible = (task: any, currentDate: Date): boolean => {
    currentDate.setHours(0, 0, 0, 0);

    // Everyday task
    if (
      !task.scheduleType &&
      !task.endDate &&
      !task.selectedDays?.length &&
      !task.selectedDate?.length &&
      !task.selectedMonths?.length
    ) {
      return true;
    }

    // Add Specific For
    if (task.endDate && task.startDate) {
      const start = new Date(task.startDate);
      const end = new Date(task.endDate);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      return currentDate >= start && currentDate <= end;
    }

    // Weekly
    if (task.selectedDays?.length > 0) {
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const currentDay = dayNames[currentDate.getDay()];
      return task.selectedDays.includes(currentDay);
    }

    // Monthly
    if (task.selectedDate?.length > 0) {
      const dayOfMonth = currentDate.getDate();
      return task.selectedDate.includes(dayOfMonth);
    }

    // Yearly
    if (task.selectedDates?.length > 0 && task.selectedMonths?.length > 0) {
      const day = currentDate.getDate();
      const month = currentDate.toLocaleString('en', {month: 'long'});
      return task.selectedDates.some(
        (selectedDate: number, index: number) =>
          selectedDate === day && task.selectedMonths[index] === month,
      );
    }

    return false;
  };

  // Load tasks and filter them by selected date
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

  return (
    <View style={[tw`flex-1`, {backgroundColor: '#F7FAFF'}]}>
      {/* Header */}
      <View style={tw`mb-8 top-2 left-4`}>
        <Text style={tw`text-xl font-bold`}>My Calendar</Text>
        <Text style={[tw``, {fontSize: 11, color: '#8D99AE'}]}>
          Your added tasks on the selected calendar day.
        </Text>
      </View>

      {/* Calendar */}
      <View
        style={[
          tw`bg-white mb-2 mx-4 rounded-lg`,
          {paddingVertical: 10, alignItems: 'center'},
        ]}>
        <CalendarPicker
          onDateChange={(date: Date) => setSelectedDate(date)}
          selectedStartDate={selectedDate}
          allowRangeSelection={false}
          selectedDayColor="#3580FF"
          selectedDayTextColor="#fff"
          scaleFactor={375}
          weekdays={['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']}
          width={300}
          textStyle={{
            fontFamily: 'Sora',
            fontWeight: 600,
            fontSize: 15,
            color: '#2B2D42',
          }}
          // Corrected prop name below
          dayLabelsWrapper={{
            borderTopWidth: 0, // Remove top border
            borderBottomWidth: 0, // Remove bottom border
          }}
        />
      </View>

      {/* Task List */}
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
                style={[tw`bg-white mx-4 mb-2 rounded-lg relative`]}>
                <View style={tw`flex-row items-center p-2`}>
                  {task.icon ? (
                    <Image
                      source={task.icon}
                      style={[tw`left-2`, {width: 30, height: 30}]}
                    />
                  ) : (
                    <Icon
                      name="checkmark-circle-outline"
                      size={24}
                      color="#3580FF"
                      style={tw`left-2`}
                    />
                  )}
                  <Text
                    style={[
                      tw`text-sm font-medium left-6`,
                      {color: '#2B2D42'},
                    ]}>
                    {task.name}
                  </Text>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}

      {/* Bottom Nav */}
      <BottomNavigation />
    </View>
  );
};

export default MyCalenderFutureTaskScreen;
