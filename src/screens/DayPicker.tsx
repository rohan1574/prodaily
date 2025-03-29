// DayPicker.tsx
import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { s as tw } from 'react-native-wind';

type DayPickerProps = {
  selectedDays: string[];
  onSelectDays: React.Dispatch<React.SetStateAction<string[]>>;
  onCancel: () => void;
  onAddDay: () => void;
};

const DayPicker: React.FC<DayPickerProps> = ({ selectedDays, onSelectDays, onCancel, onAddDay }) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const toggleDaySelection = (day: string) => {
    onSelectDays(prevDays =>
      prevDays.includes(day)
        ? prevDays.filter(d => d !== day)
        : [...prevDays, day],
    );
  };

  return (
    <View style={tw`bg-gray-200 p-4 rounded-lg w-80 mx-auto`}>
      <Text style={tw`text-lg font-semibold text-center mb-3`}>Select Days of the week</Text>
      
      <FlatList
        data={days}
        horizontal
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={tw`w-10 h-10 m-1 flex items-center justify-center rounded-full ${selectedDays.includes(item) ? 'bg-blue-500' : 'bg-gray-300'}`}
            onPress={() => toggleDaySelection(item)}
          >
            <Text style={tw`${selectedDays.includes(item) ? 'text-white' : 'text-black'}`}>
              {item[0]}
            </Text>
          </TouchableOpacity>
        )}
      />

      <View style={tw`flex-row items-center mt-4`}>
        <Icon name="radio-button-on" size={20} color="blue" />
        <Text style={tw`ml-2 text-gray-700`}>Show next day too if not Completed</Text>
      </View>

      <View style={tw`flex-row justify-between mt-4`}>
        <TouchableOpacity onPress={onCancel} style={tw`bg-gray-500 px-4 py-2 rounded-lg`}>
          <Text style={tw`text-white`}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onAddDay} style={tw`bg-blue-500 px-4 py-2 rounded-lg`}>
          <Text style={tw`text-white`}>Add Day</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DayPicker;
