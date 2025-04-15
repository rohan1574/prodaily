import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import { s as tw } from 'react-native-wind';
import BottomNavigation from './BottomNavigation';

interface Task {
  id: string;
  name: string;
  icon: any;
  category: string;
  dailyTarget?: string;
  selectedDays?: string[];
  selectedDates?: number[];
  selectedYears?: { month: number; date: number }[];
  targetType?: 'Daily' | 'Weekly' | 'Monthly' | 'Yearly';
  startDate: string;
  endDate?: string | null;
  specificFor?: 'Days' | 'Weeks' | 'Months';
  specificForValue?: string;
  starred?: boolean;
  completed?: boolean;
}

const TodaysTaskToDoScreen: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const storedTasks = await AsyncStorage.getItem('tasks');
        const parsedTasks: Task[] = storedTasks ? JSON.parse(storedTasks) : [];

        const today = new Date();
        const todayDate = today.getDate();
        const todayMonth = today.getMonth() + 1; // Months are 0-indexed
        const todayDay = today.toLocaleDateString('en-US', { weekday: 'long' });

        const filteredTasks = parsedTasks.filter((task) => {
          const startDate = new Date(task.startDate);
          const endDate = task.endDate ? new Date(task.endDate) : null;

          // Check if today is within startDate and endDate
          const isWithinDateRange =
            (!endDate && today >= startDate) ||
            (endDate && today >= startDate && today <= endDate);

          if (task.specificFor && task.specificForValue) {
            return isWithinDateRange;
          }

          if (task.targetType === 'Weekly' && task.selectedDays) {
            return isWithinDateRange && task.selectedDays.includes(todayDay);
          }

          if (task.targetType === 'Monthly' && task.selectedDates) {
            return isWithinDateRange && task.selectedDates.includes(todayDate);
          }

          if (
            task.targetType === 'Yearly' &&
            task.selectedYears &&
            task.selectedYears.some(
              (d) => d.month === todayMonth && d.date === todayDate
            )
          ) {
            return isWithinDateRange;
          }

          // Default to showing daily tasks if in range
          return task.targetType === 'Daily' && today >= startDate;
        });

        setTasks(filteredTasks);
      } catch (error) {
        console.error('Error loading tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, []);

  const toggleComplete = (id: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const toggleStar = (id: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, starred: !task.starred } : task
      )
    );
  };

  const TaskItem: React.FC<{ task: Task }> = ({ task }) => (
    <View
      style={[
        tw`flex-row items-center p-2 border-b border-gray-200`,
        task.completed && tw`bg-green-100`,
      ]}
    >
      <TouchableOpacity onPress={() => toggleComplete(task.id)}>
        <Icon
          name={task.completed ? 'checkmark-circle' : 'ellipse-outline'}
          size={24}
          color={task.completed ? 'green' : 'gray'}
          style={tw`mr-2`}
        />
      </TouchableOpacity>
      <Image source={task.icon} style={tw`w-6 h-6 mr-2`} />
      <Text style={tw`flex-1`}>{task.name}</Text>
      <TouchableOpacity onPress={() => toggleStar(task.id)}>
        <Icon
          name={task.starred ? 'star' : 'star-outline'}
          size={20}
          color={task.starred ? 'gold' : 'gray'}
          style={tw`ml-2`}
        />
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={tw`flex-1 bg-gray-100`}>
      {/* Header */}
      <View style={tw`bg-blue-500 p-4 flex-row justify-between items-center`}>
        <View>
          <Text style={tw`text-white text-lg font-bold`}>Today</Text>
          <Text style={tw`text-white text-sm`}>
            {new Date().toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              weekday: 'long',
            })}
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

      {/* Task List */}
      {tasks.length === 0 ? (
        <View style={tw`flex-1 justify-center items-center`}>
          <Text style={tw`text-gray-500 text-lg`}>No tasks for today</Text>
        </View>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <TaskItem task={item} />}
        />
      )}

      {/* Bottom Navigation */}
      <BottomNavigation />
    </View>
  );
};

export default TodaysTaskToDoScreen;
