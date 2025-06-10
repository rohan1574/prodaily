import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { s as tw } from 'react-native-wind';
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";

const { width, height } = Dimensions.get('window');
type NavigationProp = NativeStackNavigationProp<RootStackParamList, "OnboardingScreenOne">;

const OnboardingScreenOne = () => {
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
     navigation.replace("OnboardingScreenTwo");
   };
 
  const handleNext = () => {
    setStep((prev) => (prev + 1) % 2); // toggle between 0 and 1
  };

  const handleBack = () => {
    setStep((prev) => (prev - 1 + 2) % 2); // toggle between 0 and 1
  };

  const clipboardIcons = ['clipboard-outline', 'clipboard-sharp'];
  const texts = [
    "...start every day with clarity, purpose, and\nan organized custom schedule.",
    "...start every day with clarity. I am Rony Hossen, a developer,\nand an organized custom schedule."
  ];

  return (
    <View style={tw`flex-1 bg-blue-500 justify-between relative`}>

      {/* Top right circle */}
      <View style={[
        tw`absolute bg-blue-400 opacity-40`,
        {
          width: 300,
          height: 300,
          borderRadius: 175,
          top: -40,
          right:200
        }
      ]} />

      {/* Middle left circle */}
      <View style={[
        tw`absolute bg-blue-400 opacity-30`,
        {
          width: 180,
          height: 180,
          borderRadius: 90,
          top: height * 0.4,
          left: 228,
        }
      ]} />

      {/* Top Text */}
      <View style={tw`px-6 pt-12`}>
        <Text style={tw`text-white text-xl font-bold`}>Unlock!</Text>
        <Text style={tw`text-white text-sm italic mt-1`}>
          Your Potential Productivity: <Text style={tw`font-normal`}>By the Power of Routine Journaling</Text>
        </Text>
      </View>

      {/* Icon with arrows and dynamic clipboard */}
      <View style={tw`flex-row justify-center items-center`}>
        <TouchableOpacity onPress={handleBack}>
          <Icon name="chevron-back-outline" size={24} color="white" />
        </TouchableOpacity>

        <View style={tw`mx-6`}>
          <Icon name={clipboardIcons[step]} size={50} color="white" />
        </View>

        <TouchableOpacity onPress={handleNext}>
          <Icon name="chevron-forward-outline" size={24} color="white" />
        </TouchableOpacity>
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
            backgroundColor: 'red',
            left: -width / 2,
          },
        ]}
      />

      {/* Bottom Text */}
      <View style={tw`px-6 pb-24 z-10`}>
        <Text style={tw`text-white text-2xl font-bold mb-2`}>
          Imagine a life where you...
        </Text>
        <Text style={tw`text-white text-sm italic`}>
          {texts[step]}
        </Text>
      </View>

      {/* Next Button */}
      <TouchableOpacity style={tw`self-center pb-8 z-10`} onPress={handleNexts}>
        <Text style={tw`text-white text-base font-semibold`}>
          Next <Icon name="arrow-forward-outline" size={16} color="white" />
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default OnboardingScreenOne;
