import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert} from 'react-native';
import {DrawerContentScrollView, DrawerContentComponentProps} from '@react-navigation/drawer';
import Svg, { Path, Circle, Rect, Polygon } from 'react-native-svg';
import { useAuth } from '@app/navigators';

// SVG Icon Components
const CalendarIcon = ({ size = 24, color = "#7dd3c0" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="4" width="18" height="18" rx="2" ry="2" 
          stroke={color} 
          strokeWidth="2" 
          fill="none"/>
    <Path d="M16 2v4M8 2v4M3 10h18" 
          stroke={color} 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"/>
    <Circle cx="8" cy="14" r="1" fill={color}/>
    <Circle cx="12" cy="14" r="1" fill={color}/>
    <Circle cx="16" cy="14" r="1" fill={color}/>
  </Svg>
);

const BriefcaseIcon = ({ size = 24, color = "#7dd3c0" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="2" y="7" width="20" height="14" rx="2" ry="2" 
          stroke={color} 
          strokeWidth="2" 
          fill="none"/>
    <Path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" 
          stroke={color} 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"/>
  </Svg>
);

const MusicIcon = ({ size = 24, color = "#7dd3c0" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M9 18V5l12-2v13" 
          stroke={color} 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          fill="none"/>
    <Circle cx="6" cy="18" r="3" 
            stroke={color} 
            strokeWidth="2" 
            fill="none"/>
    <Circle cx="18" cy="16" r="3" 
            stroke={color} 
            strokeWidth="2" 
            fill="none"/>
  </Svg>
);

const GavelIcon = ({ size = 24, color = "#7dd3c0" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M6 15l-2 2-2-2 2-2 2 2zM18 9l2-2 2 2-2 2-2-2z" 
          stroke={color} 
          strokeWidth="2" 
          fill="none"/>
    <Path d="M9 12l6-6M15 18l-6-6" 
          stroke={color} 
          strokeWidth="2" 
          strokeLinecap="round"/>
    <Path d="M2 22l4-4M18 6l4-4" 
          stroke={color} 
          strokeWidth="2" 
          strokeLinecap="round"/>
  </Svg>
);

const CityIcon = ({ size = 24, color = "#7dd3c0" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="2" y="6" width="6" height="16" 
          stroke={color} 
          strokeWidth="2" 
          fill="none"/>
    <Rect x="10" y="2" width="6" height="20" 
          stroke={color} 
          strokeWidth="2" 
          fill="none"/>
    <Rect x="18" y="8" width="4" height="14" 
          stroke={color} 
          strokeWidth="2" 
          fill="none"/>
    <Rect x="4" y="10" width="2" height="2" fill={color}/>
    <Rect x="4" y="14" width="2" height="2" fill={color}/>
    <Rect x="12" y="6" width="2" height="2" fill={color}/>
    <Rect x="12" y="10" width="2" height="2" fill={color}/>
    <Rect x="12" y="14" width="2" height="2" fill={color}/>
    <Rect x="19" y="12" width="2" height="2" fill={color}/>
  </Svg>
);

const AccountTieIcon = ({ size = 24, color = "#7dd3c0" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="6" r="4" 
            stroke={color} 
            strokeWidth="2" 
            fill="none"/>
    <Path d="M12 14c-6 0-8 3-8 6h16c0-3-2-6-8-6z" 
          stroke={color} 
          strokeWidth="2" 
          fill="none"/>
    <Path d="M12 14v6M10 16l2-2 2 2" 
          stroke={color} 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"/>
  </Svg>
);

const SchoolIcon = ({ size = 24, color = "#7dd3c0" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M22 9L12 5 2 9l10 4 10-4z" 
          stroke={color} 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          fill="none"/>
    <Path d="M6 10v7c0 1.5 2.5 3 6 3s6-1.5 6-3v-7" 
          stroke={color} 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          fill="none"/>
  </Svg>
);

const AccountSearchIcon = ({ size = 24, color = "#7dd3c0" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="10" cy="8" r="4" 
            stroke={color} 
            strokeWidth="2" 
            fill="none"/>
    <Path d="M2 21c0-5 4-9 8-9s8 4 8 9" 
          stroke={color} 
          strokeWidth="2" 
          fill="none"/>
    <Circle cx="18" cy="18" r="3" 
            stroke={color} 
            strokeWidth="2" 
            fill="none"/>
    <Path d="m21 21-1.5-1.5" 
          stroke={color} 
          strokeWidth="2" 
          strokeLinecap="round"/>
  </Svg>
);

const HandsUpIcon = ({ size = 24, color = "#7dd3c0" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="6" r="3" 
            stroke={color} 
            strokeWidth="2" 
            fill="none"/>
    <Path d="M12 13v8M8 17l4-4 4 4" 
          stroke={color} 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"/>
    <Path d="M6 17c-1-1-1-3 0-4s3-1 4 0M18 17c1-1 1-3 0-4s-3-1-4 0" 
          stroke={color} 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"/>
  </Svg>
);

const StoreIcon = ({ size = 24, color = "#7dd3c0" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 7v1a3 3 0 0 0 6 0V7M3 7l2-5h14l2 5M3 7h18" 
          stroke={color} 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          fill="none"/>
    <Path d="M13 7v1a3 3 0 0 0 6 0V7" 
          stroke={color} 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"/>
    <Path d="M5 7v13a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V7" 
          stroke={color} 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"/>
    <Rect x="9" y="12" width="6" height="5" 
          stroke={color} 
          strokeWidth="2" 
          fill="none"/>
  </Svg>
);

const CurrencyIcon = ({ size = 24, color = "#7dd3c0" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M6 3v18M18 3v18M8 21h8M8 3h8M12 3v18" 
          stroke={color} 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"/>
    <Path d="M17 9a5 5 0 0 0-5-2c-2 0-3 1-3 3s1 3 3 3 3 1 3 3-1 3-3 3a5 5 0 0 0-5-2" 
          stroke={color} 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"/>
  </Svg>
);

const LogoutIcon = ({ size = 24, color = "#7dd3c0" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" 
          stroke={color} 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"/>
    <Path d="M16 17l5-5-5-5M21 12H9" 
          stroke={color} 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"/>
  </Svg>
);

const DrawerContent = (props: DrawerContentComponentProps) => {
  const { user, logout } = useAuth();
  
  const menuItems = [
    {name: 'Occasions', icon: 'calendar'},
    {name: 'Kartavya', icon: 'briefcase'},
    {name: 'Bhajan', icon: 'music'},
    {name: 'Laws and Decisions', icon: 'gavel'},
    {name: 'City Search', icon: 'city'},
    {name: 'Organization Officer', icon: 'account-tie'},
    {name: 'Education', icon: 'school'},
    {name: 'Employment', icon: 'account-search'},
    {name: 'Social Upliftment', icon: 'hands-up'},
    {name: 'Dukan', icon: 'store'},
  ];

  const handleMenuPress = (screenName: string) => {
    props.navigation.navigate(screenName);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            logout();
            // Close the drawer after logout
            props.navigation.closeDrawer();
          },
        },
      ]
    );
  };

  const getInitials = () => {
    if (user) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
    }
    return 'U';
  };

  const renderIcon = (iconName: string) => {
    const iconProps = { size: 24, color: "#7dd3c0" };
    
    switch (iconName) {
      case 'calendar':
        return <CalendarIcon {...iconProps} />;
      case 'briefcase':
        return <BriefcaseIcon {...iconProps} />;
      case 'music':
        return <MusicIcon {...iconProps} />;
      case 'gavel':
        return <GavelIcon {...iconProps} />;
      case 'city':
        return <CityIcon {...iconProps} />;
      case 'account-tie':
        return <AccountTieIcon {...iconProps} />;
      case 'school':
        return <SchoolIcon {...iconProps} />;
      case 'account-search':
        return <AccountSearchIcon {...iconProps} />;
      case 'hands-up':
        return <HandsUpIcon {...iconProps} />;
      case 'store':
        return <StoreIcon {...iconProps} />;
      default:
        return <BriefcaseIcon {...iconProps} />;
    }
  };

  return (
    <DrawerContentScrollView
      {...props}
      style={styles.drawerContent}
      contentContainerStyle={styles.drawerContentContainer}>
             
      {/* User Profile Section */}
      <View style={styles.userProfile}>
        <View style={styles.avatar}>
          {user ? (
            <View style={styles.profileInitials}>
              <Text style={styles.initialsText}>{getInitials()}</Text>
            </View>
          ) : (
            <Image
              source={{uri: 'https://plixlifefcstage-media.farziengineer.co/hosted/4_19-192d4aef12c7.jpg'}}
              style={styles.profileImage}
            />
          )}
        </View>
        <Text style={styles.userName}>
          {user ? `${user.firstName} ${user.lastName}` : 'Innovgeist'}
        </Text>
        <Text style={styles.userEmail}>
          {user ? user.email : 'Innovgeist@gmail.com'}
        </Text>
      </View>

      {/* Menu Items */}
      <View style={styles.menuSection}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => handleMenuPress(item.name)}>
            {renderIcon(item.icon)}
            <Text style={styles.menuText}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Donation Section */}
      <View style={styles.donationSection}>
        <TouchableOpacity 
          style={styles.donationButton}
          onPress={() => props.navigation.navigate('HomeTab', { screen: 'Donation' })}>
          <CurrencyIcon size={24} color="#7dd3c0" />
          <Text style={styles.donationText}>Donation</Text>
        </TouchableOpacity>
      </View>

      {/* Logout Section */}
      <View style={styles.logoutSection}>
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}>
          <LogoutIcon size={24} color="#ef4444" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    backgroundColor: '#2a2a2a',
  },
  drawerContentContainer: {
    paddingTop: 20,
  },
  userProfile: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#444',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    overflow: 'hidden',
  },
  profileInitials: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#7dd3c0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  initialsText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  userName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  userEmail: {
    color: '#aaa',
    fontSize: 14,
  },
  menuSection: {
    paddingTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  menuText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 15,
  },
  donationSection: {
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#444',
    marginTop: 20,
  },
  donationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  donationText: {
    color: '#7dd3c0',
    fontSize: 16,
    marginLeft: 15,
    fontWeight: 'bold',
  },
  logoutSection: {
    // paddingTop: 15,
    // borderTopWidth: 1,
    borderTopColor: '#444',
    marginTop: 15,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  logoutText: {
    color: '#ef4444',
    fontSize: 16,
    marginLeft: 15,
    fontWeight: 'bold',
  },
});

export default DrawerContent;