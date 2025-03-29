import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Modal,
  Alert,
  Button,
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

  const [duration, setDuration] = useState('Day');
  const [target, setTarget] = useState('30');
  const [oneTime, setOneTime] = useState('Weekly');
  const [selectedModal, setSelectedModal] = useState<
    'weekly' | 'monthly' | 'yearly' | null
  >(null);
  const [taskName, setTaskName] = useState('');
  const [specificFor, setSpecificFor] = useState('Days'); // Default to 'Days'
  const [specificForValue, setSpecificForValue] = useState('');
  const [dailyTarget, setDailyTarget] = useState('');
  const [targetType, setTargetType] = useState<'Minutes' | 'Times'>('Minutes');
  const toggleSpecificFor = () =>
    setIsSpecificForEnabled(!isSpecificForEnabled);
  const toggleDailyTarget = () =>
    setIsDailyTargetEnabled(!isDailyTargetEnabled);
  const [isSpecificForEnabled, setIsSpecificForEnabled] = useState(false);
  const [isDailyTargetEnabled, setIsDailyTargetEnabled] = useState(false);
  const [isDayPickerVisible, setIsDayPickerVisible] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  
  const handleWeeklyClick = () => {
    setIsDayPickerVisible(true); // Show DayPicker modal when Weekly is clicked
  };
  // Load saved tasks from AsyncStorage
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const storedTasks = await AsyncStorage.getItem('tasks');
        if (storedTasks) {
          console.log('Stored Tasks:', JSON.parse(storedTasks));
        }
      } catch (error) {
        console.error('Error loading tasks:', error);
      }
    };
    loadTasks();
  }, []);

  // AsyncStorage-এ টাস্ক সংরক্ষণ করা
  const saveTask = async () => {
    if (
      !isSpecificForEnabled ||
      (isSpecificForEnabled && specificForValue) ||
      !isDailyTargetEnabled ||
      (isDailyTargetEnabled && dailyTarget)
    ) {
      const newTask = {
        name: expandedTask,
        specificFor: isSpecificForEnabled
          ? `${specificForValue} ${specificFor}`
          : '',
        dailyTarget: isDailyTargetEnabled ? `${dailyTarget} ${targetType}` : '',
        selectedDays: selectedDays,
        icon: categoryIcons[selectedCategory as Category],
      };

      try {
        const existingTasks = await AsyncStorage.getItem('tasks');
        const tasksArray = existingTasks ? JSON.parse(existingTasks) : [];
        tasksArray.push(newTask);
        await AsyncStorage.setItem('tasks', JSON.stringify(tasksArray));
        Alert.alert('Success', 'Task added successfully!');
        navigation.navigate('AllTaskListScreen');
      } catch (error) {
        console.error('Error saving task:', error);
      }
    } else {
      Alert.alert('Error', 'Please fill at least one field.');
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
                </View>

                {/* Add Specific For */}
                <View style={tw`mb-6`}>
                  <View style={tw`flex-row items-center mb-4`}>
                    <TouchableOpacity onPress={toggleSpecificFor}>
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
                    <Text style={tw`text-xs font-semibold`}>
                      Add specific for:
                    </Text>
                    <TextInput
                      style={tw`border p-2 rounded w-8 text-xs mt-2`}
                      keyboardType="numeric"
                      placeholder="00"
                      value={specificForValue}
                      onChangeText={setSpecificForValue}
                      editable={isSpecificForEnabled} // ✅ Radio Button অন হলে ইনপুট হবে
                    />

                    <TouchableOpacity
                      style={tw` py-2 mx-1 rounded ${
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
                      style={tw`px-2 py-2 rounded ${
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
                      style={tw`px-2 py-2 rounded ${
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
                      Set Daily Target:
                    </Text>
                    <TextInput
                      style={tw`border p-2 rounded w-8 text-xs mt-2`}
                      keyboardType="numeric"
                      placeholder="00"
                      value={dailyTarget}
                      onChangeText={setDailyTarget}
                      editable={isDailyTargetEnabled} // ✅ Radio Button অন হলে ইনপুট হবে
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

                {/* One-Time Selection */}
                <Button title="Weekly" onPress={handleWeeklyClick} />
                <Button title="Monthly" onPress={handleWeeklyClick}/>
                <Button title="Yearly" onPress={() => {}} />

                {/* Show DayPicker modal when isDayPickerVisible is true */}
                {isDayPickerVisible && (
                  <DayPicker
                    selectedDays={selectedDays}
                    onSelectDays={setSelectedDays}
                    onCancel={() => setIsDayPickerVisible(false)}
                    onAddDay={() => setIsDayPickerVisible(false)} // Close modal on Add Day
                  />
                )}        
                {/* Add to Routine Button */}
                <TouchableOpacity
                  onPress={saveTask}
                  style={tw`bg-blue-500 py-2 rounded-lg`}>
                  <Text style={tw`text-white text-center font-semibold`}>
                    Add to Daily Routine
                  </Text>
                </TouchableOpacity>

                {/* Toggle Button */}
                <TouchableOpacity
                  onPress={() =>
                    setExpandedTask(expandedTask === task ? null : task)
                  }
                  style={tw`p-3 rounded-lg `}>
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
