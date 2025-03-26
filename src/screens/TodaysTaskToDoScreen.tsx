import React, {useState} from 'react';
import {View, Text, Image, TouchableOpacity, FlatList} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {s as tw} from 'react-native-wind';
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

type NavigationProp = StackNavigationProp<
  RootStackParamList,
  'TodaysTaskToDoScreen'
>;
// Define Task Type
interface Task {
  id: number;
  title: string;
  time?: string;
  progress?: string;
  image: any; // Consider using ImageSourcePropType
  starred: boolean;
  completed: boolean;
}

// Initial Task List
const initialTasks: Task[] = [
  {
    id: 1,
    title: 'Walking',
    time: '135 min',
    image: require('../../assets/images/Walking.png'),
    starred: false,
    completed: false,
  },
  {
    id: 2,
    title: 'Skill Practice',
    image: require('../../assets/images/Walking.png'),
    starred: false,
    completed: false,
  },
  {
    id: 3,
    title: 'Eyes on News',
    image: require('../../assets/images/Walking.png'),
    starred: false,
    completed: false,
  },
  {
    id: 4,
    title: 'Course Watching',
    time: '135 min',
    image: require('../../assets/images/Walking.png'),
    starred: false,
    completed: false,
  },
  {
    id: 5,
    title: 'Organizing Home',
    image: require('../../assets/images/Walking.png'),
    starred: false,
    completed: false,
  },
  {
    id: 6,
    title: 'Gardening',
    image: require('../../assets/images/Walking.png'),
    starred: false,
    completed: false,
  },
  {
    id: 7,
    title: 'Prayer',
    progress: '0 / 5',
    image: require('../../assets/images/Walking.png'),
    starred: false,
    completed: false,
  },
  {
    id: 8,
    title: 'Walking',
    image: require('../../assets/images/Walking.png'),
    starred: false,
    completed: false,
  },
  {
    id: 9,
    title: 'Gratitude Practice',
    completed: true,
    image: require('../../assets/images/Walking.png'),
    starred: false,
  },
  {
    id: 10,
    title: 'Creative Writing/Blogging',
    time: '135 min',
    completed: true,
    image: require('../../assets/images/Walking.png'),
    starred: false,
  },
  {
    id: 11,
    title: 'Feeding Pet',
    progress: '5 / 5',
    completed: true,
    image: require('../../assets/images/Walking.png'),
    starred: false,
  },
  {
    id: 12,
    title: 'Walking',
    time: '135 min',
    image: require('../../assets/images/Walking.png'),
    starred: false,
    completed: true,
  },
  {
    id: 13,
    title: 'Skill Practice',
    image: require('../../assets/images/Walking.png'),
    starred: false,
    completed: true,
  },
  {
    id: 14,
    title: 'Eyes on News',
    image: require('../../assets/images/Walking.png'),
    starred: false,
    completed: true,
  },
  {
    id: 15,
    title: 'Course Watching',
    time: '135 min',
    image: require('../../assets/images/Walking.png'),
    starred: false,
    completed: true,
  },
  {
    id: 16,
    title: 'Organizing Home',
    image: require('../../assets/images/Walking.png'),
    starred: false,
    completed: true,
  },
];

const TodaysTaskToDoScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  // Toggle Completion Status (Updated Sorting Logic)
  const toggleComplete = (id: number) => {
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.map(task =>
        task.id === id ? {...task, completed: !task.completed} : task,
      );

      // Separate completed and non-completed tasks
      const nonCompletedTasks = updatedTasks.filter(task => !task.completed);
      const completedTasks = updatedTasks.filter(task => task.completed);

      // Sort non-completed tasks → Starred tasks উপরে
      nonCompletedTasks.sort((a, b) => Number(b.starred) - Number(a.starred));

      // Sort completed tasks → Starred tasks উপরে কিন্তু সব Completed tasks নিচে থাকবে
      completedTasks.sort((a, b) => Number(b.starred) - Number(a.starred));

      return [...nonCompletedTasks, ...completedTasks];
    });
  };

  // Toggle Starred Status (Updated Sorting Logic)
  const toggleStar = (id: number) => {
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.map(task =>
        task.id === id ? {...task, starred: !task.starred} : task,
      );

      // Separate completed and non-completed tasks
      const nonCompletedTasks = updatedTasks.filter(task => !task.completed);
      const completedTasks = updatedTasks.filter(task => task.completed);

      // Sort non-completed tasks → Starred tasks উপরে
      nonCompletedTasks.sort((a, b) => Number(b.starred) - Number(a.starred));

      // Sort completed tasks → Starred tasks উপরে কিন্তু সব Completed tasks নিচে থাকবে
      completedTasks.sort((a, b) => Number(b.starred) - Number(a.starred));

      return [...nonCompletedTasks, ...completedTasks];
    });
  };

  // Task Item Component
  const TaskItem: React.FC<{task: Task}> = ({task}) => (
    <View
      style={[
        tw`flex-row items-center p-2 border-b border-gray-200`,
        task.completed && tw`bg-green-100`,
      ]}>
      <TouchableOpacity onPress={() => toggleComplete(task.id)}>
        <Icon
          name={task.completed ? 'checkmark-circle' : 'ellipse-outline'}
          size={24}
          color={task.completed ? 'green' : 'gray'}
          style={tw`mr-2`}
        />
      </TouchableOpacity>
      <Image source={task.image} style={tw`w-6 h-6 mr-2`} />
      <Text style={tw`flex-1`}>{task.title}</Text>
      {task.time && <Text style={tw`text-gray-500`}>{task.time}</Text>}
      {task.progress && <Text style={tw`text-gray-500`}>{task.progress}</Text>}
      <TouchableOpacity onPress={() => toggleStar(task.id)}>
        <Icon
          name={task.starred ? 'star' : 'star-outline'}
          size={20}
          color={task.starred ? 'gold' : 'gray'}
          style={tw`ml-2`}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={tw`flex-1 bg-gray-100`}>
      {/* Header */}
      <View style={tw`bg-blue-500 p-4 flex-row justify-between items-center`}>
        <View>
          <Text style={tw`text-white text-lg font-bold`}>Today</Text>
          <Text style={tw`text-white text-sm`}>March 12, Friday</Text>
        </View>
        <View style={tw`flex-row items-center`}>
          <Image
            source={require('../../assets/images/sun.png')}
            style={tw`w-10 h-10 rounded-full mr-3`}
          />
          <View>
            <Text style={tw`text-white text-lg font-bold`}>Mr Rony</Text>
            <Text style={tw`text-white text-sm`}>mrrony1574@gmail.com</Text>
          </View>
        </View>
      </View>

      {/* Task List */}
      <FlatList
        data={tasks}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => <TaskItem task={item} />}
        extraData={tasks} // Ensures re-render on state update
      />

      {/* Bottom Navigation */}

      <View
        style={tw`flex-row justify-between p-4 border-t border-gray-200 bg-white`}>
        <TouchableOpacity>
          <Icon
            name="home-outline"
            size={28}
            color="gray"
            onPress={() => navigation.navigate('TodaysTaskToDoScreen')}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon
            name="bar-chart-outline"
            size={28}
            color="gray"
            onPress={() => navigation.navigate('MyStatisticsScreen')}
          />
        </TouchableOpacity>
        <TouchableOpacity style={tw`bg-blue-500 rounded-full p-4`}>
          <Icon
            name="add"
            size={28}
            color="white"
            onPress={() => navigation.navigate('AddDailyTaskScreen')}
          />
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
          <Icon
            name="settings-outline"
            size={28}
            color="gray"
            onPress={() => navigation.navigate('ProfileManageScreen')}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TodaysTaskToDoScreen;
