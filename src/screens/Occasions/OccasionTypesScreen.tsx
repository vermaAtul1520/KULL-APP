// Screen 1: Occasion Types Selection
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { OCCASION_TYPES, AppColors } from './constants';
import { FamilyIcon, BabyIcon, BoysMarriageIcon, GirlsMarriageIcon, DeathIcon, BackIcon } from './components/OccasionIcons';

const OCCASION_DATA = [
  {
    type: 'Family Deities',
    icon: FamilyIcon,
    description: 'Family deity worship and rituals',
    color: AppColors.warning,
  },
  {
    type: 'Birth Details / Naming',
    icon: BabyIcon,
    description: 'Birth ceremonies and naming rituals',
    color: AppColors.blue,
  },
  {
    type: 'Boys Marriage',
    icon: BoysMarriageIcon,
    description: 'Male marriage ceremonies and rituals',
    color: AppColors.orange,
  },
  {
    type: 'Girls Marriage',
    icon: GirlsMarriageIcon,
    description: 'Female marriage ceremonies and rituals',
    color: AppColors.purple,
  },
  {
    type: 'Death Details',
    icon: DeathIcon,
    description: 'Death rituals and last rites',
    color: AppColors.gray,
  },
];

export const OccasionTypesScreen = () => {
  const navigation = useNavigation();

  const handleSelectType = (occasionType: string) => {
    navigation.navigate('OccasionCategories', { occasionType });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={AppColors.primary} barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <BackIcon size={24} color={AppColors.white} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Occasions</Text>
          <Text style={styles.headerSubtitle}>Choose a category to explore</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.cardsContainer}>
          {OCCASION_DATA.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <TouchableOpacity
                key={index}
                style={[styles.card, { borderLeftColor: item.color }]}
                onPress={() => handleSelectType(item.type)}
                activeOpacity={0.8}
              >
                <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
                  <IconComponent size={40} color={AppColors.white} />
                </View>

                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{item.type}</Text>
                  <Text style={styles.cardDescription}>{item.description}</Text>
                </View>

                <View style={styles.chevron}>
                  <Text style={styles.chevronText}>›</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Select a category above to explore religious ceremonies and rituals
          </Text>
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
    shadowOffset: { width: 0, height: 2 },
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
    fontSize: 13,
    color: AppColors.gray,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
