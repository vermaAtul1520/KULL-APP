/**
 * DukanScreen Component - Simple Local Shop Directory
 * 
 * Required Dependencies:
 * npm install react-native-svg
 * 
 * Features:
 * - Basic shop listings with location and category
 * - Simple search functionality
 * - Shop details modal with complete address
 * - Contact information and directions
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Modal,
  StatusBar,
  TextInput,
  Linking,
  Alert,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

const AppColors = {
  primary: '#2563eb',
  white: '#ffffff',
  black: '#000000',
  gray: '#666666',
  lightGray: '#f3f4f6',
  dark: '#1f2937',
  green: '#10b981',
  red: '#ef4444',
  blue: '#3b82f6',
  border: '#e5e7eb',
  cream: '#fef7ed',
};

// SVG Icon Components
const ShopIcon = ({ size = 24, color = AppColors.primary }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M19 7H18V6C18 3.79 16.21 2 14 2H10C7.79 2 6 3.79 6 6V7H5C3.9 7 3 7.9 3 9V20C3 21.1 3.9 22 5 22H19C20.1 22 21 21.1 21 20V9C21 7.9 20.1 7 19 7ZM10 4H14C15.1 4 16 4.9 16 6V7H8V6C8 4.9 8.9 4 10 4ZM19 20H5V9H19V20Z"
      fill={color}
    />
  </Svg>
);

const LocationIcon = ({ size = 16, color = AppColors.gray }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12,2C8.13,2 5,5.13 5,9C5,14.25 12,22 12,22S19,14.25 19,9C19,5.13 15.87,2 12,2M12,11.5C10.62,11.5 9.5,10.38 9.5,9C9.5,7.62 10.62,6.5 12,6.5C13.38,6.5 14.5,7.62 14.5,9C14.5,10.38 13.38,11.5 12,11.5Z"
      fill={color}
    />
  </Svg>
);

const PhoneIcon = ({ size = 16, color = AppColors.green }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M6.62,10.79C8.06,13.62 10.38,15.94 13.21,17.38L15.41,15.18C15.69,14.9 16.08,14.82 16.43,14.93C17.55,15.3 18.75,15.5 20,15.5A1,1 0 0,1 21,16.5V20A1,1 0 0,1 20,21A17,17 0 0,1 3,4A1,1 0 0,1 4,3H7.5A1,1 0 0,1 8.5,4C8.5,5.25 8.7,6.45 9.07,7.57C9.18,7.92 9.1,8.31 8.82,8.59L6.62,10.79Z"
      fill={color}
    />
  </Svg>
);

const SearchIcon = ({ size = 20, color = AppColors.gray }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"
      fill={color}
    />
  </Svg>
);

const ClockIcon = ({ size = 14, color = AppColors.gray }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.7L16.2,16.2Z"
      fill={color}
    />
  </Svg>
);

const DirectionIcon = ({ size = 16, color = AppColors.blue }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M21,16V14L13,9V3.5A1.5,1.5 0 0,0 11.5,2A1.5,1.5 0 0,0 10,3.5V9L2,14V16L10,13.5V19L8,20.5V22L11.5,21L15,22V20.5L13,19V13.5L21,16Z"
      fill={color}
    />
  </Svg>
);

const CloseIcon = ({ size = 24, color = AppColors.white }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
      fill={color}
    />
  </Svg>
);

interface DukanItem {
  id: string;
  name: string;
  category: string;
  description: string;
  location: string;
  fullAddress: string;
  distance: string;
  phone: string;
  imageUrl: string;
  isOpen: boolean;
  openingHours: string;
}

const dukanItems: DukanItem[] = [
  {
    id: '1',
    name: 'Sharma General Store',
    category: 'Grocery',
    description: 'Fresh vegetables, daily essentials, and household items',
    location: 'Rajouri Garden',
    fullAddress: 'Shop No. 15, Main Market, Rajouri Garden, Near Metro Station, New Delhi - 110027',
    distance: '0.2 km',
    phone: '+91 9876543210',
    imageUrl: 'https://images.unsplash.com/photo-1556909114-4f2d3d6a4b8a?w=400&h=300&fit=crop',
    isOpen: true,
    openingHours: '8:00 AM - 10:00 PM',
  },
  {
    id: '2',
    name: 'Delhi Sweets Corner',
    category: 'Sweets & Snacks',
    description: 'Traditional Indian sweets and savory snacks',
    location: 'Karol Bagh',
    fullAddress: 'Plot 45, Karol Bagh Market, Opposite Gurudwara, Karol Bagh, New Delhi - 110005',
    distance: '1.5 km',
    phone: '+91 9123456789',
    imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    isOpen: true,
    openingHours: '9:00 AM - 11:00 PM',
  },
  {
    id: '3',
    name: 'Mobile World',
    category: 'Electronics',
    description: 'Latest smartphones, accessories, and repair services',
    location: 'Lajpat Nagar',
    fullAddress: 'Shop 78, Central Market, Lajpat Nagar IV, Near Post Office, New Delhi - 110024',
    distance: '2.3 km',
    phone: '+91 8765432109',
    imageUrl: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=400&h=300&fit=crop',
    isOpen: false,
    openingHours: '10:00 AM - 9:00 PM',
  },
  {
    id: '4',
    name: 'Fashion Hub',
    category: 'Clothing',
    description: 'Trendy clothes for men, women, and children',
    location: 'Janpath',
    fullAddress: 'Store 12, Janpath Market, Connaught Place, Near Palika Bazaar, New Delhi - 110001',
    distance: '3.1 km',
    phone: '+91 7654321098',
    imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
    isOpen: true,
    openingHours: '11:00 AM - 10:00 PM',
  },
  {
    id: '5',
    name: 'Mehta Medical Store',
    category: 'Pharmacy',
    description: '24/7 pharmacy with all medicines and health products',
    location: 'Rohini',
    fullAddress: 'Sector 7, Rohini, Near Metro Station, Main Road, Rohini, New Delhi - 110085',
    distance: '0.8 km',
    phone: '+91 9988776655',
    imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop',
    isOpen: true,
    openingHours: '24 Hours',
  },
  {
    id: '6',
    name: 'Book Paradise',
    category: 'Books & Stationery',
    description: 'Academic books, novels, and stationery items',
    location: 'Daryaganj',
    fullAddress: 'Shop 23, Sunday Book Market, Daryaganj, Near Red Fort, Old Delhi - 110002',
    distance: '4.2 km',
    phone: '+91 8899770066',
    imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
    isOpen: false,
    openingHours: '10:00 AM - 8:00 PM',
  },
  {
    id: '7',
    name: 'Spice Garden',
    category: 'Spices & Herbs',
    description: 'Fresh spices, herbs, and organic food products',
    location: 'Chandni Chowk',
    fullAddress: 'Khari Baoli, Chandni Chowk, Near Fatehpuri Mosque, Old Delhi - 110006',
    distance: '5.5 km',
    phone: '+91 7766554433',
    imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebc227d?w=400&h=300&fit=crop',
    isOpen: true,
    openingHours: '9:00 AM - 7:00 PM',
  },
  {
    id: '8',
    name: 'Tech Repairs',
    category: 'Services',
    description: 'Laptop, mobile, and electronic device repairs',
    location: 'Nehru Place',
    fullAddress: 'Shop 156, Nehru Place Market, Near Metro Station, Nehru Place, New Delhi - 110019',
    distance: '3.8 km',
    phone: '+91 6655443322',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&h=300&fit=crop',
    isOpen: true,
    openingHours: '10:00 AM - 8:00 PM',
  }
];

const categories = ['All', 'Grocery', 'Sweets & Snacks', 'Electronics', 'Clothing', 'Pharmacy', 'Books & Stationery', 'Spices & Herbs', 'Services'];

export default function DukanScreen() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedShop, setSelectedShop] = useState<DukanItem | null>(null);

  const filteredShops = dukanItems.filter(shop => {
    const matchesCategory = selectedCategory === 'All' || shop.category === selectedCategory;
    const matchesSearch = shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         shop.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         shop.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const openShopDetails = (shop: DukanItem) => {
    setSelectedShop(shop);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedShop(null);
  };

  const makePhoneCall = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`).catch(() => {
      Alert.alert('Error', 'Unable to make phone call');
    });
  };

  const openDirections = (address: string) => {
    const encodedAddress = encodeURIComponent(address);
    Linking.openURL(`https://maps.google.com/?q=${encodedAddress}`).catch(() => {
      Alert.alert('Error', 'Unable to open maps');
    });
  };

  const ShopDetailModal = () => (
    <Modal
      visible={modalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={closeModal}
    >
      <View style={styles.modalOverlay}>
        <StatusBar backgroundColor="rgba(0,0,0,0.5)" barStyle="light-content" />
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Shop Details</Text>
            <TouchableOpacity onPress={closeModal} style={styles.modalCloseButton}>
              <CloseIcon size={24} color={AppColors.white} />
            </TouchableOpacity>
          </View>

          {selectedShop && (
            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              <Image 
                source={{ uri: selectedShop.imageUrl }} 
                style={styles.modalImage}
                resizeMode="cover"
              />
              
              <View style={styles.modalInfo}>
                <View style={styles.modalNameRow}>
                  <Text style={styles.modalShopName}>{selectedShop.name}</Text>
                  <View style={[styles.statusBadge, { 
                    backgroundColor: selectedShop.isOpen ? AppColors.green : AppColors.red 
                  }]}>
                    <Text style={styles.statusText}>
                      {selectedShop.isOpen ? 'Open' : 'Closed'}
                    </Text>
                  </View>
                </View>

                <Text style={styles.modalCategory}>{selectedShop.category}</Text>
                <Text style={styles.modalDescription}>{selectedShop.description}</Text>

                <View style={styles.infoSection}>
                  <Text style={styles.sectionTitle}>Address:</Text>
                  <View style={styles.infoRow}>
                    <LocationIcon size={18} color={AppColors.blue} />
                    <Text style={styles.infoText}>{selectedShop.fullAddress}</Text>
                  </View>
                  
                  <Text style={styles.sectionTitle}>Opening Hours:</Text>
                  <View style={styles.infoRow}>
                    <ClockIcon size={18} color={AppColors.gray} />
                    <Text style={styles.infoText}>{selectedShop.openingHours}</Text>
                  </View>

                  <Text style={styles.sectionTitle}>Contact:</Text>
                  <View style={styles.infoRow}>
                    <PhoneIcon size={18} color={AppColors.green} />
                    <Text style={styles.infoText}>{selectedShop.phone}</Text>
                  </View>

                  <Text style={styles.sectionTitle}>Distance:</Text>
                  <Text style={styles.distanceText}>{selectedShop.distance} away</Text>
                </View>

                <View style={styles.actionButtons}>
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.callButton]}
                    onPress={() => makePhoneCall(selectedShop.phone)}
                  >
                    <PhoneIcon size={18} color={AppColors.white} />
                    <Text style={styles.actionButtonText}>Call Now</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={[styles.actionButton, styles.directionsButton]}
                    onPress={() => openDirections(selectedShop.fullAddress)}
                  >
                    <DirectionIcon size={18} color={AppColors.white} />
                    <Text style={styles.actionButtonText}>Get Directions</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );

  const ShopCard = ({ shop }: { shop: DukanItem }) => (
    <TouchableOpacity 
      style={styles.shopCard}
      onPress={() => openShopDetails(shop)}
      activeOpacity={0.7}
    >
      <Image 
        source={{ uri: shop.imageUrl }} 
        style={styles.shopImage}
        resizeMode="cover"
      />
      
      <View style={styles.shopInfo}>
        <Text style={styles.shopName} numberOfLines={1}>{shop.name}</Text>
        <Text style={styles.shopCategory}>{shop.category}</Text>
        <Text style={styles.shopDescription} numberOfLines={2}>
          {shop.description}
        </Text>

        <View style={styles.locationRow}>
          <LocationIcon size={14} color={AppColors.gray} />
          <Text style={styles.locationText} numberOfLines={1}>
            {shop.location} • {shop.distance}
          </Text>
        </View>

        <View style={styles.shopFooter}>
          <View style={styles.statusContainer}>
            <View style={[styles.statusDot, { 
              backgroundColor: shop.isOpen ? AppColors.green : AppColors.red 
            }]} />
            <Text style={[styles.statusLabel, {
              color: shop.isOpen ? AppColors.green : AppColors.red
            }]}>
              {shop.isOpen ? 'Open Now' : 'Closed'}
            </Text>
          </View>
          
          <TouchableOpacity 
            style={styles.callQuickButton}
            onPress={() => makePhoneCall(shop.phone)}
          >
            <PhoneIcon size={14} color={AppColors.white} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const CategoryFilter = () => (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.categoryContainer}
      contentContainerStyle={styles.categoryContent}
    >
      {categories.map((category) => (
        <TouchableOpacity
          key={category}
          style={[
            styles.categoryButton,
            selectedCategory === category && styles.categoryButtonActive
          ]}
          onPress={() => setSelectedCategory(category)}
        >
          <Text style={[
            styles.categoryButtonText,
            selectedCategory === category && styles.categoryButtonTextActive
          ]}>
            {category}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const SearchBar = () => (
    <View style={styles.searchContainer}>
      <View style={styles.searchBar}>
        <SearchIcon size={20} color={AppColors.gray} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search shops or locations..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={AppColors.gray}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Local Dukan</Text>
        <Text style={styles.headerSubtitle}>Find shops near you</Text>
      </View>

      <SearchBar />
      <CategoryFilter />

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <ShopIcon size={18} color={AppColors.primary} />
          <Text style={styles.statText}>{filteredShops.length} Shops Found</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.openShopsCount}>
            {filteredShops.filter(shop => shop.isOpen).length} Open Now
          </Text>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.shopsGrid}>
          {filteredShops.map((shop) => (
            <ShopCard key={shop.id} shop={shop} />
          ))}
        </View>

        {filteredShops.length === 0 && (
          <View style={styles.emptyState}>
            <ShopIcon size={48} color={AppColors.gray} />
            <Text style={styles.emptyTitle}>No shops found</Text>
            <Text style={styles.emptySubtitle}>
              Try adjusting your search
            </Text>
          </View>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            🏪 Local businesses directory
          </Text>
        </View>
      </ScrollView>

      <ShopDetailModal />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.white,
  },
  header: {
    backgroundColor: AppColors.primary,
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: AppColors.white,
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: AppColors.white,
    opacity: 0.9,
  },
  searchContainer: {
    backgroundColor: AppColors.white,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.border,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.lightGray,
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: AppColors.dark,
    marginLeft: 10,
  },
  categoryContainer: {
    backgroundColor: AppColors.cream,
    paddingVertical: 10,
    maxHeight: 60,
  },
  categoryContent: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  categoryButton: {
    backgroundColor: AppColors.white,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    marginRight: 8,
    borderWidth: 1,
    borderColor: AppColors.border,
    minHeight: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryButtonActive: {
    backgroundColor: AppColors.primary,
    borderColor: AppColors.primary,
  },
  categoryButtonText: {
    fontSize: 13,
    color: AppColors.dark,
    fontWeight: '500',
  },
  categoryButtonTextActive: {
    color: AppColors.white,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: AppColors.lightGray,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    marginLeft: 6,
    fontSize: 13,
    color: AppColors.dark,
    fontWeight: '500',
  },
  openShopsCount: {
    fontSize: 13,
    color: AppColors.green,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  shopsGrid: {
    paddingHorizontal: 10,
  },
  shopCard: {
    backgroundColor: AppColors.white,
    marginHorizontal: 5,
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  shopImage: {
    width: '100%',
    height: 150,
    backgroundColor: AppColors.lightGray,
  },
  shopInfo: {
    padding: 15,
  },
  shopName: {
    fontSize: 18,
    fontWeight: '600',
    color: AppColors.dark,
    marginBottom: 4,
  },
  shopCategory: {
    fontSize: 14,
    color: AppColors.primary,
    fontWeight: '500',
    marginBottom: 6,
  },
  shopDescription: {
    fontSize: 14,
    color: AppColors.gray,
    lineHeight: 20,
    marginBottom: 10,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationText: {
    fontSize: 13,
    color: AppColors.gray,
    marginLeft: 6,
    flex: 1,
  },
  shopFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  callQuickButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: AppColors.green,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: AppColors.dark,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: AppColors.gray,
    textAlign: 'center',
    lineHeight: 20,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 14,
    color: AppColors.gray,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: AppColors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.85,
    overflow: 'hidden',
  },
  modalHeader: {
    backgroundColor: AppColors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: AppColors.white,
  },
  modalCloseButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  modalContent: {
    flex: 1,
  },
  modalImage: {
    width: '100%',
    height: 200,
  },
  modalInfo: {
    padding: 20,
  },
  modalNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalShopName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: AppColors.dark,
    flex: 1,
    marginRight: 15,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: AppColors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  modalCategory: {
    fontSize: 16,
    color: AppColors.primary,
    fontWeight: '600',
    marginBottom: 8,
  },
  modalDescription: {
    fontSize: 15,
    color: AppColors.gray,
    lineHeight: 22,
    marginBottom: 20,
  },
  infoSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.dark,
    marginBottom: 8,
    marginTop: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  infoText: {
    fontSize: 14,
    color: AppColors.dark,
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  distanceText: {
    fontSize: 14,
    color: AppColors.blue,
    fontWeight: '500',
    marginLeft: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 15,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 10,
  },
  callButton: {
    backgroundColor: AppColors.green,
  },
  directionsButton: {
    backgroundColor: AppColors.blue,
  },
  actionButtonText: {
    color: AppColors.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});