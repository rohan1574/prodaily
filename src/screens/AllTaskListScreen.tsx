// AllTaskListScreen.tsx
import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, TouchableOpacity, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {s as tw} from 'react-native-wind';
import {useNavigation} from '@react-navigation/native';

type Task = {
  name: string;
  specificFor: string;
  dailyTarget: string;
  selectedDays: string[];
  selectedDates: number[];
  selectedDate: number[];
  selectedMonths: number[];
};

const AllTaskListScreen = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const navigation = useNavigation();
  // month convert
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
  ];
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
      'Delete Task',
      `Are you sure you want to delete the task: ${taskName}?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Delete', onPress: () => deleteTask(taskName)},
      ],
    );
  };

  const deleteTask = (taskName: string) => {
    const updatedTasks = tasks.filter(task => task.name !== taskName);
    saveTasks(updatedTasks);
  };

  // Edit task

  // Render task item
  const renderItem = ({item}: {item: Task}) => (
    <View style={tw`flex-row items-center bg-gray-100 p-3 mb-2 rounded-lg`}>
      <View>
        <Text style={tw`text-base font-semibold text-black`}>{item.name}</Text>
        <Text style={tw`text-sm text-gray-600`}>{item.specificFor}</Text>
        <Text style={tw`text-sm text-gray-600`}>{item.dailyTarget}</Text>
        <Text style={tw`text-sm text-gray-600`}>
          Selected Days:{' '}
          {item.selectedDays ? item.selectedDays.join(', ') : 'None'}
        </Text>
        <Text style={tw`text-sm text-gray-600`}>
          Selected Dates:{' '}
          {item.selectedDates ? item.selectedDates.join(', ') : 'None'}
        </Text>
        <Text style={tw`text-sm text-gray-600`}>
          Selected Date:{item.selectedDate ? item.selectedDate.join(', ') : 'None' }
          
        </Text>
        <Text style={tw`text-sm text-gray-600`}>
          Selected Month:{item.selectedMonths ? item.selectedMonths.map(monthIndex => months[monthIndex - 1]).join(', ') : 'None' }
          
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
      <Text style={tw`text-xl font-bold text-black`}>All Tasks</Text>

      <FlatList
        data={tasks}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

export default AllTaskListScreen;