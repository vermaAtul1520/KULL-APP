import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useMemo,
  useCallback,
  useRef,
} from 'react';
import {
  Image,
  Pressable,
  useColorScheme,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  InteractionManager,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  createDrawerNavigator,
  DrawerNavigationProp,
  DrawerNavigationOptions,
} from '@react-navigation/drawer';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  useNavigation,
  useNavigationState,
  NavigatorScreenParams,
  CommonActions,
} from '@react-navigation/native';
import {ConfigurationProvider, useConfiguration} from '@app/hooks/ConfigContext';
import HomeScreen from '@app/screens/Home/HomeScreen';
import PostScreen from '@app/screens/PostScreen';
import NewsScreen from '@app/screens/NewsScreen';
import MyPeopleScreen from '@app/screens/MyPeopleScreen';
import DonationScreen from '@app/screens/DonationScreen';
import DrawerContent from '@app/screens/DrawerContent';
import Logo from '@app/assets/images/hamburger.svg';
import {Text, Alert} from 'react-native';
import {StyleSheet} from 'react-native';
import {useLanguage} from '@app/hooks/LanguageContext';

// Import auth screens
import WelcomeScreen from '@app/screens/Login/WelcomeScreen';
import LoginScreen from '@app/screens/Login/LoginScreen';
import CommunityChoiceScreen from '@app/screens/Login/CommunityChoiceScreen';
import RequestCommunityScreen from '@app/screens/Login/RequestCommunityScreen';
import JoinCommunityScreen from '@app/screens/Login/JoinCommunityScreen';
import HomeIcon from '@app/assets/images/homeIcon.svg';
import PostIcon from '@app/assets/images/posts.svg';
import NewsIcon from '@app/assets/images/news.svg';
import PeopleIcon from '@app/assets/images/people.svg';
import DonationIcon from '@app/assets/images/donation.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import drawer screens
import {
  OccasionTypesScreen,
  CategoriesScreen,
  FiltersScreen,
  GenderSelectionScreen,
  ContentScreen,
} from '@app/screens/Occasions';
import {OccasionProvider} from '@app/contexts/OccasionContext';
// import OccasionsScreen from '@app/screens/drawer/OccasionsScreen';
import KartavyaScreen from '@app/screens/drawer/KartavyaScreen';
import BhajanScreen, {BackIcon} from '@app/screens/drawer/BhajanScreen';
import LawsScreen from '@app/screens/drawer/LawsScreen';
import CitySearchScreen from '@app/screens/drawer/CitySearchScreen';
import OrganizationOfficerScreen from '@app/screens/drawer/OrganizationOfficerScreen';
import EducationScreen from '@app/screens/drawer/EducationScreen';
import EmploymentScreen from '@app/screens/drawer/EmploymentScreen';
import SocialUpliftmentScreen from '@app/screens/drawer/SocialUpliftmentScreen';
import DukanScreen from '@app/screens/drawer/DukanScreen';
import GamesScreen from '@app/screens/drawer/GamesScreen';
import SportsScreen from '@app/screens/drawer/SportsScreen';
import MeetingsScreen from '@app/screens/drawer/MeetingsScreen';
import AppealScreen from '@app/screens/drawer/AppealScreen';
import VoteScreen from '@app/screens/drawer/VoteScreen';
import FamilyTreeScreen from '@app/screens/drawer/FamilyTreeScreen';
import AddFamilyMemberScreen from '@app/screens/drawer/AddFamilyMemberScreen';
import {getAuthHeaders, getCommunityId} from '@app/constants/apiUtils';
import {BASE_URL} from '@app/constants/constant';
import SettingsScreen from '@app/screens/drawer/SettingScreen';
import ImagePickerComponent from '@app/components/ImagePicker';

// Custom Colors
const AppColors = {
  primary: '#7dd3c0',
  black: '#000000',
  white: '#ffffff',
  gray: '#666666',
  dark: '#2a2a2a',
  teal: '#1e6b5c',
  cream: '#f5f5dc',
  lightGray: '#f8f9fa',
  border: '#e5e7eb',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
};

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: boolean;
  communityStatus: string;
  roleInCommunity: string;
  interests: string[];
  code: string;
  createdAt: string;
  __v: number;
  profileImage?: string;
  responsibilities?: string[];
  permissions?: string[];
  community?: {
    _id: string;
    name: string;
  };
}

// Types
type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  CommunityChoice: undefined;
  RequestCommunity: undefined;
  JoinCommunity: undefined;
};

type RootDrawerParamList = {
  HomeTab: NavigatorScreenParams<HomeTabParamList> | undefined;
};

type HomeTabParamList = {
  Home: NavigatorScreenParams<HomeStackParamList> | undefined;
  Post: NavigatorScreenParams<PostStackParamList> | undefined;
  News: NavigatorScreenParams<NewsStackParamList> | undefined;
  MyPeople: NavigatorScreenParams<MyPeopleStackParamList> | undefined;
  Donation: NavigatorScreenParams<DonationStackParamList> | undefined;
};

type HomeStackParamList = {
  HomeScreen: undefined;
  Occasions: undefined;
  OccasionCategories: {occasionType: string};
  OccasionFilters: {
    occasionType: string;
    categoryId: string | null;
    categoryName: string | null;
  };
  OccasionGenderSelection: {
    occasionType: string;
    categoryId: string | null;
    categoryName: string | null;
    filterId: string | null;
    filterName: string | null;
  };
  OccasionContent: {
    occasionType: string;
    categoryId: string | null;
    categoryName: string | null;
    filterId: string | null;
    filterName: string | null;
    gender: string;
  };
  Kartavya: undefined;
  Bhajan: undefined;
  Games: undefined;
  'Laws and Decisions': undefined;
  CitySearch: undefined;
  OrganizationOfficer: undefined;
  Education: undefined;
  Employment: undefined;
  Sports: undefined;
  'Social Upliftment': undefined;
  Dukan: undefined;
  Meetings: undefined;
  Appeal: undefined;
  Vote: undefined;
  Settings: undefined;
  FamilyTree: undefined;
  AddFamilyMember: undefined;
};

type PostStackParamList = HomeStackParamList & {
  PostScreen: undefined;
};

type NewsStackParamList = HomeStackParamList & {
  NewsScreen: undefined;
};

type MyPeopleStackParamList = HomeStackParamList & {
  MyPeopleScreen: undefined;
};

type DonationStackParamList = HomeStackParamList & {
  DonationScreen: undefined;
};

type RootStackParamList = {
  DrawerNavigator: undefined;
  Profile: undefined;
};

// Auth Context
interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  token: string | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
  isLoading: boolean;
  updateUser: (userData: Partial<User>) => Promise<void>;
  bannerData: {id: number; image: string; textColor: string}[];
  setBannerData: (
    banners: {id: number; image: string; textColor: string}[],
  ) => void;
  bannerLoading: boolean;
  refreshBanners: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
  isLoading: true,
  updateUser: async () => {},
  bannerData: [],
  setBannerData: () => {},
  bannerLoading: true,
  refreshBanners: async () => {},
});

// Auth Provider
const AuthProvider = ({children}: {children: React.ReactNode}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [bannerData, setBannerDataState] = useState<
    {id: number; image: string; textColor: string}[]
  >([]);
  const [bannerLoading, setBannerLoading] = useState(true);

  const defaultBannerData = useMemo(
    () => [
      {
        id: 1,
        textColor: '#000',
        image:
          'https://plixlifefcstage-media.farziengineer.co/hosted/shradhaKapoor-a5a533c43c49.jpg',
      },
      {
        id: 2,
        textColor: '#FFF',
        image:
          'https://plixlifefcstage-media.farziengineer.co/hosted/shradhaKapoor-a5a533c43c49.jpg',
      },
    ],
    [],
  );

  useEffect(() => {
    checkAuthState();
  }, []);

  const fetchBannerData = useCallback(async () => {
    try {
      setBannerLoading(true);
      const COMMUNITY_ID = await getCommunityId();
      const headers = await getAuthHeaders();

      const response = await fetch(
        `${BASE_URL}/api/communities/${COMMUNITY_ID}/configuration`,
        {
          method: 'GET',
          headers,
        },
      );

      if (!response.ok) {
        setBannerDataState(defaultBannerData);
        return;
      }

      const responseText = await response.text();
      const data = JSON.parse(responseText);

      if (
        data.success &&
        data.data &&
        data.data.banner &&
        Array.isArray(data.data.banner)
      ) {
        const banners = data.data.banner.map(
          (imageUrl: string, index: number) => ({
            id: index + 1,
            image: imageUrl,
            textColor: index % 2 === 0 ? '#000' : '#FFF',
          }),
        );
        setBannerDataState(banners.length > 0 ? banners : defaultBannerData);
      } else {
        setBannerDataState(defaultBannerData);
      }
    } catch (error) {
      console.error('Error fetching banner data:', error);
      setBannerDataState(defaultBannerData);
    } finally {
      setBannerLoading(false);
    }
  }, [defaultBannerData]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchBannerData();
    }
  }, [isLoggedIn, fetchBannerData]);

  const setBannerData = useCallback(
    (banners: {id: number; image: string; textColor: string}[]) => {
      setBannerDataState(banners);
    },
    [],
  );

  const refreshBanners = useCallback(async () => {
    console.log('🔄 REFRESH BANNERS - Manually refreshing banner data...');
    await fetchBannerData();
  }, [fetchBannerData]);

  const checkAuthState = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('userToken');
      const storedUserData = await AsyncStorage.getItem('userData');

      if (storedToken && storedUserData) {
        const userData = JSON.parse(storedUserData);
        setToken(storedToken);
        setUser(userData);
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = useCallback((userData: User, userToken: string) => {
    setUser(userData);
    setToken(userToken);
    setIsLoggedIn(true);
  }, []);

  const updateUser = useCallback(
    async (updatedData: Partial<User>) => {
      if (!user) {
        throw new Error('No user data available');
      }

      const headers = await getAuthHeaders();

      const response = await fetch(`${BASE_URL}/api/users/profile`, {
        method: 'PUT',
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update profile: ${response.status}`);
      }

      const apiResponse = await response.json();

      if (apiResponse.success && apiResponse.user) {
        // CRITICAL FIX: Preserve the original community object structure
        // Backend may return community as string, but we need it as object
        let preservedCommunity = user.community;

        // If API returned community data, handle both string and object formats
        if (apiResponse.user.community) {
          if (typeof apiResponse.user.community === 'string') {
            // Backend returned community as string ID - convert to object format
            console.log('🔧 UPDATE USER - Converting community string to object');
            preservedCommunity = {
              _id: apiResponse.user.community,
              name: user.community?.name || '',
            };
          } else if (typeof apiResponse.user.community === 'object' && apiResponse.user.community._id) {
            // Backend returned community as object - use it
            console.log('🔧 UPDATE USER - Using community object from API');
            preservedCommunity = apiResponse.user.community;
          }
        }

        // Build updated user with preserved community
        const updatedUser = {
          ...user,
          ...apiResponse.user,
          community: preservedCommunity, // Always preserve community as object
        };

        console.log('🔧 UPDATE USER - Final user.community:', updatedUser.community);
        console.log('🔧 UPDATE USER - Final community type:', typeof updatedUser.community);
        console.log('🔧 UPDATE USER - Final community._id:', updatedUser.community?._id);

        setUser(updatedUser);
        await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));

        console.log('✅ UPDATE USER - Profile updated and saved to AsyncStorage');
        console.log('✅ UPDATE USER - Community preserved:', updatedUser.community);
      } else {
        throw new Error(apiResponse.message || 'Failed to update profile');
      }
    },
    [user],
  );

  const logout = useCallback(async () => {
    try {
      // Clear AsyncStorage first
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');

      // Wait for all interactions to complete before updating state
      // This prevents the "child already has a parent" error
      InteractionManager.runAfterInteractions(() => {
        // Use setTimeout to ensure all views are properly unmounted
        setTimeout(() => {
          setUser(null);
          setToken(null);
          setIsLoggedIn(false);
        }, 100);
      });
    } catch (error) {
      console.error('Error during logout:', error);
      // Even if there's an error, still try to logout
      setUser(null);
      setToken(null);
      setIsLoggedIn(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      isLoggedIn,
      user,
      token,
      login,
      logout,
      isLoading,
      updateUser,
      bannerData,
      setBannerData,
      bannerLoading,
      refreshBanners,
    }),
    [
      isLoggedIn,
      user,
      token,
      login,
      logout,
      isLoading,
      updateUser,
      bannerData,
      setBannerData,
      bannerLoading,
      refreshBanners,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

// Profile Avatar Component
const ProfileAvatar = React.memo((): React.JSX.Element => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {user} = useAuth();

  const getInitials = () => {
    if (user) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(
        0,
      )}`.toUpperCase();
    }
    return 'U';
  };

  const handlePress = useCallback(() => {
    navigation.navigate('Profile');
  }, [navigation]);

  return (
    <Pressable
      onPress={handlePress}
      style={styles.profileAvatarContainer}>
      <View style={styles.profileAvatar}>
        {user?.profileImage ? (
          <Image source={{uri: user.profileImage}} style={styles.navbarImage} />
        ) : (
          <Text style={styles.profileAvatarText}>{getInitials()}</Text>
        )}
      </View>
    </Pressable>
  );
});

const DrawerButton = React.memo((): React.JSX.Element => {
  const {toggleDrawer} =
    useNavigation<DrawerNavigationProp<RootDrawerParamList>>();
  return (
    <Pressable onPress={toggleDrawer} style={styles.drawerButtonContainer}>
      <Logo width={20} height={20} color={AppColors.black} />
    </Pressable>
  );
});

const CustomHeaderTitle = React.memo(() => {
  const navigation = useNavigation<DrawerNavigationProp<RootDrawerParamList>>();

  const {communityData} = useConfiguration();
  const {t} = useLanguage();

  // Use useNavigationState to get current route name reactively
  const currentRouteName = useNavigationState(
    state => state?.routes[state?.index || 0]?.name,
  ) as keyof RootDrawerParamList | undefined;

  const navigateToHome = useCallback(() => {
    navigation.navigate('HomeTab');
  }, [navigation]);

  const getCommunityName = useCallback(() => {
    console.log('getCommunityName', communityData);
    if (communityData?.name) {
      return communityData.name.toUpperCase();
    }
    return 'KULL-APP';
  }, [ communityData]);

  const displayTitle = useMemo(() => {
    if (currentRouteName === 'HomeTab') {
      return getCommunityName();
    }

    const screenTitles: Record<string, string> = {
      Occasions: t('Occasions') || 'OCCASIONS',
      OccasionCategories: t('Categories') || 'CATEGORIES',
      OccasionFilters: t('Filters') || 'FILTERS',
      OccasionGender: t('Gender Selection') || 'GENDER SELECTION',
      OccasionContent: t('Content') || 'CONTENT',
      Kartavya: t('Kartavya') || 'KARTAVYA',
      Bhajan: t('Bhajan') || 'BHAJAN',
      Games: t('Games') || 'GAMES',
      'Laws and Decisions': t('Laws and Decisions') || 'LAWS & DECISIONS',
      CitySearch: t('CitySearch') || 'CITY SEARCH',
      OrganizationOfficer: t('OrganizationOfficer') || 'ORGANIZATION OFFICER',
      Education: t('Education') || 'EDUCATION',
      Employment: t('Employment') || 'EMPLOYMENT',
      Sports: t('Sports') || 'SPORTS',
      'Social Upliftment': t('Social Upliftment') || 'SOCIAL UPLIFTMENT',
      Dukan: t('Dukan') || 'DUKAN',
      Meetings: t('Meetings') || 'MEETINGS',
      Appeal: t('Appeal') || 'APPEAL',
      Vote: t('Vote') || 'VOTE',
      Settings: t('Settings') || 'SETTINGS',
      FamilyTree: t('Family Tree') || 'FAMILY TREE',
      AddFamilyMember: t('Add Family Member') || 'ADD FAMILY MEMBER',
    };

    return (
      (currentRouteName && screenTitles[currentRouteName]) || getCommunityName()
    );
  }, [currentRouteName, getCommunityName, t]);

  return (
    <Pressable onPress={navigateToHome} style={styles.headerTitleContainer}>
      <Text style={styles.headerTitleText}>{displayTitle}</Text>
    </Pressable>
  );
});

// Stable header component renderers
const renderDrawerButton = () => <DrawerButton />;
const renderCustomHeaderTitle = () => <CustomHeaderTitle />;
const renderProfileAvatar = () => <ProfileAvatar />;

// Common screen options that work for both NativeStack and Drawer navigators
const commonScreenOptions = {
  headerShown: true,
  headerLeft: renderDrawerButton,
  headerTitle: renderCustomHeaderTitle,
  headerRight: renderProfileAvatar,
  headerStyle: {
    backgroundColor: AppColors.primary,
  },
  headerTitleStyle: {
    color: AppColors.black,
    fontWeight: '700' as '700',
  },
  headerShadowVisible: false,
  headerTitleAlign: 'center' as const,
  headerLeftContainerStyle: {
    paddingLeft: 10,
  },
  headerRightContainerStyle: {
    paddingRight: 10,
  },
};

// Memoize to prevent creating new object references on every render
const stackScreenOptions: NativeStackNavigationOptions =
  commonScreenOptions as NativeStackNavigationOptions;

const drawerScreenOptions: DrawerNavigationOptions =
  commonScreenOptions as DrawerNavigationOptions;

// Profile Screen Component
const ProfileScreen = (): React.JSX.Element => {
  const navigation = useNavigation();
  const {user, logout, updateUser} = useAuth();
  const {t} = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<Partial<User>>({});
  const [interestsText, setInterestsText] = useState('');

  useEffect(() => {
    if (user) {
      setEditedUser({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        interests: user.interests,
        profileImage: user.profileImage,
      });
      // Initialize interests text from user interests
      setInterestsText(user.interests?.join(', ') || '');
    }
  }, [user]);

  const handleSave = async () => {
    try {
      await updateUser(editedUser);
      setIsEditing(false);
      Alert.alert(
        t('Success') || 'Success',
        t('Profile updated successfully!') || 'Profile updated successfully!',
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to update profile';
      Alert.alert(t('Error') || 'Error', errorMessage);
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      t('Sign Out') || 'Sign Out',
      t('Are you sure you want to sign out?') ||
        'Are you sure you want to sign out?',
      [
        {
          text: t('Cancel') || 'Cancel',
          style: 'cancel',
        },
        {
          text: t('Sign Out') || 'Sign Out',
          style: 'destructive',
          onPress: () => {
            // Navigate back before logout to prevent view hierarchy issues
            navigation.goBack();
            // Small delay to ensure navigation is complete
            setTimeout(() => {
              logout();
            }, 300);
          },
        },
      ],
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
      case 'active':
        return AppColors.success;
      case 'pending':
        return AppColors.warning;
      case 'rejected':
        return AppColors.danger;
      default:
        return AppColors.gray;
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          {t('No user data available') || 'No user data available'}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <BackIcon size={24} color={AppColors.black} />
        </TouchableOpacity>

        <Text style={styles.profileTitle}>{t('Profile') || 'Profile'}</Text>

        <Pressable
          onPress={() => {
            if (isEditing) {
              // Cancel editing - reset to original user data
              if (user) {
                setEditedUser({
                  firstName: user.firstName,
                  lastName: user.lastName,
                  email: user.email,
                  interests: user.interests,
                  profileImage: user.profileImage,
                });
                setInterestsText(user.interests?.join(', ') || '');
              }
            }
            setIsEditing(!isEditing);
          }}
          style={styles.headerButton}>
          <Text style={styles.headerButtonText}>
            {isEditing ? t('Cancel') || 'Cancel' : t('Edit') || 'Edit'}
          </Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            {isEditing ? (
              <ImagePickerComponent
                onImageSelected={(imageUrl: any) =>
                  setEditedUser({...editedUser, profileImage: imageUrl})
                }
                currentImage={editedUser.profileImage || user.profileImage}
                size={80}
              />
            ) : user.profileImage ? (
              <Image
                source={{uri: user.profileImage}}
                style={styles.profileAvatarLarge}
              />
            ) : (
              <View style={styles.profileAvatarLarge}>
                <Text style={styles.avatarText}>
                  {`${user.firstName.charAt(0)}${user.lastName.charAt(
                    0,
                  )}`.toUpperCase()}
                </Text>
              </View>
            )}
          </View>

          <Text style={styles.fullName}>
            {`${user.firstName} ${user.lastName}`}
          </Text>
          <Text style={styles.emailText}>{user.email}</Text>

          <View
            style={[
              styles.statusChip,
              {backgroundColor: getStatusColor(user.communityStatus)},
            ]}>
            <Text style={styles.statusText}>
              {user.communityStatus.toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.formSection}>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>
              {t('Personal Information') || 'Personal Information'}
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                {t('First Name') || 'First Name'}
              </Text>
              <View style={styles.readOnlyField}>
                <Text style={styles.fieldValue}>{user.firstName}</Text>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('Last Name') || 'Last Name'}</Text>
              <View style={styles.readOnlyField}>
                <Text style={styles.fieldValue}>{user.lastName}</Text>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('Email') || 'Email'}</Text>
              <View style={styles.readOnlyField}>
                <Text style={styles.fieldValue}>{user.email}</Text>
              </View>
            </View>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>
              {t('Community Details') || 'Community Details'}
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('Role') || 'Role'}</Text>
              <View style={styles.readOnlyField}>
                <Text style={styles.fieldValue}>{user.roleInCommunity}</Text>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                {t('Member Since') || 'Member Since'}
              </Text>
              <View style={styles.readOnlyField}>
                <Text style={styles.fieldValue}>
                  {formatDate(user.createdAt)}
                </Text>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('User ID') || 'User ID'}</Text>
              <View style={styles.readOnlyField}>
                <Text style={[styles.fieldValue, styles.codeText]}>
                  {user.code}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>
              {t('Interests') || 'Interests'}
            </Text>

            {isEditing ? (
              <TextInput
                style={[styles.input, styles.textArea]}
                value={interestsText}
                onChangeText={(text: string) => {
                  // Store the raw text to preserve spaces and current typing
                  setInterestsText(text);
                  
                  // Update interests array by splitting by comma, trimming, and filtering empty
                  const interestsArray = text
                    .split(',')
                    .map((item: string) => item.trim())
                    .filter((item: string) => item.length > 0);
                  
                  setEditedUser({
                    ...editedUser,
                    interests: interestsArray,
                  });
                }}
                placeholder={
                  t('Enter interests separated by commas') ||
                  'Enter interests separated by commas'
                }
                multiline
                autoCapitalize="none"
                autoCorrect={false}
              />
            ) : (
              <View style={styles.interestsContainer}>
                {user.interests.length > 0 ? (
                  user.interests.map((interest, index) => (
                    <View key={index} style={styles.interestChip}>
                      <Text style={styles.interestText}>{interest}</Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.noInterests}>
                    {t('No interests added') || 'No interests added'}
                  </Text>
                )}
              </View>
            )}
          </View>

          <View style={styles.buttonSection}>
            {isEditing && (
              <Pressable style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>
                  {t('Save Changes') || 'Save Changes'}
                </Text>
              </Pressable>
            )}

            <Pressable style={styles.signOutButton} onPress={handleSignOut}>
              <Text style={styles.signOutButtonText}>
                {t('Sign Out') || 'Sign Out'}
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

// Tab Bar Icon Renderer
const RenderTabBarIcon = ({
  focused,
  color,
  size,
  route,
}: {
  focused: boolean;
  color: string;
  size: number;
  route: {name: keyof HomeTabParamList};
}): React.JSX.Element => {
  const iconSize = size || 24;

  switch (route.name) {
    case 'Home':
      return <HomeIcon width={iconSize} height={iconSize} color={color} />;
    case 'Post':
      return <PostIcon width={iconSize} height={iconSize} color={color} />;
    case 'News':
      return <NewsIcon width={iconSize} height={iconSize} color={color} />;
    case 'MyPeople':
      return <PeopleIcon width={iconSize} height={iconSize} color={color} />;
    case 'Donation':
      return <DonationIcon width={iconSize} height={iconSize} color={color} />;
    default:
      return <Icon name="circle" size={iconSize} color={color} />;
  }
};

// Auth Stack Navigator
const AuthStack = (): React.JSX.Element => {
  const {Navigator, Screen} = createNativeStackNavigator<AuthStackParamList>();

  return (
    <Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Welcome">
      <Screen name="Welcome" component={WelcomeScreen} />
      <Screen name="Login" component={LoginScreen} />
      <Screen name="CommunityChoice" component={CommunityChoiceScreen} />
      <Screen name="RequestCommunity" component={RequestCommunityScreen} />
      <Screen name="JoinCommunity" component={JoinCommunityScreen} />
    </Navigator>
  );
};

// Tab bar options - CONSTANT to prevent recreation
const tabBarOptions = {
  tabBarActiveTintColor: AppColors.primary,
  tabBarInactiveTintColor: AppColors.gray,
  headerShown: false,
  tabBarHideOnKeyboard: true,
  tabBarStyle: {
    backgroundColor: AppColors.black,
    borderTopWidth: 0,
  },
  tabBarLabelStyle: {
    fontSize: 12,
  },
};

// Icon render functions - STABLE REFERENCES
const renderHomeIcon = ({color, size}: {color: string; size: number}) => (
  <HomeIcon width={size} height={size} color={color} />
);
const renderPostIcon = ({color, size}: {color: string; size: number}) => (
  <PostIcon width={size} height={size} color={color} />
);
const renderNewsIcon = ({color, size}: {color: string; size: number}) => (
  <NewsIcon width={size} height={size} color={color} />
);
const renderPeopleIcon = ({color, size}: {color: string; size: number}) => (
  <PeopleIcon width={size} height={size} color={color} />
);
const renderDonationIcon = ({color, size}: {color: string; size: number}) => (
  <DonationIcon width={size} height={size} color={color} />
);

// Screen options - CONSTANTS outside component with icons
const homeTabScreenOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: renderHomeIcon,
};
const postTabScreenOptions = {
  tabBarLabel: 'Post',
  tabBarIcon: renderPostIcon,
};
const newsTabScreenOptions = {
  tabBarLabel: 'News',
  tabBarIcon: renderNewsIcon,
};
const peopleTabScreenOptions = {
  tabBarLabel: 'My People',
  tabBarIcon: renderPeopleIcon,
};
const donationTabScreenOptions = {
  tabBarLabel: 'Donation',
  tabBarIcon: renderDonationIcon,
};

// Home Tab Navigator with Stack Navigators
const HomeTab = (): React.JSX.Element => {
  const {Navigator, Screen} = createBottomTabNavigator<HomeTabParamList>();

  return (
    <Navigator screenOptions={tabBarOptions}>
      <Screen
        name="Home"
        component={HomeStackNavigator}
        options={homeTabScreenOptions}
      />
      <Screen
        name="Post"
        component={PostStackNavigator}
        options={postTabScreenOptions}
      />
      <Screen
        name="News"
        component={NewsStackNavigator}
        options={newsTabScreenOptions}
      />
      <Screen
        name="MyPeople"
        component={MyPeopleStackNavigator}
        options={peopleTabScreenOptions}
      />
      <Screen
        name="Donation"
        component={DonationStackNavigator}
        options={donationTabScreenOptions}
      />
    </Navigator>
  );
};

// Individual stack navigators for each tab
const HomeStackNavigator = (): React.JSX.Element => {
  const {Navigator, Screen} = createNativeStackNavigator();
  return (
    <Navigator screenOptions={stackScreenOptions}>
      <Screen name="HomeScreen" component={HomeScreen} />
      {/* Add drawer screens to each tab stack so bottom tabs remain visible */}
      <Screen name="Occasions" component={OccasionTypesScreen} />
      <Screen name="OccasionCategories" component={CategoriesScreen} />
      <Screen name="OccasionFilters" component={FiltersScreen} />
      <Screen
        name="OccasionGenderSelection"
        component={GenderSelectionScreen}
      />
      <Screen name="OccasionContent" component={ContentScreen} />
      <Screen name="Kartavya" component={KartavyaScreen} />
      <Screen name="Bhajan" component={BhajanScreen} />
      <Screen name="Games" component={GamesScreen} />
      <Screen name="Laws and Decisions" component={LawsScreen} />
      <Screen name="CitySearch" component={CitySearchScreen} />
      <Screen
        name="OrganizationOfficer"
        component={OrganizationOfficerScreen}
      />
      <Screen name="Education" component={EducationScreen} />
      <Screen name="Employment" component={EmploymentScreen} />
      <Screen name="Sports" component={SportsScreen} />
      <Screen name="Social Upliftment" component={SocialUpliftmentScreen} />
      <Screen name="Dukan" component={DukanScreen} />
      <Screen name="Meetings" component={MeetingsScreen} />
      <Screen name="Appeal" component={AppealScreen} />
      <Screen name="Vote" component={VoteScreen} />
      <Screen name="Settings" component={SettingsScreen} />
      <Screen name="FamilyTree" component={FamilyTreeScreen} />
      <Screen name="AddFamilyMember" component={AddFamilyMemberScreen} />
    </Navigator>
  );
};

const PostStackNavigator = (): React.JSX.Element => {
  const {Navigator, Screen} = createNativeStackNavigator();
  return (
    <Navigator screenOptions={stackScreenOptions}>
      <Screen name="PostScreen" component={PostScreen} />
      {/* Add drawer screens to each tab stack so bottom tabs remain visible */}
      <Screen name="Occasions" component={OccasionTypesScreen} />
      <Screen name="OccasionCategories" component={CategoriesScreen} />
      <Screen name="OccasionFilters" component={FiltersScreen} />
      <Screen
        name="OccasionGenderSelection"
        component={GenderSelectionScreen}
      />
      <Screen name="OccasionContent" component={ContentScreen} />
      <Screen name="Kartavya" component={KartavyaScreen} />
      <Screen name="Bhajan" component={BhajanScreen} />
      <Screen name="Games" component={GamesScreen} />
      <Screen name="Laws and Decisions" component={LawsScreen} />
      <Screen name="CitySearch" component={CitySearchScreen} />
      <Screen
        name="OrganizationOfficer"
        component={OrganizationOfficerScreen}
      />
      <Screen name="Education" component={EducationScreen} />
      <Screen name="Employment" component={EmploymentScreen} />
      <Screen name="Sports" component={SportsScreen} />
      <Screen name="Social Upliftment" component={SocialUpliftmentScreen} />
      <Screen name="Dukan" component={DukanScreen} />
      <Screen name="Meetings" component={MeetingsScreen} />
      <Screen name="Appeal" component={AppealScreen} />
      <Screen name="Vote" component={VoteScreen} />
      <Screen name="Settings" component={SettingsScreen} />
      <Screen name="FamilyTree" component={FamilyTreeScreen} />
      <Screen name="AddFamilyMember" component={AddFamilyMemberScreen} />
    </Navigator>
  );
};

const NewsStackNavigator = (): React.JSX.Element => {
  const {Navigator, Screen} = createNativeStackNavigator();
  return (
    <Navigator screenOptions={stackScreenOptions}>
      <Screen name="NewsScreen" component={NewsScreen} />
      {/* Add drawer screens to each tab stack so bottom tabs remain visible */}
      <Screen name="Occasions" component={OccasionTypesScreen} />
      <Screen name="OccasionCategories" component={CategoriesScreen} />
      <Screen name="OccasionFilters" component={FiltersScreen} />
      <Screen
        name="OccasionGenderSelection"
        component={GenderSelectionScreen}
      />
      <Screen name="OccasionContent" component={ContentScreen} />
      <Screen name="Kartavya" component={KartavyaScreen} />
      <Screen name="Bhajan" component={BhajanScreen} />
      <Screen name="Games" component={GamesScreen} />
      <Screen name="Laws and Decisions" component={LawsScreen} />
      <Screen name="CitySearch" component={CitySearchScreen} />
      <Screen
        name="OrganizationOfficer"
        component={OrganizationOfficerScreen}
      />
      <Screen name="Education" component={EducationScreen} />
      <Screen name="Employment" component={EmploymentScreen} />
      <Screen name="Sports" component={SportsScreen} />
      <Screen name="Social Upliftment" component={SocialUpliftmentScreen} />
      <Screen name="Dukan" component={DukanScreen} />
      <Screen name="Meetings" component={MeetingsScreen} />
      <Screen name="Appeal" component={AppealScreen} />
      <Screen name="Vote" component={VoteScreen} />
      <Screen name="Settings" component={SettingsScreen} />
      <Screen name="FamilyTree" component={FamilyTreeScreen} />
      <Screen name="AddFamilyMember" component={AddFamilyMemberScreen} />
    </Navigator>
  );
};

const MyPeopleStackNavigator = (): React.JSX.Element => {
  const {Navigator, Screen} = createNativeStackNavigator();
  return (
    <Navigator screenOptions={stackScreenOptions}>
      <Screen name="MyPeopleScreen" component={MyPeopleScreen} />
      {/* Add drawer screens to each tab stack so bottom tabs remain visible */}
      <Screen name="Occasions" component={OccasionTypesScreen} />
      <Screen name="OccasionCategories" component={CategoriesScreen} />
      <Screen name="OccasionFilters" component={FiltersScreen} />
      <Screen
        name="OccasionGenderSelection"
        component={GenderSelectionScreen}
      />
      <Screen name="OccasionContent" component={ContentScreen} />
      <Screen name="Kartavya" component={KartavyaScreen} />
      <Screen name="Bhajan" component={BhajanScreen} />
      <Screen name="Games" component={GamesScreen} />
      <Screen name="Laws and Decisions" component={LawsScreen} />
      <Screen name="CitySearch" component={CitySearchScreen} />
      <Screen
        name="OrganizationOfficer"
        component={OrganizationOfficerScreen}
      />
      <Screen name="Education" component={EducationScreen} />
      <Screen name="Employment" component={EmploymentScreen} />
      <Screen name="Sports" component={SportsScreen} />
      <Screen name="Social Upliftment" component={SocialUpliftmentScreen} />
      <Screen name="Dukan" component={DukanScreen} />
      <Screen name="Meetings" component={MeetingsScreen} />
      <Screen name="Appeal" component={AppealScreen} />
      <Screen name="Vote" component={VoteScreen} />
      <Screen name="Settings" component={SettingsScreen} />
      <Screen name="FamilyTree" component={FamilyTreeScreen} />
      <Screen name="AddFamilyMember" component={AddFamilyMemberScreen} />
    </Navigator>
  );
};

const DonationStackNavigator = (): React.JSX.Element => {
  const {Navigator, Screen} = createNativeStackNavigator();
  return (
    <Navigator screenOptions={stackScreenOptions}>
      <Screen name="DonationScreen" component={DonationScreen} />
      {/* Add drawer screens to each tab stack so bottom tabs remain visible */}
      <Screen name="Occasions" component={OccasionTypesScreen} />
      <Screen name="OccasionCategories" component={CategoriesScreen} />
      <Screen name="OccasionFilters" component={FiltersScreen} />
      <Screen
        name="OccasionGenderSelection"
        component={GenderSelectionScreen}
      />
      <Screen name="OccasionContent" component={ContentScreen} />
      <Screen name="Kartavya" component={KartavyaScreen} />
      <Screen name="Bhajan" component={BhajanScreen} />
      <Screen name="Games" component={GamesScreen} />
      <Screen name="Laws and Decisions" component={LawsScreen} />
      <Screen name="CitySearch" component={CitySearchScreen} />
      <Screen
        name="OrganizationOfficer"
        component={OrganizationOfficerScreen}
      />
      <Screen name="Education" component={EducationScreen} />
      <Screen name="Employment" component={EmploymentScreen} />
      <Screen name="Sports" component={SportsScreen} />
      <Screen name="Social Upliftment" component={SocialUpliftmentScreen} />
      <Screen name="Dukan" component={DukanScreen} />
      <Screen name="Meetings" component={MeetingsScreen} />
      <Screen name="Appeal" component={AppealScreen} />
      <Screen name="Vote" component={VoteScreen} />
      <Screen name="Settings" component={SettingsScreen} />
      <Screen name="FamilyTree" component={FamilyTreeScreen} />
      <Screen name="AddFamilyMember" component={AddFamilyMemberScreen} />
    </Navigator>
  );
};

const DrawerNavigator = (): React.JSX.Element => {
  const {Navigator, Screen} = createDrawerNavigator<RootDrawerParamList>();
  const {t} = useLanguage();

  return (
    <Navigator
      drawerContent={(props: any) => <DrawerContent {...props} />}
      screenOptions={{
        headerShown: true,
        ...drawerScreenOptions,
        drawerStyle: {
          backgroundColor: AppColors.dark,
          width: 320, // Increased width to accommodate longer text
        },
        drawerActiveTintColor: AppColors.primary,
        drawerInactiveTintColor: AppColors.white,
      }}>
      <Screen
        name="HomeTab"
        component={HomeTab}
        options={{
          headerShown: false,
          drawerLabel: t('Home') || 'Home',
        }}
      />
    </Navigator>
  );
};

// Root Stack Navigator (includes profile screen)
const RootStack = (): React.JSX.Element => {
  const {Navigator, Screen} = createNativeStackNavigator<RootStackParamList>();

  return (
    <Navigator screenOptions={{headerShown: false}}>
      <Screen name="DrawerNavigator" component={DrawerNavigator} />
      <Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          presentation: 'modal',
          headerShown: false,
        }}
      />
    </Navigator>
  );
};

const LoadingScreen = () => {
  const {t} = useLanguage();

  return (
    <View style={styles.loadingContainer}>
      <Text style={styles.loadingText}>{t('Loading...') || 'Loading...'}</Text>
    </View>
  );
};

// Main App Navigator
const AppNavigator = (): React.JSX.Element => {
  const {isLoggedIn, isLoading} = useAuth();
  const colorScheme = useColorScheme();

  // Memoize theme to prevent recreation
  const currentTheme = React.useMemo(
    () => (colorScheme === 'dark' ? DarkTheme : DefaultTheme),
    [colorScheme],
  );

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer theme={currentTheme}>
      {isLoggedIn ? <RootStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

// Root App Component
export default (): React.JSX.Element => {
  return (
    <AuthProvider>
      <ConfigurationProvider>
        <OccasionProvider>
          <AppNavigator />
        </OccasionProvider>
      </ConfigurationProvider>
    </AuthProvider>
  );
};

const styles = StyleSheet.create({
  backButton: {
    marginRight: 15,
    padding: 5,
  },
  headerTitleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  headerTitleText: {
    fontWeight: 'bold',
    color: AppColors.black,
    fontSize: 18,
    textAlign: 'center',
  },
  drawerButtonContainer: {
    paddingVertical: 8,
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppColors.cream,
  },
  loadingText: {
    fontSize: 18,
    color: AppColors.teal,
    fontWeight: '600',
  },
  profileAvatarContainer: {
    paddingVertical: 8,
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: AppColors.teal,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: AppColors.white,
  },
  profileAvatarText: {
    color: AppColors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    backgroundColor: AppColors.white,
  },
  errorText: {
    fontSize: 16,
    color: AppColors.danger,
    textAlign: 'center',
    marginTop: 50,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: AppColors.white,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.border,
  },
  headerButton: {
    minWidth: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButtonText: {
    fontSize: 16,
    color: AppColors.teal,
    fontWeight: '600',
  },
  profileTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: AppColors.dark,
  },
  scrollContainer: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    backgroundColor: AppColors.white,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  profileAvatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: AppColors.teal,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarText: {
    color: AppColors.white,
    fontSize: 28,
    fontWeight: '600',
  },
  fullName: {
    fontSize: 24,
    fontWeight: '700',
    color: AppColors.dark,
    marginBottom: 4,
  },
  emailText: {
    fontSize: 16,
    color: AppColors.gray,
    marginBottom: 16,
  },
  statusChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: AppColors.white,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  formSection: {
    backgroundColor: AppColors.lightGray,
    flex: 1,
    paddingTop: 24,
  },
  sectionContainer: {
    backgroundColor: AppColors.white,
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: AppColors.dark,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: AppColors.gray,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: AppColors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: AppColors.dark,
    backgroundColor: AppColors.white,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  readOnlyField: {
    backgroundColor: AppColors.lightGray,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  fieldValue: {
    fontSize: 16,
    color: AppColors.dark,
    fontWeight: '500',
  },
  codeText: {
    fontFamily: 'monospace',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 14,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  interestChip: {
    backgroundColor: AppColors.teal,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  interestText: {
    color: AppColors.white,
    fontSize: 14,
    fontWeight: '500',
  },
  noInterests: {
    fontSize: 14,
    color: AppColors.gray,
    fontStyle: 'italic',
  },
  buttonSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  saveButton: {
    backgroundColor: AppColors.teal,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  saveButtonText: {
    color: AppColors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  signOutButton: {
    backgroundColor: AppColors.white,
    borderWidth: 1,
    borderColor: AppColors.danger,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  signOutButtonText: {
    color: AppColors.danger,
    fontSize: 16,
    fontWeight: '600',
  },
  navbarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    resizeMode: 'cover',
  },
});
