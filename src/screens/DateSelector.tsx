import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface DateSelectorProps {
  selectedDate: number[]; // Array of selected days
  selectedMonths: number[]; // Array of selected months
  onSelectDate: (date: number) => void; // Function that expects a single date
  onSelectMonth: (month: number) => void; // Function that expects a single month
  onCancel: () => void;
  onAddDay: () => void;
}

const months = [
  'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
];

const DateSelector: React.FC<DateSelectorProps> = ({
  selectedDate,
  selectedMonths,
  onSelectDate,
  onSelectMonth,
  onCancel,
  onAddDay,
}) => {
  return (
    <View style={{ padding: 20, backgroundColor: '#fff' }}>
      <Text>Select Dates</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
          <TouchableOpacity
            key={day}
            style={{
              padding: 10,
              backgroundColor: selectedDate.includes(day) ? 'blue' : 'gray',
              margin: 5,
              borderRadius: 5,
            }}
            onPress={() => onSelectDate(day)}>
            <Text style={{ color: '#fff' }}>{day}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text>Select Months</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {months.map((month, index) => (
          <TouchableOpacity
            key={index}
            style={{
              padding: 10,
              backgroundColor: selectedMonths.includes(index + 1) ? 'blue' : 'gray', // +1 because months are 1-based
              margin: 5,
              borderRadius: 5,
            }}
            onPress={() => onSelectMonth(index + 1)}>
            <Text style={{ color: '#fff' }}>{month}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
        <TouchableOpacity onPress={onCancel}>
          <Text>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onAddDay}>
          <Text>Add Date</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DateSelector;
