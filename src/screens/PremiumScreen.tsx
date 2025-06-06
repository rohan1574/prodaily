import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {s as tw} from 'react-native-wind';
import {useNavigation} from '@react-navigation/native';

const PremiumScreen = () => {
  const navigation = useNavigation();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');

  const features = [
    'Unlimited custom tasks',
    'Unlimited custom categories',
    'Advanced statistics',
    'Priority support',
    'Exclusive themes',
    'Ad-free experience',
  ];

  return (
    <ScrollView style={tw`flex-1 bg-gray-50`}>
      {/* Header */}
      <View style={tw`bg-blue-500 pt-12 pb-8 px-6 rounded-b-3xl`}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={tw`absolute top-12 left-6 z-10`}>
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={tw`text-white text-2xl font-bold text-center mt-4`}>
          ProDAILY Premium
        </Text>
        <Text style={tw`text-blue-100 text-center mt-2`}>
          Upgrade to unlock all features
        </Text>
      </View>

      {/* Pricing Toggle */}
      <View style={tw`flex-row justify-center mt-8 mx-6 bg-white p-1 rounded-full`}>
        <TouchableOpacity
          onPress={() => setSelectedPlan('monthly')}
          style={[
            tw`flex-1 py-3 rounded-full items-center`,
            selectedPlan === 'monthly' && tw`bg-blue-500`,
          ]}>
          <Text style={[
            tw`font-medium`,
            selectedPlan === 'monthly' ? tw`text-white` : tw`text-gray-600`
          ]}>
            Monthly
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSelectedPlan('yearly')}
          style={[
            tw`flex-1 py-3 rounded-full items-center`,
            selectedPlan === 'yearly' && tw`bg-blue-500`,
          ]}>
          <Text style={[
            tw`font-medium`,
            selectedPlan === 'yearly' ? tw`text-white` : tw`text-gray-600`
          ]}>
            Yearly (Save 20%)
          </Text>
        </TouchableOpacity>
      </View>

      {/* Pricing Cards */}
      <View style={tw`px-6 mt-6`}>
        <View style={[
          tw`bg-white p-6 rounded-2xl shadow-md border-2 border-blue-400`,
          styles.cardElevation
        ]}>
          <View style={tw`flex-row items-end`}>
            <Text style={tw`text-3xl font-bold text-blue-500`}>
              {selectedPlan === 'monthly' ? '৳50' : '৳480'}
            </Text>
            <Text style={tw`text-gray-500 ml-1 mb-1`}>
              /{selectedPlan === 'monthly' ? 'month' : 'year'}
            </Text>
          </View>
          <Text style={tw`text-gray-700 mt-2`}>
            Billed {selectedPlan === 'monthly' ? 'monthly' : 'annually'}
          </Text>

          <TouchableOpacity
            style={tw`bg-blue-500 py-3 rounded-full mt-6 items-center`}>
            <Text style={tw`text-white font-bold text-lg`}>
              Get Premium
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Features List */}
      <View style={tw`mt-8 px-6`}>
        <Text style={tw`text-lg font-bold text-gray-800 mb-4`}>
          Premium Features
        </Text>
        {features.map((feature, index) => (
          <View key={index} style={tw`flex-row items-center mb-3`}>
            <Icon name="checkmark-circle" size={20} color="#4CAF50" />
            <Text style={tw`text-gray-700 ml-2`}>{feature}</Text>
          </View>
        ))}
      </View>

      {/* Payment Info */}
      <View style={tw`mt-8 px-6 pb-10`}>
        <Text style={tw`text-xs text-gray-500 text-center`}>
          Payment will be charged to your Google Play account at confirmation of purchase.
          Subscription automatically renews unless auto-renew is turned off at least
          24 hours before the end of the current period.
        </Text>
        <TouchableOpacity style={tw`mt-4`}>
          <Text style={tw`text-blue-500 text-center text-xs`}>
            Terms of Service • Privacy Policy
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  cardElevation: {
    shadowColor: '#3580FF',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  }
});

export default PremiumScreen;