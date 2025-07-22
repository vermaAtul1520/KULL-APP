import React from 'react';
import {Pressable, useColorScheme} from 'react-native';
import {Colors} from 'react-native-ui-lib';
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

// Types
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

// Shared components
const DrawerButton = (): React.JSX.Element => {
  const {toggleDrawer} = useNavigation<DrawerNavigationProp<RootDrawerParamList>>();
  return (
    <Pressable onPress={toggleDrawer}>
      <Icon name="menu" size={24} color={Colors.$iconPrimary} />
    </Pressable>
  );
};

const drawerScreenOptions = (): Partial<NativeStackNavigationOptions> => ({
  headerLeft: () => <DrawerButton />,
  headerTitle: 'Samajik Ekta',
  headerStyle: {
    backgroundColor: '#7dd3c0',
  },
  headerTitleStyle: {
    color: '#000',
    fontWeight: 'bold',
  },
});

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
  const iconMap: Record<string, string> = {
    Home: 'home',
    Post: 'post',
    News: 'newspaper',
    MyPeople: 'account-group',
    Donation: 'hand-coin',
  };

  const iconName = iconMap[route.name] || 'circle';

  return <Icon name={iconName} size={size} color={color} />;
};

// Home Tab Navigator
const HomeTab = (): React.JSX.Element => {
  const {Navigator, Screen} = createBottomTabNavigator<HomeTabParamList>();
  return (
    <Navigator
      screenOptions={({route}) => ({
        tabBarActiveTintColor: '#7dd3c0',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: '#000',
          borderTopWidth: 0,
          paddingTop: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
        tabBarIcon: ({focused, color, size}) => 
          RenderTabBarIcon({focused, color, size, route}),
      })}>
      <Screen name="Home" component={HomeScreen} />
      <Screen name="Post" component={PostScreen} />
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
          backgroundColor: '#2a2a2a',
          width: 300,
        },
        drawerActiveTintColor: '#7dd3c0',
        drawerInactiveTintColor: '#fff',
      }}>
      <Screen name="HomeTab" component={HomeStack} />
    </Navigator>
  );
};
// Main App Entry
export default (): React.JSX.Element => {
  const currentTheme = useColorScheme() === 'dark' ? DarkTheme : DefaultTheme;
  return (
    <NavigationContainer theme={currentTheme}>
      <DrawerNavigator />
    </NavigationContainer>
  );
};