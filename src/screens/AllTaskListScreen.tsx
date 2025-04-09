import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { s as tw } from 'react-native-wind';
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
        const startOfWeek = new Date(currentDate); // Start of the week (today)
        const endOfWeek = new Date(currentDate); // End of the week (Sunday)

        // Set the start date to today at 00:00:00
        startOfWeek.setHours(0, 0, 0, 0);

        // Set the end date to Sunday of the current week at 23:59:59
        endOfWeek.setDate(currentDate.getDate() + (7 - currentDate.getDay())); // Set it to Sunday
        endOfWeek.setHours(23, 59, 59, 999); // Set to the last moment of Sunday

        console.log('Start Date:', startOfWeek);
        console.log('End Date:', endOfWeek);

        // Filter tasks that have specific days (weekly tasks) within this week range
        const filteredTasks = taskList.filter((task: any) => {
          if (task.endDate) {
            const taskEndDate = new Date(task.endDate);
            taskEndDate.setHours(0, 0, 0, 0); // Adjust endDate for proper comparison
            return taskEndDate >= currentDate;
          }
          if (task.selectedDays && task.selectedDays.length > 0) {
            const taskDates = task.selectedDays.map((day: string) => {
              const taskDate = new Date(currentDate);
              let dayOffset = taskDate.getDay();
              switch (day) {
                case 'Sun':
                  dayOffset = 0;
                  break;
                case 'Mon':
                  dayOffset = 1;
                  break;
                case 'Tue':
                  dayOffset = 2;
                  break;
                case 'Wed':
                  dayOffset = 3;
                  break;
                case 'Thu':
                  dayOffset = 4;
                  break;
                case 'Fri':
                  dayOffset = 5;
                  break;
                case 'Sat':
                  dayOffset = 6;
                  break;
              }

              const targetDate = new Date(taskDate.setDate(taskDate.getDate() + (dayOffset - taskDate.getDay())));
              return targetDate;
            });

            return taskDates.some((taskDate: Date) => {
              return taskDate >= startOfWeek && taskDate <= endOfWeek;
            });
          }
          if (task.selectedDate?.length > 0) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const endDate = new Date();
            endDate.setDate(today.getDate() + 29); // আজ থেকে ৩০ দিন পর্যন্ত
          
            const matchingDates: Date[] = [];
          
            for (let i = 0; i < 30; i++) {
              const current = new Date();
              current.setDate(today.getDate() + i);
              current.setHours(0, 0, 0, 0);
              const dayOfMonth = current.getDate();
          
              if (task.selectedDate.includes(dayOfMonth)) {
                matchingDates.push(current);
              }
            }
          
            return matchingDates.some((taskDate: Date) => {
              return taskDate >= startOfWeek && taskDate <= endOfWeek;
            });
          }
          if (
            task.selectedDates?.length > 0 &&
            task.selectedMonths?.length > 0
          ) {
            const today = new Date();
            const endDate = new Date();
            endDate.setFullYear(today.getFullYear() + 1); // ১ বছর পর্যন্ত
          
            const yearlyMatchingDates: Date[] = [];
          
            for (
              let d = new Date(today);
              d <= endDate;
              d.setDate(d.getDate() + 1)
            ) {
              const day = d.getDate(); // 1 - 31
              const monthName = d.toLocaleString('default', { month: 'long' }); // January - December
          
              if (
                task.selectedDates.includes(day) &&
                task.selectedMonths.includes(monthName)
              ) {
                const dateMatch = new Date(d);
                dateMatch.setHours(0, 0, 0, 0);
                yearlyMatchingDates.push(dateMatch);
              }
            }
          
            return yearlyMatchingDates.some((taskDate: Date) => {
              return taskDate >= startOfWeek && taskDate <= endOfWeek;
            });
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
        { text: 'Cancel', style: 'cancel' },
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
      { cancelable: true },
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
