import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { s as tw } from 'react-native-wind';

// Category Icons
const categoryIcons: Record<string, any> = {
  Fitness: require('./assets/images/fitness.png'),
  Wellness: require('./assets/images/wellness.png'),
  Work: require('./assets/images/work.png'),
  Nutrition: require('./assets/images/nutrition.png'),
};

// Task Data
const tasksData: Record<string, any> = {
  Fitness: {
    Walking: require('./assets/images/Walking.png'),
    Running: require('./assets/images/Running.png'),
    Swimming: require('./assets/images/Swimming.png'),
    Cycling: require('./assets/images/Cycling.png'),
    Yoga: require('./assets/images/Yoga.png'),
    'Strength Workout': require('./assets/images/StrengthWorkout.png'),
    'Stretching Workout': require('./assets/images/StretchingWorkout.png'),
    'High Intensive Interval Trainning': require('./assets/images/High.png'),
    'Rope Jumping': require('./assets/images/RopeJumping.png'),
    'Dance Workout': require('./assets/images/DanceWorkout.png'),
    Others: require('./assets/images/Others.png'),
  },
  Wellness: {
    Meditation: require('./assets/images/Walking.png'),
    Journaling: require('./assets/images/Walking.png'),
  },
  Work: {
    Task1: require('./assets/images/Walking.png'),
    Task2: require('./assets/images/Walking.png'),
  },
  Nutrition: {
    HealthyFood: require('./assets/images/Walking.png'),
    DietPlan: require('./assets/images/Walking.png'),
  },
};

// List of categories
const categories = Object.keys(categoryIcons);

// Make Infinite Scroll Data (Repeat categories)
const infiniteCategories = [...categories, ...categories, ...categories];

const DailyTaskScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0]);
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  // Handle scrolling and auto-select first visible category
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollX = event.nativeEvent.contentOffset.x;
    const categoryWidth = 80; // Approximate width of each category item

    const firstVisibleIndex = Math.round(scrollX / categoryWidth) % categories.length;
    setSelectedCategory(categories[firstVisibleIndex]);
  };

  // Infinite Scroll Effect
  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollX = event.nativeEvent.contentOffset.x;
    const categoryWidth = 80;
    const totalWidth = categoryWidth * categories.length;

    if (scrollX >= totalWidth) {
      scrollViewRef.current?.scrollTo({ x: 0, animated: false });
    }
  };

  return (
    <ScrollView style={tw`flex-1 bg-red-50 p-4`}>
      {/* Header */}
      <Text style={tw`text-xl font-bold text-black mb-1`}>Add Daily Task</Text>
      <Text style={tw`text-sm text-gray-500 mb-4`}>
        Add tasks to your daily routine to stay productive.
      </Text>

      {/* Horizontal Scrollable Categories */}
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
                selectedCategory === category ? tw`border-blue-500` : tw`border-gray-300`,
              ]}>
              <Image source={categoryIcons[category]} style={tw`w-8 h-8`} />
            </View>
            <Text
              style={tw`text-sm mt-1 ${selectedCategory === category ? 'text-blue-500' : 'text-gray-600'}`}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Tasks List Based on Selected Category */}
      {Object.keys(tasksData[selectedCategory] || {}).map((task, index) => (
        <View key={index} style={tw`mb-2`}>
          <TouchableOpacity
            onPress={() => setExpandedTask(expandedTask === task ? null : task)}
            style={tw`flex-row items-center justify-between bg-white p-3 rounded-lg`}>
            <View style={tw`flex-row items-center`}>
              <Image source={tasksData[selectedCategory][task]} style={tw`mr-3`} />
              <Text style={tw`text-base font-semibold text-black`}>{task}</Text>
            </View>
            <Icon
              name={expandedTask === task ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#DFDFDF"
            />
          </TouchableOpacity>

          {/* Expanded Task Options */}
          {expandedTask === task && (
            <View style={tw`bg-white p-4 mt-2 rounded-lg shadow-lg border border-gray-200`}>
              <Text style={tw`text-black text-base mb-2`}>Add to my Routine for</Text>
              <View style={tw`flex-row items-center`}>
                <TextInput
                  style={tw`border border-gray-300 text-black rounded-md p-2 w-16 text-center`}
                  defaultValue="365"
                  keyboardType="numeric"
                />
                <Text style={tw`text-black mx-2`}>Day</Text>
                <TouchableOpacity style={tw`bg-blue-500 px-3 py-2 rounded-md`}>
                  <Text style={tw`text-white`}>Week</Text>
                </TouchableOpacity>
              </View>

              <Text style={tw`text-black text-base mt-3 mb-2`}>Set Daily Target</Text>
              <View style={tw`flex-row items-center`}>
                <TextInput
                  style={tw`border border-gray-300 text-black rounded-md p-2 w-16 text-center`}
                  defaultValue="60"
                  keyboardType="numeric"
                />
                <Text style={tw`text-black mx-2`}>Min</Text>
                <TouchableOpacity style={tw`bg-blue-500 px-3 py-2 rounded-md`}>
                  <Text style={tw`text-white`}>Set</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={tw`bg-blue-500 mt-4 py-3 rounded-md`}>
                <Text style={tw`text-white text-center font-bold`}>Add to Routine</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
};

export default DailyTaskScreen;
