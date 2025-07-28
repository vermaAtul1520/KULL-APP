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

// interface FormData {
//   cast: string;
//   cGotNo: string;
//   name: string;
//   position: string;
//   fatherName: string;
//   address: string;
//   pinCode: string;
//   phoneNo: string;
//   alternativePhone: string;
//   email: string;
//   profession: string;
//   estimatedMembers: string;
//   thoughtOfMaking: string;
//   maritalStatus: string;
//   gotra: string;
// }

// const RequestCommunityScreen: React.FC = () => {
//   const navigation = useNavigation();
  
//   const [formData, setFormData] = useState<FormData>({
//     cast: '',
//     cGotNo: '',
//     name: '',
//     position: '',
//     fatherName: '',
//     address: '',
//     pinCode: '',
//     phoneNo: '',
//     alternativePhone: '',
//     email: '',
//     profession: '',
//     estimatedMembers: '',
//     thoughtOfMaking: '',
//     maritalStatus: 'single',
//     gotra: '',
//   });

//   const updateFormData = (field: keyof FormData, value: string) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//   };

//   const handleSubmit = () => {
//     // Basic validation
//     const requiredFields = [
//       'cast', 'cGotNo', 'name', 'position', 'fatherName', 
//       'address', 'pinCode', 'phoneNo', 'email', 'profession', 
//       'estimatedMembers', 'thoughtOfMaking', 'gotra'
//     ];
    
//     const missingFields = requiredFields.filter(field => !formData[field as keyof FormData]);
    
//     if (missingFields.length > 0) {
//       Alert.alert('Error', 'Please fill in all required fields');
//       return;
//     }

//     // Here you would normally send the data to your API
//     Alert.alert(
//       'Success', 
//       'Community request submitted successfully!',
//       [
//         {
//           text: 'OK',
//           onPress: () => navigation.goBack(),
//         },
//       ]
//     );
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity
//           style={styles.backButton}
//           onPress={() => navigation.goBack()}
//         >
//           <Text style={styles.backButtonText}>← Back</Text>
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Request Community</Text>
//         <View style={styles.placeholder} />
//       </View>

//       <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
//         <View style={styles.formContainer}>
          
//           {/* Cast */}
//           <View style={styles.inputGroup}>
//             <Text style={styles.label}>Cast *</Text>
//             <TextInput
//               style={styles.input}
//               value={formData.cast}
//               onChangeText={(value) => updateFormData('cast', value)}
//               placeholder="Enter your cast"
//               placeholderTextColor={AppColors.gray}
//             />
//           </View>

//           {/* CGotNO */}
//           <View style={styles.inputGroup}>
//             <Text style={styles.label}>CGotNO *</Text>
//             <TextInput
//               style={styles.input}
//               value={formData.cGotNo}
//               onChangeText={(value) => updateFormData('cGotNo', value)}
//               placeholder="Enter CGotNO"
//               placeholderTextColor={AppColors.gray}
//             />
//           </View>

//           {/* Name */}
//           <View style={styles.inputGroup}>
//             <Text style={styles.label}>Name *</Text>
//             <TextInput
//               style={styles.input}
//               value={formData.name}
//               onChangeText={(value) => updateFormData('name', value)}
//               placeholder="Enter your full name"
//               placeholderTextColor={AppColors.gray}
//             />
//           </View>

//           {/* Position */}
//           <View style={styles.inputGroup}>
//             <Text style={styles.label}>Position in Community *</Text>
//             <TextInput
//               style={styles.input}
//               value={formData.position}
//               onChangeText={(value) => updateFormData('position', value)}
//               placeholder="Your position/role in community"
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

//           {/* Address */}
//           <View style={styles.inputGroup}>
//             <Text style={styles.label}>Address *</Text>
//             <TextInput
//               style={[styles.input, styles.textArea]}
//               value={formData.address}
//               onChangeText={(value) => updateFormData('address', value)}
//               placeholder="Enter your full address"
//               placeholderTextColor={AppColors.gray}
//               multiline={true}
//               numberOfLines={3}
//             />
//           </View>

//           {/* Pin Code */}
//           <View style={styles.inputGroup}>
//             <Text style={styles.label}>Pin Code *</Text>
//             <TextInput
//               style={styles.input}
//               value={formData.pinCode}
//               onChangeText={(value) => updateFormData('pinCode', value)}
//               placeholder="Enter pin code"
//               placeholderTextColor={AppColors.gray}
//               keyboardType="numeric"
//               maxLength={6}
//             />
//           </View>

//           {/* Phone Number */}
//           <View style={styles.inputGroup}>
//             <Text style={styles.label}>Phone Number *</Text>
//             <TextInput
//               style={styles.input}
//               value={formData.phoneNo}
//               onChangeText={(value) => updateFormData('phoneNo', value)}
//               placeholder="Enter phone number"
//               placeholderTextColor={AppColors.gray}
//               keyboardType="phone-pad"
//               maxLength={10}
//             />
//           </View>

//           {/* Alternative Phone */}
//           <View style={styles.inputGroup}>
//             <Text style={styles.label}>Alternative Phone</Text>
//             <TextInput
//               style={styles.input}
//               value={formData.alternativePhone}
//               onChangeText={(value) => updateFormData('alternativePhone', value)}
//               placeholder="Enter alternative phone number"
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
//             <Text style={styles.label}>Profession/Working *</Text>
//             <TextInput
//               style={styles.input}
//               value={formData.profession}
//               onChangeText={(value) => updateFormData('profession', value)}
//               placeholder="Enter your profession"
//               placeholderTextColor={AppColors.gray}
//             />
//           </View>

//           {/* Estimated Members */}
//           <View style={styles.inputGroup}>
//             <Text style={styles.label}>Estimated Members in Community *</Text>
//             <TextInput
//               style={styles.input}
//               value={formData.estimatedMembers}
//               onChangeText={(value) => updateFormData('estimatedMembers', value)}
//               placeholder="Estimated number of members"
//               placeholderTextColor={AppColors.gray}
//               keyboardType="numeric"
//             />
//           </View>

//           {/* Thought of Making */}
//           <View style={styles.inputGroup}>
//             <Text style={styles.label}>Thought of Making Community *</Text>
//             <TextInput
//               style={[styles.input, styles.textArea]}
//               value={formData.thoughtOfMaking}
//               onChangeText={(value) => updateFormData('thoughtOfMaking', value)}
//               placeholder="Why do you want to create this community?"
//               placeholderTextColor={AppColors.gray}
//               multiline={true}
//               numberOfLines={4}
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

//           {/* Submit Button */}
//           <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
//             <Text style={styles.submitButtonText}>Submit Request</Text>
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
//   textArea: {
//     minHeight: 80,
//     textAlignVertical: 'top',
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
//   submitButton: {
//     backgroundColor: AppColors.teal,
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

// export default RequestCommunityScreen;




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

interface FormData {
  cast: string;
  cGotNo: string;
  name: string;
  position: string;
  fatherName: string;
  address: string;
  pinCode: string;
  phoneNo: string;
  alternativePhone: string;
  email: string;
  profession: string;
  estimatedMembers: string;
  thoughtOfMaking: string;
  maritalStatus: string;
  gotra: string;
}

const RequestCommunityScreen: React.FC = () => {
  const navigation = useNavigation();
  
  const [formData, setFormData] = useState<FormData>({
    cast: '',
    cGotNo: '',
    name: '',
    position: '',
    fatherName: '',
    address: '',
    pinCode: '',
    phoneNo: '',
    alternativePhone: '',
    email: '',
    profession: '',
    estimatedMembers: '',
    thoughtOfMaking: '',
    maritalStatus: 'single',
    gotra: '',
  });

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    // Basic validation
    const requiredFields = [
      'cast', 'cGotNo', 'name', 'position', 'fatherName', 
      'address', 'pinCode', 'phoneNo', 'email', 'profession', 
      'estimatedMembers', 'thoughtOfMaking', 'gotra'
    ];
    
    const missingFields = requiredFields.filter(field => !formData[field as keyof FormData]);
    
    if (missingFields.length > 0) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    // Phone validation
    if (formData.phoneNo.length !== 10) {
      Alert.alert('Error', 'Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);

    try {
      // Prepare payload for API
      const payload = {
        firstName: formData.name.split(' ')[0], // Extract first name
        lastName: formData.name.split(' ').slice(1).join(' ') || formData.name, // Extract last name or use full name
        email: formData.email,
        phone: `+91${formData.phoneNo}`,
        password: 'temp123@', // You might want to add a password field or generate one
        gender: 'not specified', // You might want to add gender field
        occupation: formData.profession,
        religion: 'Hindu', // You might want to add religion field
        motherTongue: 'Hindi', // You might want to add mother tongue field
        interests: ['community building'],
        // Additional fields specific to community request
        cast: formData.cast,
        cGotNo: formData.cGotNo,
        positionInCommunity: formData.position,
        fatherName: formData.fatherName,
        address: formData.address,
        pinCode: formData.pinCode,
        alternativePhone: formData.alternativePhone,
        estimatedMembers: parseInt(formData.estimatedMembers),
        thoughtOfMaking: formData.thoughtOfMaking,
        maritalStatus: formData.maritalStatus,
        gotra: formData.gotra,
        requestType: 'community_request'
      };

      const response = await fetch('https://kull-backend.onrender.com/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      console.log('result', result, payload);
      

      if (result.success) {
        Alert.alert(
          'Success', 
          result.message || 'Community request submitted successfully!',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      } else {
        Alert.alert('Error', result.message || 'Failed to submit request');
      }
    } catch (error) {
      console.error('API Error:', error);
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Request Community</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          
          {/* Cast */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Cast *</Text>
            <TextInput
              style={styles.input}
              value={formData.cast}
              onChangeText={(value) => updateFormData('cast', value)}
              placeholder="Enter your cast"
              placeholderTextColor={AppColors.gray}
            />
          </View>

          {/* CGotNO */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>CGotNO *</Text>
            <TextInput
              style={styles.input}
              value={formData.cGotNo}
              onChangeText={(value) => updateFormData('cGotNo', value)}
              placeholder="Enter CGotNO"
              placeholderTextColor={AppColors.gray}
            />
          </View>

          {/* Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name *</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(value) => updateFormData('name', value)}
              placeholder="Enter your full name"
              placeholderTextColor={AppColors.gray}
            />
          </View>

          {/* Position */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Position in Community *</Text>
            <TextInput
              style={styles.input}
              value={formData.position}
              onChangeText={(value) => updateFormData('position', value)}
              placeholder="Your position/role in community"
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

          {/* Address */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Address *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.address}
              onChangeText={(value) => updateFormData('address', value)}
              placeholder="Enter your full address"
              placeholderTextColor={AppColors.gray}
              multiline={true}
              numberOfLines={3}
            />
          </View>

          {/* Pin Code */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Pin Code *</Text>
            <TextInput
              style={styles.input}
              value={formData.pinCode}
              onChangeText={(value) => updateFormData('pinCode', value)}
              placeholder="Enter pin code"
              placeholderTextColor={AppColors.gray}
              keyboardType="numeric"
              maxLength={6}
            />
          </View>

          {/* Phone Number */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number *</Text>
            <TextInput
              style={styles.input}
              value={formData.phoneNo}
              onChangeText={(value) => updateFormData('phoneNo', value)}
              placeholder="Enter phone number"
              placeholderTextColor={AppColors.gray}
              keyboardType="phone-pad"
              maxLength={10}
            />
          </View>

          {/* Alternative Phone */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Alternative Phone</Text>
            <TextInput
              style={styles.input}
              value={formData.alternativePhone}
              onChangeText={(value) => updateFormData('alternativePhone', value)}
              placeholder="Enter alternative phone number"
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
            <Text style={styles.label}>Profession/Working *</Text>
            <TextInput
              style={styles.input}
              value={formData.profession}
              onChangeText={(value) => updateFormData('profession', value)}
              placeholder="Enter your profession"
              placeholderTextColor={AppColors.gray}
            />
          </View>

          {/* Estimated Members */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Estimated Members in Community *</Text>
            <TextInput
              style={styles.input}
              value={formData.estimatedMembers}
              onChangeText={(value) => updateFormData('estimatedMembers', value)}
              placeholder="Estimated number of members"
              placeholderTextColor={AppColors.gray}
              keyboardType="numeric"
            />
          </View>

          {/* Thought of Making */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Thought of Making Community *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.thoughtOfMaking}
              onChangeText={(value) => updateFormData('thoughtOfMaking', value)}
              placeholder="Why do you want to create this community?"
              placeholderTextColor={AppColors.gray}
              multiline={true}
              numberOfLines={4}
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

          {/* Submit Button */}
          <TouchableOpacity 
            style={[styles.submitButton, loading && styles.submitButtonDisabled]} 
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? 'Submitting...' : 'Submit Request'}
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
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: AppColors.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  backButton: {
    padding: 5,
  },
  backButtonText: {
    fontSize: 16,
    color: AppColors.teal,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: AppColors.black,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.black,
    marginBottom: 8,
  },
  input: {
    backgroundColor: AppColors.white,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: AppColors.black,
    borderWidth: 1,
    borderColor: AppColors.lightGray,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    backgroundColor: AppColors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: AppColors.lightGray,
  },
  picker: {
    height: 50,
    color: AppColors.black,
  },
  submitButton: {
    backgroundColor: AppColors.teal,
    borderRadius: 25,
    paddingVertical: 15,
    marginTop: 20,
    marginBottom: 40,
  },
  submitButtonText: {
    color: AppColors.white,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: AppColors.gray,
  },
});

export default RequestCommunityScreen;