import React from 'react';
import { View, SafeAreaView, StyleSheet } from 'react-native';
import { s as tw } from 'react-native-wind';
import AddDailyTaskScreen from './src/screens/AddDailyTaskScreen';

const App = () => {
  return (
    <SafeAreaView style={tw`flex-1`}>
      <AddDailyTaskScreen />
    </SafeAreaView>
  );
};

export default App;
