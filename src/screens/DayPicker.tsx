import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Modal} from 'react-native';
import {s as tw} from 'react-native-wind';
import Ionicons from 'react-native-vector-icons/Ionicons';

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
  const [showNextDay, setShowNextDay] = useState(true);

  const toggleDaySelection = (day: string) => {
    const updatedSelectedDays = selectedDays.includes(day)
      ? selectedDays.filter(d => d !== day)
      : [...selectedDays, day];
    onSelectDays(updatedSelectedDays);
  };

  return (
    <Modal transparent={true} visible={true}>
      <View
        style={[tw`flex-1 justify-center items-center`,{backgroundColor: 'rgba(32, 41, 56, 0.7)'}]}>
        <View style={tw`bg-white rounded-xl shadow-lg w-11/12`}>
          {/* Header */}
          <View
            style={[
              tw`bg-gray-400 rounded-lg  py-3`,
              {backgroundColor: '#8D99AE'},
            ]}>
            <Text style={tw`text-white text-center text-sm font-medium`}>
              Select Days of the week
            </Text>
          </View>

          {/* Days Row */}
          <View style={tw`flex-row justify-around py-4 mx-4`}>
            {WeekDays.map((day, index) => {
              const isSelected = selectedDays.includes(day);
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => toggleDaySelection(day)}
                  style={[
                    tw`rounded-full items-center justify-center`,
                    {
                      backgroundColor: isSelected
                        ? '#3580FF' /* Tailwind's blue-500 */
                        : '#DEEAFF',
                      width: 40,
                      height: 40,
                    },
                  ]}>
                  <Text
                    style={
                      isSelected
                        ? tw`text-white font-bold`
                        : tw`text-gray-500 font-bold`
                    }>
                    {day}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Buttons */}
          <View style={tw`flex-row justify-between px-3 pb-4`}>
            {/* Radio Option */}
            <TouchableOpacity
              onPress={() => setShowNextDay(!showNextDay)}
              style={tw`flex-row items-center pb-3`}>
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
                Show next day too {'\n'} if not Completed
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onCancel}
              style={[
                tw`bg-gray-400 top-3 items-center justify-center rounded-md`,
                {width: 72, height: 35},
              ]}>
              <Text style={tw`text-white font-medium text-xs`}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onAddDay}
              style={[
                tw`bg-blue-400 top-3 items-center justify-center rounded-md`,
                {width: 92, height: 35},
              ]}>
              <Text style={tw`text-white font-medium text-xs`}>Add Day</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DayPicker;
