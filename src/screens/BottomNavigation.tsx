import React, {useState, useEffect} from 'react';
import {View, TouchableOpacity, Image} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {s as tw} from 'react-native-wind';
import {useNavigation, useRoute, useFocusEffect} from '@react-navigation/native';
import {useColorContext} from '../context/ColorContext';
import type {StackNavigationProp} from '@react-navigation/stack';

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
  const route = useRoute();
  const {selectedColor} = useColorContext();
  const [activeTab, setActiveTab] = useState<string>('TodaysTaskToDoScreen');

  useFocusEffect(
    React.useCallback(() => {
      // যখন স্ক্রিন ফোকাসে আসে, তখন activeTab হালনাগাদ করা হবে
      setActiveTab(route.name);
    }, [route.name])
  );

  const iconStyle = (screen: string) => ({
    width: 22,
    height: 22,
    tintColor: activeTab === screen ? selectedColor : '#A0AEC0',
  });

  return (
    <View style={tw`flex-row justify-between border-gray-200 bg-white`}>
      {/* Home */}
      <TouchableOpacity
        style={tw`top-4 left-6`}
        onPress={() => navigation.navigate('TodaysTaskToDoScreen')}>
        <Image
          source={require('../../assets/images/Nab/home.png')}
          style={iconStyle('TodaysTaskToDoScreen')}
        />
      </TouchableOpacity>

      {/* Statistics */}
      <TouchableOpacity
        style={tw`top-4 left-4`}
        onPress={() => navigation.navigate('MyStatisticsScreen')}>
        <Image
          source={require('../../assets/images/Nab/analytics.png')}
          style={iconStyle('MyStatisticsScreen')}
        />
      </TouchableOpacity>

      {/* Add */}
      <TouchableOpacity
        style={tw`bg-blue-500 rounded-full p-4 bottom border-2 bottom-10 border-gray-200`}
        onPress={() => navigation.navigate('AddDailyTaskScreen')}>
        <Icon name="add" size={28} color="white" />
      </TouchableOpacity>

      {/* Calendar */}
      <TouchableOpacity
        style={tw`top-4 right-4`}
        onPress={() => navigation.navigate('MyCalenderFutureTaskScreen')}>
        <Image
          source={require('../../assets/images/Nab/calender.png')}
          style={iconStyle('MyCalenderFutureTaskScreen')}
        />
      </TouchableOpacity>

      {/* Profile */}
      <TouchableOpacity
        style={tw`top-4 right-6`}
        onPress={() => navigation.navigate('ProfileManageScreen')}>
        <Image
          source={require('../../assets/images/Nab/profile.png')}
          style={iconStyle('ProfileManageScreen')}
        />
      </TouchableOpacity>
    </View>
  );
};

export default BottomNavigation;
