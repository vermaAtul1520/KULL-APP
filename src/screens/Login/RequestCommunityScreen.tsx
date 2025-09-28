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
import { BASE_URL } from '@app/constants/constant';
import ImagePickerComponent from '@app/components/ImagePicker';

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
  subGotra: string;
  profileImage: string;
  password: string;
  confirmPassword: string;
}

const RequestCommunityScreen: React.FC = () => {
  const navigation = useNavigation();
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  
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
    subGotra: '',
    profileImage: '',
    password: '',
    confirmPassword: '',
  });

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Define required fields for each page
  const getRequiredFieldsForPage = (page: number) => {
    switch (page) {
      case 1:
        return ['cast', 'cGotNo', 'name', 'position', 'fatherName'];
      case 2:
        return ['address', 'pinCode', 'phoneNo', 'email', 'profession', 'password', 'confirmPassword'];
      case 3:
        return ['estimatedMembers', 'thoughtOfMaking', 'gotra', 'subGotra'];
      default:
        return [];
    }
  };

  const validateCurrentPage = () => {
    const requiredFields = getRequiredFieldsForPage(currentPage);
    const missingFields = requiredFields.filter(field => !formData[field as keyof FormData]);
    
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

      if (formData.phoneNo.length !== 10) {
        Alert.alert('Error', 'Please enter a valid 10-digit phone number');
        return false;
      }

      // Password validation - simplified (only check length > 3)
      if (formData.password.length <= 3) {
        Alert.alert('Error', 'Password must be greater than 3 characters');
        return false;
      }

      // Commented out hard password rules for now
      // const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
      // if (!passwordRegex.test(formData.password)) {
      //   Alert.alert('Error', 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character');
      //   return false;
      // }

      if (formData.password !== formData.confirmPassword) {
        Alert.alert('Error', 'Passwords do not match');
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
        'You must accept the Terms & Conditions before submitting your community request. Please tick the checkbox to proceed.',
        [{ text: 'OK' }]
      );
      return;
    }

    setLoading(true);

    try {
      const payload = {
        firstName: formData.name.split(' ')[0],
        lastName: formData.name.split(' ').slice(1).join(' ') || formData.name,
        email: formData.email,
        phone: `+91${formData.phoneNo}`,
        password: formData.password,
        gender: 'not specified',
        occupation: formData.profession,
        religion: 'Hindu',
        motherTongue: 'Hindi',
        interests: ['community building'],
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
        subGotra: formData.subGotra,
        requestType: 'community_request',
        profileImage: formData.profileImage || undefined
      };

      const response = await fetch(`${BASE_URL}/api/auth/signup`, {
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

  const renderPage1 = () => (
    <View style={styles.formContainer}>
      <Text style={styles.pageTitle}>Basic Information</Text>

      {/* Profile Image */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Profile Photo (Optional)</Text>
        <ImagePickerComponent
          onImageSelected={(imageUrl) => updateFormData('profileImage', imageUrl)}
          currentImage={formData.profileImage}
          size={100}
        />
      </View>

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
      <Text style={styles.pageTitle}>Contact Information</Text>
      
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

      {/* Password */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Password *</Text>
        <TextInput
          style={styles.input}
          value={formData.password}
          onChangeText={(value) => updateFormData('password', value)}
          placeholder="Create a strong password"
          placeholderTextColor={AppColors.gray}
          secureTextEntry={true}
        />
        <Text style={styles.helpText}>
          Password must be greater than 3 characters
        </Text>
      </View>

      {/* Confirm Password */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Confirm Password *</Text>
        <TextInput
          style={styles.input}
          value={formData.confirmPassword}
          onChangeText={(value) => updateFormData('confirmPassword', value)}
          placeholder="Confirm your password"
          placeholderTextColor={AppColors.gray}
          secureTextEntry={true}
        />
        {formData.confirmPassword && formData.password !== formData.confirmPassword && (
          <Text style={styles.errorText}>Passwords do not match</Text>
        )}
      </View>
    </View>
  );

  const renderPage3 = () => (
    <View style={styles.formContainer}>
      <Text style={styles.pageTitle}>Community Details</Text>
      
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

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Sub Gotra *</Text>
        <TextInput
          style={styles.input}
          value={formData.subGotra}
          onChangeText={(value) => updateFormData('subGotra', value)}
          placeholder="Enter your sub gotra"
          placeholderTextColor={AppColors.gray}
        />
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
        <Text style={styles.headerTitle}>Request Community</Text>
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
                {loading ? 'Submitting...' : 'Submit Request'}
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
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: AppColors.white,
  },
  progressBar: {
    height: 8,
    backgroundColor: AppColors.lightGray,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: AppColors.teal,
    borderRadius: 4,
  },
  progressText: {
    textAlign: 'center',
    marginTop: 8,
    fontSize: 14,
    color: AppColors.gray,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    padding: 20,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: AppColors.black,
    marginBottom: 20,
    textAlign: 'center',
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
  termsContainer: {
    marginTop: 20,
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: AppColors.teal,
    borderRadius: 3,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: AppColors.teal,
  },
  checkmark: {
    color: AppColors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    color: AppColors.black,
  },
  termsLink: {
    color: AppColors.teal,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  termsError: {
    color: AppColors.red,
    fontSize: 12,
    marginTop: 5,
    marginLeft: 30,
    fontStyle: 'italic',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 40,
    marginTop: 20,
  },
  previousButton: {
    backgroundColor: AppColors.lightGray,
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
  previousButtonText: {
    color: AppColors.black,
    fontSize: 16,
    fontWeight: '600',
  },
  nextButton: {
    backgroundColor: AppColors.teal,
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 30,
    marginLeft: 'auto',
  },
  nextButtonText: {
    color: AppColors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: AppColors.teal,
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginLeft: 'auto',
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
  submitButtonTextDisabled: {
    color: AppColors.lightGray,
  },
  helpText: {
    fontSize: 12,
    color: AppColors.gray,
    marginTop: 5,
    fontStyle: 'italic',
  },
  errorText: {
    color: AppColors.red,
    fontSize: 12,
    marginTop: 5,
    fontStyle: 'italic',
  },
});

export default RequestCommunityScreen;