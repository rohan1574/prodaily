import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { s as tw } from 'react-native-wind';

const DatePicker: React.FC<{
  selectedDates: number[];
  onSelectDates: (dates: number[]) => void;
  onCancel: () => void;
  onAddDay: () => void;
}> = ({ selectedDates, onSelectDates, onCancel, onAddDay }) => {
  // 1-31 দিন গুলো তৈরি করছি
  const dates = Array.from({ length: 31 }, (_, i) => i + 1);

  // দিন সিলেক্ট বা ডিসিলেক্ট করার ফাংশন
  const handleSelectDate = (date: number) => {
    const newSelectedDates = selectedDates.includes(date)
      ? selectedDates.filter(d => d !== date) // ডিসিলেক্ট করলেই
      : [...selectedDates, date]; // সিলেক্ট করা
    onSelectDates(newSelectedDates); // নতুন সিলেক্টেড তারিখ প্রেরণ করা
  };

  return (
    <View style={tw`bg-gray-200 p-4 rounded-lg w-80 mx-auto`}>
      <Text style={tw`text-lg font-semibold text-center mb-3`}>
        Select Date for Every Month
      </Text>

      {/* FlatList ব্যবহার করা তারিখগুলো প্রদর্শন করার জন্য */}
      <FlatList
        data={dates}
        numColumns={7} // ৭টি কলামে দিনগুলো দেখানো হবে
        keyExtractor={item => item.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              tw`w-10 h-10 m-1 flex items-center justify-center rounded-md`,
              selectedDates.includes(item) ? tw`bg-blue-500` : tw`bg-gray-300`
            ]}
            onPress={() => handleSelectDate(item)} // তারিখ সিলেক্ট বা ডিসিলেক্ট করা
          >
            <Text
              style={tw`${selectedDates.includes(item) ? 'text-white' : 'text-black'}`}
            >
              {item}
            </Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={tw`pb-10`} // প্যাডিং নিয়ন্ত্রণ
      />

      {/* Daily from start date Until Complete option */}
      <View style={tw`flex-row items-center mt-4`}>
        <Icon name="radio-button-on" size={20} color="blue" />
        <Text style={tw`ml-2 text-gray-700`}>
          Show Daily from start date Until Complete
        </Text>
      </View>

      {/* Cancel এবং Add Date বাটন */}
      <View style={tw`flex-row justify-between mt-4`}>
        <TouchableOpacity
          onPress={onCancel}
          style={tw`bg-gray-500 px-4 py-2 rounded-lg`}
        >
          <Text style={tw`text-white`}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onAddDay}
          style={tw`bg-blue-500 px-4 py-2 rounded-lg`}
        >
          <Text style={tw`text-white`}>Add Date</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DatePicker;
