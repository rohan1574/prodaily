import React from 'react';
import { View, Text, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { s as tw } from 'react-native-wind';

const DailyDoneCongratsScreen = () => {
  return (
    <SafeAreaView style={tw`flex-1 bg-blue-500 items-center justify-center`}>
      {/* Back Button */}
      <TouchableOpacity style={tw`absolute top-4 left-4`}>
        <Icon name="chevron-back" size={24} color="white" />
      </TouchableOpacity>

      {/* Badge and Glow */}
      <View style={tw`items-center justify-center mb-8`}>
        <View style={tw`w-32 h-32 rounded-full bg-yellow-400 items-center justify-center shadow-lg`}>
          <Text style={tw`text-3xl font-bold text-white`}>10</Text>
        </View>
      </View>

      {/* Congrats Text */}
      <Text style={tw`text-white text-2xl font-bold mb-2`}>Congrats!</Text>
      <Text style={tw`text-white text-base mb-4`}>All the Daily Task Done!</Text>

      {/* Description */}
      <Text style={tw`text-center text-white text-xs px-8 mb-10`}>
        You deserve this badge for your commitment to yourself. Stay with us and earn more Points to get rewards.
      </Text>

      {/* Claim Button */}
      <TouchableOpacity style={tw`bg-white rounded-full px-8 py-3`}>
        <Text style={tw`text-blue-500 font-semibold`}>Claim</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default DailyDoneCongratsScreen;
