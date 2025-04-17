import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';

// Define the param list type for the stack
type RootStackParamList = {
  AllTaskListScreen: undefined;
  EditTaskScreen: { taskId: string }; // Define taskId as a parameter for EditTaskScreen
};

// Define the types for the route and navigation props
type EditTaskScreenRouteProp = RouteProp<RootStackParamList, 'EditTaskScreen'>;
type EditTaskScreenNavigationProp = StackNavigationProp<RootStackParamList, 'EditTaskScreen'>;

type Props = {
  route: EditTaskScreenRouteProp;
  navigation: EditTaskScreenNavigationProp;
};

interface Task {
  id: string;
  name: string;
  specificFor: string;
  specificForValue: string;
  dailyTarget: string;
  selectedDays: string[];
  selectedDate: string[];
  selectedMonths: string[];
  isStarred: boolean;
}

const EditTaskScreen: React.FC<Props> = ({ route, navigation }) => {
  const { taskId } = route.params; // Get task ID passed from AllTaskListScreen

  const [task, setTask] = useState<Task | null>(null); // Explicitly typing task as Task or null
  const [updatedTask, setUpdatedTask] = useState<Task>({
    id: '',
    name: '',
    specificFor: '',
    specificForValue: '',
    dailyTarget: '',
    selectedDays: [],
    selectedDate: [],
    selectedMonths: [],
    isStarred: false,
  });

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const storedTasks = await AsyncStorage.getItem('tasks');
        const taskList = storedTasks ? JSON.parse(storedTasks) : [];
        const taskToEdit = taskList.find((t: Task) => t.id === taskId);
        if (taskToEdit) {
          setTask(taskToEdit);
          setUpdatedTask({
            ...taskToEdit,
            // Ensure all properties are properly mapped
            selectedDays: taskToEdit.selectedDays || [],
            selectedDate: taskToEdit.selectedDate || [],
            selectedMonths: taskToEdit.selectedMonths || [],
          });
        }
      } catch (error) {
        console.error('Error fetching task:', error);
      }
    };

    fetchTask();
  }, [taskId]);

  const handleUpdateTask = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      const taskList = storedTasks ? JSON.parse(storedTasks) : [];

      const updatedList = taskList.map((taskItem: Task) => {
        if (taskItem.id === taskId) {
          return { ...taskItem, ...updatedTask };
        }
        return taskItem;
      });

      await AsyncStorage.setItem('tasks', JSON.stringify(updatedList));
      Alert.alert('Task Updated', 'The task has been updated successfully.');
      navigation.goBack(); // Go back to AllTaskListScreen after updating
    } catch (error) {
      console.error('Error updating task:', error);
      Alert.alert('Error', 'There was an error updating the task.');
    }
  };

  const handleInputChange = (field: keyof Task, value: any) => {
    setUpdatedTask((prevTask) => ({ ...prevTask, [field]: value }));
  };

  if (!task) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Edit Task</Text>

      <Text style={{ fontSize: 18, marginBottom: 8 }}>Task Name:</Text>
      <TextInput
        style={{ borderColor: '#ccc', borderWidth: 1, padding: 10, marginBottom: 16 }}
        value={updatedTask.name}
        onChangeText={(text) => handleInputChange('name', text)}
      />

      <Text style={{ fontSize: 18, marginBottom: 8 }}>Set Daily Target:</Text>
      <TextInput
        style={{ borderColor: '#ccc', borderWidth: 1, padding: 10, marginBottom: 16 }}
        value={updatedTask.dailyTarget}
        onChangeText={(text) => handleInputChange('dailyTarget', text)}
        keyboardType="numeric"
      />

      <Text style={{ fontSize: 18, marginBottom: 8 }}>Add Specific For:</Text>
      <TextInput
        style={{ borderColor: '#ccc', borderWidth: 1, padding: 10, marginBottom: 16 }}
        value={updatedTask.specificFor}
        onChangeText={(text) => handleInputChange('specificFor', text)}
      />

      <Text style={{ fontSize: 18, marginBottom: 8 }}>Add Specific Day On (Weekly):</Text>
      <TextInput
        style={{ borderColor: '#ccc', borderWidth: 1, padding: 10, marginBottom: 16 }}
        value={updatedTask.selectedDays.join(', ')}
        onChangeText={(text) => handleInputChange('selectedDays', text.split(', '))}
      />

      <Text style={{ fontSize: 18, marginBottom: 8 }}>Add Specific Day On (Monthly):</Text>
      <TextInput
        style={{ borderColor: '#ccc', borderWidth: 1, padding: 10, marginBottom: 16 }}
        value={updatedTask.selectedDate.join(', ')}
        onChangeText={(text) => handleInputChange('selectedDate', text.split(', '))}
      />

      <Text style={{ fontSize: 18, marginBottom: 8 }}>Add Specific Month:</Text>
      <TextInput
        style={{ borderColor: '#ccc', borderWidth: 1, padding: 10, marginBottom: 16 }}
        value={updatedTask.selectedMonths.join(', ')}
        onChangeText={(text) => handleInputChange('selectedMonths', text.split(', '))}
      />

      <TouchableOpacity
        onPress={handleUpdateTask}
        style={{ backgroundColor: '#3498db', padding: 12, borderRadius: 8, marginTop: 24 }}>
        <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>Update Task</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{ backgroundColor: '#ccc', padding: 12, borderRadius: 8, marginTop: 12 }}>
        <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EditTaskScreen;
