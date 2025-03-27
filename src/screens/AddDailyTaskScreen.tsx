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
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {s as tw} from 'react-native-wind';
import DateSelector from './DateSelector';
import DatePicker from './DatePicker';
import DayPicker from './DayPicker';
import categoryIcons from '../data/categoryIcons';
import tasksData from '../data/tasksData';

import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';

// Define the navigation type
type RootStackParamList = {
  TodaysTaskToDoScreen: undefined;
  MyCalenderFutureTaskScreen: undefined;
  MyStatisticsScreen: undefined;
  ProfileManageScreen: undefined;
  AddDailyTaskScreen: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'TodaysTaskToDoScreen'>;
// List of categories
const categories = Object.keys(categoryIcons);

// Make Infinite Scroll Data (Repeat categories)
const infiniteCategories = [...categories, ...categories, ...categories];

const AddDailyTaskScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [selectedCategory, setSelectedCategory] = useState<string>(
    categories[0],
  );
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

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
  const [duration, setDuration] = useState('Day');
  const [target, setTarget] = useState('30');
  const [oneTime, setOneTime] = useState('Weekly');
  const [selectedModal, setSelectedModal] = useState<
    'weekly' | 'monthly' | 'yearly' | null
  >(null);

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
                <Image source={categoryIcons['Fitness']} style={tw`w-8 h-8`} />
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
              onPress={() =>
                setExpandedTask(expandedTask === task ? null : task)
              }
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

                {/* Routine Duration */}
                <Text style={tw`text-gray-600 mb-2`}>Add specific for</Text>
                <View style={tw`flex-row items-center mb-4`}>
                  <TextInput
                    value="365"
                    keyboardType="numeric"
                    style={tw`border border-gray-300 rounded-lg px-2 w-16 text-center`}
                  />
                  {['Day', 'Week', 'Month'].map(item => (
                    <TouchableOpacity
                      key={item}
                      onPress={() => setDuration(item)}
                      style={tw`ml-2 px-3 py-1 rounded-lg ${
                        duration === item
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200'
                      }`}>
                      <Text
                        style={tw`${
                          duration === item ? 'text-white' : 'text-gray-700'
                        }`}>
                        {item}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Daily Target */}
                <View style={tw`flex-row items-center mb-4`}>
                  <TouchableOpacity style={tw`mr-2`}>
                    <Icon name="radio-button-on" size={20} color="#3B82F6" />
                  </TouchableOpacity>
                  <Text style={tw`text-gray-700 mr-2`}>Set Daily Target</Text>
                  <TextInput
                    value={target}
                    onChangeText={setTarget}
                    keyboardType="numeric"
                    style={tw`border border-gray-300 rounded-lg px-2 w-16 text-center`}
                  />
                  <Text style={tw`text-gray-700 ml-2`}>Min</Text>
                </View>

                {/* One-Time Selection */}
                <View style={tw`flex-row items-center mb-4`}>
                  <TouchableOpacity style={tw`mr-2`}>
                    <Icon name="radio-button-on" size={20} color="#3B82F6" />
                  </TouchableOpacity>
                  <Text style={tw`text-gray-700 mr-2`}>Add once a</Text>
                  {['Weekly', 'Monthly', 'Yearly'].map(item => (
                    <TouchableOpacity
                      key={item}
                      onPress={() => {
                        setOneTime(item);
                        if (item === 'Weekly') setSelectedModal('weekly');
                        if (item === 'Monthly') setSelectedModal('monthly');
                        if (item === 'Yearly') setSelectedModal('yearly');
                      }}
                      style={tw`px-2 py-1 rounded-lg ${
                        oneTime === item ? 'bg-blue-500' : 'bg-gray-200'
                      }`}>
                      <Text
                        style={tw`${
                          oneTime === item ? 'text-white' : 'text-gray-700'
                        }`}>
                        {item}
                      </Text>
                    </TouchableOpacity>
                  ))}
                  {/* Modal Views */}
                  <Modal
                    visible={selectedModal === 'weekly'}
                    animationType="slide"
                    transparent={true}>
                    <View
                      style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}>
                      <View style={tw`bg-white p-4 rounded-lg w-3/4`}>
                        <DayPicker onCancel={() => setSelectedModal(null)} />
                      </View>
                    </View>
                  </Modal>
                  <Modal
                    visible={selectedModal === 'monthly'}
                    animationType="slide"
                    transparent={true}>
                    <View
                      style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}>
                      <View style={tw`bg-white p-4 rounded-lg w-3/4`}>
                        <DatePicker onCancel={() => setSelectedModal(null)} />
                      </View>
                    </View>
                  </Modal>
                  <Modal
                    visible={selectedModal === 'yearly'}
                    animationType="slide"
                    transparent={true}>
                    <View
                      style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}>
                      <View style={tw`bg-white p-4 rounded-lg w-3/4`}>
                        <DateSelector onCancel={() => setSelectedModal(null)} />
                      </View>
                    </View>
                  </Modal>
                </View>

                {/* Add to Routine Button */}
                <TouchableOpacity style={tw`bg-blue-500 py-2 rounded-lg`}>
                  <Text style={tw`text-white text-center font-semibold`}>
                    Add to Routine
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

      <View
        style={tw`flex-row justify-between p-4 border-t border-gray-200 bg-white`}>
        <TouchableOpacity>
          <Icon name="home-outline" size={28} color="gray" onPress={() => navigation.navigate('TodaysTaskToDoScreen')}/>
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name="bar-chart-outline" size={28} color="gray" onPress={() => navigation.navigate('MyStatisticsScreen')}/>
        </TouchableOpacity>
        <TouchableOpacity style={tw`bg-blue-500 rounded-full p-4`}>
          <Icon name="add" size={28} color="white" onPress={() => navigation.navigate('AddDailyTaskScreen')}/>
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon
            name="calendar-outline"
            size={28}
            color="gray"
            onPress={() => navigation.navigate('MyCalenderFutureTaskScreen')}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name="settings-outline" size={28} color="gray" onPress={() => navigation.navigate('ProfileManageScreen')} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default AddDailyTaskScreen;