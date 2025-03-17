import React, {useState} from 'react';
import {View, Text, TouchableOpacity, FlatList} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {s as tw} from 'react-native-wind';

const DatePicker: React.FC<{onCancel: () => void}> = ({onCancel}) => {
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  const dates = Array.from({length: 28}, (_, i) => i + 1);

  return (
    <View style={tw`bg-gray-200 p-4 rounded-lg w-80 mx-auto`}>
      <Text style={tw`text-lg font-semibold text-center mb-3`}>
        Select Date for Every Month
      </Text>

      <FlatList
        data={dates}
        numColumns={7}
        keyExtractor={item => item.toString()}
        renderItem={({item}) => (
          <TouchableOpacity
            style={tw`w-10 h-10 m-1 flex items-center justify-center rounded-md ${
              selectedDate === item ? 'bg-blue-500' : 'bg-gray-300'
            }`}
            onPress={() => setSelectedDate(item)}>
            <Text
              style={tw`${
                selectedDate === item ? 'text-white' : 'text-black'
              }`}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />

      <View style={tw`flex-row items-center mt-4`}>
        <Icon name="radio-button-on" size={20} color="blue" />
        <Text style={tw`ml-2 text-gray-700`}>
          Show Daily from start date Until Complete
        </Text>
      </View>

      <View style={tw`flex-row justify-between mt-4`}>
        <TouchableOpacity
          onPress={onCancel}
          style={tw`bg-gray-500 px-4 py-2 rounded-lg`}>
          <Text style={tw`text-white`}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={tw`bg-blue-500 px-4 py-2 rounded-lg`}>
          <Text style={tw`text-white`}>Add Date</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DatePicker;
