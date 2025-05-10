import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { s as tw } from 'react-native-wind';

export default function PremiumScreen() {
  return (
    <ScrollView style={tw`flex-1 bg-white`}>
      <View style={tw`items-center `}>
        {/* Top Image Section */}
        <Image
          source={require('./assets/images/su.jpg')}
          style={tw`w-full h-80 rounded-b-3xl`}
          resizeMode="cover"
        />
        <Text style={tw`absolute top-32 text-4xl font-bold text-white`}>Unlock!</Text>
      </View>

      {/* Features List */}
      <View style={tw`mt-4 mx-6 p-4 bg-white rounded-xl shadow`}>
        <Text style={tw`text-center text-blue-500 font-semibold text-base mb-2`}>
          Premium Features
        </Text>
        <Text style={tw`text-center text-gray-700`}>Add custom category</Text>
        <Text style={tw`text-center text-gray-700`}>Add custom task</Text>
        <Text style={tw`text-center text-gray-700`}>Change color Scheme</Text>
        <Text style={tw`text-center text-gray-700`}>Rename task</Text>
        <Text style={tw`text-center text-gray-700`}>Fill today widget</Text>
      </View>

      {/* Pricing Options */}
      <View style={tw`flex-row justify-around mt-6 mx-4`}>
        <View style={tw`items-center p-4 rounded-xl bg-gray-100`}>
          <Text style={tw`font-bold`}>Monthly</Text>
          <Text>$1</Text>
          <Text style={tw`text-xs text-gray-500`}>Billed monthly</Text>
        </View>
        <View style={tw`items-center p-4 rounded-xl bg-gray-100`}>
          <Text style={tw`font-bold`}>Yearly</Text>
          <Text>$10</Text>
          <Text style={tw`text-xs text-gray-500`}>Billed yearly</Text>
        </View>
        <View style={tw`items-center p-4 rounded-xl bg-blue-500`}>
          <Text style={tw`text-white font-bold`}>Lifetime</Text>
          <Text style={tw`text-white`}>$20</Text>
          <Text style={tw`text-xs text-white`}>Billed once</Text>
          <Text style={tw`text-xs text-white mt-1`}>Best Deal</Text>
        </View>
      </View>

      {/* Continue Button */}
      <TouchableOpacity style={tw`mx-8 mt-6 bg-blue-600 py-3 rounded-full`}>
        <Text style={tw`text-center text-white text-lg font-semibold`}>Continue</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
