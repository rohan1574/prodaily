import React, {useState} from 'react';
import {View, Text, Image, ScrollView, TouchableOpacity} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/Ionicons';
import {s as tw} from 'react-native-wind';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';

// Define the navigation type
type RootStackParamList = {
  TodaysTaskToDoScreen: undefined;
  MyCalenderFutureTaskScreen: undefined;
  MyStatisticsScreen: undefined;
  ProfileManageScreen: undefined;
  AddDailyTaskScreen: undefined;
};

type NavigationProp = StackNavigationProp<
  RootStackParamList,
  'TodaysTaskToDoScreen'
>;
const years = Array.from({length: 26}, (_, i) => 2025 + i);
const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const tasks = [
  {
    title: 'Walking',
    image: require('../../assets/images/Walking.png'),
    frequency: 'Daily',
  },
  {
    title: 'Skill Practice',
    image: require('../../assets/images/Walking.png'),
    frequency: 'Daily',
  },
  {
    title: 'Eyes on News',
    image: require('../../assets/images/Walking.png'),
    frequency: 'Daily',
  },
  {
    title: 'Course Watching',
    image: require('../../assets/images/Walking.png'),
    frequency: 'Daily',
  },
  {
    title: 'Organizing Home',
    image: require('../../assets/images/Walking.png'),
    frequency: 'Daily',
  },
  {
    title: 'Gardening',
    image: require('../../assets/images/Walking.png'),
    frequency: 'Daily',
  },
  {
    title: 'Prayer',
    image: require('../../assets/images/Walking.png'),
    frequency: 'Monthly',
  },
  {
    title: 'Organizing Home',
    image: require('../../assets/images/Walking.png'),
    frequency: 'Yearly',
  },
  {
    title: 'Organizing Home',
    image: require('../../assets/images/Walking.png'),
    frequency: 'Specific',
  },
];

export default function MyCalenderFutureTaskScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [selectedYear, setSelectedYear] = useState(2025);
  const [selectedMonth, setSelectedMonth] = useState('December');
  const [selectedDay, setSelectedDay] = useState(8); // default selected day

  const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
  };

  const daysInMonth = getDaysInMonth(
    selectedYear,
    months.indexOf(selectedMonth),
  );

  return (
    <View style={tw`flex-1 bg-white p-4 pt-10`}>
      {/* Header */}
      <Text style={tw`text-lg font-bold text-gray-800 mb-1`}>My Calendar</Text>
      <Text style={tw`text-sm text-gray-500 mb-3`}>
        Your added tasks on the selected calendar day.
      </Text>

      {/* Year and Month Dropdowns */}
      <View style={tw`flex-row justify-between mb-4`}>
        <Picker
          selectedValue={selectedYear}
          style={{width: 150}}
          onValueChange={itemValue => setSelectedYear(itemValue)}>
          {years.map(year => (
            <Picker.Item key={year} label={year.toString()} value={year} />
          ))}
        </Picker>

        <Picker
          selectedValue={selectedMonth}
          style={{width: 150}}
          onValueChange={itemValue => setSelectedMonth(itemValue)}>
          {months.map(month => (
            <Picker.Item key={month} label={month} value={month} />
          ))}
        </Picker>
      </View>

      {/* Calendar */}
      <View style={tw`flex-row flex-wrap justify-between mb-4`}>
        {Array.from({length: daysInMonth}, (_, i) => i + 1).map(day => (
          <TouchableOpacity
            key={day}
            style={tw`w-10 h-10 rounded-full justify-center items-center mb-2 ${
              selectedDay === day ? 'bg-blue-500' : ''
            }`}
            onPress={() => setSelectedDay(day)}>
            <Text
              style={tw`${
                selectedDay === day ? 'text-white' : 'text-gray-700'
              }`}>
              {day}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tasks */}
      <ScrollView style={tw`flex-1`}>
        {tasks.map((task, index) => (
          <View
            key={index}
            style={tw`flex-row items-center justify-between bg-gray-100 rounded-lg p-3 mb-2`}>
            <View style={tw`flex-row items-center`}>
              <Image source={task.image} style={tw`w-6 h-6 mr-3`} />
              <Text style={tw`text-base text-gray-800`}>{task.title}</Text>
            </View>
            <Text style={tw`text-sm text-gray-500`}>{task.frequency}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Bottom Navigation */}
      <View
        style={tw`flex-row justify-between p-4 border-t border-gray-200 bg-white`}>
        <TouchableOpacity>
          <Icon
            name="home-outline"
            size={28}
            color="gray"
            onPress={() => navigation.navigate('TodaysTaskToDoScreen')}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon
            name="bar-chart-outline"
            size={28}
            color="gray"
            onPress={() => navigation.navigate('MyStatisticsScreen')}
          />
        </TouchableOpacity>
        <TouchableOpacity style={tw`bg-blue-500 rounded-full p-4`}>
          <Icon
            name="add"
            size={28}
            color="white"
            onPress={() => navigation.navigate('AddDailyTaskScreen')}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon
            name="calendar-outline"
            size={28}
            color="gray"
            onPress={() => navigation.navigate('MyCalenderFutureTaskScreen')}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon
            name="settings-outline"
            size={28}
            color="gray"
            onPress={() => navigation.navigate('ProfileManageScreen')}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
