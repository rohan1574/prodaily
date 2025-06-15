import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import AddDailyTaskScreen from './src/screens/AddDailyTaskScreen';
import TodaysTaskToDoScreen from './src/screens/TodaysTaskToDoScreen';
import MyCalenderFutureTaskScreen from './src/screens/MyCalenderFutureTaskScreen';
import MyStatisticsScreen from './src/screens/MyStatisticsScreen';
import AllTaskListScreen from './src/screens/AllTaskListScreen';
import ProfileManageScreen from './src/screens/ProfileManageScreen';
import LogoSplashScreen from './src/screens/LogoSplashScreen';
import OnboardingScreenOne from './src/screens/OnboardingScreenOne';
import OnboardingScreenTwo from './src/screens/OnboardingScreenTwo';
import {ColorProvider} from './src/context/ColorContext';
import {PointsProvider} from './src/context/PointsContext';
import PremiumPackage from './src/screens/PremiumPackage';
import { StatusBar } from 'react-native';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <PointsProvider>
      <ColorProvider>
      {/* <StatusBar backgroundColor="#3580FF" barStyle="light-content"/> */}
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="LogoSplashScreen"
            screenOptions={{headerShown: false}}>
            <Stack.Screen
              name="LogoSplashScreen"
              component={LogoSplashScreen}
            />
            <Stack.Screen
              name="OnboardingScreenOne"
              component={OnboardingScreenOne}
            />
            <Stack.Screen
              name="OnboardingScreenTwo"
              component={OnboardingScreenTwo}
            />
            <Stack.Screen name="PremiumPackage" component={PremiumPackage} />
            <Stack.Screen
              name="AddDailyTaskScreen"
              component={AddDailyTaskScreen}
            />
            <Stack.Screen
              name="TodaysTaskToDoScreen"
              component={TodaysTaskToDoScreen}
            />
            <Stack.Screen
              name="MyCalenderFutureTaskScreen"
              component={MyCalenderFutureTaskScreen}
            />
            <Stack.Screen
              name="MyStatisticsScreen"
              component={MyStatisticsScreen}
            />
            <Stack.Screen
              name="AllTaskListScreen"
              component={AllTaskListScreen}
            />
            <Stack.Screen
              name="ProfileManageScreen"
              component={ProfileManageScreen}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </ColorProvider>
    </PointsProvider>
  );
}