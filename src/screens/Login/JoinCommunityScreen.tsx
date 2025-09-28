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
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { moderateScale } from '@app/constants/scaleUtils';
import { BASE_URL } from '@app/constants/constant';
import { getCommunityId } from '@app/constants/apiUtils';
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

interface GotraOption {
  name: string;
  subgotra: string[];
}

interface GotraResponse {
  success: boolean;
  data: {
    gotra: GotraOption[];
  };
}

interface JoinFormData {
  name: string;
  lastName: string;
  gotra: string;
  subGotra: string;
  fatherName: string;
  maritalStatus: string;
  phoneNumber: string;
  email: string;
  profession: string;
  bloodGroup: string;
  age: string;
  dob: string;
  referralCode: string;
  profileImage: string;
  password: string;
  confirmPassword: string;
}

const JoinCommunityScreen: React.FC = () => {
  const navigation = useNavigation();
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [ageOrDob, setAgeOrDob] = useState<'age' | 'dob'>('age');
  const [gotraOptions, setGotraOptions] = useState<GotraOption[]>([]);
  const [loadingGotra, setLoadingGotra] = useState(false);
  const [referralCodeVerified, setReferralCodeVerified] = useState(false);
  
  const [formData, setFormData] = useState<JoinFormData>({
    name: '',
    lastName: '',
    gotra: '',
    subGotra: '',
    fatherName: '',
    maritalStatus: 'single',
    phoneNumber: '',
    email: '',
    profession: '',
    bloodGroup: '',
    age: '',
    dob: '',
    referralCode: '',
    profileImage: '',
    password: '',
    confirmPassword: '',
  });

  const updateFormData = (field: keyof JoinFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const fetchGotraOptions = async (referralCode: string) => {
    if (!referralCode.trim()) {
      Alert.alert('Error', 'Please enter a referral code');
      return;
    }

    setLoadingGotra(true);
    try {
      const communityId = await getCommunityId();
      const response = await fetch(`${BASE_URL}/api/communities/${communityId}/gotraDetail`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result: GotraResponse = await response.json();


      if (result.success && result.data.gotra) {
        setGotraOptions(result.data.gotra);
        setReferralCodeVerified(true);
        Alert.alert('Success', 'Referral code verified! Please continue with your details.');
      } else {
        Alert.alert('Error', 'Invalid referral code or failed to fetch gotra details');
        setReferralCodeVerified(false);
        setGotraOptions([]);
      }
    } catch (error) {
      console.error('API Error:', error);
      Alert.alert('Error', 'Network error. Please try again.');
      setReferralCodeVerified(false);
      setGotraOptions([]);
    } finally {
      setLoadingGotra(false);
    }
  };

  // Define required fields for each page
  const getRequiredFieldsForPage = (page: number) => {
    switch (page) {
      case 1:
        if (!referralCodeVerified) {
          return ['referralCode'];
        }
        return ['referralCode', 'name', 'lastName', 'gotra', 'subGotra', 'fatherName'];
      case 2:
        return ['maritalStatus', 'phoneNumber', 'email', 'profession', 'password', 'confirmPassword'];
      case 3:
        return ageOrDob === 'age' ? ['age'] : ['dob'];
      default:
        return [];
    }
  };

  const validateCurrentPage = async () => {
    // Special handling for page 1 referral code verification
    if (currentPage === 1 && !referralCodeVerified) {
      if (!formData.referralCode.trim()) {
        Alert.alert('Error', 'Please enter a referral code');
        return false;
      }
      await fetchGotraOptions(formData.referralCode);
      return false; // Stay on the same page after verification
    }

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

  const handleNext = async () => {
    if (await validateCurrentPage()) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentPage(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!(await validateCurrentPage())) {
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
        password: formData.password,
        gender: 'not specified',
        occupation: formData.profession,
        religion: 'Hindu',
        motherTongue: 'Hindi',
        interests: ['community participation'],
        gotra: formData.gotra,
        subGotra: formData.subGotra,
        fatherName: formData.fatherName,
        maritalStatus: formData.maritalStatus,
        bloodGroup: formData.bloodGroup,
        age: ageOrDob === 'age' ? parseInt(formData.age) : undefined,
        dateOfBirth: ageOrDob === 'dob' ? formData.dob : undefined,
        referral: formData.referralCode,
        requestType: 'join_community',
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
        <View style={styles.referralContainer}>
          <TextInput
            style={[styles.input, styles.referralInput, referralCodeVerified && styles.inputVerified]}
            value={formData.referralCode}
            onChangeText={(value) => updateFormData('referralCode', value)}
            placeholder="Enter referral code from community member"
            placeholderTextColor={AppColors.gray}
            editable={!referralCodeVerified}
          />
          {referralCodeVerified && (
            <View style={styles.verifiedIcon}>
              <Text style={styles.verifiedText}>✓</Text>
            </View>
          )}
        </View>
        <Text style={styles.helpText}>
          {referralCodeVerified
            ? 'Referral code verified successfully! Please fill in your details below.'
            : 'Enter your referral code and click "Verify Code" below to continue'
          }
        </Text>
        {loadingGotra && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={AppColors.teal} />
            <Text style={styles.loadingText}>Verifying referral code...</Text>
          </View>
        )}
      </View>

      {/* Show remaining fields only after referral code verification */}
      {referralCodeVerified && (
        <>
          {/* Profile Image */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Profile Photo (Optional)</Text>
            <ImagePickerComponent
              onImageSelected={(imageUrl) => updateFormData('profileImage', imageUrl)}
              currentImage={formData.profileImage}
              size={100}
            />
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
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.gotra}
                onValueChange={(value) => {
                  updateFormData('gotra', value);
                  updateFormData('subGotra', ''); // Reset subgotra when gotra changes
                }}
                style={styles.picker}
              >
                <Picker.Item label="Select your gotra" value="" />
                {gotraOptions.map((gotra) => (
                  <Picker.Item
                    key={gotra.name}
                    label={gotra.name}
                    value={gotra.name}
                  />
                ))}
              </Picker>
            </View>
          </View>

          {/* Sub Gotra */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Sub Gotra *</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.subGotra}
                onValueChange={(value) => updateFormData('subGotra', value)}
                style={styles.picker}
                enabled={!!formData.gotra}
              >
                <Picker.Item label="Select your sub gotra" value="" />
                {formData.gotra &&
                  gotraOptions
                    .find(gotra => gotra.name === formData.gotra)
                    ?.subgotra.map((subGotra) => (
                      <Picker.Item
                        key={subGotra}
                        label={subGotra}
                        value={subGotra}
                      />
                    ))}
              </Picker>
            </View>
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
        </>
      )}
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
              <Text style={styles.nextButtonText}>
                {currentPage === 1 && !referralCodeVerified ? 'Verify Code' : 'Next'}
              </Text>
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
  referralContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  referralInput: {
    flex: 1,
    marginRight: moderateScale(10),
  },
  inputVerified: {
    backgroundColor: AppColors.lightGray,
    borderColor: AppColors.green,
  },
  verifiedIcon: {
    backgroundColor: AppColors.green,
    width: moderateScale(30),
    height: moderateScale(30),
    borderRadius: moderateScale(15),
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: moderateScale(10),
  },
  verifiedText: {
    color: AppColors.white,
    fontSize: moderateScale(16),
    fontWeight: 'bold',
  },
  errorText: {
    color: AppColors.red,
    fontSize: moderateScale(12),
    marginTop: moderateScale(5),
    fontStyle: 'italic',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: moderateScale(10),
    paddingHorizontal: moderateScale(10),
  },
  loadingText: {
    marginLeft: moderateScale(8),
    fontSize: moderateScale(14),
    color: AppColors.teal,
    fontWeight: '500',
  },
});

export default JoinCommunityScreen;