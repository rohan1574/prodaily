import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {s as tw} from 'react-native-wind';

const days = Array.from({length: 31}, (_, i) => (i + 1).toString());
const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const DateSelector: React.FC<{onCancel: () => void}> = ({onCancel}) => {
  const [selectedDates, setSelectedDates] = useState<string[]>([
    'January 1',
    'February 28',
    'December 31',
  ]);
  const [selectedDay, setSelectedDay] = useState<string>('1');
  const [selectedMonth, setSelectedMonth] = useState<string>('January');

  const dayListRef = useRef<FlatList<string> | null>(null);
  const monthListRef = useRef<FlatList<string> | null>(null);

  // Scroll event handlers
  const handleDayScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const yOffset = event.nativeEvent.contentOffset.y;
    const itemHeight = 30;
    const index = Math.round(yOffset / itemHeight);

    if (index >= days.length) {
      dayListRef.current?.scrollToIndex({index: 0, animated: false});
    } else if (index < 0) {
      dayListRef.current?.scrollToIndex({
        index: days.length - 1,
        animated: false,
      });
    }
  };

  const handleMonthScroll = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const yOffset = event.nativeEvent.contentOffset.y;
    const itemHeight = 30;
    const index = Math.round(yOffset / itemHeight);

    if (index >= months.length) {
      monthListRef.current?.scrollToIndex({index: 0, animated: false});
    } else if (index < 0) {
      monthListRef.current?.scrollToIndex({
        index: months.length - 1,
        animated: false,
      });
    }
  };

  // Auto-scroll to selected values when they change
  useEffect(() => {
    const dayIndex = days.indexOf(selectedDay);
    const monthIndex = months.indexOf(selectedMonth);

    if (dayIndex !== -1) {
      dayListRef.current?.scrollToIndex({index: dayIndex, animated: true});
    }
    if (monthIndex !== -1) {
      monthListRef.current?.scrollToIndex({index: monthIndex, animated: true});
    }
  }, [selectedDay, selectedMonth]);

  const addSelectedDate = () => {
    const newDate = `${selectedMonth} ${selectedDay}`;
    if (!selectedDates.includes(newDate)) {
      setSelectedDates([...selectedDates, newDate]);
    }
  };
  return (
    <View style={tw`bg-gray-300 p-4 rounded-lg`}>
      <Text style={tw`text-lg font-bold text-center mb-4`}>
        Select Days for Every Year
      </Text>
      <View style={tw`flex-row items-center`}>
        {/* Left side (Selected Dates List) */}
        <View style={tw`flex-1`}>
          <FlatList
            data={selectedDates}
            keyExtractor={item => item}
            renderItem={({item}) => (
              <View
                style={tw`flex-row justify-between bg-gray-200 p-2 rounded-lg mb-2 items-center`}>
                <Text style={tw`text-gray-700`}>{item}</Text>
                <TouchableOpacity
                  onPress={() =>
                    setSelectedDates(selectedDates.filter(d => d !== item))
                  }>
                  <Icon name="close-circle" size={20} color="gray" />
                </TouchableOpacity>
              </View>
            )}
          />
        </View>

        {/* Middle Separator */}
        <View style={tw`w-0.5 bg-gray-400 h-full mx-4`} />

        {/* Right side (Scrollable Days and Months) */}
        <View style={tw`flex-1 items-center`}>
          {/* Scrollable Days List */}
          <FlatList
            ref={dayListRef}
            data={[...days, ...days, ...days]} // Circular effect
            keyExtractor={(item, index) => index.toString()}
            style={{height: 100}}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{alignItems: 'center'}}
            getItemLayout={(data, index) => ({
              length: 30,
              offset: 30 * index,
              index,
            })}
            onMomentumScrollEnd={handleDayScroll}
            renderItem={({item}) => (
              <TouchableOpacity onPress={() => setSelectedDay(item)}>
                <Text
                  style={tw`${
                    selectedDay === item ? 'font-bold text-lg' : 'text-gray-700'
                  } mb-2`}>
                  {item}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>

        <View style={tw`flex-1 items-center`}>
          {/* Scrollable Months List */}
          <FlatList
            ref={monthListRef}
            data={[...months, ...months, ...months]} // Circular effect
            keyExtractor={(item, index) => index.toString()}
            style={{height: 100}}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{alignItems: 'center'}}
            getItemLayout={(data, index) => ({
              length: 30,
              offset: 30 * index,
              index,
            })}
            onMomentumScrollEnd={handleMonthScroll}
            renderItem={({item}) => (
              <TouchableOpacity onPress={() => setSelectedMonth(item)}>
                <Text
                  style={tw`${
                    selectedMonth === item
                      ? 'font-bold text-lg'
                      : 'text-gray-700'
                  } mb-2`}>
                  {item}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>

      {/* Action Buttons */}
      <View style={tw`flex-row justify-between items-center mt-4`}>
        <TouchableOpacity
          style={tw`bg-gray-500 p-2 rounded-lg px-4`}
          onPress={onCancel} // Cancel button will close modal
        >
          <Text style={tw`text-white`}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={tw`bg-blue-500 p-2 rounded-lg px-4`}
          onPress={() =>
            setSelectedDates([
              ...selectedDates,
              `${selectedMonth} ${selectedDay}`,
            ])
          }>
          <Text style={tw`text-white`}>Add Date</Text>
        </TouchableOpacity>
      </View>

      {/* Extra Option */}
      <View style={tw`flex-row items-center mt-4`}>
        <Icon name="radio-button-on" size={20} color="blue" />
        <Text style={tw`ml-2 text-gray-700`}>
          Show Daily from start date Until Complete
        </Text>
      </View>
    </View>
  );
};

export default DateSelector;
