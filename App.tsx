import React from 'react';
import {View, Text, Image, TouchableOpacity, FlatList} from 'react-native';
import {s as tw} from 'react-native-wind';
import Icon from 'react-native-vector-icons/Ionicons';

type Task = {
  id: string;
  title: string;
  duration?: string;
  progress?: string;
  image: any;
  completed: boolean;
  favorite?: boolean;
};

const tasks: Task[] = [
  {
    id: '1',
    title: 'Walking',
    duration: '135m',
    image: require('./assets/images/Walking.png'),
    completed: false,
  },
  {
    id: '2',
    title: 'Skill Practice',
    image: require('./assets/images/Walking.png'),
    completed: false,
    favorite: true,
  },
  {
    id: '3',
    title: 'Eyes on News',
    image: require('./assets/images/Walking.png'),
    completed: false,
  },
  {
    id: '4',
    title: 'Course Watching',
    duration: '135m',
    image: require('./assets/images/Walking.png'),
    completed: false,
  },
  {
    id: '5',
    title: 'Organizing Home',
    image: require('./assets/images/Walking.png'),
    completed: false,
  },
  {
    id: '6',
    title: 'Gardening',
    image: require('./assets/images/Walking.png'),
    completed: false,
  },
  {
    id: '7',
    title: 'Prayer',
    progress: '3 of 5',
    image: require('./assets/images/Walking.png'),
    completed: false,
  },
  {
    id: '8',
    title: 'Walking',
    image: require('./assets/images/Walking.png'),
    completed: false,
  },
  {
    id: '9',
    title: 'Walking',
    image: require('./assets/images/Walking.png'),
    completed: false,
  },
  {
    id: '10',
    title: 'Gratitude Practice',
    image: require('./assets/images/Walking.png'),
    completed: true,
    favorite: true,
  },
  {
    id: '11',
    title: 'Creative Writing/Blog',
    duration: '135m',
    image: require('./assets/images/Walking.png'),
    completed: true,
  },
  {
    id: '12',
    title: 'Feeding Pet',
    progress: '5 of 5',
    image: require('./assets/images/Walking.png'),
    completed: true,
  },
];

type TaskItemProps = {
  item: Task;
};

const TaskItem: React.FC<TaskItemProps> = ({item}) => (
  <TouchableOpacity
    style={tw`flex-row items-center p-3 border-b ${
      item.completed ? 'bg-blue-100' : 'bg-white'
    }`}>
    <Image source={item.image} style={tw`w-6 h-6 mr-3`} />
    <View style={tw`flex-1`}>
      <Text
        style={tw`text-lg ${item.completed ? 'text-blue-500' : 'text-black'}`}>
        {item.title}
      </Text>
      {item.duration && (
        <Text style={tw`text-sm text-gray-500`}>{item.duration}</Text>
      )}
      {item.progress && (
        <Text style={tw`text-sm text-gray-500`}>{item.progress}</Text>
      )}
    </View>
    {item.favorite && <Text style={tw`text-yellow-500 text-lg`}>★</Text>}
  </TouchableOpacity>
);

const TodaysTaskToDoScreen: React.FC = () => {
  return (
    <View style={tw`flex-1 bg-gray-100 p-4`}>
      {/* Header */}
      <Text style={tw`text-2xl font-bold mb-4`}>Today</Text>
      <Text style={tw`text-lg text-gray-600 mb-4`}>Thursday, March 12</Text>

      {/* Task List */}
      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={({item}) => <TaskItem item={item} />}
      />

      {/* Bottom Navigation Bar */}
      <View
        style={tw`absolute bottom-0 left-0 right-0 bg-white py-3 border-t flex-row justify-around items-center`}>
        <TouchableOpacity>
          <Icon name="home-outline" size={24} color="blue" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name="barbell-outline" size={24} color="gray" />
        </TouchableOpacity>

        {/* Floating Plus Button with White Layered Background */}
        <View style={tw`absolute bottom-6 -translate-x-1/2`}>
          <View
            style={tw`w-14 h-14 bg-red-50 rounded-full absolute top-6 left-3 `}
          />
          <TouchableOpacity>
            <Icon name="add-circle" size={80} color="blue" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity>
          <Icon name="document-text-outline" size={24} color="gray" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name="person-outline" size={24} color="gray" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TodaysTaskToDoScreen;
