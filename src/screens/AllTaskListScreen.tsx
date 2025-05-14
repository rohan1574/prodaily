import React, {useEffect, useState} from 'react';
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
// Add at the top with other imports
import {Keyboard} from 'react-native';
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
  specTarget?: 'Weekly' | 'Monthly' | 'Yearly';
}
const AllTaskListScreen = () => {
  // Add this state
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  // Add this useEffect
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

  // মোডাল টাইমার
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showSuccessModal) {
      timer = setTimeout(() => {
        setShowSuccessModal(false);
      }, 1000); // 10 seconds
    }
    return () => clearTimeout(timer);
  }, [showSuccessModal]);
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
    if (task) {
      // Determine specTarget based on existing data
      let specTarget = task.specTarget;
      if (!specTarget) {
        if (task.selectedDays?.length) specTarget = 'Weekly';
        else if (task.selectedDate?.length) specTarget = 'Monthly';
        else if (task.selectedDates?.length && task.selectedMonths?.length)
          specTarget = 'Yearly';
      }

      setEditedTask({
        ...task,
        specTarget, // Add inferred specTarget
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
  // সেভ বাটনের হ্যান্ডলারে যোগ করুন
  const handleUpdateTask = async (taskId: string) => {
    try {
      const updatedTasks = tasks.map(task =>
        task.id === taskId ? {...editedTask, isStarred: task.isStarred} : task,
      );
      await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
      setTasks(updatedTasks);
      setExpandedTaskId(null);
      setShowSuccessModal(true); // মোডাল দেখান
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  // রেডিও বাটন টগল লজিক আপডেট করুন
  const toggleSpecificFor = () => {
    const newState = !isSpecificForEnabled;

    // অন্য সেকশন ডিসেবল করুন এবং ডেটা রিসেট করুন
    setIsSpecificDayOnSelected(false);

    setEditedTask((prev: Task) => ({
      ...prev,
      // ডেইলি টার্গেট এবং স্পেসিফিক ডে অন ডেটা রিসেট
      selectedDays: [],
      selectedDate: [],
      selectedDates: [],
      selectedMonths: [],
      // বর্তমান সেকশনের ডেটা আপডেট
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

  const toggleSpecificDayOn = () => {
    const newState = !isSpecificDayOnSelected;

    // অন্য সেকশন ডিসেবল করুন এবং ডেটা রিসেট করুন
    setIsSpecificForEnabled(false);
    setEditedTask((prev: Task) => ({
      ...prev,
      // স্পেসিফিক ফর এবং ডেইলি টার্গেট ডেটা রিসেট
      specificForValue: '',
      specificFor: 'Days',
      dailyTarget: 0,
      targetType: 'Minutes',
      // বর্তমান সেকশনের ডেটা আপডেট
      selectedDays: newState ? prev.selectedDays : [],
      selectedDate: newState ? prev.selectedDate : [],
      selectedDates: newState ? prev.selectedDates : [],
      selectedMonths: newState ? prev.selectedMonths : [],
    }));

    setIsSpecificDayOnSelected(newState);
  };

  const toggleDaySelection = (day: string) => {
    const updatedDays = editedTask.selectedDays?.includes(day)
      ? editedTask.selectedDays.filter((d: string) => d !== day)
      : [...(editedTask.selectedDays || []), day];

    setEditedTask({...editedTask, selectedDays: updatedDays});
  };

  const handleMonthSelection = (month: string) => {
    const updatedMonths = editedTask.selectedMonths?.includes(month)
      ? editedTask.selectedMonths.filter((m: string) => m !== month)
      : [...(editedTask.selectedMonths || []), month];

    setEditedTask({...editedTask, selectedMonths: updatedMonths});
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
                setShowSuccessModal(true);
              }}>
              <Text style={tw`text-white text-center`}>Yes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
  // তারিখ টগল করার লজিক - টাইপ সংযোজন করুন
  const toggleDateSelection = (date: number) => {
    const updatedDates = editedTask.selectedDates?.includes(date)
      ? editedTask.selectedDates.filter((d: number) => d !== date)
      : [...(editedTask.selectedDates || []), date];

    setEditedTask({
      ...editedTask,
      selectedDates: updatedDates.sort((a: number, b: number) => a - b), // এখানে টাইপ ডিক্লেয়ার করুন
    });
  };

  // ১-৩১ তারিখের লিস্ট কম্পোনেন্ট
  const DateGridList = () => (
    <ScrollView
      horizontal={false}
      style={tw`max-h-40`}
      showsVerticalScrollIndicator={false}>
      <View style={tw`flex-row flex-wrap justify-between`}>
        {Array.from({length: 31}, (_, i) => i + 1).map(date => (
          <TouchableOpacity
            key={date}
            style={tw`w-8 h-8 m-1 rounded-full items-center justify-center ${
              editedTask.selectedDates?.includes(date)
                ? 'bg-blue-500'
                : 'bg-gray-200'
            }`}
            onPress={() => toggleDateSelection(date)}>
            <Text
              style={tw`${
                editedTask.selectedDates?.includes(date)
                  ? 'text-white font-bold'
                  : 'text-gray-700'
              }`}>
              {date}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
  return (
    <View style={[tw`flex-1 `, {backgroundColor: '#F7FAFF'}]}>
      <DeleteConfirmationModal />
      <View style={tw`mb-4 top-2 left-4 mx-2`}>
        <Text style={tw`text-2xl font-bold `}>Manage My Task </Text>
        <Text style={[tw` `, {fontSize: 16, color: '#8D99AE'}]}>
          Your all the added running tasks list.
        </Text>
      </View>

      {loading ? (
        <Text style={tw`text-center text-gray-500`}>Loading...</Text>
      ) : (
        <ScrollView>
          {tasks.map(task => (
            <TouchableOpacity
              key={task.id}
              onLongPress={() => handleTaskLongPress(task.id)}
              activeOpacity={0.8}
              style={tw`bg-white p-3 mx-4 mb-3 top-6 rounded-lg`}>
              <View style={tw`flex-row justify-between items-center`}>
                {/* Left Section - Image & Name */}
                <View style={tw`flex-row items-center flex-shrink`}>
                  {task.icon && (
                    <Image
                      source={task.icon}
                      style={[tw`mr-6`, {width: 28, height: 28}]}
                    />
                  )}
                  <Text style={tw`text-lg font-semibold`}>{task.name}</Text>
                </View>

                {/* Right Section - Tags & Icons */}
                <View style={tw`flex-row items-center gap-4 flex-shrink`}>
                  {/* Daily Tags */}
                  <View style={tw`flex-row items-center right-4`}>
                    {/* ডেইলি রুটিন ট্যাগ */}
                    {/* ডেইলি রুটিন ট্যাগ */}
                    {!task.specificForValue && // এই লাইনটি যোগ করুন
                      !task.scheduleType &&
                      !task.endDate &&
                      !task.selectedDays?.length &&
                      !task.selectedDate?.length &&
                      !task.selectedDates?.length &&
                      !task.selectedMonths?.length && (
                        <Text style={tw`text-sm text-green-700`}>Daily</Text>
                      )}
                    {/* স্পেসিফিক ফর (শুধু ভ্যালু থাকলে) */}
                    {task.specificFor && task.specificForValue && (
                      <Text style={tw`text-sm text-gray-600 mb-1`}>
                        F_ {task.specificForValue}_ {task.specificFor}
                      </Text>
                    )}

                    {/* সাপ্তাহিক দিন */}
                    {task.selectedDays?.length > 0 && (
                      <Text style={tw`text-sm text-gray-600`}>
                        {task.selectedDays.join(', ')}_E_Week
                      </Text>
                    )}

                    {/* মাসিক তারিখ */}
                    {task.selectedDate?.length > 0 && (
                      <Text style={tw`text-sm text-gray-600`}>Monthly</Text>
                    )}

                    {/* বার্ষিক তারিখ */}
                    {task.selectedDates?.length > 0 &&
                      task.selectedMonths?.length > 0 && (
                        <Text style={tw`text-sm text-gray-600`}>Yearly</Text>
                      )}
                  </View>

                  {/* Edit & Star Icons */}
                  <View style={tw`flex-row items-center gap-2`}>
                    {expandedTaskId === task.id && (
                      <TouchableOpacity onPress={() => toggleStar(task.id)}>
                        <Icon
                          name={task.isStarred ? 'star' : 'star-outline'}
                          size={24}
                          color={task.isStarred ? 'gold' : 'gray'}
                        />
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity onPress={() => toggleExpansion(task.id)}>
                      <Icon
                        name={
                          expandedTaskId === task.id ? '' : 'create-outline'
                        }
                        size={24}
                        color="#4b5563"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <Modal
                visible={showSuccessModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowSuccessModal(false)}>
                <View
                  style={tw`flex-1 justify-center items-center bg-black bg-opacity-30`}>
                  <View
                    style={tw`flex-row items-center bg-green-500 rounded-full px-6 py-3`}>
                    <Icon
                      name="checkmark-circle-outline"
                      size={28}
                      color="white"
                      style={tw`mr-3`}
                    />
                    <View>
                      <Text style={tw`text-white font-semibold text-base`}>
                        Update Saved!
                      </Text>
                      <Text style={tw`text-white text-xs`}>
                        Your changes have been applied successfully
                      </Text>
                    </View>
                  </View>
                </View>
              </Modal>
              {/* Move this outside of the ScrollView/map loop */}
              <Modal
                visible={showSuccessModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowSuccessModal(false)}>
                <View
                  style={tw`flex-1 justify-center items-center bg-black bg-opacity-30`}>
                  <View
                    style={tw`flex-row items-center bg-green-500 rounded-full px-6 py-3`}>
                    <Icon
                      name="checkmark-circle-outline"
                      size={28}
                      color="white"
                      style={tw`mr-3`}
                    />
                    <View>
                      <Text style={tw`text-white font-semibold text-base`}>
                        Action Successful!
                      </Text>
                      <Text style={tw`text-white text-xs`}>
                        Your changes have been applied
                      </Text>
                    </View>
                  </View>
                </View>
              </Modal>
              {expandedTaskId === task.id && (
                <View style={tw`mt-4`}>
                  {/* Specific For Section */}
                  <View style={tw`mb-6`}>
                    <View style={tw`flex-row items-center`}>
                      <TouchableOpacity onPress={toggleSpecificFor}>
                        <Icon
                          name={
                            isSpecificForEnabled
                              ? 'radio-button-on'
                              : 'radio-button-off'
                          }
                          size={20}
                          color={isSpecificForEnabled ? 'blue' : 'gray'}
                        />
                      </TouchableOpacity>
                      <Text style={tw`text-xs font-bold text-gray-500`}>
                        Add Specific for
                      </Text>
                      <TextInput
                        style={[
                          tw`border rounded mx-2 ${
                            !isSpecificForEnabled ? 'bg-gray-100' : ''
                          }`,
                          {width: 32, height: 36},
                        ]}
                        keyboardType="numeric"
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
                        placeholder="0"
                      />
                      <View style={tw`flex-row bg-blue-100 rounded-full p-1`}>
                        {['Days', 'Weeks', 'Months'].map(type => {
                          const isSelected =
                            editedTask.specificFor === type &&
                            isSpecificForEnabled;
                          return (
                            <TouchableOpacity
                              key={type}
                              style={tw`px-2 py-1 mx- rounded-full ${
                                isSelected
                                  ? 'bg-white border border-blue-500'
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
                                    ? 'text-blue-500 font-semibold'
                                    : 'text-gray-500'
                                }`}>
                                {type}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    </View>
                  </View>
                  {/* Daily Target Section */}
                  <View style={tw`mb-6`}>
                    <View style={tw`flex-row items-center`}>
                      <TouchableOpacity onPress={toggleDailyTarget}>
                        <Icon
                          name={
                            isDailyTargetEnabled
                              ? 'radio-button-on'
                              : 'radio-button-off'
                          }
                          size={20}
                          color={isDailyTargetEnabled ? 'blue' : 'gray'}
                        />
                      </TouchableOpacity>
                      <Text style={tw`text-xs font-bold text-gray-500`}>
                        Set Daily Target
                      </Text>
                      <TextInput
                        style={[
                          tw`border p-2  rounded mx-2
                          ${!isDailyTargetEnabled ? 'bg-gray-100' : ''}`,
                          {width: 32, height: 36},
                        ]}
                        keyboardType="numeric"
                        value={
                          isDailyTargetEnabled
                            ? editedTask.dailyTarget?.toString()
                            : ''
                        }
                        onChangeText={v =>
                          setEditedTask({
                            ...editedTask,
                            dailyTarget: parseInt(v) || 0,
                          })
                        }
                        editable={isDailyTargetEnabled}
                        placeholder="0"
                      />
                      <View style={tw`flex-row bg-blue-100 rounded-full p-1`}>
                        {['Minutes', 'Times'].map(type => {
                          const isSelected =
                            editedTask.targetType === type &&
                            isDailyTargetEnabled;

                          return (
                            <TouchableOpacity
                              key={type}
                              style={tw`px-3 py-1 mx-1 rounded-full ${
                                isSelected
                                  ? 'bg-white border border-blue-500'
                                  : 'bg-gray-200'
                              }`}
                              onPress={() =>
                                isDailyTargetEnabled &&
                                setEditedTask({...editedTask, targetType: type})
                              }
                              disabled={!isDailyTargetEnabled}>
                              <Text
                                style={tw`text-sm ${
                                  isSelected
                                    ? 'text-blue-500 font-semibold'
                                    : 'text-gray-500'
                                }`}>
                                {type}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    </View>
                  </View>
                  {/* Specific Day On Section */}
                  <View style={tw`mb-6`}>
                    <View style={tw`flex-row items-center mb-4`}>
                      <TouchableOpacity onPress={toggleSpecificDayOn}>
                        <Icon
                          name={
                            isSpecificDayOnSelected
                              ? 'radio-button-on'
                              : 'radio-button-off'
                          }
                          size={20}
                          color={isSpecificDayOnSelected ? 'blue' : 'gray'}
                        />
                      </TouchableOpacity>
                      <Text style={tw`text-xs font-bold text-gray-500`}>
                        Specific Day On
                      </Text>
                      {/* Weekly, Monthly, Yearly বাটনগুলির জন্য কোড */}
                      <View
                        style={[
                          tw`flex-row bg-blue-100 rounded-full p-1 mx-1`,
                          {width: 228},
                        ]}>
                        {['Weekly', 'Monthly', 'Yearly'].map(type => {
                          const isSelected = editedTask.specTarget === type;
                          return (
                            <TouchableOpacity
                              key={type}
                              style={[
                                tw`px-3 py-1 rounded-full mr-1`,
                                isSelected
                                  ? tw`bg-white border border-blue-500`
                                  : 'bg-blue-500',
                                !isSpecificDayOnSelected && tw`bg-gray-300`, // Disable if isSpecificDayOnSelected is false
                              ]}
                              disabled={!isSpecificDayOnSelected}
                              onPress={() => {
                                const updatedTask: Task = {
                                  ...editedTask,
                                  specTarget: type,
                                  // Reset logic
                                  ...(type === 'Weekly' && {
                                    selectedDate: [],
                                    selectedDates: [],
                                    selectedMonths: [],
                                  }),
                                  ...(type === 'Monthly' && {
                                    selectedDays: [],
                                    selectedDates: [],
                                    selectedMonths: [],
                                  }),
                                  ...(type === 'Yearly' && {
                                    selectedDays: [],
                                    selectedDate: [],
                                  }),
                                };
                                setEditedTask(updatedTask);
                              }}>
                              <Text
                                style={tw`text-sm ${
                                  isSelected
                                    ? 'text-blue-500 font-semibold'
                                    : 'text-gray-500'
                                }`}>
                                {type}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    </View>
                    {isSpecificDayOnSelected && (
                      <>
                        {editedTask.specTarget === 'Weekly' && (
                          <View style={tw`flex-row flex-wrap`}>
                            {[
                              'Sun',
                              'Mon',
                              'Tue',
                              'Wed',
                              'Thu',
                              'Fri',
                              'Sat',
                            ].map(day => (
                              <TouchableOpacity
                                key={day}
                                style={tw`px-3 py-1 mx-1 my-1 rounded ${
                                  editedTask.selectedDays?.includes(day)
                                    ? 'bg-blue-500'
                                    : 'bg-gray-200'
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
                            ))}
                          </View>
                        )}
                        {editedTask.specTarget === 'Monthly' && (
                          <View>
                            <Text style={tw`text-gray-600 mb-2`}>
                              Select dates:
                            </Text>
                            <ScrollView
                              horizontal={false}
                              style={tw`max-h-40`}
                              showsVerticalScrollIndicator={false}>
                              <View
                                style={tw`flex-row flex-wrap justify-between`}>
                                {Array.from({length: 31}, (_, i) => i + 1).map(
                                  date => (
                                    <TouchableOpacity
                                      key={date}
                                      style={tw`w-8 h-8 m-1 rounded-full items-center justify-center ${
                                        editedTask.selectedDate?.includes(date)
                                          ? 'bg-blue-500'
                                          : 'bg-gray-200'
                                      }`}
                                      onPress={() => {
                                        const updatedDates =
                                          editedTask.selectedDate?.includes(
                                            date,
                                          )
                                            ? editedTask.selectedDate.filter(
                                                (d: number) => d !== date,
                                              )
                                            : [
                                                ...(editedTask.selectedDate ||
                                                  []),
                                                date,
                                              ];
                                        setEditedTask({
                                          ...editedTask,
                                          selectedDate: updatedDates.sort(
                                            (a: number, b: number) => a - b,
                                          ),
                                        });
                                      }}>
                                      <Text
                                        style={tw`${
                                          editedTask.selectedDate?.includes(
                                            date,
                                          )
                                            ? 'text-white font-bold'
                                            : 'text-gray-700'
                                        }`}>
                                        {date}
                                      </Text>
                                    </TouchableOpacity>
                                  ),
                                )}
                              </View>
                            </ScrollView>
                          </View>
                        )}
                        {/* year */}
                        {editedTask.specTarget === 'Yearly' && (
                          <View>
                            <View style={tw`flex-row flex-wrap mb-2`}>
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
                                      : 'bg-gray-200'
                                  }`}
                                  onPress={() => handleMonthSelection(month)}>
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
                            {editedTask.specTarget === 'Yearly' && (
                              <View>
                                <View style={tw`flex-row flex-wrap mb-2`}>
                                  {/* Months selection (existing code) */}
                                </View>
                                <Text style={tw`text-gray-600 mb-2`}>
                                  Select dates:
                                </Text>
                                <DateGridList />
                              </View>
                            )}
                          </View>
                        )}
                      </>
                    )}
                  </View>

                  {/* Action Buttons */}
                  <View style={tw`flex-row justify-between `}>
                    <TouchableOpacity
                      style={tw`bg-blue-500 px-24 py-2 rounded-full left-12`}
                      onPress={() => handleUpdateTask(task.id)}>
                      <Text style={tw`text-white font-bold`}>Skip</Text>
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
                        size={24}
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

      {!isKeyboardVisible && <BottomNavigation />}
    </View>
  );
};

export default AllTaskListScreen;
