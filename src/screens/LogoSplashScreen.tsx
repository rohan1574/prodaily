import React, { useEffect } from 'react';
import { View, Image, Text } from 'react-native';
import { s as tw } from 'react-native-wind';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation'; // ঠিক path দিবে

type LogoSplashScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'LogoSplashScreen'
>;

const LogoSplashScreen = () => {
  const navigation = useNavigation<LogoSplashScreenNavigationProp>();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('OnboardingScreenOne');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient
      colors={['#3580FF', '#2066DD']}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={tw`flex-1 justify-center items-center`}
    >
      <View
        style={[
          tw`rounded-full justify-center items-center`,
          {
            backgroundColor: '#3079F6',
            width: 148,
            height: 148,
            shadowColor: '#5B86CD',
            shadowOffset: { width: 1, height: 1 },
            shadowOpacity: 0.2,
            shadowRadius: 5,
            elevation: 5,
          },
        ]}
      >
        <Image
          source={require('../../assets/images/sun.png')}
          style={{ width: 54, height: 54 }}
          resizeMode="contain"
        />
        <Text
          style={[
            tw`text-white text-xl font-semibold mt-2`,
            { fontSize: 18, letterSpacing: 4 },
          ]}
        >
          ProDAILY
        </Text>
      </View>
    </LinearGradient>
  );
};

export default LogoSplashScreen;
