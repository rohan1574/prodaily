import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import {s as tw} from 'react-native-wind';
import Icon from 'react-native-vector-icons/Ionicons';

const UserAuthenticationScreen = () => {
  return (
    <View style={tw`flex-1 bg-blue-500 justify-center items-center px-6`}>
      <Text style={[tw`text-white font-bold w-full`,{fontSize:40,top:0}]}>
        Continue{'      '} with . . .
      </Text>
      <Text style={[tw`font-normal`,{top:10,fontSize:16,color:"#FAFAFA"}]}>
        Please login, so we can organize your customize Routine.
      </Text>

      <View style={[tw`mt-8 w-full`, {top:30}]}>
        <TouchableOpacity
          style={tw`bg-white flex-row items-center px-4 py-3 rounded-full mb-4`}>
          <Icon
            name="logo-facebook"
            size={24}
            color="#1877F2"
            style={[tw``, {left: 70}]}
          />
          <Text style={[tw`text-gray-500 font-bold`, {left: 80, fontSize: 18}]}>
            Facebook
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={tw`bg-white flex-row items-center px-4 py-3 rounded-full mb-4`}>
          <Image
            source={require('./assets/images/google.png')}
            style={[tw``, {left: 70}]}
          />
          <Text style={[tw`text-gray-500 font-bold`, {left: 80,fontSize:18}]}>Google</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={tw`bg-white flex-row items-center px-4 py-3 rounded-full`}>
          <Icon name="logo-apple" size={24} color="#000" style={[tw``, {left: 70}]} />
          <Text style={[tw`text-gray-500 font-bold`, {left: 80,fontSize:18}]}>Apple</Text>
        </TouchableOpacity>
      </View>

      <Text
        style={[
          tw`text-center text-normal opacity-70`,
          {color: '#AFB4FF', top: 70, fontSize: 11},
        ]}>
        By continuing you agree Terms of Services & Privacy Policy
      </Text>
    </View>
  );
};

export default UserAuthenticationScreen;
