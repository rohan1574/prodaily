import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { s as tw } from 'react-native-wind';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack'; // Adjust the path as necessary
import BottomNavigation from './BottomNavigation';
import { Picker } from '@react-native-picker/picker';

type Task = {
  name: string;
  specificFor: string;
  dailyTarget: string;
  selectedDays: string[];
  selectedDates: number[];
  selectedDate: number[];
  selectedMonths: number[];
};
type RootStackParamList = {
  MyCalenderFutureTaskScreen: undefined; // No parameters expected for this screen
  // Add other screen names here if needed
};
type MyCalenderFutureTaskScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'MyCalenderFutureTaskScreen'
>;

const MyCalenderFutureTaskScreen = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedYear, setSelectedYear] = useState(2025);
  const [selectedMonth, setSelectedMonth] = useState('December');
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDate());
  const navigation = useNavigation<MyCalenderFutureTaskScreenNavigationProp>(); // Type the navigation hook

  // Load tasks from AsyncStorage
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const storedTasks = await AsyncStorage.getItem('tasks');
        if (storedTasks) {
          setTasks(JSON.parse(storedTasks));
        }
      } catch (error) {
        console.error('Error loading tasks:', error);
      }
    };

    const unsubscribe = navigation.addListener('focus', loadTasks);
    return unsubscribe;
  }, [navigation]);

  // Save tasks to AsyncStorage
  const saveTasks = async (updatedTasks: Task[]) => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  };

  // Delete task
  const handleDeleteTask = (taskName: string) => {
    Alert.alert(
      'Delete Tasks',
      `Are you sure you want to delete the task: ${taskName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: () => deleteTask(taskName) },
      ],
    );
  };

  const deleteTask = (taskName: string) => {
    const updatedTasks = tasks.filter(task => task.name !== taskName);
    saveTasks(updatedTasks);
  };

  // Calendar
  const years = Array.from({ length: 26 }, (_, i) => 2025 + i);
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
  };

  const daysInMonth = getDaysInMonth(selectedYear, months.indexOf(selectedMonth));

  // Render task item
  const renderItem = ({ item }: { item: Task }) => (
    <View style={tw`flex-row items-center bg-gray-100 p-3 mb-2 rounded-lg`}>
      <View>
        <Text style={tw`text-base font-semibold text-black`}>{item.name}</Text>
        <Text style={tw`text-sm text-gray-600`}>{item.specificFor}</Text>
        <Text style={tw`text-sm text-gray-600`}>{item.dailyTarget}</Text>
        <Text style={tw`text-sm text-gray-600`}>
          Selected Days: {item.selectedDays ? item.selectedDays.join(', ') : 'None'}
        </Text>
        <Text style={tw`text-sm text-gray-600`}>
          Selected Dates: {item.selectedDates ? item.selectedDates.join(', ') : 'None'}
        </Text>
        <Text style={tw`text-sm text-gray-600`}>
          Selected Date: {item.selectedDate ? item.selectedDate.join(', ') : 'None'}
        </Text>
        <Text style={tw`text-sm text-gray-600`}>
          Selected Months: {item.selectedMonths ? item.selectedMonths.map(monthIndex => months[monthIndex - 1]).join(', ') : 'None'}
        </Text>
      </View>
      <View style={tw`flex-row space-x-2`}>
        <TouchableOpacity style={tw`bg-yellow-500 px-4 py-2 rounded-lg`}>
          <Text style={tw`text-white`}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={tw`bg-red-500 px-4 py-2 rounded-lg`}
          onPress={() => handleDeleteTask(item.name)}>
          <Text style={tw`text-white`}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={tw`flex-1 bg-white p-4`}>
      <Text style={tw`text-xl font-bold text-black`}>My Calender</Text>

      {/* Year and Month Dropdowns */}
      <View style={tw`flex-row justify-between mb-4`}>
        <Picker
          selectedValue={selectedYear}
          style={{ width: 150 }}
          onValueChange={itemValue => setSelectedYear(itemValue)}>
          {years.map(year => (
            <Picker.Item key={year} label={year.toString()} value={year} />
          ))}
        </Picker>

        <Picker
          selectedValue={selectedMonth}
          style={{ width: 150 }}
          onValueChange={itemValue => setSelectedMonth(itemValue)}>
          {months.map(month => (
            <Picker.Item key={month} label={month} value={month} />
          ))}
        </Picker>
      </View>

      {/* Weekdays */}
      <View style={tw`flex-row justify-between p-2`}>
        {weekDays.map(day => (
          <Text key={day} style={tw`text-gray-700 font-semibold w-10 text-center`}>
            {day}
          </Text>
        ))}
      </View>

      {/* Calendar Days */}
      <View style={tw`flex-row flex-wrap justify-between mb-4`}>
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => (
          <TouchableOpacity
            key={day}
            style={[tw`w-10 h-10 rounded-full justify-center items-center mb-2 ${selectedDay === day ? 'bg-blue-500' : ''}`]}
            onPress={() => setSelectedDay(day)}>
            <Text style={tw`${selectedDay === day ? 'text-white' : 'text-gray-700'}`}>
              {day}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tasks List */}
      <FlatList
        data={tasks}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />

      <BottomNavigation />
    </View>
  );
};

export default MyCalenderFutureTaskScreen;
