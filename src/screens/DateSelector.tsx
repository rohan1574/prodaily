import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface DateSelectorProps {
  selectedYears: number[]; // Accept selectedYears as a prop
  onSelectYears: (years: number[]) => void; // Function to update selected years
  onCancel: () => void;
  onAddDay: () => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({
  selectedYears,
  onSelectYears,
  onCancel,
  onAddDay
}) => {
  const years = Array.from({ length: 10 }, (_, i) => 2020 + i); // Example years 2020-2029

  const handleSelectYear = (year: number) => {
    const newSelectedYears = selectedYears.includes(year)
      ? selectedYears.filter(y => y !== year) // Deselect if already selected
      : [...selectedYears, year]; // Select the year
    onSelectYears(newSelectedYears); // Update selected years
  };

  return (
    <View style={{ padding: 20, backgroundColor: '#fff' }}>
      <Text>Select Years</Text>
      {years.map(year => (
        <TouchableOpacity
          key={year}
          style={{
            padding: 10,
            backgroundColor: selectedYears.includes(year) ? 'blue' : 'gray',
            margin: 5,
            borderRadius: 5
          }}
          onPress={() => handleSelectYear(year)}
        >
          <Text style={{ color: '#fff' }}>{year}</Text>
        </TouchableOpacity>
      ))}
      <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
        <TouchableOpacity onPress={onCancel}>
          <Text>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onAddDay}>
          <Text>Add Year</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DateSelector;
