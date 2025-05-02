import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Image,
  Modal,
} from 'react-native';
import {s as tw} from 'react-native-wind';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomNavigation from './BottomNavigation';
import Icon from 'react-native-vector-icons/Ionicons';
interface Task {
  id: string;
  name: string;
  icon?: any;
  isStarred?: boolean;
  specificForValue?: number | string;
  specificFor?: 'Days' | 'Weeks' | 'Months';
  selectedDays?: string[];
  selectedDates?: number[];
  selectedMonths?: string[];
  selectedYears?: number[];
  dailyTarget?: number;
  targetType?: 'Minutes' | 'Times';
  specTarget?: 'Weekly' | 'Monthly' | 'Yearly';
}
const AllTaskListScreen = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [editedTask, setEditedTask] = useState<any>({});
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [isSpecificForEnabled, setIsSpecificForEnabled] = useState(false);
  const [isDailyTargetEnabled, setIsDailyTargetEnabled] = useState(false);
  const [isSpecificDayOnSelected, setIsSpecificDayOnSelected] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const storedTasks = await AsyncStorage.getItem('tasks');
        setTasks(storedTasks ? JSON.parse(storedTasks) : []);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
    fetchTasks();
  }, []);

  const toggleExpansion = (taskId: string) => {
    setExpandedTaskId(prev => (prev === taskId ? null : taskId));
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setEditedTask(task);
      setIsSpecificForEnabled(!!task.specificForValue);
      setIsDailyTargetEnabled(!!task.dailyTarget);
      setIsSpecificDayOnSelected(
        !!task.selectedDays?.length || 
        !!task.selectedDates?.length || 
        !!task.selectedMonths?.length
      );
    }
  };

  const handleUpdateTask = async (taskId: string) => {
    try {
      const updatedTasks = tasks.map(task => 
        task.id === taskId ? editedTask : task
      );
      await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
      setTasks(updatedTasks);
      setExpandedTaskId(null);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  // রেডিও বাটন টগল লজিক
  const toggleSpecificFor = () => {
    const newState = !isSpecificForEnabled;
    setIsSpecificForEnabled(newState);
    setIsSpecificDayOnSelected(false);

    setEditedTask((prev: Task) => ({
      ...prev,
      specificForValue: newState ? prev.specificForValue : '',
      specificFor: newState ? prev.specificFor : 'Days',
      selectedDays: [],
      selectedDates: [],
      selectedMonths: [],
      selectedYears: [],
    }));
  };

  const toggleSpecificDayOn = () => {
    const newState = !isSpecificDayOnSelected;
    setIsSpecificDayOnSelected(newState);
    setIsSpecificForEnabled(false);

    setEditedTask((prev: Task)=> ({
      ...prev,
      specificForValue: '',
      specificFor: 'Days',
      selectedDays: newState ? prev.selectedDays : [],
      selectedDates: newState ? prev.selectedDates : [],
      selectedMonths: newState ? prev.selectedMonths : [],
      selectedYears: newState ? prev.selectedYears : [],
    }));
  };

  const toggleDaySelection = (day: string) => {
    const updatedDays = editedTask.selectedDays?.includes(day)
      ? editedTask.selectedDays.filter((d: string) => d !== day)
      : [...(editedTask.selectedDays || []), day];
    
    setEditedTask({...editedTask, selectedDays: updatedDays});
  };

  const handleMonthSelection = (month: string) => {
    const updatedMonths = editedTask.selectedMonths?.includes(month)
      ? editedTask.selectedMonths.filter((m: string) => m !== month)
      : [...(editedTask.selectedMonths || []), month];
    
    setEditedTask({...editedTask, selectedMonths: updatedMonths});
  };
  const toggleDailyTarget = () => {
    const newState = !isDailyTargetEnabled;
    setIsDailyTargetEnabled(newState);
  
    if (!newState) {
      setEditedTask((prev: Task) => ({
        ...prev,
        dailyTarget: 0,
        targetType: 'Minutes'
      }));
    }
  };
  return (
    <View style={tw`flex-1 bg-white p-4`}>
      <Text style={tw`text-2xl font-bold mb-4`}>All Tasks</Text>

      <ScrollView>
        {tasks.map(task => (
          <View key={task.id} style={tw`mb-4`}>
            <TouchableOpacity
              onPress={() => toggleExpansion(task.id)}
              style={tw`bg-gray-100 p-4 rounded-lg`}>
              <View style={tw`flex-row justify-between items-center`}>
                <View style={tw`flex-row items-center gap-2`}>
                  {task.icon && <Image source={task.icon} style={tw`w-8 h-8`} />}
                  <Text style={tw`text-lg font-semibold`}>{task.name}</Text>
                </View>
                
                <View style={tw`flex-row items-center gap-2`}>
                  <TouchableOpacity onPress={() => toggleExpansion(task.id)}>
                    <Icon
                      name={expandedTaskId === task.id ? 'chevron-up' : 'chevron-down'}
                      size={24}
                      color="#4b5563"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {expandedTaskId === task.id && (
                <View style={tw`mt-4 p-4 bg-white rounded-xl shadow-md`}>
                  {/* Specific For Section */}
                  <View style={tw`mb-6`}>
                    <View style={tw`flex-row items-center`}>
                      <TouchableOpacity onPress={toggleSpecificFor}>
                        <Icon
                          name={isSpecificForEnabled ? 'radio-button-on' : 'radio-button-off'}
                          size={20}
                          color={isSpecificForEnabled ? 'blue' : 'gray'}
                        />
                      </TouchableOpacity>
                      <TextInput
                        style={tw`border p-2 w-16 rounded ml-2 ${!isSpecificForEnabled ? 'bg-gray-100' : ''}`}
                        keyboardType="numeric"
                        value={isSpecificForEnabled ? editedTask.specificForValue?.toString() : ''}
                        onChangeText={v => 
                          setEditedTask({
                            ...editedTask,
                            specificForValue: parseInt(v) || 0
                          })
                        }
                        editable={isSpecificForEnabled}
                        placeholder="0"
                      />
                      <View style={tw`flex-row ml-2`}>
                        {['Days', 'Weeks', 'Months'].map(type => (
                          <TouchableOpacity
                            key={type}
                            style={tw`px-3 py-1 mx-1 rounded ${
                              (editedTask.specificFor === type && isSpecificForEnabled) 
                                ? 'bg-blue-500' 
                                : 'bg-gray-200'
                            }`}
                            onPress={() => isSpecificForEnabled && setEditedTask({...editedTask, specificFor: type})}
                            disabled={!isSpecificForEnabled}
                          >
                            <Text style={tw`${
                              (editedTask.specificFor === type && isSpecificForEnabled) 
                                ? 'text-white' 
                                : 'text-gray-500'
                            }`}>
                              {type}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  </View>
                   {/* Daily Target Section */}
                  <View style={tw`mb-6`}>
                    <View style={tw`flex-row items-center`}>
                      <TouchableOpacity onPress={toggleDailyTarget}>
                        <Icon
                          name={isDailyTargetEnabled ? 'radio-button-on' : 'radio-button-off'}
                          size={20}
                          color={isDailyTargetEnabled ? 'blue' : 'gray'}
                        />
                      </TouchableOpacity>
                      <Text style={tw`text-sm font-bold ml-2`}>Set Daily Target</Text>
                      <TextInput
                        style={tw`border p-2 w-16 rounded ml-2 ${
                          !isDailyTargetEnabled ? 'bg-gray-100' : ''
                        }`}
                        keyboardType="numeric"
                        value={
                          isDailyTargetEnabled 
                            ? editedTask.dailyTarget?.toString() 
                            : ''
                        }
                        onChangeText={v => 
                          setEditedTask({
                            ...editedTask,
                            dailyTarget: parseInt(v) || 0
                          })
                        }
                        editable={isDailyTargetEnabled}
                        placeholder="0"
                      />
                      <View style={tw`flex-row ml-2`}>
                        {['Minutes', 'Times'].map(type => (
                          <TouchableOpacity
                            key={type}
                            style={tw`px-3 py-1 mx-1 rounded ${
                              (editedTask.targetType === type && isDailyTargetEnabled) 
                                ? 'bg-blue-500' 
                                : 'bg-gray-200'
                            }`}
                            onPress={() => 
                              isDailyTargetEnabled && 
                              setEditedTask({...editedTask, targetType: type})
                            }
                            disabled={!isDailyTargetEnabled}
                          >
                            <Text style={tw`${
                              (editedTask.targetType === type && isDailyTargetEnabled) 
                                ? 'text-white' 
                                : 'text-gray-500'
                            }`}>
                              {type}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  </View>
                  {/* Specific Day On Section */}
                  <View style={tw`mb-6`}>
                    <View style={tw`flex-row items-center mb-4`}>
                      <TouchableOpacity onPress={toggleSpecificDayOn}>
                        <Icon
                          name={isSpecificDayOnSelected ? 'radio-button-on' : 'radio-button-off'}
                          size={20}
                          color={isSpecificDayOnSelected ? 'blue' : 'gray'}
                        />
                      </TouchableOpacity>
                      <Text style={tw`text-sm font-bold ml-2`}>Specific Day On</Text>
                    </View>

                    {isSpecificDayOnSelected && (
                      <>
                        <View style={tw`flex-row justify-between mb-4`}>
                          {['Weekly', 'Monthly', 'Yearly'].map(type => (
                            <TouchableOpacity
                              key={type}
                              style={tw`px-4 py-2 rounded-lg ${
                                editedTask.specTarget === type 
                                  ? 'bg-blue-500' 
                                  : 'bg-gray-200'
                              }`}
                              onPress={() => setEditedTask({...editedTask, specTarget: type})}
                            >
                              <Text style={tw`${
                                editedTask.specTarget === type 
                                  ? 'text-white' 
                                  : 'text-gray-700'
                              }`}>
                                {type}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </View>

                        {editedTask.specTarget === 'Weekly' && (
                          <View style={tw`flex-row flex-wrap`}>
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                              <TouchableOpacity
                                key={day}
                                style={tw`px-3 py-1 mx-1 my-1 rounded ${
                                  editedTask.selectedDays?.includes(day) 
                                    ? 'bg-blue-500' 
                                    : 'bg-gray-200'
                                }`}
                                onPress={() => toggleDaySelection(day)}
                              >
                                <Text style={tw`${
                                  editedTask.selectedDays?.includes(day) 
                                    ? 'text-white' 
                                    : 'text-gray-700'
                                }`}>
                                  {day}
                                </Text>
                              </TouchableOpacity>
                            ))}
                          </View>
                        )}

                        {editedTask.specTarget === 'Monthly' && (
                          <TextInput
                            style={tw`border p-2 rounded`}
                            placeholder="Enter dates (e.g. 1,15)"
                            value={editedTask.selectedDates?.join(', ')}
                            onChangeText={text => {
                              const dates = text.split(',').map(d => parseInt(d.trim()));
                              setEditedTask({...editedTask, selectedDates: dates});
                            }}
                          />
                        )}

                        {editedTask.specTarget === 'Yearly' && (
                          <View>
                            <View style={tw`flex-row flex-wrap mb-2`}>
                              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(month => (
                                <TouchableOpacity
                                  key={month}
                                  style={tw`px-3 py-1 mx-1 my-1 rounded ${
                                    editedTask.selectedMonths?.includes(month) 
                                      ? 'bg-blue-500' 
                                      : 'bg-gray-200'
                                  }`}
                                  onPress={() => handleMonthSelection(month)}
                                >
                                  <Text style={tw`${
                                    editedTask.selectedMonths?.includes(month) 
                                      ? 'text-white' 
                                      : 'text-gray-700'
                                  }`}>
                                    {month}
                                  </Text>
                                </TouchableOpacity>
                              ))}
                            </View>
                            <TextInput
                              style={tw`border p-2 rounded`}
                              placeholder="Enter dates (e.g. 1,15)"
                              value={editedTask.selectedDates?.join(', ')}
                              onChangeText={text => {
                                const dates = text.split(',').map(d => parseInt(d.trim()));
                                setEditedTask({...editedTask, selectedDates: dates});
                              }}
                            />
                          </View>
                        )}
                      </>
                    )}
                  </View>

                  {/* Action Buttons */}
                  <View style={tw`flex-row justify-between mt-6`}>
                    <TouchableOpacity
                      style={tw`bg-red-500 px-6 py-3 rounded-lg flex-1 mr-2`}
                      onPress={() => setExpandedTaskId(null)}
                    >
                      <Text style={tw`text-white text-center`}>Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={tw`bg-green-500 px-6 py-3 rounded-lg flex-1 ml-2`}
                      onPress={() => handleUpdateTask(task.id)}
                    >
                      <Text style={tw`text-white text-center`}>Save Changes</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <BottomNavigation />
    </View>
  );
};

export default AllTaskListScreen;