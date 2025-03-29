// EditTaskScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { s as tw } from 'react-native-wind';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Task = {
  name: string;
  specificFor: string;
  dailyTarget: string;
  selectedDays: string[];
};

const EditTaskScreen = ({ route, navigation }: any) => {
  const { task } = route.params;
  const [name, setName] = useState<string>(task.name);
  const [specificFor, setSpecificFor] = useState<string>(task.specificFor);
  const [dailyTarget, setDailyTarget] = useState<string>(task.dailyTarget);
  const [selectedDays, setSelectedDays] = useState<string[]>(task.selectedDays);

  const handleSave = async () => {
    const updatedTask = { name, specificFor, dailyTarget, selectedDays };
    const tasks = await AsyncStorage.getItem('tasks');
    if (tasks) {
      const parsedTasks = JSON.parse(tasks);
      const updatedTasks = parsedTasks.map((item: Task) =>
        item.name === task.name ? updatedTask : item
      );
      await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
      navigation.goBack(); // Go back to the task list screen
    }
  };

  return (
    <View style={tw`flex-1 bg-white p-4`}>
      <Text style={tw`text-xl font-bold text-black`}>Edit Task</Text>

      <TextInput
        style={tw`border p-2 mt-4 rounded`}
        placeholder="Task Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={tw`border p-2 mt-4 rounded`}
        placeholder="Specific For"
        value={specificFor}
        onChangeText={setSpecificFor}
      />
      <TextInput
        style={tw`border p-2 mt-4 rounded`}
        placeholder="Daily Target"
        value={dailyTarget}
        onChangeText={setDailyTarget}
      />
      {/* Add Day Picker or other components to select days */}
      <TouchableOpacity onPress={handleSave} style={tw`bg-blue-500 px-4 py-2 mt-4 rounded-lg`}>
        <Text style={tw`text-white`}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EditTaskScreen;
