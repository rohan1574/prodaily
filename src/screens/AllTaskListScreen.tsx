import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import {s as tw} from 'react-native-wind';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomNavigation from './BottomNavigation';
import Icon from 'react-native-vector-icons/Ionicons';

const AllTaskListScreen = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // To handle loading state
  const [editingTask, setEditingTask] = useState<any | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  //  star
  const toggleStar = async (taskId: string) => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      const taskList = storedTasks ? JSON.parse(storedTasks) : [];

      const updatedList = taskList.map((task: any) => {
        if (task.id === taskId) {
          return {...task, isStarred: !task.isStarred};
        }
        return task;
      });

      await AsyncStorage.setItem('tasks', JSON.stringify(updatedList));
      setTasks(updatedList); // Update UI
    } catch (error) {
      console.error('Error toggling star:', error);
    }
  };

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
          // Week logic
          if (task.selectedDays && task.selectedDays.length > 0) {
            const taskDates = task.selectedDays.map((day: string) => {
              const taskDate = new Date(currentDate); // Use current date as reference
              let dayOffset = taskDate.getDay();

              // Map the day names to corresponding offsets
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

              // Find the next date for the selected day (this will repeat indefinitely)
              const targetDate = new Date(
                taskDate.setDate(
                  taskDate.getDate() + (dayOffset - taskDate.getDay()),
                ),
              );

              // Adjust targetDate to always show from today onward
              if (targetDate < new Date()) {
                targetDate.setDate(targetDate.getDate() + 7); // If the target date is in the past, show it for the next week
              }

              return targetDate;
            });

            // Check if any task date is today or in the future (to show indefinitely from today onwards)
            return taskDates.some((taskDate: Date) => {
              const today = new Date();
              today.setHours(0, 0, 0, 0); // Reset the time to midnight to compare only the date
              return taskDate >= today; // Task is shown if it's today or in the future
            });
          }

          // month
          if (task.selectedDate?.length > 0) {
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Set the time to midnight

            const matchingDates: Date[] = [];

            // Loop through the next 30 days and find the matching dates
            for (let i = 0; i < 30; i++) {
              const current = new Date();
              current.setDate(today.getDate() + i);
              current.setHours(0, 0, 0, 0);
              const dayOfMonth = current.getDate();

              if (task.selectedDate.includes(dayOfMonth)) {
                matchingDates.push(current);
              }
            }

            // Show tasks from today onwards indefinitely, regardless of the selected date
            return matchingDates.some((taskDate: Date) => {
              return taskDate >= today; // Show tasks from today onwards indefinitely
            });
          }

        // year
if (
  task.selectedDates?.length > 0 &&
  task.selectedMonths?.length > 0
) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);  // Set the time to midnight

  const yearlyMatchingDates: Date[] = [];

  // Loop through the entire year from today onward
  for (
    let d = new Date(today);
    d.getFullYear() === today.getFullYear() || d.getFullYear() === today.getFullYear() + 1;
    d.setDate(d.getDate() + 1)
  ) {
    const day = d.getDate(); // 1 - 31
    const monthName = d.toLocaleString('default', { month: 'short' }); // 'Jan', 'Feb', etc.

    // If the selected day and month match the current date
    if (
      task.selectedDates.includes(day) &&
      task.selectedMonths.includes(monthName)
    ) {
      const dateMatch = new Date(d);
      dateMatch.setHours(0, 0, 0, 0); // Set to midnight
      yearlyMatchingDates.push(dateMatch);
    }
  }

  // Show tasks from today onwards indefinitely
  return yearlyMatchingDates.some((taskDate: Date) => {
    return taskDate >= today; // Show from today onwards indefinitely
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
  const openUpdateModal = (task: any) => {
    setEditingTask({...task}); // clone task
    setModalVisible(true);
  };

  const handleUpdateTask = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      const taskList = storedTasks ? JSON.parse(storedTasks) : [];

      const updatedList = taskList.map((task: any) =>
        task.id === editingTask.id ? editingTask : task,
      );

      await AsyncStorage.setItem('tasks', JSON.stringify(updatedList));
      setTasks(updatedList);
      setModalVisible(false);
    } catch (error) {
      console.error('Error updating task:', error);
    }
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
                {/* star icon */}
                <TouchableOpacity
                  onPress={() => toggleStar(task.id)}
                  style={tw`absolute top-3 right-3`}>
                  <Icon
                    name={task.isStarred ? 'star' : 'star-outline'}
                    size={24}
                    color={task.isStarred ? 'gold' : 'gray'}
                  />
                </TouchableOpacity>

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
                {/* update */}
                <TouchableOpacity
                  onPress={() => openUpdateModal(task)}
                  style={tw`bg-blue-500 mt-3 py-2 rounded-lg`}>
                  <Text style={tw`text-white text-center font-semibold`}>
                    Update
                  </Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </ScrollView>
      )}
      {/* Update Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={tw`flex-1 bg-white p-6`}>
          <Text style={tw`text-xl font-bold mb-4`}>Update Task</Text>

          {/* Daily Target */}
          <TextInput
            placeholder="Daily Target"
            value={editingTask?.dailyTarget}
            onChangeText={text =>
              setEditingTask({...editingTask, dailyTarget: text})
            }
            style={tw`border p-2 mb-3 rounded`}
          />

          {/* Add Specific For Value */}
          <Text style={tw`text-base font-semibold mb-1`}>
            Add Specific For:
          </Text>
          <View style={tw`flex-row mb-2`}>
            {['days', 'weeks', 'months'].map(type => (
              <TouchableOpacity
                key={type}
                onPress={() =>
                  setEditingTask({...editingTask, specificFor: type})
                }
                style={tw`mr-2 px-3 py-1 rounded-full ${
                  editingTask?.specificFor === type
                    ? 'bg-blue-500'
                    : 'bg-gray-300'
                }`}>
                <Text
                  style={tw`text-sm ${
                    editingTask?.specificFor === type
                      ? 'text-white'
                      : 'text-black'
                  }`}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            placeholder="Enter number"
            keyboardType="numeric"
            value={
              editingTask?.specificForValue
                ? editingTask.specificForValue.toString()
                : ''
            }
            onChangeText={text =>
              setEditingTask({
                ...editingTask,
                specificForValue: parseInt(text) || '',
              })
            }
            style={tw`border p-2 mb-4 rounded`}
          />
          {/* Add Specific Day On Value */}
          {/* Add Specific Day On (Weekly) */}
          <View style={tw`flex-row mb-2`}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
              (day: string) => (
                <TouchableOpacity
                  key={day}
                  onPress={() => {
                    const updatedDays = editingTask?.selectedDays?.includes(day)
                      ? editingTask.selectedDays.filter(
                          (selectedDay: string) => selectedDay !== day,
                        )
                      : [...(editingTask?.selectedDays || []), day];
                    setEditingTask({...editingTask, selectedDays: updatedDays});
                  }}
                  style={tw`mr-2 px-3 py-1 rounded-full ${
                    editingTask?.selectedDays?.includes(day)
                      ? 'bg-blue-500'
                      : 'bg-gray-300'
                  }`}>
                  <Text
                    style={tw`text-sm ${
                      editingTask?.selectedDays?.includes(day)
                        ? 'text-white'
                        : 'text-black'
                    }`}>
                    {day}
                  </Text>
                </TouchableOpacity>
              ),
            )}
          </View>

          {/* Add Specific Day On (Monthly) */}
          <TextInput
            placeholder="Select Dates (e.g. 1, 15, 20)"
            value={editingTask?.selectedDate?.join(', ') || ''}
            onChangeText={text => {
              const dates = text
                .split(',')
                .map(date => parseInt(date.trim(), 10));
              setEditingTask({...editingTask, selectedDate: dates});
            }}
            style={tw`border p-2 mb-4 rounded`}
          />

          {/* Add Specific Day On (Yearly) */}
          <TextInput
            placeholder="Select Dates (e.g. 1, 15)"
            value={editingTask?.selectedDates?.join(', ') || ''}
            onChangeText={text => {
              const dates = text
                .split(',')
                .map(date => parseInt(date.trim(), 10));
              setEditingTask({...editingTask, selectedDates: dates});
            }}
            style={tw`border p-2 mb-4 rounded`}
          />
          <View style={tw`flex-row mb-2`}>
            {[
              'Jan',
              'Feb',
              'Mar',
              'Apr',
              'May',
              'Jun',
              'Jul',
              'Aug',
              'Sep',
              'Oct',
              'Nov',
              'Dec',
            ].map((month: string) => (
              <TouchableOpacity
                key={month}
                onPress={() => {
                  const updatedMonths = editingTask?.selectedMonths?.includes(
                    month,
                  )
                    ? editingTask.selectedMonths.filter(
                        (selectedMonth: string) => selectedMonth !== month,
                      )
                    : [...(editingTask?.selectedMonths || []), month];
                  setEditingTask({
                    ...editingTask,
                    selectedMonths: updatedMonths,
                  });
                }}
                style={tw`mr-2 px-3 py-1 rounded-full ${
                  editingTask?.selectedMonths?.includes(month)
                    ? 'bg-blue-500'
                    : 'bg-gray-300'
                }`}>
                <Text
                  style={tw`text-sm ${
                    editingTask?.selectedMonths?.includes(month)
                      ? 'text-white'
                      : 'text-black'
                  }`}>
                  {month}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Save & Cancel */}
          <TouchableOpacity
            onPress={handleUpdateTask}
            style={tw`bg-green-500 py-2 rounded-lg mb-3`}>
            <Text style={tw`text-white text-center font-semibold`}>Save</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={tw`bg-gray-300 py-2 rounded-lg`}>
            <Text style={tw`text-center`}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* bottom navigation */}
      <BottomNavigation></BottomNavigation>
    </View>
  );
};

export default AllTaskListScreen;
