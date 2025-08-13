import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Image } from 'react-native';
import { moderateScale } from '@app/constants/scaleUtils';

type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  CommunityChoice: undefined;
  RequestCommunity: undefined;
  JoinCommunity: undefined;
};

type CommunityChoiceScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'CommunityChoice'
>;

const AppColors = {
  primary: '#7dd3c0',
  black: '#000000',
  white: '#ffffff',
  gray: '#666666',
  dark: '#2a2a2a',
  teal: '#1e6b5c',
  cream: '#f5f5dc',
  blue: '#4169e1',
  orange: '#ff8c00',
  red: '#dc143c',
  green: '#228b22',
};

const CommunityChoiceScreen: React.FC = () => {
  const navigation = useNavigation<CommunityChoiceScreenNavigationProp>();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Login */}
      {/* <View style={styles.header}>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>
      </View> */}

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

        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Choose Your Path</Text>
          <Text style={styles.subtitle}>
            Join an existing community or request to create a new one
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.requestButton]}
            onPress={() => navigation.navigate('RequestCommunity')}
          >
            <View style={styles.buttonIcon}>
              <Text style={styles.iconText}>+</Text>
            </View>
            <Text style={styles.buttonTitle}>Request Community</Text>
            <Text style={styles.buttonSubtitle}>
              Create a new community for your group
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.joinButton]}
            onPress={() => navigation.navigate('JoinCommunity')}
          >
            <View style={[styles.buttonIcon, styles.joinIcon]}>
              <Text style={styles.iconText}>👥</Text>
            </View>
            <Text style={styles.buttonTitle}>Join Community</Text>
            <Text style={styles.buttonSubtitle}>
              Become a member of an existing community
            </Text>
          </TouchableOpacity>
        </View>

        {/* Back Button */}
        {/* <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back to Welcome</Text>
        </TouchableOpacity> */}
        <View style={styles.header}>
        {/* <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity> */}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: moderateScale(10),
    marginBottom: moderateScale(20),
  },
  loginButton: {
    backgroundColor: AppColors.teal,
    paddingHorizontal: moderateScale(20),
    paddingVertical: moderateScale(8),
    borderRadius: moderateScale(20),
    width: moderateScale(200),
    marginRight: moderateScale(60),
  },
  loginText: {
    color: AppColors.white,
    fontFamily: 'italic',
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    textAlign: 'center'
  },
  content: {
    marginTop: moderateScale(10),
    flex: 1,
    paddingHorizontal: moderateScale(30),
    justifyContent: 'space-between',
    paddingBottom: moderateScale(10),
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: moderateScale(10),
  },
  logoPlaceholder: {
    width: moderateScale(100),
    height: moderateScale(100),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: moderateScale(15),
  },
  tree: {
    position: 'relative',
    width: moderateScale(80),
    height: moderateScale(80),
  },
  trunk: {
    position: 'absolute',
    bottom: 0,
    left: '45%',
    width: moderateScale(8),
    height: moderateScale(24),
    backgroundColor: '#654321',
  },
  leaves: {
    position: 'absolute',
    top: moderateScale(8),
    left: '20%',
    width: moderateScale(48),
    height: moderateScale(32),
  },
  leaf: {
    position: 'absolute',
    width: moderateScale(16),
    height: moderateScale(12),
    borderRadius: moderateScale(8),
  },
  leaf1: {
    backgroundColor: AppColors.orange,
    top: 0,
    left: 0,
  },
  leaf2: {
    backgroundColor: AppColors.red,
    top: moderateScale(4),
    left: moderateScale(16),
  },
  leaf3: {
    backgroundColor: AppColors.green,
    top: moderateScale(8),
    right: 0,
  },
  people: {
    position: 'absolute',
    top: moderateScale(24),
    left: '25%',
    width: moderateScale(40),
    height: moderateScale(24),
  },
  person: {
    position: 'absolute',
    width: moderateScale(10),
    height: moderateScale(10),
    borderRadius: moderateScale(5),
  },
  person1: {
    backgroundColor: AppColors.orange,
    top: 0,
    left: 0,
  },
  person2: {
    backgroundColor: AppColors.red,
    top: moderateScale(4),
    left: moderateScale(12),
  },
  person3: {
    backgroundColor: AppColors.green,
    top: moderateScale(8),
    right: 0,
  },
  logoText: {
    fontSize: moderateScale(36),
    fontWeight: 'bold',
    color: AppColors.black,
    letterSpacing: moderateScale(2),
  },
  titleContainer: {
    alignItems: 'center',
    marginVertical: moderateScale(0),
  },
  title: {
    fontSize: moderateScale(28),
    fontWeight: 'bold',
    color: AppColors.teal,
    marginBottom: moderateScale(10),
    textAlign: 'center',
  },
  subtitle: {
    fontSize: moderateScale(16),
    color: AppColors.gray,
    textAlign: 'center',
    lineHeight: moderateScale(22),
  },
  buttonsContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: moderateScale(20),
  },
  actionButton: {
    backgroundColor: AppColors.white,
    padding: moderateScale(15),
    borderRadius: moderateScale(15),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: moderateScale(2),
    },
    shadowOpacity: 0.1,
    shadowRadius: moderateScale(3.84),
    elevation: moderateScale(5),
    borderWidth: moderateScale(2),
  },
  requestButton: {
    borderColor: AppColors.blue,
  },
  joinButton: {
    borderColor: AppColors.teal,
  },
  buttonIcon: {
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: moderateScale(25),
    backgroundColor: AppColors.blue,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: moderateScale(10),
  },
  joinIcon: {
    backgroundColor: AppColors.green,
  },
  iconText: {
    fontSize: moderateScale(24),
    color: AppColors.white,
    fontWeight: 'bold',
  },
  buttonTitle: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    color: AppColors.black,
    marginBottom: moderateScale(8),
  },
  buttonSubtitle: {
    fontSize: moderateScale(14),
    color: AppColors.gray,
    textAlign: 'center',
    lineHeight: moderateScale(18),
  },
  backButton: {
    alignItems: 'center',
    paddingVertical: moderateScale(15),
  },
  backButtonText: {
    fontSize: moderateScale(16),
    color: AppColors.teal,
    fontWeight: '600',
  },
});

export default CommunityChoiceScreen;