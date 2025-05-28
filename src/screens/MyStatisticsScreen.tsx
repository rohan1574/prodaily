import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, ScrollView, AppState} from 'react-native';
import {s as tw} from 'react-native-wind';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import Svg, {Circle, Text as SvgText} from 'react-native-svg';
import BottomNavigation from './BottomNavigation';
// Navigation টাইপ ডেফিনিশন
type RootStackParamList = {
  TodaysTaskToDoScreen: undefined;
  MyCalenderFutureTaskScreen: undefined;
  MyStatisticsScreen: undefined;
  ProfileManageScreen: undefined;
  AddDailyTaskScreen: undefined;
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

        {/* Number */}
        <SvgText
          x={radius}
          y={radius - 5} // উপরে রাখতে
          textAnchor="middle"
          fontSize="24"
          fontWeight="bold"
          fill="black">
          {percentage}
        </SvgText>

        {/* % Symbol নিচে */}
        <SvgText
          x={radius}
          y={radius + 15} // নিচে রাখতে
          textAnchor="middle"
          fontSize="14"
          fontWeight="normal"
          fill="gray">
          %
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
      <ScrollView contentContainerStyle={tw`p-4 pb-20`}>
        {/* হেডার সেকশন */}
        <Text style={tw`text-xl font-bold text-black`}>My Statistics</Text>
        <Text style={[tw`text-gray-500 mb-4`, {color: '#8D99AE'}]}>
          Your task progress and habit report
        </Text>

        {/* টপ স্ট্যাটিস্টিক্স */}
        <View style={tw`flex-row justify-between h-32`}>
          <View
            style={[
              tw`bg-blue-500 p-4 rounded-lg w-44`,
              {width: 164, height: 109},
            ]}>
            <Text style={[tw`left-3 font-normal text-xs`, {color: '#DEEAFF'}]}>
              All Time Completed
            </Text>
            <Text style={tw`text-white text-2xl font-bold left-12 top-6`}>
              {statsData.allTimeCompleted}
            </Text>
          </View>
          <View
            style={[
              tw`bg-blue-500 p-4 rounded-lg w-44`,
              {width: 164, height: 109},
            ]}>
            <Text style={[tw`left-3 font-normal text-xs`, {color: '#DEEAFF'}]}>
              Daily Task Into Habit
            </Text>
            <Text style={tw`text-white text-2xl font-bold left-8 top-6`}>
              {statsData.dailyHabit}
            </Text>
          </View>
        </View>

        {/* প্রোগ্রেস সার্কেল */}
        <View style={tw`items-center h-44 rounded-lg bg-white `}>
          <Text style={tw`mb-4 my-4 font-medium text-sm`}>Overall Score</Text>
          <CircularProgress percentage={statsData.successScore} />
        </View>
        <View style={tw`bg-white h-24 rounded-lg my-4`}>
          <View
            style={tw`flex-row bg-gray-200 mx-2 rounded-full shadow-sm top-6`}>
            {['Weekly', 'Monthly', 'Yearly'].map(tab => (
              <TouchableOpacity
                key={tab}
                onPress={() => setSelectedTab(tab)}
                style={tw`flex-1 p-3 rounded-full ${
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
        <View style={tw`bg-white shadow-lg rounded-lg p-4 mb-4`}>
          <Text style={tw`text-black font-medium text-base mb-2 bottom-2`}>
            Last
          </Text>
          <View style={tw`flex-row items-center justify-between`}>
            <CircularProgress percentage={statsData.successScore} radius={40} />
            <View style={tw`ml-4`}>
              <Text style={tw`text-gray-800 font-medium text-sm`}>
                Task{'\n'} Completed
              </Text>
              <Text style={tw`text-gray-500 left-1 text-xs`}>
                {statsData.completed} of {statsData.totalTasks}
              </Text>
            </View>
            <View style={tw`flex-1 ml-4`}>
              <Text
                style={[
                  tw`text-gray-600 font-normal text-center mb-2`,
                  {fontSize: 12},
                ]}>
                {statsData.successScore > 70
                  ? "You're doing great! 🚀 Keep it up!"
                  : 'You improve a lot, To keep it up; Stay focus. Follow ExpandTimes '}
              </Text>
              <TouchableOpacity
                style={tw`bg-blue-100 p-3 rounded-xl mx-4 mt-2 items-center`}>
                <Text style={tw`text-blue-500 font-medium font-xs `}>
                  Follow
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* হ্যাবিট সামারি */}
        <View style={tw`p-4 bg-gray-100 rounded-lg`}>
          <View style={tw`flex-row justify-between mb-6`}>
            <View>
              <Text style={tw`text-black text-base font-medium `}>Habits</Text>
              <Text style={tw`text-gray-400 right-1 font-normal`}> Summary</Text>
            </View>
            <View>
              <Text style={tw`text-gray-400 text-xs font-medium`}>More Details</Text>
            </View>
          </View>
          <View style={tw`flex-row justify-between flex-wrap`}>
            <View style={tw`w-1/4 items-center`}>
              <Text style={[tw`text-gray-500 font-medium`,{fontSize:10}]}>Success Score</Text>
              <Text style={tw`text-gray-600 text-lg font-bold`}>
                {statsData.successScore}%
              </Text>
            </View>
            <View style={tw`w-1/4 items-center`}>
              <Text style={[tw`text-gray-500 font-medium`,{fontSize:10}]}>Completed</Text>
              <Text style={tw`text-blue-400 text-lg font-bold`}>
                {statsData.completed}
              </Text>
            </View>
            <View style={tw`w-1/4 items-center`}>
              <Text style={[tw`text-gray-500 font-medium`,{fontSize:10}]}>Failed</Text>
              <Text style={tw`text-black text-lg font-bold`}>
                {statsData.totalTasks - statsData.completed}
              </Text>
            </View>
            <View style={tw`w-1/4 items-center`}>
              <Text style={[tw`text-gray-500 font-medium`,{fontSize:10}]}>
                Best Streak
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
