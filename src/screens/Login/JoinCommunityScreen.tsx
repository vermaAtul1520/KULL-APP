// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   SafeAreaView,
//   ScrollView,
//   Alert,
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { Picker } from '@react-native-picker/picker';

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

// interface JoinFormData {
//   name: string;
//   lastName: string;
//   gotra: string;
//   fatherName: string;
//   maritalStatus: string;
//   phoneNumber: string;
//   email: string;
//   profession: string;
//   bloodGroup: string;
//   age: string;
//   dob: string;
// }

// const JoinCommunityScreen: React.FC = () => {
//   const navigation = useNavigation();
  
//   const [formData, setFormData] = useState<JoinFormData>({
//     name: '',
//     lastName: '',
//     gotra: '',
//     fatherName: '',
//     maritalStatus: 'single',
//     phoneNumber: '',
//     email: '',
//     profession: '',
//     bloodGroup: '',
//     age: '',
//     dob: '',
//   });

//   const [ageOrDob, setAgeOrDob] = useState<'age' | 'dob'>('age');

//   const updateFormData = (field: keyof JoinFormData, value: string) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//   };

//   const handleSubmit = () => {
//     // Basic validation
//     const requiredFields = [
//       'name', 'lastName', 'gotra', 'fatherName', 
//       'phoneNumber', 'email', 'profession'
//     ];
    
//     const missingFields = requiredFields.filter(field => !formData[field as keyof JoinFormData]);
    
//     if (ageOrDob === 'age' && !formData.age) {
//       missingFields.push('age');
//     }
//     if (ageOrDob === 'dob' && !formData.dob) {
//       missingFields.push('dob');
//     }
    
//     if (missingFields.length > 0) {
//       Alert.alert('Error', 'Please fill in all required fields');
//       return;
//     }

//     // Here you would normally send the data to your API
//     Alert.alert(
//       'Success', 
//       'Join community request submitted successfully!',
//       [
//         {
//           text: 'OK',
//           onPress: () => navigation.goBack(),
//         },
//       ]
//     );
//   };

//   const bloodGroups = [
//     { label: 'Select Blood Group (Optional)', value: '' },
//     { label: 'A+', value: 'A+' },
//     { label: 'A-', value: 'A-' },
//     { label: 'B+', value: 'B+' },
//     { label: 'B-', value: 'B-' },
//     { label: 'AB+', value: 'AB+' },
//     { label: 'AB-', value: 'AB-' },
//     { label: 'O+', value: 'O+' },
//     { label: 'O-', value: 'O-' },
//   ];

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity
//           style={styles.backButton}
//           onPress={() => navigation.goBack()}
//         >
//           <Text style={styles.backButtonText}>← Back</Text>
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Join Community</Text>
//         <View style={styles.placeholder} />
//       </View>

//       <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
//         <View style={styles.formContainer}>
          
//           {/* Name */}
//           <View style={styles.inputGroup}>
//             <Text style={styles.label}>First Name *</Text>
//             <TextInput
//               style={styles.input}
//               value={formData.name}
//               onChangeText={(value) => updateFormData('name', value)}
//               placeholder="Enter your first name"
//               placeholderTextColor={AppColors.gray}
//             />
//           </View>

//           {/* Last Name */}
//           <View style={styles.inputGroup}>
//             <Text style={styles.label}>Last Name *</Text>
//             <TextInput
//               style={styles.input}
//               value={formData.lastName}
//               onChangeText={(value) => updateFormData('lastName', value)}
//               placeholder="Enter your last name"
//               placeholderTextColor={AppColors.gray}
//             />
//           </View>

//           {/* Gotra */}
//           <View style={styles.inputGroup}>
//             <Text style={styles.label}>Gotra *</Text>
//             <TextInput
//               style={styles.input}
//               value={formData.gotra}
//               onChangeText={(value) => updateFormData('gotra', value)}
//               placeholder="Enter your gotra"
//               placeholderTextColor={AppColors.gray}
//             />
//           </View>

//           {/* Father Name */}
//           <View style={styles.inputGroup}>
//             <Text style={styles.label}>Father's Name *</Text>
//             <TextInput
//               style={styles.input}
//               value={formData.fatherName}
//               onChangeText={(value) => updateFormData('fatherName', value)}
//               placeholder="Enter father's name"
//               placeholderTextColor={AppColors.gray}
//             />
//           </View>

//           {/* Marital Status */}
//           <View style={styles.inputGroup}>
//             <Text style={styles.label}>Marital Status *</Text>
//             <View style={styles.pickerContainer}>
//               <Picker
//                 selectedValue={formData.maritalStatus}
//                 onValueChange={(value) => updateFormData('maritalStatus', value)}
//                 style={styles.picker}
//               >
//                 <Picker.Item label="Single" value="single" />
//                 <Picker.Item label="Married" value="married" />
//               </Picker>
//             </View>
//           </View>

//           {/* Phone Number */}
//           <View style={styles.inputGroup}>
//             <Text style={styles.label}>Phone Number *</Text>
//             <TextInput
//               style={styles.input}
//               value={formData.phoneNumber}
//               onChangeText={(value) => updateFormData('phoneNumber', value)}
//               placeholder="Enter phone number"
//               placeholderTextColor={AppColors.gray}
//               keyboardType="phone-pad"
//               maxLength={10}
//             />
//           </View>

//           {/* Email */}
//           <View style={styles.inputGroup}>
//             <Text style={styles.label}>Email Address *</Text>
//             <TextInput
//               style={styles.input}
//               value={formData.email}
//               onChangeText={(value) => updateFormData('email', value)}
//               placeholder="Enter email address"
//               placeholderTextColor={AppColors.gray}
//               keyboardType="email-address"
//               autoCapitalize="none"
//             />
//           </View>

//           {/* Profession */}
//           <View style={styles.inputGroup}>
//             <Text style={styles.label}>Profession/Occupation *</Text>
//             <TextInput
//               style={styles.input}
//               value={formData.profession}
//               onChangeText={(value) => updateFormData('profession', value)}
//               placeholder="Enter your profession"
//               placeholderTextColor={AppColors.gray}
//             />
//           </View>

//           {/* Blood Group */}
//           <View style={styles.inputGroup}>
//             <Text style={styles.label}>Blood Group (Optional for Blood Donation)</Text>
//             <View style={styles.pickerContainer}>
//               <Picker
//                 selectedValue={formData.bloodGroup}
//                 onValueChange={(value) => updateFormData('bloodGroup', value)}
//                 style={styles.picker}
//               >
//                 {bloodGroups.map((group) => (
//                   <Picker.Item 
//                     key={group.value} 
//                     label={group.label} 
//                     value={group.value} 
//                   />
//                 ))}
//               </Picker>
//             </View>
//           </View>

//           {/* Age/DOB Toggle */}
//           <View style={styles.inputGroup}>
//             <Text style={styles.label}>Age/Date of Birth *</Text>
//             <View style={styles.toggleContainer}>
//               <TouchableOpacity
//                 style={[
//                   styles.toggleButton,
//                   ageOrDob === 'age' && styles.toggleButtonActive,
//                 ]}
//                 onPress={() => setAgeOrDob('age')}
//               >
//                 <Text
//                   style={[
//                     styles.toggleText,
//                     ageOrDob === 'age' && styles.toggleTextActive,
//                   ]}
//                 >
//                   Age
//                 </Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={[
//                   styles.toggleButton,
//                   ageOrDob === 'dob' && styles.toggleButtonActive,
//                 ]}
//                 onPress={() => setAgeOrDob('dob')}
//               >
//                 <Text
//                   style={[
//                     styles.toggleText,
//                     ageOrDob === 'dob' && styles.toggleTextActive,
//                   ]}
//                 >
//                   Date of Birth
//                 </Text>
//               </TouchableOpacity>
//             </View>

//             {ageOrDob === 'age' ? (
//               <TextInput
//                 style={styles.input}
//                 value={formData.age}
//                 onChangeText={(value) => updateFormData('age', value)}
//                 placeholder="Enter your age"
//                 placeholderTextColor={AppColors.gray}
//                 keyboardType="numeric"
//                 maxLength={2}
//               />
//             ) : (
//               <TextInput
//                 style={styles.input}
//                 value={formData.dob}
//                 onChangeText={(value) => updateFormData('dob', value)}
//                 placeholder="Enter date of birth (DD/MM/YYYY)"
//                 placeholderTextColor={AppColors.gray}
//               />
//             )}
//           </View>

//           {/* Submit Button */}
//           <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
//             <Text style={styles.submitButtonText}>Join Community</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     marginTop: 50,
//     flex: 1,
//     backgroundColor: AppColors.cream,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 20,
//     paddingVertical: 15,
//     backgroundColor: AppColors.white,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 3.84,
//     elevation: 5,
//   },
//   backButton: {
//     padding: 5,
//   },
//   backButtonText: {
//     fontSize: 16,
//     color: AppColors.teal,
//     fontWeight: '600',
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: AppColors.black,
//   },
//   placeholder: {
//     width: 40,
//   },
//   scrollView: {
//     flex: 1,
//   },
//   formContainer: {
//     padding: 20,
//   },
//   inputGroup: {
//     marginBottom: 20,
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: AppColors.black,
//     marginBottom: 8,
//   },
//   input: {
//     backgroundColor: AppColors.white,
//     borderRadius: 10,
//     paddingHorizontal: 15,
//     paddingVertical: 12,
//     fontSize: 16,
//     color: AppColors.black,
//     borderWidth: 1,
//     borderColor: AppColors.lightGray,
//   },
//   pickerContainer: {
//     backgroundColor: AppColors.white,
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: AppColors.lightGray,
//   },
//   picker: {
//     height: 50,
//     color: AppColors.black,
//   },
//   toggleContainer: {
//     flexDirection: 'row',
//     marginBottom: 10,
//     backgroundColor: AppColors.lightGray,
//     borderRadius: 10,
//     padding: 2,
//   },
//   toggleButton: {
//     flex: 1,
//     paddingVertical: 8,
//     alignItems: 'center',
//     borderRadius: 8,
//   },
//   toggleButtonActive: {
//     backgroundColor: AppColors.teal,
//   },
//   toggleText: {
//     fontSize: 14,
//     color: AppColors.gray,
//     fontWeight: '600',
//   },
//   toggleTextActive: {
//     color: AppColors.white,
//   },
//   submitButton: {
//     backgroundColor: AppColors.green,
//     borderRadius: 25,
//     paddingVertical: 15,
//     marginTop: 20,
//     marginBottom: 40,
//   },
//   submitButtonText: {
//     color: AppColors.white,
//     fontSize: 18,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
// });

// export default JoinCommunityScreen;



import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { moderateScale } from '@app/constants/scaleUtils';

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

interface JoinFormData {
  name: string;
  lastName: string;
  gotra: string;
  fatherName: string;
  maritalStatus: string;
  phoneNumber: string;
  email: string;
  profession: string;
  bloodGroup: string;
  age: string;
  dob: string;
  referralCode: string; // Added referral code
}

const JoinCommunityScreen: React.FC = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState<JoinFormData>({
    name: '',
    lastName: '',
    gotra: '',
    fatherName: '',
    maritalStatus: 'single',
    phoneNumber: '',
    email: '',
    profession: '',
    bloodGroup: '',
    age: '',
    dob: '',
    referralCode: '', // Added referral code
  });

  const [ageOrDob, setAgeOrDob] = useState<'age' | 'dob'>('age');

  const updateFormData = (field: keyof JoinFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    // Basic validation
    const requiredFields = [
      'name', 'lastName', 'gotra', 'fatherName', 
      'phoneNumber', 'email', 'profession', 'referralCode'
    ];
    
    const missingFields = requiredFields.filter(field => !formData[field as keyof JoinFormData]);
    
    if (ageOrDob === 'age' && !formData.age) {
      missingFields.push('age');
    }
    if (ageOrDob === 'dob' && !formData.dob) {
      missingFields.push('dob');
    }
    
    if (missingFields.length > 0) {
      Alert.alert('Error', 'Please fill in all required fields including referral code');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    // Phone validation
    if (formData.phoneNumber.length !== 10) {
      Alert.alert('Error', 'Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);

    try {
      // Prepare payload for API
      const payload = {
        firstName: formData.name,
        lastName: formData.lastName,
        email: formData.email,
        phone: `+91${formData.phoneNumber}`,
        password: 'temp123@', // You might want to add a password field or generate one
        gender: 'not specified', // You might want to add gender field
        occupation: formData.profession,
        religion: 'Hindu', // You might want to add religion field
        motherTongue: 'Hindi', // You might want to add mother tongue field
        interests: ['community participation'],
        // Additional fields specific to joining community
        gotra: formData.gotra,
        fatherName: formData.fatherName,
        maritalStatus: formData.maritalStatus,
        bloodGroup: formData.bloodGroup,
        age: ageOrDob === 'age' ? parseInt(formData.age) : undefined,
        dateOfBirth: ageOrDob === 'dob' ? formData.dob : undefined,
        referral: formData.referralCode, // Mandatory referral code
        requestType: 'join_community'
      };

      const response = await fetch('https://kull-backend.onrender.com/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      console.log('result2', result, payload);
      

      if (result.success) {
        Alert.alert(
          'Success', 
          result.message || 'Join community request submitted successfully!',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      } else {
        Alert.alert('Error', result.message || 'Failed to submit request. Please check your referral code.');
      }
    } catch (error) {
      console.error('API Error:', error);
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const bloodGroups = [
    { label: 'Select Blood Group (Optional)', value: '' },
    { label: 'A+', value: 'A+' },
    { label: 'A-', value: 'A-' },
    { label: 'B+', value: 'B+' },
    { label: 'B-', value: 'B-' },
    { label: 'AB+', value: 'AB+' },
    { label: 'AB-', value: 'AB-' },
    { label: 'O+', value: 'O+' },
    { label: 'O-', value: 'O-' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Join Community</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          
          {/* Referral Code - First field since it's mandatory */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Referral Code *</Text>
            <TextInput
              style={styles.input}
              value={formData.referralCode}
              onChangeText={(value) => updateFormData('referralCode', value)}
              placeholder="Enter referral code from community member"
              placeholderTextColor={AppColors.gray}
            />
            <Text style={styles.helpText}>
              You need a referral code from an existing community member to join
            </Text>
          </View>

          {/* Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>First Name *</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(value) => updateFormData('name', value)}
              placeholder="Enter your first name"
              placeholderTextColor={AppColors.gray}
            />
          </View>

          {/* Last Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Last Name *</Text>
            <TextInput
              style={styles.input}
              value={formData.lastName}
              onChangeText={(value) => updateFormData('lastName', value)}
              placeholder="Enter your last name"
              placeholderTextColor={AppColors.gray}
            />
          </View>

          {/* Gotra */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Gotra *</Text>
            <TextInput
              style={styles.input}
              value={formData.gotra}
              onChangeText={(value) => updateFormData('gotra', value)}
              placeholder="Enter your gotra"
              placeholderTextColor={AppColors.gray}
            />
          </View>

          {/* Father Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Father's Name *</Text>
            <TextInput
              style={styles.input}
              value={formData.fatherName}
              onChangeText={(value) => updateFormData('fatherName', value)}
              placeholder="Enter father's name"
              placeholderTextColor={AppColors.gray}
            />
          </View>

          {/* Marital Status */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Marital Status *</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.maritalStatus}
                onValueChange={(value) => updateFormData('maritalStatus', value)}
                style={styles.picker}
              >
                <Picker.Item label="Single" value="single" />
                <Picker.Item label="Married" value="married" />
              </Picker>
            </View>
          </View>

          {/* Phone Number */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number *</Text>
            <TextInput
              style={styles.input}
              value={formData.phoneNumber}
              onChangeText={(value) => updateFormData('phoneNumber', value)}
              placeholder="Enter phone number"
              placeholderTextColor={AppColors.gray}
              keyboardType="phone-pad"
              maxLength={10}
            />
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address *</Text>
            <TextInput
              style={styles.input}
              value={formData.email}
              onChangeText={(value) => updateFormData('email', value)}
              placeholder="Enter email address"
              placeholderTextColor={AppColors.gray}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Profession */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Profession/Occupation *</Text>
            <TextInput
              style={styles.input}
              value={formData.profession}
              onChangeText={(value) => updateFormData('profession', value)}
              placeholder="Enter your profession"
              placeholderTextColor={AppColors.gray}
            />
          </View>

          {/* Blood Group */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Blood Group (Optional for Blood Donation)</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.bloodGroup}
                onValueChange={(value) => updateFormData('bloodGroup', value)}
                style={styles.picker}
              >
                {bloodGroups.map((group) => (
                  <Picker.Item 
                    key={group.value} 
                    label={group.label} 
                    value={group.value} 
                  />
                ))}
              </Picker>
            </View>
          </View>

          {/* Age/DOB Toggle */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Age/Date of Birth *</Text>
            <View style={styles.toggleContainer}>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  ageOrDob === 'age' && styles.toggleButtonActive,
                ]}
                onPress={() => setAgeOrDob('age')}
              >
                <Text
                  style={[
                    styles.toggleText,
                    ageOrDob === 'age' && styles.toggleTextActive,
                  ]}
                >
                  Age
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  ageOrDob === 'dob' && styles.toggleButtonActive,
                ]}
                onPress={() => setAgeOrDob('dob')}
              >
                <Text
                  style={[
                    styles.toggleText,
                    ageOrDob === 'dob' && styles.toggleTextActive,
                  ]}
                >
                  Date of Birth
                </Text>
              </TouchableOpacity>
            </View>

            {ageOrDob === 'age' ? (
              <TextInput
                style={styles.input}
                value={formData.age}
                onChangeText={(value) => updateFormData('age', value)}
                placeholder="Enter your age"
                placeholderTextColor={AppColors.gray}
                keyboardType="numeric"
                maxLength={2}
              />
            ) : (
              <TextInput
                style={styles.input}
                value={formData.dob}
                onChangeText={(value) => updateFormData('dob', value)}
                placeholder="Enter date of birth (DD/MM/YYYY)"
                placeholderTextColor={AppColors.gray}
              />
            )}
          </View>

          {/* Submit Button */}
          <TouchableOpacity 
            style={[styles.submitButton, loading && styles.submitButtonDisabled]} 
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? 'Submitting...' : 'Join Community'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(20),
    paddingVertical: moderateScale(15),
    backgroundColor: AppColors.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: moderateScale(2),
    },
    shadowOpacity: 0.1,
    shadowRadius: moderateScale(3.84),
    elevation: moderateScale(5),
  },
  backButton: {
    padding: moderateScale(5),
  },
  backButtonText: {
    fontSize: moderateScale(16),
    color: AppColors.teal,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: AppColors.black,
  },
  placeholder: {
    width: moderateScale(40),
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    padding: moderateScale(20),
  },
  inputGroup: {
    marginBottom: moderateScale(20),
  },
  label: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: AppColors.black,
    marginBottom: moderateScale(8),
  },
  input: {
    backgroundColor: AppColors.white,
    borderRadius: moderateScale(10),
    paddingHorizontal: moderateScale(15),
    paddingVertical: moderateScale(12),
    fontSize: moderateScale(16),
    color: AppColors.black,
    borderWidth: moderateScale(1),
    borderColor: AppColors.lightGray,
  },
  textArea: {
    minHeight: moderateScale(80),
    textAlignVertical: 'top',
  },
  pickerContainer: {
    backgroundColor: AppColors.white,
    borderRadius: moderateScale(10),
    borderWidth: moderateScale(1),
    borderColor: AppColors.lightGray,
  },
  picker: {
    height: moderateScale(50),
    color: AppColors.black,
  },
  toggleContainer: {
    flexDirection: 'row',
    marginBottom: moderateScale(10),
    backgroundColor: AppColors.lightGray,
    borderRadius: moderateScale(10),
    padding: moderateScale(2),
  },
  toggleButton: {
    flex: 1,
    paddingVertical: moderateScale(8),
    alignItems: 'center',
    borderRadius: moderateScale(8),
  },
  toggleButtonActive: {
    backgroundColor: AppColors.teal,
  },
  toggleText: {
    fontSize: moderateScale(14),
    color: AppColors.gray,
    fontWeight: '600',
  },
  toggleTextActive: {
    color: AppColors.white,
  },
  submitButton: {
    backgroundColor: AppColors.green,
    borderRadius: moderateScale(25),
    paddingVertical: moderateScale(15),
    marginTop: moderateScale(20),
    marginBottom: moderateScale(40),
  },
  submitButtonText: {
    color: AppColors.white,
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: AppColors.gray,
  },
  helpText: {
    fontSize: moderateScale(12),
    color: AppColors.gray,
    marginTop: moderateScale(5),
    fontStyle: 'italic',
  },
});

export default JoinCommunityScreen;