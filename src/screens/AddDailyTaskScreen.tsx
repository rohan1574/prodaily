import React, {useState, useRef, useEffect, useContext} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Alert,
  ImageSourcePropType,
  Pressable,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import {s as tw} from 'react-native-wind';
import DateSelector from './DateSelector';
import DatePicker from './DatePicker';
import DayPicker from './DayPicker';
import categoryIcons from '../data/categoryIcons';
import tasksData from '../data/tasksData';
import BottomNavigation from './BottomNavigation';
import {Modal} from 'react-native';
import {ColorContext} from '../context/ColorContext';
// Add at the top with other imports
import {Keyboard} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

type RootStackParamList = {
  // ... your other screens
  PremiumPackage: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'PremiumPackage'>;

// List of categories
type Category =
  | 'Fitness'
  | 'Wellness'
  | 'Productivity'
  | 'Nutrition'
  | 'Sleep'
  | 'Growth'
  | 'Household'
  | 'Social'
  | 'Self-Care'
  | 'Financials'
  | 'Career'
  | 'Tech'
  | 'Academic'
  | 'Spiritual'
  | 'Pet'
  | string;
const categories = Object.keys(categoryIcons) as Category[];

const CUSTOM_TASKS_KEY = 'custom_tasks';
const CUSTOM_CATEGORIES_KEY = 'custom_categories';
const AddDailyTaskScreen = () => {
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

  const [selectedCategory, setSelectedCategory] = useState<string>(
    categories[0],
  );
  // Then in your component:
  const navigation = useNavigation<NavigationProp>();
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const [specificFor, setSpecificFor] = useState('Days'); // Default to 'Days'
  const [specificForValue, setSpecificForValue] = useState('');
  const [dailyTarget, setDailyTarget] = useState('');
  const [specTarget, setSpecTarget] = useState('Weekly');
  const [targetType, setTargetType] = useState<'Minutes' | 'Times'>('Minutes');
  const options = ['Minutes', 'Times'] as const;
  const [isSpecificForEnabled, setIsSpecificForEnabled] = useState(false);
  const [isDailyTargetEnabled, setIsDailyTargetEnabled] = useState(false);
  const [isDayPickerVisible, setIsDayPickerVisible] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedDates, setSelectedDates] = useState<number[]>([]);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [isDateSeletorVisible, setIsDateSeletorVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<number[]>([]);
  const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
  const [tempSelectedDate, setTempSelectedDate] = useState<number>(1);
  const [tempSelectedMonth, setTempSelectedMonth] = useState<string>('January');
  const [selectedDayOnType, setSelectedDayOnType] = useState<string>('week'); // প্রথমে 'week' সেট করুন
  const [selectedYears, setSelectedYears] = useState<number[]>([]);
  const [isSpecificDayOnSelected, setIsSpecificDayOnSelected] = useState(false);
  const [dayOnError, setDayOnError] = useState<string | null>(null);
  const [taskName, setTaskName] = useState('');
  const [isStarred, setIsStarred] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [customTasksData, setCustomTasksData] = useState<
    Record<string, Record<string, ImageSourcePropType>>
  >({});
  const [isCustomTaskModalVisible, setIsCustomTaskModalVisible] =
    useState(false);
  const [customTaskName, setCustomTaskName] = useState('');
  const [selectedCustomIcon, setSelectedCustomIcon] = useState<any>(null);
  // 2. State গুলি আপডেট করুন
  const [customCategories, setCustomCategories] = useState<
    Record<string, ImageSourcePropType>
  >({});
  const [isCustomCategoryModalVisible, setIsCustomCategoryModalVisible] =
    useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedCategoryIcon, setSelectedCategoryIcon] = useState<any>(null);
  const [showDuplicateAlert, setShowDuplicateAlert] = useState(false);
  const colorContext = useContext(ColorContext);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  if (!colorContext) {
    throw new Error(
      'ColorContext is not available. Wrap your component in <ColorProvider>.',
    );
  }

  const {selectedColor} = colorContext;

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<{
    category: string;
    oldName: string;
    newName: string;
  } | null>(null);

  // Function to handle long press (for editing)
  const handleLongPress = (task: string, category: string) => {
    setEditingTask({
      category,
      oldName: task,
      newName: task,
    });
    setIsEditModalVisible(true);
  };

  // Save Function Edited Task
  const saveEditedTask = async () => {
    if (!editingTask) return;

    const {category, oldName, newName} = editingTask;

    if (!newName.trim()) {
      Alert.alert('Error', 'Task name cannot be empty');
      return;
    }

    // Check for duplicate tasks
    const existingTasks = {
      ...(tasksData[category] || {}),
      ...(customTasksData[category] || {}),
    };

    if (existingTasks[newName] && newName !== oldName) {
      Alert.alert('Error', 'Task with this name already exists');
      return;
    }

    try {
      const updatedCustomTasks = {...customTasksData};

      if (updatedCustomTasks[category]?.[oldName]) {
        // Move to new name
        updatedCustomTasks[category] = {
          ...updatedCustomTasks[category],
          [newName]: updatedCustomTasks[category][oldName],
        };

        // Remove old name
        delete updatedCustomTasks[category][oldName];

        // Update state and storage
        setCustomTasksData(updatedCustomTasks);
        await AsyncStorage.setItem(
          CUSTOM_TASKS_KEY,
          JSON.stringify(updatedCustomTasks),
        );

        // Update expandedTask and taskName states
        if (expandedTask === oldName) {
          setTaskName(newName); // Update current task name
          setExpandedTask(newName); // Keep the task expanded with new name
        } else {
          setExpandedTask(null); // Collapse if not editing expanded task
        }
      }

      setIsEditModalVisible(false);
    } catch (error) {
      console.error('Error saving edited task:', error);
      Alert.alert('Error', 'Failed to save changes');
    }
  };
  // Load custom data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [tasks, categories] = await Promise.all([
          AsyncStorage.getItem(CUSTOM_TASKS_KEY),
          AsyncStorage.getItem(CUSTOM_CATEGORIES_KEY),
        ]);

        if (tasks) setCustomTasksData(JSON.parse(tasks));
        if (categories) setCustomCategories(JSON.parse(categories));
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (showSuccessModal) {
      const timer = setTimeout(() => {
        setShowSuccessModal(false);
      }, 1000);

      return () => clearTimeout(timer); // Cleanup on unmount or when modal hides
    }
  }, [showSuccessModal]);
  // Add this useEffect hook for the duplicate alert timeout
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;

    if (showDuplicateAlert) {
      timeoutId = setTimeout(() => {
        setShowDuplicateAlert(false);
      }, 1000);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [showDuplicateAlert]);
  // Merge default and custom categories
  const mergedIcons: Record<string, ImageSourcePropType> = {
    ...categoryIcons,
    ...customCategories,
  };
  const allCategories = Object.keys(mergedIcons);

  // Save custom category
  const saveCustomCategory = async () => {
    const isPremium = await checkPremiumStatus(); // You'll need to implement this function

    if (!isPremium) {
      setShowPremiumModal(true);
      return;
    }
    if (!newCategoryName || !selectedCategoryIcon) {
      Alert.alert('Error', 'Please enter category name and select an icon');
      return;
    }

    const newCategory = {
      ...customCategories,
      [newCategoryName]: selectedCategoryIcon,
    };

    try {
      await AsyncStorage.setItem(
        CUSTOM_CATEGORIES_KEY,
        JSON.stringify(newCategory),
      );
      setCustomCategories(newCategory);
      setIsCustomCategoryModalVisible(false);
      setNewCategoryName('');
      setSelectedCategoryIcon(null);
    } catch (error) {
      console.error('Error saving custom category:', error);
    }
  };

  useEffect(() => {
    const loadCustomTasks = async () => {
      try {
        const storedTasks = await AsyncStorage.getItem(CUSTOM_TASKS_KEY);
        if (storedTasks) {
          setCustomTasksData(JSON.parse(storedTasks));
        }
      } catch (error) {
        console.error('Error loading custom tasks:', error);
      }
    };
    loadCustomTasks();
  }, []);

  const saveCustomTask = async () => {
    const isPremium = await checkPremiumStatus(); // You'll need to implement this function

    if (!isPremium) {
      setShowPremiumModal(true);
      return;
    }

    if (!customTaskName || !selectedCustomIcon) {
      Alert.alert('Error', 'Please enter task name and select an icon');
      return;
    }

    const newCustomTask = {
      ...customTasksData,
      [selectedCategory]: {
        ...customTasksData[selectedCategory],
        [customTaskName]: selectedCustomIcon,
      },
    };

    try {
      await AsyncStorage.setItem(
        CUSTOM_TASKS_KEY,
        JSON.stringify(newCustomTask),
      );
      setCustomTasksData(newCustomTask);
      setIsCustomTaskModalVisible(false);
      setCustomTaskName('');
      setSelectedCustomIcon(null);
    } catch (error) {
      console.error('Error saving custom task:', error);
    }
  };
  // Add this function to check premium status (you'll need to implement your actual check)
  const checkPremiumStatus = async () => {
    try {
      const premiumStatus = await AsyncStorage.getItem('isPremiumUser');
      return premiumStatus === 'true';
    } catch (error) {
      console.error('Error checking premium status:', error);
      return false;
    }
  };
  const handleDayTypeClick = (type: string) => {
    setSelectedDayOnType(type);
    setDayOnError(null);

    // রিসেট লজিক এবং মোডাল ভিজিবিলিটি
    switch (type) {
      case 'week':
        setIsDayPickerVisible(true);
        setSelectedDates([]); // মাস এবং তারিখ রিসেট
        setSelectedMonths([]);
        break;
      case 'month':
        setIsDatePickerVisible(true);
        setSelectedDays([]); // সপ্তাহের দিন এবং মাস রিসেট
        setSelectedMonths([]);
        break;
      case 'year':
        setIsDateSeletorVisible(true); // বছরভিত্তিক সিলেক্টর
        setSelectedDays([]); // সপ্তাহ এবং তারিখ রিসেট
        setSelectedDates([]);
        break;
    }
  };
  // Update toggle function to reset dailyTarget when turned off
  const toggleDailyTarget = () => {
    if (isDailyTargetEnabled) {
      setDailyTarget(''); // Clear input when radio is turned off
    }
    setIsDailyTargetEnabled(!isDailyTargetEnabled);
  };
  // Existing code...

  const handleToggleSpecificFor = () => {
    const newSpecificForState = !isSpecificForEnabled;

    // যদি নতুন স্টেট ON হয় (চালু করা হয়)
    if (newSpecificForState) {
      setIsSpecificDayOnSelected(false); // Add Specific Day On বন্ধ করুন
      setSelectedDays([]); // সিলেক্টেড দিন রিসেট
      setSelectedDates([]); // সিলেক্টেড তারিখ রিসেট
      setSelectedMonths([]); // সিলেক্টেড মাস রিসেট
    }

    // নিজের ইনপুট রিসেট (যদি বন্ধ করা হয়)
    if (isSpecificForEnabled) {
      setSpecificForValue('');
      setSpecificFor('Days');
    }

    setIsSpecificForEnabled(newSpecificForState);
  };
  const toggleSpecificDayOn = () => {
    const newSpecificDayOnState = !isSpecificDayOnSelected;

    if (newSpecificDayOnState) {
      setIsSpecificForEnabled(false);
      setSpecificForValue('');
      setSpecificFor('Days');
      setSelectedDayOnType('week'); // এখানে ডিফল্ট 'week' সেট করুন
    }

    setIsSpecificDayOnSelected(newSpecificDayOnState);
  };
  const handleSaveTask = async () => {
    const currentDate = new Date();
    let endDate = new Date(currentDate);
    const icon =
      tasksData[selectedCategory]?.[taskName] || // Optional Chaining এখানে
      customTasksData[selectedCategory]?.[taskName];
    // Initialize task data object
    const taskData: any = {
      id: `${Date.now()}`, // Unique task id
      name: taskName,
      icon: icon, // Saving the image source here
      isStarred: isStarred, // ⭐️ এখানে যুক্ত করো
      category: selectedCategory,
      dailyTarget,
      // selectedDays: [], // For specific days selection
      selectedDate: selectedDate, // For specific dates selection
      selectedDates: selectedDates, // For specific dates selection
      selectedYears: selectedYears,
      selectedMonths: selectedMonths, // For specific years selection
      targetType: targetType || 'Daily', // Default is Daily if no target type selected
      startDate: currentDate.toISOString(),
      endDate: null,
      specificFor, // Type of specific duration (Days, Weeks, Months)
      specificForValue, // Value for duration (e.g., 5 days, 5 weeks, 5 months)
    };

    // Handle "Add Specific For" (Days, Weeks, Months)
    if (specificForValue && specificForValue !== '') {
      const timeValue = parseInt(specificForValue, 10); // Ensure the value is an integer
      if (specificFor === 'Days') {
        endDate.setDate(currentDate.getDate() + timeValue); // Add days
      } else if (specificFor === 'Weeks') {
        endDate.setDate(currentDate.getDate() + timeValue * 7); // Add weeks
      } else if (specificFor === 'Months') {
        endDate.setMonth(currentDate.getMonth() + timeValue); // Add months
      }
      taskData.endDate = endDate.toISOString(); // Set end date
    }

    // Handle "Set Daily Target"
    if (isDailyTargetEnabled && dailyTarget) {
      taskData.dailyTarget = dailyTarget; // Save daily target if enabled
    }

    // Handle "Add Specific Day On" (Weekly, Monthly, Yearly)
    if (isSpecificDayOnSelected) {
      if (specTarget === 'Weekly') {
        taskData.selectedDays = selectedDays; // Store selected days of the week
      } else if (specTarget === 'Monthly') {
        taskData.selectedDates = selectedDates; // Store selected dates of the month
      } else if (specTarget === 'Yearly') {
        taskData.selectedYears = selectedYears; // Store selected dates for each year
      }
    }

    // If no target type selected, default to Daily
    if (!targetType) {
      taskData.targetType = 'Daily';
      taskData.endDate = null; // If daily target, set no end date
    }

    // Save the task to AsyncStorage
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      const taskList = storedTasks ? JSON.parse(storedTasks) : []; // Parse existing tasks

      // ডুপ্লিকেট চেক করুন (নাম এবং ক্যাটাগরি মিললে)
      const isDuplicate = taskList.some(
        (task: any) =>
          task.name === taskData.name && task.category === taskData.category,
      );

      if (isDuplicate) {
        setShowDuplicateAlert(true); // Alert.alert এর পরিবর্তে
        return;
      }

      taskList.push(taskData); // Add new task to the list
      await AsyncStorage.setItem('tasks', JSON.stringify(taskList)); // Save updated task list
      // Show success modal after save
      setShowSuccessModal(true);
      // ✅ সফল সেভের পর স্টেট রিসেট
      setSelectedDays([]);
      setSelectedDate([]);
      setSelectedDates([]);
      setSelectedMonths([]);
    } catch (error) {
      console.error('Error saving task:', error); // Handle any errors
    }
  };
  return (
    <View style={[tw`flex-1 bg-red-50`, {backgroundColor: '#FAFAFA'}]}>
      {/* Header */}
      <View style={tw``}>
        <Text
          style={[
            tw`font-bold font-sans text-black top-2 left-5`,
            {fontSize: 20},
          ]}>
          Add Task
        </Text>
        <Text
          style={[
            tw`font-light top-2 px-5`,
            {
              fontSize: 12,
              lineHeight: 18,
              letterSpacing: 1,
              color: '#8D99AE',
              fontFamily: 'Poppins',
            },
          ]}>
          Add tasks that you want to include in your routine. Make them
          compulsory to make your everyday life productive. So, it becomes a
          habit.
        </Text>

        {/* <Text style={tw`text-base top-4 font-bold text-zinc-800`}>
          Categories
        </Text> */}
      </View>
      {/* Horizontal Scrollable Categories (Fixed) */}
      <View style={tw`top-8 left-3 `}>
        <ScrollView
          horizontal
          ref={scrollViewRef}
          showsHorizontalScrollIndicator={false}
          snapToInterval={82} // Changed to actual item width (74 + 8 margin)
          snapToAlignment="start"
          decelerationRate="fast"
          contentContainerStyle={tw`pl-1`} // REMOVED LEFT PADDING
          onScroll={event => {
            const offsetX = event.nativeEvent.contentOffset.x;
            const selectedIndex = Math.round(offsetX / 82); // Use 82 instead of 102
            const category = allCategories[selectedIndex];
            if (category) setSelectedCategory(category);
          }}
          scrollEventThrottle={16}>
          {allCategories.map((category, index) => (
            <TouchableOpacity
              key={index}
              style={tw`items-center mr-2`}
              onPress={() => {
                setSelectedCategory(category);
                // SCROLL TO LEFT EDGE WITHOUT CENTERING
                scrollViewRef.current?.scrollTo({
                  x: index * 82, // Use consistent 82px width
                  animated: true,
                });
              }}>
              <View
                style={[
                  tw`rounded-full items-center justify-center bg-white `,
                  {
                    width: 74,
                    height: 74,
                    shadowColor: '#5B86CD',
                    shadowOffset: {width: 1, height: 1},
                    shadowOpacity: 0.2, // 10% opacity
                    shadowRadius: 5,
                    elevation: 5, // Android approximation
                  },
                  selectedCategory === category
                    ? tw`border-blue-500 border-2`
                    : tw`border-gray-200 border`,
                ]}>
                <Image
                  source={mergedIcons[category as keyof typeof mergedIcons]}
                  style={{width: 40, height: 40}}
                />
              </View>

              <Text
                style={tw`mt-3 font-bold ${
                  selectedCategory === category
                    ? 'text-blue-500 text-sm'
                    : 'text-black text-sm font-semibold '
                }`}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}

          {/* Custom Category Button */}
          <TouchableOpacity
            onPress={() => {
              setIsCustomCategoryModalVisible(true);
              setNewCategoryName('');
              setSelectedCategoryIcon(null);
            }}
            style={tw`items-center `}>
            <View
              style={[
                tw`rounded-full flex items-center justify-center border-2 border-gray-200 bg-white right-2`,
                {width: 74, height: 74},
              ]}>
              <Image
                source={require('../../assets/images/CustomCategory.png')}
                style={[tw``, {width: 44, height: 42}]}
              />
            </View>
            <Text
              style={[
                tw`text-black text-sm font-semibold top-3 right-2`,
                {color: '#27282A'},
              ]}>
              Add Category
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Task List (Scrollable) */}
      <ScrollView
        style={tw`flex-1 top-12 mx-4`}
        contentContainerStyle={tw`pb-20`}
        showsVerticalScrollIndicator={false}>
        {Object.keys({
          ...(tasksData[selectedCategory] || {}),
          ...(customTasksData[selectedCategory] || {}),
        }).map((task, index) => (
          <View key={index} style={tw`mb-2`}>
            <TouchableOpacity
              onPress={() => {
                if (expandedTask !== task) {
                  setSelectedDays([]);
                  setSelectedDates([]);
                  setSelectedMonths([]);
                  setSelectedYears([]);
                  setSpecificForValue('');
                  setSpecificFor('Days');
                  setDailyTarget('');
                  setTargetType('Minutes');
                  setIsStarred(false);
                  setIsSpecificForEnabled(false);
                  setIsSpecificDayOnSelected(false);
                  setIsDailyTargetEnabled(false);
                }
                setExpandedTask(expandedTask === task ? null : task);
                setTaskName(task);
              }}
              onLongPress={() => handleLongPress(task, selectedCategory)}
              style={[
                tw`flex-row items-center justify-between bg-white h-12 rounded-lg`,
                {bg: selectedColor},
              ]}>
              <View style={tw`flex-row items-center left-4`}>
                <Image
                  source={
                    tasksData[selectedCategory]?.[task] || // 1. Optional Chaining ব্যবহার করুন
                    customTasksData[selectedCategory]?.[task]
                  }
                  style={[
                    tw`bottom-2 h-auto mt-4 mr-6`,
                    {tintColor: selectedColor, width: 30, height: 30},
                  ]}
                />

                <Text
                  style={[
                    tw`text-sm font-medium text-black`,
                    // {color: selectedColor},
                  ]}>
                  {task}
                </Text>
              </View>
              <Icon
                style={tw`right-4`}
                name={expandedTask === task ? 'chevron-up' : 'chevron-down'}
                size={20}
                color="#DFDFDF"
              />
            </TouchableOpacity>

            {/* Expanded Tasks Options */}
            {expandedTask === task && (
              <View
                style={[
                  tw`p-4 bg-white rounded-2xl shadow-lg shadow-black w-84 top-2 mb-2`,
                  {
                    height: 265,
                    // iOS shadow
                    shadowColor: '#5B86CD',
                    shadowOffset: {width: 0, height: 2},
                    shadowOpacity: 0.1,
                    shadowRadius: 6,
                    elevation: 5, // for Android
                    shadowContainer: {
                      backgroundColor: 'transparent',
                      borderRadius: 100, // same as inner
                      shadowColor: '#5B86CD',
                      shadowOffset: {width: 0, height: 4},
                      shadowOpacity: 0.1,
                      shadowRadius: 10,
                      elevation: 8, // Android shadow
                    },
                    innerBox: {
                      borderRadius: 16, // match shadow radius
                      overflow: 'hidden', // prevent sharp shadow overflow
                    },
                  },
                ]}>
                {/* Header */}
                <View style={tw`flex-row justify-between`}>
                  <View style={tw`flex-row items-center mb-6`}>
                    <Image
                      source={
                        tasksData[selectedCategory]?.[expandedTask] ||
                        customTasksData[selectedCategory]?.[expandedTask]
                      }
                      style={[
                        tw`mr-3`,
                        {width: 30, height: 30, tintColor: selectedColor},
                      ]} // সংশোধিত লাইন
                    />
                    <Text
                      style={[
                        tw`text-sm font-medium text-black ml-2`,
                        {letterSpacing: 1},
                      ]}>
                      {expandedTask}
                    </Text>
                    {/* star icon */}
                  </View>
                  <View style={[tw``]}>
                    <TouchableOpacity onPress={() => setIsStarred(!isStarred)}>
                      <Icon
                        name={isStarred ? 'star' : 'star-outline'}
                        size={20}
                        color={isStarred ? '#3580FF' : 'gray'}
                        style={tw`mr-2`}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Add Specific For */}
                <View style={tw`bottom-3`}>
                  <View style={tw`flex-row items-center mb-4 right-1`}>
                    <TouchableOpacity onPress={handleToggleSpecificFor}>
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
                    <Text
                      style={[
                        tw`font-normal text-gray-500`,
                        {fontSize: 12, letterSpacing: 1},
                      ]}>
                      Add specific for
                    </Text>

                    <TextInput
                      style={[
                        tw`px-1 py-1 border rounded text-center left-1`,
                        {
                          borderColor: '#E3E8F1',
                          width: 30,
                          height: 23,
                          fontSize: 12,
                          letterSpacing: 1,
                          color: '',
                        },
                      ]}
                      keyboardType="numeric"
                      placeholder="00"
                      placeholderTextColor="#8D99AE"
                      value={specificForValue}
                      onChangeText={setSpecificForValue}
                      editable={isSpecificForEnabled}
                      maxLength={2}
                    />
                    <LinearGradient
                      colors={['#F7FAFF', '#DEEAFF']}
                      start={{x: 0, y: 0}}
                      end={{x: 0, y: 1}}
                      style={[
                        tw`flex-row rounded-full mx-2`,
                        {width: 170, height: 30},
                      ]}>
                      {['Days', 'Weeks', 'Months'].map(type => {
                        const isSelected = specificFor === type;

                        return (
                          <TouchableOpacity
                            key={type}
                            style={tw`px-2 p-1 rounded-full ${
                              isSelected
                                ? 'bg-blue-500 border border-blue-500'
                                : ''
                            }`}
                            onPress={() => setSpecificFor(type)}>
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
                <View style={tw`bottom-2`}>
                  <TouchableOpacity
                    onPress={toggleSpecificDayOn}
                    style={tw`flex-row items-center right-1`}>
                    <Icon
                      name={
                        isSpecificDayOnSelected
                          ? 'radio-button-on'
                          : 'radio-button-off'
                      }
                      size={24}
                      color={isSpecificDayOnSelected ? '#3580FF' : 'gray'}
                    />
                    <Text
                      style={[
                        tw`font-normal text-gray-500`,
                        {fontSize: 12, letterSpacing: 1},
                      ]}>
                      Add Specific day on
                    </Text>
                  </TouchableOpacity>
                </View>
                {/* Buttons */}
                <LinearGradient
                  colors={['#F7FAFF', '#DEEAFF']}
                  start={{x: 0, y: 0}}
                  end={{x: 0, y: 1}}
                  style={[
                    tw` mx-2 rounded-full shadow-sm  left-36 bottom-8`,
                    {width: 178, height: 30, backgroundColor: '#F7FAFF'},
                  ]}>
                  <View style={tw`flex-row  `}>
                    {['Week', 'Month', 'Year'].map(type => {
                      const lowerType = type.toLowerCase();
                      const isSelected = selectedDayOnType === lowerType; // ডিফল্ট হিসেবে 'week' চেক হবে

                      return (
                        <TouchableOpacity
                          key={type}
                          onPress={() => handleDayTypeClick(lowerType)}
                          disabled={!isSpecificDayOnSelected}
                          style={[
                            tw`flex-1 p-1.5 rounded-full`,
                            isSelected &&
                              tw`bg-blue-500 border border-blue-500`, // সিলেক্টেড স্টাইল
                            !isSpecificDayOnSelected && tw`opacity-50`,
                          ]}>
                          <Text
                            style={[
                              tw`text-center text-sm font-normal`,
                              isSelected
                                ? tw`text-white font-semibold `
                                : {color: '#8D99AE'},
                            ]}>
                            {type}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </LinearGradient>
                {/* Set Daily Target */}
                <View style={tw`bottom-3`}>
                  <View style={tw`flex-row items-center right-1`}>
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
                        tw`font-normal text-gray-500`,
                        {fontSize: 12, letterSpacing: 1},
                      ]}>
                      Set Daily Target for
                    </Text>
                    <TextInput
                      style={[
                        tw`px-1 py-1 border rounded text-center left-3`,
                        {
                          borderColor: '#E3E8F1',
                          width: 40,
                          height: 23,
                          fontSize: 12,
                          letterSpacing: 1,
                        },
                      ]}
                      keyboardType="numeric"
                      placeholder="000"
                      placeholderTextColor="#8D99AE"
                      value={dailyTarget}
                      onChangeText={setDailyTarget}
                      editable={isDailyTargetEnabled} // ✅ Radio Button ON means input will be editable
                      maxLength={3}
                    />
                    <LinearGradient
                      colors={['#F7FAFF', '#DEEAFF']}
                      start={{x: 0, y: 0}}
                      end={{x: 0, y: 1}}
                      style={[tw`flex-row rounded-full left-4 `]}>
                      {options.map(type => {
                        const isSelected = targetType === type;

                        return (
                          <TouchableOpacity
                            key={type}
                            style={tw`px-2 py-1 rounded-full ${
                              isSelected
                                ? 'bg-blue-500 border border-blue-500'
                                : '#F7FAFF'
                            }`}
                            onPress={() => setTargetType(type)}>
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
                {/* মডাল রেন্ডারিং অংশ সংশোধন করুন */}
                {isDayPickerVisible && (
                  <DayPicker
                    selectedDays={selectedDays}
                    onSelectDays={setSelectedDays}
                    onCancel={() => {
                      setIsDayPickerVisible(false);
                      setSelectedDays([]);
                    }}
                    onAddDay={() => {
                      setIsDayPickerVisible(false);
                    }}
                  />
                )}
                {isDatePickerVisible && (
                  <DatePicker
                    selectedDate={selectedDate}
                    onSelectDate={setSelectedDate}
                    onCancel={() => {
                      setIsDatePickerVisible(false);
                      setSelectedDate([]);
                    }}
                    onAddDay={() => {
                      setIsDatePickerVisible(false);
                    }}
                  />
                )}
                {isDateSeletorVisible && (
                  <DateSelector
                    selectedDates={selectedDates}
                    selectedMonths={selectedMonths}
                    onSelectDate={(date: number) => setTempSelectedDate(date)}
                    onSelectMonth={(month: string) =>
                      setTempSelectedMonth(month)
                    }
                    onCancel={() => setIsDateSeletorVisible(false)}
                    onAddDay={addedDates => {
                      // ইউনিক ডাটা চেক করার সঠিক পদ্ধতি
                      const uniqueDates = addedDates.filter(
                        ({date, month}, index) =>
                          addedDates.findIndex(
                            d => d.date === date && d.month === month,
                          ) === index,
                      );

                      // এক্সিস্টিং ডাটার সাথে মিলিয়ে চেক
                      const newEntries = uniqueDates.filter(
                        ({date, month}) =>
                          !selectedDates.some(
                            (d, i) => d === date && selectedMonths[i] === month,
                          ),
                      );

                      // স্টেট আপডেট
                      setSelectedDates(prev => [
                        ...prev,
                        ...newEntries.map(e => e.date),
                      ]);
                      setSelectedMonths(prev => [
                        ...prev,
                        ...newEntries.map(e => e.month),
                      ]);
                      setIsDateSeletorVisible(false);
                    }}
                    onRemoveDay={index => {
                      setSelectedDates(prev =>
                        prev.filter((_, i) => i !== index),
                      );
                      setSelectedMonths(prev =>
                        prev.filter((_, i) => i !== index),
                      );
                    }}
                  />
                )}
                <View>
                  {/* Add to Routine Button */}
                  <TouchableOpacity
                    onPress={handleSaveTask}
                    style={tw`bg-blue-500 py-2 mx-8 rounded-full top-4`}>
                    <Text style={tw`text-white text-center font-semibold `}>
                      Add to Daily Routine
                    </Text>
                  </TouchableOpacity>
                  {/* Toggle Button */}
                  <TouchableOpacity
                    onPress={() =>
                      setExpandedTask(expandedTask === task ? null : task)
                    }
                    style={tw`p-3 rounded-lg left-72 bottom-2`}>
                    <Icon
                      name={
                        expandedTask === task ? 'chevron-up' : 'chevron-down'
                      }
                      size={20}
                      color="#8D99AE"
                    />
                  </TouchableOpacity>
                </View>
                {showDuplicateAlert && (
                  <Modal
                    transparent={true}
                    animationType="fade"
                    visible={showDuplicateAlert}
                    onRequestClose={() => setShowDuplicateAlert(false)}>
                    <View
                      style={[
                        tw`flex-1 justify-center items-center`,
                        {backgroundColor: 'rgba(53, 128, 255, 0.2)'},
                      ]}>
                      <View
                        style={tw`flex-row items-center bg-blue-500 rounded-full px-4 py-2`}>
                        <Icon
                          name="checkmark-circle-outline"
                          size={28}
                          color="white"
                          style={tw`mr-2`}
                        />
                        <View>
                          <Text style={tw`text-white font-semibold text-base`}>
                            Task Already
                          </Text>
                          <Text style={tw`text-white text-xs`}>
                            Exist in your routine
                          </Text>
                        </View>
                      </View>
                    </View>
                  </Modal>
                )}
                {/* modal */}
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
                      style={tw`flex-row items-center bg-blue-500 rounded-full px-4 py-2`}>
                      <Icon
                        name="checkmark-circle-outline"
                        size={28}
                        color="white"
                        style={tw`mr-2`}
                      />
                      <View>
                        <Text style={tw`text-white font-semibold text-base`}>
                          Task Saved!
                        </Text>
                        <Text style={tw`text-white text-xs`}>
                          to your routine Successfully
                        </Text>
                      </View>
                    </View>
                  </View>
                </Modal>
              </View>
            )}
          </View>
        ))}
        {/* Add Custom Task Button */}
        <TouchableOpacity
          onPress={() => {
            setIsCustomTaskModalVisible(true);
            setCustomTaskName('');
            setSelectedCustomIcon(null);
          }}
          style={tw`flex-row items-center justify-between bg-white p-2 rounded-lg mb-2`}>
          <View style={tw`flex-row items-center`}>
            <Image
              source={require('../../assets/images/CustomTask.png')}
              style={[tw``, {width: 30, height: 30}]}
            />
            <Text style={[tw`text-sm font-medium text-black left-8`]}>
              Add Custom Task
            </Text>
          </View>
        </TouchableOpacity>
        {/* কাস্টম টাস্ক মডাল */}
        <Modal
          visible={isCustomTaskModalVisible}
          transparent={true}
          animationType="slide">
          <View style={tw`flex-1 bg-black/50 justify-center items-center p-4`}>
            <View style={tw`bg-white p-6 rounded-xl w-full max-w-96`}>
              <Text style={tw`text-lg font-bold mb-4`}>Create Custom Task</Text>

              <TextInput
                placeholder="Enter Task Name"
                value={customTaskName}
                onChangeText={setCustomTaskName}
                style={tw`border p-2 rounded mb-4`}
                placeholderTextColor="#9CA3AF"
              />

              <Text style={tw`mb-2 text-gray-700`}>Select Icon:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {Object.entries(tasksData).map(([category, tasks]) =>
                  Object.entries(tasks).map(([taskName, iconSource]) => (
                    <TouchableOpacity
                      key={`${category}-${taskName}`}
                      onPress={() => setSelectedCustomIcon(iconSource)}
                      style={tw`p-2 mx-1 rounded-lg ${
                        selectedCustomIcon === iconSource
                          ? 'bg-blue-100'
                          : 'bg-gray-100'
                      }`}>
                      <Image
                        source={iconSource as ImageSourcePropType} // Add type assertion here
                        style={tw`w-10 h-10`}
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                  )),
                )}

                {/* সকল ক্যাটাগরির কাস্টম টাস্ক আইকন যোগ করুন */}
                {Object.entries(customTasksData).map(([category, tasks]) =>
                  Object.entries(tasks).map(([taskName, iconSource]) => (
                    <TouchableOpacity
                      key={`custom-${category}-${taskName}`}
                      onPress={() => setSelectedCustomIcon(iconSource)}
                      style={tw`p-2 mx-1 rounded-lg ${
                        selectedCustomIcon === iconSource
                          ? 'bg-blue-100'
                          : 'bg-gray-100'
                      }`}>
                      <Image
                        source={iconSource}
                        style={tw`w-10 h-10`}
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                  )),
                )}
              </ScrollView>

              <View style={tw`flex-row justify-between mt-6 gap-3`}>
                <TouchableOpacity
                  onPress={() => setIsCustomTaskModalVisible(false)}
                  style={tw`flex-1 bg-red-500 px-4 py-3 mx-2 rounded-lg items-cente`}>
                  <Text style={tw`text-white font-medium`}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={saveCustomTask}
                  style={tw`flex-1 bg-blue-500 px-4 py-3 mx-2 rounded-lg items-center`}>
                  <Text style={tw`text-white font-medium`}>Save Task</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <Modal
          visible={isCustomCategoryModalVisible}
          transparent={true}
          animationType="slide">
          <View style={tw`flex-1 bg-black/50 justify-center items-center p-4`}>
            <View style={tw`bg-white p-6 rounded-xl w-full max-w-96`}>
              <Text style={tw`text-lg font-bold mb-4`}>
                Create Custom Category
              </Text>

              <TextInput
                placeholder="Enter Category Name"
                value={newCategoryName}
                onChangeText={setNewCategoryName}
                style={tw`border p-2 rounded mb-4`}
                placeholderTextColor="#9CA3AF"
              />

              <Text style={tw`mb-2 text-gray-700`}>Select Icon:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {Object.entries(tasksData).map(([category, tasks]) =>
                  Object.entries(tasks).map(([taskName, iconSource]) => (
                    <TouchableOpacity
                      key={`${category}-${taskName}`}
                      onPress={() => setSelectedCategoryIcon(iconSource)}
                      style={tw`p-2 mx-1 rounded-lg ${
                        selectedCategoryIcon === iconSource
                          ? 'bg-blue-100'
                          : 'bg-gray-100'
                      }`}>
                      <Image
                        source={iconSource as ImageSourcePropType}
                        style={tw`w-10 h-10`}
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                  )),
                )}

                {/* Add custom task icons */}
                {Object.entries(customTasksData).map(([category, tasks]) =>
                  Object.entries(tasks).map(([taskName, iconSource]) => (
                    <TouchableOpacity
                      key={`custom-${category}-${taskName}`}
                      onPress={() => setSelectedCategoryIcon(iconSource)}
                      style={tw`p-2 mx-1 rounded-lg ${
                        selectedCategoryIcon === iconSource
                          ? 'bg-blue-100'
                          : 'bg-gray-100'
                      }`}>
                      <Image
                        source={iconSource}
                        style={tw`w-10 h-10`}
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                  )),
                )}
              </ScrollView>

              <View style={tw`flex-row justify-between mt-6 gap-3`}>
                <TouchableOpacity
                  onPress={() => setIsCustomCategoryModalVisible(false)}
                  style={tw`flex-1 bg-red-500 px-4 py-3 mx-2 rounded-lg items-center`}>
                  <Text style={tw`text-white font-medium`}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={saveCustomCategory}
                  style={tw`flex-1 bg-blue-500 px-4 py-3 mx-2 rounded-lg items-center`}>
                  <Text style={tw`text-white font-medium`}>Save Category</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        {/* Premium Feature Modal */}
        <Modal
          visible={showPremiumModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowPremiumModal(false)}>
          <View
            style={[
              tw`items-center justify-center h-full`,
              {backgroundColor: 'rgba(53, 128, 255, 0.2)'},
            ]}>
            <View
              style={[
                tw`bg-blue-500 rounded-full px-10 py-6 shadow-md`,
                {width: 300, height: 92},
              ]}>
              <View style={tw`flex-row`}>
                <View>
                  <Image
                    source={require('../../assets/images/PremiumFeature.png')}
                    style={{width: 37, height: 50, right: 12}}
                    resizeMode="contain"
                  />
                </View>
                <View>
                  <Text
                    style={[
                      tw`text-white font-medium text-center bottom-3`,
                      {fontSize: 20, letterSpacing: 1},
                    ]}>
                    Premium Feature!
                  </Text>
                  <Text
                    style={[
                      tw`text-white font-normal text-center bottom-2`,
                      {fontSize: 10, color: '#C6CEDD', letterSpacing: 1},
                    ]}>
                    Only premium user can use this feature
                  </Text>
                </View>
              </View>

              <Pressable
                style={tw`mt-4 bg-white rounded-md px-4 h-8 self-center bottom-3`}>
                <Text
                  onPress={() => {
                    setShowPremiumModal(false);
                    navigation.navigate('PremiumPackage'); // Uncommented and corrected the screen name
                  }}
                  style={[
                    tw` font-medium top-2`,
                    {fontSize: 12, color: '#3580FF', letterSpacing: 1},
                  ]}>
                  Discover
                </Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        <Modal
          visible={isEditModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setIsEditModalVisible(false)}>
          <View style={tw`flex-1 justify-center items-center bg-black/50`}>
            <View style={tw`bg-white p-6 rounded-xl w-4/5`}>
              <Text style={tw`text-lg font-bold mb-4`}>Edit Task Name</Text>

              <TextInput
                value={editingTask?.newName || ''}
                onChangeText={text =>
                  editingTask && setEditingTask({...editingTask, newName: text})
                }
                style={tw`border p-3 rounded mb-6`}
                placeholder="Enter new task name"
                autoFocus={true}
              />

              <View style={tw`flex-row justify-between`}>
                <TouchableOpacity
                  onPress={() => setIsEditModalVisible(false)}
                  style={tw`px-4 py-2 bg-gray-200 rounded`}>
                  <Text>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={saveEditedTask}
                  style={tw`px-4 py-2 bg-blue-500 rounded`}>
                  <Text style={tw`text-white`}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
      {!isKeyboardVisible && <BottomNavigation />}
    </View>
  );
};

export default AddDailyTaskScreen;
