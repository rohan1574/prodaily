import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation"; // তোমার টাইপ ফাইল

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "OnboardingScreenOne">;

const OnboardingScreenOne = () => {
  const navigation = useNavigation<NavigationProp>();

  // Auto navigate after 2 seconds
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     navigation.replace("OnboardingScreenTwo");
  //   }, 2000);

  //   return () => clearTimeout(timer);
  // }, []);

  // Navigate on button press
  const handleNext = () => {
    navigation.replace("OnboardingScreenTwo");
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#007AFF" }}>
      {/* Upper section */}
      <View style={{ marginTop: 92, marginBottom: 201, marginHorizontal: 36 }}>
        <Text style={{ color: "#FFFFFF", fontSize: 22, fontWeight: "bold", marginBottom: 8 }}>
          Build your routine!
        </Text>
        <Text style={{ color: "#DEEAFF", fontSize: 14 }}>
          Let's get started with a habit that sticks.
        </Text>
      </View>

      {/* Center image */}
      <View style={{ alignItems: "center", marginBottom: 40 }}>
        <Image
          source={{ uri: "https://your-image-url.com" }}
          resizeMode="stretch"
          style={{ width: 85, height: 85 }}
        />
      </View>

      {/* Lower section */}
      <View style={{ marginBottom: 67, marginHorizontal: 36 }}>
        <Text style={{ color: "#FFFFFF", fontSize: 28, fontWeight: "bold", marginBottom: 15 }}>
          Start small, grow daily
        </Text>
        <Text style={{ color: "#DEEAFF", fontSize: 14 }}>
          Track your routine and gradually build a life-changing habit.
        </Text>
      </View>

      {/* Next Button */}
      <TouchableOpacity
        onPress={handleNext}
        style={{ flexDirection: "row", alignItems: "center", marginLeft: 186, marginBottom: 58 }}
      >
        <Text style={{ color: "#DEEAFF", fontSize: 16, fontWeight: "bold", marginRight: 4 }}>
          Next
        </Text>
        <Image
          source={{ uri: "https://your-arrow-image-url.com" }}
          resizeMode="stretch"
          style={{ width: 24, height: 30 }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default OnboardingScreenOne;
