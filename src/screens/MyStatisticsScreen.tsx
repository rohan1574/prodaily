import React, {useState, useEffect, useContext} from 'react';
import {View, Text, TouchableOpacity, ScrollView, AppState} from 'react-native';
import {s as tw} from 'react-native-wind';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import Svg, {Circle, Text as SvgText, TSpan} from 'react-native-svg';
import BottomNavigation from './BottomNavigation';
import {Dimensions} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useColorContext} from '../context/ColorContext'; // Import the color context

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
  backgroundColor?: string;
  progressColor?: string;
  textColor?: string;
};
const CircularProgress = ({
  percentage = 0,
  radius = 50,
  strokeWidth = 8,
  backgroundColor = '#D3E3FC',
  progressColor = '#3580FF',
  textColor = 'black',
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
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Progress Circle */}
        <Circle
          cx={radius}
          cy={radius}
          r={radius - strokeWidth / 2}
          stroke={progressColor}
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
          fill={textColor}>
          {`${percentage}%`}
        </SvgText>
      </Svg>
    </View>
  );
};

const MyStatisticsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [selectedTab, setSelectedTab] = useState<
    'Weekly' | 'Monthly' | 'Yearly'
  >('Weekly');

  {
    /* Get the selected color from context */
  }
  const {selectedColor} = useColorContext();
  {
    /* Determine background and text colors based on selected theme */
  }

  const isDarkTheme = selectedColor === '#3580FF';
  let backgroundColor = selectedColor;
  let textColor = '#000000';
  let cardBackground = '#FFFFFF';
  let secondaryTextColor = '#8D99AE';
  let progressBgColor = '#D3E3FC';
  let progressColor = '#3580FF';
  {
    /* Custom theme override for specific colors */
  }
  if (selectedColor === '#27282A') {
    textColor = '#FFFFFF';
    cardBackground = '#3A3A3A';
    secondaryTextColor = '#B0B0B0';
    progressBgColor = '#4A4A4A';
    progressColor = '#F2247A';
  } else if (selectedColor === '#F2247A') {
    {
      /*  Custom pink theme */
    }
    backgroundColor = '#F7FAFF';
    textColor = '#F2247A';
    cardBackground = '#FFFFFF';
    secondaryTextColor = '#8D99AE';
    progressBgColor = '#F2247A';
    progressColor = '#30BF78';
  }

  const getLastPeriodText = () => {
    switch (selectedTab) {
      case 'Weekly':
        return 'Last Week';
      case 'Monthly':
        return 'Last Month';
      case 'Yearly':
        return 'Last Year';
      default:
        return '';
    }
  };

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
    <SafeAreaView style={[tw`flex-1`, {backgroundColor: '#F7FAFF'}]}>
      <View style={tw`flex-1`}>
        <ScrollView contentContainerStyle={[tw`p-4`, {paddingBottom: 170}]}>
          {/* হেডার সেকশন */}
          <Text
            style={[
              tw`font-bold`,
              {fontSize: 20, letterSpacing: 1, color: '000000'},
            ]}>
            My Statistics
          </Text>
          <Text
            style={[
              tw``,
              {
                color: '#8D99AE',
                lineHeight: 20,
                letterSpacing: 1,
                fontSize: 11,
              },
            ]}>
            Your task progress and habit report
          </Text>

          {/* টপ স্ট্যাটিস্টিক্স */}
          <View
            style={[
              tw`rounded-lg top-4`,
              {height: 320, backgroundColor: '#FFFFFF'},
            ]}>
            <View style={tw`flex-row justify-between h-32 top-4 mx-2`}>
              <View
                style={[
                  tw`rounded-lg justify-center items-center`,
                  {
                    width: width * 0.42,
                    height: width * 0.3,
                    backgroundColor: '#3580FF',
                  },
                ]}>
                <Text
                  style={[
                    tw`font-normal bottom-4 text-xs `,
                    {
                      color: '#DEEAFF',
                      letterSpacing: 1,
                    },
                  ]}>
                  All Time Completed
                </Text>
                <Text style={[tw`text-2xl font-bold mt-2`, {color: '#FFFFFF'}]}>
                  {statsData.allTimeCompleted}
                </Text>
              </View>

              <View
                style={[
                  tw`rounded-lg justify-center items-center`,
                  {
                    width: width * 0.42,
                    height: width * 0.3,
                    backgroundColor: '#3580FF',
                  },
                ]}>
                <Text
                  style={[
                    tw`font-normal text-xs bottom-4`,
                    {
                      color: '#DEEAFF',
                      letterSpacing: 0.5,
                    },
                  ]}>
                  Daily Task Into Habit
                </Text>
                <Text style={[tw`text-2xl font-bold`, {color: '#FFFFFF'}]}>
                  {statsData.dailyHabit}
                </Text>
              </View>
            </View>
            {/* প্রোগ্রেস সার্কেল */}
            <View style={tw`items-center h-44 top-8`}>
              <Text
                style={[
                  tw`font-medium mb-4`,
                  {fontSize: 16, letterSpacing: 1, color: '#34302E'},
                ]}>
                Overall Score
              </Text>
              <CircularProgress
                percentage={statsData.successScore}
                backgroundColor="#DEEAFF"
                progressColor="#3580FF"
                textColor="#2B2D42"
              />
            </View>
          </View>

          <View style={[tw`top-8 rounded-lg`, {backgroundColor: '#FFFFFF'}]}>
            <View style={tw`h-24 rounded-lg`}>
              <View
                style={[
                  tw`flex-row mx-2 rounded-full shadow-sm top-5`,
                  {backgroundColor: '#EAECF0'},
                ]}>
                {['Weekly', 'Monthly', 'Yearly'].map(tab => (
                  <TouchableOpacity
                    key={tab}
                    onPress={() =>
                      setSelectedTab(tab as 'Weekly' | 'Monthly' | 'Yearly')
                    }
                    style={[
                      tw`flex-1 p-2 rounded-full`,
                      {
                        backgroundColor:
                          selectedTab === tab ? '#3580FF' : 'transparent',
                      },
                    ]}>
                    <Text
                      style={[
                        tw`text-center`,
                        {
                          color: selectedTab === tab ? '#FFFFFF' : '#8D99AE',
                          fontWeight: selectedTab === tab ? 'bold' : 'normal',
                        },
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
                tw`shadow-lg rounded-lg p-4 bottom-4`,
                {height: 145, backgroundColor: '#FFFFFF'},
              ]}>
              {/* last */}
              <Text
                style={[
                  tw`font-medium text-base mb-2 bottom-4`,
                  {color: '#2B2D42'},
                ]}>
                {getLastPeriodText()}
              </Text>
              <View style={tw`flex-row items-center justify-between`}>
                <CircularProgress
                  percentage={statsData.successScore}
                  radius={40}
                  backgroundColor="#DEEAFF"
                  progressColor="#3580FF"
                  textColor="#2B2D42"
                />
                <View style={tw`ml-4 bottom-2`}>
                  <Text
                    style={[
                      tw`font-medium`,
                      {
                        fontSize: 14,
                        lineHeight: 20,
                        letterSpacing: 1,
                        color:"#2B2D42"
                      },
                    ]}>
                    Task{'\n'}Completed
                  </Text>
                  <Text style={[tw`text-xs`, {color: "#2B2D42"}]}>
                    {statsData.completed} of {statsData.totalTasks}
                  </Text>
                </View>
                <View style={tw`flex-1 left-2`}>
                  <Text
                    style={[
                      tw`font-normal text-center top-1`,
                      {
                        fontSize: 12,
                        color: "#2B2D42",
                      },
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
                        tw`font-medium`,
                        {
                          color: "#3580FF",
                          fontSize: 11,
                          letterSpacing: 1,
                        },
                      ]}>
                      Follow
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          {/* হ্যাবিট সামারি */}
          <View
            style={[
              tw`p-4 rounded-lg top-12`,
              {backgroundColor: "#FFFFFF"},
            ]}>
            <View style={tw`flex-row justify-between mb-6`}>
              <View>
                <Text
                  style={[
                    tw`font-medium`,
                    {
                      fontSize: 16,
                      letterSpacing: 1,
                      lineHeight: 20,
                      color:"#040415"
                    },
                  ]}>
                  Habits
                </Text>
                <Text
                  style={[
                    tw`font-normal`,
                    {
                      fontSize: 12,
                      letterSpacing: 0,
                      lineHeight: 20,
                      left: 1,
                      color: "#9B9BA1",
                    },
                  ]}>
                  Building Summary
                </Text>
              </View>
              <View>
                <Text
                  style={[
                    tw`text-xs font-normal`,
                    {
                      letterSpacing: 1,
                      color: "#8D99AE",
                    },
                  ]}>
                  More Details
                </Text>
              </View>
            </View>
            <View style={tw`flex-row flex-wrap justify-between`}>
              <View style={tw`items-center mb-2`}>
                <Text
                  style={[
                    tw`font-medium`,
                    {
                      fontSize: 9,
                      lineHeight: 16,
                      letterSpacing: 0.5,
                      color: "#9B9BA1",
                    },
                  ]}>
                  Habit Score
                </Text>
                <Text style={[tw`text-lg font-bold`,{color:"#8D99AE"}]}>
                  {statsData.successScore}%
                </Text>
              </View>

              <View style={tw`items-center mb-2`}>
                <Text
                  style={[
                    tw`font-medium`,
                    {
                      fontSize: 9,
                      lineHeight: 16,
                      letterSpacing: 1,
                      color: "#9B9BA1"
                    },
                  ]}>
                  COMPLETED
                </Text>
                <Text
                  style={[
                    tw`text-lg font-bold`,
                     {color: "#3580FF"},
                  ]}>
                  {statsData.completed}
                </Text>
              </View>

              <View style={tw`items-center mb-2`}>
                <Text
                  style={[
                    tw`font-medium`,
                    {
                      fontSize: 9,
                      lineHeight: 16,
                      letterSpacing: 1,
                      color: "#9B9BA1"
                    },
                  ]}>
                  FAILED
                </Text>
                <Text style={[tw`text-lg font-bold`,{color:"#000000"}]}>
                  {statsData.totalTasks - statsData.completed}
                </Text>
              </View>

              <View style={tw`items-center mb-2`}>
                <Text
                  style={[
                    tw`font-medium`,
                    {
                      fontSize: 8,
                      lineHeight: 16,
                      letterSpacing: 0.5,
                      color: "#9B9BA1"
                    },
                  ]}>
                  BEST STREAK DAY
                </Text>
                <Text
                  style={[
                    tw`text-lg font-bold`,
                    {color: "#3580FF"},
                  ]}>
                  {statsData.bestStreak}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Fixed Bottom Navigation */}
        <View style={tw`absolute bottom-0 w-full`}>
          {!isKeyboardVisible && <BottomNavigation />}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default MyStatisticsScreen;
