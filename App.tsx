import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { s as tw } from 'react-native-wind';

const tasks = [
  { name: 'Walking', frequency: 'Daily', icon: require('./assets/images/Walking.png') },
  { name: 'Skill Practice', frequency: 'Daily', icon: require('./assets/images/Walking.png') },
  { name: 'Eyes on News', frequency: 'Yearly', icon: require('./assets/images/Walking.png') },
  { name: 'Course Watching', frequency: 'Daily', icon: require('./assets/images/Walking.png') },
  { name: 'Organizing Home', frequency: 'Daily', icon: require('./assets/images/Walking.png') },
  { name: 'Gardening', frequency: 'Daily', icon: require('./assets/images/Walking.png') },
  { name: 'Prayer', frequency: 'Daily', icon: require('./assets/images/Walking.png') },
];

const TaskItem = ({ task }) => (
  <View style={tw`flex-row items-center justify-between p-2 border-b border-gray-200`}> 
    <View style={tw`flex-row items-center`}>
      <Image source={task.icon} style={tw`w-6 h-6 mr-2`} />
      <Text style={tw`text-lg font-medium`}>{task.name}</Text>
    </View>
    <Text style={tw`text-gray-500`}>{task.frequency}</Text>
    <TouchableOpacity>
      <Icon name="create-outline" size={20} color="gray" />
    </TouchableOpacity>
  </View>
);

const TaskListScreen = () => {
  return (
    <View style={tw`flex-1 bg-white`}> 
      <Text style={tw`text-xl font-bold text-center p-4`}>All Tasks List</Text>
      <ScrollView>
        {tasks.map((task, index) => (
          <TaskItem key={index} task={task} />
        ))}
      </ScrollView>
      <View style={tw`flex-row justify-between p-4 border-t border-gray-200 bg-white`}> 
        <Icon name="home-outline" size={28} color="gray" />
        <Icon name="bar-chart-outline" size={28} color="gray" />
        <TouchableOpacity style={tw`bg-blue-500 rounded-full p-4`}> 
          <Icon name="add" size={28} color="white" />
        </TouchableOpacity>
        <Icon name="calendar-outline" size={28} color="gray" />
        <Icon name="settings-outline" size={28} color="gray" />
      </View>
    </View>
  );
};

export default TaskListScreen;
