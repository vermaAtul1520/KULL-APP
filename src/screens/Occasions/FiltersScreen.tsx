// Screen 3: Gotra/Sub-Gotra Filters
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Picker} from '@react-native-picker/picker';
import {AppColors} from './constants';
import {BackIcon} from './components/OccasionIcons';
import {useConfiguration, GotraData} from '@app/hooks/ConfigContext';
import {useOccasion} from '@app/contexts/OccasionContext';
import {OccasionApiService, Occasion} from '@app/services/occasionApi';

export const FiltersScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {occasionType, categoryId, categoryName} = route.params as {
    occasionType: string;
    categoryId: string;
    categoryName: string;
  };

  // Get gotra data from ConfigContext
  const {gotraData} = useConfiguration();
  const {setGotraFilters} = useOccasion();

  const [selectedGotra, setSelectedGotra] = useState('');
  const [selectedSubGotra, setSelectedSubGotra] = useState('');
  const [subGotras, setSubGotras] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [availableGotras, setAvailableGotras] = useState<string[]>([]);
  const [availableSubGotras, setAvailableSubGotras] = useState<{[key: string]: string[]}>({});

  // Fetch available occasions to determine which gotras/subgotras have data
  useEffect(() => {
    fetchAvailableFilters();
  }, [categoryId]);

  const fetchAvailableFilters = async () => {
    try {
      setLoading(true);
      console.log('Fetching occasions for category:', categoryId);

      // Fetch all occasions for this category without filters
      const response = await OccasionApiService.fetchOccasions(
        occasionType,
        categoryId,
      );

      console.log('Fetched occasions:', response.data.length);
      console.log('Occasions data:', JSON.stringify(response.data, null, 2));

      // Extract unique gotras and subgotras from the occasions
      const gotrasSet = new Set<string>();
      const subGotrasMap: {[key: string]: Set<string>} = {};

      response.data.forEach((occasion: Occasion) => {
        if (occasion.gotra) {
          gotrasSet.add(occasion.gotra);

          if (occasion.subGotra) {
            if (!subGotrasMap[occasion.gotra]) {
              subGotrasMap[occasion.gotra] = new Set<string>();
            }
            subGotrasMap[occasion.gotra].add(occasion.subGotra);
          }
        }
      });

      const gotras = Array.from(gotrasSet);
      const subGotrasObj: {[key: string]: string[]} = {};
      Object.keys(subGotrasMap).forEach(gotra => {
        subGotrasObj[gotra] = Array.from(subGotrasMap[gotra]);
      });

      console.log('Available gotras:', gotras);
      console.log('Available subgotras:', subGotrasObj);

      setAvailableGotras(gotras);
      setAvailableSubGotras(subGotrasObj);
    } catch (error) {
      console.error('Error fetching available filters:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Update sub-gotras when gotra changes
    if (selectedGotra) {
      // Use available subgotras from the occasions data
      const availableSubs = availableSubGotras[selectedGotra] || [];
      setSubGotras(availableSubs);
      setSelectedSubGotra(''); // Reset sub-gotra selection
    } else {
      setSubGotras([]);
      setSelectedSubGotra('');
    }
  }, [selectedGotra, availableSubGotras]);

  const handleContinue = () => {
    console.log('Continuing with filters:', {
      occasionType,
      categoryId,
      categoryName,
      gotra: selectedGotra,
      subGotra: selectedSubGotra,
    });

    // Save gotra filters to context (convert empty strings to null)
    setGotraFilters(selectedGotra || null, selectedSubGotra || null);

    // Navigate to Gender selection screen
    navigation.navigate('OccasionGenderSelection', {
      occasionType,
      categoryId,
      categoryName,
      gotra: selectedGotra,
      subGotra: selectedSubGotra,
    });
  };

  if (loading) {
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
            <Text style={styles.headerTitle}>Filters</Text>
            <Text style={styles.headerSubtitle}>{categoryName}</Text>
          </View>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={AppColors.primary} />
          <Text style={styles.loadingText}>Loading available filters...</Text>
        </View>
      </SafeAreaView>
    );
  }

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
          <Text style={styles.headerTitle}>Filters</Text>
          <Text style={styles.headerSubtitle}>{categoryName}</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
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
                  <Text style={styles.filterTagText}>Category: {categoryName}</Text>
                </View>
              )}
            </View>
          </View>

          <Text style={styles.sectionTitle}>Select Gotra & Sub-Gotra</Text>
          <Text style={styles.sectionDescription}>
            Only showing gotras with available content for this category
          </Text>

          {availableGotras.length === 0 ? (
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>
                No gotra-specific content available for this category.
              </Text>
              <Text style={styles.noDataSubtext}>
                You can continue to view all content.
              </Text>
            </View>
          ) : (
            <>
              {/* Gotra Picker */}
              <View style={styles.pickerContainer}>
                <Text style={styles.label}>
                  Gotra ({availableGotras.length} available)
                </Text>
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={selectedGotra}
                    onValueChange={value => setSelectedGotra(value)}
                    style={styles.picker}>
                    <Picker.Item label="All Gotras" value="" />
                    {availableGotras.map(gotra => (
                      <Picker.Item
                        key={gotra}
                        label={gotra}
                        value={gotra}
                      />
                    ))}
                  </Picker>
                </View>
              </View>

              {/* Sub-Gotra Picker */}
              {selectedGotra && subGotras.length > 0 && (
                <View style={styles.pickerContainer}>
                  <Text style={styles.label}>
                    Sub-Gotra ({subGotras.length} available)
                  </Text>
                  <View style={styles.pickerWrapper}>
                    <Picker
                      selectedValue={selectedSubGotra}
                      onValueChange={value => setSelectedSubGotra(value)}
                      style={styles.picker}>
                      <Picker.Item label="All Sub-Gotras" value="" />
                      {subGotras.map(subGotra => (
                        <Picker.Item
                          key={subGotra}
                          label={subGotra}
                          value={subGotra}
                        />
                      ))}
                    </Picker>
                  </View>
                </View>
              )}
            </>
          )}

          {/* Continue Button */}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[styles.button, styles.applyButton]}
              onPress={handleContinue}
              activeOpacity={0.8}>
              <Text style={styles.applyButtonText}>
                Continue to Gender Selection
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              💡 Tip: Filters show only options with available content
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
    marginBottom: 24,
    lineHeight: 20,
  },
  pickerContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.dark,
    marginBottom: 8,
  },
  pickerWrapper: {
    backgroundColor: AppColors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: AppColors.border,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    color: AppColors.dark,
  },
  buttonsContainer: {
    marginTop: 32,
    gap: 12,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyButton: {
    backgroundColor: AppColors.primary,
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.white,
  },
  skipButton: {
    backgroundColor: AppColors.white,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.gray,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: AppColors.gray,
  },
  noDataContainer: {
    padding: 24,
    backgroundColor: AppColors.white,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 16,
    color: AppColors.dark,
    textAlign: 'center',
    marginBottom: 8,
  },
  noDataSubtext: {
    fontSize: 14,
    color: AppColors.gray,
    textAlign: 'center',
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
