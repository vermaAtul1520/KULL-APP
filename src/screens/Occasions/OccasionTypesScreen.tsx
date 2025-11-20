// Screen 1: Occasion Types Selection
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {AppColors} from './constants';
import {BackIcon} from './components/OccasionIcons';
import {useOccasion} from '@app/contexts/OccasionContext';

type NavigationProp = {
  navigate: (screen: string, params?: any) => void;
  goBack: () => void;
};

const OCCASION_DATA = [
  {
    type: 'Family Deities',
    description: 'Family deity worship and rituals',
    color: AppColors.warning,
  },
  {
    type: 'Birth Details / Naming',
    description: 'Birth ceremonies and naming rituals',
    color: AppColors.blue,
  },
  {
    type: 'Boys Marriage',
    description: 'Male marriage ceremonies and rituals',
    color: AppColors.orange,
  },
  {
    type: 'Girls Marriage',
    description: 'Female marriage ceremonies and rituals',
    color: AppColors.purple,
  },
  {
    type: 'Death Details',
    description: 'Death rituals and last rites',
    color: AppColors.gray,
  },
];

export const OccasionTypesScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const {setOccasionType} = useOccasion();

  const handleSelectType = (occasionType: string) => {
    setOccasionType(occasionType);
    navigation.navigate('OccasionCategories', {occasionType});
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
          <Text style={styles.headerTitle}>Occasions</Text>
          <Text style={styles.headerSubtitle}>
            Choose a category to explore
          </Text>
        </View>
      </View>

      <FlatList
        data={OCCASION_DATA}
        keyExtractor={item => item.type}
        renderItem={({item}) => (
          <TouchableOpacity
            style={[styles.occasionCard, {borderLeftColor: item.color}]}
            onPress={() => handleSelectType(item.type)}
            activeOpacity={0.8}>
            <View style={styles.occasionContent}>
              <View style={styles.occasionHeader}>
                <Text style={styles.occasionType}>{item.type}</Text>
                <View
                  style={[styles.colorIndicator, {backgroundColor: item.color}]}
                />
              </View>
              <Text style={styles.occasionDescription}>{item.description}</Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
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
  cardsContainer: {
    padding: 15,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: AppColors.white,
    marginBottom: 16,
    borderRadius: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  iconContainer: {
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
    padding: 16,
    paddingLeft: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: AppColors.dark,
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 13,
    color: AppColors.gray,
    lineHeight: 18,
  },
  chevron: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 20,
  },
  chevronText: {
    fontSize: 30,
    color: AppColors.gray,
  },
  footer: {
    padding: 20,
    paddingBottom: 30,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: AppColors.gray,
    textAlign: 'center',
    lineHeight: 20,
  },
  listContainer: {
    padding: 16,
  },
  occasionCard: {
    backgroundColor: AppColors.white,
    marginBottom: 16,
    borderRadius: 12,
    padding: 20,
    elevation: 3,
    shadowColor: AppColors.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 4,
  },
  occasionContent: {
    flex: 1,
  },
  occasionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  occasionType: {
    fontSize: 18,
    fontWeight: 'bold',
    color: AppColors.dark,
    flex: 1,
  },
  colorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  occasionDescription: {
    fontSize: 14,
    color: AppColors.gray,
    lineHeight: 20,
  },
  occasionCategory: {
    fontSize: 14,
    color: AppColors.gray,
    fontStyle: 'italic',
  },
  occasionDetails: {
    marginBottom: 12,
  },
  occasionGotra: {
    fontSize: 14,
    color: AppColors.dark,
    marginBottom: 4,
  },
  occasionSubGotra: {
    fontSize: 14,
    color: AppColors.dark,
    marginBottom: 4,
  },
  occasionGender: {
    fontSize: 14,
    color: AppColors.dark,
  },
  occasionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contentCount: {
    fontSize: 12,
    color: AppColors.gray,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: AppColors.dark,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 13,
    color: AppColors.gray,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
