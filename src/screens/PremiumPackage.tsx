import React, { useState } from 'react';
import {View, Text, TouchableOpacity, Image, ScrollView} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {s as tw} from 'react-native-wind';
import Svg, {Defs, RadialGradient, Rect, Stop} from 'react-native-svg';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
type PricingBoxProps = {
  title: string;
  price: string;
  billingText: string;
  value: string;
  isBestDeal?: boolean;
};
export default function PremiumPackage() {
   const navigation = useNavigation();
     const [selectedOption, setSelectedOption] = useState('lifetime'); // Default selected

  const PricingBox = ({ 
    title, 
    price, 
    billingText, 
    value, 
    isBestDeal = false 
  }: PricingBoxProps) => (
    <TouchableOpacity 
      onPress={() => setSelectedOption(value)}
      style={tw`mx-1`}
      activeOpacity={0.7}
    >
      <LinearGradient
        colors={selectedOption === value ? ['#3580FF', '#3580FF'] : ['#FFF', '#FFF']}
        style={{
          padding: 1,
          borderRadius: 16,
          shadowColor: '#3580FF',
          shadowOffset: {width: 2, height: 4},
          shadowOpacity: 0.4,
          shadowRadius: 6,
          elevation: 6,
        }}
      >
        <View
          style={{
            backgroundColor: selectedOption === value ? '#3580FF' : '#FFF',
            borderRadius: 16,
            paddingVertical: 16,
            paddingHorizontal: 20,
            width: 110,
            alignItems: 'center',
          }}
        >
          {isBestDeal && (
            <View style={[tw`absolute -top-3 px-2 py-1 rounded-full`, {backgroundColor: '#DEEAFF'}]}>
              <Text style={[tw`font-light`, {fontSize: 10, color: '#2B2D42'}]}>
                Best Deal
              </Text>
            </View>
          )}
          
          <Text style={[
            tw`font-normal mb-2`,
            {
              fontSize: 16,
              letterSpacing: 1,
              color: selectedOption === value ? 'white' : 'black'
            }
          ]}>
            {title}
          </Text>
          
          <Text style={[
            tw`font-bold`,
            {
              fontSize: 22,
              color: selectedOption === value ? 'white' : '#8D99AE'
            }
          ]}>
            {price}
          </Text>
          
          <Text style={[
            tw`font-light`,
            {
              fontSize: 10,
              color: selectedOption === value ? '#DEEAFF' : '#8D99AE'
            }
          ]}>
            {billingText}
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={tw`flex-1 bg-sky-50`}>
      <View style={tw`items-center`}>
        {/* Image with Gradient Overlay */}
        <View style={tw`relative w-full`}>
          <Image
            source={require('../../assets/images/su.jpg')}
            style={tw`w-full h-80 rounded-b-3xl`}
            resizeMode="cover"
          />
          {/* Gradient from bottom (white) to transparent top */}
          <LinearGradient
            colors={['#FFFFFF', 'transparent']}
            start={{x: 0.5, y: 1}}
            end={{x: 0.5, y: 0}}
            style={tw`absolute w-full h-24 top-56 rounded-b-3xl`}
          />

          {/* Icon and Text Row */}
          <View
            style={{
              position: 'absolute',
              top: 220,
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {/* Icon on left side */}
            <View
              style={{
                position: 'absolute',
                left: 20,
                bottom: 175,
                backgroundColor: '#FFFFFF',
                borderRadius: 50,
                padding: 4,
              }}>
              <Icon
              onPress={() => navigation.goBack()}
                name="chevron-back"
                size={32}
                color="#040415" // black icon
              />
            </View>

            {/* Unlock Text */}
            <Text
              style={[
                tw`text-white font-bold`,
                {fontSize: 48, letterSpacing: 1},
              ]}>
              Unlock!
            </Text>
          </View>
        </View>
      </View>

      {/* Features List */}
      <View
        style={[
          tw`rounded-br-lg shadow overflow-hidden bottom-2`,
          {width: 294, height: 195, left: 45},
        ]}>
        {/* Radial Gradient Background */}
        <Svg height="100%" width="100%" style={tw`absolute`}>
          <Defs>
            <RadialGradient
              id="grad"
              cx="50%"
              cy="50%"
              r="70%"
              fx="50%"
              fy="50%">
              <Stop offset="0%" stopColor="#DEEAFF" stopOpacity="1" />
              <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="1" />
            </RadialGradient>
          </Defs>
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#grad)" />
        </Svg>

        {/* Content */}
        <View
          style={[
            tw`flex-row text-center justify-between text-white font-medium text-base mb-2 h-9 rounded-br-lg`,
            {backgroundColor: '#424564'},
          ]}>
          <Text
            style={[
              tw`text-white font-semibold `,
              {fontSize: 14, letterSpacing: 1, left: 52, top: 8},
            ]}>
            Premium Features
          </Text>
          <Image
            source={require('../../assets/images/PremiumBadge.png')}
            style={[tw`w-4 h-4`, {top: 6, width: 26, height: 24, right: 12}]}
          />
        </View>
        <View style={tw`top-4 `}>
          {[
            'Add custom category',
            'Add custom task',
            'Change color Scheme',
            'Rename task',
            'Fill today widget',
          ].map((feature, idx) => (
            <Text
              key={idx}
              style={[
                tw` font-normal`,
                {
                  color: '#2B2D42',
                  fontSize: 16,
                  marginBottom: 2,
                  left: 52,
                  letterSpacing: 1,
                },
              ]}>
              {feature}
            </Text>
          ))}
        </View>
      </View>

      {/* Pricing Options */}
     <View style={tw`flex-row justify-around mt-6 `}>
        <PricingBox 
          title="Monthly"
          price="$1"
          billingText="Billed monthly"
          value="monthly"
        />
        
        <PricingBox 
          title="Yearly"
          price="$10"
          billingText="Billed Yearly"
          value="yearly"
        />
        
        <PricingBox 
          title="Lifetime"
          price="$20"
          billingText="Billed once"
          value="lifetime"
          isBestDeal={true}
        />
      </View>

      {/* Continue Button */}
      <TouchableOpacity 
        style={tw`mx-4 mt-8 bg-blue-600 py-3 rounded-full`}
        onPress={() => console.log('Selected:', selectedOption)}
      >
        <Text style={[tw`text-center text-white font-normal`, {fontSize: 14}]}>
          Continue
        </Text>
      </TouchableOpacity>
    
    </ScrollView>
  );
}
