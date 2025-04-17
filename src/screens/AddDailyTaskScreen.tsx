import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import {s as tw} from 'react-native-wind';
import DateSelector from './DateSelector';
import DatePicker from './DatePicker';
import DayPicker from './DayPicker';
import categoryIcons from '../data/categoryIcons';
import tasksData from '../data/tasksData';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import BottomNavigation from './BottomNavigation';

// Define the navigation type
type RootStackParamList = {
  TodaysTaskToDoScreen: undefined;
  MyCalenderFutureTaskScreen: undefined;
  MyStatisticsScreen: undefined;
  ProfileManageScreen: undefined;
  AddDailyTaskScreen: undefined;
  AllTaskListScreen: undefined;
};
type NavigationProp = StackNavigationProp<
  RootStackParamList,
  'TodaysTaskToDoScreen'
>;
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
  | 'Pet';

const categories = Object.keys(categoryIcons) as Category[];

// Make Infinite Scroll Data (Repeat categories)
const infiniteCategories = [...categories, ...categories, ...categories];

const AddDailyTaskScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [selectedCategory, setSelectedCategory] = useState<string>(
    categories[0],
  );
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const [specificFor, setSpecificFor] = useState('Days'); // Default to 'Days'
  const [specificForValue, setSpecificForValue] = useState('');
  const [dailyTarget, setDailyTarget] = useState('');
  const [specTarget, setSpecTarget] = useState('Weekly');
  const [targetType, setTargetType] = useState<'Minutes' | 'Times'>('Minutes');
  const toggleSpecificFor = () =>
    setIsSpecificForEnabled(!isSpecificForEnabled);
  const toggleDailyTarget = () =>
    setIsDailyTargetEnabled(!isDailyTargetEnabled);
  const [isSpecificForEnabled, setIsSpecificForEnabled] = useState(false);
  const [isDailyTargetEnabled, setIsDailyTargetEnabled] = useState(false);
  const [isDayPickerVisible, setIsDayPickerVisible] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string[]>([]);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedDates, setSelectedDates] = useState<number[]>([]);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [isDateSeletorVisible, setIsDateSeletorVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<number[]>([]);
  const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<number[]>([]);
  const [isSpecificDayOnSelected, setIsSpecificDayOnSelected] = useState(false);
  const [selectedDayOnType, setSelectedDayOnType] = useState<string | null>(
    null,
  );
  const [dayOnError, setDayOnError] = useState<string | null>(null);
  const [taskName, setTaskName] = useState('');
  const [isStarred, setIsStarred] = useState(false);


  const handleWeeklyClick = () => {
    setSelectedDayOnType('weekly');
    setDayOnError(null);
    setIsDayPickerVisible(true);
    setSelectedDates([]); // Reset other selections
    setSelectedMonths([]);
  };

  const handleMonthlyClick = () => {
    setSelectedDayOnType('monthly');
    setDayOnError(null);
    setIsDatePickerVisible(true);
    setSelectedDays([]); // Reset other selections
    setSelectedMonths([]);
  };

  const handleYearlyClick = () => {
    setSelectedDayOnType('yearly');
    setDayOnError(null);
    setIsDateSeletorVisible(true);
    setSelectedDays([]);
    setSelectedDates([]); // Reset other selections
  };

  // Functions with logic to prevent both being selected
  const handleToggleSpecificFor = () => {
    if (isSpecificDayOnSelected) {
      Alert.alert(
        'Error',
        'You cannot select "Add Specific For" while "Add Specific Day On" is selected.',
      );
      return;
    }
    setIsSpecificForEnabled(!isSpecificForEnabled);
  };

  const toggleSpecificDayOn = () => {
    if (isSpecificForEnabled) {
      Alert.alert(
        'Error',
        'You cannot select "Add Specific Day On" while "Add Specific For" is selected.',
      );
      return;
    }
    setIsSpecificDayOnSelected(!isSpecificDayOnSelected);
  };
  const handleSaveTask = async () => {
    const currentDate = new Date();
    let endDate = new Date(currentDate);
    const icon = tasksData[selectedCategory][taskName];
    // Initialize task data object
    const taskData: any = {
      id: `${Date.now()}`, // Unique task id
      name: taskName,
      icon: icon, // Saving the image source here
      isStarred: isStarred, // ⭐️ এখানে যুক্ত করো
      category: selectedCategory,
      dailyTarget,
      selectedDays: [], // For specific days selection
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

      taskList.push(taskData); // Add new task to the list
      await AsyncStorage.setItem('tasks', JSON.stringify(taskList)); // Save updated task list
    } catch (error) {
      console.error('Error saving task:', error); // Handle any errors
    }
  };

  // Handle scrolling and auto-select first visible category
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollX = event.nativeEvent.contentOffset.x;
    const categoryWidth = 80; // Approximate width of each category item

    const firstVisibleIndex =
      Math.round(scrollX / categoryWidth) % categories.length;
    setSelectedCategory(categories[firstVisibleIndex]);
  };

  // Infinite Scroll Effect
  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollX = event.nativeEvent.contentOffset.x;
    const categoryWidth = 80;
    const totalWidth = categoryWidth * categories.length;

    if (scrollX >= totalWidth) {
      scrollViewRef.current?.scrollTo({x: 0, animated: false});
    }
  };

  return (
    <View style={tw`flex-1 bg-red-50 p-4`}>
      {/* Header */}
      <View style={tw`mb-2`}>
        <Text style={tw`text-xl font-bold text-black`}>Add Daily Task</Text>
        <Text style={tw`text-sm text-gray-500`}>
          Add tasks to your daily routine to stay productive.
        </Text>
      </View>

      {/* Horizontal Scrollable Categories (Fixed) */}
      <View>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          onMomentumScrollEnd={handleScrollEnd}
          scrollEventThrottle={16}>
          {infiniteCategories.map((category, index) => (
            <TouchableOpacity
              key={index}
              style={tw`items-center mx-2`}
              onPress={() => setSelectedCategory(category)}>
              <View
                style={[
                  tw`w-16 h-16 rounded-full flex items-center justify-center border-2`,
                  selectedCategory === category
                    ? tw`border-blue-500`
                    : tw`border-gray-300`,
                ]}>
                <Image
                  source={categoryIcons[category]}
                  style={tw`w-8 h-8`} // Updated to dynamically select category
                />
              </View>
              <Text
                style={tw`text-sm mt-1 ${
                  selectedCategory === category
                    ? 'text-blue-500'
                    : 'text-gray-600'
                }`}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Task List (Scrollable) */}
      <ScrollView style={tw`flex-1 mt-4`} showsVerticalScrollIndicator={false}>
        {Object.keys(tasksData[selectedCategory] || {}).map((task, index) => (
          <View key={index} style={tw`mb-2`}>
            <TouchableOpacity
              onPress={() => {
                setExpandedTask(expandedTask === task ? null : task);
                setTaskName(task); // Set task name when selecting a task
              }}
              style={tw`flex-row items-center justify-between bg-white p-3 rounded-lg`}>
              <View style={tw`flex-row items-center`}>
                <Image
                  source={tasksData[selectedCategory][task]}
                  style={tw`mr-3 w-8 h-8`} // Adjust the size of the image
                />
                <Text style={tw`text-base font-semibold text-black`}>
                  {task}
                </Text>
              </View>
              <Icon
                name={expandedTask === task ? 'chevron-up' : 'chevron-down'}
                size={20}
                color="#DFDFDF"
              />
            </TouchableOpacity>

            {/* Expanded Tasks Options */}
            {expandedTask === task && (
              <View style={tw`p-4 bg-white rounded-2xl shadow-md w-84`}>
                {/* Header */}
                <View style={tw`flex-row items-center mb-4`}>
                  <Image
                    source={tasksData[selectedCategory][expandedTask]}
                    style={tw`mr-3 w-8 h-8`} // Adjust the size of the image
                  />
                  <Text style={tw`text-lg font-semibold ml-2 text-gray-900`}>
                    {expandedTask}
                  </Text>
                  {/* star icon */}
                  <TouchableOpacity onPress={() => setIsStarred(!isStarred)}>
                    <Icon
                      name={isStarred ? 'star' : 'star-outline'}
                      size={24}
                      color={isStarred ? 'gold' : 'gray'}
                      style={tw`mr-2`}
                    />
                  </TouchableOpacity>
                </View>

                {/* Add Specific For */}
                <View style={tw`mb-6`}>
                  <View style={tw`flex-row items-center mb-4`}>
                    <TouchableOpacity onPress={handleToggleSpecificFor}>
                      <Icon
                        name={
                          isSpecificForEnabled
                            ? 'radio-button-on'
                            : 'radio-button-off'
                        }
                        size={16}
                        color="#3B82F6"
                      />
                    </TouchableOpacity>
                    <Text style={tw`text-xs font-semibold ml-1`}>
                      Add specific for:
                    </Text>

                    <TextInput
                      style={tw`border p-2 rounded w-8 text-xs ml-2`}
                      keyboardType="numeric"
                      placeholder="00"
                      value={specificForValue}
                      onChangeText={setSpecificForValue}
                      editable={isSpecificForEnabled}
                    />

                    <TouchableOpacity
                      style={tw`py-2 px-2 mx-1 rounded ${
                        specificFor === 'Days' ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                      onPress={() => setSpecificFor('Days')}>
                      <Text
                        style={
                          specificFor === 'Days'
                            ? tw`text-white`
                            : tw`text-gray-500`
                        }>
                        Days
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={tw`py-2 px-2 mx-1 rounded ${
                        specificFor === 'Weeks' ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                      onPress={() => setSpecificFor('Weeks')}>
                      <Text
                        style={
                          specificFor === 'Weeks'
                            ? tw`text-white`
                            : tw`text-gray-500`
                        }>
                        Weeks
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={tw`py-2 px-2 mx-1 rounded ${
                        specificFor === 'Months' ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                      onPress={() => setSpecificFor('Months')}>
                      <Text
                        style={
                          specificFor === 'Months'
                            ? tw`text-white`
                            : tw`text-gray-500`
                        }>
                        Months
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Set Daily Target */}
                <View style={tw`mb-6`}>
                  <View style={tw`flex-row items-center mb-4`}>
                    <TouchableOpacity onPress={toggleDailyTarget}>
                      <Icon
                        name={
                          isDailyTargetEnabled
                            ? 'radio-button-on'
                            : 'radio-button-off'
                        }
                        size={16}
                        color="#3B82F6"
                      />
                    </TouchableOpacity>
                    <Text style={tw`text-xs font-semibold`}>
                      Set Daily Target for
                    </Text>
                    <TextInput
                      style={tw`border p-2 rounded w-8 text-xs mt-2`}
                      keyboardType="numeric"
                      placeholder="00"
                      value={dailyTarget}
                      onChangeText={setDailyTarget}
                      editable={isDailyTargetEnabled} // ✅ Radio Button ON means input will be editable
                    />
                    <View style={tw`flex-row mt-2`}>
                      <TouchableOpacity
                        style={tw`px-4 py-2 mx-1 rounded ${
                          targetType === 'Minutes'
                            ? 'bg-blue-500'
                            : 'bg-gray-300'
                        }`}
                        onPress={() => setTargetType('Minutes')}>
                        <Text
                          style={tw`${
                            targetType === 'Minutes'
                              ? 'text-white'
                              : 'text-black'
                          }`}>
                          Minutes
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={tw`px-4 py-2 mx-1 rounded ${
                          targetType === 'Times' ? 'bg-blue-500' : 'bg-gray-300'
                        }`}
                        onPress={() => setTargetType('Times')}>
                        <Text
                          style={tw`${
                            targetType === 'Times' ? 'text-white' : 'text-black'
                          }`}>
                          Times
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                {/* Add Specific Day On */}
                <View style={tw`mb-4`}>
                  <TouchableOpacity
                    onPress={toggleSpecificDayOn}
                    style={tw`flex-row items-center`}>
                    <Icon
                      name={
                        isSpecificDayOnSelected
                          ? 'radio-button-on'
                          : 'radio-button-off'
                      }
                      size={20}
                      color={isSpecificDayOnSelected ? 'blue' : 'gray'}
                    />
                    <Text style={tw`ml-2 text-sm`}>Add Specific day on</Text>
                  </TouchableOpacity>
                </View>

                {/* Buttons */}
                <View style={tw`flex-row justify-between`}>
                  {/* Weekly Button */}
                  <TouchableOpacity
                    onPress={handleWeeklyClick}
                    disabled={!isSpecificDayOnSelected}
                    style={[
                      tw`py-3 px-5 rounded-lg`,
                      !isSpecificDayOnSelected
                        ? tw`bg-gray-300`
                        : selectedDayOnType === 'weekly'
                        ? tw`bg-green-600`
                        : tw`bg-blue-500`,
                    ]}>
                    <Text style={tw`text-white`}>Weekly</Text>
                  </TouchableOpacity>

                  {/* Monthly Button */}
                  <TouchableOpacity
                    onPress={handleMonthlyClick}
                    disabled={!isSpecificDayOnSelected}
                    style={[
                      tw`py-3 px-5 rounded-lg`,
                      !isSpecificDayOnSelected
                        ? tw`bg-gray-300`
                        : selectedDayOnType === 'monthly'
                        ? tw`bg-green-600`
                        : tw`bg-blue-500`,
                    ]}>
                    <Text style={tw`text-white`}>Monthly</Text>
                  </TouchableOpacity>

                  {/* Yearly Button */}
                  <TouchableOpacity
                    onPress={handleYearlyClick}
                    disabled={!isSpecificDayOnSelected}
                    style={[
                      tw`py-3 px-5 rounded-lg`,
                      !isSpecificDayOnSelected
                        ? tw`bg-gray-300`
                        : selectedDayOnType === 'yearly'
                        ? tw`bg-green-600`
                        : tw`bg-blue-500`,
                    ]}>
                    <Text style={tw`text-white`}>Yearly</Text>
                  </TouchableOpacity>
                </View>

                {/* Show DayPicker modal when isDayPickerVisible is true */}
                {isDayPickerVisible && (
                  <DayPicker
                    selectedDays={selectedDays}
                    onSelectDays={setSelectedDays}
                    onCancel={() => setIsDayPickerVisible(false)}
                    onAddDay={() => setIsDayPickerVisible(false)} // Close modal on Add Day
                  />
                )}

                {/* Show DatePicker modal when isDatePickerVisible is true */}
                {isDatePickerVisible && (
                  <DatePicker
                    selectedDate={selectedDate}
                    onSelectDate={setSelectedDate}
                    onCancel={() => setIsDatePickerVisible(false)}
                    onAddDay={() => setIsDatePickerVisible(false)} // Close modal on Add Day
                  />
                )}

                {/* Show DateSelector modal when isDateSelectorVisible is true */}

                {isDateSeletorVisible && (
                  <DateSelector
                    selectedDates={selectedDates}
                    selectedMonths={selectedMonths}
                    onSelectDate={(date: number) => {
                      // Only allow one date to be selected
                      setSelectedDates([date]);
                    }}
                    onSelectMonth={(month: string) => {
                      // Only allow one month to be selected
                      setSelectedMonths([month]);
                    }}
                    onCancel={() => setIsDateSeletorVisible(false)} // Close the modal without saving
                    onAddDay={() => {
                      // Close the modal after saving the selected dates and months
                      setIsDateSeletorVisible(false);
                      // Optionally, you can also add additional logic here to save the selected values elsewhere if needed
                    }}
                  />
                )}

                {/* Add to Routine Button */}
                <TouchableOpacity
                  onPress={handleSaveTask}
                  style={tw`bg-blue-500 py-2 rounded-lg`}>
                  <Text style={tw`text-white text-center font-semibold`}>
                    Add to Daily Routines
                  </Text>
                </TouchableOpacity>

                {/* Toggle Button */}
                <TouchableOpacity
                  onPress={() =>
                    setExpandedTask(expandedTask === task ? null : task)
                  }
                  style={tw`p-3 rounded-lg`}>
                  <Icon
                    name={expandedTask === task ? 'chevron-up' : 'chevron-down'}
                    size={24}
                    color="#3B82F6" // Blue Color
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
      {/* bottom navigation */}
      <BottomNavigation></BottomNavigation>
    </View>
  );
};

export default AddDailyTaskScreen;