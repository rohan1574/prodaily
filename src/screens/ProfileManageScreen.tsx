import React, {useContext, useState} from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {s as tw} from 'react-native-wind';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import {ColorContext} from '../context/ColorContext';

// Define the navigation type
type RootStackParamList = {
  TodaysTaskToDoScreen: undefined;
  MyCalenderFutureTaskScreen: undefined;
  MyStatisticsScreen: undefined;
  ProfileManageScreen: undefined;
  AddDailyTaskScreen: undefined;
  AllTaskListScreen: undefined;
};

type NavigationProp = StackNavigationProp<
  RootStackParamList,
  'TodaysTaskToDoScreen'
>;
const ProfileManageScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [showSignOut, setShowSignOut] = useState(false);
  const context = useContext(ColorContext);
  if (!context) {
    throw new Error('ColorContext is not available');
  }

  const {setSelectedColor} = context;
  return (
    <View style={tw`flex-1 bg-gray-100`}>
      {/* Fixed Header Section */}
      <View style={tw`bg-blue-500 p-6 rounded-b-3xl items-center`}>
        <View style={tw`w-24 h-24 bg-gray-300 rounded-full mb-2`} />
        <Text style={tw`text-white text-lg font-bold`}>Mr Rony</Text>
        <Text style={tw`text-gray-200`}>mrrony@gmail.com</Text>
        <TouchableOpacity style={tw`bg-white px-4 py-1 rounded-full mt-2`}>
          <Text style={tw`text-blue-500 font-semibold`}>Try Premium</Text>
        </TouchableOpacity>
      </View>

      {/* Fixed Stats Section */}
      <View
        style={tw`flex-row justify-around bg-white p-4 mt-4 rounded-xl mx-4 shadow`}>
        <View style={tw`items-center`}>
          <Text style={tw`text-xl font-bold`}>143</Text>
          <Text style={tw`text-gray-600`}>Days</Text>
        </View>
        <View style={tw`items-center`}>
          <Text style={tw`text-xl font-bold text-yellow-500`}>322</Text>
          <Text style={tw`text-gray-600`}>Points</Text>
        </View>
      </View>

      {/* Scrollable Menu Options */}
      <ScrollView style={tw`flex-1 mt-4 px-4`}>
        <TouchableOpacity
          style={tw`flex-row items-center p-4 bg-white mb-2 rounded-xl shadow`}>
          <Icon name="home-outline" size={24} color="gray" style={tw`mr-4`} />
          <Text style={tw`text-gray-700 text-base`}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={tw`flex-row items-center p-4 bg-white mb-2 rounded-xl shadow`}>
          <Icon name="star-outline" size={24} color="gray" style={tw`mr-4`} />
          <Text style={tw`text-gray-700 text-base`}>Get Premium</Text>
        </TouchableOpacity>

        {/* Account Section with Toggle */}
        <TouchableOpacity
          onPress={() => setShowSignOut(!showSignOut)}
          style={tw`flex-row items-center p-4 bg-white mb-2 rounded-xl shadow`}>
          <Icon name="person-outline" size={24} color="gray" style={tw`mr-4`} />
          <Text style={tw`text-gray-700 text-base`}>Account</Text>
        </TouchableOpacity>
        {showSignOut && (
          <TouchableOpacity style={tw`p-4 bg-white mb-2 rounded-xl shadow`}>
            <Text style={tw`text-gray-700 text-base text-center`}>
              Sign Out
            </Text>
          </TouchableOpacity>
        )}
        {/* Themes Section with Colors */}
        <View
          style={tw`p-4 bg-white mb-2 rounded-xl shadow flex-row items-center`}>
          <Icon
            name="color-palette-outline"
            size={24}
            color="gray"
            style={tw`mr-4`}
          />
          <Text style={tw`text-gray-700 text-base mr-4`}>Themes</Text>

          {['blue', 'black', 'red', 'green', 'yellow', 'pink'].map(color => (
            <TouchableOpacity
              key={color}
              onPress={() => setSelectedColor(color)}
              style={tw`items-center mx-1`}>
              {/* Color Circle */}
              <View
                style={[
                  tw`w-6 h-6 rounded-full mb-1`,
                  {backgroundColor: color},
                ]}
              />
              {/* Color Text */}
              {/* <Text style={{color, fontSize: 10}}>bg {color}</Text> */}
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity
          style={tw`flex-row items-center p-4 bg-white mb-2 rounded-xl shadow`}>
          <Icon
            name="bar-chart-outline"
            size={24}
            color="gray"
            style={tw`mr-4`}
          />
          <Text style={tw`text-gray-700 text-base`}>Statistics</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={tw`flex-row items-center p-4 bg-white mb-2 rounded-xl shadow`}>
          <Icon
            name="calendar-outline"
            size={24}
            color="gray"
            style={tw`mr-4`}
          />
          <Text style={tw`text-gray-700 text-base`}>My Calendar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          style={tw`flex-row items-center p-4 bg-white mb-2 rounded-xl shadow`}>
          <Icon
            name="clipboard-outline"
            size={24}
            color="gray"
            style={tw`mr-4`}
          />
          <Text
            style={tw`text-gray-700 text-base`}
            onPress={() => navigation.navigate('AllTaskListScreen')}>
            Manage Tasks
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={tw`flex-row items-center p-4 bg-white mb-2 rounded-xl shadow`}>
          <Icon name="cloud-outline" size={24} color="gray" style={tw`mr-4`} />
          <Text style={tw`text-gray-700 text-base`}>Sync Data</Text>
        </TouchableOpacity>

        {/* Support Section */}
        <View style={tw`bg-white p-4 rounded-xl shadow mt-4`}>
          <Text style={tw`text-gray-700 text-base font-bold mb-2`}>
            Support
          </Text>
          <TouchableOpacity style={tw`flex-row items-center mb-2`}>
            <Icon
              name="alert-circle-outline"
              size={24}
              color="gray"
              style={tw`mr-4`}
            />
            <Text style={tw`text-gray-700 text-base`}>App Issue</Text>
          </TouchableOpacity>
          <TouchableOpacity style={tw`flex-row items-center mb-2`}>
            <Icon
              name="chatbubble-outline"
              size={24}
              color="gray"
              style={tw`mr-4`}
            />
            <Text style={tw`text-gray-700 text-base`}>Suggestion</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={tw`bg-blue-500 p-3 rounded-xl mt-2 items-center`}>
            <Text style={tw`text-white font-bold`}>Contact Us</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Navigation Bar */}
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
};

export default ProfileManageScreen;
