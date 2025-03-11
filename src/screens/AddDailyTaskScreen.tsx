import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // ✅ Fixed import
import {s as tw} from 'react-native-wind';

const categoryIcons: Record<string, any> = {
  Fitness: require('./assets/images/fitness.png'),
  Wellness: require('./assets/images/wellness.png'),
  Work: require('./assets/images/work.png'),
  Nutrition: require('./assets/images/nutrition.png'),
  Nut: require('./assets/images/nutrition.png'),
  // Add more categories if needed
};

const Fitness: Record<string, any> = {
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
  // Add more tasks if needed
};
const Wellness: Record<string, any> = {
  Meditation: require('./assets/images/Walking.png'),
  Running: require('./assets/images/Running.png'),
  Journaling: require('./assets/images/Swimming.png'),
  Cycling: require('./assets/images/Cycling.png'),
  Yoga: require('./assets/images/Yoga.png'),
  'Strength Workout': require('./assets/images/StrengthWorkout.png'),
  'Stretching Workout': require('./assets/images/StretchingWorkout.png'),
  'High Intensive Interval Trainning': require('./assets/images/High.png'),
  'Rope Jumping': require('./assets/images/RopeJumping.png'),
  'Dance Workout': require('./assets/images/DanceWorkout.png'),
  Others: require('./assets/images/Others.png'),
  // Add more tasks if needed
};

const categories = Object.keys(categoryIcons);
const fitness = Object.keys(Fitness);

const DailyTaskScreen = () => {
  const [expandedTask, setExpandedTask] = useState<string | null>(null);

  return (
    <ScrollView style={tw`flex-1 bg-red-50 p-4`}>
      {/* Header */}
      <Text style={tw`text-xl font-bold text-black mb-1`}>Add Daily Task</Text>
      <Text style={tw`text-sm text-gray-500 mb-4`}>
        Add tasks to your daily routine to stay productive.
      </Text>

      {/* Categories */}
      <View style={tw`flex-row justify-between mb-4`}>
        {categories.map((category, index) => (
          <TouchableOpacity key={index} style={tw`items-center`}>
            <View
              style={[
                tw`w-16 h-16 rounded-full flex items-center justify-center`,
                category === 'Fitness'
                  ? tw`border-2 border-blue-500`
                  : tw`border-2 border-gray-300`,
              ]}>
              <Image source={categoryIcons[category]} style={tw`w-8 h-8`} />
            </View>
            <Text
              style={tw`text-sm mt-1 ${
                category === 'Fitness' ? 'text-blue-500' : 'text-gray-600'
              }`}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tasks List */}
      {fitness.map((task, index) => (
        <View key={index} style={tw`mb-2`}>
          <TouchableOpacity
            onPress={() => setExpandedTask(expandedTask === task ? null : task)}
            style={tw`flex-row items-center justify-between bg-white p-3 rounded-lg`}>
            <View style={tw`flex-row items-center`}>
              <Image source={Fitness[task]} style={[tw` mr-3`]} />
              <Text style={[tw`text-base font-semibold`,{color:"#27282A",fontSize:14}]}>{task}</Text>
            </View>
            <Icon
              name={expandedTask === task ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#DFDFDF"
            />
          </TouchableOpacity>

          {/* Expanded Task Options */}
          {expandedTask === task &&
            (task === 'Cycling' || task === 'Walking') && (
              <View
                style={tw`bg-white p-4 mt-2 rounded-lg shadow-lg border border-gray-200`}>
                <Text style={tw`text-black text-base mb-2`}>
                  Add to my Routine for
                </Text>
                <View style={tw`flex-row items-center`}>
                  <TextInput
                    style={tw`border border-gray-300 text-black rounded-md p-2 w-16 text-center`}
                    defaultValue="365"
                    keyboardType="numeric"
                  />
                  <Text style={tw`text-black mx-2`}>Day</Text>
                  <TouchableOpacity
                    style={tw`bg-blue-500 px-3 py-2 rounded-md`}>
                    <Text style={tw`text-white`}>Week</Text>
                  </TouchableOpacity>
                </View>

                <Text style={tw`text-black text-base mt-3 mb-2`}>
                  Set Daily Target
                </Text>
                <View style={tw`flex-row items-center`}>
                  <TextInput
                    style={tw`border border-gray-300 text-black rounded-md p-2 w-16 text-center`}
                    defaultValue="60"
                    keyboardType="numeric"
                  />
                  <Text style={tw`text-black mx-2`}>Min</Text>
                  <TouchableOpacity
                    style={tw`bg-blue-500 px-3 py-2 rounded-md`}>
                    <Text style={tw`text-white`}>Set</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity style={tw`bg-blue-500 mt-4 py-3 rounded-md`}>
                  <Text style={tw`text-white text-center font-bold`}>
                    Add to Routine
                  </Text>
                </TouchableOpacity>
              </View>
            )}
        </View>
      ))}
    </ScrollView>
  );
};

export default DailyTaskScreen;
