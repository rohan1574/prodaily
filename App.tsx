import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // ✅ Fixed import
import { s as tw } from 'react-native-wind';

const categoryIcons: Record<string, any> = {
  Fitness: require('./assets/images/Google.png'),
  // Add more categories if needed
};

const taskIcons: Record<string, any> = {
  Walking: require('./assets/images/Google.png'),
  Cycling: require('./assets/images/Google.pnge'),
  // Add more tasks if needed
};

const categories = Object.keys(categoryIcons);
const tasks = Object.keys(taskIcons);

const DailyTaskScreen = () => {
  const [expandedTask, setExpandedTask] = useState<string | null>(null);

  return (
    <ScrollView style={tw`flex-1 bg-white p-4`}>
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
                category === 'Fitness' ? tw`border-2 border-blue-500` : tw`border-2 border-gray-300`,
              ]}
            >
              <Image source={categoryIcons[category]} style={tw`w-8 h-8`} />
            </View>
            <Text style={tw`text-sm mt-1 ${category === 'Fitness' ? 'text-blue-500' : 'text-gray-600'}`}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tasks List */}
      {tasks.map((task, index) => (
        <View key={index} style={tw`mb-2`}>
          <TouchableOpacity
            onPress={() => setExpandedTask(expandedTask === task ? null : task)}
            style={tw`flex-row items-center justify-between bg-gray-100 p-3 rounded-lg`}
          >
            <View style={tw`flex-row items-center`}>
              <Image source={taskIcons[task]} style={tw`w-6 h-6 mr-3`} />
              <Text style={tw`text-black text-base`}>{task}</Text>
            </View>
            <Icon name={expandedTask === task ? 'chevron-up' : 'chevron-down'} size={20} color="#007AFF" />
          </TouchableOpacity>

          {/* Expanded Task Options */}
          {expandedTask === task && (task === 'Cycling' ||task === 'Walking' )&& (
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
