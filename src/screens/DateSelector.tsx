import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Modal, Platform} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {s as tw} from 'react-native-wind';

type DateSelectorProps = {
  selectedDates: number[];
  selectedMonths: string[];
  onSelectDate: (date: number) => void;
  onSelectMonth: (month: string) => void;
  onCancel: () => void;
  onAddDay: () => void;
  onRemoveDay: (index: number) => void; // নতুন প্রপস যোগ করা হয়েছে
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
  onRemoveDay,
}) => {
  const [selectedDate, setSelectedDate] = useState<number>(selectedDates[0] || 1);
  const [selectedMonth, setSelectedMonth] = useState<string>(selectedMonths[0] || 'Jan');

  const handleDateChange = (itemValue: number) => {
    setSelectedDate(itemValue);
    onSelectDate(itemValue);
  };

  const handleMonthChange = (itemValue: string) => {
    setSelectedMonth(itemValue);
    onSelectMonth(itemValue);
  };

  // সিলেক্ট করা তারিখ এবং মাসের লিস্ট তৈরি
  const selectedDays = selectedDates.map((date, index) => ({
    date,
    month: selectedMonths[index],
  }));

  return (
    <Modal transparent={true} visible={true}>
      <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-30`}>
        <View style={tw`bg-blue-100 p-4 rounded-lg w-4/5`}>
          {/* সিলেক্ট করা দিনগুলোর লিস্ট */}
          <View style={tw`mb-4`}>
            {selectedDays.map((day, index) => (
              <View 
                key={index} 
                style={tw`flex-row justify-between items-center bg-blue-200 p-2 rounded-md mb-2`}
              >
                <Text style={tw`text-gray-800`}>
                  {day.date} {day.month}
                </Text>
                <TouchableOpacity 
                  onPress={() => onRemoveDay(index)}
                  style={tw`p-1`}
                >
                  <Text style={tw`text-red-600 text-lg`}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <View style={tw`flex-row justify-between`}>
            {/* তারিখ সিলেক্টর */}
            <View style={tw`flex-1 mr-2`}>
              <Text style={tw`text-lg font-bold mb-4 text-center`}>Select Date</Text>
              <View style={tw`h-48 overflow-hidden`}>
                <Picker
                  selectedValue={selectedDate}
                  onValueChange={handleDateChange}
                  style={tw`w-full h-full`}
                  itemStyle={tw`h-12 text-lg`}
                  mode="dropdown"
                >
                  {Days.map(day => (
                    <Picker.Item key={day} label={day.toString()} value={day} />
                  ))}
                </Picker>
              </View>
            </View>

            {/* মাস সিলেক্টর */}
            <View style={tw`flex-1`}>
              <Text style={tw`text-lg font-bold mb-4 text-center`}>Select Month</Text>
              <View style={tw`h-48 overflow-hidden`}>
                <Picker
                  selectedValue={selectedMonth}
                  onValueChange={handleMonthChange}
                  style={tw`w-full h-full`}
                  itemStyle={tw`h-12 text-lg`}
                  mode="dropdown"
                >
                  {Months.map(month => (
                    <Picker.Item key={month} label={month} value={month} />
                  ))}
                </Picker>
              </View>
            </View>
          </View>

          {/* বাটনসমূহ */}
          <View style={tw`flex-row justify-between mt-4`}>
            <TouchableOpacity
              onPress={onCancel}
              style={tw`bg-gray-300 px-4 py-2 rounded-md`}
            >
              <Text style={tw`text-gray-800`}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onAddDay}
              style={tw`bg-blue-500 px-4 py-2 rounded-md`}
            >
              <Text style={tw`text-white`}>Add Day</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DateSelector;