import React, {useEffect, useRef, useState} from 'react';
import {View, Text, TouchableOpacity, Dimensions, Image} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {s as tw} from 'react-native-wind';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types/navigation';

const {width, height} = Dimensions.get('window');
type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'OnboardingScreenTwo'
>;
type ClipboardIcon =
  | {type: 'image'; source: any}
  | {type: 'icon'; name: string};
const OnboardingScreenOne = () => {
  const [step, setStep] = useState(0); // 0 for text-1, 1 for text-2
  const navigation = useNavigation<NavigationProp>();
  const intervalRef = useRef<NodeJS.Timeout | null>(null); // Ref for interval

  const clipboardIcons: ClipboardIcon[] = [
    {type: 'image', source: require('../../assets/images/sun.png')},
    {type: 'image', source: require('../../assets/images/work.png')},
  ];

  const texts = [
    '...start every day with clarity, purpose, and\nan organized custom schedule.',
    '...start every day with clarity. I am Rony Hossen, a developer,\nand an organized custom schedule.',
  ];

  // Auto change step every 2 seconds
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setStep(prev => (prev + 1) % 2); // Toggle between steps
    }, 2000);

    // Clean up interval on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Handle manual navigation
  const handleNext = () => {
    // Reset interval when user interacts manually
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setStep(prev => (prev + 1) % 2);

    // Restart auto change after manual interaction
    intervalRef.current = setInterval(() => {
      setStep(prev => (prev + 1) % 2);
    }, 2000);
  };

  const handleBack = () => {
    // Reset interval when user interacts manually
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setStep(prev => (prev - 1 + 2) % 2);

    // Restart auto change after manual interaction
    intervalRef.current = setInterval(() => {
      setStep(prev => (prev + 1) % 2);
    }, 2000);
  };

  // Navigate to next screen
  const handleNexts = () => {
    // Clear interval before navigating away
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    navigation.replace('OnboardingScreenTwo');
  };

  return (
    <View style={tw`flex-1 bg-blue-500 justify-between relative`}>
      {/* Top right circle */}
      {/* <View
        style={[
          tw`absolute  opacity-40`,
          {
            width: 300,
            height: 300,
            borderRadius: 175,
            top: -40,
            right: 200,
            backgroundColor: '#00A6FF',
          },
        ]}
      /> */}

      {/* Middle left circle */}
      {/* <View
        style={[
          tw`absolute bg-blue-400 opacity-30`,
          {
            width: 180,
            height: 180,
            borderRadius: 90,
            top: height * 0.4,
            left: 250,
            backgroundColor: '#00A6FF',
          },
        ]}
      /> */}

      {/* Top Text */}
      <View style={tw`px-6 pt-12`}>
        <Text
          style={[
            tw`text-white text-xl font-bold`,
            {fontSize: 22, lineHeight: 18, letterSpacing: 1},
          ]}>
          Unlock!
        </Text>
        <Text
          style={[
            tw`text-white text-sm italic mt-1 font-semibold`,
            {fontSize: 16, lineHeight: 24, letterSpacing: 1},
          ]}>
          Your Productivity:{' '}
          <Text
            style={[
              tw`font-normal`,
              {fontSize: 14, lineHeight: 24, letterSpacing: 1},
            ]}>
            By the Power of Routine Journaling
          </Text>
        </Text>
      </View>

      {/* Icon with arrows and dynamic clipboard */}
      <View
        style={[
          tw`absolute left-0 right-0 items-center `,
          {top: height * 0.35},
        ]}>
        <View style={tw`flex-row items-center bottom-12`}>
          <TouchableOpacity style={tw`right-12`} onPress={handleBack}>
            <Icon name="caret-back-outline" size={24} color="white" />
          </TouchableOpacity>
          <View style={tw`mx-6`}>
            {clipboardIcons[step].type === 'icon' ? (
              <Icon name={clipboardIcons[step].name} size={50} color="white" />
            ) : (
              <Image
                source={clipboardIcons[step].source}
                style={{width: 96, height: 96}}
                resizeMode="contain"
              />
            )}
          </View>
          <TouchableOpacity style={tw`left-12`} onPress={handleNext}>
            <Icon name="caret-forward-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom semicircle background */}
      <View
        style={[
          tw`absolute bottom-0`,
          {
            width: width * 2,
            height: width,
            borderTopLeftRadius: width,
            borderTopRightRadius: width,
            backgroundColor: '#005EE280',
            left: -width / 2,
          },
        ]}
      />
      {/* Bottom Text fixed position */}
      <Text
        style={[
          tw`text-white text-2xl font-bold top-12 px-6`,
          {fontSize: 28, lineHeight: 42,width:343},
        ]}>
        Imagine a life where you...
      </Text>
      <View style={[tw`absolute bottom-48 px-6 w-full z-10`]}>
        <Text
          style={[
            tw`text-white font-normal italic`,
            {fontSize: 14, lineHeight: 20},
          ]}>
          {texts[step]}
        </Text>
      </View>

      {/* Next Button */}
      <TouchableOpacity
        style={tw`flex-row items-center self-center bottom-12 z-10`}
        onPress={handleNexts}>
        <Text style={tw`text-white text-base font-semibold `}>Next</Text>
        <Icon name="chevron-forward-outline" size={18} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default OnboardingScreenOne;
