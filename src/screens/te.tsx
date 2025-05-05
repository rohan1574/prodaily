import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, ScrollView, AppState} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
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

type NavigationProp = StackNavigationProp<RootStackParamList, 'MyStatisticsScreen'>;

// CircularProgress কম্পোনেন্টের প্রপস টাইপ
type CircularProgressProps = {
  percentage?: number;
  radius?: number;
  strokeWidth?: number;
};

const CircularProgress = ({percentage = 0, radius = 50, strokeWidth = 6}: CircularProgressProps) => {
  const size = radius * 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (percentage / 100) * circumference;

  return (
    <View style={tw`flex items-center justify-center`}>
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
          stroke="blue"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${progress} ${circumference}`}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          transform={`rotate(-90, ${radius}, ${radius})`}
        />

        {/* Percentage Text */}
        <SvgText
          x={radius}
          y={radius}
          textAnchor="middle"
          dy="5"
          fontSize="20"
          fontWeight="bold"
          fill="black">
          {percentage}%
        </SvgText>
      </Svg>
    </View>
  );
};

const MyStatisticsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [selectedTab, setSelectedTab] = useState('Monthly');
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
        successScore: totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0,
        completed: completedTasks.length,
        totalTasks: totalTasks,
        bestStreak: 22
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
    <View style={tw`flex-1 bg-white`}>
      <ScrollView contentContainerStyle={tw`p-4`}>
        {/* হেডার সেকশন */}
        <Text style={tw`text-lg font-bold text-gray-800`}>My Statistics</Text>
        <Text style={tw`text-gray-500 mb-4`}>Your task progress and habit report</Text>
  
        {/* টপ স্ট্যাটিস্টিক্স */}
        <View style={tw`flex-row justify-between mb-4`}>
          <View style={tw`bg-blue-500 p-4 rounded-lg w-1/2 mr-2`}>
            <Text style={tw`text-white text-sm`}>All Time Completed</Text>
            <Text style={tw`text-white text-2xl font-bold`}>{statsData.allTimeCompleted}</Text>
          </View>
          <View style={tw`bg-blue-500 p-4 rounded-lg w-1/2 ml-2`}>
            <Text style={tw`text-white text-sm`}>Daily Task Into Habit</Text>
            <Text style={tw`text-white text-2xl font-bold`}>{statsData.dailyHabit}</Text>
          </View>
        </View>
  
        {/* প্রোগ্রেস সার্কেল */}
        <View style={tw`items-center mt-6`}>
          <CircularProgress percentage={statsData.successScore} />
        </View>
  
        {/* টাইম পিরিয়ড সিলেকশন */}
        <View style={tw`flex-row justify-between bg-gray-100 p-2 rounded-lg mb-4 mt-8`}>
          {['Weekly', 'Monthly', 'Yearly'].map(tab => (
            <TouchableOpacity
              key={tab}
              onPress={() => setSelectedTab(tab)}
              style={[
                tw`px-4 py-2 rounded-lg`,
                selectedTab === tab ? tw`bg-blue-500` : tw`bg-gray-200`,
              ]}>
              <Text style={selectedTab === tab ? tw`text-white font-bold` : tw`text-gray-500`}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
  
        {/* কারেন্ট প্রোগ্রেস সেকশন */}
        <View style={tw`bg-white shadow-lg rounded-lg p-4 mb-4`}>
          <Text style={tw`text-gray-800 font-bold text-lg mb-2`}>Current Progress</Text>
          <View style={tw`flex-row items-center justify-between`}>
            <CircularProgress percentage={statsData.successScore} radius={40} />
            <View style={tw`ml-4`}>
              <Text style={tw`text-gray-800 font-bold text-sm`}>Task Completed</Text>
              <Text style={tw`text-gray-500 text-xs`}>
                {statsData.completed} of {statsData.totalTasks}
              </Text>
            </View>
            <View style={tw`flex-1 ml-4`}>
              <Text style={tw`text-gray-600 text-xs mb-2`}>
                {statsData.successScore > 70 
                  ? "You're doing great! 🚀 Keep it up!" 
                  : "Stay focused! 💪 You can do better!"}
              </Text>
            </View>
          </View>
        </View>
  
        {/* হ্যাবিট সামারি */}
        <View style={tw`p-4 bg-gray-100 rounded-lg`}>
          <Text style={tw`text-gray-600 mb-2`}>Habits Summary</Text>
          <View style={tw`flex-row justify-between flex-wrap`}>
            <View style={tw`w-1/2 mb-4`}>
              <Text style={tw`text-gray-800`}>Success Score</Text>
              <Text style={tw`text-blue-500 text-lg font-bold`}>{statsData.successScore}%</Text>
            </View>
            <View style={tw`w-1/2 mb-4`}>
              <Text style={tw`text-gray-800`}>Completed</Text>
              <Text style={tw`text-blue-500 text-lg font-bold`}>{statsData.completed}</Text>
            </View>
            <View style={tw`w-1/2`}>
              <Text style={tw`text-gray-800`}>Failed</Text>
              <Text style={tw`text-blue-500 text-lg font-bold`}>
                {statsData.totalTasks - statsData.completed}
              </Text>
            </View>
            <View style={tw`w-1/2`}>
              <Text style={tw`text-gray-800`}>Best Streak Day</Text>
              <Text style={tw`text-blue-500 text-lg font-bold`}>{statsData.bestStreak}</Text>
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