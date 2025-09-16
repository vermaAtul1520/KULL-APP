/**
 * Simplified DukanScreen Component - Essential Shop Information
 * Focus on: Shop Name, Owner, Location, Contact, and Key Details
 */

import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Modal,
  TextInput,
  Linking,
  Alert,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

const AppColors = {
  primary: '#7dd3c0',
  white: '#ffffff',
  black: '#000000',
  gray: '#666666',
  lightGray: '#f8f9fa',
  dark: '#2a2a2a',
  green: '#28a745',
  red: '#dc3545',
  blue: '#007bff',
  border: '#dee2e6',
  orange: '#fd7e14',
  teal: '#7dd3c0',
};

// SVG Icons
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

const BackIcon = ({ size = 24, color = "#fff" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M19 12H5M12 19L5 12L12 5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const PersonIcon = ({ size = 16, color = AppColors.blue }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"
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

const CloseIcon = ({ size = 24, color = AppColors.white }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
      fill={color}
    />
  </Svg>
);

interface Shop {
  id: string;
  shopName: string;
  ownerName: string;
  location: string;
  phone: string;
  isOpen: boolean;
  category: string;
  products: string[];
  experience: string;
  specialty: string;
}

const shops: Shop[] = [
  {
    id: '1',
    shopName: 'Sharma General Store',
    ownerName: 'Rajesh Sharma',
    location: 'Rajouri Garden',
    phone: '+91 9876543210',
    isOpen: true,
    category: 'Grocery & Daily Needs',
    products: ['Fresh vegetables', 'Dairy products', 'Household items', 'Snacks'],
    experience: '15 years in grocery business',
    specialty: 'Fresh vegetables delivered daily from local farms'
  },
  {
    id: '2',
    shopName: 'Delhi Sweets Corner',
    ownerName: 'Mohan Gupta',
    location: 'Karol Bagh',
    phone: '+91 9123456789',
    isOpen: true,
    category: 'Sweets & Traditional Food',
    products: ['Traditional sweets', 'Samosas', 'Chole bhature', 'Festival specials'],
    experience: '25 years in sweet making',
    specialty: 'Authentic Delhi-style sweets and fresh snacks'
  },
  {
    id: '3',
    shopName: 'Mobile World',
    ownerName: 'Amit Kumar',
    location: 'Lajpat Nagar',
    phone: '+91 8765432109',
    isOpen: false,
    category: 'Electronics & Mobile',
    products: ['Smartphones', 'Mobile accessories', 'Repairs', 'Screen guards'],
    experience: '8 years in mobile business',
    specialty: 'Expert mobile repairs and latest accessories'
  },
  {
    id: '4',
    shopName: 'Mehta Medical',
    ownerName: 'Dr. Suresh Mehta',
    location: 'Rohini',
    phone: '+91 9988776655',
    isOpen: true,
    category: 'Pharmacy & Health',
    products: ['Medicines', 'Health supplements', 'Medical equipment', 'First aid'],
    experience: '20 years as pharmacist',
    specialty: '24/7 emergency medicines and health consultation'
  },
  {
    id: '5',
    shopName: 'Fashion Hub',
    ownerName: 'Priya Singh',
    location: 'Janpath',
    phone: '+91 7654321098',
    isOpen: true,
    category: 'Clothing & Fashion',
    products: ['Ladies wear', 'Kids clothing', 'Accessories', 'Ethnic wear'],
    experience: '12 years in fashion retail',
    specialty: 'Latest trends and custom tailoring services'
  },
  {
    id: '6',
    shopName: 'Spice Garden',
    ownerName: 'Ramesh Agarwal',
    location: 'Chandni Chowk',
    phone: '+91 7766554433',
    isOpen: true,
    category: 'Spices & Herbs',
    products: ['Fresh spices', 'Dry fruits', 'Organic herbs', 'Tea varieties'],
    experience: '30 years in spice trade',
    specialty: 'Pure and fresh spices directly from farms'
  }
];

export default function DukanScreen() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);

  const filteredShops = shops.filter(shop =>
    shop.shopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    shop.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    shop.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    shop.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openShopDetails = (shop: Shop) => {
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

  const ShopDetailModal = () => (
    <Modal
      visible={modalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={closeModal}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Shop Details</Text>
            <TouchableOpacity onPress={closeModal} style={styles.modalCloseButton}>
              <CloseIcon size={20} color={AppColors.white} />
            </TouchableOpacity>
          </View>

          {selectedShop && (
            <View style={styles.modalContent}>
              <Text style={styles.modalShopName}>{selectedShop.shopName}</Text>
              
              <View style={styles.infoRow}>
                <PersonIcon size={16} color={AppColors.blue} />
                <Text style={styles.infoLabel}>Owner:</Text>
                <Text style={styles.infoValue}>{selectedShop.ownerName}</Text>
              </View>

              <View style={styles.infoRow}>
                <LocationIcon size={16} color={AppColors.gray} />
                <Text style={styles.infoLabel}>Location:</Text>
                <Text style={styles.infoValue}>{selectedShop.location}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Category:</Text>
                <Text style={styles.infoValue}>{selectedShop.category}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Experience:</Text>
                <Text style={styles.infoValue}>{selectedShop.experience}</Text>
              </View>

              <View style={styles.specialtyContainer}>
                <Text style={styles.sectionTitle}>Specialty:</Text>
                <Text style={styles.specialtyText}>{selectedShop.specialty}</Text>
              </View>

              <View style={styles.productsContainer}>
                <Text style={styles.sectionTitle}>Products:</Text>
                {selectedShop.products.map((product, index) => (
                  <Text key={index} style={styles.productText}>• {product}</Text>
                ))}
              </View>

              <TouchableOpacity 
                style={styles.callButton}
                onPress={() => makePhoneCall(selectedShop.phone)}
              >
                <PhoneIcon size={18} color={AppColors.white} />
                <Text style={styles.callButtonText}>Call {selectedShop.ownerName}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );

  const ShopCard = ({ shop }: { shop: Shop }) => (
    <TouchableOpacity 
      style={styles.shopCard}
      onPress={() => openShopDetails(shop)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View style={styles.shopIconContainer}>
          <ShopIcon size={20} color={AppColors.primary} />
        </View>
        <View style={[styles.statusDot, { 
          backgroundColor: shop.isOpen ? AppColors.green : AppColors.red 
        }]} />
      </View>

      <View style={styles.shopInfo}>
        <Text style={styles.shopName} numberOfLines={1}>{shop.shopName}</Text>
        
        <View style={styles.ownerRow}>
          <PersonIcon size={14} color={AppColors.blue} />
          <Text style={styles.ownerText} numberOfLines={1}>{shop.ownerName}</Text>
        </View>

        <View style={styles.locationRow}>
          <LocationIcon size={14} color={AppColors.gray} />
          <Text style={styles.locationText} numberOfLines={1}>{shop.location}</Text>
        </View>

        <Text style={styles.categoryLabel}>{shop.category}</Text>
      </View>

      <TouchableOpacity 
        style={styles.contactButton}
        onPress={(e) => {
          e.stopPropagation();
          makePhoneCall(shop.phone);
        }}
      >
        <PhoneIcon size={16} color={AppColors.white} />
        <Text style={styles.contactText}>Call</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const SearchBar = () => (
    <View style={styles.searchContainer}>
      <View style={styles.searchBar}>
        <SearchIcon size={20} color={AppColors.gray} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search shops, owners, or location..."
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
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <BackIcon size={24} color={AppColors.white} />
        </TouchableOpacity>
        <View style={{flex: 1, flexDirection: 'column', alignItems: 'center', alignContent: 'center', alignSelf: 'center', marginRight: 30}}>
        <Text style={styles.headerTitle}>Local Dukan</Text>
        <Text style={styles.headerSubtitle}>{filteredShops.length} shops found</Text>
        </View>
      </View>

      <SearchBar />

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.shopsContainer}>
          {filteredShops.map((shop) => (
            <ShopCard key={shop.id} shop={shop} />
          ))}
        </View>

        {filteredShops.length === 0 && (
          <View style={styles.emptyState}>
            <ShopIcon size={48} color={AppColors.gray} />
            <Text style={styles.emptyTitle}>No shops found</Text>
            <Text style={styles.emptySubtitle}>Try searching with different keywords</Text>
          </View>
        )}
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
    paddingVertical: 15,
    paddingTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 15,
    padding: 5,
  },
  headerTitle: {
    fontSize: 24,
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
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 15,
  },
  shopsContainer: {
    gap: 12,
  },
  shopCard: {
    backgroundColor: AppColors.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  shopIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: AppColors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  shopInfo: {
    marginBottom: 15,
  },
  shopName: {
    fontSize: 18,
    fontWeight: '600',
    color: AppColors.dark,
    marginBottom: 8,
  },
  ownerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  ownerText: {
    fontSize: 14,
    color: AppColors.blue,
    marginLeft: 6,
    fontWeight: '500',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 14,
    color: AppColors.gray,
    marginLeft: 6,
  },
  categoryLabel: {
    fontSize: 12,
    color: AppColors.orange,
    fontWeight: '500',
    backgroundColor: AppColors.lightGray,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.green,
    borderRadius: 8,
    paddingVertical: 10,
    gap: 6,
  },
  contactText: {
    color: AppColors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
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
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: AppColors.white,
    borderRadius: 15,
    width: '100%',
    maxWidth: 350,
    maxHeight: '80%',
  },
  modalHeader: {
    backgroundColor: AppColors.blue,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: AppColors.white,
  },
  modalCloseButton: {
    padding: 5,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  modalContent: {
    padding: 20,
  },
  modalShopName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: AppColors.dark,
    marginBottom: 20,
    textAlign: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.dark,
    marginLeft: 8,
    minWidth: 80,
  },
  infoValue: {
    fontSize: 14,
    color: AppColors.gray,
    marginLeft: 10,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.dark,
    marginBottom: 8,
    marginTop: 10,
  },
  specialtyContainer: {
    marginTop: 15,
  },
  specialtyText: {
    fontSize: 14,
    color: AppColors.gray,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  productsContainer: {
    marginTop: 15,
    marginBottom: 20,
  },
  productText: {
    fontSize: 14,
    color: AppColors.dark,
    marginBottom: 4,
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.green,
    borderRadius: 10,
    paddingVertical: 14,
    gap: 8,
    marginTop: 10,
  },
  callButtonText: {
    color: AppColors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});