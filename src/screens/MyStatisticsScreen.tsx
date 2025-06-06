import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, ScrollView, AppState} from 'react-native';
import {s as tw} from 'react-native-wind';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import Svg, {Circle, Text as SvgText, TSpan} from 'react-native-svg';
import BottomNavigation from './BottomNavigation';
import {Dimensions} from 'react-native';

const {width} = Dimensions.get('window');

// Navigation টাইপ ডেফিনিশন
type RootStackParamList = {
  TodaysTaskToDoScreen: undefined;
  MyCalenderFutureTaskScreen: undefined;
  MyStatisticsScreen: undefined;
  ProfileManageScreen: undefined;
  AddDailyTaskScreen: undefined;
};
type TimeFrameStats = {
  completed: number;
  total: number;
  percentage: number;
  textColor?: string;
};
type NavigationProp = StackNavigationProp<
  RootStackParamList,
  'MyStatisticsScreen'
>;

// CircularProgress কম্পোনেন্টের প্রপস টাইপ
type CircularProgressProps = {
  percentage?: number;
  radius?: number;
  strokeWidth?: number;
};
const CircularProgress = ({
  percentage = 0,
  radius = 50,
  strokeWidth = 8,
}: CircularProgressProps) => {
  const size = radius * 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (percentage / 100) * circumference;

  return (
    <View style={tw`flex items-center justify-center bottom-2`}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background Circle */}
        <Circle
          cx={radius}
          cy={radius}
          r={radius - strokeWidth / 2}
          stroke="#D3E3FC"
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Progress Circle */}
        <Circle
          cx={radius}
          cy={radius}
          r={radius - strokeWidth / 2}
          stroke="#3580FF"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${progress} ${circumference}`}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          transform={`rotate(-90, ${radius}, ${radius})`}
        />

        {/* Centered Percentage */}
        <SvgText
          x={radius}
          y={radius + 5}
          textAnchor="middle"
          fontSize="20"
          fontWeight="bold"
          fill="black">
          {`${percentage}%`}
        </SvgText>
      </Svg>
    </View>
  );
};


const MyStatisticsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [selectedTab, setSelectedTab] = React.useState('Monthly');

  const [selectedDayOnType, setSelectedDayOnType] = useState<
    'weekly' | 'monthly' | 'yearly'
  >('weekly');
  const [isSpecificDayOnSelected, setIsSpecificDayOnSelected] = useState(true); // or false based on your logic

  const [statsData, setStatsData] = useState({
    allTimeCompleted: 0,
    dailyHabit: '0/0',
    successScore: 0,
    completed: 0,
    totalTasks: 0,
    bestStreak: 0,
  });

  const isFocused = useIsFocused();

  const fetchStats = async () => {
    try {
      const tasksJSON = await AsyncStorage.getItem('tasks');
      const tasks = tasksJSON ? JSON.parse(tasksJSON) : [];

      const completedTasks = tasks.filter((task: any) => task.completed);
      const totalTasks = tasks.length;

      setStatsData({
        allTimeCompleted: completedTasks.length,
        dailyHabit: `${completedTasks.length}/${totalTasks}`,
        successScore:
          totalTasks > 0
            ? Math.round((completedTasks.length / totalTasks) * 100)
            : 0,
        completed: completedTasks.length,
        totalTasks: totalTasks,
        bestStreak: 22,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchStats();
    }

    const subscription = AppState.addEventListener('change', fetchStats);
    return () => subscription.remove();
  }, [isFocused]);

  return (
    <View style={tw`flex-1 bg-gray-200`}>
      <ScrollView contentContainerStyle={tw`p-4 pb-28`}>
        {/* হেডার সেকশন */}
        <Text
          style={[
            tw` font-bold`,
            {fontSize: 20, letterSpacing: 1, color: '#000000'},
          ]}>
          My Statistics
        </Text>
        <Text
          style={[
            tw``,
            {color: '#8D99AE', lineHeight: 20, letterSpacing: 1, fontSize: 11},
          ]}>
          Your task progress and habit report
        </Text>

        {/* টপ স্ট্যাটিস্টিক্স */}
        <View style={[tw`rounded-lg bg-white top-4`, {height: 300}]}>
          <View style={tw`flex-row justify-between h-32 top-4 mx-2`}>
            <View
              style={[
                tw`bg-blue-500 p-4 rounded-lg `,
                {width: width * 0.42, height: width * 0.3},
              ]}>
              <Text
                style={[
                  tw`font-normal text-xs`,
                  {color: '#DEEAFF', letterSpacing: 1},
                ]}>
                All Time Completed
              </Text>
              <Text style={tw`text-white text-2xl font-bold left-12 top-5`}>
                {statsData.allTimeCompleted}
              </Text>
            </View>
            <View
              style={[
                tw`bg-blue-500 p-4 rounded-lg `,
                {width: width * 0.42, height: width * 0.3},
              ]}>
              <Text
                style={[
                  tw`left- font-normal text-xs`,
                  {color: '#DEEAFF', letterSpacing: 0.5},
                ]}>
                Daily Task Into Habit
              </Text>
              <Text style={tw`text-white text-2xl font-bold left-8 top-5`}>
                {statsData.dailyHabit}
              </Text>
            </View>
          </View>
          {/* প্রোগ্রেস সার্কেল */}
          <View style={tw`items-center h-44 top-4`}>
            <Text
              style={[tw`font-medium mb-4`, {fontSize: 14, letterSpacing: 1}]}>
              Overall Score
            </Text>
            <CircularProgress percentage={statsData.successScore} />
          </View>
        </View>
        <View style={tw`bg-white top-8 rounded-lg`}>
          <View style={tw`bg-white h-24 rounded-lg`}>
            <View
              style={tw`flex-row bg-gray-200 mx-2 rounded-full shadow-sm top-5`}>
              {['Weekly', 'Monthly', 'Yearly'].map(tab => (
                <TouchableOpacity
                  key={tab}
                  onPress={() => setSelectedTab(tab)}
                  style={tw`flex-1 p-2 rounded-full ${
                    selectedTab === tab ? 'bg-blue-500' : 'bg-transparent'
                  }`}>
                  <Text
                    style={[
                      tw`text-center text-sm font-normal`,
                      selectedTab === tab
                        ? tw`text-white font-semibold`
                        : {color: '#8D99AE'},
                    ]}>
                    {tab}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          {/* কারেন্ট প্রোগ্রেস সেকশন */}
          <View
            style={[
              tw`bg-white shadow-lg rounded-lg p-4 bottom-4`,
              {height: 145},
            ]}>
            <Text style={tw`text-black font-medium text-base mb-2 bottom-4`}>
              Last Month
            </Text>
            <View style={tw`flex-row items-center justify-between`}>
              <CircularProgress
                percentage={statsData.successScore}
                radius={40}
                
              />
              <View style={tw`ml-4 bottom-2`}>
                <Text
                  style={[
                    tw`font-medium`,
                    {
                      fontSize: 14,
                      lineHeight: 20,
                      letterSpacing: 1,
                      color: '#2B2D42',
                    },
                  ]}>
                  Task{'\n'}Completed
                </Text>
                <Text style={tw`text-gray-500 text-xs`}>
                  {statsData.completed} of {statsData.totalTasks}
                </Text>
              </View>
              <View style={tw`flex-1 ml-4`}>
                <Text
                  style={[
                    tw`text-gray-600 font-normal text-center top-1`,
                    {fontSize: 12},
                  ]}>
                  {statsData.successScore > 70
                    ? "You're doing great! 🚀 Keep it up!"
                    : 'You improve a lot, To keep it up; Stay focus. Follow ExpandTimes '}
                </Text>
                <TouchableOpacity
                  style={[
                    tw`p-2 rounded-xl mx-4 top-3 items-center`,
                    {backgroundColor: '#F1F7FF'},
                  ]}>
                  <Text
                    style={[
                      tw`font-medium `,
                      {color: '#3580FF', fontSize: 11, letterSpacing: 1},
                    ]}>
                    Follow
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* হ্যাবিট সামারি */}
        <View style={tw`p-4 bg-white rounded-lg top-12`}>
          <View style={tw`flex-row justify-between mb-6`}>
            <View>
              <Text
                style={[
                  tw`text-black font-medium `,
                  {fontSize: 16, letterSpacing: 1, lineHeight: 20},
                ]}>
                Habits
              </Text>
              <Text
                style={[
                  tw`text-gray-400  font-normal`,
                  {fontSize: 12, letterSpacing: 0, lineHeight: 20, left: 1},
                ]}>
                Summary
              </Text>
            </View>
            <View>
              <Text
                style={[
                  tw`text-gray-400 text-xs font-normal`,
                  {letterSpacing: 1},
                ]}>
                More Details
              </Text>
            </View>
          </View>
          <View style={tw`flex-row justify-between flex-wrap`}>
            <View style={tw`w-1/4 items-center`}>
              <Text
                style={[
                  tw`font-medium`,
                  {
                    fontSize: 9,
                    lineHeight: 16,
                    letterSpacing: 0.5,
                    color: '#9B9BA1',
                  },
                ]}>
                SUCCESS SCORE
              </Text>
              <Text style={tw`text-gray-600 text-lg font-bold`}>
                {statsData.successScore}%
              </Text>
            </View>
            <View style={tw`w-1/4 items-center`}>
              <Text
                style={[
                  tw`font-medium`,
                  {
                    fontSize: 9,
                    lineHeight: 16,
                    letterSpacing: 1,
                    color: '#9B9BA1',
                  },
                ]}>
                COMPLETED
              </Text>
              <Text style={tw`text-blue-400 text-lg font-bold`}>
                {statsData.completed}
              </Text>
            </View>
            <View style={tw`w-1/4 items-center`}>
              <Text
                style={[
                  tw`font-medium`,
                  {
                    fontSize: 9,
                    lineHeight: 16,
                    letterSpacing: 1,
                    color: '#9B9BA1',
                  },
                ]}>
                FAILED
              </Text>
              <Text style={tw`text-black text-lg font-bold`}>
                {statsData.totalTasks - statsData.completed}
              </Text>
            </View>
            <View style={tw`w-1/4 items-center`}>
              <Text
                style={[
                  tw`font-semibold `,
                  {
                    fontSize: 8,
                    lineHeight: 16,
                    letterSpacing: 0.5,
                    color: '#9B9BA1',
                  },
                ]}>
                BEST STREAK DAY
              </Text>
              <Text style={tw`text-blue-400 text-lg font-bold`}>
                {statsData.bestStreak}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* বটম নেভিগেশন */}
      <BottomNavigation></BottomNavigation>
    </View>
  );
};

export default MyStatisticsScreen;
