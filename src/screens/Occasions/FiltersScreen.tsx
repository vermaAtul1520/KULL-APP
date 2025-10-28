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
  Platform,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Picker} from '@react-native-picker/picker';
import {AppColors} from './constants';
import {BackIcon} from './components/OccasionIcons';
import {useConfiguration, GotraData} from '@app/hooks/ConfigContext';
import {useOccasion} from '@app/contexts/OccasionContext';

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
  const {setGotraFilters, filters} = useOccasion();

  // Debug logging for production builds
  console.log('FiltersScreen - gotraData:', gotraData);
  console.log('FiltersScreen - gotraData length:', gotraData.length);

  const [selectedGotra, setSelectedGotra] = useState(filters.gotra || '');
  const [selectedSubGotra, setSelectedSubGotra] = useState(
    filters.subGotra || '',
  );
  const [subGotras, setSubGotras] = useState<string[]>([]);

  // Initialize sub-gotras on component mount if gotra is already selected
  useEffect(() => {
    if (filters.gotra && gotraData.length > 0) {
      const gotraObj = gotraData.find(g => g.name === filters.gotra);
      setSubGotras(gotraObj?.subgotra || []);
    }
  }, [gotraData, filters.gotra]);

  useEffect(() => {
    // Update sub-gotras when gotra changes
    if (selectedGotra) {
      const gotraObj = gotraData.find(g => g.name === selectedGotra);
      setSubGotras(gotraObj?.subgotra || []);
      // Only reset sub-gotra if it's a new selection (not from existing filters)
      if (selectedGotra !== filters.gotra) {
        setSelectedSubGotra('');
      }
    } else {
      setSubGotras([]);
      setSelectedSubGotra('');
    }
  }, [selectedGotra, gotraData, filters.gotra]);

  const handleContinue = () => {
    // Save gotra filters to context (convert empty strings to null)
    setGotraFilters(selectedGotra || null, selectedSubGotra || null);

    // Navigate to Gender selection screen
    (navigation as any).navigate('OccasionGenderSelection', {
      occasionType,
      categoryId,
      categoryName,
      gotra: selectedGotra,
      subGotra: selectedSubGotra,
    });
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
          <Text style={styles.headerTitle}>Filters</Text>
          <Text style={styles.headerSubtitle}>{categoryName}</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Select Gotra & Sub-Gotra</Text>
          <Text style={styles.sectionDescription}>
            Select your gotra and sub-gotra to refine your search
          </Text>

          {/* Debug info for production builds */}
          {__DEV__ && (
            <Text style={styles.debugText}>
              Debug: Gotra data loaded: {gotraData.length} items
            </Text>
          )}

          {/* Show message if no gotra data is available */}
          {gotraData.length === 0 && (
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                Gotra data is loading... If this persists, please check your
                internet connection and try again.
              </Text>
            </View>
          )}

          {/* Gotra Picker */}
          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Gotra</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={selectedGotra}
                onValueChange={value => setSelectedGotra(value)}
                style={[
                  styles.picker,
                  {backgroundColor: AppColors.white},
                  Platform.OS === 'android' && {
                    color: AppColors.dark,
                    backgroundColor: AppColors.white,
                  },
                ]}
                mode={Platform.OS === 'ios' ? 'dropdown' : 'dropdown'}
                dropdownIconColor={AppColors.primary}
                itemStyle={styles.pickerItem}>
                <Picker.Item
                  label="Select Gotra"
                  value=""
                  color={AppColors.gray}
                  style={{backgroundColor: AppColors.white}}
                />
                {gotraData.map(gotra => (
                  <Picker.Item
                    key={gotra.name}
                    label={gotra.name}
                    value={gotra.name}
                    color={AppColors.dark}
                    style={{backgroundColor: AppColors.white}}
                  />
                ))}
              </Picker>
            </View>
          </View>

          {/* Sub-Gotra Picker */}
          {selectedGotra && subGotras.length > 0 && (
            <View style={styles.pickerContainer}>
              <Text style={styles.label}>Sub-Gotra</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={selectedSubGotra}
                  onValueChange={value => setSelectedSubGotra(value)}
                  style={[
                    styles.picker,
                    {backgroundColor: AppColors.white},
                    Platform.OS === 'android' && {
                      color: AppColors.dark,
                      backgroundColor: AppColors.white,
                    },
                  ]}
                  mode={Platform.OS === 'ios' ? 'dropdown' : 'dropdown'}
                  dropdownIconColor={AppColors.primary}
                  itemStyle={styles.pickerItem}>
                  <Picker.Item
                    label="Select Sub-Gotra"
                    value=""
                    color={AppColors.gray}
                    style={{backgroundColor: AppColors.white}}
                  />
                  {subGotras.map(subGotra => (
                    <Picker.Item
                      key={subGotra}
                      label={subGotra}
                      value={subGotra}
                      color={AppColors.dark}
                      style={{backgroundColor: AppColors.white}}
                    />
                  ))}
                </Picker>
              </View>
            </View>
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
              💡 Tip: Select gotra and sub-gotra to get more relevant content
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
    elevation: 2, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    minHeight: 50,
  },
  picker: {
    height: 50,
    color: AppColors.dark,
    backgroundColor: AppColors.white, // Explicit background for production builds
    fontSize: 16, // Explicit font size
  },
  pickerItem: {
    fontSize: 16,
    color: AppColors.dark,
    height: 50,
    backgroundColor: AppColors.white, // Explicit background for production builds
    textAlign: 'left', // Explicit text alignment
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
  debugText: {
    fontSize: 12,
    color: AppColors.gray,
    fontStyle: 'italic',
    marginBottom: 10,
  },
});
