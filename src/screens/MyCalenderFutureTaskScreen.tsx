import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Pressable,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {s as tw} from 'react-native-wind';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomNavigation from './BottomNavigation';

const MyCalenderFutureTaskScreen = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [allTasks, setAllTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear(),
  );
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth(),
  );
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

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
    if (selectedDate !== null) {
      const filtered = allTasks.filter((task: any) => {
        const taskDate = new Date(task.startDate); // Replace with your date field
        return (
          taskDate.getFullYear() === selectedYear &&
          taskDate.getMonth() === selectedMonth &&
          taskDate.getDate() === selectedDate
        );
      });
      setTasks(filtered);
    } else {
      setTasks(allTasks);
    }
  }, [selectedDate, selectedMonth, selectedYear, allTasks]);

  const handleDelete = async (id: string) => {
    Alert.alert('Delete Task', 'Are you sure you want to delete this task?', [
      {text: 'Cancel', style: 'cancel'},
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

  return (
    <View style={tw`flex-1 bg-white p-4`}>
      <Text style={tw`text-2xl font-semibold mb-2`}>All Tasks</Text>

      {/* Dropdowns */}
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

      {/* Calendar Dates */}
      <View style={tw`flex-row flex-wrap mb-4`}>
        {[...Array(getDaysInMonth(selectedYear, selectedMonth)).keys()].map(
          day => {
            const dateNum = day + 1;
            const isSelected = selectedDate === dateNum;
            return (
              <Pressable
                key={dateNum}
                onPress={() =>
                  setSelectedDate(prev =>
                    prev === dateNum ? null : dateNum,
                  )
                }
                style={tw`w-[12.5%] h-10 justify-center items-center m-1 rounded-full ${
                  isSelected ? 'bg-blue-500' : 'bg-gray-200'
                }`}>
                <Text style={tw`${isSelected ? 'text-white' : 'text-black'}`}>
                  {dateNum}
                </Text>
              </Pressable>
            );
          },
        )}
      </View>

      {/* Task List */}
      {loading ? (
        <Text style={tw`text-center text-gray-500`}>Loading tasks...</Text>
      ) : tasks.length === 0 ? (
        <Text style={tw`text-center text-gray-500`}>
          No tasks available for this date.
        </Text>
      ) : (
        <ScrollView contentContainerStyle={tw`pb-10`}>
          {tasks.map((task: any) => (
            <View key={task.id} style={tw`bg-gray-100 p-4 mb-4 rounded-lg`}>
              <Text style={tw`text-lg font-bold mb-1`}>
                Task ID: {task.id}
              </Text>

              {(!task.scheduleType || task.scheduleType === '') &&
                !task.endDate &&
                (!task.selectedDays || task.selectedDays.length === 0) &&
                (!task.selectedDate || task.selectedDate.length === 0) &&
                (!task.selectedDates || task.selectedDates.length === 0) &&
                (!task.selectedMonths || task.selectedMonths.length === 0) && (
                  <Text style={tw`text-sm text-green-700 mb-1`}>
                    🔁 This task is part of your Daily Routine
                  </Text>
                )}

              <Text style={tw`text-sm text-gray-600 mb-1`}>
                Set Daily Target: {task.dailyTarget || 'N/A'}
              </Text>

              {task.specificFor && task.specificForValue ? (
                <Text style={tw`text-sm text-gray-600 mb-1`}>
                  Add Specific For: {task.specificForValue} {task.specificFor}
                </Text>
              ) : (
                <Text style={tw`text-sm text-gray-600 mb-1`}>
                  Add Specific For: N/A
                </Text>
              )}

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

              {task.selectedDates &&
                task.selectedDates.length > 0 &&
                task.selectedMonths &&
                task.selectedMonths.length > 0 && (
                  <Text style={tw`text-sm text-gray-600 mb-1`}>
                    Selected Dates: {task.selectedDates.join(', ')},{' '}
                    {task.selectedMonths.join(', ')}
                  </Text>
                )}

              <TouchableOpacity
                onPress={() => handleDelete(task.id)}
                style={tw`bg-red-500 mt-3 py-2 rounded-lg`}>
                <Text style={tw`text-white text-center font-semibold`}>
                  Delete
                </Text>
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
