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
      <View style={tw`flex-1 justify-center items-center bg-gray-500 bg-opacity-50`}>
        <View style={tw`bg-white p-4 rounded-lg w-80`}>
          <Text style={tw`text-lg font-bold mb-4`}>Select Days</Text>
          <FlatList
            data={WeekDays}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => toggleDaySelection(item)}
                style={[
                  tw`py-2 px-4 rounded-md mb-2`,
                  selectedDays.includes(item) ? tw`bg-blue-500` : tw`bg-gray-200`,
                ]}>
                <Text style={tw`text-center`}>{item}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item}
          />
          <View style={tw`flex-row justify-between mt-4`}>
            <TouchableOpacity onPress={onCancel} style={tw`bg-gray-300 px-4 py-2 rounded-md`}>
              <Text>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onAddDay} style={tw`bg-blue-500 px-4 py-2 rounded-md`}>
              <Text style={tw`text-white`}>Add Day</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DayPicker;
