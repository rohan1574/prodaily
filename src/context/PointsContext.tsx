// src/context/PointsContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type PointsContextType = {
  points: number;
  addPoints: (amount: number) => Promise<void>;
  resetPoints: () => Promise<void>;
};

const PointsContext = createContext<PointsContextType | undefined>(undefined);

export const PointsProvider = ({ children }: { children: ReactNode }) => {
  const [points, setPoints] = useState<number>(0);

  // Load points from storage on mount
 useEffect(() => {
  const loadPoints = async () => {
    try {
      const savedPoints = await AsyncStorage.getItem('@userPoints');
      // নতুন ইউজারের জন্য ডিফল্ট 0 সেট করুন
      if (!savedPoints) {
        await AsyncStorage.setItem('@userPoints', '0');
      }
      setPoints(savedPoints ? parseInt(savedPoints, 10) : 0);
    } catch (error) {
      console.error('Error loading points:', error);
    }
  };
  loadPoints();
}, []);

  // Save points to storage whenever they change
  useEffect(() => {
    const savePoints = async () => {
      try {
        await AsyncStorage.setItem('@userPoints', points.toString());
      } catch (error) {
        console.error('Error saving points:', error);
      }
    };
    savePoints();
  }, [points]);

  const addPoints = async (amount: number) => {
    setPoints(prev => prev + amount);
  };

  const resetPoints = async () => {
    setPoints(0);
    await AsyncStorage.setItem('@userPoints', '0');
  };

  return (
    <PointsContext.Provider value={{ points, addPoints, resetPoints }}>
      {children}
    </PointsContext.Provider>
  );
};

export const usePoints = () => {
  const context = useContext(PointsContext);
  if (!context) {
    throw new Error('usePoints must be used within a PointsProvider');
  }
  return context;
};