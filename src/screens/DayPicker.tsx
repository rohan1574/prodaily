import React from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList } from 'react-native';
import { s as tw } from 'react-native-wind';

type DayPickerProps = {
  selectedDays: string[];
  onSelectDays: (days: string[]) => void;
  onCancel: () => void;
  onAddDay: () => void;
};

const WeekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const DayPicker: React.FC<DayPickerProps> = ({
  selectedDays,
  onSelectDays,
  onCancel,
  onAddDay,
}) => {
  const toggleDaySelection = (day: string) => {
    const updatedSelectedDays = selectedDays.includes(day)
      ? selectedDays.filter(d => d !== day)
      : [...selectedDays, day];
    onSelectDays(updatedSelectedDays);
  };

  return (
    <Modal transparent={true} visible={true}>
      <View style={tw`flex-1 justify-center items-center  bg-black bg-opacity-30`}>
        <View style={tw`bg-white p-6 rounded-2xl h-80 shadow-xl`}>
          <Text style={tw`text-2xl font-bold bottom-4 text-gray-800 text-center`}>
            Select Days
          </Text>
          
          <FlatList
            data={WeekDays}
            numColumns={3}
            columnWrapperStyle={tw`justify-between`}
            contentContainerStyle={tw``}
            renderItem={({ item }) => {
              const isSelected = selectedDays.includes(item);
              return (
                <TouchableOpacity
                  onPress={() => toggleDaySelection(item)}
                  style={[
                    tw`w-24 mr-1 mb-3 p-3 rounded-xl items-center justify-center 
                       border-2 transition-colors duration-200`,
                    isSelected 
                      ? tw`border-blue-500 bg-blue-50`
                      : tw`border-gray-200 bg-white`
                  ]}
                >
                  <Text style={[
                    tw`text-lg font-medium`,
                    isSelected ? tw`text-blue-600` : tw`text-gray-600`
                  ]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            }}
            keyExtractor={(item) => item}
          />

          <View style={tw`flex-row justify-between top-2`}>
            <TouchableOpacity 
              onPress={onCancel}
              style={tw`flex-1 mr-2 px-6 py-3 border-2 border-red-100 rounded-xl 
                        bg-red-50 active:bg-red-100`}
            >
              <Text style={tw`text-center text-red-600 font-medium`}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={onAddDay}
              style={tw`flex-1 ml-2 px-6 py-3 rounded-xl bg-blue-500 
                        active:bg-blue-600 shadow-sm`}
            >
              <Text style={tw`text-center text-white font-medium`}>Add Day</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DayPicker;