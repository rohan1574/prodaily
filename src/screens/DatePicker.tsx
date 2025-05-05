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
      <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-30`}>
        <View style={[tw`bg-white p-6 rounded-2xl w-80 shadow-xl`,{height:410}]}>
          <Text style={tw`text-2xl font-bold bottom-4 text-gray-800 text-center`}>
            Select Dates
          </Text>
          
          <FlatList
            data={Array.from({ length: 31 }, (_, i) => i + 1)}
            numColumns={6}
            contentContainerStyle={tw`pb-2`}
            columnWrapperStyle={tw`justify-between mb-2`}
            renderItem={({ item }) => {
              const isSelected = selectedDate.includes(item);
              return (
                <TouchableOpacity
                  onPress={() => toggleDateSelection(item)}
                  style={[
                    tw`w-10 h-10 items-center justify-center rounded-lg 
                       border-2 transition-colors duration-200`,
                    isSelected 
                      ? tw`border-blue-500 bg-blue-50`
                      : tw`border-gray-200 bg-white`
                  ]}
                >
                  <Text style={[
                    tw`text-base font-medium`,
                    isSelected ? tw`text-blue-600` : tw`text-gray-600`
                  ]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            }}
            keyExtractor={(item) => item.toString()}
          />

          <View style={tw`flex-row justify-between top-4`}>
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
              <Text style={tw`text-center text-white font-medium`}>Add Dates</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DatePicker;