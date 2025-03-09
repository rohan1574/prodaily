import { Text, View } from 'react-native';
import { s as tw } from 'react-native-wind';

export default function App() {
  return (
    <View style={tw`flex-1 justify-center items-center bg-gray-100`}>
      <Text style={tw`text-xl font-bold text-gray-800`}>Hello, NativeWind!</Text>
    </View>
  );
}
