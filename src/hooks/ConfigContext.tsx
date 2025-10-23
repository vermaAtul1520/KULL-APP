import React, {createContext, useState, useContext, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';
import {BASE_URL} from '@app/constants/constant';
import {getAuthHeaders, getCommunityId} from '@app/constants/apiUtils';
import {useAuth} from '@app/navigators';

// Configuration storage key
const CONFIG_CACHE_KEY = '@app_configuration_cache';
const CONFIG_CACHE_TIMESTAMP_KEY = '@app_configuration_timestamp';

// Cache duration: 1 hour (in milliseconds)
const CACHE_DURATION = 60 * 60 * 1000;

// Types

export interface SmaajKeTaajProfile {
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

export interface GotraData {
  name: string;
  subgotra: string[];
}

export interface DrorOption {
  visible: boolean;
  label: string;
  labelHindi: string;
}

export interface DrorData {
  occasions: DrorOption;
  kartavya: DrorOption;
  bhajan: DrorOption;
  games: DrorOption;
  citySearch: DrorOption;
  organizationOfficer: DrorOption;
  education: DrorOption;
  employment: DrorOption;
  sports: DrorOption;
  dukan: DrorOption;
  meetings: DrorOption;
  appeal: DrorOption;
  vote: DrorOption;
  _id: string;
}

export interface CommunityConfiguration {
  _id: string;
  community: {
    _id: string;
    name: string;
    description: string;
    code: string;
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
  smaajKeTaaj: SmaajKeTaajProfile[];
  banner: string[];
  addPopup: string;
  gotra: GotraData[];
  drorOption: DrorData;
}

export interface ConfigurationContextType {
  // Data
  profileData: SmaajKeTaajProfile[];
  bannerData: {id: number; image: string; textColor: string}[];
  adPopupImage: string | null;
  gotraData: GotraData[];
  drorData: DrorData | null;

  // Loading states
  loading: boolean;
  refreshing: boolean;

  // Actions
  fetchConfiguration: () => Promise<void>;
  refreshConfiguration: () => Promise<void>;
  clearCache: () => Promise<void>;

  // Helpers
  isDataStale: boolean;
  lastUpdated: Date | null;
}

// Create context - empty initial state, data comes from API
const ConfigurationContext = createContext<ConfigurationContextType>({
  profileData: [],
  bannerData: [],
  adPopupImage: null,
  gotraData: [],
  drorData: null,
  loading: false,
  refreshing: false,
  fetchConfiguration: async () => {},
  refreshConfiguration: async () => {},
  clearCache: async () => {},
  isDataStale: false,
  lastUpdated: null,
});

// Provider component
export const ConfigurationProvider = ({children}) => {
  const {logout, isLoggedIn, token} = useAuth();

  // State - start with empty data
  const [profileData, setProfileData] = useState<SmaajKeTaajProfile[]>([]);
  const [bannerData, setBannerData] = useState<
    {id: number; image: string; textColor: string}[]
  >([]);
  const [adPopupImage, setAdPopupImage] = useState<string | null>(null);
  const [gotraData, setGotraData] = useState<GotraData[]>([]);
  const [drorData, setDrorData] = useState<DrorData | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isDataStale, setIsDataStale] = useState(false);

  // Helper function to check if response indicates token expiration
  const isTokenExpired = (responseData: any): boolean => {
    return (
      responseData.success === false &&
      (responseData.error === 'jwt expired' ||
        responseData.message === 'Invalid or expired token' ||
        responseData.error === 'Token expired' ||
        (responseData.message?.toLowerCase().includes('token') &&
          responseData.message?.toLowerCase().includes('expired')))
    );
  };

  // Helper function to handle token expiration
  const handleTokenExpiration = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('refreshToken');

      if (logout) {
        logout();
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // Load configuration from cache
  const loadFromCache = async (): Promise<boolean> => {
    try {
      const cachedData = await AsyncStorage.getItem(CONFIG_CACHE_KEY);
      const cachedTimestamp = await AsyncStorage.getItem(
        CONFIG_CACHE_TIMESTAMP_KEY,
      );

      console.log('💾 CACHE DEBUG - Cached data exists:', !!cachedData);
      console.log('💾 CACHE DEBUG - Cached timestamp:', cachedTimestamp);

      if (!cachedData || !cachedTimestamp) {
        return false;
      }

      const timestamp = parseInt(cachedTimestamp);
      const now = Date.now();
      const isExpired = now - timestamp > CACHE_DURATION;

      console.log('💾 CACHE DEBUG - Cache expired:', isExpired);

      if (isExpired) {
        setIsDataStale(true);
        return false;
      }

      const parsedData = JSON.parse(cachedData);
      console.log('💾 CACHE DEBUG - Parsed cache data:', parsedData);

      if (parsedData.profileData) {
        setProfileData(parsedData.profileData);
      }
      if (parsedData.bannerData) {
        setBannerData(parsedData.bannerData);
      }
      if (parsedData.adPopupImage) {
        setAdPopupImage(parsedData.adPopupImage);
      }
      if (parsedData.gotraData) {
        setGotraData(parsedData.gotraData);
      }
      if (parsedData.drorData) {
        setDrorData(parsedData.drorData);
      }

      setLastUpdated(new Date(timestamp));
      setIsDataStale(false);

      return true;
    } catch (error) {
      console.error('Error loading configuration from cache:', error);
      return false;
    }
  };

  // Save configuration to cache
  const saveToCache = async (data: {
    profileData: SmaajKeTaajProfile[];
    bannerData: {id: number; image: string; textColor: string}[];
    adPopupImage: string | null;
    gotraData: GotraData[];
    drorData: DrorData | null;
  }) => {
    try {
      const timestamp = Date.now();
      console.log('💾 CACHE DEBUG - Saving to cache:', data);
      console.log('💾 CACHE DEBUG - Cache timestamp:', timestamp);

      await AsyncStorage.setItem(CONFIG_CACHE_KEY, JSON.stringify(data));
      await AsyncStorage.setItem(
        CONFIG_CACHE_TIMESTAMP_KEY,
        timestamp.toString(),
      );
      setLastUpdated(new Date(timestamp));
    } catch (error) {
      console.error('Error saving configuration to cache:', error);
    }
  };

  // Clear cache
  const clearCache = async () => {
    try {
      await AsyncStorage.removeItem(CONFIG_CACHE_KEY);
      await AsyncStorage.removeItem(CONFIG_CACHE_TIMESTAMP_KEY);
      setLastUpdated(null);
      setIsDataStale(false);
    } catch (error) {
      console.error('Error clearing configuration cache:', error);
    }
  };

  // Fetch configuration from API
  const fetchConfigurationFromAPI = async (
    isRefreshing = false,
  ): Promise<void> => {
    try {
      console.log('🌐 API DEBUG - Starting fetch configuration');
      console.log('🌐 API DEBUG - BASE_URL:', BASE_URL);

      if (isRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const COMMUNITY_ID = await getCommunityId();
      console.log('🔍 CONFIG DEBUG - Community ID:', COMMUNITY_ID);

      if (!COMMUNITY_ID) {
        console.log(
          '🔍 CONFIG DEBUG - No community ID found, cannot fetch configuration',
        );
        throw new Error(
          'Community ID not found. Please ensure you are logged in properly.',
        );
      }

      const headers = await getAuthHeaders();
      console.log('🔍 CONFIG DEBUG - Headers:', headers);
      console.log(
        '🌐 API DEBUG - Full URL:',
        `${BASE_URL}/api/communities/${COMMUNITY_ID}/configuration`,
      );

      const response = await fetch(
        `${BASE_URL}/api/communities/${COMMUNITY_ID}/configuration`,
        {
          method: 'GET',
          headers,
        },
      );

      console.log('🔍 CONFIG DEBUG - Response Status:', response.status);
      console.log('🌐 API DEBUG - Response object:', response);
      console.log('🌐 API DEBUG - Response ok:', response.ok);

      if (!response.ok) {
        if (response.status === 401) {
          const errorText = await response.text();
          let errorData;
          try {
            errorData = JSON.parse(errorText);
          } catch {
            errorData = {success: false, message: 'Unauthorized'};
          }

          if (isTokenExpired(errorData)) {
            console.log('Token expired, logging out user');
            await handleTokenExpiration();
            return;
          }
        }

        if (response.status === 404) {
          console.log('Configuration not found');
          return;
        }

        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseText = await response.text();
      console.log(
        '🔍 CONFIG DEBUG - Raw Response Text:',
        responseText.substring(0, 500),
      );
      console.log('🔍 CONFIG DEBUG - Response Length:', responseText.length);
      console.log('🌐 API DEBUG - Full response text:', responseText);

      let data;

      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        throw new Error('Invalid JSON response');
      }

      console.log(
        '🔍 CONFIG DEBUG - Parsed Data:',
        JSON.stringify(data, null, 2),
      );
      console.log('🔍 CONFIG DEBUG - Data Success:', data.success);
      console.log('🔍 CONFIG DEBUG - Data.data exists:', !!data.data);

      // Check if the response indicates token expiration
      if (isTokenExpired(data)) {
        console.log('Token expired based on response data');
        await handleTokenExpiration();
        return;
      }

      if (data.success && data.data) {
        console.log(
          '🔍 CONFIG DEBUG - Full data.data object:',
          JSON.stringify(data.data, null, 2),
        );
        console.log(
          '🔍 CONFIG DEBUG - smaajKeTaaj raw:',
          data.data.smaajKeTaaj,
        );
        console.log('🔍 CONFIG DEBUG - banner raw:', data.data.banner);
        console.log('🔍 CONFIG DEBUG - addPopup raw:', data.data.addPopup);
        console.log('🔍 CONFIG DEBUG - gotra raw:', data.data.gotra);
        console.log('🔍 CONFIG DEBUG - drorOption raw:', data.data.drorOption);
        console.log(
          '🔍 CONFIG DEBUG - smaajKeTaaj length:',
          data.data.smaajKeTaaj?.length,
        );
        console.log(
          '🔍 CONFIG DEBUG - banner length:',
          data.data.banner?.length,
        );

        // Process profiles - use actual API data
        const profiles =
          data.data.smaajKeTaaj && Array.isArray(data.data.smaajKeTaaj)
            ? data.data.smaajKeTaaj
            : [];
        console.log('🔍 CONFIG DEBUG - Processed profiles:', profiles);
        console.log('🔍 CONFIG DEBUG - Profiles count:', profiles.length);

        // Process banners - use actual API data
        let banners = [];
        if (data.data.banner && Array.isArray(data.data.banner)) {
          banners = data.data.banner.map((imageUrl, index) => ({
            id: index + 1,
            image: imageUrl,
            textColor: index % 2 === 0 ? '#000' : '#FFF',
          }));
        }
        console.log('🔍 CONFIG DEBUG - Processed banners:', banners);
        console.log('🔍 CONFIG DEBUG - Banners count:', banners.length);

        // Process ad popup - use actual API data
        const adUrl = data.data.addPopup || null;

        // Process gotra data - use actual API data
        const gotra =
          data.data.gotra && Array.isArray(data.data.gotra)
            ? data.data.gotra
            : [];

        // Process dror data - use actual API data
        const dror =
          data.data.drorOption && typeof data.data.drorOption === 'object'
            ? data.data.drorOption
            : null;

        const configData = {
          profileData: profiles,
          bannerData: banners,
          adPopupImage: adUrl,
          gotraData: gotra,
          drorData: dror,
        };

        console.log('🔍 CONFIG DEBUG - Final configData:', configData);

        // Update state
        setProfileData(configData.profileData);
        setBannerData(configData.bannerData);
        setAdPopupImage(configData.adPopupImage);
        setGotraData(configData.gotraData);
        setDrorData(configData.drorData);
        setIsDataStale(false);

        // Save to cache
        await saveToCache(configData);

        console.log('Configuration loaded successfully:', {
          profiles: configData.profileData.length,
          banners: configData.bannerData.length,
          hasAdPopup: !!configData.adPopupImage,
          gotraCount: configData.gotraData.length,
          drorOptions: configData.drorData
            ? Object.keys(configData.drorData).length
            : 0,
        });
      } else {
        console.log('Invalid API response or no data');
      }
    } catch (error) {
      console.error('Error fetching community configuration:', error);

      // Try to load from cache if API fails
      const cacheLoaded = await loadFromCache();

      if (!cacheLoaded && !isRefreshing) {
        Alert.alert(
          'Unable to Load Data',
          'Could not fetch configuration data. Please check your connection and try again.',
          [{text: 'OK', style: 'default'}],
        );
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Public methods
  const fetchConfiguration = async () => {
    await fetchConfigurationFromAPI(false);
  };

  const refreshConfiguration = async () => {
    await fetchConfigurationFromAPI(true);
  };

  // Load configuration when user logs in, clear when logs out
  useEffect(() => {
    const initializeConfiguration = async () => {
      if (!isLoggedIn || !token) {
        console.log(
          '🔍 CONFIG DEBUG - User not logged in, clearing configuration data',
        );
        // Clear all data when user logs out
        setProfileData([]);
        setBannerData([]);
        setAdPopupImage(null);
        setGotraData([]);
        setDrorData(null);
        setLastUpdated(null);
        setIsDataStale(false);
        return;
      }

      console.log(
        '🔍 CONFIG DEBUG - User logged in, initializing configuration',
      );

      // First try to load from cache
      const cacheLoaded = await loadFromCache();

      // If no cache or cache is stale, fetch from API
      if (!cacheLoaded || isDataStale) {
        await fetchConfiguration();
      }
    };

    initializeConfiguration();
  }, [isLoggedIn, token]); // Depend on login state

  // Check for stale data periodically
  useEffect(() => {
    const checkDataFreshness = () => {
      if (lastUpdated) {
        const now = Date.now();
        const dataAge = now - lastUpdated.getTime();
        setIsDataStale(dataAge > CACHE_DURATION);
      }
    };

    const interval = setInterval(checkDataFreshness, 5 * 60 * 1000); // Check every 5 minutes
    return () => clearInterval(interval);
  }, [lastUpdated]);

  const value: ConfigurationContextType = {
    // Data
    profileData,
    bannerData,
    adPopupImage,
    gotraData,
    drorData,

    // Loading states
    loading,
    refreshing,

    // Actions
    fetchConfiguration,
    refreshConfiguration,
    clearCache,

    // Helpers
    isDataStale,
    lastUpdated,
  };

  return (
    <ConfigurationContext.Provider value={value}>
      {children}
    </ConfigurationContext.Provider>
  );
};

// Hook to use configuration context
export const useConfiguration = () => {
  const context = useContext(ConfigurationContext);
  if (!context) {
    throw new Error(
      'useConfiguration must be used within a ConfigurationProvider',
    );
  }
  return context;
};
