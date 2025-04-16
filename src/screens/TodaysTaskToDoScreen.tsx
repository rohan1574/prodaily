import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import {s as tw} from 'react-native-wind';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomNavigation from './BottomNavigation';

const TodaysTaskToDoScreen = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // To handle loading state
 
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const storedTasks = await AsyncStorage.getItem('tasks');
        const taskList = storedTasks ? JSON.parse(storedTasks) : [];

        const currentDate = new Date();
        const startOfWeek = new Date(currentDate); // Start of the week (today)
        const endOfWeek = new Date(currentDate); // End of the week (Sunday)

        // Set the start date to today at 00:00:00
        startOfWeek.setHours(0, 0, 0, 0);

        // Set the end date to Sunday of the current week at 23:59:59
        endOfWeek.setDate(currentDate.getDate() + (7 - currentDate.getDay())); // Set it to Sunday
        endOfWeek.setHours(23, 59, 59, 999); // Set to the last moment of Sunday

        console.log('Start Date:', startOfWeek);
        console.log('End Date:', endOfWeek);

        // 🟢 যদি ইউজার কোনো schedule টাইপ সিলেক্ট না করে — মানে এটা Daily Routine
        const filteredTasks = taskList.filter((task: any) => {
          const isDailyRoutineTask =
            (!task.scheduleType || task.scheduleType === '') &&
            !task.endDate &&
            (!task.selectedDays || task.selectedDays.length === 0) &&
            (!task.selectedDate || task.selectedDate.length === 0) &&
            (!task.selectedDates || task.selectedDates.length === 0) &&
            (!task.selectedMonths || task.selectedMonths.length === 0);

          if (isDailyRoutineTask) {
            return true; // Show every day
          }
          // day
          if (task.endDate) {
            const taskEndDate = new Date(task.endDate);
            taskEndDate.setHours(0, 0, 0, 0); // Adjust endDate for proper comparison
            return taskEndDate >= currentDate;
          }
          // week
          if (task.selectedDays && task.selectedDays.length > 0) {
            const today = new Date(currentDate);
            today.setHours(0, 0, 0, 0); // Remove time

            const todayName = today.toLocaleDateString('en-US', {
              weekday: 'short',
            }); // 'Sun', 'Mon', etc.

            // যদি আজকের দিন selectedDays-এ থাকে, তাহলে দেখাও
            return task.selectedDays.includes(todayName);
          }

          // month
          if (task.selectedDate?.length > 0) {
            const today = new Date(currentDate);
            today.setHours(0, 0, 0, 0);

            const todayDate = today.getDate(); // 1 - 31

            return task.selectedDate.includes(todayDate);
          }

          // year
          if (
            task.selectedDates?.length > 0 &&
            task.selectedMonths?.length > 0
          ) {
            const today = new Date(currentDate);
            today.setHours(0, 0, 0, 0);

            const todayDay = today.getDate(); // eg: 4
            const todayMonth = today.toLocaleString('default', {month: 'short'}); // eg: 'Apr'

            return (
              task.selectedDates.includes(todayDay) &&
              task.selectedMonths.includes(todayMonth)
            );
          }

          return false;
        });

        setTasks(filteredTasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false); // Set loading to false after fetch is complete
      }
    };

    fetchTasks();
  }, []); // Trigger on initial load

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
      <Text style={tw`text-2xl font-semibold mb-4`}>All Tasks</Text>
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
                {/* Task Icon */}
                <View style={tw`flex-row items-center mb-2`}>
                  {task.icon && (
                    <Image
                      source={task.icon} // Assuming `task.icon` is an image source or URI
                      style={tw`w-10 h-10 mr-4`} // Style it as needed
                    />
                  )}
                  <Text style={tw`text-lg font-bold`}>{task.name}</Text>
                </View>
                {(!task.scheduleType || task.scheduleType === '') &&
                  !task.endDate &&
                  (!task.selectedDays || task.selectedDays.length === 0) &&
                  (!task.selectedDate || task.selectedDate.length === 0) &&
                  (!task.selectedDates || task.selectedDates.length === 0) &&
                  (!task.selectedMonths ||
                    task.selectedMonths.length === 0) && (
                    <Text style={tw`text-sm text-green-700 mb-1`}>
                      🔁 This task is part of your Daily Routine
                    </Text>
                  )}

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
                {task.selectedDate?.length > 0 && (
                  <Text style={tw`text-sm text-gray-600 mb-1`}>
                    Add Specific Day On (Monthly):{' '}
                    {task.selectedDate.join(', ')}
                  </Text>
                )}

                {/* Add Specific Day On (Yearly) */}
                {task.selectedDates &&
                  task.selectedDates.length > 0 &&
                  task.selectedMonths &&
                  task.selectedMonths.length > 0 && (
                    <Text style={tw`text-sm text-gray-600 mb-1`}>
                      Selected Dates: {task.selectedDates.join(', ')},{' '}
                      {task.selectedMonths.join(', ')}
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
      {/* bottom navigation */}
      <BottomNavigation></BottomNavigation>
    </View>
  );
};

export default TodaysTaskToDoScreen;
