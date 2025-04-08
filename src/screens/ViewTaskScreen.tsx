import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ViewTaskScreen = () => {
  const [tasks, setTasks] = useState([]);

  const getTasksFromAsyncStorage = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error('Error fetching tasks from AsyncStorage', error);
    }
  };

  useEffect(() => {
    getTasksFromAsyncStorage();
  }, []);

  return (
    <ScrollView style={{ padding: 20 }}>
      {tasks.length === 0 ? (
        <Text>No tasks available</Text>
      ) : (
        tasks.map((task, index) => (
          <View key={index} style={{ marginBottom: 20 }}>
            <Text>Task Name: {task.name}</Text>
            <Text>Duration: {task.duration} {task.durationType}</Text>
            <Text>Set Daily Target: {task.setDailyTarget}</Text>
            <Text>Start Date: {new Date(task.startDate).toDateString()}</Text>
            <Text>Task Dates:</Text>
            {task.durationType === 'days'
              ? task.startDate &&
                [...Array(task.duration)].map((_, i) => (
                  <Text key={i}>{new Date(task.startDate).setDate(new Date(task.startDate).getDate() + i)}</Text>
                ))
              : task.durationType === 'weeks'
              ? task.startDate &&
                [...Array(task.duration)].map((_, i) => (
                  <Text key={i}>{new Date(task.startDate).setDate(new Date(task.startDate).getDate() + (i * 7))}</Text>
                ))
              : task.durationType === 'months'
              ? task.startDate &&
                [...Array(task.duration)].map((_, i) => (
                  <Text key={i}>{new Date(task.startDate).setMonth(new Date(task.startDate).getMonth() + i)}</Text>
                ))
              : null}
          </View>
        ))
      )}
    </ScrollView>
  );
};

export default ViewTaskScreen;
