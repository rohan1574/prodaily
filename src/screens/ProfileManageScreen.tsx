import React, {useContext, useState, useRef} from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Image,
  Animated,
  ImageBackground,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {s as tw} from 'react-native-wind';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import {ColorContext} from '../context/ColorContext';
import BottomNavigation from './BottomNavigation';
import {usePoints} from '../context/PointsContext';
import {Dimensions} from 'react-native';

const {width} = Dimensions.get('window');
const cardWidth = width * 0.45;

type RootStackParamList = {
  TodaysTaskToDoScreen: undefined;
  MyCalenderFutureTaskScreen: undefined;
  MyStatisticsScreen: undefined;
  ProfileManageScreen: undefined;
  AddDailyTaskScreen: undefined;
  AllTaskListScreen: undefined;
  PremiumPackage: undefined;
  PremiumScreen: undefined;
};

type NavigationProp = StackNavigationProp<
  RootStackParamList,
  'TodaysTaskToDoScreen'
>;

const ProfileManageScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [showSignOut, setShowSignOut] = useState(false);
  const [themes, setThemes] = useState(false);
  const context = useContext(ColorContext);
  const scrollY = useRef(new Animated.Value(0)).current;
  const [showInfoText, setShowInfoText] = useState(true);
  // Handle scroll events with animation
  const handleScroll = Animated.event(
    [{nativeEvent: {contentOffset: {y: scrollY}}}],
    {
      useNativeDriver: false,
      listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        // Use a threshold to prevent flickering
        if (offsetY > 20 && showInfoText) {
          setShowInfoText(false);
        } else if (offsetY <= 20 && !showInfoText) {
          setShowInfoText(true);
        }
      },
    },
  );
  if (!context) {
    throw new Error('ColorContext is not available');
  }
  const {setSelectedColor} = context;
  const {points} = usePoints();
  const [selectedOption, setSelectedOption] = useState<
    'App Issue' | 'Suggestion'
  >('App Issue');
  return (
    <View style={tw`flex-1 bg-gray-100`}>
      {/* Fixed Header Section */}
      <View style={tw`bg-gray-100`}>
        <ImageBackground
          source={require('../../assets/images/vec.png')}
          style={tw`bg-blue-500 rounded-b-3xl pt-12 pb-8 px-4`}
          imageStyle={tw`rounded-lg`}>
          <View style={tw`flex-row items-center bottom-4`}>
            <Text style={tw`text-white text-xl font-bold mr-2`}>Profile</Text>
            <View
              style={[
                tw` px-2 py-0.5 rounded`,
                {backgroundColor: '#DEEAFF4D'},
              ]}>
              <Text style={tw`text-xs text-white font-normal`}>Free</Text>
            </View>
          </View>
        </ImageBackground>
        {/* Profile Image & Info */}
        <View style={tw`items-center bottom-12`}>
          <Image
            source={require('../../assets/images/rony.png')}
            style={tw`w-24 h-24 rounded-full border-4 border-white`}
          />
          <View style={tw`items-center`}>
            <Text
              style={[
                tw`font-medium`,
                {fontSize: 20, letterSpacing: 1, color: '#2B2D42'},
              ]}>
              Mr Rony
            </Text>
            <View style={tw`flex-row items-center left-12`}>
              <Text style={tw`text-gray-500 mr-2 font-light bottom-1`}>
                mrrony@gmail.com
              </Text>
              <TouchableOpacity
                style={tw`bg-white px-2 py-1 rounded-lg bottom-16`}
                onPress={() => navigation.navigate('PremiumScreen')}>
                <Text style={tw`text-blue-500 text-xs font-semibold`}>
                  Try Premium
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      {/* Fixed Stats Section */}
      <View style={tw`px-4 bottom-6`}>
        {/* Two Card Row */}
        <View style={tw`flex-row justify-between`}>
          {/* Building Habit Card */}
          <View
            style={[
              tw`bg-white rounded-xl px-4 py-3 shadow-sm`,
              {width: cardWidth},
            ]}>
            <Text
              style={[
                tw`font-medium left-6`,
                {fontSize: 14, letterSpacing: 1, color: '#2B2D42'},
              ]}>
              Building Habit
            </Text>
            <Text style={tw`text-2xl font-semibold text-black mt-1 left-8`}>
              143{' '}
              <Text
                style={[
                  tw`font-light`,
                  {fontSize: 12, letterSpacing: 1, color: '#8D9094'},
                ]}>
                Days
              </Text>
            </Text>
          </View>
          {/* Point Collected Card */}
          <View
            style={[
              tw`bg-white rounded-xl px-4 py-3 shadow-sm`,
              {width: cardWidth},
            ]}>
            <Text
              style={[
                tw`text-gray-600 font-medium text-xs left-4`,
                {fontSize: 14, letterSpacing: 1, color: '#2B2D42'},
              ]}>
              Point Collected
            </Text>
            <View style={tw`flex-row items-center left-4`}>
              <View
                style={[
                  tw`flex-row items-center mt-1 rounded-lg`,
                  {backgroundColor: '#FFF3DA', width: 65},
                ]}>
                <Text style={{width: 16, height: 20}}>🏅</Text>
                <Text
                  style={{
                    color: '#FEA800',
                    fontSize: 24,
                    fontWeight: '600',
                    marginLeft: 4,
                  }}>
                  {points || 0}
                </Text>
              </View>
              <Text
                style={[
                  tw`left-1 font-light`,
                  {fontSize: 12, letterSpacing: 1, color: '#8D9094'},
                ]}>
                next 500
              </Text>
            </View>
          </View>
        </View>
       
        {/* <View
          style={[
            tw`bg-white mt-4 p-3 rounded-xl shadow-sm mx-4`,
            
          ]}>
          <Text
            style={[
              tw`text-gray-500 text-center text-xs`,
              {color: '#8D99AE', letterSpacing: 0.5},
            ]}>
            Be regular, collect points, Stick with ProDAILY time{'\n'}
            consciousness journey. You'll get rewards.
          </Text>
        </View> */}
      </View>
      {/* Scrollable Menu Options */}
      <ScrollView
        style={tw`flex-1 px-4 `}
        contentContainerStyle={tw`pb-20`}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        // Add these props for better scroll performance
        decelerationRate="normal"
        showsVerticalScrollIndicator={false}
        overScrollMode="never">
          {/* Bottom Info Text */}
        <View
          style={[
            tw`bg-white mt-4 bottom-4 p-3 rounded-xl shadow-sm mx-4`,
            
          ]}>
          <Text
            style={[
              tw`text-gray-500 text-center text-xs`,
              {color: '#8D99AE', letterSpacing: 0.5},
            ]}>
            Be regular, collect points, Stick with ProDAILY time{'\n'}
            consciousness journey. You'll get rewards.
          </Text>
        </View>
        <TouchableOpacity
          style={tw`flex-row items-center p-4 bg-white mb-2 rounded-xl shadow`}>
          <Icon
            name="home-outline"
            size={24}
            color="#3580FF"
            style={tw`mr-2`}
          />
          <Text style={tw`text-black text-base`}>Home</Text>
        </TouchableOpacity>
        {/* Premium Section */}
        <View style={tw`bg-white mb-2 rounded-xl shadow`}>
          <TouchableOpacity
            onPress={() => navigation.navigate('PremiumPackage')}
            style={tw`flex-row items-center justify-between p-4 bg-white rounded-xl`}>
            <View style={tw`flex-row items-center`}>
              <Icon
                name="sparkles-outline"
                size={24}
                color="#3580FF"
                style={tw`mr-2`}
              />
              <Text style={tw`text-black text-base`}>Premium</Text>
            </View>
            <Icon name="chevron-forward" size={20} color="#DFDFDF" />
          </TouchableOpacity>
        </View>
        {/* Account Section with Toggle */}
        <View style={tw`bg-white mb-2 rounded-xl shadow`}>
          <TouchableOpacity
            onPress={() => setShowSignOut(!showSignOut)}
            style={tw`flex-row items-center justify-between p-4 bg-white rounded-xl`}>
            <View style={tw`flex-row items-center`}>
              <Icon
                name="person-outline"
                size={24}
                color="#3580FF"
                style={tw`mr-2`}
              />
              <Text style={tw`text-black text-base`}>Account</Text>
            </View>
            <Icon
              name={showSignOut ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#DFDFDF"
            />
          </TouchableOpacity>
          {/* Sign Out Button */}
          {showSignOut && (
            <TouchableOpacity
              style={[
                tw`bg-white items-center justify-center bottom-4 mx-8 mt-4`,
                {
                  paddingVertical: 12,
                  paddingHorizontal: 32,
                  borderRadius: 9999,
                  shadowColor: '#4A90E2',
                  shadowOffset: {width: 0, height: 5},
                  shadowOpacity: 0.15,
                  shadowRadius: 20,
                  elevation: 10,
                },
              ]}>
              <Text
                style={[
                  tw`text-sm font-medium text-gray-700`,
                  {lineHeight: 20},
                ]}>
                Sign Out
              </Text>
            </TouchableOpacity>
          )}
        </View>
        {/* Themes Section */}
        <View style={tw`bg-white rounded-xl shadow mb-2`}>
          <TouchableOpacity
            onPress={() => setThemes(!themes)}
            style={tw`flex-row items-center justify-between p-3 bg-white mb-2 rounded-xl shadow`}>
            <View style={tw`flex-row items-center`}>
              <Icon
                name="moon-outline"
                size={24}
                color="#3580FF"
                style={tw`mr-2`}
              />
              <Text style={tw`text-black text-base`}>Themes</Text>
            </View>
            <Icon
              name={themes ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#DFDFDF"
            />
          </TouchableOpacity>
          {/* Theme color options */}
          {themes && (
            <TouchableOpacity style={tw`p-4 bg-white mb-2 rounded-xl shadow`}>
              <View style={tw`flex-row justify-center flex-wrap`}>
                {['#3580FF', 'black', 'red', 'green', 'yellow', 'pink'].map(
                  color => (
                    <TouchableOpacity
                      key={color}
                      onPress={() => setSelectedColor(color)}
                      style={tw`items-center mx-1`}>
                      <View
                        style={[
                          tw`w-6 h-6 rounded-full`,
                          {
                            backgroundColor: color,
                            shadowColor: '#4A90E2',
                            shadowOffset: {width: 0, height: 3},
                            shadowOpacity: 0.15,
                            shadowRadius: 6,
                            elevation: 4,
                            width: 28,
                            height: 28,
                          },
                        ]}
                      />
                    </TouchableOpacity>
                  ),
                )}
              </View>
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={tw`flex-row items-center p-4 bg-white mb-2 rounded-xl shadow`}>
          <Icon
            name="bar-chart-outline"
            size={24}
            color="#3580FF"
            style={tw`mr-2`}
          />
          <Text style={tw`text-black text-base`}>Statistics</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={tw`flex-row items-center p-4 bg-white mb-2 rounded-xl shadow`}>
          <Icon
            name="calendar-outline"
            size={24}
            color="#3580FF"
            style={tw`mr-2`}
          />
          <Text style={tw`text-black text-base`}>My Calendar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          style={tw`flex-row items-center p-4 bg-white mb-2 rounded-xl shadow`}>
          <Icon
            name="clipboard-outline"
            size={24}
            color="#3580FF"
            style={tw`mr-2`}
          />
          <Text
            style={tw`text-black text-base`}
            onPress={() => navigation.navigate('AllTaskListScreen')}>
            Manage Tasks
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={tw`flex-row items-center p-4 bg-white mb-2 rounded-xl shadow`}>
          <Icon
            name="cloud-outline"
            size={24}
            color="#3580FF"
            style={tw`mr-2`}
          />
          <Text style={tw`text-black text-base`}>Sync Data</Text>
        </TouchableOpacity>
        {/* Support Section */}
        <View style={[tw`bg-gray-200 rounded-lg p-4 mx-4 shadow-md top-4`]}>
          <View style={tw`flex-row justify-around border-b border-white pb-3`}>
            {['App Issue', 'Suggestion'].map(option => (
              <TouchableOpacity
                key={option}
                onPress={() =>
                  setSelectedOption(option as 'App Issue' | 'Suggestion')
                }
                style={tw`flex-row items-center`}>
                <Icon
                  name={
                    selectedOption === option
                      ? 'radio-button-on'
                      : 'radio-button-off'
                  }
                  size={18}
                  color={selectedOption === option ? '#3b82f6' : 'gray'}
                />
                <Text style={tw`ml-2 text-sm text-gray-700`}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity
            style={tw`bg-blue-500 py-2 mt-4 rounded-full items-center left-20 w-32`}>
            <Text style={tw`text-white font-normal text-sm`}>Contact Us</Text>
          </TouchableOpacity>
          <Text style={tw`text-xs text-gray-400 text-center mt-3`}>
            Please let us know any issue or suggestion.
            {'\n'}Our dedicated developers are ready to fix your issue ASAP.
          </Text>
        </View>
        {/* Google Play Button */}
        <TouchableOpacity
          style={tw`bg-blue-500 mt-5 top-6 rounded-full py-2 items-center mx-4`}>
          <Text style={tw`text-white font-normal text-base`}>
            Rate Us on Google Play
          </Text>
        </TouchableOpacity>
      </ScrollView>
      {/* Bottom Navigation Bar */}
      <BottomNavigation />
    </View>
  );
};

export default ProfileManageScreen;
