import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { s as tw } from 'react-native-wind';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

// Define Navigation Types
type RootStackParamList = {
  TodaysTaskToDoScreen: undefined;
  MyStatisticsScreen: undefined;
  AddDailyTaskScreen: undefined;
  MyCalenderFutureTaskScreen: undefined;
  ProfileManageScreen: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

const BottomNavigation: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={tw`flex-row justify-between p-4 border-t border-gray-200 bg-white`}>
      <TouchableOpacity onPress={() => navigation.navigate('TodaysTaskToDoScreen')}>
        <Icon name="home-outline" size={28} color="gray" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('MyStatisticsScreen')}>
        <Icon name="bar-chart-outline" size={28} color="gray" />
      </TouchableOpacity>
      <TouchableOpacity
        style={tw`bg-blue-500 rounded-full p-4`}
        onPress={() => navigation.navigate('AddDailyTaskScreen')}>
        <Icon name="add" size={28} color="white" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('MyCalenderFutureTaskScreen')}>
        <Icon name="calendar-outline" size={28} color="gray" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('ProfileManageScreen')}>
        <Icon name="settings-outline" size={28} color="gray" />
      </TouchableOpacity>
    </View>
  );
};

export default BottomNavigation;
