// import React, { useState, useContext } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   SafeAreaView,
//   Alert,
//   KeyboardAvoidingView,
//   Platform,
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { Image } from 'react-native';
// import { useAuth } from '@app/navigators';

// // You'll need to import your AuthContext from the main navigation file
// // For now, I'll create a simple context usage

// const AppColors = {
//   primary: '#7dd3c0',
//   black: '#000000',
//   white: '#ffffff',
//   gray: '#666666',
//   dark: '#2a2a2a',
//   teal: '#1e6b5c',
//   cream: '#f5f5dc',
//   blue: '#4169e1',
//   lightGray: '#f0f0f0',
//   orange: '#ff8c00',
//   red: '#dc143c',
//   green: '#228b22',
// };

// // const LoginScreen: React.FC = () => {
// //   const navigation = useNavigation();
// //   const [email, setEmail] = useState('');
// //   const [password, setPassword] = useState('');
// //   const [showPassword, setShowPassword] = useState(false);

//   // This should be replaced with your actual auth context
//   // const handleLogin = () => {
//   //   if (!email || !password) {
//   //     Alert.alert('Error', 'Please fill in all fields');
//   //     return;
//   //   }

//   //   // For now, just simulate login success
//   //   // Later, you'll integrate with your API

//   //   if (email === 'atulverma1520@gmail.com' && password === 'Ak@4321') {
//   //     navigation.navigate('Home');
//   //   Alert.alert('Success', 'Login successful!', [
//   //     {
//   //       text: 'OK',
//   //       onPress: () => {
//   //         // This should call your actual login function that updates the auth context
//   //         // For now, we'll just navigate back
//   //         console.log('Login attempted with:', { email, password });
//   //       },
//   //     },
//   //   ]);
//   //   }
//   // };

//   const LoginScreen: React.FC = () => {
//     const navigation = useNavigation();
//     const { login } = useAuth(); // Get login function from AuthContext
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [showPassword, setShowPassword] = useState(false);
  
//     const handleLogin = () => {
//       if (!email || !password) {
//         Alert.alert('Error', 'Please fill in all fields');
//         return;
//       }
  
//       // Check for specific admin credentials
//       if (email === 'atulverma1520@gmail.com' && password === 'Ak@4321') {
//         // Call login function to update auth state and navigate to home
//         login();
        
//         Alert.alert('Success', 'Login successful!', [
//           {
//             text: 'OK',
//             onPress: () => {
//               console.log('Login successful with:', { email, password });
//             },
//           },
//         ]);
//       } else {
//         Alert.alert('Error', 'Invalid credentials');
//       }
//     };

//   return (
//    <KeyboardAvoidingView
//     style={{ flex: 1 }}
//     behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//     keyboardVerticalOffset={Platform.OS === 'android' ? 0 : 40}
//     >
//     <SafeAreaView style={styles.container}>
//       <View style={styles.content}>
//         {/* Logo Section */}
//         <View style={styles.logoContainer}>
//         <Image
//           source={require('../../assets/images/kull-logo-2-Photoroom.png')}
//           style={{
//             height: 200,
//             width: 300,
//             // backgroundColor: 'red', 
//             resizeMode: 'contain',
//            }}
//         />
//         </View>

//         {/* Login Form */}
//         <View style={styles.formContainer}>
//           <Text style={styles.welcomeText}>Welcome</Text>
//           <Text style={styles.subtitleText}>Log in to your account</Text>

//           <View style={styles.inputContainer}>
//             <TextInput
//               maxLength={30}
//               style={styles.input}
//               placeholder="Email"
//               placeholderTextColor={AppColors.gray}
//               value={email}
//               onChangeText={text => setEmail(text)}
//             />
//           </View>

//           <View style={styles.inputContainer}>
//             <TextInput
//               style={styles.input}
//               placeholder="Password"
//               placeholderTextColor={AppColors.gray}
//               value={password}
//               onChangeText={setPassword}
//               secureTextEntry={!showPassword}
//             />
//             <TouchableOpacity
//               style={styles.eyeButton}
//               onPress={() => setShowPassword(!showPassword)}
//             >
//               <Text style={styles.eyeText}>{showPassword ? '🙈' : '👁️'}</Text>
//             </TouchableOpacity>
//           </View>

//           <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
//             <Text style={styles.loginButtonText}>LOG IN</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.forgotPassword}>
//             <Text style={styles.forgotPasswordText}>Forgot password?</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Back Button */}
//         <TouchableOpacity
//           style={styles.backButton}
//           onPress={() => navigation.goBack()}
//         >
//           <Text style={styles.backButtonText}>← Back</Text>
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//     </KeyboardAvoidingView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: AppColors.cream,
//   },
//   content: {
//     flex: 1,
//     paddingHorizontal: 30,
//     justifyContent: 'space-between',
//     paddingTop: 60,
//     paddingBottom: 30,
//   },
//   logoContainer: {
//     alignItems: 'center',
//     // marginBottom: 40,
//   },
//   logoPlaceholder: {
//     width: 80,
//     height: 80,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 10,
//   },
//   tree: {
//     position: 'relative',
//     width: 60,
//     height: 60,
//   },
//   trunk: {
//     position: 'absolute',
//     bottom: 0,
//     left: '45%',
//     width: 6,
//     height: 18,
//     backgroundColor: '#654321',
//   },
//   leaves: {
//     position: 'absolute',
//     top: 6,
//     left: '20%',
//     width: 36,
//     height: 24,
//   },
//   leaf: {
//     position: 'absolute',
//     width: 12,
//     height: 9,
//     borderRadius: 6,
//   },
//   leaf1: {
//     backgroundColor: AppColors.orange,
//     top: 0,
//     left: 0,
//   },
//   leaf2: {
//     backgroundColor: AppColors.red,
//     top: 3,
//     left: 12,
//   },
//   leaf3: {
//     backgroundColor: AppColors.green,
//     top: 6,
//     right: 0,
//   },
//   people: {
//     position: 'absolute',
//     top: 18,
//     left: '25%',
//     width: 30,
//     height: 18,
//   },
//   person: {
//     position: 'absolute',
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//   },
//   person1: {
//     backgroundColor: AppColors.orange,
//     top: 0,
//     left: 0,
//   },
//   person2: {
//     backgroundColor: AppColors.red,
//     top: 3,
//     left: 9,
//   },
//   person3: {
//     backgroundColor: AppColors.green,
//     top: 6,
//     right: 0,
//   },
//   formContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     backgroundColor: AppColors.white,
//     padding: 30,
//     borderRadius: 20,
//     marginVertical: 20,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 3.84,
//     elevation: 5,
//   },
//   welcomeText: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: AppColors.teal,
//     textAlign: 'center',
//     marginBottom: 8,
//   },
//   subtitleText: {
//     fontSize: 16,
//     color: AppColors.gray,
//     textAlign: 'center',
//     marginBottom: 30,
//   },
//   inputContainer: {
//     position: 'relative',
//     marginBottom: 20,
//   },
//   input: {
//     backgroundColor: AppColors.lightGray,
//     borderRadius: 10,
//     paddingHorizontal: 15,
//     paddingVertical: 15,
//     fontSize: 16,
//     color: AppColors.black,
//   },
//   eyeButton: {
//     position: 'absolute',
//     right: 15,
//     top: 15,
//   },
//   eyeText: {
//     fontSize: 18,
//   },
//   loginButton: {
//     backgroundColor: AppColors.teal,
//     borderRadius: 25,
//     paddingVertical: 15,
//     marginTop: 10,
//     marginBottom: 20,
//   },
//   loginButtonText: {
//     color: AppColors.white,
//     fontSize: 18,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   forgotPassword: {
//     alignItems: 'center',
//   },
//   forgotPasswordText: {
//     color: AppColors.red,
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   backButton: {
//     alignItems: 'center',
//     paddingVertical: 15,
//   },
//   backButtonText: {
//     fontSize: 16,
//     color: AppColors.teal,
//     fontWeight: '600',
//   },
// });

// export default LoginScreen;

import React, { useState } from 'react';
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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Image } from 'react-native';
import { useAuth } from '@app/navigators';

// Scaling functions
const { width, height } = Dimensions.get('window');
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

const LoginScreen: React.FC = () => {
  const navigation = useNavigation();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (email === 'Innovgeist@gmail.com' && password === 'Innovgeist@1234') {
      login();
      Alert.alert('Success', 'Login successful!');
    } else {
      Alert.alert('Error', 'Invalid credentials');
    }
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
            keyboardDismissMode="on-drag"
          >
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
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.eyeText}>{showPassword ? '🙈' : '👁️'}</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={styles.loginButton} 
              onPress={handleLogin}
              activeOpacity={0.8}
            >
              <Text style={styles.loginButtonText}>LOG IN</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.forgotPassword}
              activeOpacity={0.7}
            >
              <Text style={styles.forgotPasswordText}>Forgot password?</Text>
            </TouchableOpacity>
          </View>

          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
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
    paddingTop: Platform.OS === 'android' ? moderateScale(40) : moderateScale(60),
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
    paddingVertical: Platform.OS === 'android' ? moderateScale(12) : moderateScale(15),
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