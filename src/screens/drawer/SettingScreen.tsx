import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import Svg, {Path, Circle} from 'react-native-svg';
import {useLanguage} from '@app/hooks/LanguageContext';

// SVG Icons
const ChevronRightIcon = ({size = 20, color = '#aaa'}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M9 18l6-6-6-6"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const CheckIcon = ({size = 20, color = '#7dd3c0'}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M20 6L9 17l-5-5"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const LanguageIcon = ({size = 24, color = '#7dd3c0'}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M5 8l6 6M4 14l6-6 2-3M2 5h12M7 2h1l8 15h-1M10 18h4"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const ThemeIcon = ({size = 24, color = '#7dd3c0'}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const BackIcon = ({size = 24, color = '#fff'}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M19 12H5M12 19l-7-7 7-7"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const SettingsScreen = ({navigation}: any) => {
  const {currentLanguage, setLanguage, t} = useLanguage();
  const [currentTheme, setCurrentTheme] = useState('dark');
  const [showLanguageOptions, setShowLanguageOptions] = useState(false);
  const [showThemeOptions, setShowThemeOptions] = useState(false);

  console.log('currentLanguage', currentLanguage);

  const saveLanguage = async (language: string) => {
    try {
      await setLanguage(language);
      setShowLanguageOptions(false);

      // Show success message in new language
      setTimeout(() => {
        Alert.alert(t('ok'), t('languageUpdated'), [{text: t('ok')}]);
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

  const languageOptions = [
    {key: 'en', label: t('english')},
    {key: 'hi', label: t('hindi')},
  ];

  const themeOptions = [
    {key: 'dark', label: t('dark')},
    {key: 'light', label: t('light')},
  ];

  const renderLanguageOption = (option: any) => (
    <TouchableOpacity
      key={option.key}
      style={styles.optionItem}
      onPress={() => saveLanguage(option.key)}>
      <Text style={styles.optionText}>{option.label}</Text>
      {currentLanguage === option.key && (
        <CheckIcon size={20} color="#7dd3c0" />
      )}
    </TouchableOpacity>
  );

  const renderThemeOption = (option: any) => (
    <TouchableOpacity
      key={option.key}
      style={styles.optionItem}
      onPress={() => {
        setCurrentTheme(option.key);
        setShowThemeOptions(false);
      }}>
      <Text style={styles.optionText}>{option.label}</Text>
      {currentTheme === option.key && <CheckIcon size={20} color="#7dd3c0" />}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <BackIcon size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('settings')}</Text>
      </View>

      {/* Settings Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('general')}</Text>
          <View style={styles.sectionContent}>
            {/* Language Setting */}
            <TouchableOpacity
              style={styles.settingItem}
              onPress={handleLanguagePress}>
              <View style={styles.settingItemLeft}>
                <LanguageIcon />
                <View style={styles.settingItemText}>
                  <Text style={styles.settingItemTitle}>{t('language')}</Text>
                  <Text style={styles.settingItemSubtitle}>
                    {currentLanguage === 'hi' ? t('hindi') : t('english')}
                  </Text>
                </View>
              </View>
              <View
                style={[
                  styles.chevronContainer,
                  showLanguageOptions && styles.chevronRotated,
                ]}>
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
              style={[styles.settingItem, {borderBottomWidth: 0}]}
              onPress={handleThemePress}>
              <View style={styles.settingItemLeft}>
                <ThemeIcon />
                <View style={styles.settingItemText}>
                  <Text style={styles.settingItemTitle}>{t('theme')}</Text>
                  <Text style={styles.settingItemSubtitle}>
                    {currentTheme === 'dark' ? t('dark') : t('light')}
                  </Text>
                </View>
              </View>
              <View
                style={[
                  styles.chevronContainer,
                  showThemeOptions && styles.chevronRotated,
                ]}>
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
    shadowOffset: {width: 0, height: 2},
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
    transform: [{rotate: '0deg'}],
  },
  chevronRotated: {
    transform: [{rotate: '90deg'}],
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

export default SettingsScreen;
