import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {s as tw} from 'react-native-wind';
import DateSelector from '../prodaily/src/screens/DateSelector';
import DatePicker from '../prodaily/src/screens/DatePicker';
import DayPicker from '../prodaily/src/screens/DayPicker';

// Category Icons
const categoryIcons: Record<string, any> = {
  Fitness: require('./assets/images/fitness.png'),
  Wellness: require('./assets/images/wellness.png'),
  Productivity: require('./assets/images/work.png'),
  Nutrition: require('./assets/images/nutrition.png'),
  Sleep: require('./assets/images/nutrition.png'),
  Growth: require('./assets/images/nutrition.png'),
  Household: require('./assets/images/nutrition.png'),
  Social: require('./assets/images/nutrition.png'),
  'Self-Care': require('./assets/images/nutrition.png'),
  Financials: require('./assets/images/nutrition.png'),
  Career: require('./assets/images/nutrition.png'),
  Tech: require('./assets/images/nutrition.png'),
  Academic: require('./assets/images/nutrition.png'),
  Spiritual: require('./assets/images/nutrition.png'),
  Pet: require('./assets/images/nutrition.png'),
};

// Task Data
const tasksData: Record<string, any> = {
  Fitness: {
    Walking: require('./assets/images/Walking.png'),
    Running: require('./assets/images/Running.png'),
    Swimming: require('./assets/images/Swimming.png'),
    Cycling: require('./assets/images/Cycling.png'),
    Yoga: require('./assets/images/Yoga.png'),
    'Strength Workout': require('./assets/images/StrengthWorkout.png'),
    'Stretching Workout': require('./assets/images/StretchingWorkout.png'),
    'High Intensive Interval Trainning': require('./assets/images/High.png'),
    'Rope Jumping': require('./assets/images/RopeJumping.png'),
    'Dance Workout': require('./assets/images/DanceWorkout.png'),
    Others: require('./assets/images/Others.png'),
  },
  Wellness: {
    'Meditation 🧘‍♂️': require('./assets/images/Walking.png'),
    'Breathing Exercises 💨': require('./assets/images/Walking.png'),
    'Journaling 📝': require('./assets/images/Walking.png'),
    'Mindfulness 🙏': require('./assets/images/Walking.png'),
    'Gratitude Practice ❤️': require('./assets/images/Walking.png'),
    'Affirmations 💬': require('./assets/images/Walking.png'),
    'Visualization 🔮': require('./assets/images/Walking.png'),
    'Relaxation 😌': require('./assets/images/Walking.png'),
    'Nature Interaction 🌳': require('./assets/images/Walking.png'),
    'Laughing & Smiling 😄': require('./assets/images/Walking.png'),
    'Digital Detox 📴': require('./assets/images/Walking.png'),
    'Creative Outlets 🎨': require('./assets/images/Walking.png'),
    'Engaging in Fun Activities 🎉': require('./assets/images/Walking.png'),
    'Watching Comedies 📺': require('./assets/images/Walking.png'),
    'Barefoot Earth Touching': require('./assets/images/Walking.png'),
    'Other Wellness': require('./assets/images/Walking.png'),
  },

  Productivity: {
    'Regular Job/Duty': require('./assets/images/Walking.png'),
    'Task Management 📋': require('./assets/images/Walking.png'),
    'Pomodoro Technique ⏲️': require('./assets/images/Walking.png'),
    'Deep Work 🧑‍💻': require('./assets/images/Walking.png'),
    'Email Check 📧': require('./assets/images/Walking.png'),
    'Meetings & Calls 📞': require('./assets/images/Walking.png'),
    'Team Brainstorming 💡': require('./assets/images/Walking.png'),
    'Research & Analysis 🔍': require('./assets/images/Walking.png'),
    'Project Planning 📅': require('./assets/images/Walking.png'),
    'Writing & Documentation ✍️': require('./assets/images/Walking.png'),
    'Professional Communication 💻': require('./assets/images/Walking.png'),
    'Prototyping Concept 🎨': require('./assets/images/Walking.png'),
    'Reviewing Progress 📊': require('./assets/images/Walking.png'),
    'Skill Development 📚': require('./assets/images/Walking.png'),
    'Seeking Opportunities': require('./assets/images/Walking.png'),
    'Passive Income': require('./assets/images/Walking.png'),
    'Other Work': require('./assets/images/Walking.png'),
  },

  Nutrition: {
    'Breakfast 🍳': require('./assets/images/Walking.png'),
    'Lunch 🥗': require('./assets/images/Walking.png'),
    'Dinner 🍲': require('./assets/images/Walking.png'),
    'Snacks 🍿': require('./assets/images/Walking.png'),
    'Sufficient Drink Water 💧': require('./assets/images/Walking.png'),
    'Supplements/Vitamins 💊': require('./assets/images/Walking.png'),
    'Meal Prepping 🍴': require('./assets/images/Walking.png'),
    'Eating Fruits': require('./assets/images/Walking.png'),
    'Keep Vegetable': require('./assets/images/Walking.png'),
    'Avoiding Junk Food': require('./assets/images/Walking.png'),
    'Avoiding Fast Food': require('./assets/images/Walking.png'),
    'Avoiding Processed Food': require('./assets/images/Walking.png'),
    Fasting: require('./assets/images/Walking.png'),
    'Water Fasting': require('./assets/images/Walking.png'),
  },
  Sleep: {
    'Maintain Sleep Schedule 💤': require('./assets/images/Walking.png'),
    'Power Naps 😴': require('./assets/images/Walking.png'),
    'Healthy Sleep Practices 🛁': require('./assets/images/Walking.png'),
    'Sleep Tracking 🕒': require('./assets/images/Walking.png'),
    'Early to Bed': require('./assets/images/Walking.png'),
    'Early to Rise': require('./assets/images/Walking.png'),
    'Keep Device out of Bed': require('./assets/images/Walking.png'),
    'Making Room Dark': require('./assets/images/Walking.png'),
    'Noise Cancellation': require('./assets/images/Walking.png'),
  },
  Growth: {
    'Reading 📚': require('./assets/images/Walking.png'),
    'Courses 💻': require('./assets/images/Walking.png'),
    'Podcasts/Audiobooks 🎧': require('./assets/images/Walking.png'),
    'Language Learning 🗣️': require('./assets/images/Walking.png'),
    'Writing ✍️': require('./assets/images/Walking.png'),
    'Skill Practice 🖥️': require('./assets/images/Walking.png'),
    'Creative Writing/Blogging 📝': require('./assets/images/Walking.png'),
    'Financial Awareness 📈': require('./assets/images/Walking.png'),
    'Eyes on News': require('./assets/images/Walking.png'),
    'Tech Up to Date': require('./assets/images/Walking.png'),
  },
  Household: {
    'Cleaning 🧽': require('./assets/images/Walking.png'),
    'Laundry 🧺': require('./assets/images/Walking.png'),
    'Dishwashing 🍽️': require('./assets/images/Walking.png'),
    'Organizing Home 🧳': require('./assets/images/Walking.png'),
    'Grocery Shopping 🛒': require('./assets/images/Walking.png'),
    'Decluttering 🗑️': require('./assets/images/Walking.png'),
    'Making the Bed 🛏️': require('./assets/images/Walking.png'),
    'Cooking 🍳': require('./assets/images/Walking.png'),
    'Taking Out Trash 🚮': require('./assets/images/Walking.png'),
    'Gardening 🌿': require('./assets/images/Walking.png'),
    'Home Maintenance': require('./assets/images/Walking.png'),
    'Car Maintenance': require('./assets/images/Walking.png'),
    Shopping: require('./assets/images/Walking.png'),
  },
  Social: {
    'Family Time 👨‍👩‍👧‍👦': require('./assets/images/Walking.png'),
    'Friend Catch-ups 👯‍♂️': require('./assets/images/Walking.png'),
    'Partner Time 💕': require('./assets/images/Walking.png'),
    'Networking 🌐': require('./assets/images/Walking.png'),
    'Social Media Engagement 📱': require('./assets/images/Walking.png'),
    'Mentorship 👩‍🏫': require('./assets/images/Walking.png'),
    'Helping F&F 🤝': require('./assets/images/Walking.png'),
    'Calling F&F ☎️': require('./assets/images/Walking.png'),
    'Community Activities 🏘️': require('./assets/images/Walking.png'),
    'Quality Conversations 💬': require('./assets/images/Walking.png'),
    'Expressing Gratitude 🙏': require('./assets/images/Walking.png'),
    'Take Care Loved Ones ❤️': require('./assets/images/Walking.png'),
    'Celebrating Occasions 🎉': require('./assets/images/Walking.png'),
  },
  'Self-Care': {
    'Skincare 🧴': require('./assets/images/Walking.png'),
    'Hair Care 💇‍♀️': require('./assets/images/Walking.png'),
    'Nail Care 💅': require('./assets/images/Walking.png'),
    'Bath/Shower 🚿': require('./assets/images/Walking.png'),
    'Creative Expression 🎭': require('./assets/images/Walking.png'),
    'Artistic Hobbies 🎶': require('./assets/images/Walking.png'),
    'Relaxation Time ☕': require('./assets/images/Walking.png'),
    'Deep Breathing 🌬️': require('./assets/images/Walking.png'),
    Sunbathing: require('./assets/images/Walking.png'),
  },
  Financials: {
    'Budgeting 💳': require('./assets/images/Walking.png'),
    'Track Expenses 💸': require('./assets/images/Walking.png'),
    'Saving 💵': require('./assets/images/Walking.png'),
    'House Rent 🏠': require('./assets/images/Walking.png'),
    'Investment Planning 📊': require('./assets/images/Walking.png'),
    'Electricity Bill ⚡': require('./assets/images/Walking.png'),
    'Internet Bill 🌐': require('./assets/images/Walking.png'),
    'Video Streaming Bill 📺': require('./assets/images/Walking.png'),
    'Academic Bill 📚': require('./assets/images/Walking.png'),
    'Tax Return 🧾': require('./assets/images/Walking.png'),
    'VAT Return 💼': require('./assets/images/Walking.png'),
    'Gas Bill 🔥': require('./assets/images/Walking.png'),
    'Insurance Installment 🏦': require('./assets/images/Walking.png'),
    'Debt Installment 💰': require('./assets/images/Walking.png'),
    'DPS Installment 📈': require('./assets/images/Walking.png'),
    'Pension Installment 👵': require('./assets/images/Walking.png'),
    'Telephone/Mobile Recharge 📞': require('./assets/images/Walking.png'),
    'Maid Allowance 🧹': require('./assets/images/Walking.png'),
    'Driver Salary 🚖': require('./assets/images/Walking.png'),
  },
  Career: {
    'Skill Development 🧑‍🏫': require('./assets/images/Walking.png'),
    'Networking 🌐': require('./assets/images/Walking.png'),
    'Resume/CV Updates 📑': require('./assets/images/Walking.png'),
    'Certifications & Trainings 🎓': require('./assets/images/Walking.png'),
    'Portfolio Building 📂': require('./assets/images/Walking.png'),
    'Public Speaking 🎙️': require('./assets/images/Walking.png'),
    'Workshops & Seminars 🎤': require('./assets/images/Walking.png'),
    'Leadership Development 👔': require('./assets/images/Walking.png'),
    'Reading Industry News 📰': require('./assets/images/Walking.png'),
    'Learning a New Tool 🖥️': require('./assets/images/Walking.png'),
    'Time Management Practice ⏳': require('./assets/images/Walking.png'),
    'Goal Setting & Planning 🎯': require('./assets/images/Walking.png'),
    'Professional Mentorship 🤝': require('./assets/images/Walking.png'),
    'Problem-Solving Exercises 🧩': require('./assets/images/Walking.png'),
    'Job Applications 🏢': require('./assets/images/Walking.png'),
  },
  Tech: {
    'Device Maintenance 📱': require('./assets/images/Walking.png'),
    'File Organization 🗂️': require('./assets/images/Walking.png'),
    'App Management 📲': require('./assets/images/Walking.png'),
    'Password Management 🔑': require('./assets/images/Walking.png'),
    'Data Backup 💾': require('./assets/images/Walking.png'),
    'Security Checks (e.g., 2FA) 🔒': require('./assets/images/Walking.png'),
    'Software Updates 🖥️': require('./assets/images/Walking.png'),
    'Clearing Cache & Junk Files 🧹': require('./assets/images/Walking.png'),
    'Managing Cloud Storage ☁️': require('./assets/images/Walking.png'),
    'Checking Emails & Notifications 📩': require('./assets/images/Walking.png'),
    'Tech Learning & Skill Improvement 🎓': require('./assets/images/Walking.png'),
    'Troubleshooting Issues 🛠️': require('./assets/images/Walking.png'),
    'Review Subscriptions 💳': require('./assets/images/Walking.png'),
    'Optimizing Device Performance 🚀': require('./assets/images/Walking.png'),
    'Unsubscribe Unwanted Emails 📬': require('./assets/images/Walking.png'),
  },
  Academic: {
    'Class Attending': require('./assets/images/Walking.png'),
    'Studying 📚': require('./assets/images/Walking.png'),
    'Researching 🔍': require('./assets/images/Walking.png'),
    'Writing Papers ✍️': require('./assets/images/Walking.png'),
    'Group Study 👥': require('./assets/images/Walking.png'),
    'Exams Preparation 📝': require('./assets/images/Walking.png'),
    'Note-Taking 📝': require('./assets/images/Walking.png'),
    'Self Learning 💻': require('./assets/images/Walking.png'),
    'Model Test Taking': require('./assets/images/Walking.png'),
    'Practical Project': require('./assets/images/Walking.png'),
  },
  Spiritual: {
    'Prayer 🙏': require('./assets/images/Walking.png'),
    'Reading Sacred Texts 📜': require('./assets/images/Walking.png'),
    'Attending Religious Program ⛪': require('./assets/images/Walking.png'),
    'Meditation 🧘‍♂️': require('./assets/images/Walking.png'),
    'Fasting 🍽️': require('./assets/images/Walking.png'),
    'Spiritual Journaling 📓': require('./assets/images/Walking.png'),
    'Community Service/Charity 👐': require('./assets/images/Walking.png'),
    'Donations/Charity ❤️': require('./assets/images/Walking.png'),
    'Going Church/Mosque': require('./assets/images/Walking.png'),
    'Learning Religions': require('./assets/images/Walking.png'),
    'Watching Lectures': require('./assets/images/Walking.png'),
  },
  Pet: {
    'Walking Pets 🐕': require('./assets/images/Walking.png'),
    'Feeding Pets 🍖': require('./assets/images/Walking.png'),
    'Grooming Pets ✂️': require('./assets/images/Walking.png'),
    'Training Pets 🐕‍🦺': require('./assets/images/Walking.png'),
    'Bathing Pets': require('./assets/images/Walking.png'),
    'Vet Appointments 🏥': require('./assets/images/Walking.png'),
    'Playtime 🐾': require('./assets/images/Walking.png'),
  },
};

// List of categories
const categories = Object.keys(categoryIcons);

// Make Infinite Scroll Data (Repeat categories)
const infiniteCategories = [...categories, ...categories, ...categories];

const DailyTaskScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>(
    categories[0],
  );
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  // Handle scrolling and auto-select first visible category
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollX = event.nativeEvent.contentOffset.x;
    const categoryWidth = 80; // Approximate width of each category item

    const firstVisibleIndex =
      Math.round(scrollX / categoryWidth) % categories.length;
    setSelectedCategory(categories[firstVisibleIndex]);
  };

  // Infinite Scroll Effect
  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollX = event.nativeEvent.contentOffset.x;
    const categoryWidth = 80;
    const totalWidth = categoryWidth * categories.length;

    if (scrollX >= totalWidth) {
      scrollViewRef.current?.scrollTo({x: 0, animated: false});
    }
  };
  const [duration, setDuration] = useState('Day');
  const [target, setTarget] = useState('30');
  const [oneTime, setOneTime] = useState('Weekly');
  const [selectedModal, setSelectedModal] = useState<
    'weekly' | 'monthly' | 'yearly' | null
  >(null);

  return (
    <View style={tw`flex-1 bg-red-50 p-4`}>
      {/* Header */}
      <View style={tw`mb-2`}>
        <Text style={tw`text-xl font-bold text-black`}>Add Daily Task</Text>
        <Text style={tw`text-sm text-gray-500`}>
          Add tasks to your daily routine to stay productive.
        </Text>
      </View>

      {/* Horizontal Scrollable Categories (Fixed) */}
      <View>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          onMomentumScrollEnd={handleScrollEnd}
          scrollEventThrottle={16}>
          {infiniteCategories.map((category, index) => (
            <TouchableOpacity
              key={index}
              style={tw`items-center mx-2`}
              onPress={() => setSelectedCategory(category)}>
              <View
                style={[
                  tw`w-16 h-16 rounded-full flex items-center justify-center border-2`,
                  selectedCategory === category
                    ? tw`border-blue-500`
                    : tw`border-gray-300`,
                ]}>
                <Image source={categoryIcons[category]} style={tw`w-8 h-8`} />
              </View>
              <Text
                style={tw`text-sm mt-1 ${
                  selectedCategory === category
                    ? 'text-blue-500'
                    : 'text-gray-600'
                }`}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Task List (Scrollable) */}
      <ScrollView style={tw`flex-1 mt-4`} showsVerticalScrollIndicator={false}>
        {Object.keys(tasksData[selectedCategory] || {}).map((task, index) => (
          <View key={index} style={tw`mb-2`}>
            <TouchableOpacity
              onPress={() =>
                setExpandedTask(expandedTask === task ? null : task)
              }
              style={tw`flex-row items-center justify-between bg-white p-3 rounded-lg`}>
              <View style={tw`flex-row items-center`}>
                <Image
                  source={tasksData[selectedCategory][task]}
                  style={tw`mr-3`}
                />
                <Text style={tw`text-base font-semibold text-black`}>
                  {task}
                </Text>
              </View>
              <Icon
                name={expandedTask === task ? 'chevron-up' : 'chevron-down'}
                size={20}
                color="#DFDFDF"
              />
            </TouchableOpacity>

            {/* Expanded Tasks Options */}
            {expandedTask === task && (
              <View style={tw`p-4 bg-white rounded-2xl shadow-md w-84`}>
                {/* Header */}
                <View style={tw`flex-row items-center mb-4`}>
                  <Image
                    source={tasksData[selectedCategory][expandedTask]}
                    style={tw`mr-3`}
                  />
                  <Text style={tw`text-lg font-semibold ml-2 text-gray-900`}>
                    {expandedTask}
                  </Text>
                </View>

                {/* Routine Duration */}
                <Text style={tw`text-gray-600 mb-2`}>Add spcefic for</Text>
                <View style={tw`flex-row items-center mb-4`}>
                  <TextInput
                    value="365"
                    keyboardType="numeric"
                    style={tw`border border-gray-300 rounded-lg px-2 w-16 text-center`}
                  />
                  {['Day', 'Week', 'Month'].map(item => (
                    <TouchableOpacity
                      key={item}
                      onPress={() => setDuration(item)}
                      style={tw`ml-2 px-3 py-1 rounded-lg ${
                        duration === item
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200'
                      }`}>
                      <Text
                        style={tw`${
                          duration === item ? 'text-white' : 'text-gray-700'
                        }`}>
                        {item}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Daily Target */}
                <View style={tw`flex-row items-center mb-4`}>
                  <TouchableOpacity style={tw`mr-2`}>
                    <Icon name="radio-button-on" size={20} color="#3B82F6" />
                  </TouchableOpacity>
                  <Text style={tw`text-gray-700 mr-2`}>Set Daily Target</Text>
                  <TextInput
                    value={target}
                    onChangeText={setTarget}
                    keyboardType="numeric"
                    style={tw`border border-gray-300 rounded-lg px-2 w-16 text-center`}
                  />
                  <Text style={tw`text-gray-700 ml-2`}>Min</Text>
                </View>

                {/* One-Time Selection */}
                <View style={tw`flex-row items-center mb-4`}>
                  <TouchableOpacity style={tw`mr-2`}>
                    <Icon name="radio-button-on" size={20} color="#3B82F6" />
                  </TouchableOpacity>
                  <Text style={tw`text-gray-700 mr-2`}>Add once a</Text>
                  {['Weekly', 'Monthly', 'Yearly'].map(item => (
                    <TouchableOpacity
                      key={item}
                      onPress={() => {
                        setOneTime(item);
                        if (item === 'Weekly') setSelectedModal('weekly');
                        if (item === 'Monthly') setSelectedModal('monthly');
                        if (item === 'Yearly') setSelectedModal('yearly');
                      }}
                      style={tw`px-2 py-1 rounded-lg ${
                        oneTime === item ? 'bg-blue-500' : 'bg-gray-200'
                      }`}>
                      <Text
                        style={tw`${
                          oneTime === item ? 'text-white' : 'text-gray-700'
                        }`}>
                        {item}
                      </Text>
                    </TouchableOpacity>
                  ))}
                  {/* DayPicker Modal */}
                  <Modal
                    visible={selectedModal === 'weekly'}
                    animationType="slide"
                    transparent={true}>
                    <View
                      style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}>
                      <View style={tw`bg-white p-4 rounded-lg w-3/4`}>
                        <DayPicker onCancel={() => setSelectedModal(null)} />
                      </View>
                    </View>
                  </Modal>
                  {/* DatePicker Modal */}
                  <Modal
                    visible={selectedModal === 'monthly'}
                    animationType="slide"
                    transparent={true}>
                    <View
                      style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}>
                      <View style={tw`bg-white p-4 rounded-lg w-3/4`}>
                        <DatePicker onCancel={() => setSelectedModal(null)} />
                      </View>
                    </View>
                  </Modal>
                  {/* DateSelector Modal */}
                  <Modal
                    visible={selectedModal === 'yearly'}
                    animationType="slide"
                    transparent={true}>
                    <View
                      style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}>
                      <View style={tw`bg-white p-4 rounded-lg w-3/4`}>
                        <DateSelector onCancel={() => setSelectedModal(null)} />
                      </View>
                    </View>
                  </Modal>
                </View>

                {/* Add to Routine Button */}
                <TouchableOpacity style={tw`bg-blue-500 py-2 rounded-lg`}>
                  <Text style={tw`text-white text-center font-semibold`}>
                    Add to Routine
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    setExpandedTask(expandedTask === task ? null : task)
                  }
                  style={tw`p-3 rounded-lg`}>
                  <Icon
                    name={expandedTask === task ? 'chevron-up' : 'chevron-down'}
                    size={24}
                    color="#3B82F6" // Blue Color
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};
export default DailyTaskScreen;
