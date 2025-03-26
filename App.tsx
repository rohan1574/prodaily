import React from 'react';
import { View, SafeAreaView, StyleSheet } from 'react-native';
import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { s as tw } from 'react-native-wind';
import AddDailyTaskScreen from './src/screens/AddDailyTaskScreen';
import TodaysTaskToDoScreen from './src/screens/TodaysTaskToDoScreen';
import MyCalenderFutureTaskScreen from './src/screens/MyCalenderFutureTaskScreen';
import MyStatisticsScreen from './src/screens/MyStatisticsScreen';
import AllTaskListScreen from './src/screens/AllTaskListScreen';
import ProfileManageScreen from './src/screens/ProfileManageScreen';

const RootStack = createNativeStackNavigator({
  initialRouteName: 'AddDailyTaskScreen',
  screenOptions: {
    headerShown: false,
  },
  screens: {
    AddDailyTaskScreen: AddDailyTaskScreen,
    TodaysTaskToDoScreen:TodaysTaskToDoScreen,
    MyCalenderFutureTaskScreen:MyCalenderFutureTaskScreen,
    MyStatisticsScreen:MyStatisticsScreen,
    AllTaskListScreen:AllTaskListScreen,
    ProfileManageScreen:ProfileManageScreen,
  }
});

const Navigation = createStaticNavigation( RootStack );

export default function App() {
  // return (
  //   <SafeAreaView style={tw`flex-1`}>
  //     <AddDailyTaskScreen />
  //   </SafeAreaView>
  // );

  return <Navigation />;
}