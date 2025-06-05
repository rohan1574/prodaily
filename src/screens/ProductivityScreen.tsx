import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Image,
} from 'react-native';
import {s as tw} from 'react-native-wind';

const ProductivityScreen = () => {
  return (
    <ImageBackground
      source={require('../prodaily/assets/images/sun.png')}
      style={tw`flex-1`}
      resizeMode="cover">
      <View style={tw`flex-1 justify-between p-6 bg-blue-500 bg-opacity-30`}>
        {/* Background decorative elements */}
        <Image
          source={require('./assets/images/upblurcircle.png')}
          style={[
            tw`absolute`,
            {width: 500, height: 500, left: -224, opacity: 0.5},
          ]}
        />
        <Image
          source={require('./assets/images/upblurcircle.png')}
          style={[
            tw`absolute`,
            {width: 500, height: 500, top: 100, left: 100, opacity: 0.25},
          ]}
        />
        <Image
          source={require('./assets/images/bottom.png')}
          style={[tw`absolute`, {width: 681, height: 545, left: -164, top:420}]}
        />
        
        {/* Content Container */}
        <View style={tw`flex-1 z-10 justify-between py-8`}>
          {/* Title Section */}
          <View style={tw`pt-10`}>
            <Text style={tw`text-4xl font-bold text-white text-center mb-2`}>
              Unlock!
            </Text>
            <Text style={tw`text-2xl font-bold text-white text-center`}>
              Your Potential Productivity: By the Power of Routine Journaling
            </Text>
          </View>

          {/* Description Section */}
          <View style={tw`items-center`}>
            <Text style={tw`text-xl text-white text-center mb-1`}>
              Imagine a life where you...
            </Text>
            <Text style={tw`text-xl text-white text-center font-semibold`}>
              ...start every day with clarity, purpose, and an organized custom schedule.
            </Text>
          </View>

          {/* Next Button */}
          <TouchableOpacity 
            style={tw`bg-white py-4 px-8 rounded-full self-end`}
            activeOpacity={0.8}>
            <Text style={tw`text-blue-500 font-bold text-lg`}>Next  </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

export default ProductivityScreen;