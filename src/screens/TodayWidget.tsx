import React from 'react';
import {View, Text, FlatList, TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {s as tw} from 'react-native-wind';

const tasks = [
  {id: 1, title: 'Walking', time: '135', starred: true},
  {id: 2, title: 'Skill Practice', starred: true},
  {id: 3, title: 'Eyes on News', starred: false},
  {id: 4, title: 'Course Watching', time: '135', starred: false},
  {id: 5, title: 'Organizing Home', starred: false},
];

const TodayWidget = () => {
  return (
    <View style={tw`bg-white rounded-xl mx-3 mt-5 shadow`}>
      {/* Header */}
      <View
        style={tw`flex-row items-center justify-between px-4 py-2 bg-blue-500 rounded-t-xl`}>
        <Text style={tw`text-white font-semibold text-base`}>Today</Text>
        <Text style={tw`text-white text-sm`}>6/10 Done</Text>
        <TouchableOpacity>
          <Ionicons name="add-circle-outline" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Task List */}
      {tasks.map(task => (
        <View
          key={task.id}
          style={tw`flex-row items-center justify-between px-4 py-3 border-b border-gray-200`}>
          <View style={tw`flex-row items-center`}>
            <Ionicons
              name="ellipse-outline"
              size={20}
              color="#888"
              style={tw`mr-2`}
            />
            <Ionicons
              name="walk-outline"
              size={18}
              color="#1E90FF"
              style={tw`mr-2`}
            />

            <Text style={tw`text-base text-gray-800`}>{task.title}</Text>
          </View>

          <View style={tw`flex-row items-center`}>
            {task.time && (
              <View style={tw`bg-gray-100 rounded px-2 py-0.5 mr-2`}>
                <Text style={tw`text-xs text-gray-700`}>{task.time}m</Text>
              </View>
            )}
            <Ionicons
              name={task.starred ? 'star' : 'star-outline'}
              size={18}
              color={task.starred ? '#007AFF' : '#999'}
            />
          </View>
        </View>
      ))}
    </View>
  );
};

export default TodayWidget;
