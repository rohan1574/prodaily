import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Pressable,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { s as tw } from 'react-native-wind';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomNavigation from './BottomNavigation';

const MyCalenderFutureTaskScreen = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [allTasks, setAllTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const fetchTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      const taskList = storedTasks ? JSON.parse(storedTasks) : [];
      setAllTasks(taskList);
      setTasks(taskList);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    const filteredTasks = allTasks.filter(task => {
      const selected = new Date(selectedYear, selectedMonth, selectedDate || 1);
      const startDate = new Date(task.startDate);
      const endDate = task.endDate ? new Date(task.endDate) : null;

      if (selectedDate === null) return true;

      const selectedD = selected.getDate();
      const selectedDayOfWeek = selected.getDay();
      const selectedM = selected.getMonth();
      const selectedY = selected.getFullYear();

      const isInRange = !endDate || (selected >= startDate && selected <= endDate);
      const scheduleType = task.scheduleType;

      if (!scheduleType || scheduleType === 'Everyday') {
        return selected >= startDate && isInRange;
      }

      if (scheduleType === 'Add Specific For') {
        const unit = task.specificFor;
        const value = parseInt(task.specificForValue, 10);
        if (!unit || !value) return false;

        let end = new Date(startDate);
        if (unit === 'days') end.setDate(startDate.getDate() + value);
        if (unit === 'weeks') end.setDate(startDate.getDate() + value * 7);
        if (unit === 'months') end.setMonth(startDate.getMonth() + value);
        return selected >= startDate && selected <= end;
      }

      if (scheduleType === 'Add Specific Day On') {
        const frequency = task.repetition;

        if (frequency === 'weekly') {
          const oneWeekEnd = new Date(startDate);
          oneWeekEnd.setDate(startDate.getDate() + 6);
          return (
            selected >= startDate &&
            selected <= oneWeekEnd &&
            task.selectedDays?.includes(weekDays[selectedDayOfWeek])
          );
        }

        if (frequency === 'monthly') {
          return (
            selected.getFullYear() === startDate.getFullYear() &&
            selected.getMonth() === startDate.getMonth() &&
            selected >= startDate &&
            task.selectedDate?.includes(selectedD)
          );
        }

        if (frequency === 'yearly') {
          return (
            selected.getFullYear() === startDate.getFullYear() &&
            selected >= startDate &&
            task.selectedDates?.includes(selectedD) &&
            task.selectedMonths?.includes(monthNames[selectedM])
          );
        }
      }

      return false;
    });

    setTasks(filteredTasks);
  }, [selectedDate, selectedMonth, selectedYear, allTasks]);

  const hasTaskOnDate = (day: number) => {
    const dateToCheck = new Date(selectedYear, selectedMonth, day);
    return allTasks.some(task => {
      const startDate = new Date(task.startDate);
      const endDate = task.endDate ? new Date(task.endDate) : null;
      const isInRange = !endDate || (dateToCheck >= startDate && dateToCheck <= endDate);
      const scheduleType = task.scheduleType;
      const dayOfWeek = dateToCheck.getDay();
      const dateNum = dateToCheck.getDate();
      const monthName = monthNames[dateToCheck.getMonth()];

      if (!scheduleType || scheduleType === 'Everyday') {
        return dateToCheck >= startDate && isInRange;
      }

      if (scheduleType === 'Add Specific For') {
        const unit = task.specificFor;
        const value = parseInt(task.specificForValue, 10);
        if (!unit || !value) return false;

        let taskEnd = new Date(startDate);
        if (unit === 'days') taskEnd.setDate(startDate.getDate() + value);
        if (unit === 'weeks') taskEnd.setDate(startDate.getDate() + value * 7);
        if (unit === 'months') taskEnd.setMonth(startDate.getMonth() + value);

        return dateToCheck >= startDate && dateToCheck <= taskEnd;
      }

      if (scheduleType === 'Add Specific Day On') {
        const repetition = task.repetition;

        if (repetition === 'weekly') {
          const weekEnd = new Date(startDate);
          weekEnd.setDate(startDate.getDate() + 6);
          return (
            dateToCheck >= startDate &&
            dateToCheck <= weekEnd &&
            task.selectedDays?.includes(weekDays[dayOfWeek])
          );
        }

        if (repetition === 'monthly') {
          return (
            dateToCheck >= startDate &&
            task.selectedDate?.includes(dateNum)
          );
        }

        if (repetition === 'yearly') {
          return (
            dateToCheck >= startDate &&
            task.selectedDates?.includes(dateNum) &&
            task.selectedMonths?.includes(monthName)
          );
        }
      }

      return false;
    });
  };

  const handleDelete = async (id: string) => {
    Alert.alert('Delete Task', 'Are you sure you want to delete this task?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const updatedList = allTasks.filter((task: any) => task.id !== id);
            await AsyncStorage.setItem('tasks', JSON.stringify(updatedList));
            setAllTasks(updatedList);
            setTasks(selectedDate !== null ? tasks.filter(task => task.id !== id) : updatedList);
          } catch (error) {
            console.error('Error deleting task:', error);
          }
        },
      },
    ]);
  };

  const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay();

  return (
    <View style={tw`flex-1 bg-white p-4`}>
      <Text style={tw`text-2xl font-semibold mb-2`}>All Tasks</Text>

      <View style={tw`flex-row mb-4 justify-between`}>
        <View style={tw`flex-1 mr-2`}>
          <Picker
            selectedValue={selectedYear}
            onValueChange={value => {
              setSelectedYear(value);
              setSelectedDate(null);
            }}>
            {[2024, 2025, 2026].map(year => (
              <Picker.Item key={year} label={year.toString()} value={year} />
            ))}
          </Picker>
        </View>
        <View style={tw`flex-1`}>
          <Picker
            selectedValue={selectedMonth}
            onValueChange={value => {
              setSelectedMonth(value);
              setSelectedDate(null);
            }}>
            {monthNames.map((month, index) => (
              <Picker.Item key={index} label={month} value={index} />
            ))}
          </Picker>
        </View>
      </View>

      <View style={tw`flex-row mb-4 justify-between`}>
        {weekDays.map((day, index) => (
          <View key={index} style={[tw``, { width: 48 }]}>
            <Text style={tw`text-center font-semibold text-sm`}>{day}</Text>
          </View>
        ))}
      </View>

      <View style={tw`flex-row flex-wrap`}>
        {[...Array(getDaysInMonth(selectedYear, selectedMonth)).keys()].map(day => {
          const dateNum = day + 1;
          const isSelected = selectedDate === dateNum;
          return (
            <Pressable
              key={dateNum}
              onPress={() => setSelectedDate(prev => (prev === dateNum ? null : dateNum))}
              style={[
                tw`h-12 mr-2 mb-2 justify-center items-center rounded-full ${isSelected ? 'bg-blue-500' : 'bg-gray-200'}`,
                { width: 44 },
                day === 0 ? { marginLeft: firstDayOfMonth * 48 } : {},
              ]}
            >
              <Text style={tw`${isSelected ? 'text-white' : 'text-black'}`}>
                {dateNum}
              </Text>
              {hasTaskOnDate(dateNum) && (
                <View style={tw`w-2 h-2 rounded-full bg-green-500 mt-1`} />
              )}
            </Pressable>
          );
        })}
      </View>

      {loading ? (
        <Text style={tw`text-center text-gray-500`}>Loading tasks...</Text>
      ) : tasks.length === 0 ? (
        <Text style={tw`text-center text-gray-500`}>No tasks available for this date.</Text>
      ) : (
        <ScrollView contentContainerStyle={tw`pb-10`}>
          {tasks.map((task: any) => (
            <View key={task.id} style={tw`bg-gray-100 p-4 mb-4 rounded-lg`}>
              <Text style={tw`text-lg font-bold mb-1`}>Task ID: {task.id}</Text>

              <Text style={tw`text-sm text-gray-600 mb-1`}>
                Set Daily Target: {task.dailyTarget || 'N/A'}
              </Text>

              {task.specificFor && task.specificForValue ? (
                <Text style={tw`text-sm text-gray-600 mb-1`}>
                  Add Specific For: {task.specificForValue} {task.specificFor}
                </Text>
              ) : null}

              {task.selectedDays?.length > 0 && (
                <Text style={tw`text-sm text-gray-600 mb-1`}>
                  Add Specific Day On (Weekly): {task.selectedDays.join(', ')}
                </Text>
              )}

              {task.selectedDate?.length > 0 && (
                <Text style={tw`text-sm text-gray-600 mb-1`}>
                  Add Specific Day On (Monthly): {task.selectedDate.join(', ')}
                </Text>
              )}

              {task.selectedDates?.length > 0 && task.selectedMonths?.length > 0 && (
                <Text style={tw`text-sm text-gray-600 mb-1`}>
                  Selected Dates: {task.selectedDates.join(', ')}, {task.selectedMonths.join(', ')}
                </Text>
              )}

              <TouchableOpacity
                onPress={() => handleDelete(task.id)}
                style={tw`bg-red-500 mt-3 py-2 rounded-lg`}
              >
                <Text style={tw`text-white text-center font-semibold`}>Delete</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}

      <BottomNavigation />
    </View>
  );
};

export default MyCalenderFutureTaskScreen;
