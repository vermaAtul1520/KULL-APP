// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   Alert,
//   Switch,
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import Svg, { Path, Circle } from 'react-native-svg';

// // Language configuration
// const LANGUAGE_KEY = '@app_language';

// const translations = {
//   en: {
//     settings: 'Settings',
//     language: 'Language',
//     selectLanguage: 'Select Language',
//     english: 'English',
//     hindi: 'हिंदी',
//     notifications: 'Notifications',
//     pushNotifications: 'Push Notifications',
//     emailNotifications: 'Email Notifications',
//     privacy: 'Privacy',
//     dataUsage: 'Data Usage',
//     about: 'About',
//     version: 'Version',
//     termsAndConditions: 'Terms & Conditions',
//     privacyPolicy: 'Privacy Policy',
//     support: 'Support',
//     contactUs: 'Contact Us',
//     feedback: 'Feedback',
//     rateApp: 'Rate App',
//     languageUpdated: 'Language updated successfully',
//     ok: 'OK',
//     account: 'Account',
//     profile: 'Profile',
//     changePassword: 'Change Password',
//     general: 'General',
//     theme: 'Theme',
//     security: 'Security',
//   },
//   hi: {
//     settings: 'सेटिंग्स',
//     language: 'भाषा',
//     selectLanguage: 'भाषा चुनें',
//     english: 'English',
//     hindi: 'हिंदी',
//     notifications: 'सूचनाएं',
//     pushNotifications: 'पुश सूचनाएं',
//     emailNotifications: 'ईमेल सूचनाएं',
//     privacy: 'गोपनीयता',
//     dataUsage: 'डेटा उपयोग',
//     about: 'के बारे में',
//     version: 'संस्करण',
//     termsAndConditions: 'नियम और शर्तें',
//     privacyPolicy: 'गोपनीयता नीति',
//     support: 'सहायता',
//     contactUs: 'संपर्क करें',
//     feedback: 'प्रतिक्रिया',
//     rateApp: 'ऐप को रेट करें',
//     languageUpdated: 'भाषा सफलतापूर्वक अपडेट हो गई',
//     ok: 'ठीक है',
//     account: 'खाता',
//     profile: 'प्रोफ़ाइल',
//     changePassword: 'पासवर्ड बदलें',
//     general: 'सामान्य',
//     theme: 'थीम',
//     security: 'सुरक्षा',
//   },
// };

// // SVG Icons
// const ChevronRightIcon = ({ size = 24, color = "#aaa" }) => (
//   <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
//     <Path d="M9 18l6-6-6-6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//   </Svg>
// );

// const LanguageIcon = ({ size = 24, color = "#7dd3c0" }) => (
//   <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
//     <Path d="M5 8l6 6M4 14l6-6 2-3M2 5h12M7 2h1l8 15h-1M10 18h4" 
//           stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//   </Svg>
// );

// const BellIcon = ({ size = 24, color = "#7dd3c0" }) => (
//   <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
//     <Path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" 
//           stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//     <Path d="M13.73 21a2 2 0 0 1-3.46 0" 
//           stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//   </Svg>
// );

// const ShieldIcon = ({ size = 24, color = "#7dd3c0" }) => (
//   <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
//     <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" 
//           stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//   </Svg>
// );

// const InfoIcon = ({ size = 24, color = "#7dd3c0" }) => (
//   <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
//     <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2"/>
//     <Path d="M12 16v-4M12 8h.01" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//   </Svg>
// );

// const SupportIcon = ({ size = 24, color = "#7dd3c0" }) => (
//   <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
//     <Path d="M9 12l2 2 4-4M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" 
//           stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//   </Svg>
// );

// const UserIcon = ({ size = 24, color = "#7dd3c0" }) => (
//   <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
//     <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" 
//           stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//     <Circle cx="12" cy="7" r="4" stroke={color} strokeWidth="2"/>
//   </Svg>
// );

// const SettingsScreen = ({ navigation }) => {
//   const [currentLanguage, setCurrentLanguage] = useState('en');
//   const [pushNotifications, setPushNotifications] = useState(true);
//   const [emailNotifications, setEmailNotifications] = useState(false);

//   // Load saved language on component mount
//   useEffect(() => {
//     loadLanguage();
//   }, []);

//   const loadLanguage = async () => {
//     try {
//       const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
//       if (savedLanguage) {
//         setCurrentLanguage(savedLanguage);
//       }
//     } catch (error) {
//       console.error('Error loading language:', error);
//     }
//   };

//   const saveLanguage = async (language) => {
//     try {
//       await AsyncStorage.setItem(LANGUAGE_KEY, language);
//       setCurrentLanguage(language);
//       Alert.alert(
//         translations[language].ok,
//         translations[language].languageUpdated,
//         [{ text: translations[language].ok }]
//       );
//     } catch (error) {
//       console.error('Error saving language:', error);
//     }
//   };

//   const showLanguageSelector = () => {
//     Alert.alert(
//       translations[currentLanguage].selectLanguage,
//       '',
//       [
//         {
//           text: translations[currentLanguage].english,
//           onPress: () => saveLanguage('en'),
//         },
//         {
//           text: translations[currentLanguage].hindi,
//           onPress: () => saveLanguage('hi'),
//         },
//         {
//           text: translations[currentLanguage].ok,
//           style: 'cancel',
//         },
//       ]
//     );
//   };

//   const t = translations[currentLanguage];

//   const settingSections = [
//     {
//       title: t.account,
//       items: [
//         {
//           title: t.profile,
//           icon: <UserIcon />,
//           onPress: () => navigation.navigate('Profile'),
//         },
//         {
//           title: t.changePassword,
//           icon: <ShieldIcon />,
//           onPress: () => navigation.navigate('ChangePassword'),
//         },
//       ],
//     },
//     {
//       title: t.general,
//       items: [
//         {
//           title: t.language,
//           subtitle: currentLanguage === 'hi' ? t.hindi : t.english,
//           icon: <LanguageIcon />,
//           onPress: showLanguageSelector,
//         },
//         {
//           title: t.theme,
//           subtitle: 'Dark',
//           icon: <InfoIcon />,
//           onPress: () => {},
//         },
//       ],
//     },
//     {
//       title: t.notifications,
//       items: [
//         {
//           title: t.pushNotifications,
//           icon: <BellIcon />,
//           hasSwitch: true,
//           switchValue: pushNotifications,
//           onSwitchChange: setPushNotifications,
//         },
//         {
//           title: t.emailNotifications,
//           icon: <BellIcon />,
//           hasSwitch: true,
//           switchValue: emailNotifications,
//           onSwitchChange: setEmailNotifications,
//         },
//       ],
//     },
//     {
//       title: t.privacy,
//       items: [
//         {
//           title: t.dataUsage,
//           icon: <ShieldIcon />,
//           onPress: () => navigation.navigate('DataUsage'),
//         },
//         {
//           title: t.security,
//           icon: <ShieldIcon />,
//           onPress: () => navigation.navigate('Security'),
//         },
//       ],
//     },
//     {
//       title: t.about,
//       items: [
//         {
//           title: t.version,
//           subtitle: '1.0.0',
//           icon: <InfoIcon />,
//           onPress: () => {},
//         },
//         {
//           title: t.termsAndConditions,
//           icon: <InfoIcon />,
//           onPress: () => navigation.navigate('Terms'),
//         },
//         {
//           title: t.privacyPolicy,
//           icon: <InfoIcon />,
//           onPress: () => navigation.navigate('PrivacyPolicy'),
//         },
//       ],
//     },
//     {
//       title: t.support,
//       items: [
//         {
//           title: t.contactUs,
//           icon: <SupportIcon />,
//           onPress: () => navigation.navigate('ContactUs'),
//         },
//         {
//           title: t.feedback,
//           icon: <SupportIcon />,
//           onPress: () => navigation.navigate('Feedback'),
//         },
//         {
//           title: t.rateApp,
//           icon: <SupportIcon />,
//           onPress: () => {},
//         },
//       ],
//     },
//   ];

//   const renderSettingItem = (item, index) => (
//     <TouchableOpacity
//       key={index}
//       style={styles.settingItem}
//       onPress={item.onPress}
//       disabled={item.hasSwitch}
//     >
//       <View style={styles.settingItemLeft}>
//         {item.icon}
//         <View style={styles.settingItemText}>
//           <Text style={styles.settingItemTitle}>{item.title}</Text>
//           {item.subtitle && (
//             <Text style={styles.settingItemSubtitle}>{item.subtitle}</Text>
//           )}
//         </View>
//       </View>
//       <View style={styles.settingItemRight}>
//         {item.hasSwitch ? (
//           <Switch
//             value={item.switchValue}
//             onValueChange={item.onSwitchChange}
//             trackColor={{ false: '#444', true: '#7dd3c0' }}
//             thumbColor={item.switchValue ? '#fff' : '#ccc'}
//           />
//         ) : (
//           <ChevronRightIcon />
//         )}
//       </View>
//     </TouchableOpacity>
//   );

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity
//           style={styles.backButton}
//           onPress={() => navigation.goBack()}
//         >
//           <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
//             <Path d="M19 12H5M12 19l-7-7 7-7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//           </Svg>
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>{t.settings}</Text>
//       </View>

//       {/* Settings Content */}
//       <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
//         {settingSections.map((section, sectionIndex) => (
//           <View key={sectionIndex} style={styles.section}>
//             <Text style={styles.sectionTitle}>{section.title}</Text>
//             <View style={styles.sectionContent}>
//               {section.items.map((item, itemIndex) =>
//                 renderSettingItem(item, itemIndex)
//               )}
//             </View>
//           </View>
//         ))}
        
//         {/* Bottom spacing */}
//         <View style={styles.bottomSpacing} />
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5dc',
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingVertical: 16,
//     backgroundColor: '#2a2a2a',
//     borderBottomWidth: 1,
//     borderBottomColor: '#444',
//   },
//   backButton: {
//     padding: 8,
//     marginRight: 8,
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#fff',
//   },
//   content: {
//     flex: 1,
//   },
//   section: {
//     marginTop: 24,
//     paddingHorizontal: 16,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#2a2a2a',
//     marginBottom: 12,
//     textTransform: 'uppercase',
//     letterSpacing: 0.5,
//   },
//   sectionContent: {
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     overflow: 'hidden',
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   settingItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 16,
//     paddingVertical: 16,
//     borderBottomWidth: 0.5,
//     borderBottomColor: '#f0f0f0',
//   },
//   settingItemLeft: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//   },
//   settingItemText: {
//     marginLeft: 16,
//     flex: 1,
//   },
//   settingItemTitle: {
//     fontSize: 16,
//     color: '#2a2a2a',
//     fontWeight: '500',
//   },
//   settingItemSubtitle: {
//     fontSize: 14,
//     color: '#666',
//     marginTop: 2,
//   },
//   settingItemRight: {
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   bottomSpacing: {
//     height: 32,
//   },
// });

// export default SettingsScreen;

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Svg, { Path, Circle } from 'react-native-svg';

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
  },
};

// SVG Icons
const ChevronRightIcon = ({ size = 20, color = "#aaa" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M9 18l6-6-6-6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const CheckIcon = ({ size = 20, color = "#7dd3c0" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M20 6L9 17l-5-5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const LanguageIcon = ({ size = 24, color = "#7dd3c0" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M5 8l6 6M4 14l6-6 2-3M2 5h12M7 2h1l8 15h-1M10 18h4" 
          stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const ThemeIcon = ({ size = 24, color = "#7dd3c0" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" 
          stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const BackIcon = ({ size = 24, color = "#fff" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M19 12H5M12 19l-7-7 7-7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const SettingsScreen = ({ navigation }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [currentTheme, setCurrentTheme] = useState('dark');
  const [showLanguageOptions, setShowLanguageOptions] = useState(false);
  const [showThemeOptions, setShowThemeOptions] = useState(false);

  // Load saved language on component mount
  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
        if (savedLanguage) {
          setCurrentLanguage(savedLanguage);
        }
      } catch (error) {
        console.error('Error loading language:', error);
      }
    };

    loadLanguage();
  }, []);

  console.log('currentLanguage', currentLanguage);
  

  const saveLanguage = async (language) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_KEY, language);
      setCurrentLanguage(language);
      setShowLanguageOptions(false);
      
      // Show success message in new language
      setTimeout(() => {
        Alert.alert(
          translations[language].ok,
          translations[language].languageUpdated,
          [{ text: translations[language].ok }]
        );
      }, 100);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  const handleLanguagePress = () => {
    setShowLanguageOptions(prev => !prev);
    setShowThemeOptions(false);
  };

  const handleThemePress = () => {
    setShowThemeOptions(prev => !prev);
    setShowLanguageOptions(false);
  };

  const handleBackPress = () => {
    if (navigation && navigation.goBack) {
      navigation.goBack();
    }
  };

  const t = translations[currentLanguage];

  const languageOptions = [
    { key: 'en', label: t.english },
    { key: 'hi', label: t.hindi },
  ];

  const themeOptions = [
    { key: 'dark', label: t.dark },
    { key: 'light', label: t.light },
  ];

  const renderLanguageOption = (option) => (
    <TouchableOpacity
      key={option.key}
      style={styles.optionItem}
      onPress={() => saveLanguage(option.key)}
    >
      <Text style={styles.optionText}>{option.label}</Text>
      {currentLanguage === option.key && (
        <CheckIcon size={20} color="#7dd3c0" />
      )}
    </TouchableOpacity>
  );

  const renderThemeOption = (option) => (
    <TouchableOpacity
      key={option.key}
      style={styles.optionItem}
      onPress={() => {
        setCurrentTheme(option.key);
        setShowThemeOptions(false);
      }}
    >
      <Text style={styles.optionText}>{option.label}</Text>
      {currentTheme === option.key && (
        <CheckIcon size={20} color="#7dd3c0" />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackPress}
        >
          <BackIcon size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t.settings}</Text>
      </View>

      {/* Settings Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.general}</Text>
          <View style={styles.sectionContent}>
            
            {/* Language Setting */}
            <TouchableOpacity
              style={styles.settingItem}
              onPress={handleLanguagePress}
            >
              <View style={styles.settingItemLeft}>
                <LanguageIcon />
                <View style={styles.settingItemText}>
                  <Text style={styles.settingItemTitle}>{t.language}</Text>
                  <Text style={styles.settingItemSubtitle}>
                    {currentLanguage === 'hi' ? t.hindi : t.english}
                  </Text>
                </View>
              </View>
              <View style={[styles.chevronContainer, showLanguageOptions && styles.chevronRotated]}>
                <ChevronRightIcon />
              </View>
            </TouchableOpacity>

            {/* Language Options */}
            {showLanguageOptions && (
              <View style={styles.optionsContainer}>
                {languageOptions.map(renderLanguageOption)}
              </View>
            )}

            {/* Theme Setting */}
            <TouchableOpacity
              style={[styles.settingItem, { borderBottomWidth: 0 }]}
              onPress={handleThemePress}
            >
              <View style={styles.settingItemLeft}>
                <ThemeIcon />
                <View style={styles.settingItemText}>
                  <Text style={styles.settingItemTitle}>{t.theme}</Text>
                  <Text style={styles.settingItemSubtitle}>
                    {currentTheme === 'dark' ? t.dark : t.light}
                  </Text>
                </View>
              </View>
              <View style={[styles.chevronContainer, showThemeOptions && styles.chevronRotated]}>
                <ChevronRightIcon />
              </View>
            </TouchableOpacity>

            {/* Theme Options */}
            {showThemeOptions && (
              <View style={styles.optionsContainer}>
                {themeOptions.map(renderThemeOption)}
              </View>
            )}

          </View>
        </View>
        
        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5dc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#2a2a2a',
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2a2a2a',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#f0f0f0',
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingItemText: {
    marginLeft: 16,
    flex: 1,
  },
  settingItemTitle: {
    fontSize: 16,
    color: '#2a2a2a',
    fontWeight: '500',
  },
  settingItemSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  chevronContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '0deg' }],
  },
  chevronRotated: {
    transform: [{ rotate: '90deg' }],
  },
  optionsContainer: {
    backgroundColor: '#f8f9fa',
    paddingVertical: 8,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 32,
    paddingVertical: 12,
  },
  optionText: {
    fontSize: 15,
    color: '#2a2a2a',
    flex: 1,
  },
  bottomSpacing: {
    height: 100,
  },
});

export default SettingsScreen