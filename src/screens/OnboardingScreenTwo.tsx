import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { RootStackParamList } from "../types/navigation"; // তোমার টাইপ ফাইল
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "OnboardingScreenTwo">;
const OnboardingScreenTwo = () => {
   const navigation = useNavigation<NavigationProp>();
  
    // Auto navigate after 2 seconds
    // useEffect(() => {
    //   const timer = setTimeout(() => {
    //     navigation.replace("AddDailyTaskScreen");
    //   }, 2000);
  
    //   return () => clearTimeout(timer);
    // }, []);
  
    // Navigate on button press
    const handleNext = () => {
      navigation.replace("AddDailyTaskScreen");
    };
  return (
    <View style={{ flex: 1, backgroundColor: "#007AFF" }}>
      <View style={{ marginTop: 92, marginBottom: 201, marginHorizontal: 36 }}>
        <Text style={{ color: "#FFFFFF", fontSize: 22, fontWeight: "bold", marginBottom: 8 }}>
          Keep consistency!
        </Text>
        <Text style={{ color: "#DEEAFF", fontSize: 14 }}>
          Be regular. Be honest with yourself.
        </Text>
      </View>

      <View style={{ alignItems: "center", marginBottom: 40 }}>
        <Image
          source={{
            uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Imam9Ji2yK/k8j6n7s8_expires_30_days.png",
          }}
          resizeMode="stretch"
          style={{ width: 85, height: 85 }}
        />
      </View>

      <View style={{ marginBottom: 67, marginHorizontal: 36 }}>
        <Text style={{ color: "#FFFFFF", fontSize: 28, fontWeight: "bold", marginBottom: 15 }}>
          Habits aren't built overnight
        </Text>
        <Text style={{ color: "#DEEAFF", fontSize: 14 }}>
          Keep doing your journaling routine. You’ll see life-changing effects in just a few weeks.
        </Text>
      </View>

      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginLeft: 186,
          marginBottom: 58,
        }}
      >
        <Text  onPress={handleNext} style={{ color: "#DEEAFF", fontSize: 16, fontWeight: "bold", marginRight: 4 }}>
          Next
        </Text>
        <Image
          source={{
            uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Imam9Ji2yK/qsv3kzf9_expires_30_days.png",
          }}
          resizeMode="stretch"
          style={{ width: 24, height: 30 }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default OnboardingScreenTwo;
