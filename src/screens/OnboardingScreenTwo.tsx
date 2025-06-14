import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Dimensions, Image} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {s as tw} from 'react-native-wind';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types/navigation';
import LinearGradient from 'react-native-linear-gradient';

const {width, height} = Dimensions.get('window');
type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'OnboardingScreenTwo'
>;
type ClipboardIcon =
  | {type: 'image'; source: any}
  | {type: 'icon'; name: string};
const OnboardingScreenTwo = () => {
  const [step, setStep] = useState(0); // 0 for text-1, 1 for text-2
  const navigation = useNavigation<NavigationProp>();

  // Auto navigate after 2 seconds
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     navigation.replace("OnboardingScreenTwo");
  //   }, 2000);

  //   return () => clearTimeout(timer);
  // }, []);

  // Navigate on button press
  const handleNexts = () => {
    navigation.replace('TodaysTaskToDoScreen');
  };

  const handleNext = () => {
    setStep(prev => (prev + 1) % 2); // toggle between 0 and 1
  };

  const handleBack = () => {
    setStep(prev => (prev - 1 + 2) % 2); // toggle between 0 and 1
  };

  const clipboardIcons: ClipboardIcon[] = [
    {type: 'image', source: require('../../assets/images/onboarding/dependability.png')},
  ];

  const texts = [
    '...Keep doing journaling routine. you’ll see the life changing effects in a few weeks',
  ];

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
      <View style={tw`px-9 pt-12`}>
        <Text
          style={[
            tw`text-white text-xl font-bold `,
            {fontSize: 22, lineHeight: 18, letterSpacing: 1, height: 28},
          ]}>
          Keep consistency!{' '}
        </Text>
        <Text
          style={[
            tw`text-white text-sm italic  font-semibold`,
            {fontSize: 16, lineHeight: 24, letterSpacing: 1},
          ]}>
          <Text
            style={[
              tw`font-normal`,
              {fontSize: 14, lineHeight: 24, letterSpacing: 1},
            ]}>
            Be regular, Be honest with yourself.{' '}
          </Text>
        </Text>
      </View>

      {/* Icon with arrows and dynamic clipboard */}
      <View style={tw`flex-row justify-center items-center`}>
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
      </View>

      {/* Bottom semicircle background */}
      <LinearGradient
        colors={['rgba(0, 94, 226, 0.5)', 'rgba(39, 143, 255, 0)']}
        style={[
          tw`absolute bottom-0`,
          {
            width: width * 2,
            height: width,
            borderTopLeftRadius: width,
            borderTopRightRadius: width,
            left: -width / 2,
          },
        ]}
      />

      {/* Bottom Text */}
      <View style={tw`px-9  z-10`}>
        <Text
          style={[
            tw`text-white text-2xl font-bold mb-2`,
            {fontSize: 28, lineHeight: 42, letterSpacing: 1},
          ]}>
          Habit can't be built overnight
        </Text>
        <Text
          style={[
            tw`text-white font-normal italic`,
            {fontSize: 15, lineHeight: 20, letterSpacing: 1, color: '#DEEAFF'},
          ]}>
          {texts[step]}
        </Text>
      </View>

      {/* Next Button */}
      <TouchableOpacity
        style={tw`flex-row items-center self-center bottom-12 z-10`}
        onPress={handleNexts}>
        <Text style={[tw`text-base font-semibold mr-2`, {color: '#DEEAFF'}]}>
          Next
        </Text>
        <Icon
          name="chevron-forward-outline"
          size={20}
          color="#DEEAFF"
          style={{
            width: 7.4,
            height: 20,
            textAlign: 'center', // optional: aligns the icon in given width
            lineHeight: 20, // ensures vertical alignment
          }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default OnboardingScreenTwo;
