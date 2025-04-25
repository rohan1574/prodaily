import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Modal, FlatList} from 'react-native';
import {s as tw} from 'react-native-wind';

type DateSelectorProps = {
  selectedDates: number[];
  selectedMonths: string[];
  onSelectDate: (date: number) => void;
  onSelectMonth: (month: string) => void;
  onCancel: () => void;
  onAddDay: () => void;
};

const Days = Array.from({length: 31}, (_, index) => index + 1);
const Months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const DateSelector: React.FC<DateSelectorProps> = ({
  selectedDates,
  selectedMonths,
  onSelectDate,
  onSelectMonth,
  onCancel,
  onAddDay,
}) => {
  const toggleDaySelection = (day: number) => {
    onSelectDate(day);
  };

  const toggleMonthSelection = (month: string) => {
    onSelectMonth(month);
  };

  return (
    <Modal transparent={true} visible={true}>
      <View style={tw`flex-1 justify-center items-center bg-gray-500 bg-opacity-50`}>
        <View style={tw`bg-white p-4 rounded-lg w-96`}>
          <View style={tw`flex-row justify-between`}>
            {/* Dates Column */}
            <View style={tw`flex-1 mr-2`}>
              <Text style={tw`text-lg font-bold mb-4`}>Select Dates (1-31)</Text>
              <FlatList
                data={Days}
                renderItem={({item}) => (
                  <TouchableOpacity
                    onPress={() => toggleDaySelection(item)}
                    style={[
                      tw`py-2 mx-4 rounded-md mb-2 mx-1`,
                      selectedDates.includes(item)
                        ? tw`bg-blue-500`
                        : tw`bg-gray-200`,
                    ]}
                    accessibilityLabel={`Select day ${item}`}>
                    <Text style={tw`text-center`}>{item}</Text>
                  </TouchableOpacity>
                )}
                keyExtractor={item => item.toString()}
                numColumns={3}
              />
            </View>

            {/* Months Column */}
            <View style={tw`flex-1 `}>
              <Text style={tw`text-lg font-bold mb-4`}>Select Months</Text>
              <FlatList
                data={Months}
                renderItem={({item}) => (
                  <TouchableOpacity
                    onPress={() => toggleMonthSelection(item)}
                    style={[
                      tw`py-2 px-4 rounded-md mb-2 mx-1`,
                      selectedMonths.includes(item)
                        ? tw`bg-blue-500`
                        : tw`bg-gray-200`,
                    ]}
                    accessibilityLabel={`Select month ${item}`}>
                    <Text style={tw`text-center`}>{item}</Text>
                  </TouchableOpacity>
                )}
                keyExtractor={item => item}
                numColumns={2}
              />
            </View>
          </View>

          {/* Buttons */}
          <View style={tw`flex-row justify-between mt-4`}>
            <TouchableOpacity
              onPress={onCancel}
              style={tw`bg-gray-300 px-4 py-2 rounded-md`}
              accessibilityLabel="Cancel selection">
              <Text>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onAddDay}
              style={tw`bg-blue-500 px-4 py-2 rounded-md`}
              accessibilityLabel="Add selected dates and months">
              <Text style={tw`text-white`}>Add Day</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DateSelector;