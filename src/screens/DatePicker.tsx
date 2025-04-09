import React from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList } from 'react-native';
import { s as tw } from 'react-native-wind';

type DatePickerProps = {
  selectedDate: number[];
  onSelectDate: (dates: number[]) => void;
  onCancel: () => void;
  onAddDay: () => void;
};

const DatePicker: React.FC<DatePickerProps> = ({
  selectedDate,
  onSelectDate,
  onCancel,
  onAddDay,
}) => {
  const toggleDateSelection = (date: number) => {
    const updatedSelectedDates = selectedDate.includes(date)
      ? selectedDate.filter(d => d !== date)
      : [...selectedDate, date];
    onSelectDate(updatedSelectedDates);
  };

  return (
    <Modal transparent={true} visible={true}>
      <View style={tw`flex-1 justify-center items-center bg-gray-500 bg-opacity-50`}>
        <View style={tw`bg-white p-4 rounded-lg w-80`}>
          <Text style={tw`text-lg font-bold mb-4`}>Select Dates</Text>
          <FlatList
            data={Array.from({ length: 31 }, (_, i) => i + 1)} // 1 to 31
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => toggleDateSelection(item)}
                style={[
                  tw`py-2 px-4 rounded-md mb-2`,
                  selectedDate.includes(item) ? tw`bg-blue-500` : tw`bg-gray-200`,
                ]}>
                <Text style={tw`text-center`}>{item}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.toString()}
          />
          <View style={tw`flex-row justify-between mb-12`}>
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

export default DatePicker;
