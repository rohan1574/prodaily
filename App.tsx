import React, {useState} from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {s as tw} from 'react-native-wind';
import Svg, {Circle, Text as SvgText} from 'react-native-svg';

const CircularProgress = ({percentage = 0, radius = 50, strokeWidth = 6}) => {
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
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          transform={`rotate(-90, ${radius}, ${radius})`} // Corrected rotation
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
  const [selectedTab, setSelectedTab] = useState('Monthly');

  return (
    <View style={tw`flex-1 bg-white`}>
      <ScrollView contentContainerStyle={tw`p-4`}>
        <Text style={tw`text-lg font-bold text-gray-800`}>My Statistics</Text>
        <Text style={tw`text-gray-500 mb-4`}>
          Your task progress and habit report
        </Text>

        {/* Top Statistics */}
        <View style={tw`flex-row justify-between mb-4`}>
          <View style={tw`bg-blue-500 p-4 rounded-lg w-1/2 mr-2`}>
            <Text style={tw`text-white text-sm`}>All Time Completed</Text>
            <Text style={tw`text-white text-2xl font-bold`}>17235</Text>
          </View>
          <View style={tw`bg-blue-500 p-4 rounded-lg w-1/2 ml-2`}>
            <Text style={tw`text-white text-sm`}>Daily Task Into Habit</Text>
            <Text style={tw`text-white text-2xl font-bold`}>16/23</Text>
          </View>
        </View>

        {/* Progress Circle */}
        <View style={tw`items-center mt-6`}>
          <CircularProgress percentage={87} />
        </View>

        {/* Time Period Selection */}
        <View style={tw`flex-row justify-between bg-gray-100 p-2 rounded-lg mb-4 mt-8`}>
          {['Weekly', 'Monthly', 'Yearly'].map(tab => (
            <TouchableOpacity
              key={tab}
              onPress={() => setSelectedTab(tab)}
              style={[
                tw`px-4 py-2 rounded-lg`,
                selectedTab === tab ? tw`bg-blue-500` : tw`bg-gray-200`,
              ]}>
              <Text
                style={
                  selectedTab === tab
                    ? tw`text-white font-bold`
                    : tw`text-gray-500`
                }>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Last Month Section */}
        <View style={tw`bg-white shadow-lg rounded-lg `}>
          <Text style={tw`text-gray-800 font-bold text-lg mb-2`}>Last Month</Text>
          <View style={tw`flex-row items-center justify-between`}>
            {/* Left: Circular Progress */}
            <CircularProgress percentage={60} />

            {/* Middle: Task Completed */}
            <View style={tw`ml-4`}>
              <Text style={tw`text-gray-800 font-bold text-sm`}>Task Completed</Text>
              <Text style={tw`text-gray-500 text-xs`}>418 of 610</Text>
            </View>

            {/* Right: Improvement Text & Button */}
            <View style={tw`flex-1 ml-4`}>
              <Text style={tw`text-gray-600 text-xs mb-2`}>
                You improved a lot! Keep it up; Stay focused.
              </Text>
              <TouchableOpacity style={tw`bg-blue-100 px-4 py-2 rounded-lg`}>
                <Text style={tw`text-blue-500 font-bold`}>Follow</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Habits Summary */}
        <View style={tw`p-4 bg-gray-100 rounded-lg `}>
          <Text style={tw`text-gray-600 mb-2`}>Habits Summary</Text>
          <View style={tw`flex-row justify-between`}>
            <View>
              <Text style={tw`text-gray-800`}>Success Score</Text>
              <Text style={tw`text-blue-500 text-lg font-bold`}>91%</Text>
            </View>
            <View>
              <Text style={tw`text-gray-800`}>Completed</Text>
              <Text style={tw`text-blue-500 text-lg font-bold`}>244</Text>
            </View>
            <View>
              <Text style={tw`text-gray-800`}>Failed</Text>
              <Text style={tw`text-blue-500 text-lg font-bold`}>2</Text>
            </View>
            <View>
              <Text style={tw`text-gray-800`}>Best Streak Day</Text>
              <Text style={tw`text-blue-500 text-lg font-bold`}>22</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={tw`flex-row justify-between p-4 bg-white border-t`}>
        <TouchableOpacity>
          <Icon name="home-outline" size={28} color="gray" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name="bar-chart-outline" size={28} color="blue" />
        </TouchableOpacity>
        <TouchableOpacity style={tw`bg-blue-500 p-2 rounded-full`}>
          <Icon name="add" size={28} color="white" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name="calendar-outline" size={28} color="gray" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name="person-outline" size={28} color="gray" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MyStatisticsScreen;
