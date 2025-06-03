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
import {usePoints} from '../context/PointsContext';
import {Dimensions} from 'react-native';
const {width} = Dimensions.get('window');
const cardWidth = width * 0.45;
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
  const {points} = usePoints();
  const [showBottomInfo, setShowBottomInfo] = useState(true); // New state for text visibility
  const [selectedOption, setSelectedOption] = useState<
    'App Issue' | 'Suggestion'
  >('App Issue');

  return (
    <View style={tw`flex-1 bg-gray-100 `}>
      {/* Fixed Header Section */}
      <View style={tw`bg-gray-100`}>
        <ImageBackground
          source={require('../../assets/images/vec.png')} // আপনার ইমেজ পাথ দিন
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
        <View style={tw`items-center bottom-12 `}>
          <Image
            source={require('../../assets/images/rony.png')} // Replace with actual URL or local image
            style={tw`w-24 h-24 rounded-full border-4 border-white`}
          />
          <View style={tw`items-center `}>
            <Text style={[tw` font-medium `,,{fontSize:20,letterSpacing:1,color:"#2B2D42"}]}>Mr Rony</Text>

            <View style={tw`flex-row items-center left-12`}>
              <Text style={tw`text-gray-500 mr-2 font-light bottom-1`}>
                mrrony@gmail.com
              </Text>

              <TouchableOpacity
                style={tw`bg-white px-2 py-1 rounded-lg bottom-16`}>
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
          <View
            style={[
              tw`bg-white rounded-xl px-4 py-3 shadow-sm`,
              {width: cardWidth},
            ]}>
            <Text style={[tw`font-medium left-6`,{fontSize:14,letterSpacing:1,color:"#2B2D42"}]}>
              Building Habit
            </Text>
            <Text style={tw`text-2xl font-semibold text-black mt-1 left-8`}>
              143 <Text style={[tw` font-light`,{fontSize:12,letterSpacing:1,color:"#8D9094"}]}>Days</Text>
            </Text>
          </View>

          {/* Point Collected Card */}
          <View
            style={[
              tw`bg-white rounded-xl px-4 py-3 shadow-sm`,
              {width: cardWidth},
            ]}>
            <Text style={[tw`text-gray-600 font-medium text-xs left-4`,{fontSize:14,letterSpacing:1,color:"#2B2D42"}]}>
              Point Collected
            </Text>
            <View style={tw`flex-row items-center left-4`}>
              <View
                style={[
                  tw`flex-row items-center mt-1 rounded-lg`,
                  {backgroundColor: '#FFF3DA',width:65},
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
              <Text style={[tw`left-1 font-light`,{fontSize:12,letterSpacing:1,color:"#8D9094"}]}>next 500</Text>
            </View>
          </View>
        </View>
        {/* Bottom Info Text */}
        {showBottomInfo && (
          <View style={tw`bg-white mt-4 p-3 rounded-xl shadow-sm`}>
            <Text style={tw`text-gray-500 text-center text-xs`}>
              Be regular, collect points, Stick with ProDAILY time{'\n'}
              consciousness journey. You'll get rewards.
            </Text>
          </View>
        )}
      </View>

      {/* Scrollable Menu Options */}
      <ScrollView
        style={tw`flex-1 mt-4 px-4`}
        contentContainerStyle={tw`pb-20`}
        onScroll={({nativeEvent}) => {
          // Hide text when scrolled beyond 5px, show when at top
          setShowBottomInfo(nativeEvent.contentOffset.y <= 10);
        }}
        scrollEventThrottle={16} // Controls event frequency
      >
        <TouchableOpacity
          style={tw`flex-row items-center p-4 bg-white mb-2 rounded-xl shadow`}>
          <Icon
            name="home-outline"
            size={24}
            color="#3580FF"
            style={tw`mr-4`}
          />
          <Text style={tw`text-gray-700 text-base`}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={tw`flex-row items-center p-4 bg-white mb-2 rounded-xl shadow`}>
          <Icon
            name="star-outline"
            size={24}
            color="#3580FF"
            style={tw`mr-4`}
          />
          <Text style={tw`text-gray-700 text-base`}>Get Premium</Text>
        </TouchableOpacity>

        {/* Account Section with Toggle */}
        <TouchableOpacity
          onPress={() => setShowSignOut(!showSignOut)}
          style={tw`flex-row items-center p-4 bg-white mb-2 rounded-xl shadow`}>
          <Icon
            name="person-outline"
            size={24}
            color="#3580FF"
            style={tw`mr-4`}
          />
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
            color="#3580FF"
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
            color="#3580FF"
            style={tw`mr-4`}
          />
          <Text style={tw`text-gray-700 text-base`}>Statistics</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={tw`flex-row items-center p-4 bg-white mb-2 rounded-xl shadow`}>
          <Icon
            name="calendar-outline"
            size={24}
            color="#3580FF"
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
            color="#3580FF"
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
          <Icon
            name="cloud-outline"
            size={24}
            color="#3580FF"
            style={tw`mr-4`}
          />
          <Text style={tw`text-gray-700 text-base`}>Sync Data</Text>
        </TouchableOpacity>

        {/* Support Section */}
        <View style={[tw`bg-gray-200 rounded-lg p-4 mx-4 shadow-md`]}>
          {/* Toggle: App Issue / Suggestion */}
          <View style={tw`flex-row justify-around border-b  border-white pb-3`}>
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

          {/* Contact Us Button */}
          <TouchableOpacity
            style={tw`bg-blue-500 py-2 mt-4 rounded-full items-center left-20 w-32`}>
            <Text style={tw`text-white font-normal text-sm`}>Contact Us</Text>
          </TouchableOpacity>

          {/* Info Text */}
          <Text style={tw`text-xs text-gray-400 text-center mt-3`}>
            Please let us know any issue or suggestion.
            {'\n'}Our dedicated developers are ready to fix your issue ASAP.
          </Text>
        </View>
        {/* Google Play Button */}
        <TouchableOpacity
          style={tw`bg-blue-500 mt-5 rounded-full py-2 items-center mx-4`}>
          <Text style={tw`text-white font-normal text-base`}>
            Rate Us on Google Play
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <BottomNavigation></BottomNavigation>
    </View>
  );
};

export default ProfileManageScreen;
