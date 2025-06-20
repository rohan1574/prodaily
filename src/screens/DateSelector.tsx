import React, {useState, useRef, useEffect} from 'react';
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
import Ionicons from 'react-native-vector-icons/Ionicons';
import {s as tw} from 'react-native-wind';

const ITEM_HEIGHT = 40;
const VISIBLE_ITEMS = 3;
const SCROLL_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;

const Months = [
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

// Create extended arrays for circular scrolling
const extendedMonths = [...Months, ...Months, ...Months];

// Function to get days based on month and year
const getDaysForMonth = (month: string, year: number) => {
  const currentYear = year || new Date().getFullYear();

  if (month === 'February') {
    // Check if it's a leap year
    const isLeapYear =
      (currentYear % 4 === 0 && currentYear % 100 !== 0) ||
      currentYear % 400 === 0;
    return Array.from({length: isLeapYear ? 29 : 28}, (_, i) => i + 1);
  }

  switch (month) {
    case 'April':
    case 'June':
    case 'September':
    case 'November':
      return Array.from({length: 30}, (_, i) => i + 1);
    default:
      return Array.from({length: 31}, (_, i) => i + 1);
  }
};

type DateSelectorProps = {
  selectedDates: number[];
  selectedMonths: string[];
  onSelectDate: (date: number) => void;
  onSelectMonth: (month: string) => void;
  onCancel: () => void;
  onAddDay: (newDates: {date: number; month: string}[]) => void;
  onRemoveDay: (index: number) => void;
  year: number; // Add year prop
};

const DateSelector: React.FC<DateSelectorProps> = ({
  selectedDates,
  selectedMonths,
  onSelectDate,
  onSelectMonth,
  onCancel,
  onAddDay,
  onRemoveDay,
  year, // Use year prop
}) => {
  const dayScrollRef = useRef<ScrollView>(null);
  const monthScrollRef = useRef<ScrollView>(null);

  const initialDates = selectedDates.map((date, index) => ({
    date,
    month: selectedMonths[index] || 'January',
  }));

  const [addedDates, setAddedDates] =
    useState<{date: number; month: string}[]>(initialDates);

  // Get initial month and adjust date if needed
  const initialMonth = initialDates[0]?.month || 'January';
  const initialDays = getDaysForMonth(initialMonth, year);
  const initialDate = Math.min(
    initialDates[0]?.date || 1,
    initialDays[initialDays.length - 1],
  );

  const selectedDateRef = useRef<number>(initialDate);
  const selectedMonthRef = useRef<string>(initialMonth);

  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [selectedMonth, setSelectedMonth] = useState(initialMonth);
  const [daysInMonth, setDaysInMonth] = useState<number[]>(initialDays);

  // Update days when month changes or year changes
  useEffect(() => {
    const newDays = getDaysForMonth(selectedMonth, year);
    setDaysInMonth(newDays);

    // Adjust date if current date is invalid in new month
    if (selectedDate > newDays[newDays.length - 1]) {
      const newDate = newDays[newDays.length - 1];
      setSelectedDate(newDate);
      selectedDateRef.current = newDate;
      onSelectDate(newDate);
    }
  }, [selectedMonth, year]);

  // Create extended days array
  const extendedDays = [...daysInMonth, ...daysInMonth, ...daysInMonth];

  useEffect(() => {
    const dayIndex = daysInMonth.indexOf(selectedDate);
    const monthIndex = Months.indexOf(selectedMonth);

    if (dayIndex !== -1 && dayScrollRef.current) {
      dayScrollRef.current.scrollTo({
        y: (daysInMonth.length + dayIndex) * ITEM_HEIGHT,
        animated: false,
      });
    }
    if (monthIndex !== -1 && monthScrollRef.current) {
      monthScrollRef.current.scrollTo({
        y: (Months.length + monthIndex) * ITEM_HEIGHT,
        animated: false,
      });
    }
  }, [daysInMonth]);

  const handleDateChange = (day: number) => {
    if (selectedDateRef.current === day) return;
    selectedDateRef.current = day;
    setSelectedDate(day);
    onSelectDate(day);
  };

  const handleMonthChange = (month: string) => {
    if (selectedMonthRef.current === month) return;
    selectedMonthRef.current = month;
    setSelectedMonth(month);
    onSelectMonth(month);
  };

  const handleDayScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = e.nativeEvent.contentOffset.y;
    let index = Math.round(offsetY / ITEM_HEIGHT);

    // Handle circular scrolling
    if (index < daysInMonth.length) {
      index += daysInMonth.length;
      dayScrollRef.current?.scrollTo({
        y: index * ITEM_HEIGHT,
        animated: false,
      });
    } else if (index >= 2 * daysInMonth.length) {
      index -= daysInMonth.length;
      dayScrollRef.current?.scrollTo({
        y: index * ITEM_HEIGHT,
        animated: false,
      });
    }

    const dayIndex = index % daysInMonth.length;
    if (
      daysInMonth[dayIndex] !== undefined &&
      daysInMonth[dayIndex] !== selectedDateRef.current
    ) {
      handleDateChange(daysInMonth[dayIndex]);
    }
  };

  const handleMonthScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = e.nativeEvent.contentOffset.y;
    let index = Math.round(offsetY / ITEM_HEIGHT);

    // Handle circular scrolling
    if (index < Months.length) {
      index += Months.length;
      monthScrollRef.current?.scrollTo({
        y: index * ITEM_HEIGHT,
        animated: false,
      });
    } else if (index >= 2 * Months.length) {
      index -= Months.length;
      monthScrollRef.current?.scrollTo({
        y: index * ITEM_HEIGHT,
        animated: false,
      });
    }

    const monthIndex = index % Months.length;
    if (
      Months[monthIndex] !== undefined &&
      Months[monthIndex] !== selectedMonthRef.current
    ) {
      handleMonthChange(Months[monthIndex]);
    }
  };

  const handleAddDate = () => {
    const currentDate = selectedDateRef.current;
    const currentMonth = selectedMonthRef.current;

    const exists = addedDates.some(
      d => d.date === currentDate && d.month === currentMonth,
    );
    if (!exists) {
      const updated = [...addedDates, {date: currentDate, month: currentMonth}];
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
  const [showNextDay, setShowNextDay] = useState(true);

  return (
    <Modal transparent={true} visible={true}>
      <View
        style={[
          tw`flex-1 justify-center items-center bg-opacity-50 `,
          {backgroundColor: 'rgba(32, 41, 56, 0.7)'},
        ]}>
        <View style={tw`bg-white rounded-xl  w-80`}>
          {/* Header */}
          <View style={[tw``, {backgroundColor: '', width: 37}]}>
            <Text
              style={tw`text-white text-center text-sm font-medium bg-gray-400 bottom-4 rounded-lg  py-3 w-80`}>
              Select Date for Every Year
            </Text>
          </View>

          <View style={tw`flex-row p-2`}>
            {/* Left Column - Added Dates */}
            <View style={tw`w-1/2 pr-8 `}>
              <ScrollView style={tw`h-36`}>
                {addedDates.map((item, index) => (
                  <View
                    key={`${item.month}-${item.date}-${index}`}
                    style={tw`flex-row justify-between items-center bg-gray-100 px-3 py-2 rounded-xl mb-2`}>
                    <Text
                      style={tw`text-gray-800 font-medium`}>{`${item.month} ${item.date}`}</Text>
                    <TouchableOpacity onPress={() => handleRemoveDate(index)}>
                      <Icon name="close" size={16} color="#555" />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>

              <TouchableOpacity
                onPress={handleSaveDates}
                style={tw`bg-gray-400 py-2 rounded-xl w-20 left-8`}>
                <Text style={tw`text-white text-center font-medium`}>Save</Text>
              </TouchableOpacity>
            </View>
            <View style={tw`border-r border-gray-200 right-6`}></View>
            {/* Right Column - Date Pickers */}
            <View style={tw`flex-1 `}>
              <View style={tw`flex-row justify-between mb-4 bottom-4`}>
                {/* Days Picker */}
                <View
                  style={[
                    tw`flex-1 mx-1 relative overflow-hidden rounded-lg `,
                    {height: SCROLL_HEIGHT},
                  ]}>
                  {/* Horizontal lines below each item */}
                  {extendedDays.map((_, index) => (
                    <View
                      key={`line-day-${index}`}
                      style={[
                        tw`absolute left-0 right-0  bg-gray-300`,
                        {top: (index + 1) * ITEM_HEIGHT - 1, height: 1},
                      ]}
                    />
                  ))}

                  <ScrollView
                    ref={dayScrollRef}
                    showsVerticalScrollIndicator={false}
                    snapToInterval={ITEM_HEIGHT}
                    decelerationRate="fast"
                    onMomentumScrollEnd={handleDayScroll}
                    onScrollEndDrag={handleDayScroll}
                    contentContainerStyle={{paddingVertical: ITEM_HEIGHT}}>
                    {extendedDays.map((day, index) => (
                      <View key={`${day}-${index}`} style={tw`relative`}>
                        <TouchableOpacity
                          style={[
                            tw`items-center justify-center`,
                            {height: ITEM_HEIGHT},
                          ]}
                          onPress={() => handleDateChange(day)}>
                          <Text
                            style={tw`${
                              selectedDate === day
                                ? 'text-black font-bold text-xs'
                                : 'text-gray-400 text-xs'
                            }`}>
                            {day}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </ScrollView>
                </View>

                {/* Months Picker */}
                <View
                  style={[
                    tw`flex-1 mx-1 relative overflow-hidden rounded-lg  `,
                    {height: SCROLL_HEIGHT},
                  ]}>
                  {/* Horizontal lines below each item */}
                  {extendedMonths.map((_, index) => (
                    <View
                      key={`line-month-${index}`}
                      style={[
                        tw`absolute left-0 right-0  bg-gray-300 `,
                        {top: (index + 1) * ITEM_HEIGHT - 1, height: 1},
                      ]}
                    />
                  ))}

                  <ScrollView
                    ref={monthScrollRef}
                    showsVerticalScrollIndicator={false}
                    snapToInterval={ITEM_HEIGHT}
                    decelerationRate="fast"
                    onMomentumScrollEnd={handleMonthScroll}
                    onScrollEndDrag={handleMonthScroll}
                    contentContainerStyle={{paddingVertical: ITEM_HEIGHT}}>
                    {extendedMonths.map((month, index) => (
                      <View key={`${month}-${index}`} style={tw`relative`}>
                        <TouchableOpacity
                          style={[
                            tw`items-center justify-center`,
                            {height: ITEM_HEIGHT},
                          ]}
                          onPress={() => handleMonthChange(month)}>
                          <Text
                            style={tw`${
                              selectedMonth === month
                                ? 'text-black font-bold text-xs'
                                : 'text-gray-400 text-xs font-normal'
                            }`}>
                            {month}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </ScrollView>
                </View>
              </View>
              {/* Buttons and Options */}
              <View style={tw`bottom-4`}>
                <View style={tw`flex-row items-center justify-center `}>
                  <TouchableOpacity
                    onPress={onCancel}
                    style={tw`bg-gray-400 items-center justify-center rounded-md w-16 h-8 right-2`}>
                    <Text style={tw`text-white font-medium text-xs`}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleAddDate}
                    style={tw`bg-blue-500 items-center justify-center rounded-md w-16 h-8 left-2`}>
                    <Text style={tw`text-white font-medium text-xs`}>
                      Add Date
                    </Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  onPress={() => setShowNextDay(!showNextDay)}
                  style={tw`flex-row items-center right-4 top-4`}>
                  <Ionicons
                    name={showNextDay ? 'radio-button-on' : 'radio-button-off'}
                    size={20}
                    color={showNextDay ? '#3B82F6' : '#9CA3AF'}
                    style={tw`mr-2`}
                  />
                  <Text style={tw`text-gray-400 text-xs font-normal`}>
                    Show Daily from start date Until Complete
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DateSelector;
