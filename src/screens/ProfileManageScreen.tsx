import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  ImageBackground,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {s as tw} from 'react-native-wind';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import {ColorContext} from '../context/ColorContext';
import BottomNavigation from './BottomNavigation';

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
    <View style={tw`flex-1 bg-gray-200 `}>
      {/* Fixed Header Section */}
      <View style={tw`bg-gray-200`}>
        <ImageBackground
          source={require('../../assets/images/vec.png')} // আপনার ইমেজ পাথ দিন
          style={tw`bg-blue-500 rounded-b-3xl pt-12 pb-8 px-4`}
          imageStyle={tw`rounded-lg`}>
          <View style={tw`flex-row items-center`}>
            <Text style={tw`text-white text-xl font-bold mr-2`}>Profile</Text>
            <View style={tw`bg-white px-2 py-0.5 rounded`}>
              <Text style={tw`text-xs text-blue-500 font-medium`}>Free</Text>
            </View>
          </View>
        </ImageBackground>

        {/* Profile Image & Info */}
        <View style={tw`items-center bottom-12 `}>
          <Image
            source={require('../../assets/images/rony.png')} // Replace with actual URL or local image
            style={tw`w-24 h-24 rounded-full border-4 border-white`}
          />
          <View style={tw`items-center `}>
            <Text style={tw`text-lg font-semibold text-gray-800`}>Mr Rony</Text>

            <View style={tw`flex-row items-center left-12`}>
              <Text style={tw`text-gray-500 mr-2`}>mrrony1574@gmail.com</Text>

              <TouchableOpacity
                style={tw`bg-white px-2 py-1 rounded-lg border border-blue-500 bottom-16`}>
                <Text style={tw`text-blue-500 text-xs font-semibold`}>
                  Try Premium
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* Fixed Stats Section */}
      <View style={tw`px-4 bottom-4`}>
        {/* Two Card Row */}
        <View style={tw`flex-row justify-between`}>
          {/* Building Habit Card */}
          <View style={tw`bg-white rounded-xl px-4 py-3 w-40 shadow-sm`}>
            <Text style={tw`text-gray-600 font-medium`}>Building Habit</Text>
            <Text style={tw`text-2xl font-bold text-black mt-1`}>
              143 <Text style={tw`text-sm text-gray-500`}>Days</Text>
            </Text>
          </View>

          {/* Point Collected Card */}
          <View style={tw`bg-white rounded-xl px-4 py-3 w-[48%] shadow-sm`}>
            <Text style={tw`text-gray-600 font-medium`}>Point Collected</Text>
            <View style={tw`flex-row items-center mt-1`}>
              <Text style={tw`text-yellow-400 text-2xl font-bold`}>🏅322</Text>
              <Text style={tw`text-gray-500 ml-2`}>next 500</Text>
            </View>
          </View>
        </View>

        {/* Bottom Info Text */}
        <View style={tw`bg-white mt-4 p-3 rounded-xl shadow-sm`}>
          <Text style={tw`text-gray-500 text-center text-sm`}>
            Be regular, collect points, Stick with ProDAILY time{'\n'}
            consciousness journey. You'll get rewards.
          </Text>
        </View>
      </View>

      {/* Scrollable Menu Options */}
      <ScrollView
        style={tw`flex-1 mt-4 px-4 `}
        contentContainerStyle={tw`pb-20`}>
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

          {['#3580FF', 'black', 'red', 'green', 'yellow', 'pink'].map(color => (
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
          <View style={tw`flex-row justify-between items-center mb-2`}>
            {/* Left: App Issue */}
            <TouchableOpacity style={tw`flex-row items-center`}>
              <Icon
                name="alert-circle-outline"
                size={24}
                color="gray"
                style={tw`mr-2`}
              />
              <Text style={tw`text-gray-700 text-base`}>App Issue</Text>
            </TouchableOpacity>

            {/* Right: Suggestion */}
            <TouchableOpacity style={tw`flex-row items-center`}>
              <Icon
                name="chatbubble-outline"
                size={24}
                color="gray"
                style={tw`mr-2`}
              />
              <Text style={tw`text-gray-700 text-base`}>Suggestion</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={tw`bg-blue-500 p-3 rounded-xl mt-2 items-center`}>
            <Text style={tw`text-white font-bold`}>Contact Us</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={tw`bg-gray-400 p-3 rounded-xl mt-2 items-center`}>
          <Text style={tw`text-white font-bold`}>Rate Us on Google Play</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <BottomNavigation></BottomNavigation>
    </View>
  );
};

export default ProfileManageScreen;
