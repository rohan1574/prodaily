import React, { createContext, useState, ReactNode } from 'react';

// Define the context type
interface ColorContextType {
  selectedColor: string;
  setSelectedColor: (color: string) => void;
}

// Create the context with an initial value of undefined
const ColorContext = createContext<ColorContextType | undefined>(undefined);

interface ColorProviderProps {
  children: ReactNode;
}

const ColorProvider = ({ children }: ColorProviderProps) => {
  const [selectedColor, setSelectedColor] = useState<string>('#3580FF'); // default color

  return (
    <ColorContext.Provider value={{ selectedColor, setSelectedColor }}>
      {children}
    </ColorContext.Provider>
  );
};

export { ColorContext, ColorProvider };
