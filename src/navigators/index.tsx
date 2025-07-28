// import React, { useState, useEffect } from 'react';
// import {Pressable, useColorScheme, View} from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
// import {
//   createDrawerNavigator,
//   DrawerNavigationProp,
// } from '@react-navigation/drawer';
// import {
//   createNativeStackNavigator,
//   NativeStackNavigationOptions,
// } from '@react-navigation/native-stack';
// import {
//   DarkTheme,
//   DefaultTheme,
//   NavigationContainer,
//   useNavigation,
// } from '@react-navigation/native';
// import HomeScreen from '@app/screens/Home/HomeScreen';
// import PostScreen from '@app/screens/PostScreen';
// import NewsScreen from '@app/screens/NewsScreen';
// import MyPeopleScreen from '@app/screens/MyPeopleScreen';
// import DonationScreen from '@app/screens/DonationScreen';
// import DrawerContent from '@app/screens/DrawerContent';
// import Logo from '@app/assets/images/hamburger.svg';
// import { Text } from 'react-native';
// import { StyleSheet } from 'react-native';
// import { Image } from 'react-native';
// import WelcomeScreen from '@app/screens/Login/WelcomeScreen';
// import LoginScreen from '@app/screens/Login/LoginScreen';
// import CommunityChoiceScreen from '@app/screens/Login/CommunityChoiceScreen';
// import RequestCommunityScreen from '@app/screens/Login/RequestCommunityScreen';
// import JoinCommunityScreen from '@app/screens/Login/JoinCommunityScreen';

// // Import new screens (you'll need to create these)
// // import WelcomeScreen from '@app/screens/Auth/WelcomeScreen';
// // import LoginScreen from '@app/screens/Auth/LoginScreen';
// // import CommunityChoiceScreen from '@app/screens/Auth/CommunityChoiceScreen';
// // import RequestCommunityScreen from '@app/screens/Auth/RequestCommunityScreen';
// // import JoinCommunityScreen from '@app/screens/Auth/JoinCommunityScreen';

// // Custom Colors
// const AppColors = {
//   primary: '#7dd3c0',
//   black: '#000000',
//   white: '#ffffff',
//   gray: 'gray',
//   dark: '#2a2a2a',
//   teal: '#1e6b5c',
// };

// // Types
// type AuthStackParamList = {
//   Welcome: undefined;
//   Login: undefined;
//   CommunityChoice: undefined;
//   RequestCommunity: undefined;
//   JoinCommunity: undefined;
// };

// type RootDrawerParamList = {
//   Home: undefined;
//   Post: undefined;
//   News: undefined;
//   MyPeople: undefined;
//   Donation: undefined;
// };

// type HomeTabParamList = {
//   Home: undefined;
//   Post: undefined;
//   News: undefined;
//   MyPeople: undefined;
//   Donation: undefined;
// };

// // Auth Context (simplified - you can replace with your preferred state management)
// const AuthContext = React.createContext({
//   isLoggedIn: false,
//   login: () => {},
//   logout: () => {},
// });

// // Auth Provider
// const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   const login = () => setIsLoggedIn(true);
//   const logout = () => setIsLoggedIn(false);

//   return (
//     <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // Hook to use auth context
// const useAuth = () => React.useContext(AuthContext);

// // Shared components
// const DrawerButton = (): React.JSX.Element => {
//   const {toggleDrawer} = useNavigation<DrawerNavigationProp<RootDrawerParamList>>();
//   return (
//     <Pressable onPress={toggleDrawer}>
//       <Logo color={AppColors.primary} />
//     </Pressable>
//   );
// };

// const CustomHeaderTitle = () => (
//   <View style={styles.headerTitleContainer}>
//     <Text style={styles.headerTitleText}>KULL-APP</Text>
//   </View>
// );

// const drawerScreenOptions = (): Partial<NativeStackNavigationOptions> => ({
//   headerLeft: () => <DrawerButton />,
//   headerTitle: () => <CustomHeaderTitle />,
//   headerStyle: {
//     backgroundColor: AppColors.primary,
//   },
//   headerTitleStyle: {
//     color: AppColors.black,
//     fontWeight: 'bold',
//   },
// });

// const RenderTabBarIcon = ({
//   focused,
//   color,
//   size,
//   route,
// }: {
//   focused: boolean;
//   color: string;
//   size: number;
//   route: any;
// }): React.JSX.Element => {
//   const iconMap: Record<string, string> = {
//     Home: 'home',
//     Post: 'post',
//     News: 'newspaper',
//     MyPeople: 'account-group',
//     Donation: 'hand-coin',
//   };

//   const iconName = iconMap[route.name] || 'circle';

//   return <Icon name={iconName} size={size} color={color} />;
// };

// // Auth Stack Navigator
// const AuthStack = (): React.JSX.Element => {
//   const { Navigator, Screen } = createNativeStackNavigator<AuthStackParamList>();
  
//   return (
//     <Navigator 
//       screenOptions={{
//         headerShown: false,
//       }}
//       initialRouteName="Welcome"
//     >
//       <Screen name="Welcome" component={WelcomeScreen} />
//       <Screen name="Login" component={LoginScreen} />
//       <Screen name="CommunityChoice" component={CommunityChoiceScreen} />
//       <Screen name="RequestCommunity" component={RequestCommunityScreen} />
//       <Screen name="JoinCommunity" component={JoinCommunityScreen} />
//     </Navigator>
//   );
// };

// // Home Tab Navigator
// const HomeTab = (): React.JSX.Element => {
//   const {Navigator, Screen} = createBottomTabNavigator<HomeTabParamList>();
//   return (
//     <Navigator
//       screenOptions={({route}) => ({
//         tabBarActiveTintColor: AppColors.primary,
//         tabBarInactiveTintColor: AppColors.gray,
//         headerShown: false,
//         tabBarHideOnKeyboard: true,
//         tabBarStyle: {
//           backgroundColor: AppColors.black,
//           borderTopWidth: 0,
//           paddingTop: 5,
//         },
//         tabBarLabelStyle: {
//           fontSize: 12,
//         },
//         tabBarIcon: ({focused, color, size}) => 
//           RenderTabBarIcon({focused, color, size, route}),
//       })}>
//       <Screen name="Home" component={HomeScreen} />
//       <Screen name="Post" component={PostScreen} />
//       <Screen name="News" component={NewsScreen} />
//       <Screen name="MyPeople" component={MyPeopleScreen} />
//       <Screen name="Donation" component={DonationScreen} />
//     </Navigator>
//   );
// };

// const HomeStack = (): React.JSX.Element => {
//   const {Navigator, Screen} = createNativeStackNavigator();
//   return (
//     <Navigator screenOptions={drawerScreenOptions}>
//       <Screen name="HomeTab" component={HomeTab} />
//     </Navigator>
//   );
// };

// const DrawerNavigator = (): React.JSX.Element => {
//   const {Navigator, Screen} = createDrawerNavigator<RootDrawerParamList>();
//   return (
//     <Navigator
//       drawerContent={(props) => <DrawerContent {...props} />}
//       screenOptions={{
//         headerShown: false,
//         drawerStyle: {
//           backgroundColor: AppColors.dark,
//           width: 300,
//         },
//         drawerActiveTintColor: AppColors.primary,
//         drawerInactiveTintColor: AppColors.white,
//       }}>
//       <Screen name="HomeTab" component={HomeStack} />
//     </Navigator>
//   );
// };

// // Main App Entry
// const AppNavigator = (): React.JSX.Element => {
//   const { isLoggedIn } = useAuth();
//   const currentTheme = useColorScheme() === 'dark' ? DarkTheme : DefaultTheme;
  
//   return (
//     <NavigationContainer theme={currentTheme}>
//       {isLoggedIn ? <DrawerNavigator /> : <AuthStack />}
//     </NavigationContainer>
//   );
// };

// // Root App Component
// export default (): React.JSX.Element => {
//   return (
//     <AuthProvider>
//       <AppNavigator />
//     </AuthProvider>
//   );
// };

// const styles = StyleSheet.create({
//   headerTitleContainer: {
//     flex: 1,
//     alignItems: 'center',
//   },
//   headerTitleText: {
//     fontWeight: 'bold',
//     color: AppColors.black,
//     fontSize: 18,
//   },
// });


import React, { useState, useEffect, createContext, useContext } from 'react';
import {Image, Pressable, useColorScheme, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  createDrawerNavigator,
  DrawerNavigationProp,
} from '@react-navigation/drawer';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
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
import { Text } from 'react-native';
import { StyleSheet } from 'react-native';

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

// Custom Colors
const AppColors = {
  primary: '#7dd3c0',
  black: '#000000',
  white: '#ffffff',
  gray: 'gray',
  dark: '#2a2a2a',
  teal: '#1e6b5c',
};

// Types
type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  CommunityChoice: undefined;
  RequestCommunity: undefined;
  JoinCommunity: undefined;
};

type RootDrawerParamList = {
  Home: undefined;
  Post: undefined;
  News: undefined;
  MyPeople: undefined;
  Donation: undefined;
};

type HomeTabParamList = {
  Home: undefined;
  Post: undefined;
  News: undefined;
  MyPeople: undefined;
  Donation: undefined;
};

// Auth Context
interface AuthContextType {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
});

// Auth Provider
const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = () => {
    console.log('User logged in successfully');
    setIsLoggedIn(true);
  };

  const logout = () => {
    console.log('User logged out');
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = () => useContext(AuthContext);

// Shared components
const DrawerButton = (): React.JSX.Element => {
  const {toggleDrawer} = useNavigation<DrawerNavigationProp<RootDrawerParamList>>();
  return (
    <Pressable onPress={toggleDrawer}>
      <Logo color={AppColors.primary} />
    </Pressable>
  );
};

const CustomHeaderTitle = () => (
  <View style={styles.headerTitleContainer}>
    <Text style={styles.headerTitleText}>KULL-APP</Text>
    {/* <Image
      source={require('../assets/images/kull-logo-2-Photoroom.png')}
      style={{
          height: 60,
          width: 60,
          // backgroundColor: 'red', 
          resizeMode: 'contain',
      }}
    /> */}
  </View>
);

const drawerScreenOptions = (): Partial<NativeStackNavigationOptions> => ({
  headerLeft: () => <DrawerButton />,
  headerTitle: () => <CustomHeaderTitle />,
  headerStyle: {
    backgroundColor: AppColors.primary,
  },
  headerTitleStyle: {
    color: AppColors.black,
    fontWeight: 'bold',
  },
});

// 
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
    // case 'Post':
    //   return <PostIcon width={iconSize} height={iconSize} color={color} />;
    case 'News':
      return <NewsIcon width={iconSize} height={iconSize} color={color} />;
    case 'MyPeople':
      return <PeopleIcon width={iconSize} height={iconSize} color={color} />;
    case 'Donation':
      return <DonationIcon width={iconSize} height={iconSize} color={color} />;
    default:
      // Fallback to MaterialCommunityIcons if no SVG found
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
          // paddingTop: 5,
          // paddingBottom: 5
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
        tabBarIcon: ({focused, color, size}) => 
          RenderTabBarIcon({focused, color, size, route}),
      })}>
      <Screen name="Home" component={HomeScreen} />
      {/* <Screen name="Post" component={PostScreen} /> */}
      <Screen name="News" component={NewsScreen} />
      <Screen name="MyPeople" component={MyPeopleScreen} />
      <Screen name="Donation" component={DonationScreen} />
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
  return (
    <Navigator
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: AppColors.dark,
          width: 300,
        },
        drawerActiveTintColor: AppColors.primary,
        drawerInactiveTintColor: AppColors.white,
      }}>
      <Screen name="HomeTab" component={HomeStack} />
    </Navigator>
  );
};

// Main App Navigator
const AppNavigator = (): React.JSX.Element => {
  const { isLoggedIn } = useAuth();
  const currentTheme = useColorScheme() === 'dark' ? DarkTheme : DefaultTheme;
  
  return (
    <NavigationContainer theme={currentTheme}>
      {isLoggedIn ? <DrawerNavigator /> : <AuthStack />}
    </NavigationContainer>
  );
};

// Root App Component
export default (): React.JSX.Element => {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
};

const styles = StyleSheet.create({
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitleText: {
    fontWeight: 'bold',
    color: AppColors.black,
    fontSize: 18,
  },
});