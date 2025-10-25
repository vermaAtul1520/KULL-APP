import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DrawerNavigationContextType {
  navigationHistory: string[];
  addToHistory: (screenName: string) => void;
  getPreviousDrawerScreen: () => string | null;
  clearHistory: () => void;
}

const DrawerNavigationContext = createContext<DrawerNavigationContextType | undefined>(undefined);

export const DrawerNavigationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [navigationHistory, setNavigationHistory] = useState<string[]>([]);

  const addToHistory = (screenName: string) => {
    setNavigationHistory(prev => {
      // Don't add the same screen consecutively
      if (prev.length > 0 && prev[prev.length - 1] === screenName) {
        return prev;
      }
      // Keep only last 10 screens to prevent memory issues
      const newHistory = [...prev, screenName];
      return newHistory.slice(-10);
    });
  };

  const getPreviousDrawerScreen = () => {
    if (navigationHistory.length < 2) {
      return null;
    }
    // Return the second-to-last screen (previous screen)
    return navigationHistory[navigationHistory.length - 2];
  };

  const clearHistory = () => {
    setNavigationHistory([]);
  };

  return (
    <DrawerNavigationContext.Provider
      value={{
        navigationHistory,
        addToHistory,
        getPreviousDrawerScreen,
        clearHistory,
      }}
    >
      {children}
    </DrawerNavigationContext.Provider>
  );
};

export const useDrawerNavigation = () => {
  const context = useContext(DrawerNavigationContext);
  if (context === undefined) {
    throw new Error('useDrawerNavigation must be used within a DrawerNavigationProvider');
  }
  return context;
};
