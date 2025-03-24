import { s as tw } from 'react-native-wind';
import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';

const CircularProgress = ({ percentage = 80, radius = 50, strokeWidth = 6 }) => {
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
          rotation="-90"
          origin={`${radius}, ${radius}`}
        />

        {/* Percentage Text */}
        <SvgText
          x={radius}
          y={radius}
          textAnchor="middle"
          dy="5"
          fontSize="20"
          fontWeight="bold"
          fill="black"
        >
          {percentage}%
        </SvgText>
      </Svg>
    </View>
  );
};

export default CircularProgress;
