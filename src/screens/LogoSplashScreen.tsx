import React from 'react';
import {View, Image, Text} from 'react-native';
import {s as tw} from 'react-native-wind';
import LinearGradient from 'react-native-linear-gradient';

const LogoSplashScreen = () => {
  return (
    <LinearGradient
      colors={['#3580FF', '#2066DD']}
      start={{x: 0.5, y: 0}}
      end={{x: 0.5, y: 1}}
      style={tw`flex-1 justify-center items-center`}>
      <View
        style={[
          tw`rounded-full justify-center items-center`,
          {
            backgroundColor: '#3079F6',
            width: 148,
            height: 148,
            shadowColor: '#5B86CD',
            shadowOffset: {width: 1, height: 1},
            shadowOpacity: 0.2, // 10% opacity
            shadowRadius: 5,
            elevation: 5,
          },
        ]}>
        <Image
          source={require('./assets/images/sun.png')}
          style={[tw``, {width: 54, height: 54}]}
          resizeMode="contain"
        />
        <Text
          style={[
            tw`text-white text-xl font-semibold mt-2`,
            {fontSize: 18, letterSpacing: 4},
          ]}>
          ProDAILY
        </Text>
      </View>
    </LinearGradient>
  );
};

export default LogoSplashScreen;
