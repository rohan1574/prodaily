import React from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { s as tw } from 'react-native-wind';

const { width } = Dimensions.get('window');

const RateUsGooglePlayPopUp = () => {
  return (
    <View style={[tw`bg-white rounded-xl py-6 shadow-md top-32`, { width: width * 0.9, alignSelf: 'center' }]}>
      {/* Header */}
      <View style={[tw`items-center bottom-6 rounded-xl`,{backgroundColor:"#E3E8F1",width:345,height:42}]}>
        <Text style={tw`text-lg text-center items-center top-2 font-semibold text-gray-800`}>Do you like ProDaily?</Text>
      </View>

      {/* Message */}
      <View style={tw`items-center mb-4 px-5`}>
        <Text style={tw`text-center text-sm text-gray-600 leading-relaxed`}>
          To make you productive and proactive, our developers working hard.
        </Text>
        <Text style={tw`text-center text-sm text-gray-600 mt-2 leading-relaxed`}>
          Your rating may inspire them to make the app even better.
        </Text>
      </View>

      {/* Stars */}
      <View style={tw`flex-row justify-center items-center mb-1`}>
        {Array.from({ length: 5 }).map((_, index) => (
          <Ionicons key={index} name="star" size={24} color="#007AFF" style={tw`mx-1`} />
        ))}
      </View>
      <Text style={tw`text-center text-sm text-gray-500 mb-4`}>Expecting 5/5</Text>

      {/* Button */}
      <TouchableOpacity style={[tw`bg-blue-500 py-2.5 px-6 rounded-full`, { alignSelf: 'center' }]}>
        <Text style={tw`text-white text-sm font-semibold`}>Rate on Google Play</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RateUsGooglePlayPopUp;
