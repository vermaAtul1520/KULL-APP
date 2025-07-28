import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { moderateScale } from '@app/constants/scaleUtils';

type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  CommunityChoice: undefined;
  RequestCommunity: undefined;
  JoinCommunity: undefined;
};

type WelcomeScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'Welcome'
>;

const AppColors = {
  primary: '#7dd3c0',
  black: '#000000',
  white: '#ffffff',
  gray: '#666666',
  dark: '#2a2a2a',
  teal: '#1e6b5c',
  cream: '#f5f5dc',
};

const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo Section */}
        <View style={styles.logoContainer}>
           <Image
            source={require('../../assets/images/kull-logo-2-Photoroom.png')}
            style={{
                height: 200,
                width: 300,
                // backgroundColor: 'red', 
                resizeMode: 'contain',
            }}
            />
        </View>

        {/* Welcome Message */}
        <View style={styles.messageContainer}>
          <Text style={styles.welcomeTitle}>Welcome !</Text>
          <Text style={styles.welcomeSubtitle}>
            Samaj Ekta. Your village, now in your hands!{'\n'}
            Stay informed, access services, and connect{'\n'}
            with your community — all in one place!
          </Text>
        </View>

        {/* Phone Image */}
        <View style={styles.phoneContainer}>
          <View style={styles.phoneFrame}>
            <View style={styles.phoneScreen}>
              <Text style={styles.phoneText}>Community List</Text>
              <View style={styles.communityItem}>
                <View style={styles.avatar} />
                <View>
                  <Text style={styles.memberName}>Mr. Rajan Tiwari</Text>
                  <Text style={styles.memberRole}>Software Engineer</Text>
                </View>
              </View>
              <View style={styles.communityItem}>
                <View style={styles.avatar} />
                <View>
                  <Text style={styles.memberName}>Ms. Aashna</Text>
                  <Text style={styles.memberRole}>Web Designer</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Get Started Button */}
        <TouchableOpacity
          style={styles.getStartedButton}
          onPress={() => navigation.navigate('CommunityChoice')}
        >
          <Text style={styles.getStartedText}>Get Started</Text>
        </TouchableOpacity>

        {/* Sign In Link */}
        <View style={styles.signInContainer}>
          <Text style={styles.signInText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.signInLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.cream,
  },
  content: {
    flex: 1,
    paddingHorizontal: moderateScale(30),
    justifyContent: 'space-between',
    paddingTop: moderateScale(20),
    paddingBottom: moderateScale(40),
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: moderateScale(4),
  },
  logoImage: {
    height: moderateScale(200),
    width: moderateScale(300),
    resizeMode: 'contain',
  },
  logoPlaceholder: {
    width: moderateScale(120),
    height: moderateScale(120),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: moderateScale(20),
  },
  tree: {
    position: 'relative',
    width: moderateScale(100),
    height: moderateScale(100),
  },
  trunk: {
    position: 'absolute',
    bottom: 0,
    left: '45%',
    width: moderateScale(10),
    height: moderateScale(30),
    backgroundColor: '#654321',
  },
  leaves: {
    position: 'absolute',
    top: moderateScale(10),
    left: '20%',
    width: moderateScale(60),
    height: moderateScale(40),
  },
  leaf: {
    position: 'absolute',
    width: moderateScale(20),
    height: moderateScale(15),
    borderRadius: moderateScale(10),
  },
  leaf1: {
    backgroundColor: '#ff8c00',
    top: 0,
    left: 0,
  },
  leaf2: {
    backgroundColor: '#dc143c',
    top: moderateScale(5),
    left: moderateScale(20),
  },
  leaf3: {
    backgroundColor: '#228b22',
    top: moderateScale(10),
    right: 0,
  },
  people: {
    position: 'absolute',
    top: moderateScale(30),
    left: '25%',
    width: moderateScale(50),
    height: moderateScale(30),
  },
  person: {
    position: 'absolute',
    width: moderateScale(12),
    height: moderateScale(12),
    borderRadius: moderateScale(6),
  },
  person1: {
    backgroundColor: '#ff8c00',
    top: 0,
    left: 0,
  },
  person2: {
    backgroundColor: '#dc143c',
    top: moderateScale(5),
    left: moderateScale(15),
  },
  person3: {
    backgroundColor: '#228b22',
    top: moderateScale(10),
    right: 0,
  },
  logoText: {
    fontSize: moderateScale(48),
    fontWeight: 'bold',
    color: AppColors.black,
    letterSpacing: moderateScale(3),
  },
  messageContainer: {
    alignItems: 'center',
    marginVertical: moderateScale(2),
    marginTop: moderateScale(-16)
  },
  welcomeTitle: {
    fontSize: moderateScale(28),
    fontWeight: 'bold',
    color: AppColors.teal,
    marginBottom: moderateScale(15),
  },
  welcomeSubtitle: {
    fontSize: moderateScale(12),
    color: AppColors.gray,
    textAlign: 'center',
    lineHeight: moderateScale(20),
  },
  phoneContainer: {
    alignItems: 'center',
    marginVertical: moderateScale(10),
  },
  phoneFrame: {
    width: moderateScale(200),
    height: moderateScale(250),
    backgroundColor: AppColors.black,
    borderRadius: moderateScale(25),
    padding: moderateScale(8),
  },
  phoneScreen: {
    flex: 1,
    backgroundColor: AppColors.white,
    borderRadius: moderateScale(18),
    padding: moderateScale(20),
  },
  phoneText: {
    fontSize: moderateScale(14),
    fontWeight: 'bold',
    color: AppColors.black,
    marginBottom: moderateScale(20),
    textAlign: 'center',
  },
  communityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: moderateScale(15),
    padding: moderateScale(10),
    backgroundColor: '#f0f0f0',
    borderRadius: moderateScale(8),
  },
  avatar: {
    width: moderateScale(30),
    height: moderateScale(30),
    borderRadius: moderateScale(15),
    backgroundColor: AppColors.primary,
    marginRight: moderateScale(10),
  },
  memberName: {
    fontSize: moderateScale(12),
    fontWeight: 'bold',
    color: AppColors.black,
  },
  memberRole: {
    fontSize: moderateScale(10),
    color: AppColors.gray,
  },
  getStartedButton: {
    backgroundColor: '#4169e1',
    paddingVertical: moderateScale(15),
    borderRadius: moderateScale(25),
    marginHorizontal: moderateScale(20),
  },
  getStartedText: {
    color: AppColors.white,
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: moderateScale(10),
  },
  signInText: {
    fontSize: moderateScale(16),
    color: AppColors.gray,
  },
  signInLink: {
    fontSize: moderateScale(16),
    color: '#4169e1',
    fontWeight: 'bold',
  },
});


export default WelcomeScreen;