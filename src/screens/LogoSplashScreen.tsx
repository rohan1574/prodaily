import React from 'react';
import { View, Image, Text } from 'react-native';
import { s as tw } from 'react-native-wind'; 

const LogoSplashScreen = () => {
  return (
    <View style={[tw`flex-1 bg-blue-700 justify-center items-center`]}>
      <View style={[tw`w-48 h-48 rounded-full justify-center items-center`,{backgroundColor:"#3079F6"}]}>
        <Image 
          source={require('./assets/images/sun.png')} 
          style={tw`w-20 h-20`} 
          resizeMode="contain"
        />
        <Text style={tw`text-white text-xl font-semibold mt-2`}>P r o D A I L Y</Text>
      </View>
    </View>
  );
};

export default LogoSplashScreen;
