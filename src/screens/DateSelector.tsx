import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { s as tw } from 'react-native-wind';

const ITEM_HEIGHT = 30;
const VISIBLE_ITEMS = 3;
const SCROLL_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;

const Days = Array.from({ length: 31 }, (_, index) => index + 1);
const Months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

type DateSelectorProps = {
  selectedDates: number[];
  selectedMonths: string[];
  onSelectDate: (date: number) => void;
  onSelectMonth: (month: string) => void;
  onCancel: () => void;
  onAddDay: (newDates: { date: number; month: string }[]) => void;
  onRemoveDay: (index: number) => void;
};

const DateSelector: React.FC<DateSelectorProps> = ({
  selectedDates,
  selectedMonths,
  onSelectDate,
  onSelectMonth,
  onCancel,
  onAddDay,
  onRemoveDay,
}) => {
  const dayScrollRef = useRef<ScrollView>(null);
  const monthScrollRef = useRef<ScrollView>(null);

  const initialDates = selectedDates.map((date, index) => ({
    date,
    month: selectedMonths[index] || 'January',
  }));

  const [addedDates, setAddedDates] = useState<{ date: number; month: string }[]>(initialDates);
  const selectedDateRef = useRef<number>(initialDates[0]?.date || 1);
  const selectedMonthRef = useRef<string>(initialDates[0]?.month || 'January');

  const [selectedDate, setSelectedDate] = useState(selectedDateRef.current);
  const [selectedMonth, setSelectedMonth] = useState(selectedMonthRef.current);

  useEffect(() => {
    const dayIndex = Days.indexOf(selectedDate);
    const monthIndex = Months.indexOf(selectedMonth);
    if (dayIndex !== -1) {
      dayScrollRef.current?.scrollTo({ y: dayIndex * ITEM_HEIGHT, animated: false });
    }
    if (monthIndex !== -1) {
      monthScrollRef.current?.scrollTo({ y: monthIndex * ITEM_HEIGHT, animated: false });
    }
  }, []);

  const handleDateChange = (day: number) => {
    selectedDateRef.current = day;
    setSelectedDate(day);
    onSelectDate(day);
  };

  const handleMonthChange = (month: string) => {
    selectedMonthRef.current = month;
    setSelectedMonth(month);
    onSelectMonth(month);
  };

  const handleDayScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round((e.nativeEvent.contentOffset.y + ITEM_HEIGHT / 2) / ITEM_HEIGHT);
    if (Days[index]) handleDateChange(Days[index]);
  };

  const handleMonthScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round((e.nativeEvent.contentOffset.y + ITEM_HEIGHT / 2) / ITEM_HEIGHT);
    if (Months[index]) handleMonthChange(Months[index]);
  };

  const handleAddDate = () => {
    const currentDate = selectedDateRef.current;
    const currentMonth = selectedMonthRef.current;

    const exists = addedDates.some(
      d => d.date === currentDate && d.month === currentMonth
    );
    if (!exists) {
      const updated = [...addedDates, { date: currentDate, month: currentMonth }];
      setAddedDates(updated);
    }
  };

  const handleRemoveDate = (index: number) => {
    const updated = [...addedDates];
    updated.splice(index, 1);
    setAddedDates(updated);
    onRemoveDay(index);
  };

  const handleSaveDates = () => {
    onAddDay(addedDates);
  };

  return (
    <Modal transparent={true} visible={true}>
      <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-30`}>
        <View style={tw`bg-white rounded-xl p-4 w-11/12`}>
          <Text style={tw`text-lg font-semibold text-center mb-2`}>Select Dates</Text>

          <View style={tw`flex-row`}>
            {/* Left - Pickers */}
            <View style={tw`w-1/2 pr-2 border-r border-gray-200`}>
              <View style={tw`flex-row justify-between`}>
                {/* Days */}
                <ScrollView
                  ref={dayScrollRef}
                  style={{ height: SCROLL_HEIGHT }}
                  snapToInterval={ITEM_HEIGHT}
                  decelerationRate="fast"
                  onMomentumScrollEnd={handleDayScroll}
                  onScrollEndDrag={handleDayScroll} // Fixed: Added scroll end handler
                  showsVerticalScrollIndicator={false}
                >
                  {Days.map(day => (
                    <TouchableOpacity
                      key={day}
                      onPress={() => handleDateChange(day)}
                      style={[tw`items-center justify-center`, { height: ITEM_HEIGHT }]}
                    >
                      <Text style={tw`${selectedDate === day ? 'text-black font-bold' : 'text-gray-400'}`}>
                        {day}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                {/* Months */}
                <ScrollView
                  ref={monthScrollRef}
                  style={{ height: SCROLL_HEIGHT }}
                  snapToInterval={ITEM_HEIGHT}
                  decelerationRate="fast"
                  onMomentumScrollEnd={handleMonthScroll}
                  onScrollEndDrag={handleMonthScroll} // Fixed: Added scroll end handler
                  showsVerticalScrollIndicator={false}
                >
                  {Months.map(month => (
                    <TouchableOpacity
                      key={month}
                      onPress={() => handleMonthChange(month)}
                      style={[tw`items-center justify-center`, { height: ITEM_HEIGHT }]}
                    >
                      <Text style={tw`${selectedMonth === month ? 'text-black font-bold' : 'text-gray-400'}`}>
                        {month}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View style={tw`flex-row justify-between mt-4`}>
                <TouchableOpacity
                  onPress={onCancel}
                  style={tw`bg-gray-400 px-4 py-2 rounded-xl`}
                >
                  <Text style={tw`text-white`}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleAddDate}
                  style={tw`bg-blue-500 px-4 py-2 rounded-xl`}
                >
                  <Text style={tw`text-white`}>Add</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Right - Added Date List */}
            <View style={tw`w-1/2 pl-2`}>
              <ScrollView style={{ maxHeight: 150 }}>
                {addedDates.map((item, index) => (
                  <View
                    key={`${item.month}-${item.date}-${index}`}
                    style={tw`flex-row justify-between items-center bg-gray-100 px-3 py-2 rounded-xl mb-2`}
                  >
                    <Text style={tw`text-gray-800`}>{`${item.month} ${item.date}`}</Text>
                    <TouchableOpacity onPress={() => handleRemoveDate(index)}>
                      <Icon name="close" size={16} color="#555" />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>

              <TouchableOpacity
                onPress={handleSaveDates}
                style={tw`bg-green-500 px-4 py-2 rounded-xl mt-3`}
              >
                <Text style={tw`text-white text-center`}>Save Dates</Text>
              </TouchableOpacity>

              <View style={tw`flex-row items-center mt-4`}>
                <View style={tw`w-4 h-4 rounded-full border-2 border-blue-500 mr-2 justify-center items-center`}>
                  <View style={tw`w-2 h-2 bg-blue-500 rounded-full`} />
                </View>
                <Text style={tw`text-gray-600 text-xs`}>
                  These dates will repeat yearly from start date
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