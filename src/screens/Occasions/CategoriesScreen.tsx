// Screen 2: Categories List (API-driven)
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
  RefreshControl,
  Alert,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AppColors} from './constants';
import {BackIcon} from './components/OccasionIcons';
import {OccasionApiService, OccasionCategory} from '@app/services/occasionApi';
import {useOccasion} from '@app/contexts/OccasionContext';

type HomeStackParamList = {
  HomeScreen: undefined;
  Occasions: undefined;
  OccasionCategories: {occasionType: string};
  OccasionFilters: {
    occasionType: string;
    categoryId: string | null;
    categoryName: string | null;
  };
  OccasionGenderSelection: {
    occasionType: string;
    categoryId: string | null;
    categoryName: string | null;
    filterId: string | null;
    filterName: string | null;
  };
  OccasionContent: {
    occasionType: string;
    categoryId: string | null;
    categoryName: string | null;
    filterId: string | null;
    filterName: string | null;
    gender: string;
  };
};

type NavigationProp = NativeStackNavigationProp<HomeStackParamList>;

export const CategoriesScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const {occasionType} = route.params as {occasionType: string};
  const {setCategory} = useOccasion();

  const [allCategories, setAllCategories] = useState<OccasionCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filter categories based on selected occasion type
  const categories = allCategories.filter(
    (cat: OccasionCategory) => cat.occasionType === occasionType,
  );

  useEffect(() => {
    fetchCategories();
  }, []);

  // Navigate to next screen based on category availability
  useEffect(() => {
    if (!loading && categories.length === 0) {
      // No categories found, set null and skip to Gotra selection
      setCategory(null, null);
      navigation.navigate('OccasionFilters', {
        occasionType,
        categoryId: null,
        categoryName: null,
      });
    }
  }, [loading, categories]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await OccasionApiService.fetchCategories();
      setAllCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      Alert.alert(
        'Error',
        (error as Error)?.message || 'Failed to load categories',
      );
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCategories();
    setRefreshing(false);
  };

  const handleSelectCategory = (category: OccasionCategory) => {
    setCategory(category._id, category.name);
    navigation.navigate('OccasionFilters', {
      occasionType,
      categoryId: category._id,
      categoryName: category.name,
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          backgroundColor={AppColors.primary}
          barStyle="light-content"
        />
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}>
            <BackIcon size={24} color={AppColors.white} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>{occasionType}</Text>
            <Text style={styles.headerSubtitle}>Loading categories...</Text>
          </View>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={AppColors.primary} />
          <Text style={styles.loadingText}>Loading categories...</Text>
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
          <Text style={styles.headerTitle}>{occasionType}</Text>
          <Text style={styles.headerSubtitle}>Select a specific category</Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{categories.length}</Text>
          <Text style={styles.statLabel}>Categories</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[AppColors.primary]}
          />
        }>
        <View style={styles.cardsContainer}>
          {categories.map(category => (
            <TouchableOpacity
              key={category._id}
              style={styles.card}
              onPress={() => handleSelectCategory(category)}
              activeOpacity={0.8}>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{category.name}</Text>
                <Text style={styles.cardDescription} numberOfLines={2}>
                  {category.description}
                </Text>
              </View>

              <View style={styles.chevron}>
                <Text style={styles.chevronText}>›</Text>
              </View>
            </TouchableOpacity>
          ))}

          {categories.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No Categories Found</Text>
              <Text style={styles.emptyText}>
                No categories available for this occasion type.
              </Text>
            </View>
          )}
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
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: AppColors.white,
    paddingHorizontal: 15,
    paddingVertical: 15,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: AppColors.border,
  },
  statCard: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: AppColors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: AppColors.gray,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: AppColors.gray,
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
    marginBottom: 12,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: AppColors.primary,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.dark,
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 13,
    color: AppColors.gray,
  },
  chevron: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 10,
  },
  chevronText: {
    fontSize: 24,
    color: AppColors.gray,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: AppColors.dark,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: AppColors.gray,
    textAlign: 'center',
  },
});
