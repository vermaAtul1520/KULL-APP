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
  referralCode: string;
}

const JoinCommunityScreen: React.FC = () => {
  const navigation = useNavigation();
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [ageOrDob, setAgeOrDob] = useState<'age' | 'dob'>('age');
  
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
    referralCode: '',
  });

  const updateFormData = (field: keyof JoinFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Define required fields for each page
  const getRequiredFieldsForPage = (page: number) => {
    switch (page) {
      case 1:
        return ['referralCode', 'name', 'lastName', 'gotra', 'fatherName'];
      case 2:
        return ['maritalStatus', 'phoneNumber', 'email', 'profession'];
      case 3:
        return ageOrDob === 'age' ? ['age'] : ['dob'];
      default:
        return [];
    }
  };

  const validateCurrentPage = () => {
    const requiredFields = getRequiredFieldsForPage(currentPage);
    const missingFields = requiredFields.filter(field => !formData[field as keyof JoinFormData]);
    
    if (missingFields.length > 0) {
      Alert.alert('Error', 'Please fill in all required fields before proceeding');
      return false;
    }

    // Additional validation for page 2
    if (currentPage === 2) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        Alert.alert('Error', 'Please enter a valid email address');
        return false;
      }

      if (formData.phoneNumber.length !== 10) {
        Alert.alert('Error', 'Please enter a valid 10-digit phone number');
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (validateCurrentPage()) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentPage(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateCurrentPage()) {
      return;
    }

    if (!termsAccepted) {
      Alert.alert(
        'Terms & Conditions Required', 
        'You must accept the Terms & Conditions before joining the community. Please tick the checkbox to proceed.',
        [{ text: 'OK' }]
      );
      return;
    }

    setLoading(true);

    try {
      const payload = {
        firstName: formData.name,
        lastName: formData.lastName,
        email: formData.email,
        phone: `+91${formData.phoneNumber}`,
        password: 'temp123@',
        gender: 'not specified',
        occupation: formData.profession,
        religion: 'Hindu',
        motherTongue: 'Hindi',
        interests: ['community participation'],
        gotra: formData.gotra,
        fatherName: formData.fatherName,
        maritalStatus: formData.maritalStatus,
        bloodGroup: formData.bloodGroup,
        age: ageOrDob === 'age' ? parseInt(formData.age) : undefined,
        dateOfBirth: ageOrDob === 'dob' ? formData.dob : undefined,
        referral: formData.referralCode,
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

  const renderProgressBar = () => {
    const progress = (currentPage / 3) * 100;
    
    return (
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>Step {currentPage} of 3</Text>
      </View>
    );
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

  const renderPage1 = () => (
    <View style={styles.formContainer}>
      <Text style={styles.pageTitle}>Basic Information</Text>
      
      {/* Referral Code */}
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
    </View>
  );

  const renderPage2 = () => (
    <View style={styles.formContainer}>
      <Text style={styles.pageTitle}>Contact & Professional Details</Text>
      
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
    </View>
  );

  const renderPage3 = () => (
    <View style={styles.formContainer}>
      <Text style={styles.pageTitle}>Additional Information</Text>
      
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

      {/* Terms & Conditions */}
      <View style={styles.termsContainer}>
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => setTermsAccepted(!termsAccepted)}
        >
          <View style={[styles.checkbox, termsAccepted && styles.checkboxChecked]}>
            {termsAccepted && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.termsText}>
            I agree to the{' '}
            <Text style={styles.termsLink}>Terms & Conditions</Text>
            {' '}and{' '}
            <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>
        </TouchableOpacity>
        {!termsAccepted && (
          <Text style={styles.termsError}>
            * You must accept the Terms & Conditions to proceed
          </Text>
        )}
      </View>
    </View>
  );

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

      {renderProgressBar()}

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {currentPage === 1 && renderPage1()}
        {currentPage === 2 && renderPage2()}
        {currentPage === 3 && renderPage3()}

        {/* Navigation Buttons */}
        <View style={styles.navigationContainer}>
          {currentPage > 1 && (
            <TouchableOpacity style={styles.previousButton} onPress={handlePrevious}>
              <Text style={styles.previousButtonText}>Previous</Text>
            </TouchableOpacity>
          )}
          
          {currentPage < 3 ? (
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={[
                styles.submitButton, 
                loading && styles.submitButtonDisabled,
                !termsAccepted && styles.submitButtonDisabled
              ]} 
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={[
                styles.submitButtonText,
                !termsAccepted && styles.submitButtonTextDisabled
              ]}>
                {loading ? 'Submitting...' : 'Join Community'}
              </Text>
            </TouchableOpacity>
          )}
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
  progressContainer: {
    paddingHorizontal: moderateScale(20),
    paddingVertical: moderateScale(15),
    backgroundColor: AppColors.white,
  },
  progressBar: {
    height: moderateScale(8),
    backgroundColor: AppColors.lightGray,
    borderRadius: moderateScale(4),
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: AppColors.teal,
    borderRadius: moderateScale(4),
  },
  progressText: {
    textAlign: 'center',
    marginTop: moderateScale(8),
    fontSize: moderateScale(14),
    color: AppColors.gray,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    padding: moderateScale(20),
  },
  pageTitle: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    color: AppColors.black,
    marginBottom: moderateScale(20),
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: moderateScale(20),
  },
  label: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: AppColors.black,
    marginBottom: moderateScale(8),
  },
  input: {
    backgroundColor: AppColors.white,
    borderRadius: moderateScale(10),
    paddingHorizontal: moderateScale(15),
    paddingVertical: moderateScale(12),
    fontSize: moderateScale(14),
    color: AppColors.black,
    borderWidth: moderateScale(1),
    borderColor: AppColors.lightGray,
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
  helpText: {
    fontSize: moderateScale(12),
    color: AppColors.gray,
    marginTop: moderateScale(5),
    fontStyle: 'italic',
  },
  termsContainer: {
    marginTop: moderateScale(20),
    marginBottom: moderateScale(10),
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: moderateScale(20),
    height: moderateScale(20),
    borderWidth: moderateScale(2),
    borderColor: AppColors.teal,
    borderRadius: moderateScale(3),
    marginRight: moderateScale(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: AppColors.teal,
  },
  checkmark: {
    color: AppColors.white,
    fontSize: moderateScale(12),
    fontWeight: 'bold',
  },
  termsText: {
    flex: 1,
    fontSize: moderateScale(14),
    color: AppColors.black,
  },
  termsLink: {
    color: AppColors.teal,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  termsError: {
    color: AppColors.red,
    fontSize: moderateScale(12),
    marginTop: moderateScale(5),
    marginLeft: moderateScale(30),
    fontStyle: 'italic',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: moderateScale(20),
    paddingBottom: moderateScale(40),
    marginTop: moderateScale(20),
  },
  previousButton: {
    backgroundColor: AppColors.lightGray,
    borderRadius: moderateScale(25),
    paddingVertical: moderateScale(12),
    paddingHorizontal: moderateScale(30),
  },
  previousButtonText: {
    color: AppColors.black,
    fontSize: moderateScale(16),
    fontWeight: '600',
  },
  nextButton: {
    backgroundColor: AppColors.teal,
    borderRadius: moderateScale(25),
    paddingVertical: moderateScale(12),
    paddingHorizontal: moderateScale(30),
    marginLeft: 'auto',
  },
  nextButtonText: {
    color: AppColors.white,
    fontSize: moderateScale(16),
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: AppColors.teal,
    borderRadius: moderateScale(25),
    paddingVertical: moderateScale(15),
    paddingHorizontal: moderateScale(30),
    marginLeft: 'auto',
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
  submitButtonTextDisabled: {
    color: AppColors.lightGray,
  },
});

export default JoinCommunityScreen;