// Screen: Gender Selection
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {AppColors} from './constants';
import {BackIcon} from './components/OccasionIcons';
import {useOccasion} from '@app/contexts/OccasionContext';
import OccasionApiService from '@app/services/occasionApi'; // <-- Import OccasionApiService
export const GenderSelectionScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {occasionType, categoryId, categoryName, gotra, subGotra} =
    route.params as {
      occasionType: string;
      categoryId: string | null;
      categoryName: string | null;
      gotra?: string;
      subGotra?: string;
    };

  const {setGender: setContextGender, setOccasions, filters} = useOccasion();

  const [selectedGender, setSelectedGender] = useState<string>('');

  const genderOptions = [
    {value: 'male', label: 'Male', icon: '👨'},
    {value: 'female', label: 'Female', icon: '👩'},
    {value: '', label: 'All', icon: '👥'},
  ];

  const handleContinue = async () => {
    // Save gender to context (convert empty string to null)
    setContextGender(selectedGender || null);

    // Navigate to Content screen
    await fetchOccasions();
    navigation.navigate('OccasionContent', {
      occasionType,
      categoryId,
      categoryName,
      gotra,
      subGotra,
    });
  };

  const fetchOccasions = async () => {
    try {
      // Use filters from context - pass non-null values to API
      const response = await OccasionApiService.fetchOccasions(
        filters.occasionType!, // Required - will always be set
        filters.categoryId, // Can be null
        filters.gotra || undefined, // Convert null to undefined for optional param
        filters.subGotra || undefined, // Convert null to undefined for optional param
        filters.gender || undefined, // Convert null to undefined for optional param
      );

      setOccasions(response.data);
      console.log('Fetched occasions:', response.data);
    } catch (error) {
      console.error('Error fetching occasions:', error);
      Alert.alert('Error', error.message || 'Failed to load content');
    } finally {
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={AppColors.primary} barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <BackIcon size={24} color={AppColors.white} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Gender Selection</Text>
          <Text style={styles.headerSubtitle}>
            {categoryName || occasionType}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Select Gender</Text>
        <Text style={styles.sectionDescription}>
          Choose the gender to view relevant content
        </Text>

        <View style={styles.optionsContainer}>
          {genderOptions.map(option => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.optionCard,
                selectedGender === option.value && styles.optionCardSelected,
              ]}
              onPress={() => setSelectedGender(option.value)}
              activeOpacity={0.7}>
              <Text style={styles.optionIcon}>{option.icon}</Text>
              <Text
                style={[
                  styles.optionLabel,
                  selectedGender === option.value && styles.optionLabelSelected,
                ]}>
                {option.label}
              </Text>
              {selectedGender === option.value && (
                <View style={styles.checkmark}>
                  <Text style={styles.checkmarkText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[
            styles.continueButton,
            !selectedGender && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={!selectedGender}
          activeOpacity={0.8}>
          <Text style={styles.continueButtonText}>View Content</Text>
        </TouchableOpacity>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            💡 Tip: Select "All" to view content for both male and female
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.lightGray,
  },
  header: {
    backgroundColor: AppColors.primary,
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 15,
    padding: 5,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: AppColors.white,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: AppColors.white,
    opacity: 0.9,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: AppColors.dark,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: AppColors.gray,
    marginBottom: 32,
    lineHeight: 20,
  },
  optionsContainer: {
    marginBottom: 32,
  },
  optionCard: {
    backgroundColor: AppColors.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: AppColors.border,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  optionCardSelected: {
    borderColor: AppColors.primary,
    backgroundColor: AppColors.primary + '10',
  },
  optionIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  optionLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: AppColors.dark,
    flex: 1,
  },
  optionLabelSelected: {
    color: AppColors.primary,
  },
  checkmark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: AppColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: AppColors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  continueButton: {
    backgroundColor: AppColors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: AppColors.gray,
    opacity: 0.5,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.white,
  },
  infoBox: {
    marginTop: 24,
    padding: 16,
    backgroundColor: AppColors.cream,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: AppColors.warning,
  },
  infoText: {
    fontSize: 14,
    color: AppColors.dark,
    lineHeight: 20,
  },
});
