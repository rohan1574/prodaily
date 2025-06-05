import { View, Text, Pressable } from 'react-native';
import { s as tw } from 'react-native-wind';

export default function WelcomeCard() {
  return (
    <View style={[tw`items-center justify-center h-full bg-gray-900`]}>
      <View style={[tw`bg-blue-500 rounded-full px-10 py-6 shadow-md`,{width:300,height:92}]}>
        <Text style={[tw`text-white font-medium text-center bottom-3`,{fontSize:22,letterSpacing:1}]}>Welcome!</Text>
        <Text style={[tw`text-white text-sm text-center bottom-2`,{fontSize:12,color:"#C6CEDD",letterSpacing:1}]}>Successfully Signed In</Text>

        <Pressable style={tw`mt-4 bg-white rounded-md px-4 h-8 self-center bottom-3`}>
          <Text style={[tw` font-medium top-2`,{fontSize:12,color:"#3580FF",letterSpacing:1}]}>Continue..</Text>
        </Pressable>
      </View>
    </View>
  );
}
