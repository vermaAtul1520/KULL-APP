import React, {useEffect, useRef, useState} from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, ImageBackground, FlatList, Dimensions, View, Text, ActivityIndicator, Alert, Modal, Linking} from 'react-native';
import {Animated} from 'react-native';
import { Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '@app/constants/constant';
import { useAuth } from '@app/navigators';
import Svg, { Path, Circle, Rect, Line, G } from 'react-native-svg';
import { getAuthHeaders, getCommunityId } from '@app/constants/apiUtils';
import { useNavigation } from '@react-navigation/native';
import BannerComponent from '@app/navigators/BannerComponent';
import MarqueeView from 'react-native-marquee-view';

const {width} = Dimensions.get('window');

const AppColors = {
  primary: '#7dd3c0',
  black: '#000000',
  white: '#ffffff',
  gray: '#666666',
  dark: '#2a2a2a',
  teal: '#1e6b5c',
  cream: '#f5f5dc',
  blue: '#4169e1',
  lightGray: '#f0f0f0',
  orange: '#ff8c00',
  red: '#dc143c',
  green: '#228b22',
};

// Custom SVG Icons
const KingIcon = ({ size = 24, color = "black" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm2.7-2h8.6l.9-5.4-2.1 1.4L12 8l-3.1 2L6.8 8.6L7.7 14z" fill={color}/>
  </Svg>
);

const HeadlinesIcon = ({ size = 20, color = "#fff" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" fill={color}/>
  </Svg>
);

const CloseIcon = ({ size = 24, color = "#666" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill={color}/>
  </Svg>
);

const PhoneIcon = ({ size = 16, color = "#7dd3c0" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" fill={color}/>
  </Svg>
);

const EmailIcon = ({ size = 16, color = "#7dd3c0" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill={color}/>
  </Svg>
);

const OfficeBuildingIcon = ({ size = 16, color = "#7dd3c0" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z" fill={color}/>
  </Svg>
);

const MapMarkerIcon = ({ size = 16, color = "#7dd3c0" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill={color}/>
  </Svg>
);

const WebIcon = ({ size = 20, color = "#7dd3c0" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" fill={color}/>
  </Svg>
);

const LinkedInIcon = ({ size = 20, color = "#0077B5" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" fill={color}/>
  </Svg>
);

const TwitterIcon = ({ size = 20, color = "#1DA1F2" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" fill={color}/>
  </Svg>
);

const FacebookIcon = ({ size = 20, color = "#4267B2" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill={color}/>
  </Svg>
);

const InstagramIcon = ({ size = 20, color = "#E4405F" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" fill={color}/>
  </Svg>
);

const LinkIcon = ({ size = 20, color = "#7dd3c0" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" fill={color}/>
  </Svg>
);

const ExternalLinkIcon = ({ size = 16, color = "#aaa" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" fill={color}/>
  </Svg>
);

const RefreshIcon = ({ size = 20, color = "#2a2a2a" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" fill={color}/>
  </Svg>
);

// API Types
interface SmaajKeTaajProfile {
  id: number;
  name: string;
  role?: string;
  designation?: string;
  age: number;
  fatherName?: string;
  avatar: string;
  contact?: string;
  email?: string;
  interests?: string[];
  hobbies?: string[];
  organization?: string;
  keyAchievements?: string;
  communityContribution?: string;
  awards?: string;
  location?: string;
  website?: string;
  socialLink?: string;
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
}

interface CommunityConfiguration {
  _id: string;
  community: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  smaajKeTaaj: SmaajKeTaajProfile[];
  banner: string[];
  adPopUpBanner: string
}

interface ConfigurationAPIResponse {
  success: boolean;
  data: CommunityConfiguration;
}

interface TokenErrorResponse {
  success: false;
  message: string;
  error: string;
}

const HomeScreen = () => {
  const { user, token, logout } = useAuth();
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const mainFlatListRef = useRef<FlatList>(null);

  console.log('token',token);
  
  // State for API data
  const [profileData, setProfileData] = useState<SmaajKeTaajProfile[]>([]);
  const [bannerData, setBannerData] = useState<{id: number, image: string, textColor: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Modal state for profile details
  const [selectedProfile, setSelectedProfile] = useState<SmaajKeTaajProfile | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  
  // Ad popup state
  const [adPopupVisible, setAdPopupVisible] = useState(false);
  const [adPopupImage, setAdPopupImage] = useState<string | null>(null);

  const navigation = useNavigation();

  // Function to check if ad popup should be shown
  const shouldShowAdPopup = async (adImageUrl: string) => {
    try {
      const lastShownTime = await AsyncStorage.getItem('adPopupLastShown');
      if (!lastShownTime) return true;
      
      const oneHourAgo = Date.now() - (60 * 60 * 1000); // 1 hour in milliseconds
      const lastShown = parseInt(lastShownTime);
      
      return lastShown < oneHourAgo;
    } catch (error) {
      console.error('Error checking ad popup status:', error);
      return true;
    }
  };

  // Function to handle ad popup close
  const handleAdPopupClose = async () => {
    try {
      await AsyncStorage.setItem('adPopupLastShown', Date.now().toString());
      setAdPopupVisible(false);
      setAdPopupImage(null);
    } catch (error) {
      console.error('Error saving ad popup status:', error);
      setAdPopupVisible(false);
      setAdPopupImage(null);
    }
  };

  // Function to show ad popup if conditions are met
  const checkAndShowAdPopup = async (adImageUrl: string | null) => {
    if (!adImageUrl) return;
    
    const shouldShow = await shouldShowAdPopup(adImageUrl);
    if (shouldShow) {
      setAdPopupImage(adImageUrl);
      setAdPopupVisible(true);
    }
  };

  // Function to handle token expiration and logout
  const handleTokenExpiration = async () => {
    try {
      // Clear all stored tokens
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('refreshToken');
      
      // Call logout from auth context
      if (logout) {
        logout();
      }
      
      // Show user-friendly message
      Alert.alert(
        'Session Expired',
        'Your session has expired. Please log in again.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Navigate to login screen
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }], // Adjust route name as per your navigation structure
              });
            }
          }
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // Function to check if response indicates token expiration
  const isTokenExpired = (responseData: any): boolean => {
    return (
      responseData.success === false &&
      (responseData.error === 'jwt expired' || 
       responseData.message === 'Invalid or expired token' ||
       responseData.error === 'Token expired' ||
       responseData.message?.toLowerCase().includes('token') && 
       responseData.message?.toLowerCase().includes('expired'))
    );
  };

  // Function to handle opening URLs
  const handleOpenURL = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Cannot open this URL');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open URL');
    }
  };

  // Fallback data
  const defaultNewsHeadlines = [
    {id: 1, text: 'Breaking: New policy announced for social welfare', category: 'Politics'},
    {id: 2, text: 'Community event this weekend - register now!', category: 'Events'},
    {id: 3, text: 'Education reforms to be implemented next month', category: 'Education'},
    {id: 4, text: 'Local business owner wins national award', category: 'Business'},
    {id: 5, text: 'Health department issues new guidelines', category: 'Health'},
  ];

  const defaultBannerData = [
    {
      id: 1,
      textColor: '#000',
      image: 'https://plixlifefcstage-media.farziengineer.co/hosted/shradhaKapoor-a5a533c43c49.jpg',
    },
    {
      id: 2,
      textColor: '#FFF',
      image: 'https://plixlifefcstage-media.farziengineer.co/hosted/shradhaKapoor-a5a533c43c49.jpg',
    }
  ];

  const defaultProfileData: SmaajKeTaajProfile[] = [
    {
      id: 11,
      name: 'Rajat Verma',
      role: 'Financial Analyst',
      age: 45,
      fatherName: '',
      avatar: 'https://plixlifefcstage-media.farziengineer.co/hosted/4_19-192d4aef12c7.jpg',
    },
    {
      id: 14,
      name: 'Nandita Rao',
      role: 'Administrative',
      age: 49,
      fatherName: '',
      avatar: 'https://plixlifefcstage-media.farziengineer.co/hosted/4_19-192d4aef12c7.jpg',
    }
  ];

  const newsString = defaultNewsHeadlines.map(item => `${item.text}`).join(' • ');

  // API Functions
  // const getAuthHeaders = async () => {
  //   const userToken = await AsyncStorage.getItem('userToken');
  //   return {
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${userToken || token}`,
  //   };
  // };

  const fetchCommunityConfiguration = async () => {
    try {
      setLoading(true);
      const COMMUNITY_ID = await getCommunityId();
      console.log('Fetching community configuration for:', COMMUNITY_ID);

      const headers = await getAuthHeaders();
      
      const response = await fetch(`${BASE_URL}/api/communities/${COMMUNITY_ID}/configuration`, {
        method: 'GET',
        headers,
      });

      console.log('Configuration API response status:', response.status, response);

      if (!response.ok) {
        if (response.status === 404) {
          console.log('Configuration not found, using default data');
          setProfileData(defaultProfileData);
          setBannerData(defaultBannerData);
          return;
        }
        
        // Check for 401 Unauthorized which typically indicates token issues
        if (response.status === 401) {
          const errorText = await response.text();
          let errorData;
          try {
            errorData = JSON.parse(errorText);
          } catch {
            errorData = { success: false, message: 'Unauthorized' };
          }
          
          if (isTokenExpired(errorData)) {
            console.log('Token expired, logging out user');
            handleTokenExpiration();
            return;
          }
        }
        
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseText = await response.text();
      console.log('Raw configuration response:', responseText.substring(0, 200) + '...');

      let data: ConfigurationAPIResponse | TokenErrorResponse;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        setProfileData(defaultProfileData);
        setBannerData(defaultBannerData);
        return;
      }

      // Check if the response indicates token expiration
      if (isTokenExpired(data)) {
        console.log('Token expired based on response data, logging out user');
        handleTokenExpiration();
        return;
      }

      if (data.success && 'data' in data && data.data) {
        // Set Samaj Ke Taaj profiles
        if (data.data.smaajKeTaaj && Array.isArray(data.data.smaajKeTaaj)) {
          setProfileData(data.data.smaajKeTaaj);
          console.log('Loaded Samaj Ke Taaj profiles:', data.data.smaajKeTaaj.length);
        } else {
          setProfileData(defaultProfileData);
        }

        // Set banner data
        if (data.data.banner && Array.isArray(data.data.banner)) {
          const banners = data.data.banner.map((imageUrl, index) => ({
            id: index + 1,
            image: imageUrl,
            textColor: index % 2 === 0 ? '#000' : '#FFF'
          }));
          setBannerData(banners.length > 0 ? banners : defaultBannerData);
          console.log('Loaded banners:', banners.length);
        } else {
          setBannerData(defaultBannerData);
        }

        // Handle ad popup banner (using dummy URL for now since API doesn't return it yet)
        const dummyAdUrl = 'https://plixlifefcstage-media.farziengineer.co/hosted/shradhaKapoor-a5a533c43c49.jpg';
        // Uncomment below line when API starts returning adPopUpBanner
        const adUrl = data.data.adPopUpBanner || dummyAdUrl;
        await checkAndShowAdPopup(adUrl);
      } else {
        console.log('Invalid API response, using default data');
        setProfileData(defaultProfileData);
        setBannerData(defaultBannerData);
      }

    } catch (error) {
      console.error('Error fetching community configuration:', error);
      
      // Use fallback data
      setProfileData(defaultProfileData);
      setBannerData(defaultBannerData);

      if (!refreshing) { // Only show alert if not refreshing
        Alert.alert(
          'Unable to Load Data',
          'Using default content. Please check your connection and try refreshing.',
          [{text: 'OK', style: 'default'}]
        );
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCommunityConfiguration();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchCommunityConfiguration();
  };

  // Handle profile click
  const handleProfileClick = (profile: SmaajKeTaajProfile) => {
    setSelectedProfile(profile);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedProfile(null);
  };

  // Auto-scroll banner effect
  useEffect(() => {
    if (bannerData.length === 0) return;

    const interval = setInterval(() => {
      if (flatListRef.current) {
        const nextIndex = (Math.floor(Date.now() / 3000) % bannerData.length);
        flatListRef.current.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [bannerData.length]);

  const renderBanner = ({item}: {item: {id: number, image: string, textColor: string}}) => (
    <View style={[styles.bannerSlide, {width}]}>
      <ImageBackground
        source={{uri: item.image}}
        style={styles.bannerImage}
        resizeMode="cover">
      </ImageBackground>
    </View>
  );

  const renderNewsHeadline = ({item, index}: {item: any, index: number}) => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width,
    ];
    
    const translateX = scrollX.interpolate({
      inputRange,
      outputRange: [width * 0.5, 0, -width * 0.5],
    });

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.5, 1, 0.5],
    });

    return (
      <TouchableOpacity 
        activeOpacity={0.8}
        onPress={() => navigation.navigate('News')}
        style={styles.newsItem}
      >
        <Animated.View style={[
          styles.newsContent,
          {transform: [{translateX}], opacity}
        ]}>
          <Text style={styles.newsText}>{item.text}</Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const renderProfileCard = (profile: SmaajKeTaajProfile) => (
    <TouchableOpacity 
      key={profile.id} 
      style={styles.profileCard}
      onPress={() => handleProfileClick(profile)}
    >
      <View style={styles.profileImageContainer}>
        <Image
          source={{uri: profile.avatar}}
          style={styles.profileImage}
        />
        <View style={styles.profileBadge}>
          <Text style={styles.profileBadgeText}>{profile.id}</Text>
        </View>
      </View>
      <Text style={styles.profileName}>{profile.name}</Text>
      <Text style={styles.profileRole}>{profile.role || profile.designation}</Text>
      <Text style={styles.profileAge}>Age: {profile.age}</Text>
    </TouchableOpacity>
  );

  const renderProfileDetailsModal = () => {
    if (!selectedProfile) return null;

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Header with close button */}
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Profile Details</Text>
                <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                  <CloseIcon size={24} color="#666" />
                </TouchableOpacity>
              </View>

              {/* Profile Image and Basic Info */}
              <View style={styles.modalProfileSection}>
                <Image
                  source={{uri: selectedProfile.avatar}}
                  style={styles.modalProfileImage}
                />
                <View style={styles.modalProfileBadge}>
                  <Text style={styles.modalProfileBadgeText}>{selectedProfile.id}</Text>
                </View>
              </View>

              {/* Basic Information */}
              <View style={styles.modalInfoSection}>
                <Text style={styles.modalProfileName}>{selectedProfile.name}</Text>
                {(selectedProfile.role || selectedProfile.designation) && (
                  <Text style={styles.modalProfileRole}>
                    {selectedProfile.role || selectedProfile.designation}
                  </Text>
                )}
                <Text style={styles.modalProfileAge}>Age: {selectedProfile.age}</Text>
                
                {selectedProfile.fatherName && selectedProfile.fatherName.trim() !== '' && (
                  <Text style={styles.modalProfileDetail}>Father: {selectedProfile.fatherName}</Text>
                )}

                {selectedProfile.organization && selectedProfile.organization.trim() !== '' && (
                  <View style={styles.modalDetailRow}>
                    <OfficeBuildingIcon size={16} color="#7dd3c0" />
                    <Text style={styles.modalDetailText}>{selectedProfile.organization}</Text>
                  </View>
                )}

                {selectedProfile.location && selectedProfile.location.trim() !== '' && (
                  <View style={styles.modalDetailRow}>
                    <MapMarkerIcon size={16} color="#7dd3c0" />
                    <Text style={styles.modalDetailText}>{selectedProfile.location}</Text>
                  </View>
                )}
              </View>

              {/* Contact Information */}
              {(selectedProfile.contact || selectedProfile.email) && (
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Contact Information</Text>
                  {selectedProfile.contact && selectedProfile.contact.trim() !== '' && (
                    <View style={styles.modalDetailRow}>
                      <PhoneIcon size={16} color="#7dd3c0" />
                      <Text style={styles.modalDetailText}>{selectedProfile.contact}</Text>
                    </View>
                  )}
                  {selectedProfile.email && selectedProfile.email.trim() !== '' && (
                    <View style={styles.modalDetailRow}>
                      <EmailIcon size={16} color="#7dd3c0" />
                      <Text style={styles.modalDetailText}>{selectedProfile.email}</Text>
                    </View>
                  )}
                </View>
              )}

              {/* Professional Information */}
              {(selectedProfile.keyAchievements || selectedProfile.communityContribution || selectedProfile.awards) && (
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Professional Information</Text>
                  
                  {selectedProfile.keyAchievements && selectedProfile.keyAchievements.trim() !== '' && (
                    <View style={styles.modalTextSection}>
                      <Text style={styles.modalSubTitle}>Key Achievements</Text>
                      <Text style={styles.modalDescriptionText}>{selectedProfile.keyAchievements}</Text>
                    </View>
                  )}

                  {selectedProfile.communityContribution && selectedProfile.communityContribution.trim() !== '' && (
                    <View style={styles.modalTextSection}>
                      <Text style={styles.modalSubTitle}>Community Contribution</Text>
                      <Text style={styles.modalDescriptionText}>{selectedProfile.communityContribution}</Text>
                    </View>
                  )}

                  {selectedProfile.awards && selectedProfile.awards.trim() !== '' && (
                    <View style={styles.modalTextSection}>
                      <Text style={styles.modalSubTitle}>Awards</Text>
                      <Text style={styles.modalDescriptionText}>{selectedProfile.awards}</Text>
                    </View>
                  )}
                </View>
              )}

              {/* Interests */}
              {selectedProfile.interests && selectedProfile.interests.length > 0 && (
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Interests</Text>
                  <View style={styles.modalTagsContainer}>
                    {selectedProfile.interests.map((interest, index) => (
                      <View key={index} style={styles.modalTag}>
                        <Text style={styles.modalTagText}>{interest}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Hobbies */}
              {selectedProfile.hobbies && selectedProfile.hobbies.length > 0 && (
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Hobbies</Text>
                  <View style={styles.modalTagsContainer}>
                    {selectedProfile.hobbies.map((hobby, index) => (
                      <View key={index} style={[styles.modalTag, styles.modalHobbyTag]}>
                        <Text style={styles.modalTagText}>{hobby}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Website and Social Links */}
              {(selectedProfile.website || selectedProfile.linkedin || selectedProfile.twitter || 
                selectedProfile.facebook || selectedProfile.instagram || selectedProfile.socialLink) && (
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Links & Social Media</Text>
                  
                  {selectedProfile.website && selectedProfile.website.trim() !== '' && (
                    <TouchableOpacity 
                      style={styles.modalLinkRow}
                      onPress={() => handleOpenURL(selectedProfile.website!)}
                    >
                      <WebIcon size={20} color="#7dd3c0" />
                      <Text style={styles.modalLinkText}>Website</Text>
                      <ExternalLinkIcon size={16} color="#aaa" />
                    </TouchableOpacity>
                  )}

                  {selectedProfile.linkedin && selectedProfile.linkedin.trim() !== '' && (
                    <TouchableOpacity 
                      style={styles.modalLinkRow}
                      onPress={() => handleOpenURL(selectedProfile.linkedin!)}
                    >
                      <LinkedInIcon size={20} color="#0077B5" />
                      <Text style={styles.modalLinkText}>LinkedIn</Text>
                      <ExternalLinkIcon size={16} color="#aaa" />
                    </TouchableOpacity>
                  )}

                  {selectedProfile.twitter && selectedProfile.twitter.trim() !== '' && (
                    <TouchableOpacity 
                      style={styles.modalLinkRow}
                      onPress={() => handleOpenURL(selectedProfile.twitter!)}
                    >
                      <TwitterIcon size={20} color="#1DA1F2" />
                      <Text style={styles.modalLinkText}>Twitter</Text>
                      <ExternalLinkIcon size={16} color="#aaa" />
                    </TouchableOpacity>
                  )}

                  {selectedProfile.facebook && selectedProfile.facebook.trim() !== '' && (
                    <TouchableOpacity 
                      style={styles.modalLinkRow}
                      onPress={() => handleOpenURL(selectedProfile.facebook!)}
                    >
                      <FacebookIcon size={20} color="#4267B2" />
                      <Text style={styles.modalLinkText}>Facebook</Text>
                      <ExternalLinkIcon size={16} color="#aaa" />
                    </TouchableOpacity>
                  )}

                  {selectedProfile.instagram && selectedProfile.instagram.trim() !== '' && (
                    <TouchableOpacity 
                      style={styles.modalLinkRow}
                      onPress={() => handleOpenURL(selectedProfile.instagram!)}
                    >
                      <InstagramIcon size={20} color="#E4405F" />
                      <Text style={styles.modalLinkText}>Instagram</Text>
                      <ExternalLinkIcon size={16} color="#aaa" />
                    </TouchableOpacity>
                  )}

                  {selectedProfile.socialLink && selectedProfile.socialLink.trim() !== '' && (
                    <TouchableOpacity 
                      style={styles.modalLinkRow}
                      onPress={() => handleOpenURL(selectedProfile.socialLink!)}
                    >
                      <LinkIcon size={20} color="#7dd3c0" />
                      <Text style={styles.modalLinkText}>Social Link</Text>
                      <ExternalLinkIcon size={16} color="#aaa" />
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  const sections = [
    {
      id: 'banner',
      renderItem: () => <BannerComponent />
    },
    {
      id: 'news',
      renderItem: () => (
        <View style={styles.newsMarqueeContainer}>
          <TouchableOpacity 
            activeOpacity={0.8}
            onPress={() => navigation.navigate('News')}
            style={styles.marqueeWrapper}
          >
            <MarqueeView
              style={styles.marqueeView}
              speed={0.1}
              delay={1000}
              loop={true}
            >
              <Text style={styles.marqueeText}>{newsString}</Text>
            </MarqueeView>
          </TouchableOpacity>
        </View>
      )
    },
    {
      id: 'profiles',
      renderItem: () => (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <KingIcon size={24} color="black" />
            <Text style={styles.sectionTitle}>Samaj Ke Taj</Text>
            <TouchableOpacity 
              onPress={onRefresh} 
              style={styles.refreshButton}
              disabled={refreshing}
            >
              {refreshing ? (
                <ActivityIndicator size="small" color="#2a2a2a" />
              ) : (
                <RefreshIcon size={20} color="#2a2a2a" />
              )}
            </TouchableOpacity>
          </View>
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#2a2a2a" />
              <Text style={styles.loadingText}>Loading profiles...</Text>
            </View>
          ) : (
            <View style={styles.profileGrid}>
              {profileData.map(renderProfileCard)}
            </View>
          )}
        </View>
      )
    },
  ];

  return (
    <View style={styles.container}>
      <FlatList
        ref={mainFlatListRef}
        data={sections}
        renderItem={({item}) => item.renderItem()}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={<View style={{height: 20}} />}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
      
      {/* Profile Details Modal */}
      {renderProfileDetailsModal()}
      
      {/* Ad Popup Modal */}
      {adPopupVisible && adPopupImage && (
        <Modal
          animationType="fade"
          transparent={true}
          visible={adPopupVisible}
          onRequestClose={handleAdPopupClose}
        >
          <View style={styles.adPopupOverlay}>
            <View style={styles.adPopupContainer}>
              <TouchableOpacity 
                style={styles.adCloseButton}
                onPress={handleAdPopupClose}
                activeOpacity={0.8}
              >
                <CloseIcon size={30} color="#fff" />
              </TouchableOpacity>
              <Image
                source={{uri: adPopupImage}}
                style={styles.adPopupImage}
                resizeMode="contain"
              />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5dc',
  },
  headerBanner: {
    backgroundColor: '#f5f5dc',
  },
  bannerSlide: {
    height: 100,
    padding: 8,
    borderRadius: 20
  },
  bannerImage: {
    height: 240,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderBanner: {
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
  },
  placeholderText: {
    color: '#666',
    fontSize: 16,
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 10,
  },
  liveText: {
    backgroundColor: '#FF0000',
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  turnoutInfo: {
    backgroundColor: '#f5f5dc',
    paddingVertical: 4,
    paddingHorizontal: 16,
  },
  turnoutText: {
    color: '#000',
    fontSize: 14,
    alignSelf: 'center'
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#2a2a2a',
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#2a2a2a',
    fontFamily: 'italic',
    marginLeft: 8,
    flex: 1,
  },
  refreshButton: {
    padding: 8,
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
  profileGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  profileCard: {
    width: '48%',
    backgroundColor: '#3a3a3a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  profileBadge: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: '#7dd3c0',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileBadgeText: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
  },
  profileName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  profileRole: {
    color: '#aaa',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
  },
  profileDetails: {
    color: '#aaa',
    fontSize: 12,
    textAlign: 'center',
  },
  profileAge: {
    color: '#aaa',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  menuSection: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 100,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuItem: {
    width: '48%',
    height: 80,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  newsMarqueeContainer: {
    backgroundColor: '#2a2a2a',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  newsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  newsHeaderText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  marqueeWrapper: {
    backgroundColor: '#3a3a3a',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    overflow: 'hidden',
  },
  marqueeView: {
    height: 20,
  },
  marqueeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  menuText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
    textAlign: 'center',
  },
  newsSliderContainer: {
    backgroundColor: '#2a2a2a',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  newsItem: {
    width: width - 40,
    height: 80,
    marginHorizontal: 20,
    justifyContent: 'center',
  },
  newsContent: {
    backgroundColor: '#3a3a3a',
    borderRadius: 12,
    padding: 16,
    height: '100%',
    justifyContent: 'center',
  },
  newsCategory: {
    color: '#7dd3c0',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  newsText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  newsPagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  newsDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#7dd3c0',
    marginHorizontal: 4,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#2a2a2a',
    borderRadius: 20,
    width: width * 0.9,
    maxHeight: '80%',
    padding: 0,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  closeButton: {
    padding: 4,
  },
  modalProfileSection: {
    alignItems: 'center',
    paddingVertical: 20,
    position: 'relative',
  },
  modalProfileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  modalProfileBadge: {
    position: 'absolute',
    bottom: 15,
    right: width * 0.5 - 70,
    backgroundColor: '#7dd3c0',
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalProfileBadgeText: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalInfoSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  modalProfileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalProfileRole: {
    fontSize: 18,
    color: '#7dd3c0',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalProfileAge: {
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalProfileDetail: {
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
    marginBottom: 4,
  },
  modalSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  modalSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#7dd3c0',
    marginBottom: 12,
  },
  modalSubTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  modalTextSection: {
    marginBottom: 16,
  },
  modalDescriptionText: {
    fontSize: 14,
    color: '#ccc',
    lineHeight: 20,
    textAlign: 'justify',
  },
  modalDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalDetailText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 12,
  },
  modalTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  modalTag: {
    backgroundColor: '#3a3a3a',
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 4,
    borderWidth: 1,
    borderColor: '#7dd3c0',
  },
  modalHobbyTag: {
    borderColor: '#ff8c00',
  },
  modalTagText: {
    color: '#fff',
    fontSize: 14,
  },
  modalLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#3a3a3a',
    borderRadius: 8,
    marginBottom: 8,
  },
  modalLinkText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 12,
    flex: 1,
  },
  // Ad Popup Styles
  adPopupOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  adPopupContainer: {
    width: width * 0.9,
    height: '80%',
    position: 'relative',
  },
  adCloseButton: {
    position: 'absolute',
    top: -20,
    right: 10,
    zIndex: 1000,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 20,
    padding: 5,
  },
  adPopupImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
});

export default HomeScreen;