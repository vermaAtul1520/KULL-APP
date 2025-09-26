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
    
    // Home Screen Translations
    Welcome: 'Welcome',
    'Community App': 'Community App',
    Explore: 'Explore',
    'Quick Actions': 'Quick Actions',
    'Recent Activity': 'Recent Activity',
    'View your latest interactions': 'View your latest interactions',
    Notifications: 'Notifications',
    'Check important updates': 'Check important updates',
    
    // Navigation & Tab Bar Labels
    Home: 'Home',
    Post: 'Post',
    News: 'News',
    'My People': 'My People',
    Donation: 'Donation',
    Profile: 'Profile',
    'Loading...': 'Loading...',
    
    // HomeScreen Specific
    'Session Expired': 'Session Expired',
    'Your session has expired. Please log in again.': 'Your session has expired. Please log in again.',
    'Error': 'Error',
    'Cannot open this URL': 'Cannot open this URL',
    'Failed to open URL': 'Failed to open URL',
    
    // News Headlines
    'Breaking: New policy announced for social welfare': 'Breaking: New policy announced for social welfare',
    'Community event this weekend - register now!': 'Community event this weekend - register now!',
    'Education reforms to be implemented next month': 'Education reforms to be implemented next month',
    'Local business owner wins national award': 'Local business owner wins national award',
    'Health department issues new guidelines': 'Health department issues new guidelines',
    
    // Profile Related
    'Age': 'Age',
    'Father': 'Father',
    'Profile Details': 'Profile Details',
    'Contact Information': 'Contact Information',
    'Professional Information': 'Professional Information',
    'Key Achievements': 'Key Achievements',
    'Community Contribution': 'Community Contribution',
    'Awards': 'Awards',
    'Interests': 'Interests',
    'Hobbies': 'Hobbies',
    'Links & Social Media': 'Links & Social Media',
    'Website': 'Website',
    'Social Link': 'Social Link',
    
    // Profile Screen
    'No user data available': 'No user data available',
    'Edit': 'Edit',
    'Personal Information': 'Personal Information',
    'First Name': 'First Name',
    'Last Name': 'Last Name',
    'Email': 'Email',
    'Community Details': 'Community Details',
    'Role': 'Role',
    'Member Since': 'Member Since',
    'User ID': 'User ID',
    'Enter interests separated by commas': 'Enter interests separated by commas',
    'No interests added': 'No interests added',
    'Save Changes': 'Save Changes',
    'Sign Out': 'Sign Out',
    'Are you sure you want to sign out?': 'Are you sure you want to sign out?',
    'Success': 'Success',
    'Profile updated successfully!': 'Profile updated successfully!',
    'Failed to update profile. Please try again.': 'Failed to update profile. Please try again.',
    
    // PostScreen Specific
    'Posts': 'Posts',
    'Loading posts...': 'Loading posts...',
    'Search posts by title, content, author...': 'Search posts by title, content, author...',
    'posts': 'posts',
    'post': 'post',
    'found': 'found',
    'filtered from': 'filtered from',
    'No posts match your search criteria': 'No posts match your search criteria',
    'No posts available. Create the first post!': 'No posts available. Create the first post!',
    'Clear Search': 'Clear Search',
    'Failed to load posts. Please try again.': 'Failed to load posts. Please try again.',
    'Failed to like post. Please try again.': 'Failed to like post. Please try again.',
    'No image to download': 'No image to download',
    'Download Image': 'Download Image',
    'Download': 'Download',
    'image?': 'image?',
    'Image downloaded successfully!': 'Image downloaded successfully!',
    
    // NewsScreen Specific
    'Community News': 'Community News',
    'Stay updated with latest happenings': 'Stay updated with latest happenings',
    'Loading news...': 'Loading news...',
    'Search news by title, content, author, category...': 'Search news by title, content, author, category...',
    'articles': 'articles',
    'article': 'article',
    'No news matches your search': 'No news matches your search',
    'No news available': 'No news available',
    'Try different keywords': 'Try different keywords',
    'Pull down to refresh': 'Pull down to refresh',
    'Failed to fetch news': 'Failed to fetch news',
    'Network error. Please try again.': 'Network error. Please try again.',
    'more': 'more',
    'h ago': 'h ago',
    'd ago': 'd ago',
    
    // Time formatting
    'Just now': 'Just now',
    'minutes ago': 'minutes ago',
    'hours ago': 'hours ago',
    'days ago': 'days ago',
    
    // Create Post Modal
    'Create New Post': 'Create New Post',
    'Title': 'Title',
    'Content': 'Content',
    'Enter post title...': 'Enter post title...',
    "What's on your mind?": "What's on your mind?",
    'Add Image': 'Add Image',
    'Camera/Gallery': 'Camera/Gallery',
    'OR': 'OR',
    'Paste image URL...': 'Paste image URL...',
    'Preview': 'Preview',
    'Remove Image': 'Remove Image',
    'Please fill in all required fields': 'Please fill in all required fields',
    'Post created successfully!': 'Post created successfully!',
    'Failed to create post. Please try again.': 'Failed to create post. Please try again.',
    
    // Image Picker
    'Select Image': 'Select Image',
    'Take Photo': 'Take Photo',
    'Choose from Gallery': 'Choose from Gallery',
    'Camera': 'Camera',
    'Gallery': 'Gallery',
    'Camera feature would open here. For demo, using a sample image.': 'Camera feature would open here. For demo, using a sample image.',
    'Gallery would open here. For demo, using a sample image.': 'Gallery would open here. For demo, using a sample image.',
    
    // Comments
    'Comments': 'Comments',
    'Loading comments...': 'Loading comments...',
    'No comments yet. Be the first to comment!': 'No comments yet. Be the first to comment!',
    'Reply': 'Reply',
    'Delete': 'Delete',
    'Replying to': 'Replying to',
    'Add a reply...': 'Add a reply...',
    'Add a comment...': 'Add a comment...',
    'Failed to load comments. Please try again.': 'Failed to load comments. Please try again.',
    'Failed to post comment': 'Failed to post comment',
    'Delete Comment': 'Delete Comment',
    'Are you sure you want to delete this comment?': 'Are you sure you want to delete this comment?',
    'Failed to delete comment': 'Failed to delete comment',
    
    // Loading and Data
    'Unable to Load Data': 'Unable to Load Data',
    'Using default content. Please check your connection and try refreshing.': 'Using default content. Please check your connection and try refreshing.',
    'Samaj Ke Taj': 'Samaj Ke Taj',
    'Loading profiles...': 'Loading profiles...',
    
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
    'Laws and Decisions': 'Laws and Decisions',
    'Social Upliftment': 'Social Upliftment',
    
    // Bhajan Screen
    'Bhajan Collection': 'Bhajan Collection',
    'Search bhajans by title, artist, category...': 'Search bhajans by title, artist, category...',
    'result found': 'result found',
    'results found': 'results found',
    'No results found': 'No results found',
    'Try searching with different keywords or clear the search to see all bhajans': 'Try searching with different keywords or clear the search to see all bhajans',
    'No bhajans available': 'No bhajans available',
    'Bhajan videos will appear here when available': 'Bhajan videos will appear here when available',
    'Loading bhajans...': 'Loading bhajans...',
    'Play Video': 'Play Video',
    'How would you like to watch this bhajan?': 'How would you like to watch this bhajan?',
    'In App': 'In App',
    'YouTube App': 'YouTube App',
    'views': 'views',
    'Failed to load bhajan videos. Please try again.': 'Failed to load bhajan videos. Please try again.',
    'Unable to open YouTube video': 'Unable to open YouTube video',
    'Open in YouTube': 'Open in YouTube',
    'Loading video...': 'Loading video...',
    'Failed to load video. Please try opening in YouTube app.': 'Failed to load video. Please try opening in YouTube app.',
    Category: 'Category',
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
    
    // Home Screen Translations
    Welcome: 'स्वागत है',
    'Community App': 'कम्युनिटी ऐप',
    Explore: 'खोजें',
    'Quick Actions': 'त्वरित कार्य',
    'Recent Activity': 'हाल की गतिविधि',
    'View your latest interactions': 'अपनी नवीनतम बातचीत देखें',
    Notifications: 'अधिसूचनाएं',
    'Check important updates': 'महत्वपूर्ण अपडेट देखें',
    
    // Navigation & Tab Bar Labels
    Home: 'होम',
    Post: 'पोस्ट',
    News: 'समाचार',
    'My People': 'मेरे लोग',
    Donation: 'दान',
    Profile: 'प्रोफाइल',
    'Loading...': 'लोड हो रहा है...',
    
    // HomeScreen Specific
    'Session Expired': 'सत्र समाप्त',
    'Your session has expired. Please log in again.': 'आपका सत्र समाप्त हो गया है। कृपया पुनः लॉग इन करें।',
    'Error': 'त्रुटि',
    'Cannot open this URL': 'इस URL को खोल नहीं सकते',
    'Failed to open URL': 'URL खोलने में विफल',
    
    // News Headlines
    'Breaking: New policy announced for social welfare': 'ब्रेकिंग: सामाजिक कल्याण के लिए नई नीति की घोषणा',
    'Community event this weekend - register now!': 'इस सप्ताहांत समुदायिक कार्यक्रम - अभी पंजीकरण करें!',
    'Education reforms to be implemented next month': 'अगले महीने लागू होने वाले शिक्षा सुधार',
    'Local business owner wins national award': 'स्थानीय व्यापारी को राष्ट्रीय पुरस्कार',
    'Health department issues new guidelines': 'स्वास्थ्य विभाग ने जारी की नई दिशा-निर्देश',
    
    // Profile Related
    'Age': 'आयु',
    'Father': 'पिता',
    'Profile Details': 'प्रोफाइल विवरण',
    'Contact Information': 'संपर्क जानकारी',
    'Professional Information': 'व्यावसायिक जानकारी',
    'Key Achievements': 'मुख्य उपलब्धियां',
    'Community Contribution': 'समुदायिक योगदान',
    'Awards': 'पुरस्कार',
    'Interests': 'रुचियां',
    'Hobbies': 'शौक',
    'Links & Social Media': 'लिंक और सोशल मीडिया',
    'Website': 'वेबसाइट',
    'Social Link': 'सामाजिक लिंक',
    
    // Profile Screen
    'No user data available': 'कोई उपयोगकर्ता डेटा उपलब्ध नहीं',
    'Edit': 'संपादित करें',
    'Personal Information': 'व्यक्तिगत जानकारी',
    'First Name': 'पहला नाम',
    'Last Name': 'अंतिम नाम',
    'Email': 'ईमेल',
    'Community Details': 'समुदाय विवरण',
    'Role': 'भूमिका',
    'Member Since': 'सदस्य बनने की तिथि',
    'User ID': 'उपयोगकर्ता आईडी',
    'Enter interests separated by commas': 'कॉमा से अलग करके रुचियां दर्ज करें',
    'No interests added': 'कोई रुचियां नहीं जोड़ी गईं',
    'Save Changes': 'परिवर्तन सहेजें',
    'Sign Out': 'साइन आउट',
    'Are you sure you want to sign out?': 'क्या आप वाकई साइन आउट करना चाहते हैं?',
    'Success': 'सफलता',
    'Profile updated successfully!': 'प्रोफाइल सफलतापूर्वक अपडेट हो गया!',
    'Failed to update profile. Please try again.': 'प्रोफाइल अपडेट करने में विफल। कृपया पुनः प्रयास करें।',
    
    // PostScreen Specific
    'Posts': 'पोस्ट',
    'Loading posts...': 'पोस्ट लोड हो रहे हैं...',
    'Search posts by title, content, author...': 'शीर्षक, सामग्री, लेखक के अनुसार पोस्ट खोजें...',
    'posts': 'पोस्ट',
    'post': 'पोस्ट',
    'found': 'मिले',
    'filtered from': 'फ़िल्टर किया गया',
    'No posts match your search criteria': 'आपकी खोज के मानदंडों से कोई पोस्ट मेल नहीं खाता',
    'No posts available. Create the first post!': 'कोई पोस्ट उपलब्ध नहीं। पहला पोस्ट बनाएं!',
    'Clear Search': 'खोज साफ़ करें',
    'Failed to load posts. Please try again.': 'पोस्ट लोड करने में विफल। कृपया पुनः प्रयास करें।',
    'Failed to like post. Please try again.': 'पोस्ट को लाइक करने में विफल। कृपया पुनः प्रयास करें।',
    'No image to download': 'डाउनलोड करने के लिए कोई चित्र नहीं',
    'Download Image': 'चित्र डाउनलोड करें',
    'Download': 'डाउनलोड',
    'image?': 'चित्र?',
    'Image downloaded successfully!': 'चित्र सफलतापूर्वक डाउनलोड हुआ!',
    
    // NewsScreen Specific
    'Community News': 'कम्युनिटी समाचार',
    'Stay updated with latest happenings': 'नवीनतम घटनाओं से अपडेट रहें',
    'Loading news...': 'समाचार लोड हो रहे हैं...',
    'Search news by title, content, author, category...': 'शीर्षक, सामग्री, लेखक, श्रेणी के अनुसार समाचार खोजें...',
    'articles': 'लेख',
    'article': 'लेख',
    'No news matches your search': 'आपकी खोज से कोई समाचार मेल नहीं खाता',
    'No news available': 'कोई समाचार उपलब्ध नहीं',
    'Try different keywords': 'अलग शब्दों की कोशिश करें',
    'Pull down to refresh': 'रीफ्रेश करने के लिए नीचे खींचें',
    'Failed to fetch news': 'समाचार प्राप्त करने में विफल',
    'Network error. Please try again.': 'नेटवर्क त्रुटि। कृपया पुनः प्रयास करें।',
    'more': 'और',
    'h ago': ' घंटे पहले',
    'd ago': ' दिन पहले',
    
    // Time formatting
    'Just now': 'अभी अभी',
    'minutes ago': 'मिनट पहले',
    'hours ago': 'घंटे पहले',
    'days ago': 'दिन पहले',
    
    // Create Post Modal
    'Create New Post': 'नया पोस्ट बनाएं',
    'Title': 'शीर्षक',
    'Content': 'सामग्री',
    'Enter post title...': 'पोस्ट शीर्षक दर्ज करें...',
    "What's on your mind?": 'आपके मन में क्या है?',
    'Add Image': 'चित्र जोड़ें',
    'Camera/Gallery': 'कैमरा/गैलरी',
    'OR': 'या',
    'Paste image URL...': 'चित्र URL पेस्ट करें...',
    'Preview': 'पूर्वावलोकन',
    'Remove Image': 'चित्र हटाएं',
    'Please fill in all required fields': 'कृपया सभी आवश्यक फ़ील्ड भरें',
    'Post created successfully!': 'पोस्ट सफलतापूर्वक बनाया गया!',
    'Failed to create post. Please try again.': 'पोस्ट बनाने में विफल। कृपया पुनः प्रयास करें।',
    
    // Image Picker
    'Select Image': 'चित्र चुनें',
    'Take Photo': 'फ़ोटो लें',
    'Choose from Gallery': 'गैलरी से चुनें',
    'Camera': 'कैमरा',
    'Gallery': 'गैलरी',
    'Camera feature would open here. For demo, using a sample image.': 'कैमरा फ़ीचर यहाँ खुलेगा। डेमो के लिए, नमूना चित्र का उपयोग।',
    'Gallery would open here. For demo, using a sample image.': 'गैलरी यहाँ खुलेगी। डेमो के लिए, नमूना चित्र का उपयोग।',
    
    // Comments
    'Comments': 'टिप्पणियां',
    'Loading comments...': 'टिप्पणियां लोड हो रही हैं...',
    'No comments yet. Be the first to comment!': 'अभी तक कोई टिप्पणी नहीं। पहली टिप्पणी करें!',
    'Reply': 'उत्तर',
    'Delete': 'हटाएं',
    'Replying to': 'उत्तर दे रहे हैं',
    'Add a reply...': 'उत्तर जोड़ें...',
    'Add a comment...': 'टिप्पणी जोड़ें...',
    'Failed to load comments. Please try again.': 'टिप्पणियां लोड करने में विफल। कृपया पुनः प्रयास करें।',
    'Failed to post comment': 'टिप्पणी पोस्ट करने में विफल',
    'Delete Comment': 'टिप्पणी हटाएं',
    'Are you sure you want to delete this comment?': 'क्या आप वाकई इस टिप्पणी को हटाना चाहते हैं?',
    'Failed to delete comment': 'टिप्पणी हटाने में विफल',
    
    // Loading and Data
    'Unable to Load Data': 'डेटा लोड करने में असमर्थ',
    'Using default content. Please check your connection and try refreshing.': 'डिफ़ॉल्ट सामग्री का उपयोग कर रहे हैं। कृपया अपना कनेक्शन जांचें और रीफ्रेश करने का प्रयास करें।',
    'Samaj Ke Taj': 'समाज के ताज',
    'Loading profiles...': 'प्रोफाइल लोड हो रहे हैं...',
    
    // Menu items
    Occasions: 'अवसर',
    Kartavya: 'कर्तव्य',
    Bhajan: 'भजन',
    Games: 'खेल',
    CitySearch: 'शहर खोज',
    OrganizationOfficer: 'संगठन अधिकारी',
    Education: 'शिक्षा',
    Employment: 'रोजगार',
    Sports: 'खेलकूद',
    Dukan: 'दुकान',
    Meetings: 'बैठकें',
    Appeal: 'अपील',
    Vote: 'वोट',
    'Laws and Decisions': 'कानून और निर्णय',
    'Social Upliftment': 'सामाजिक उत्थान',
    
    // Bhajan Screen
    'Bhajan Collection': 'भजन संग्रह',
    'Search bhajans by title, artist, category...': 'शीर्षक, कलाकार, श्रेणी के अनुसार भजन खोजें...',
    'result found': 'परिणाम मिला',
    'results found': 'परिणाम मिले',
    'No results found': 'कोई परिणाम नहीं मिला',
    'Try searching with different keywords or clear the search to see all bhajans': 'अलग शब्दों से खोजने की कोशिश करें या सभी भजन देखने के लिए खोज साफ़ करें',
    'No bhajans available': 'कोई भजन उपलब्ध नहीं',
    'Bhajan videos will appear here when available': 'भजन वीडियो उपलब्ध होने पर यहाँ दिखाई देंगे',
    'Loading bhajans...': 'भजन लोड हो रहे हैं...',
    'Play Video': 'वीडियो चलाएं',
    'How would you like to watch this bhajan?': 'आप इस भजन को कैसे देखना चाहेंगे?',
    'In App': 'ऐप में',
    'YouTube App': 'YouTube ऐप',
    'views': 'बार देखा गया',
    'Failed to load bhajan videos. Please try again.': 'भजन वीडियो लोड करने में विफल। कृपया पुनः प्रयास करें।',
    'Unable to open YouTube video': 'YouTube वीडियो खोलने में असमर्थ',
    'Open in YouTube': 'YouTube में खोलें',
    'Loading video...': 'वीडियो लोड हो रहा है...',
    'Failed to load video. Please try opening in YouTube app.': 'वीडियो लोड करने में विफल। कृपया YouTube ऐप में खोलने का प्रयास करें।',
    Category: 'श्रेणी',
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