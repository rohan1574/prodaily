import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Modal, FlatList} from 'react-native';
import {s as tw} from 'react-native-wind';
import Ionicons from 'react-native-vector-icons/Ionicons';

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
  const [showNextDay, setShowNextDay] = useState(true);
  return (
    <Modal transparent={true} visible={true}>
      <View
        style={[tw`flex-1 justify-center items-center`,{backgroundColor: 'rgba(32, 41, 56, 0.7)'}]}>
        <View
          style={[tw`bg-white p-6 rounded-2xl w-80 shadow-xl`, {height: 420}]}>
          <View
            style={[
              tw`bg-gray-400 rounded-lg bottom-6 w-80 right-6 py-3`,
              {backgroundColor: '#8D99AE'},
            ]}>
            <Text style={tw`text-white text-center text-sm font-medium`}>
              Select Date for Every Month
            </Text>
          </View>

          <FlatList
            data={Array.from({length: 31}, (_, i) => i + 1)}
            numColumns={6}
            contentContainerStyle={tw`pb-2`}
            columnWrapperStyle={tw`justify-between mb-2`}
            renderItem={({item}) => {
              const isSelected = selectedDate.includes(item);
              return (
                <TouchableOpacity
                  onPress={() => toggleDateSelection(item)}
                  style={[
                    tw`w-10 h-10 items-center justify-center rounded-lg `,
                    isSelected
                      ? tw` bg-blue-500`
                      : [tw``, {backgroundColor: '#DEEAFF'}],
                  ]}>
                  <Text
                    style={[
                      tw`text-base font-medium`,
                      isSelected ? tw`text-white` : tw`text-gray-500`,
                    ]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            }}
            keyExtractor={item => item.toString()}
          />

          <View style={tw`flex-row justify-between `}>
            {/* Radio Option */}
            <TouchableOpacity
              onPress={() => setShowNextDay(!showNextDay)}
              style={tw`flex-row items-center right-3`}>
              <Ionicons
                name={
                  showNextDay
                    ? 'radio-button-on-outline'
                    : 'radio-button-on-outline'
                }
                size={20}
                color={showNextDay ? '#9CA3AF' : '#3B82F6'} // Tailwind's blue-500 / gray-400
                style={tw`mr-2`}
              />
              <Text style={tw`text-gray-500 text-xs font-normal`}>
                Show Daily from start{'\n'} date Until Complete
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onCancel}
              style={[
                tw`bg-gray-400 top-3 items-center justify-center rounded-md right-1`,
                {width: 72, height: 35},
              ]}>
              <Text style={tw`text-white font-medium text-xs `}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onAddDay}
              style={[
                tw`bg-blue-400 top-3 items-center justify-center rounded-md`,
                {width: 72, height: 35},
              ]}>
              <Text style={tw`text-white font-medium text-xs`}>Add Day</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DatePicker;
