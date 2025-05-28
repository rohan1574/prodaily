import React from 'react';
import {View, TouchableOpacity, Image} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {s as tw} from 'react-native-wind';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';


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
    <View style={tw`flex-row justify-between  border-gray-200 bg-white`}>
      <TouchableOpacity
        style={tw`top-4 left-6 `}
        onPress={() => navigation.navigate('TodaysTaskToDoScreen')}>
        <Image
          source={require('../../assets/images/Nab/home.png')}
          style={[tw``,{width:24,height:26}]}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={tw`top-4 left-4`}
        onPress={() => navigation.navigate('MyStatisticsScreen')}>
         <Image
          source={require('../../assets/images/Nab/analytics.png')}
          style={[tw``,{width:24,height:26}]}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={tw`bg-blue-500 rounded-full p-4 bottom border-2 bottom-10 border-gray-200`}
        onPress={() => navigation.navigate('AddDailyTaskScreen')}>
        <Icon name="add" size={28} color="white" />
      </TouchableOpacity>
      <TouchableOpacity
        style={tw`top-4 right-4`}
        onPress={() => navigation.navigate('MyCalenderFutureTaskScreen')}>
         <Image
          source={require('../../assets/images/Nab/calender.png')}
          style={[tw``,{width:26,height:26}]}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={tw`top-4 right-6`}
        onPress={() => navigation.navigate('ProfileManageScreen')}>
         <Image
          source={require('../../assets/images/Nab/profile.png')}
          style={[tw``,{width:24,height:26}]}
        />
      </TouchableOpacity>
    </View>
  );
};

export default BottomNavigation;
