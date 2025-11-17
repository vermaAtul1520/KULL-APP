import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
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
  icon?: string;
  screenName?: string;
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

export interface CommunityData {
  _id: string;
  name: string;
  description: string;
  code: string;
}

export interface CommunityConfiguration {
  _id: string;
  community: CommunityData;
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
  communityData: CommunityData | null;
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
  communityData: null,
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
export const ConfigurationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const {logout, isLoggedIn, token} = useAuth();

  // State - start with empty data
  const [profileData, setProfileData] = useState<SmaajKeTaajProfile[]>([]);
  const [bannerData, setBannerData] = useState<
    {id: number; image: string; textColor: string}[]
  >([]);
  const [communityData, setCommunityData] = useState<CommunityData | null>(null);
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

      if (!cachedData || !cachedTimestamp) {
        return false;
      }

      const timestamp = parseInt(cachedTimestamp);
      const now = Date.now();
      const isExpired = now - timestamp > CACHE_DURATION;
      const cacheAge = Math.floor((now - timestamp) / 1000 / 60); // minutes

      console.log('📦 CACHE - Found cached data');
      console.log('📦 CACHE - Age:', cacheAge, 'minutes');
      console.log('📦 CACHE - Expired:', isExpired);

      if (isExpired) {
        setIsDataStale(true);
        return false;
      }

      const parsedData = JSON.parse(cachedData);

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
      console.log('💾 SAVING TO CACHE - Banners count:', data.bannerData.length);
      await AsyncStorage.setItem(CONFIG_CACHE_KEY, JSON.stringify(data));
      await AsyncStorage.setItem(
        CONFIG_CACHE_TIMESTAMP_KEY,
        timestamp.toString(),
      );
      setLastUpdated(new Date(timestamp));
      console.log('✅ CACHE SAVED - Timestamp:', new Date(timestamp).toLocaleString());
    } catch (error) {
      console.error('❌ Error saving configuration to cache:', error);
    }
  };

  // Clear cache - wrapped with useCallback to prevent recreation
  const clearCache = useCallback(async () => {
    try {
      console.log('🗑️ CLEARING CACHE - Removing cached configuration data...');
      await AsyncStorage.removeItem(CONFIG_CACHE_KEY);
      await AsyncStorage.removeItem(CONFIG_CACHE_TIMESTAMP_KEY);
      setLastUpdated(null);
      setIsDataStale(false);
      console.log('✅ CACHE CLEARED - Ready to fetch fresh data');
    } catch (error) {
      console.error('❌ Error clearing configuration cache:', error);
    }
  }, []);

  // Fetch configuration from API
  const fetchConfigurationFromAPI = async (
    isRefreshing = false,
  ): Promise<void> => {
    try {
      if (isRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const COMMUNITY_ID = await getCommunityId();

      if (!COMMUNITY_ID) {
        throw new Error(
          'Community ID not found. Please ensure you are logged in properly.',
        );
      }

      const headers = await getAuthHeaders();

      const response = await fetch(
        `${BASE_URL}/api/communities/${COMMUNITY_ID}/configuration`,
        {
          method: 'GET',
          headers,
        },
      );

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
            await handleTokenExpiration();
            return;
          }
        }

        if (response.status === 404) {
          return;
        }

        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseText = await response.text();

      let data;

      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        throw new Error('Invalid JSON response');
      }

      // Check if the response indicates token expiration
      if (isTokenExpired(data)) {
        await handleTokenExpiration();
        return;
      }

      if (data.success && data.data) {
        // Process profiles - use actual API data
        const profiles =
          data.data.smaajKeTaaj && Array.isArray(data.data.smaajKeTaaj)
            ? data.data.smaajKeTaaj
            : [];

        // Process banners - use actual API data
        let banners = [];
        if (data.data.banner && Array.isArray(data.data.banner)) {
          banners = data.data.banner.map((imageUrl: string, index: number) => ({
            id: index + 1,
            image: imageUrl,
            textColor: index % 2 === 0 ? '#000' : '#FFF',
          }));
          console.log('✅ BANNERS PROCESSED - Total banners:', banners.length);
        } else {
          console.log('⚠️ NO BANNERS - data.data.banner is not an array or is missing');
        }

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

        const community = data.data.community;

        const configData = {
          profileData: profiles,
          bannerData: banners,
          community: community,
          adPopupImage: adUrl,
          gotraData: gotra,
          drorData: dror,
        };

        // Update state
        setProfileData(configData.profileData);
        setBannerData(configData.bannerData);
        setCommunityData(configData.community);
        setAdPopupImage(configData.adPopupImage);
        setGotraData(configData.gotraData);
        setDrorData(configData.drorData);
        setIsDataStale(false);

        // Save to cache
        await saveToCache(configData);
      } else {
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

  // Public methods - wrapped with useCallback to prevent recreation
  const fetchConfiguration = useCallback(async () => {
    await fetchConfigurationFromAPI(false);
  }, []);

  const refreshConfiguration = useCallback(async () => {
    console.log('🔄 REFRESH CONFIGURATION - Clearing cache and fetching fresh data...');
    // Clear cache first to ensure fresh data is fetched
    await clearCache();
    await fetchConfigurationFromAPI(true);
  }, [clearCache]);

  // Load configuration when user logs in, clear when logs out
  useEffect(() => {
    const initializeConfiguration = async () => {
      if (!isLoggedIn || !token) {
        // Clear all data when user logs out
        setProfileData([]);
        setBannerData([]);
        setCommunityData(null);
        setAdPopupImage(null);
        setGotraData([]);
        setDrorData(null);
        setLastUpdated(null);
        setIsDataStale(false);
        return;
      }

      // First try to load from cache
      const cacheLoaded = await loadFromCache();

      // If no cache or cache is stale, fetch from API
      if (!cacheLoaded) {
        await fetchConfiguration();
      }
    };

    initializeConfiguration();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, token]); // Only re-run when login state changes

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

  // Memoize drorData to prevent object recreation
  const memoizedDrorData = useMemo(() => drorData, [drorData]);

  const value: ConfigurationContextType = useMemo(
    () => ({
      // Data
      profileData,
      bannerData,
      communityData,
      adPopupImage,
      gotraData,
      drorData: memoizedDrorData,

      // Loading states
      loading,
      refreshing,

      // Actions
      setCommunityData,
      fetchConfiguration,
      refreshConfiguration,
      clearCache,

      // Helpers
      isDataStale,
      lastUpdated,
    }),
    [
      profileData,
      bannerData,
      communityData,
      adPopupImage,
      gotraData,
      memoizedDrorData,
      loading,
      refreshing,
      fetchConfiguration,
      refreshConfiguration,
      clearCache,
      isDataStale,
      lastUpdated,
    ],
  );

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
