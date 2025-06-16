import React, {useEffect, useState, useMemo} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
} from 'react-native';
import {s as tw} from 'react-native-wind';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomNavigation from './BottomNavigation';
import Icon from 'react-native-vector-icons/Ionicons';
import DayPicker from './DayPicker';
import DatePicker from './DatePicker';
import DateSelector from './DateSelector';
import {Keyboard} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {SafeAreaView} from 'react-native-safe-area-context';

interface Task {
  id: string;
  name: string;
  icon?: any;
  isStarred?: boolean;
  specificForValue?: number | string;
  specificFor?: 'Days' | 'Weeks' | 'Months';
  selectedDays?: string[];
  selectedDate?: number[];
  selectedDates?: number[];
  selectedMonths?: string[];
  selectedYears?: number[];
  dailyTarget?: number;
  targetType?: 'Minutes' | 'Times';
  specTarget?: 'Week' | 'Month' | 'Year';
}

const AllTaskListScreen = () => {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [editedTask, setEditedTask] = useState<any>({});
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [isSpecificForEnabled, setIsSpecificForEnabled] = useState(false);
  const [isDailyTargetEnabled, setIsDailyTargetEnabled] = useState(false);
  const [isSpecificDayOnSelected, setIsSpecificDayOnSelected] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isDayPickerVisible, setIsDayPickerVisible] = useState(false);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [isDateSelectorVisible, setIsDateSelectorVisible] = useState(false);
  const [successAction, setSuccessAction] = useState<
    'updated' | 'deleted' | null
  >(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showSuccessModal) {
      timer = setTimeout(() => {
        setShowSuccessModal(false);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [showSuccessModal]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setIsKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setIsKeyboardVisible(false);
      },
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

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

  // Check if the edited task has changes compared to the original
  const hasChanges = useMemo(() => {
    if (!expandedTaskId) return false;

    const originalTask = tasks.find(t => t.id === expandedTaskId);
    if (!originalTask) return false;

    const fieldsToCompare = [
      'specificForValue',
      'specificFor',
      'selectedDays',
      'selectedDate',
      'selectedDates',
      'selectedMonths',
      'dailyTarget',
      'targetType',
      'specTarget',
    ];

    return fieldsToCompare.some(field => {
      return (
        JSON.stringify(originalTask[field]) !==
        JSON.stringify(editedTask[field])
      );
    });
  }, [editedTask, expandedTaskId, tasks]);

  const toggleExpansion = (taskId: string) => {
    setExpandedTaskId(prev => (prev === taskId ? null : taskId));
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      let specTarget = task.specTarget;
      if (!specTarget) {
        if (task.selectedDays?.length) specTarget = 'Week';
        else if (task.selectedDate?.length) specTarget = 'Month';
        else if (task.selectedDates?.length && task.selectedMonths?.length)
          specTarget = 'Year';
      }

      setEditedTask({
        ...task,
        specTarget,
      });

      setIsSpecificForEnabled(!!task.specificForValue);
      setIsDailyTargetEnabled(!!task.dailyTarget);
      setIsSpecificDayOnSelected(
        !!task.selectedDays?.length ||
          !!task.selectedDate?.length ||
          !!task.selectedDates?.length ||
          !!task.selectedMonths?.length,
      );
    }
  };

  const handleUpdateTask = async (taskId: string) => {
    try {
      const updatedTasks = tasks.map(task =>
        task.id === taskId ? {...editedTask, isStarred: task.isStarred} : task,
      );
      await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
      setTasks(updatedTasks);
      setExpandedTaskId(null);
      setSuccessAction('updated');
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const toggleSpecificFor = () => {
    const newState = !isSpecificForEnabled;
    setIsSpecificDayOnSelected(false);

    setEditedTask((prev: Task) => ({
      ...prev,
      selectedDays: [],
      selectedDate: [],
      selectedDates: [],
      selectedMonths: [],
      specificForValue: newState ? prev.specificForValue : '',
      specificFor: newState ? prev.specificFor : 'Days',
    }));

    setIsSpecificForEnabled(newState);
  };

  const toggleDailyTarget = () => {
    const newState = !isDailyTargetEnabled;
    setIsDailyTargetEnabled(newState);

    if (!newState) {
      setEditedTask((prev: Task) => ({
        ...prev,
        dailyTarget: 0,
        targetType: 'Minutes',
      }));
    }
  };

  const handleWeeklyClick = () => {
    setIsDayPickerVisible(true);
    setIsDatePickerVisible(false);
    setIsDateSelectorVisible(false);
  };

  const handleMonthlyClick = () => {
    setIsDatePickerVisible(true);
    setIsDayPickerVisible(false);
    setIsDateSelectorVisible(false);
  };

  const handleYearlyClick = () => {
    setIsDateSelectorVisible(true);
    setIsDayPickerVisible(false);
    setIsDatePickerVisible(false);
  };

  const toggleSpecificDayOn = () => {
    const newState = !isSpecificDayOnSelected;
    setIsSpecificForEnabled(false);

    setEditedTask((prev: Task) => ({
      ...prev,
      specificForValue: '',
      specificFor: 'Days',
      dailyTarget: 0,
      targetType: 'Minutes',
      selectedDays: newState ? prev.selectedDays : [],
      selectedDate: newState ? prev.selectedDate : [],
      selectedDates: newState ? prev.selectedDates : [],
      selectedMonths: newState ? prev.selectedMonths : [],
    }));

    setIsSpecificDayOnSelected(newState);
  };

  const handleTaskLongPress = (taskId: string) => {
    setTaskToDelete(taskId);
    setDeleteModalVisible(true);
  };

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
              style={tw`flex-1 bg-gray-300 py-2  rounded-lg`}
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
                setSuccessAction('deleted');
                setShowSuccessModal(true);
              }}>
              <Text style={tw`text-white text-center`}>Yes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={tw`flex-1 bg-blue-500`}>
      <View style={[tw`flex-1 `, {backgroundColor: '#F7FAFF'}]}>
        <DeleteConfirmationModal />
        {/* Success Modal */}
        <Modal
          visible={showSuccessModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowSuccessModal(false)}>
          <View
            style={[
              tw`flex-1 justify-center items-center`,
              {backgroundColor: 'rgba(53, 128, 255, 0.2)'},
            ]}>
            <View
              style={tw`flex-row items-center bg-blue-500 rounded-full px-6 py-3`}>
              {/* Dynamic Icon with different size for 'deleted' */}
              <Image
                source={
                  successAction === 'updated'
                    ? require('../../assets/images/Notification/UpdatedIcon.png')
                    : require('../../assets/images/Notification/RemovedIcon.png')
                }
                style={[
                  tw`mr-3`,
                  {
                    width: successAction === 'deleted' ? 40 : 48,
                    height: successAction === 'deleted' ? 48 : 48,
                  },
                ]}
              />

              {/* Texts */}
              <View>
                <Text style={tw`text-white font-semibold text-base`}>
                  {successAction === 'updated'
                    ? 'Task Updated!'
                    : 'Task Removed!'}
                </Text>
                <Text style={tw`text-white text-xs`}>
                  {successAction === 'updated'
                    ? 'Your changes have been applied'
                    : 'The task has been deleted'}
                </Text>
              </View>
            </View>
          </View>
        </Modal>
        <View style={tw`mb-4 top-6 left-4 mx-2`}>
          <Text style={tw`text-xl font-bold `}>Manage My Task </Text>
          <Text
            style={[
              tw`font-normal `,
              {
                fontSize: 11,
                color: '#8D99AE',
                lineHeight: 20,
                letterSpacing: 1,
              },
            ]}>
            Your all the added running tasks list.
          </Text>
        </View>

        {loading ? (
          <Text style={tw`text-center text-gray-500`}>Loading...</Text>
        ) : (
          <ScrollView contentContainerStyle={tw`pb-20 top-2`}>
            {tasks.map(task => (
              <TouchableOpacity
                key={task.id}
                onLongPress={() => handleTaskLongPress(task.id)}
                activeOpacity={0.8}
                style={tw`bg-white p-2 mx-4 mb-3 top-6 rounded-lg`}>
                <View style={tw`flex-row justify-between items-center`}>
                  {/* Left Section - Image & Name */}
                  <View style={tw`flex-row items-center flex-shrink`}>
                    {task.icon && (
                      <Image
                        source={task.icon}
                        style={[tw`mr-4`, {width: 30, height: 30}]}
                      />
                    )}
                    <Text
                      style={[
                        tw`font-medium`,
                        {color: '#2B2D42', fontSize: 14},
                      ]}>
                      {task.name}
                    </Text>
                  </View>

                  {/* Right Section - Tags & Icons */}
                  <View style={tw`flex-row items-center gap-4 flex-shrink`}>
                    {/* Daily Tags */}
                    <View style={tw`flex-row items-center right-4`}>
                      {/* ডেইলি রুটিন ট্যাগ */}
                      {/* {!task.specificForValue && // এই লাইনটি যোগ করুন
                      !task.scheduleType &&
                      !task.endDate &&
                      !task.selectedDays?.length &&
                      !task.selectedDate?.length &&
                      !task.selectedDates?.length &&
                      !task.selectedMonths?.length && (
                        <Text
                          style={[tw`text-xs font-normal`, {color: '#2B2D42'}]}>
                          Daily
                        </Text>
                      )} */}
                      {/* স্পেসিফিক ফর (শুধু ভ্যালু থাকলে) */}
                      {/* {task.specificFor && task.specificForValue && (
                      <Text
                        style={[tw`text-xs font-normal`, {color: '#2B2D42'}]}>
                        F_ {task.specificForValue}_ {task.specificFor}
                      </Text>
                    )} */}

                      {/* সাপ্তাহিক দিন */}
                      {/* {task.selectedDays?.length > 0 && (
                      <Text
                        style={[tw`text-xs font-normal`, {color: '#2B2D42'}]}>
                        {task.selectedDays.join(', ')}_E_Week
                      </Text>
                    )} */}

                      {/* মাসিক তারিখ */}
                      {/* {task.selectedDate?.length > 0 && (
                      <Text
                        style={[tw`text-xs font-normal`, {color: '#2B2D42'}]}>
                        Monthly
                      </Text>
                    )} */}

                      {/* বার্ষিক তারিখ */}
                      {/* {task.selectedDates?.length > 0 &&
                      task.selectedMonths?.length > 0 && (
                        <Text
                          style={[tw`text-xs font-normal`, {color: '#2B2D42'}]}>
                          Yearly
                        </Text>
                      )} */}
                    </View>

                    {/* Edit & Star Icons */}
                    <View style={tw`flex-row items-center gap-2`}>
                      {expandedTaskId === task.id && (
                        <TouchableOpacity onPress={() => toggleStar(task.id)}>
                          <Icon
                            name={task.isStarred ? 'star' : 'star-outline'}
                            size={20}
                            color={task.isStarred ? '#3580FF' : 'gray'}
                          />
                        </TouchableOpacity>
                      )}
                      <TouchableOpacity
                        onPress={() => toggleExpansion(task.id)}
                        style={tw`right-2`}>
                        {expandedTaskId === task.id ? (
                          <Icon name="" size={20} color="#DFDFDF" />
                        ) : (
                          <Image
                            source={require('../../assets/images/EditTaskIcon.png')}
                            style={{
                              width: 20,
                              height: 20,
                              tintColor: '#8D99AE',
                            }}
                          />
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                {expandedTaskId === task.id && (
                  <View style={tw`mt-4`}>
                    {/* Specific For Section */}
                    <View style={tw`mb-2`}>
                      <View style={tw`flex-row items-center mb-4`}>
                        {/* Radio Toggle */}
                        <TouchableOpacity onPress={toggleSpecificFor}>
                          <Icon
                            name={
                              isSpecificForEnabled
                                ? 'radio-button-on'
                                : 'radio-button-off'
                            }
                            size={24}
                            color={isSpecificForEnabled ? '#3580FF' : 'gray'}
                          />
                        </TouchableOpacity>

                        {/* Label */}
                        <Text
                          style={[
                            tw`font-normal text-gray-500 `,
                            {fontSize: 12, letterSpacing: .5},
                          ]}>
                          Add specific for
                        </Text>

                        {/* Numeric Input */}
                        <TextInput
                          style={[
                            tw` px-1 py-1 border rounded text-center`,
                            {
                              borderColor: '#E3E8F1',
                              width: 30,
                              height: 23,
                              fontSize: 12,
                              letterSpacing: 1,
                              backgroundColor: !isSpecificForEnabled
                                ? '#F3F4F6'
                                : 'white',
                              color: 'black',
                            },
                          ]}
                          keyboardType="numeric"
                          placeholder="00"
                          placeholderTextColor="#8D99AE"
                          value={
                            isSpecificForEnabled
                              ? editedTask.specificForValue?.toString()
                              : ''
                          }
                          onChangeText={v =>
                            setEditedTask({
                              ...editedTask,
                              specificForValue: parseInt(v) || 0,
                            })
                          }
                          editable={isSpecificForEnabled}
                          maxLength={2}
                        />

                        {/* Button Group */}
                        <LinearGradient
                          colors={['#F7FAFF', '#DEEAFF']}
                          start={{x: 0, y: 0}}
                          end={{x: 0, y: 1}}
                          style={[
                            tw`flex-row rounded-full ml-1`,
                            {width: 167, height: 30},
                          ]}>
                          {['Days', 'Weeks', 'Months'].map(type => {
                            const isSelected =
                              editedTask.specificFor === type &&
                              isSpecificForEnabled;

                            return (
                              <TouchableOpacity
                                key={type}
                                style={tw`px-2 py-1 rounded-full ${
                                  isSelected
                                    ? 'bg-blue-500 border border-blue-500'
                                    : ''
                                }`}
                                onPress={() =>
                                  isSpecificForEnabled &&
                                  setEditedTask({
                                    ...editedTask,
                                    specificFor: type,
                                  })
                                }
                                disabled={!isSpecificForEnabled}>
                                <Text
                                  style={tw`text-sm ${
                                    isSelected
                                      ? 'text-white font-semibold'
                                      : 'text-gray-500'
                                  }`}>
                                  {type}
                                </Text>
                              </TouchableOpacity>
                            );
                          })}
                        </LinearGradient>
                      </View>
                    </View>
                    {/* Add Specific Day On */}
                    <View style={tw`mb-2 bottom-2`}>
                      <View style={tw`flex-row items-center mb-4`}>
                        <TouchableOpacity onPress={toggleSpecificDayOn}>
                          <Icon
                            name={
                              isSpecificDayOnSelected
                                ? 'radio-button-on'
                                : 'radio-button-off'
                            }
                            size={24}
                            color={isSpecificDayOnSelected ? '#3580FF' : 'gray'}
                          />
                        </TouchableOpacity>

                        <Text
                          style={[
                            tw`font-normal text-gray-500 `,
                            {fontSize: 12, letterSpacing: .1},
                          ]}>
                          Add Specific Day On
                        </Text>

                        {/* Weekly, Monthly, Yearly Button Group */}
                        <LinearGradient
                          colors={['#F7FAFF', '#DEEAFF']}
                          start={{x: 0, y: 0}}
                          end={{x: 0, y: 1}}
                          style={[
                            tw`flex-row rounded-full ml-1`,
                            {width: 180, height: 30, padding: 1},
                          ]}>
                          {['Week', 'Month', 'Year'].map(type => {
                            const isSelected = editedTask.specTarget === type;
                            return (
                              <TouchableOpacity
                                key={type}
                                style={tw`px-3 py-1 rounded-full ${
                                  isSelected
                                    ? 'bg-blue-500 border border-blue-500'
                                    : ''
                                }`}
                                disabled={!isSpecificDayOnSelected}
                                onPress={() => {
                                  const handler = {
                                    Week: handleWeeklyClick,
                                    Month: handleMonthlyClick,
                                    Year: handleYearlyClick,
                                  }[type];

                                  handler?.();
                                  setEditedTask({
                                    ...editedTask,
                                    specTarget: type,
                                    ...(type === 'Week' && {
                                      selectedDate: [],
                                      selectedDates: [],
                                      selectedMonths: [],
                                    }),
                                    ...(type === 'Month' && {
                                      selectedDays: [],
                                      selectedDates: [],
                                      selectedMonths: [],
                                    }),
                                    ...(type === 'Year' && {
                                      selectedDays: [],
                                      selectedDate: [],
                                    }),
                                  });
                                }}>
                                <Text
                                  style={tw`text-sm ${
                                    isSelected
                                      ? 'text-white font-semibold'
                                      : 'text-gray-500'
                                  }`}>
                                  {type}
                                </Text>
                              </TouchableOpacity>
                            );
                          })}
                        </LinearGradient>
                      </View>
                    </View>
                    {/* Set Daily Target */}
                    <View style={tw`mb-3 bottom-4`}>
                      <View style={tw`flex-row items-center`}>
                        <TouchableOpacity onPress={toggleDailyTarget}>
                          <Icon
                            name={
                              isDailyTargetEnabled
                                ? 'checkbox-outline'
                                : 'square-outline'
                            }
                            size={24}
                            color={isDailyTargetEnabled ? '#3580FF' : 'gray'}
                          />
                        </TouchableOpacity>

                        <Text
                          style={[
                            tw`font-normal text-gray-500 ml-1`,
                            {fontSize: 12, letterSpacing: 1},
                          ]}>
                          Set Daily Target
                        </Text>

                        {/* Target Input */}
                        <TextInput
                          style={[
                            tw`ml-2 text-center rounded`,
                            {
                              borderWidth: 1,
                              borderColor: '#E3E8F1',
                              width: 40,
                              height: 23,
                              fontSize: 12,
                              fontWeight: 400,
                              color: isDailyTargetEnabled ? '#000' : '#999',
                              backgroundColor: isDailyTargetEnabled
                                ? '#fff'
                                : '#F3F4F6',
                              paddingVertical: 0, // ✅ Remove extra space
                              textAlignVertical: 'center', // ✅ Vertically center
                            },
                          ]}
                          keyboardType="numeric"
                          placeholder="000"
                          placeholderTextColor="#8D99AE"
                          value={
                            isDailyTargetEnabled
                              ? editedTask.dailyTarget?.toString() ?? ''
                              : ''
                          }
                          onChangeText={v =>
                            setEditedTask({
                              ...editedTask,
                              dailyTarget: parseInt(v) || 0,
                            })
                          }
                          editable={isDailyTargetEnabled}
                          maxLength={3}
                        />

                        {/* Type Selector */}
                        <LinearGradient
                          colors={['#F7FAFF', '#DEEAFF']}
                          start={{x: 0, y: 0}}
                          end={{x: 0, y: 1}}
                          style={[
                            tw`flex-row rounded-full ml-2`,
                            {height: 30, alignItems: 'center'},
                          ]}>
                          {['Minutes', 'Times'].map(type => {
                            const isSelected =
                              editedTask.targetType === type &&
                              isDailyTargetEnabled;

                            return (
                              <TouchableOpacity
                                key={type}
                                style={tw`px-3 py-1 rounded-full ${
                                  isSelected
                                    ? 'bg-blue-500 border border-blue-500'
                                    : ''
                                }`}
                                onPress={() =>
                                  isDailyTargetEnabled &&
                                  setEditedTask({
                                    ...editedTask,
                                    targetType: type,
                                  })
                                }
                                disabled={!isDailyTargetEnabled}>
                                <Text
                                  style={tw`text-sm ${
                                    isSelected
                                      ? 'text-white font-semibold'
                                      : 'text-gray-500'
                                  }`}>
                                  {type}
                                </Text>
                              </TouchableOpacity>
                            );
                          })}
                        </LinearGradient>
                      </View>
                    </View>

                    {/* Action Buttons */}
                    <View style={tw`flex-row justify-between `}>
                      <TouchableOpacity
                        style={[
                          tw`py-2 rounded-full left-8`,
                          hasChanges
                            ? tw`bg-blue-500 px-24`
                            : tw`bg-blue-500 px-28`,
                        ]}
                        onPress={() => {
                          if (hasChanges) {
                            handleUpdateTask(task.id);
                          } else {
                            setExpandedTaskId(null);
                          }
                        }}>
                        <Text style={tw`text-white font-bold`}>
                          {hasChanges ? 'Update Task' : 'Skip'}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={tw`top-4`}
                        onPress={() => toggleExpansion(task.id)}>
                        <Icon
                          name={
                            expandedTaskId === task.id
                              ? 'chevron-down'
                              : 'create-outline'
                          }
                          size={20}
                          color="#4b5563"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
        {/* Modals */}
        {isDayPickerVisible && (
          <DayPicker
            selectedDays={editedTask.selectedDays || []}
            onSelectDays={days =>
              setEditedTask({...editedTask, selectedDays: days})
            }
            onCancel={() => setIsDayPickerVisible(false)}
            onAddDay={() => setIsDayPickerVisible(false)}
          />
        )}

        {isDatePickerVisible && (
          <DatePicker
            selectedDate={editedTask.selectedDate || []}
            onSelectDate={dates =>
              setEditedTask({...editedTask, selectedDate: dates})
            }
            onCancel={() => setIsDatePickerVisible(false)}
            onAddDay={() => setIsDatePickerVisible(false)}
          />
        )}

        {isDateSelectorVisible && (
          <DateSelector
          year={editedTask.year}
            selectedDates={editedTask.selectedDates || []}
            selectedMonths={editedTask.selectedMonths || []}
            onSelectDate={date =>
              setEditedTask({
                ...editedTask,
                selectedDates: [...(editedTask.selectedDates || []), date],
              })
            }
            onSelectMonth={month =>
              setEditedTask({
                ...editedTask,
                selectedMonths: [...(editedTask.selectedMonths || []), month],
              })
            }
            onCancel={() => setIsDateSelectorVisible(false)}
            onAddDay={newDates => {
              setEditedTask({
                ...editedTask,
                selectedDates: newDates.map(d => d.date),
                selectedMonths: newDates.map(d => d.month),
              });
              setIsDateSelectorVisible(false);
            }}
            onRemoveDay={index => {
              const newDates = [...editedTask.selectedDates];
              const newMonths = [...editedTask.selectedMonths];
              newDates.splice(index, 1);
              newMonths.splice(index, 1);
              setEditedTask({
                ...editedTask,
                selectedDates: newDates,
                selectedMonths: newMonths,
              });
            }}
          />
        )}

        {!isKeyboardVisible && <BottomNavigation />}
      </View>
    </SafeAreaView>
  );
};

export default AllTaskListScreen;
