// Screen: Gender Selection
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {
  useNavigation,
  useRoute,
  NavigationProp,
} from '@react-navigation/native';
import {AppColors} from './constants';
import {BackIcon} from './components/OccasionIcons';
import {useOccasion} from '@app/contexts/OccasionContext';
import OccasionApiService from '@app/services/occasionApi';
export const GenderSelectionScreen = () => {
  const navigation = useNavigation<NavigationProp<any>>();
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

  const [selectedGender, setSelectedGender] = useState<{
    value: string;
    count: number;
    icon: string;
    label: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [genderCounts, setGenderCounts] = useState<{
    male: number;
    female: number;
    all: number;
  }>({male: 0, female: 0, all: 0});

  const genderOptions = [
    {value: 'male', label: 'Male', icon: '👨', count: genderCounts.male},
    {value: 'female', label: 'Female', icon: '👩', count: genderCounts.female},
    {value: '', label: 'Other', icon: '👥', count: genderCounts.all},
  ];

  useEffect(() => {
    fetchGenderCounts();
  }, []);

  const fetchGenderCounts = async () => {
    try {
      setLoading(true);

      // Fetch counts for each gender option
      const [maleResponse, femaleResponse, allResponse] = await Promise.all([
        OccasionApiService.fetchOccasions(
          occasionType,
          categoryId,
          gotra,
          subGotra,
          'male',
        ),
        OccasionApiService.fetchOccasions(
          occasionType,
          categoryId,
          gotra,
          subGotra,
          'female',
        ),
        OccasionApiService.fetchOccasions(
          occasionType,
          categoryId,
          gotra,
          subGotra,
          'not specified',
        ),
      ]);

      // Count total items (contents) not just occasions
      const maleItemsCount = maleResponse.data.reduce(
        (total, occasion) => total + occasion.contents.length,
        0,
      );
      const femaleItemsCount = femaleResponse.data.reduce(
        (total, occasion) => total + occasion.contents.length,
        0,
      );
      const allItemsCount = allResponse.data.reduce(
        (total, occasion) => total + occasion.contents.length,
        0,
      );

      setGenderCounts({
        male: maleItemsCount,
        female: femaleItemsCount,
        all: allItemsCount,
      });
    } catch (error) {
      console.error('Error fetching gender counts:', error);
      Alert.alert('Error', 'Failed to load content counts');
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = async () => {
    // Save gender to context (convert empty string to null)
    setContextGender(selectedGender?.value || null);

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
    } catch (error) {
      console.error('Error fetching occasions:', error);
      Alert.alert('Error', 'Failed to load content');
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

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}>
        <View style={styles.content}>
          {/* Active Filters Display */}
          <View style={styles.filtersContainer}>
            <Text style={styles.filtersTitle}>Active Filters:</Text>
            <View style={styles.filterTags}>
              <View style={styles.filterTag}>
                <Text style={styles.filterTagText}>Type: {occasionType}</Text>
              </View>
              {categoryName && (
                <View style={styles.filterTag}>
                  <Text style={styles.filterTagText}>
                    Category: {categoryName}
                  </Text>
                </View>
              )}
              {gotra && (
                <View style={styles.filterTag}>
                  <Text style={styles.filterTagText}>Gotra: {gotra}</Text>
                </View>
              )}
              {subGotra && (
                <View style={styles.filterTag}>
                  <Text style={styles.filterTagText}>Sub-Gotra: {subGotra}</Text>
                </View>
              )}
            </View>
          </View>

          <Text style={styles.sectionTitle}>Select Gender</Text>
          <Text style={styles.sectionDescription}>
            Choose the gender to view relevant content
          </Text>

          <View style={styles.optionsContainer}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={AppColors.primary} />
                <Text style={styles.loadingText}>
                  Loading content counts...
                </Text>
              </View>
            ) : (
              genderOptions.map(option => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.optionCard,
                    selectedGender?.value === option.value &&
                      styles.optionCardSelected,
                  ]}
                  onPress={() => setSelectedGender(option)}
                  activeOpacity={0.7}>
                  <Text style={styles.optionIcon}>{option.icon}</Text>
                  <View style={styles.optionContent}>
                    <Text
                      style={[
                        styles.optionLabel,
                        selectedGender?.value === option.value &&
                          styles.optionLabelSelected,
                      ]}>
                      {option.label}
                    </Text>
                    <Text style={styles.optionCount}>
                      {option.count} {option.count === 1 ? 'item' : 'items'}{' '}
                      available
                    </Text>
                  </View>
                  {selectedGender?.value === option.value && (
                    <View style={styles.checkmark}>
                      <Text style={styles.checkmarkText}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))
            )}
          </View>

          <TouchableOpacity
            style={[
              styles.continueButton,
              (!selectedGender?.count || loading) &&
                styles.continueButtonDisabled,
            ]}
            onPress={handleContinue}
            disabled={!selectedGender?.count || loading}
            activeOpacity={0.8}>
            <Text style={styles.continueButtonText}>View Content</Text>
          </TouchableOpacity>

          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              💡 Tip: Content counts show available items for each gender
              option. Select "All" to view content for both male and female.
            </Text>
          </View>
        </View>
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  content: {
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
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: AppColors.gray,
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
  optionContent: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: AppColors.dark,
    marginBottom: 4,
  },
  optionCount: {
    fontSize: 14,
    color: AppColors.gray,
    fontWeight: '500',
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
  filtersContainer: {
    backgroundColor: AppColors.white,
    padding: 16,
    marginBottom: 20,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: AppColors.primary,
  },
  filtersTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.dark,
    marginBottom: 8,
  },
  filterTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterTag: {
    backgroundColor: AppColors.lightGray,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AppColors.primary,
  },
  filterTagText: {
    fontSize: 12,
    color: AppColors.dark,
    fontWeight: '500',
  },
});
