import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Image} from 'react-native';
import {useAuth} from '@app/navigators';
import PasswordHideIcon from '@app/assets/images/hideeye.svg';
import PasswordShowIcon from '@app/assets/images/showeye.svg';
import {BASE_URL} from '@app/constants/constant';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Scaling functions
const {width, height} = Dimensions.get('window');
const moderateScale = (size: number) => {
  const scale = width / 380;
  return Math.round(size * scale);
};

const AppColors = {
  primary: '#7dd3c0',
  black: '#000000',
  white: '#ffffff',
  gray: '#666666',
  dark: '#2a2a2a',
  teal: '#1e6b5c',
  cream: '#f5f5dc',
  blue: '#4169e1',
  lightGray: '#f0f0f0',
  orange: '#ff8c00',
  red: '#dc143c',
  green: '#228b22',
};

interface LoginResponse {
  message: string;
  token: string;
  user: {
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
    community?: {
      _id: string;
      name: string;
    };
  };
}

interface LoginError {
  message: string;
  error?: string;
}

const LoginScreen: React.FC = () => {
  const navigation = useNavigation();
  const {login} = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const loginAPI = async (
    emailOrPhone: string,
    password: string,
  ): Promise<LoginResponse> => {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        emailOrPhone,
        password,
      }),
    });
    console.log('Login API Response:', response);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    return data;
  };

  const handleLogin = async () => {
    // Validation
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Email validation (basic)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[+]?[\d\s\-()]+$/;

    if (!emailRegex.test(email) && !phoneRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email or phone number');
      return;
    }

    setIsLoading(true);

    try {
      const response = await loginAPI(email, password);

      // Store user data and token (you might want to use AsyncStorage or secure storage)
      console.log('🔍 LOGIN DEBUG - Login successful:', response);
      console.log('🔍 LOGIN DEBUG - User data:', response.user);
      console.log('🔍 LOGIN DEBUG - Community info:', response.user.community);

      // You can store the token and user data here
      await AsyncStorage.setItem('userToken', response.token);
      await AsyncStorage.setItem('userData', JSON.stringify(response.user));

      login(response.user, response.token); // Update auth context
      Alert.alert('Success', 'Login successful!');
    } catch (error: any) {
      console.error('Login error:', error);
      Alert.alert(
        'Login Failed',
        error.message || 'An error occurred during login. Please try again.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const isValidInput = () => {
    return email.trim().length > 0 && password.trim().length > 0;
  };

  return (
    <>
      <StatusBar backgroundColor={AppColors.cream} barStyle="dark-content" />
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
          keyboardDismissMode="on-drag">
          {/* Logo Section */}
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/images/kull-logo-2-Photoroom.png')}
              style={styles.logoImage}
            />
          </View>

          {/* Login Form */}
          <View style={styles.formContainer}>
            <Text style={styles.welcomeText}>Welcome</Text>
            <Text style={styles.subtitleText}>Log in to your account</Text>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={AppColors.gray}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                returnKeyType="next"
                blurOnSubmit={false}
                textContentType="emailAddress"
                autoComplete="email"
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={AppColors.gray}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCorrect={false}
                returnKeyType="done"
                textContentType="password"
                autoComplete="password"
                onSubmitEditing={handleLogin}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
                hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                {showPassword ? (
                  <PasswordHideIcon
                    width={moderateScale(20)}
                    height={moderateScale(20)}
                    fill={AppColors.white}
                  />
                ) : (
                  <PasswordShowIcon
                    width={moderateScale(20)}
                    height={moderateScale(20)}
                    fill={AppColors.white}
                  />
                )}
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              activeOpacity={0.8}
              disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator />
              ) : (
                <Text style={styles.loginButtonText}>LOG IN</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.forgotPassword} activeOpacity={0.7}>
              <Text style={styles.forgotPasswordText}>Forgot password?</Text>
            </TouchableOpacity>
          </View>

          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.cream,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: moderateScale(30),
    paddingTop:
      Platform.OS === 'android' ? moderateScale(40) : moderateScale(60),
    paddingBottom: moderateScale(30),
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: moderateScale(30),
  },
  logoImage: {
    height: moderateScale(160),
    width: moderateScale(260),
    resizeMode: 'contain',
  },
  formContainer: {
    backgroundColor: AppColors.white,
    padding: moderateScale(25),
    borderRadius: moderateScale(20),
    marginBottom: moderateScale(30),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: moderateScale(2),
    },
    shadowOpacity: 0.1,
    shadowRadius: moderateScale(3.84),
    elevation: moderateScale(5),
  },
  welcomeText: {
    fontSize: moderateScale(24),
    fontWeight: 'bold',
    color: AppColors.teal,
    textAlign: 'center',
    marginBottom: moderateScale(8),
  },
  subtitleText: {
    fontSize: moderateScale(16),
    color: AppColors.gray,
    textAlign: 'center',
    marginBottom: moderateScale(25),
  },
  inputContainer: {
    marginBottom: moderateScale(20),
    position: 'relative',
  },
  input: {
    backgroundColor: AppColors.lightGray,
    borderRadius: moderateScale(10),
    paddingHorizontal: moderateScale(15),
    paddingVertical:
      Platform.OS === 'android' ? moderateScale(12) : moderateScale(15),
    fontSize: moderateScale(16),
    color: AppColors.black,
    height: Platform.OS === 'android' ? moderateScale(50) : moderateScale(45),
    textAlignVertical: Platform.OS === 'android' ? 'center' : 'auto',
  },
  eyeButton: {
    position: 'absolute',
    right: moderateScale(15),
    top: Platform.OS === 'android' ? moderateScale(15) : moderateScale(12),
    width: moderateScale(24),
    height: moderateScale(24),
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyeText: {
    fontSize: moderateScale(16),
  },
  loginButton: {
    backgroundColor: AppColors.teal,
    borderRadius: moderateScale(25),
    paddingVertical: moderateScale(15),
    marginTop: moderateScale(10),
    marginBottom: moderateScale(20),
    height: moderateScale(50),
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonText: {
    color: AppColors.white,
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  forgotPassword: {
    alignItems: 'center',
    paddingVertical: moderateScale(10),
  },
  forgotPasswordText: {
    color: AppColors.red,
    fontSize: moderateScale(16),
    fontWeight: '600',
  },
  backButton: {
    alignItems: 'center',
    paddingVertical: moderateScale(15),
    marginTop: moderateScale(20),
  },
  backButtonText: {
    fontSize: moderateScale(16),
    color: AppColors.teal,
    fontWeight: '600',
  },
});

export default LoginScreen;
