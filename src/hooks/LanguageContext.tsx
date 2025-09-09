import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LANGUAGE_KEY = '@app_language';

const translations = {
  en: {
    // Home Screen
    samajKeTaj: 'Samaj Ke Taj',
    latestNews: 'Latest News',
    loadingProfiles: 'Loading profiles...',
    profileDetails: 'Profile Details',
    age: 'Age',
    father: 'Father',
    contactInformation: 'Contact Information',
    interests: 'Interests',
    hobbies: 'Hobbies',
    
    // Menu Items
    occasions: 'Occasions',
    kartavya: 'Kartavya',
    bhajan: 'Bhajan',
    games: 'Games',
    citySearch: 'City Search',
    organizationOfficer: 'Organization Officer',
    education: 'Education',
    employment: 'Employment',
    sports: 'Sports',
    dukan: 'Dukan',
    meetings: 'Meetings',
    appeal: 'Appeal',
    vote: 'Vote',
    settings: 'Settings',
    logout: 'Logout',
    
    // Common
    ok: 'OK',
    cancel: 'Cancel',
    yes: 'Yes',
    no: 'No',
    save: 'Save',
    loading: 'Loading...',
    
    // Settings
    language: 'Language',
    theme: 'Theme',
    general: 'General',
    english: 'English',
    hindi: 'हिंदी',
    dark: 'Dark',
    light: 'Light',
    languageUpdated: 'Language updated successfully',
    
    // Auth
    areYouSureLogout: 'Are you sure you want to logout?',
  },
  hi: {
    // Home Screen
    samajKeTaj: 'समाज के ताज',
    latestNews: 'नवीनतम समाचार',
    loadingProfiles: 'प्रोफाइल लोड हो रहे हैं...',
    profileDetails: 'प्रोफ़ाइल विवरण',
    age: 'आयु',
    father: 'पिता',
    contactInformation: 'संपर्क जानकारी',
    interests: 'रुचियां',
    hobbies: 'शौक',
    
    // Menu Items
    occasions: 'अवसर',
    kartavya: 'कर्तव्य',
    bhajan: 'भजन',
    games: 'खेल',
    citySearch: 'शहर खोज',
    organizationOfficer: 'संगठन अधिकारी',
    education: 'शिक्षा',
    employment: 'रोजगार',
    sports: 'खेल',
    dukan: 'दुकान',
    meetings: 'बैठकें',
    appeal: 'अपील',
    vote: 'वोट',
    settings: 'सेटिंग्स',
    logout: 'लॉगआउट',
    
    // Common
    ok: 'ठीक है',
    cancel: 'रद्द करें',
    yes: 'हां',
    no: 'नहीं',
    save: 'सेव करें',
    loading: 'लोड हो रहा है...',
    
    // Settings
    language: 'भाषा',
    theme: 'थीम',
    general: 'सामान्य',
    english: 'English',
    hindi: 'हिंदी',
    dark: 'डार्क',
    light: 'लाइट',
    languageUpdated: 'भाषा सफलतापूर्वक अपडेट हो गई',
    
    // Auth
    areYouSureLogout: 'क्या आप वाकई लॉगआउट करना चाहते हैं?',
  },
};

// Create Context
const LanguageContext = createContext();

// Provider Component
export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  useEffect(() => {
    loadLanguage();
  }, []);

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

  const setLanguage = async (language) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_KEY, language);
      setCurrentLanguage(language); // This will trigger re-render in ALL components
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  const t = (key) => {
    return translations[currentLanguage][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook to use language with proper typing
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};