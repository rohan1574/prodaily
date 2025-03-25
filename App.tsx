import React from 'react';
import { View, SafeAreaView, StyleSheet } from 'react-native';
import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { s as tw } from 'react-native-wind';
import AddDailyTaskScreen from './src/screens/AddDailyTaskScreen';

const RootStack = createNativeStackNavigator({
  initialRouteName: 'Home',
  screenOptions: {
    headerShown: false,
  },
  screens: {
    Home: AddDailyTaskScreen
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