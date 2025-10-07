import React, { useState, useEffect, createContext, useContext } from 'react';
import {Image, Pressable, useColorScheme, View, TextInput, ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  createDrawerNavigator,
  DrawerNavigationProp,
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
} from '@react-navigation/native';
import HomeScreen from '@app/screens/Home/HomeScreen';
import PostScreen from '@app/screens/PostScreen';
import NewsScreen from '@app/screens/NewsScreen';
import MyPeopleScreen from '@app/screens/MyPeopleScreen';
import DonationScreen from '@app/screens/DonationScreen';
import DrawerContent from '@app/screens/DrawerContent';
import Logo from '@app/assets/images/hamburger.svg';
import { Text, Alert } from 'react-native';
import { StyleSheet } from 'react-native';
import { useLanguage } from '@app/hooks/LanguageContext';

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
import { OccasionTypesScreen, CategoriesScreen, FiltersScreen, GenderSelectionScreen, ContentScreen } from '@app/screens/Occasions';
import { OccasionProvider } from '@app/contexts/OccasionContext';
import KartavyaScreen from '@app/screens/drawer/KartavyaScreen';
import BhajanScreen from '@app/screens/drawer/BhajanScreen';
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
import { getAuthHeaders, getCommunityId } from '@app/constants/apiUtils';
import { BASE_URL } from '@app/constants/constant';
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
  community?: string;
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
  HomeTab: undefined;
  Occasions: undefined;
  OccasionCategories: { occasionType: string };
  OccasionFilters: { occasionType: string; categoryId: string | null; categoryName: string | null };
  OccasionGender: { occasionType: string; categoryId: string | null; categoryName: string | null; gotra?: string; subGotra?: string };
  OccasionContent: { occasionType: string; categoryId: string | null; categoryName: string | null; gotra?: string; subGotra?: string; gender?: string };
  Kartavya: undefined;
  Bhajan: undefined;
  Games: undefined;
  'Laws and Decisions': undefined;
  'CitySearch': undefined;
  'OrganizationOfficer': undefined;
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

type HomeTabParamList = {
  Home: undefined;
  Post: undefined;
  News: undefined;
  MyPeople: undefined;
  Donation: undefined;
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
  bannerData: {id: number, image: string, textColor: string}[];
  setBannerData: (banners: {id: number, image: string, textColor: string}[]) => void;
  bannerLoading: boolean;
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
});

// Auth Provider
const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [bannerData, setBannerDataState] = useState<{id: number, image: string, textColor: string}[]>([]);
  const [bannerLoading, setBannerLoading] = useState(true);

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

  useEffect(() => {
    checkAuthState();
  }, []);

  const fetchBannerData = async () => {
    try {
      setBannerLoading(true);
      const COMMUNITY_ID = await getCommunityId();
      const headers = await getAuthHeaders();
      
      const response = await fetch(`${BASE_URL}/api/communities/${COMMUNITY_ID}/configuration`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        setBannerDataState(defaultBannerData);
        return;
      }

      const responseText = await response.text();
      const data = JSON.parse(responseText);

      if (data.success && data.data && data.data.banner && Array.isArray(data.data.banner)) {
        const banners = data.data.banner.map((imageUrl, index) => ({
          id: index + 1,
          image: imageUrl,
          textColor: index % 2 === 0 ? '#000' : '#FFF'
        }));
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
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchBannerData();
    }
  }, [isLoggedIn]);

  const setBannerData = (banners: {id: number, image: string, textColor: string}[]) => {
    setBannerDataState(banners);
  };

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

  const login = (userData: User, userToken: string) => {
    setUser(userData);
    setToken(userToken);
    setIsLoggedIn(true);
  };

  const updateUser = async (updatedData: Partial<User>) => {
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
      const updatedUser = { ...user, ...apiResponse.user };
      setUser(updatedUser);
      await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
    } else {
      throw new Error(apiResponse.message || 'Failed to update profile');
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
      setUser(null);
      setToken(null);
      setIsLoggedIn(false);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
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
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// Profile Avatar Component
const ProfileAvatar = (): React.JSX.Element => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user } = useAuth();
  
  const getInitials = () => {
    if (user) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
    }
    return 'U';
  };

  return (
    <Pressable 
      onPress={() => navigation.navigate('Profile')}
      style={styles.profileAvatarContainer}
    >
      <View style={styles.profileAvatar}>
        <Image source={{ uri: user.profileImage }} style={styles.navbarImage} />
      </View>
    </Pressable>
  );
};

const DrawerButton = (): React.JSX.Element => {
  const {toggleDrawer} = useNavigation<DrawerNavigationProp<RootDrawerParamList>>();
  return (
    <Pressable onPress={toggleDrawer} style={styles.drawerButtonContainer}>
      <Logo width={20} height={20} color={AppColors.black} />
    </Pressable>
  );
};

const CustomHeaderTitle = () => {
  const navigation = useNavigation<DrawerNavigationProp<RootDrawerParamList>>();
  const { user } = useAuth();
  const { t } = useLanguage();
  
  const currentRouteName = navigation.getState()?.routes[navigation.getState()?.index || 0]?.name;
  
  const navigateToHome = () => {
    navigation.navigate('HomeTab');
  };

  const getCommunityName = () => {
    if (user?.community?.name) {
      return user.community.name.toUpperCase();
    }
    return 'KULL-APP'; 
  };

  const getDisplayTitle = () => {
    if (currentRouteName === 'HomeTab') {
      return getCommunityName();
    }
    
    const screenTitles = {
      'Occasions': t('Occasions') || 'OCCASIONS',
      'Kartavya': t('Kartavya') || 'KARTAVYA',
      'Bhajan': t('Bhajan') || 'BHAJAN',
      'Games': t('Games') || 'GAMES',
      'Laws and Decisions': t('Laws and Decisions') || 'LAWS & DECISIONS',
      'CitySearch': t('CitySearch') || 'CITY SEARCH',
      'OrganizationOfficer': t('OrganizationOfficer') || 'ORGANIZATION OFFICER',
      'Education': t('Education') || 'EDUCATION',
      'Employment': t('Employment') || 'EMPLOYMENT',
      'Sports': t('Sports') || 'SPORTS',
      'Social Upliftment': t('Social Upliftment') || 'SOCIAL UPLIFTMENT',
      'Dukan': t('Dukan') || 'DUKAN',
      'Meetings': t('Meetings') || 'MEETINGS',
      'Appeal': t('Appeal') || 'APPEAL',
      'Vote': t('Vote') || 'VOTE',
      'Settings': t('Settings') || 'SETTINGS',
      'FamilyTree': t('Family Tree') || 'FAMILY TREE',
      'AddFamilyMember': t('Add Family Member') || 'ADD FAMILY MEMBER',
    };

    return screenTitles[currentRouteName] || getCommunityName();
  };

  return (
    <Pressable onPress={navigateToHome} style={styles.headerTitleContainer}>
      <Text style={styles.headerTitleText}>{getDisplayTitle()}</Text>
    </Pressable>
  );
};

const drawerScreenOptions = (): Partial<NativeStackNavigationOptions> => ({
  headerLeft: () => <DrawerButton />,
  headerTitle: () => <CustomHeaderTitle />,
  headerRight: () => <ProfileAvatar />,
  headerStyle: {
    backgroundColor: AppColors.primary,
  },
  headerTitleStyle: {
    color: AppColors.black,
    fontWeight: 'bold',
  },
  headerShadowVisible: false,
  headerTitleAlign: 'center',
  headerLeftContainerStyle: {
    paddingLeft: 10,
  },
  headerRightContainerStyle: {
    paddingRight: 10,
  },
});

// Profile Screen Component
const ProfileScreen = (): React.JSX.Element => {
  const navigation = useNavigation();
  const { user, logout, updateUser } = useAuth();
  console.log("Profile Screen - User data:", user);
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<Partial<User>>({});

  useEffect(() => {
    if (user) {
      setEditedUser({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        interests: user.interests,
        profileImage: user.profileImage,
      });
    }
  }, [user]);

  const handleSave = async () => {
    try {
      await updateUser(editedUser);
      setIsEditing(false);
      Alert.alert(t('Success') || 'Success', t('Profile updated successfully!') || 'Profile updated successfully!');
    } catch (error) {
      Alert.alert(t('Error') || 'Error', error.message || 'Failed to update profile');
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      t('Sign Out') || 'Sign Out',
      t('Are you sure you want to sign out?') || 'Are you sure you want to sign out?',
      [
        {
          text: t('Cancel') || 'Cancel',
          style: 'cancel',
        },
        {
          text: t('Sign Out') || 'Sign Out',
          style: 'destructive',
          onPress: logout,
        },
      ]
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
        <Text style={styles.errorText}>{t('No user data available') || 'No user data available'}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <Pressable 
          onPress={() => navigation.goBack()}
          style={styles.headerButton}
        >
          <Text style={styles.headerButtonText}>←</Text>
        </Pressable>
        
        <Text style={styles.profileTitle}>{t('Profile') || 'Profile'}</Text>
        
        <Pressable 
          onPress={() => setIsEditing(!isEditing)}
          style={styles.headerButton}
        >
          <Text style={styles.headerButtonText}>
            {isEditing ? (t('Cancel') || 'Cancel') : (t('Edit') || 'Edit')}
          </Text>
        </Pressable>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            {isEditing ? (
              <ImagePickerComponent
                onImageSelected={(imageUrl) => setEditedUser({...editedUser, profileImage: imageUrl})}
                currentImage={editedUser.profileImage || user.profileImage}
                size={80}
              />
            ) : user.profileImage ? (
              <Image source={{ uri: user.profileImage }} style={styles.profileAvatarLarge} />
            ) : (
              <View style={styles.profileAvatarLarge}>
                <Text style={styles.avatarText}>
                  {`${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()}
                </Text>
              </View>
            )}
          </View>
          
          <Text style={styles.fullName}>
            {`${user.firstName} ${user.lastName}`}
          </Text>
          <Text style={styles.emailText}>{user.email}</Text>
          
          <View style={[styles.statusChip, { backgroundColor: getStatusColor(user.communityStatus) }]}>
            <Text style={styles.statusText}>{user.communityStatus.toUpperCase()}</Text>
          </View>
        </View>

        <View style={styles.formSection}>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>{t('Personal Information') || 'Personal Information'}</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('First Name') || 'First Name'}</Text>
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
            <Text style={styles.sectionTitle}>{t('Community Details') || 'Community Details'}</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('Role') || 'Role'}</Text>
              <View style={styles.readOnlyField}>
                <Text style={styles.fieldValue}>{user.roleInCommunity}</Text>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('Member Since') || 'Member Since'}</Text>
              <View style={styles.readOnlyField}>
                <Text style={styles.fieldValue}>{formatDate(user.createdAt)}</Text>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('User ID') || 'User ID'}</Text>
              <View style={styles.readOnlyField}>
                <Text style={[styles.fieldValue, styles.codeText]}>{user.code}</Text>
              </View>
            </View>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>{t('Interests') || 'Interests'}</Text>
            
            {isEditing ? (
              <TextInput
                style={[styles.input, styles.textArea]}
                value={editedUser.interests?.join(', ') || ''}
                onChangeText={(text) => setEditedUser({...editedUser, interests: text.split(',').map(item => item.trim())})}
                placeholder={t('Enter interests separated by commas') || 'Enter interests separated by commas'}
                multiline
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
                  <Text style={styles.noInterests}>{t('No interests added') || 'No interests added'}</Text>
                )}
              </View>
            )}
          </View>

          <View style={styles.buttonSection}>
            {isEditing && (
              <Pressable style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>{t('Save Changes') || 'Save Changes'}</Text>
              </Pressable>
            )}
            
            <Pressable style={styles.signOutButton} onPress={handleSignOut}>
              <Text style={styles.signOutButtonText}>{t('Sign Out') || 'Sign Out'}</Text>
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
  route: any;
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
  const { Navigator, Screen } = createNativeStackNavigator<AuthStackParamList>();
  
  return (
    <Navigator 
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Welcome"
    >
      <Screen name="Welcome" component={WelcomeScreen} />
      <Screen name="Login" component={LoginScreen} />
      <Screen name="CommunityChoice" component={CommunityChoiceScreen} />
      <Screen name="RequestCommunity" component={RequestCommunityScreen} />
      <Screen name="JoinCommunity" component={JoinCommunityScreen} />
    </Navigator>
  );
};

// Home Tab Navigator
const HomeTab = (): React.JSX.Element => {
  const {Navigator, Screen} = createBottomTabNavigator<HomeTabParamList>();
  const { t } = useLanguage();
  
  return (
    <Navigator
      screenOptions={({route}) => ({
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
        tabBarIcon: ({focused, color, size}) => 
          RenderTabBarIcon({focused, color, size, route}),
      })}>
      <Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          tabBarLabel: t('Home') || 'Home',
        }}
      />
      <Screen 
        name="Post" 
        component={PostScreen}
        options={{
          tabBarLabel: t('Post') || 'Post',
        }}
      />
      <Screen 
        name="News" 
        component={NewsScreen}
        options={{
          tabBarLabel: t('News') || 'News',
        }}
      />
      <Screen 
        name="MyPeople" 
        component={MyPeopleScreen}
        options={{
          tabBarLabel: t('My People') || 'My People',
        }}
      />
      <Screen 
        name="Donation" 
        component={DonationScreen}
        options={{
          tabBarLabel: t('Donation') || 'Donation',
        }}
      />
    </Navigator>
  );
};

const HomeStack = (): React.JSX.Element => {
  const {Navigator, Screen} = createNativeStackNavigator();
  return (
    <Navigator screenOptions={drawerScreenOptions}>
      <Screen name="HomeTab" component={HomeTab} />
    </Navigator>
  );
};

const DrawerNavigator = (): React.JSX.Element => {
  const {Navigator, Screen} = createDrawerNavigator<RootDrawerParamList>();
  const { t } = useLanguage();
  
  return (
    <Navigator
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        headerShown: true,
        ...drawerScreenOptions(),
        drawerStyle: {
          backgroundColor: AppColors.dark,
          width: 300,
        },
        drawerActiveTintColor: AppColors.primary,
        drawerInactiveTintColor: AppColors.white,
      }}>
      <Screen 
        name="HomeTab" 
        component={HomeStack} 
        options={{ 
          headerShown: false,
          drawerLabel: t('Home') || 'Home',
        }}
      />
      <Screen
        name="Occasions"
        component={OccasionTypesScreen}
        options={{
          drawerLabel: t('Occasions') || 'Occasions',
        }}
      />
      <Screen
        name="OccasionCategories"
        component={CategoriesScreen}
        options={{
          drawerItemStyle: { display: 'none' },
        }}
      />
      <Screen
        name="OccasionFilters"
        component={FiltersScreen}
        options={{
          drawerItemStyle: { display: 'none' },
        }}
      />
      <Screen
        name="OccasionGender"
        component={GenderSelectionScreen}
        options={{
          drawerItemStyle: { display: 'none' },
        }}
      />
      <Screen
        name="OccasionContent"
        component={ContentScreen}
        options={{
          drawerItemStyle: { display: 'none' },
        }}
      />
      <Screen 
        name="Kartavya" 
        component={KartavyaScreen}
        options={{
          drawerLabel: t('Kartavya') || 'Kartavya',
        }}
      />
      <Screen 
        name="Bhajan" 
        component={BhajanScreen}
        options={{
          drawerLabel: t('Bhajan') || 'Bhajan',
        }}
      />
      <Screen 
        name="Games" 
        component={GamesScreen}
        options={{
          drawerLabel: t('Games') || 'Games',
        }}
      />
      <Screen 
        name="Laws and Decisions" 
        component={LawsScreen}
        options={{
          drawerLabel: t('Laws and Decisions') || 'Laws and Decisions',
        }}
      />
      <Screen 
        name="CitySearch" 
        component={CitySearchScreen}
        options={{
          drawerLabel: t('CitySearch') || 'City Search',
        }}
      />
      <Screen 
        name="OrganizationOfficer" 
        component={OrganizationOfficerScreen}
        options={{
          drawerLabel: t('OrganizationOfficer') || 'Organization Officer',
        }}
      />
      <Screen 
        name="Education" 
        component={EducationScreen}
        options={{
          drawerLabel: t('Education') || 'Education',
        }}
      />
      <Screen 
        name="Employment" 
        component={EmploymentScreen}
        options={{
          drawerLabel: t('Employment') || 'Employment',
        }}
      />
      <Screen 
        name="Sports" 
        component={SportsScreen}
        options={{
          drawerLabel: t('Sports') || 'Sports',
        }}
      />
      <Screen 
        name="Social Upliftment" 
        component={SocialUpliftmentScreen}
        options={{
          drawerLabel: t('Social Upliftment') || 'Social Upliftment',
        }}
      />
      <Screen 
        name="Dukan" 
        component={DukanScreen}
        options={{
          drawerLabel: t('Dukan') || 'Dukan',
        }}
      />
      <Screen 
        name="Meetings" 
        component={MeetingsScreen}
        options={{
          drawerLabel: t('Meetings') || 'Meetings',
        }}
      />
      <Screen 
        name="Appeal" 
        component={AppealScreen}
        options={{
          drawerLabel: t('Appeal') || 'Appeal',
        }}
      />
      <Screen 
        name="Vote" 
        component={VoteScreen}
        options={{
          drawerLabel: t('Vote') || 'Vote',
        }}
      />
      <Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          drawerLabel: t('Settings') || 'Settings',
        }}
      />
      <Screen
        name="FamilyTree"
        component={FamilyTreeScreen}
        options={{
          drawerLabel: t('Family Tree') || 'Family Tree',
        }}
      />
      <Screen
        name="AddFamilyMember"
        component={AddFamilyMemberScreen}
        options={{
          drawerLabel: t('Add Family Member') || 'Add Family Member',
          drawerItemStyle: { display: 'none' },
        }}
      />
    </Navigator>
  );
};

// Root Stack Navigator (includes profile screen)
const RootStack = (): React.JSX.Element => {
  const { Navigator, Screen } = createNativeStackNavigator<RootStackParamList>();
  
  return (
    <Navigator screenOptions={{ headerShown: false }}>
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
  const { t } = useLanguage();
  
  return (
    <View style={styles.loadingContainer}>
      <Text style={styles.loadingText}>{t('Loading...') || 'Loading...'}</Text>
    </View>
  );
};

// Main App Navigator
const AppNavigator = (): React.JSX.Element => {
  const { isLoggedIn, isLoading } = useAuth();
  const currentTheme = useColorScheme() === 'dark' ? DarkTheme : DefaultTheme;

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
      <OccasionProvider>
        <AppNavigator />
      </OccasionProvider>
    </AuthProvider>
  );
};

const styles = StyleSheet.create({
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
    height: 44,
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
  borderRadius: 20, // Half of width/height for perfect circle
  resizeMode: 'cover',
}

});