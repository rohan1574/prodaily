import React from 'react';
import {View, Text, TouchableOpacity, Image, ScrollView} from 'react-native';
import {s as tw} from 'react-native-wind';

export default function PremiumPackage() {
  return (
    <ScrollView style={tw`flex-1 bg-sky-50`}>
      <View style={tw`items-center `}>
        {/* Top Image Section */}
        <Image
          source={require('./assets/images/su.jpg')}
          style={tw`w-full h-80 rounded-b-3xl`}
          resizeMode="cover"
        />
        <Text style={tw`absolute top-32 text-4xl font-bold text-white`}>
          Unlock!
        </Text>
      </View>

      {/* Features List */}
      <View
        style={[
          tw`bg-white rounded-xl shadow`,
          {width: '294', height: '195', left: '45'},
        ]}>
        <Text
          style={tw`text-center bg-blue-500 text-white font-medium text-base mb-2 h-8 rounded-br-lg`}>
          Premium Features
        </Text>
        <View style={tw`top-4 left-16`}>
          <Text style={[tw`text-cente text-gray-700 font-normal`, {color: '#2B2D42',fontSize:16}]}>
            Add custom category
          </Text>
          <Text
            style={[tw`text-cente text-gray-700 font-normal`, {color: '#2B2D42',fontSize:16}]}>
            Add custom task
          </Text>
          <Text style={[tw`text-cente text-gray-700 font-normal`, {color: '#2B2D42',fontSize:16}]}>Change color Scheme</Text>
          <Text style={[tw`text-cente text-gray-700 font-normal`, {color: '#2B2D42',fontSize:16}]}>Rename task</Text>
          <Text style={[tw`text- text-gray-700 font-normal`, {color: '#2B2D42',fontSize:16}]}>Fill today widget</Text>
        </View>
      </View>

      {/* Pricing Options */}
      <View style={tw`flex-row justify-around mt-6 mx-4`}>
        <View style={tw`items-center p-4 rounded-xl bg-white `}>
          <Text style={tw`font-bold mb-4`}>Monthly</Text>
          <Text style={tw`font-bold text-gray-500`}>$1</Text>
          <Text style={tw`text-xs text-gray-500`}>Billed monthly</Text>
        </View>
        <View style={tw`items-center p-4 rounded-xl bg-white`}>
          <Text style={tw`font-bold mb-4`}>Yearly</Text>
          <Text style={tw`font-bold text-gray-500`}>$10</Text>
          <Text style={tw`text-xs text-gray-500`}>Billed yearly</Text>
        </View>
        <View style={tw`items-center p-4 rounded-xl bg-blue-500`}>
          <Text style={tw`text-black font-bold mb-4`}>Lifetime</Text>
          <Text style={tw`font-bold text-white`}>$20</Text>
          <Text style={tw`text-xs text-gray-400`}>Billed once</Text>
        </View>
      </View>

      {/* Continue Button */}
      <TouchableOpacity style={tw`mx-8 top-12 bg-blue-600 py-3 rounded-full`}>
        <Text style={tw`text-center text-white text-base font-normal`}>
          Continue
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
