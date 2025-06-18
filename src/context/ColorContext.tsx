import React, { createContext, useState, ReactNode, useContext } from 'react';

// Define the context type
interface ColorContextType {
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  isPremium: boolean;
  unlockPremium: () => void;
}

// Create the context with an initial value of undefined
const ColorContext = createContext<ColorContextType | undefined>(undefined);

interface ColorProviderProps {
  children: ReactNode;
}

const ColorProvider = ({ children }: ColorProviderProps) => {
  const [selectedColor, setSelectedColor] = useState<string>(''); // default color
  const [isPremium, setIsPremium] = useState<boolean>(false);

  const unlockPremium = () => {
    setIsPremium(true);
    // In a real app, you would handle purchase verification here
  };

  return (
    <ColorContext.Provider value={{ 
      selectedColor, 
      setSelectedColor,
      isPremium,
      unlockPremium
    }}>
      {children}
    </ColorContext.Provider>
  );
};

// Custom hook for easier context consumption
const useColorContext = () => {
  const context = useContext(ColorContext);
  if (!context) {
    throw new Error('useColorContext must be used within a ColorProvider');
  }
  return context;
};

export { ColorContext, ColorProvider, useColorContext };