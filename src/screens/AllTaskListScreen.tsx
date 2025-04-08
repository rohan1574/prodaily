import React, {useEffect, useState} from 'react';
import {View, Text, ScrollView, TouchableOpacity, Alert} from 'react-native';
import {s as tw} from 'react-native-wind';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AllTaskListScreen = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // To handle loading state

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const storedTasks = await AsyncStorage.getItem('tasks');
        const taskList = storedTasks ? JSON.parse(storedTasks) : [];
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0); // Set time to 00:00:00 for proper date comparison

        // Filter tasks where endDate is after the current date
        const filteredTasks = taskList.filter((task: any) => {
          if (task.endDate) {
            const taskEndDate = new Date(task.endDate);
            taskEndDate.setHours(0, 0, 0, 0); // Adjust endDate for proper comparison
            return taskEndDate >= currentDate;
          }
          return true; // Include tasks with no endDate
        });

        console.log(filteredTasks); // Log the tasks to verify the filtering
        setTasks(filteredTasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false); // Set loading to false after fetch is complete
      }
    };

    fetchTasks();
  }, []);

  const handleDelete = async (id: string) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const storedTasks = await AsyncStorage.getItem('tasks');
              const taskList = storedTasks ? JSON.parse(storedTasks) : [];
              const updatedList = taskList.filter(
                (task: any) => task.id !== id,
              );
              await AsyncStorage.setItem('tasks', JSON.stringify(updatedList));
              setTasks(updatedList);
            } catch (error) {
              console.error('Error deleting task:', error);
            }
          },
        },
      ],
      {cancelable: true},
    );
  };

  return (
    <View style={tw`flex-1 bg-white p-4`}>
      <Text style={tw`text-2xl font-semibold mb-4`}>Alls Tasks</Text>
      {loading ? (
        <Text style={tw`text-center text-gray-500`}>Loading tasks...</Text> // Show loading text
      ) : (
        <ScrollView contentContainerStyle={tw`pb-10`}>
          {tasks.length === 0 ? (
            <Text style={tw`text-center text-gray-500`}>
              No tasks available for the selected date range.
            </Text>
          ) : (
            tasks.map((task: any) => (
              <View key={task.id} style={tw`bg-gray-100 p-4 mb-4 rounded-lg`}>
                <Text style={tw`text-lg font-bold mb-1`}>
                  Task ID: {task.id}
                </Text>
                <Text style={tw`text-sm text-gray-600 mb-1`}>
                  Set Daily Target: {task.dailyTarget || 'N/A'}
                </Text>

                {/* Add Specific For */}
                {task.specificFor && task.specificForValue ? (
                  <Text style={tw`text-sm text-gray-600 mb-1`}>
                    Add Specific For: {task.specificForValue} {task.specificFor}
                  </Text>
                ) : (
                  <Text style={tw`text-sm text-gray-600 mb-1`}>
                    Add Specific For: N/A
                  </Text>
                )}

                {/* Add Specific Day On (Weekly) */}
                {task.selectedDays?.length > 0 && (
                  <Text style={tw`text-sm text-gray-600 mb-1`}>
                    Add Specific Day On (Weekly): {task.selectedDays.join(', ')}
                  </Text>
                )}

                {/* Add Specific Day On (Monthly) */}
                {task.selectedDates?.length > 0 && (
                  <Text style={tw`text-sm text-gray-600 mb-1`}>
                    Add Specific Day On (Monthly):{' '}
                    {task.selectedDates.join(', ')}
                  </Text>
                )}

                {/* Add Specific Day On (Yearly) */}
                {task.selectedDates &&
                  task.selectedDates.length > 0 &&
                  task.selectedMonths &&
                  task.selectedMonths.length > 0 && (
                    <Text style={tw`text-sm text-gray-600 mb-1`}>
                      Selected Dates: {task.selectedDates.join(', ')}, {task.selectedMonths.join(', ')}
                    </Text>
                  )}

                {/* Delete Button */}
                <TouchableOpacity
                  onPress={() => handleDelete(task.id)}
                  style={tw`bg-red-500 mt-3 py-2 rounded-lg`}>
                  <Text style={tw`text-white text-center font-semibold`}>
                    Delete
                  </Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default AllTaskListScreen;
