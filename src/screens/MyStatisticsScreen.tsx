import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, ScrollView, AppState} from 'react-native';
import {s as tw} from 'react-native-wind';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';
import Svg, {Circle, Text as SvgText, Path} from 'react-native-svg';
import BottomNavigation from './BottomNavigation';

// Enhanced CircularProgress Component
const CircularProgress = ({
  percentage = 0,
  radius = 60,
  strokeWidth = 10,
  showText = true,
  color = 'blue',
}: {
  percentage?: number;
  radius?: number;
  strokeWidth?: number;
  showText?: boolean;
  color?: string;
}) => {
  const size = radius * 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (percentage / 100) * circumference;
  const bgColor = {
    blue: '#EFF6FF',
    green: '#ECFDF5',
    purple: '#F5F3FF',
  }[color];
  const strokeColor = {
    blue: '#3B82F6',
    green: '#10B981',
    purple: '#8B5CF6',
  }[color];

  return (
    <View style={tw`flex items-center justify-center`}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background Circle */}
        <Circle
          cx={radius}
          cy={radius}
          r={radius - strokeWidth / 2}
          stroke={bgColor}
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Progress Circle */}
        <Circle
          cx={radius}
          cy={radius}
          r={radius - strokeWidth / 2}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${progress} ${circumference}`}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          transform={`rotate(-90, ${radius}, ${radius})`}
        />

        {/* Percentage Text */}
        {showText && (
          <SvgText
            x={radius}
            y={radius}
            textAnchor="middle"
            dy="5"
            fontSize="20"
            fontWeight="bold"
            fill="#1F2937">
            {percentage}%
          </SvgText>
        )}
      </Svg>
    </View>
  );
};

const MyStatisticsScreen = () => {
  const [selectedTab, setSelectedTab] = useState('Monthly');
  const [statsData, setStatsData] = useState({
    allTimeCompleted: 0,
    dailyHabit: '0/0',
    successScore: 0,
    completed: 0,
    totalTasks: 0,
    bestStreak: 0,
    weeklyProgress: [40, 60, 75, 80, 90, 65, 85],
  });

  const isFocused = useIsFocused();

  const fetchStats = async () => {
    try {
      const tasksJSON = await AsyncStorage.getItem('tasks');
      const tasks = tasksJSON ? JSON.parse(tasksJSON) : [];
      const completedTasks = tasks.filter((task: any) => task.completed);
      const totalTasks = tasks.length;
      const score =
        totalTasks > 0
          ? Math.round((completedTasks.length / totalTasks) * 100)
          : 0;

      setStatsData({
        allTimeCompleted: completedTasks.length,
        dailyHabit: `${completedTasks.length}/${totalTasks}`,
        successScore: score,
        completed: completedTasks.length,
        totalTasks: totalTasks,
        bestStreak: 22,
        weeklyProgress: [40, 60, 75, 80, 90, 65, score],
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
    <View style={tw`flex-1 bg-gray-50`}>
      <ScrollView contentContainerStyle={tw`p-5`}>
        {/* Header Section */}
        <View style={tw`mb-6`}>
          <Text style={tw`text-2xl font-bold text-gray-900`}>
            My Statistics
          </Text>
          <Text style={tw`text-gray-500`}>Track your productivity journey</Text>
        </View>

        {/* Success Score Card */}
        <View style={tw`bg-white rounded-2xl p-6 shadow-sm mb-6`}>
          <View style={tw`flex-row justify-between items-center mb-4`}>
            <View>
              <Text style={tw`text-gray-500 text-sm`}>Success Score</Text>
              <Text style={tw`text-3xl font-bold text-gray-900`}>
                {statsData.successScore}%
              </Text>
            </View>
            <CircularProgress
              percentage={statsData.successScore}
              radius={40}
              strokeWidth={8}
              showText={false}
            />
          </View>
          <View style={tw`flex-row justify-between`}>
            <View>
              <Text style={tw`text-gray-500 text-sm`}>Completed</Text>
              <Text style={tw`text-lg font-bold text-green-600`}>
                {statsData.completed}
              </Text>
            </View>
            <View>
              <Text style={tw`text-gray-500 text-sm`}>Total Tasks</Text>
              <Text style={tw`text-lg font-bold text-gray-900`}>
                {statsData.totalTasks}
              </Text>
            </View>
            <View>
              <Text style={tw`text-gray-500 text-sm`}>Best Streak</Text>
              <Text style={tw`text-lg font-bold text-purple-600`}>
                {statsData.bestStreak} days
              </Text>
            </View>
          </View>
        </View>

        {/* Time Period Selection */}
        <View style={tw`flex-row bg-gray-100 p-1 rounded-xl mb-6`}>
          {['Weekly', 'Monthly', 'Yearly'].map(tab => (
            <TouchableOpacity
              key={tab}
              onPress={() => setSelectedTab(tab)}
              style={[
                tw`flex-1 items-center py-2 rounded-lg`,
                selectedTab === tab ? tw`bg-white shadow-sm` : tw``,
              ]}>
              <Text
                style={[
                  tw`font-medium`,
                  selectedTab === tab ? tw`text-blue-600` : tw`text-gray-500`,
                ]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Weekly Progress Graph */}
        <View style={tw`bg-white rounded-2xl p-5 shadow-sm mb-6`}>
          <View style={tw`flex-row justify-between items-center mb-4`}>
            <Text style={tw`text-lg font-bold text-gray-900`}>
              Weekly Progress
            </Text>
            <TouchableOpacity style={tw`flex-row items-center`}>
              <Text style={tw`text-blue-500 mr-2`}>Details</Text>
              <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <Path
                  d="M9 18L15 12L9 6"
                  stroke="#3B82F6"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </TouchableOpacity>
          </View>

          {/* Interactive Progress Bars */}
          <View style={tw`flex-row justify-between items-end h-40 mb-4`}>
            {statsData.weeklyProgress.map((value, index) => (
              <TouchableOpacity
                key={index}
                style={tw`items-center flex-1 mx-1`}
                activeOpacity={0.7}>
                <View style={tw`relative`}>
                  <View
                    style={[
                      tw`w-8 rounded-t-lg bg-blue-100 absolute bottom-0`,
                      {height: `${100 - value}%`},
                    ]}
                  />
                  <View
                    style={[
                      tw`w-8 rounded-t-lg bg-blue-500`,
                      {height: `${value}%`},
                      value === Math.max(...statsData.weeklyProgress) &&
                        tw`bg-green-500`,
                    ]}
                  />
                </View>
                <Text style={tw`text-xs text-gray-500 mt-2 font-medium`}>
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][index]}
                </Text>
                <Text style={tw`text-xs text-gray-400 mt-1`}>{value}%</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Performance Summary */}
          <View style={tw`flex-row justify-between bg-blue-50 p-3 rounded-lg`}>
            <View style={tw`items-center`}>
              <Text style={tw`text-xs text-gray-500`}>Highest Day</Text>
              <Text style={tw`text-green-600 font-bold`}>
                {
                  ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][
                    statsData.weeklyProgress.indexOf(
                      Math.max(...statsData.weeklyProgress),
                    )
                  ]
                }
              </Text>
            </View>
            <View style={tw`items-center`}>
              <Text style={tw`text-xs text-gray-500`}>Average</Text>
              <Text style={tw`text-blue-600 font-bold`}>
                {`${Math.round(
                  statsData.weeklyProgress.reduce((a, b) => a + b, 0) / 7,
                )}%`}
              </Text>
            </View>
            <View style={tw`items-center`}>
              <Text style={tw`text-xs text-gray-500`}>Total Tasks</Text>
              <Text style={tw`text-purple-600 font-bold`}>
                {statsData.totalTasks}
              </Text>
            </View>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={tw`flex-row flex-wrap justify-between mb-6`}>
          <View style={tw`w-[48%] bg-white p-4 rounded-xl shadow-sm mb-4`}>
            <View style={tw`flex-row items-center mb-2`}>
              <View style={tw`w-2 h-2 bg-blue-500 rounded-full mr-2`} />
              <Text style={tw`text-gray-500`}>All Time Tasks</Text>
            </View>
            <Text style={tw`text-2xl font-bold text-gray-900`}>
              {statsData.allTimeCompleted}
            </Text>
          </View>

          <View style={tw`w-[48%] bg-white p-4 rounded-xl shadow-sm mb-4`}>
            <View style={tw`flex-row items-center mb-2`}>
              <View style={tw`w-2 h-2 bg-green-500 rounded-full mr-2`} />
              <Text style={tw`text-gray-500`}>Daily Habit</Text>
            </View>
            <Text style={tw`text-2xl font-bold text-gray-900`}>
              {statsData.dailyHabit}
            </Text>
          </View>

          <View style={tw`w-[48%] bg-white p-4 rounded-xl shadow-sm`}>
            <View style={tw`flex-row items-center mb-2`}>
              <View style={tw`w-2 h-2 bg-purple-500 rounded-full mr-2`} />
              <Text style={tw`text-gray-500`}>Completion Rate</Text>
            </View>
            <CircularProgress
              percentage={statsData.successScore}
              radius={30}
              strokeWidth={6}
              showText={false}
              color="purple"
            />
          </View>

          <View style={tw`w-[48%] bg-white p-4 rounded-xl shadow-sm`}>
            <View style={tw`flex-row items-center mb-2`}>
              <View style={tw`w-2 h-2 bg-yellow-500 rounded-full mr-2`} />
              <Text style={tw`text-gray-500`}>Best Streak</Text>
            </View>
            <Text style={tw`text-2xl font-bold text-gray-900`}>
              {statsData.bestStreak} days
            </Text>
          </View>
        </View>

        {/* Motivational Section */}
        <View style={tw`bg-blue-500 p-5 rounded-2xl`}>
          <Text style={tw`text-white text-lg font-bold mb-2`}>
            {statsData.successScore > 70
              ? 'Amazing Progress! 🎉'
              : 'Keep Going! 💪'}
          </Text>
          <Text style={tw`text-blue-100`}>
            {statsData.successScore > 70
              ? 'You are doing better than 80% of users. Maintain this momentum!'
              : 'Consistency is key. Try to complete at least one more task today.'}
          </Text>
        </View>
      </ScrollView>

      <BottomNavigation />
    </View>
  );
};

export default MyStatisticsScreen;
