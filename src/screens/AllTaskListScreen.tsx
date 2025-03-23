import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { s as tw } from 'react-native-wind';

interface Task {
  name: string;
  frequency: string;
  icon: any;
}

const tasks: Task[] = [
  { name: 'Walking', frequency: 'Daily', icon: require('./assets/images/Walking.png') },
  { name: 'Skill Practice', frequency: 'Daily', icon: require('./assets/images/Walking.png') },
  { name: 'Eyes on News', frequency: 'Yearly', icon: require('./assets/images/Walking.png') },
  { name: 'Course Watching', frequency: 'Daily', icon: require('./assets/images/Walking.png') },
  { name: 'Organizing Home', frequency: 'Daily', icon: require('./assets/images/Walking.png') },
  { name: 'Gardening', frequency: 'Daily', icon: require('./assets/images/Walking.png') },
  { name: 'Prayer', frequency: 'Daily', icon: require('./assets/images/Walking.png') },
  { name: 'Walking', frequency: 'Daily', icon: require('./assets/images/Walking.png') },
  { name: 'Skill Practice', frequency: 'Daily', icon: require('./assets/images/Walking.png') },
  { name: 'Eyes on News', frequency: 'Yearly', icon: require('./assets/images/Walking.png') },
  { name: 'Course Watching', frequency: 'Daily', icon: require('./assets/images/Walking.png') },
  { name: 'Organizing Home', frequency: 'Daily', icon: require('./assets/images/Walking.png') },
  { name: 'Gardening', frequency: 'Daily', icon: require('./assets/images/Walking.png') },
  { name: 'Prayer', frequency: 'Daily', icon: require('./assets/images/Walking.png') },
];

const TaskItem: React.FC<{ task: Task; onEdit: () => void; isSelected: boolean; onFavorite: () => void; isFavorite: boolean }> = ({ task, onEdit, isSelected, onFavorite, isFavorite }) => {
  const [specificFor, setSpecificFor] = useState('13');
  const [dailyTarget, setDailyTarget] = useState('0');

  return (
    <View>
      <View style={tw`flex-row items-center justify-between p-2 border-b border-gray-200`}> 
        <View style={tw`flex-row items-center`}>
          <Image source={task.icon} style={tw`w-6 h-6 mr-2`} />
          <Text style={tw`text-lg font-medium`}>{task.name}</Text>
        </View>
        <View style={tw`flex-row items-center`}>
          <TouchableOpacity onPress={onFavorite} style={tw`mr-2`}>
            <Icon name={isFavorite ? "star" : "star-outline"} size={20} color={isFavorite ? "gold" : "gray"} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onEdit}>
            <Icon name="create-outline" size={20} color="gray" />
          </TouchableOpacity>
        </View>
      </View>
      {isSelected && (
        <View style={tw`p-4 bg-blue-100 border-t border-blue-300 rounded-lg m-2`}> 
          <Text style={tw`text-lg font-bold mb-2`}>{task.name}</Text>
          
          <View style={tw`mb-2`}> 
            <Text style={tw`text-gray-700`}>Add Specific For:</Text>
            <TextInput style={tw`border p-1 rounded w-16 text-center`} keyboardType="numeric" value={specificFor} onChangeText={setSpecificFor} />
            <View style={tw`flex-row mt-1`}>
              <TouchableOpacity style={tw`bg-blue-500 px-2 py-1 rounded mx-1`}><Text style={tw`text-white`}>Days</Text></TouchableOpacity>
              <TouchableOpacity style={tw`bg-gray-300 px-2 py-1 rounded mx-1`}><Text>Weeks</Text></TouchableOpacity>
              <TouchableOpacity style={tw`bg-gray-300 px-2 py-1 rounded mx-1`}><Text>Months</Text></TouchableOpacity>
            </View>
          </View>
          
          <View style={tw`mb-2`}> 
            <Text style={tw`text-gray-700`}>Set Daily Target:</Text>
            <TextInput style={tw`border p-1 rounded w-16 text-center`} keyboardType="numeric" value={dailyTarget} onChangeText={setDailyTarget} />
            <Text style={tw`ml-2`}>Min or</Text>
            <TextInput style={tw`border p-1 rounded w-16 text-center ml-2`} keyboardType="numeric" />
            <Text style={tw`ml-2`}>Times</Text>
          </View>
          
          <View style={tw`mb-2`}> 
            <Text style={tw`text-gray-700`}>Add Once a:</Text>
            <View style={tw`flex-row mt-1`}>
              <TouchableOpacity style={tw`bg-gray-300 px-2 py-1 rounded mx-1`}><Text>Week</Text></TouchableOpacity>
              <TouchableOpacity style={tw`bg-blue-500 px-2 py-1 rounded mx-1`}><Text style={tw`text-white`}>Month</Text></TouchableOpacity>
              <TouchableOpacity style={tw`bg-gray-300 px-2 py-1 rounded mx-1`}><Text>Year</Text></TouchableOpacity>
            </View>
          </View>
          
          <TouchableOpacity style={tw`bg-blue-500 p-2 rounded mt-2`} onPress={onEdit}> 
            <Text style={tw`text-white text-center`}>Update Task</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const AllTaskListScreen: React.FC = () => {
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  const toggleFavorite = (taskName: string) => {
    setFavorites((prev) =>
      prev.includes(taskName) ? prev.filter((name) => name !== taskName) : [...prev, taskName]
    );
  };

  return (
    <View style={tw`flex-1 bg-white`}> 
      <Text style={tw`text-xl font-bold text-center p-4`}>All Tasks List</Text>
      <ScrollView>
        {tasks.map((task, index) => (
          <TaskItem 
            key={index} 
            task={task} 
            onEdit={() => setSelectedTask(selectedTask === task.name ? null : task.name)} 
            isSelected={selectedTask === task.name} 
            onFavorite={() => toggleFavorite(task.name)}
            isFavorite={favorites.includes(task.name)}
          />
        ))}
      </ScrollView>
      <View style={tw`flex-row justify-between p-4 border-t border-gray-200 bg-white`}> 
        <TouchableOpacity><Icon name="home-outline" size={28} color="gray" /></TouchableOpacity>
        <TouchableOpacity><Icon name="bar-chart-outline" size={28} color="gray" /></TouchableOpacity>
        <TouchableOpacity style={tw`bg-blue-500 rounded-full p-4`}><Icon name="add" size={28} color="white" /></TouchableOpacity>
        <TouchableOpacity><Icon name="calendar-outline" size={28} color="gray" /></TouchableOpacity>
        <TouchableOpacity><Icon name="settings-outline" size={28} color="gray" /></TouchableOpacity>
      </View>
    </View>
  );
};

export default AllTaskListScreen;
