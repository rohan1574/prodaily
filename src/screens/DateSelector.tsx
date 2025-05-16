import React, {useState, useRef, useEffect} from 'react';
import {View, Text, TouchableOpacity, Modal, ScrollView, Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {s as tw} from 'react-native-wind';

const ITEM_HEIGHT = 30;
const VISIBLE_ITEMS = 3;
const SCROLL_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;

type DateSelectorProps = {
  selectedDates: number[];
  selectedMonths: string[];
  onSelectDate: (date: number) => void;
  onSelectMonth: (month: string) => void;
  onCancel: () => void;
  onAddDay: () => void;
  onRemoveDay: (index: number) => void;
};

const Days = Array.from({length: 31}, (_, index) => index + 1);
const Months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const DateSelector: React.FC<DateSelectorProps> = ({
  selectedDates,
  selectedMonths,
  onSelectDate,
  onSelectMonth,
  onCancel,
  onAddDay,
  onRemoveDay,
}) => {
  const [selectedDate, setSelectedDate] = useState<number>(selectedDates[0] || 1);
  const [selectedMonth, setSelectedMonth] = useState<string>(selectedMonths[0] || 'January');
  const dayScrollRef = useRef<ScrollView>(null);
  const monthScrollRef = useRef<ScrollView>(null);

  // Initialize scroll positions
  useEffect(() => {
    const initialDayIndex = Days.indexOf(selectedDate);
    const dayY = initialDayIndex * ITEM_HEIGHT - ITEM_HEIGHT;
    dayScrollRef.current?.scrollTo({y: dayY, animated: false});

    const initialMonthIndex = Months.indexOf(selectedMonth);
    const monthY = initialMonthIndex * ITEM_HEIGHT - ITEM_HEIGHT;
    monthScrollRef.current?.scrollTo({y: monthY, animated: false});
  }, []);

  const handleDateChange = (day: number) => {
    setSelectedDate(day);
    onSelectDate(day);
    const index = Days.indexOf(day);
    const y = index * ITEM_HEIGHT - ITEM_HEIGHT;
    dayScrollRef.current?.scrollTo({y, animated: true});
  };

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
    onSelectMonth(month);
    const index = Months.indexOf(month);
    const y = index * ITEM_HEIGHT - ITEM_HEIGHT;
    monthScrollRef.current?.scrollTo({y, animated: true});
  };

  const handleDayScroll = (event: any) => {
    const y = event.nativeEvent.contentOffset.y + ITEM_HEIGHT;
    const index = Math.round(y / ITEM_HEIGHT);
    if (Days[index]) {
      setSelectedDate(Days[index]);
      onSelectDate(Days[index]);
    }
  };

  const handleMonthScroll = (event: any) => {
    const y = event.nativeEvent.contentOffset.y + ITEM_HEIGHT;
    const index = Math.round(y / ITEM_HEIGHT);
    if (Months[index]) {
      setSelectedMonth(Months[index]);
      onSelectMonth(Months[index]);
    }
  };

  const selectedDays = selectedDates.map((date, index) => ({
    date,
    month: selectedMonths[index],
  }));

  return (
    <Modal transparent={true} visible={true}>
      <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-30`}>
        <View style={tw`bg-white rounded-xl p-4 w-4/5`}>
          <View style={tw`flex-row`}>
            {/* Selected Dates List */}
            <View style={tw`w-1/2 pr-2`}>
              {selectedDays.map((day, index) => (
                <View
                  key={index}
                  style={tw`flex-row justify-between items-center bg-gray-100 px-3 py-2 rounded-xl mb-2`}
                >
                  <Text style={tw`text-gray-800`}>{`${day.month} ${day.date}`}</Text>
                  <TouchableOpacity onPress={() => onRemoveDay(index)}>
                    <Icon name="close" size={16} color="#555" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            {/* Date Selectors */}
            <View style={tw`w-1/2 pl-2 border-l border-gray-200`}>
              <View style={tw`flex-row justify-between`}>
                {/* Day Scroll */}
                <ScrollView
                  ref={dayScrollRef}
                  style={{height: SCROLL_HEIGHT}}
                  showsVerticalScrollIndicator={false}
                  snapToInterval={ITEM_HEIGHT}
                  decelerationRate="fast"
                  onMomentumScrollEnd={handleDayScroll}
                >
                  {Days.map(day => (
                    <TouchableOpacity
                      key={day}
                      onPress={() => handleDateChange(day)}
                      style={[tw`items-center justify-center`, {height: ITEM_HEIGHT}]}
                    >
                      <Text style={tw`${selectedDate === day ? 'text-black font-bold' : 'text-gray-400'}`}>
                        {day}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                {/* Month Scroll */}
                <ScrollView
                  ref={monthScrollRef}
                  style={{height: SCROLL_HEIGHT}}
                  showsVerticalScrollIndicator={false}
                  snapToInterval={ITEM_HEIGHT}
                  decelerationRate="fast"
                  onMomentumScrollEnd={handleMonthScroll}
                >
                  {Months.map(month => (
                    <TouchableOpacity
                      key={month}
                      onPress={() => handleMonthChange(month)}
                      style={[tw`items-center justify-center`, {height: ITEM_HEIGHT}]}
                    >
                      <Text style={tw`${selectedMonth === month ? 'text-black font-bold' : 'text-gray-400'}`}>
                        {month}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Buttons */}
              <View style={tw`flex-row justify-between mt-3`}>
                <TouchableOpacity
                  onPress={onCancel}
                  style={tw`bg-gray-400 px-3 py-2 rounded-xl`}
                >
                  <Text style={tw`text-white`}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={onAddDay}
                  style={tw`bg-blue-500 px-3 py-2 rounded-xl`}
                >
                  <Text style={tw`text-white`}>Add Date</Text>
                </TouchableOpacity>
              </View>

              {/* Info Note */}
              <View style={tw`flex-row items-center mt-4`}>
                <View style={tw`w-4 h-4 rounded-full border-2 border-blue-500 mr-2 justify-center items-center`}>
                  <View style={tw`w-2 h-2 bg-blue-500 rounded-full`} />
                </View>
                <Text style={tw`text-gray-600 text-xs`}>
                  Show Daily from start date Until Complete
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DateSelector;