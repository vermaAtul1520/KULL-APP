import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Language configuration
const LANGUAGE_KEY = '@app_language';

const translations = {
  en: {
    settings: 'Settings',
    language: 'Language',
    english: 'English',
    hindi: 'हिंदी',
    theme: 'Theme',
    languageUpdated: 'Language updated successfully',
    ok: 'OK',
    general: 'General',
    dark: 'Dark',
    light: 'Light',
    logout: 'Logout',
    'Are you sure you want to logout?': 'Are you sure you want to logout?',
    Cancel: 'Cancel',
    Logout: 'Logout',
    // Menu items
    Occasions: 'Occasions',
    Kartavya: 'Kartavya',
    Bhajan: 'Bhajan',
    Games: 'Games',
    CitySearch: 'City Search',
    OrganizationOfficer: 'Organization Officer',
    Education: 'Education',
    Employment: 'Employment',
    Sports: 'Sports',
    Dukan: 'Dukan',
    Meetings: 'Meetings',
    Appeal: 'Appeal',
    Vote: 'Vote',
  },
  hi: {
    settings: 'सेटिंग्स',
    language: 'भाषा',
    english: 'English',
    hindi: 'हिंदी',
    theme: 'थीम',
    languageUpdated: 'भाषा सफलतापूर्वक अपडेट हो गई',
    ok: 'ठीक है',
    general: 'सामान्य',
    dark: 'डार्क',
    light: 'लाइट',
    logout: 'लॉगआउट',
    'Are you sure you want to logout?': 'क्या आप वाकई लॉगआउट करना चाहते हैं?',
    Cancel: 'रद्द करें',
    Logout: 'लॉगआउट',
    // Menu items
    Occasions: 'अवसर',
    Kartavya: 'कर्तव्य',
    Bhajan: 'भजन',
    Games: 'खेल',
    CitySearch: 'शहर खोज',
    OrganizationOfficer: 'संगठन अधिकारी',
    Education: 'शिक्षा',
    Employment: 'रोजगार',
    Sports: 'खेल',
    Dukan: 'दुकान',
    Meetings: 'बैठकें',
    Appeal: 'अपील',
    Vote: 'वोट',
    // Bhajan Screen
    'Bhajan Collection': 'भजन संग्रह',
    'Search bhajans by title, artist, category...': 'शीर्षक, कलाकार, श्रेणी के अनुसार भजन खोजें...',
    'result found': 'परिणाम मिला',
    'results found': 'परिणाम मिले',
    'No results found': 'कोई परिणाम नहीं मिला',
    'Try searching with different keywords or clear the search to see all bhajans': 'अलग शब्दों से खोजने की कोशिश करें या सभी भजन देखने के लिए खोज साफ़ करें',
    'Clear Search': 'खोज साफ़ करें',
    'No bhajans available': 'कोई भजन उपलब्ध नहीं',
    'Bhajan videos will appear here when available': 'भजन वीडियो उपलब्ध होने पर यहाँ दिखाई देंगे',
    'Loading bhajans...': 'भजन लोड हो रहे हैं...',
    'Play Video': 'वीडियो चलाएं',
    'How would you like to watch this bhajan?': 'आप इस भजन को कैसे देखना चाहेंगे?',
    'In App': 'ऐप में',
    'YouTube App': 'YouTube ऐप',
    'Cancel': 'रद्द करें',
    'views': 'बार देखा गया',
  },
};

// Create context
const LanguageContext = createContext({
  currentLanguage: 'en',
  setLanguage: (language: string) => {},
  t: (key: string) => key,
  translations,
});

// Provider component
export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  // Load language from AsyncStorage on app start
  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
        if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'hi')) {
          setCurrentLanguage(savedLanguage);
        }
      } catch (error) {
        console.error('Error loading language:', error);
      }
    };

    loadLanguage();
  }, []);

  // Function to change language and save to AsyncStorage
  const setLanguage = async (language: string) => {
    try {
      if (language === 'en' || language === 'hi') {
        await AsyncStorage.setItem(LANGUAGE_KEY, language);
        setCurrentLanguage(language);
      }
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  // Translation function
  const t = (key: string) => {
    return translations[currentLanguage]?.[key] || key;
  };

  const value = {
    currentLanguage,
    setLanguage,
    t,
    translations,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook to use language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};