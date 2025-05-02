import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Image,
  Modal,
} from 'react-native';
import {s as tw} from 'react-native-wind';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomNavigation from './BottomNavigation';
import Icon from 'react-native-vector-icons/Ionicons';

const AllTaskListScreen = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [editedTask, setEditedTask] = useState<any>({});
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
 const [isSpecificForEnabled, setIsSpecificForEnabled] = useState(false);
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const storedTasks = await AsyncStorage.getItem('tasks');
        const taskList = storedTasks ? JSON.parse(storedTasks) : [];
        setTasks(taskList);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const toggleStar = async (taskId: string) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? {...task, isStarred: !task.isStarred} : task,
    );
    await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
    setTasks(updatedTasks);
  };

  const toggleExpansion = (taskId: string) => {
    setExpandedTaskId(prev => (prev === taskId ? null : taskId));
    const task = tasks.find(t => t.id === taskId);
    setEditedTask(task || {});
  };

  const handleUpdateTask = async (taskId: string) => {
    try {
      const updatedTasks = tasks.map(task =>
        task.id === taskId ? editedTask : task,
      );
      await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
      setTasks(updatedTasks);
      setExpandedTaskId(null);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDelete = async (taskId: string) => {
    Alert.alert('Delete Task', 'Are you sure?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Delete',
        onPress: async () => {
          const updatedTasks = tasks.filter(task => task.id !== taskId);
          await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
          setTasks(updatedTasks);
        },
      },
    ]);
  };

  const handleSpecificForChange = (value: string) => {
    const numericValue = parseInt(value) || 0;
    setEditedTask({
      ...editedTask,
      specificForValue: numericValue,
    });
  };

  const toggleDaySelection = (day: string) => {
    const updatedDays = editedTask.selectedDays?.includes(day)
      ? editedTask.selectedDays.filter((d: string) => d !== day)
      : [...(editedTask.selectedDays || []), day];

    setEditedTask({
      ...editedTask,
      selectedDays: updatedDays,
    });
  };
  const handleTaskLongPress = (taskId: string) => {
    setTaskToDelete(taskId);
    setDeleteModalVisible(true);
  };
  // ডিলিট কনফার্মেশন মোডাল
  const DeleteConfirmationModal = () => (
    <Modal
      visible={deleteModalVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setDeleteModalVisible(false)}>
      <View style={tw`flex-1 bg-black/50 justify-center items-center p-4`}>
        <View style={tw`bg-white p-6 rounded-xl w-full max-w-80`}>
          <Text style={tw`text-lg font-bold mb-4 text-center`}>
            Are you sure you want to delete this task?
          </Text>

          <View style={tw`flex-row justify-between gap-3`}>
            <TouchableOpacity
              style={tw`flex-1 bg-gray-300 py-2 rounded-lg`}
              onPress={() => setDeleteModalVisible(false)}>
              <Text style={tw`text-center`}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={tw`flex-1 bg-red-500 py-2 rounded-lg`}
              onPress={async () => {
                if (!taskToDelete) return;
                const updatedTasks = tasks.filter(
                  task => task.id !== taskToDelete,
                );
                await AsyncStorage.setItem(
                  'tasks',
                  JSON.stringify(updatedTasks),
                );
                setTasks(updatedTasks);
                setDeleteModalVisible(false);
              }}>
              <Text style={tw`text-white text-center`}>Yes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={tw`flex-1 bg-white p-4`}>
      <DeleteConfirmationModal />
      <Text style={tw`text-2xl font-bold mb-4`}>All Tasks</Text>

      {loading ? (
        <Text style={tw`text-center text-gray-500`}>Loading...</Text>
      ) : (
        <ScrollView>
          {tasks.map(task => (
            <TouchableOpacity
              key={task.id}
              onLongPress={() => handleTaskLongPress(task.id)}
              activeOpacity={0.8}
              style={tw`bg-gray-100 p-4 mb-4 rounded-lg`}>
              <View style={tw`flex-row justify-between items-center`}>
                <View style={tw`flex-row items-center gap-2`}>
                  {task.icon && (
                    <Image source={task.icon} style={tw`w-8 h-8`} />
                  )}
                  <Text style={tw`text-lg font-semibold`}>{task.name}</Text>
                </View>

                <View style={tw`flex-row items-center gap-2`}>
                  <TouchableOpacity onPress={() => toggleStar(task.id)}>
                    <Icon
                      name={task.isStarred ? 'star' : 'star-outline'}
                      size={24}
                      color={task.isStarred ? 'gold' : 'gray'}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => toggleExpansion(task.id)}>
                    <Icon
                      name={
                        expandedTaskId === task.id
                          ? 'chevron-down'
                          : 'create-outline'
                      }
                      size={24}
                      color="#4b5563"
                    />
                  </TouchableOpacity>
                </View>
              </View>
              {/* ডেইলি রুটিন ট্যাগ */}
              {!task.scheduleType &&
                !task.endDate &&
                !task.selectedDays?.length &&
                !task.selectedDate?.length &&
                !task.selectedDates?.length &&
                !task.selectedMonths?.length && (
                  <Text style={tw`text-sm text-green-700 mb-1`}>
                    🔁 This task is part of your Daily Routine
                  </Text>
                )}

              {/* ডেইলি টার্গেট (শুধু ভ্যালু থাকলে) */}
              {task.dailyTarget && (
                <Text style={tw`text-sm text-gray-600 mb-1`}>
                  Set Daily Target:{' '}
                  {task.dailyTarget
                    ? `${task.dailyTarget} ${task.targetType}`
                    : 'N/A'}
                </Text>
              )}

              {/* স্পেসিফিক ফর (শুধু ভ্যালু থাকলে) */}
              {task.specificFor && task.specificForValue && (
                <Text style={tw`text-sm text-gray-600 mb-1`}>
                  F_ {task.specificForValue}_ {task.specificFor}
                </Text>
              )}

              {/* সাপ্তাহিক দিন (শুধু ভ্যালু থাকলে) */}
              {task.selectedDays?.length > 0 && (
                <Text style={tw`text-sm text-gray-600 mb-1`}>
                  Weekly: {task.selectedDays.join(', ')}
                </Text>
              )}

              {/* মাসিক তারিখ (শুধু ভ্যালু থাকলে) */}
              {task.selectedDate?.length > 0 && (
                <Text style={tw`text-sm text-gray-600 mb-1`}>
                  Monthly: {task.selectedDate.join(', ')}
                </Text>
              )}

              {/* বার্ষিক তারিখ (শুধু ভ্যালু থাকলে) */}
              {task.selectedDates?.length > 0 &&
                task.selectedMonths?.length > 0 && (
                  <Text style={tw`text-sm text-gray-600 mb-1`}>
                    Yearly: {task.selectedDates.join(', ')} -{' '}
                    {task.selectedMonths.join(', ')}
                  </Text>
                )}

              {expandedTaskId === task.id && (
                <View style={tw`mt-4`}>
                  {/* Specific For Section */}
                  <View style={tw`mb-4`}>
                    <Text style={tw`text-sm font-bold mb-2`}>Specific For</Text>
                    <View style={tw`flex-row items-center`}>
                      <Icon
                        name={
                          isSpecificForEnabled
                            ? 'radio-button-on'
                            : 'radio-button-off'
                        }
                        size={20}
                        color={isSpecificForEnabled ? 'blue' : 'gray'}
                      />
                      <TextInput
                        style={tw`border p-2 w-16 rounded`}
                        keyboardType="numeric"
                        value={editedTask.specificForValue?.toString()}
                        onChangeText={handleSpecificForChange}
                      />
                      <View style={tw`flex-row ml-2`}>
                        {['Days', 'Weeks', 'Months'].map(type => (
                          <TouchableOpacity
                            key={type}
                            style={tw`px-3 py-1 mx-1 rounded ${
                              editedTask.specificFor === type
                                ? 'bg-blue-500'
                                : 'bg-gray-300'
                            }`}
                            onPress={() =>
                              setEditedTask({
                                ...editedTask,
                                specificFor: type,
                              })
                            }>
                            <Text
                              style={tw`${
                                editedTask.specificFor === type
                                  ? 'text-white'
                                  : 'text-gray-700'
                              }`}>
                              {type}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  </View>

                  {/* Daily Target Section */}
                  <View style={tw`mb-4`}>
                    <Text style={tw`text-sm font-bold mb-2`}>Daily Target</Text>
                    <View style={tw`flex-row items-center`}>
                    <Icon
                        name={
                          isSpecificForEnabled
                            ? 'radio-button-on'
                            : 'radio-button-off'
                        }
                        size={20}
                        color={isSpecificForEnabled ? 'blue' : 'gray'}
                      />
                      <TextInput
                        style={tw`border p-2 w-16 rounded`}
                        keyboardType="numeric"
                        value={editedTask.dailyTarget?.toString()}
                        onChangeText={v =>
                          setEditedTask({
                            ...editedTask,
                            dailyTarget: parseInt(v) || 0,
                          })
                        }
                      />
                      <View style={tw`flex-row ml-2`}>
                        {['Minutes', 'Times'].map(type => (
                          <TouchableOpacity
                            key={type}
                            style={tw`px-3 py-1 mx-1 rounded ${
                              editedTask.targetType === type
                                ? 'bg-blue-500'
                                : 'bg-gray-300'
                            }`}
                            onPress={() =>
                              setEditedTask({
                                ...editedTask,
                                targetType: type,
                              })
                            }>
                            <Text
                              style={tw`${
                                editedTask.targetType === type
                                  ? 'text-white'
                                  : 'text-gray-700'
                              }`}>
                              {type}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  </View>

                  {/* Specific Days Section */}
                  <View style={tw`mb-4`}>
                    <Text style={tw`text-sm font-bold mb-2`}>
                      Specific Days
                    </Text>
                    <Icon
                        name={
                          isSpecificForEnabled
                            ? 'radio-button-on'
                            : 'radio-button-off'
                        }
                        size={20}
                        color={isSpecificForEnabled ? 'blue' : 'gray'}
                      />
                    {/* Weekly Days */}
                    <View style={tw`flex-row flex-wrap mb-2`}>
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
                        day => (
                          <TouchableOpacity
                            key={day}
                            style={tw`px-3 py-1 mx-1 my-1 rounded ${
                              editedTask.selectedDays?.includes(day)
                                ? 'bg-blue-500'
                                : 'bg-gray-300'
                            }`}
                            onPress={() => toggleDaySelection(day)}>
                            <Text
                              style={tw`${
                                editedTask.selectedDays?.includes(day)
                                  ? 'text-white'
                                  : 'text-gray-700'
                              }`}>
                              {day}
                            </Text>
                          </TouchableOpacity>
                        ),
                      )}
                    </View>

                    {/* Monthly Days */}
                    <Text style={tw`text-sm font-bold `}>Months</Text>
                    <TextInput
                      style={tw`border p-2 rounded mb-2`}
                      placeholder="Monthly days (e.g., 1,15)"
                      value={editedTask.selectedDate?.join(', ')}
                      onChangeText={v =>
                        setEditedTask({
                          ...editedTask,
                          selectedDate: v
                            .split(',')
                            .map(n => parseInt(n.trim()))
                            .filter(n => !isNaN(n)),
                        })
                      }
                    />
                  </View>
                  {/* Yearly Selection */}
                  <View style={tw`mb-4`}>
                    <Text style={tw`text-sm font-bold mb-2`}>
                      Yearly Selection
                    </Text>

                    {/* তারিখ সিলেকশন ইনপুট */}
                    <TextInput
                      placeholder="Enter dates (e.g. 1, 15)"
                      style={tw`border p-2 rounded mb-2`}
                      keyboardType="numeric"
                      value={editedTask.selectedDates?.join(', ') || ''}
                      onChangeText={text => {
                        const dates = text
                          .split(',')
                          .map(date => parseInt(date.trim()))
                          .filter(n => !isNaN(n) && n > 0 && n < 32); // ১-৩১ এর মধ্যে ভ্যালিডেশন
                        setEditedTask({...editedTask, selectedDates: dates});
                      }}
                    />

                    {/* মাস সিলেকশন বাটন */}
                    <View style={tw`flex-row flex-wrap`}>
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
                      ].map(month => (
                        <TouchableOpacity
                          key={month}
                          style={tw`px-3 py-1 mx-1 my-1 rounded ${
                            editedTask.selectedMonths?.includes(month)
                              ? 'bg-blue-500'
                              : 'bg-gray-300'
                          }`}
                          onPress={() => {
                            const updatedMonths =
                              editedTask.selectedMonths?.includes(month)
                                ? editedTask.selectedMonths.filter(
                                    (m: string) => m !== month,
                                  )
                                : [...(editedTask.selectedMonths || []), month];
                            setEditedTask({
                              ...editedTask,
                              selectedMonths: updatedMonths,
                            });
                          }}>
                          <Text
                            style={tw`${
                              editedTask.selectedMonths?.includes(month)
                                ? 'text-white'
                                : 'text-gray-700'
                            }`}>
                            {month}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  {/* Action Buttons */}
                  <View style={tw`flex-row justify-between mt-4`}>
                    <TouchableOpacity
                      style={tw`bg-red-500 px-6 py-2 rounded-lg`}
                      onPress={() => handleDelete(task.id)}>
                      <Text style={tw`text-white`}>Delete</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={tw`bg-green-500 px-6 py-2 rounded-lg`}
                      onPress={() => handleUpdateTask(task.id)}>
                      <Text style={tw`text-white`}>Save Changes</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <BottomNavigation />
    </View>
  );
};

export default AllTaskListScreen;
