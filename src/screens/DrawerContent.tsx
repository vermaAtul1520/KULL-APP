import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView, Image} from 'react-native';
import {DrawerContentScrollView} from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const DrawerContent = (props: any) => {
  const menuItems = [
    {name: 'Occasions', icon: 'calendar-multiple'},
    {name: 'Kartavya', icon: 'briefcase'},
    {name: 'Bhajan', icon: 'music'},
    {name: 'Laws and Decisions', icon: 'gavel'},
    {name: 'City Search', icon: 'city'},
    {name: 'Organization Officer', icon: 'account-tie'},
    {name: 'Education', icon: 'school'},
    {name: 'Employment', icon: 'briefcase-account'},
    {name: 'Social Upliftment', icon: 'human-handsup'},
    {name: 'Dukan', icon: 'store'},
  ];

  return (
    <DrawerContentScrollView
      {...props}
      style={styles.drawerContent}
      contentContainerStyle={styles.drawerContentContainer}>
      
      {/* User Profile Section */}
      <View style={styles.userProfile}>
        <View style={styles.avatar}>
        <Image
          source={{uri: 'https://plixlifefcstage-media.farziengineer.co/hosted/4_19-192d4aef12c7.jpg'}}
          style={styles.profileImage}
        />
        </View>
        <Text style={styles.userName}>Innovgeist</Text>
        <Text style={styles.userEmail}>Innovgeist@gmail.com</Text>
      </View>

      {/* Menu Items */}
      <View style={styles.menuSection}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => props.navigation.navigate(item.name)}>
            <Icon name={item.icon} size={24} color="#7dd3c0" />
            <Text style={styles.menuText}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Donation Section */}
      <View style={styles.donationSection}>
        <TouchableOpacity style={styles.donationButton}>
          <Icon name="currency-inr" size={24} color="#7dd3c0" />
          <Text style={styles.donationText}>Donation</Text>
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
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
});

export default DrawerContent;