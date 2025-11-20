/**
 * DukanScreen Component with API Integration
 * Endpoint: /api/dukaans/
 */

import {getAuthHeaders, getCommunityId} from '@app/constants/apiUtils';
import {BASE_URL} from '@app/constants/constant';
import {useNavigation} from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
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
  ActivityIndicator,
  RefreshControl,
  Image,
} from 'react-native';
import Svg, {Path} from 'react-native-svg';

const {width, height} = Dimensions.get('window');

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
const ShopIcon = ({size = 24, color = AppColors.primary}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M19 7H18V6C18 3.79 16.21 2 14 2H10C7.79 2 6 3.79 6 6V7H5C3.9 7 3 7.9 3 9V20C3 21.1 3.9 22 5 22H19C20.1 22 21 21.1 21 20V9C21 7.9 20.1 7 19 7ZM10 4H14C15.1 4 16 4.9 16 6V7H8V6C8 4.9 8.9 4 10 4ZM19 20H5V9H19V20Z"
      fill={color}
    />
  </Svg>
);

const LocationIcon = ({size = 16, color = AppColors.gray}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12,2C8.13,2 5,5.13 5,9C5,14.25 12,22 12,22S19,14.25 19,9C19,5.13 15.87,2 12,2M12,11.5C10.62,11.5 9.5,10.38 9.5,9C9.5,7.62 10.62,6.5 12,6.5C13.38,6.5 14.5,7.62 14.5,9C14.5,10.38 13.38,11.5 12,11.5Z"
      fill={color}
    />
  </Svg>
);

const PhoneIcon = ({size = 16, color = AppColors.green}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M6.62,10.79C8.06,13.62 10.38,15.94 13.21,17.38L15.41,15.18C15.69,14.9 16.08,14.82 16.43,14.93C17.55,15.3 18.75,15.5 20,15.5A1,1 0 0,1 21,16.5V20A1,1 0 0,1 20,21A17,17 0 0,1 3,4A1,1 0 0,1 4,3H7.5A1,1 0 0,1 8.5,4C8.5,5.25 8.7,6.45 9.07,7.57C9.18,7.92 9.1,8.31 8.82,8.59L6.62,10.79Z"
      fill={color}
    />
  </Svg>
);

const BackIcon = ({size = 24, color = '#fff'}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M19 12H5M12 19L5 12L12 5"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const PersonIcon = ({size = 16, color = AppColors.blue}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"
      fill={color}
    />
  </Svg>
);

const SearchIcon = ({size = 20, color = AppColors.gray}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"
      fill={color}
    />
  </Svg>
);

const CloseIcon = ({size = 24, color = AppColors.white}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
      fill={color}
    />
  </Svg>
);

const LinkIcon = ({size = 16, color = AppColors.blue}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M10,17L15,12L10,7V10H1V14H10V17M21,3H12V5H19V19H12V21H21A2,2 0 0,0 23,1V5A2,2 0 0,0 21,3Z"
      fill={color}
    />
  </Svg>
);

interface Shop {
  _id: string;
  shopName: string;
  ownerName: string;
  location: string;
  phone: string;
  banner: string;
  url: string;
  category: string;
  products: string[];
  description: string;
  community: string;
  createdAt: string;
  updatedAt: string;
}

export default function DukanScreen() {
  const navigation = useNavigation();
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);

  // Fetch shops from API
  const fetchShops = async () => {
    try {
      const headers = await getAuthHeaders();
      const communityId = await getCommunityId();

      // Build query with community filter
      const filter = JSON.stringify({community: communityId});
      const url = `${BASE_URL}/api/dukaans?filter=${encodeURIComponent(
        filter,
      )}`;

      const response = await fetch(url, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success && result.data) {
        setShops(result.data);
      } else {
        console.error('API returned unsuccessful response:', result);
        setShops([]);
      }
    } catch (error) {
      console.error('Error fetching shops:', error);
      Alert.alert('Error', 'Failed to load shops. Please try again.');
      setShops([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchShops();
  }, []);

  // Refresh function
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchShops();
    setRefreshing(false);
  };

  const filteredShops = shops.filter(
    shop =>
      shop.shopName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shop.ownerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shop.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shop.category?.toLowerCase().includes(searchQuery.toLowerCase()),
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
    // Add +91 prefix if not present and clean phone number
    let cleanPhone = phoneNumber.replace(/[^\d]/g, '');
    if (!cleanPhone.startsWith('91') && cleanPhone.length === 10) {
      cleanPhone = '91' + cleanPhone;
    }

    Linking.openURL(`tel:+${cleanPhone}`).catch(() => {
      Alert.alert('Error', 'Unable to make phone call');
    });
  };

  const openShopUrl = (url: string) => {
    if (!url) {
      Alert.alert('Error', 'No website URL available');
      return;
    }

    // Ensure URL has proper protocol
    let formattedUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      formattedUrl = `https://${url}`;
    }

    Linking.openURL(formattedUrl).catch(() => {
      Alert.alert('Error', 'Unable to open website');
    });
  };

  const ShopDetailModal = () => (
    <Modal
      visible={modalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={closeModal}>
      <View style={styles.modalOverlay}>
        <View style={styles.newModalContainer}>
          {selectedShop && (
            <>
              {/* Header with Banner */}
              <View style={styles.newModalHeader}>
                {selectedShop.banner ? (
                  // <View style={styles.headerBannerContainer}>
                  <Image
                    source={{uri: selectedShop.banner}}
                    style={styles.bannerCardImage}
                    resizeMode="contain"
                  />
                ) : (
                  // </View>
                  <View style={styles.headerWithoutBanner} />
                )}

                <TouchableOpacity
                  onPress={closeModal}
                  style={styles.newCloseButton}>
                  <CloseIcon size={24} color={AppColors.white} />
                </TouchableOpacity>

                <View style={styles.headerContent}>
                  <Text style={styles.newShopName}>
                    {selectedShop.shopName}
                  </Text>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryBadgeText}>
                      {selectedShop.category}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Content */}
              <ScrollView
                style={styles.newModalContent}
                showsVerticalScrollIndicator={false}>
                {/* Owner Info Card */}
                <View style={styles.infoCard}>
                  <View style={styles.newCardHeader}>
                    <PersonIcon size={20} color={AppColors.blue} />
                    <Text style={styles.newCardTitle}>Owner Information</Text>
                  </View>
                  <Text style={styles.newOwnerName}>
                    {selectedShop.ownerName}
                  </Text>
                  <View style={styles.newLocationContainer}>
                    <LocationIcon size={16} color={AppColors.gray} />
                    <Text style={styles.newLocationText}>
                      {selectedShop.location}
                    </Text>
                  </View>
                </View>

                {/* Description Card */}
                {selectedShop.description && (
                  <View style={styles.infoCard}>
                    <View style={styles.newCardHeader}>
                      <Text style={styles.newCardTitle}>About</Text>
                    </View>
                    <Text style={styles.descriptionText}>
                      {selectedShop.description}
                    </Text>
                  </View>
                )}

                {/* Products Card */}
                {selectedShop.products && selectedShop.products.length > 0 && (
                  <View style={styles.infoCard}>
                    <View style={styles.newCardHeader}>
                      <Text style={styles.newCardTitle}>
                        Products & Services
                      </Text>
                    </View>
                    <View style={styles.productsGrid}>
                      {selectedShop.products.map((product, index) => (
                        <View key={index} style={styles.productChip}>
                          <Text style={styles.productChipText}>{product}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {/* Website Card */}
                {selectedShop.url && (
                  <View style={styles.infoCard}>
                    <View style={styles.newCardHeader}>
                      <LinkIcon size={20} color={AppColors.blue} />
                      <Text style={styles.newCardTitle}>Website</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.websiteButton}
                      onPress={() => openShopUrl(selectedShop.url)}>
                      <Text style={styles.websiteUrl}>{selectedShop.url}</Text>
                      <LinkIcon size={16} color={AppColors.blue} />
                    </TouchableOpacity>
                  </View>
                )}
              </ScrollView>

              {/* Fixed Action Buttons */}
              <View style={styles.fixedActionContainer}>
                <TouchableOpacity
                  style={styles.newCallButton}
                  onPress={() => makePhoneCall(selectedShop.phone)}>
                  <PhoneIcon size={20} color={AppColors.white} />
                  <Text style={styles.newCallButtonText}>Call Now</Text>
                </TouchableOpacity>

                {selectedShop.url && (
                  <TouchableOpacity
                    style={styles.newVisitButton}
                    onPress={() => openShopUrl(selectedShop.url)}>
                    <LinkIcon size={20} color={AppColors.white} />
                    <Text style={styles.newVisitButtonText}>Visit Website</Text>
                  </TouchableOpacity>
                )}
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );

  const ShopCard = ({shop}: {shop: Shop}) => (
    <TouchableOpacity
      style={styles.shopCard}
      onPress={() => openShopDetails(shop)}
      activeOpacity={0.7}>
      {shop.banner && (
        <Image
          source={{uri: shop.banner}}
          style={styles.bannerCardImage}
          resizeMode="contain"
        />
      )}

      <View style={styles.cardHeader}>
        <View style={styles.shopIconContainer}>
          <ShopIcon size={20} color={AppColors.primary} />
        </View>
        <View style={[styles.statusDot, {backgroundColor: AppColors.green}]} />
      </View>

      <View style={styles.shopInfo}>
        <Text style={styles.shopName} numberOfLines={1}>
          {shop.shopName}
        </Text>

        <View style={styles.ownerRow}>
          <PersonIcon size={14} color={AppColors.blue} />
          <Text style={styles.ownerText} numberOfLines={1}>
            {shop.ownerName}
          </Text>
        </View>

        <View style={styles.locationRow}>
          <LocationIcon size={14} color={AppColors.gray} />
          <Text style={styles.locationText} numberOfLines={1}>
            {shop.location}
          </Text>
        </View>

        <Text style={styles.categoryLabel}>{shop.category}</Text>

        {shop.products && shop.products.length > 0 && (
          <Text style={styles.productsPreview} numberOfLines={1}>
            {shop.products.slice(0, 3).join(', ')}
            {shop.products.length > 3 ? '...' : ''}
          </Text>
        )}
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.contactButton}
          onPress={e => {
            e.stopPropagation();
            makePhoneCall(shop.phone);
          }}>
          <PhoneIcon size={16} color={AppColors.white} />
          <Text style={styles.contactText}>Call</Text>
        </TouchableOpacity>

        {shop.url && (
          <TouchableOpacity
            style={styles.urlButton}
            onPress={e => {
              e.stopPropagation();
              openShopUrl(shop.url);
            }}>
            <LinkIcon size={16} color={AppColors.white} />
            <Text style={styles.urlText}>Visit</Text>
          </TouchableOpacity>
        )}
      </View>
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
          blurOnSubmit={false}
          returnKeyType="search"
        />
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}>
            <BackIcon size={24} color={AppColors.white} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Local Dukan</Text>
            <Text style={styles.headerSubtitle}>Loading shops...</Text>
          </View>
        </View>

        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={AppColors.primary} />
          <Text style={styles.loadingText}>Loading shops...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <BackIcon size={24} color={AppColors.white} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Local Dukan</Text>
          <Text style={styles.headerSubtitle}>
            {filteredShops.length} shops found
          </Text>
        </View>
      </View>

      <SearchBar />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[AppColors.primary]}
          />
        }>
        <View style={styles.shopsContainer}>
          {filteredShops.map(shop => (
            <ShopCard key={shop._id} shop={shop} />
          ))}
        </View>

        {filteredShops.length === 0 && !loading && (
          <View style={styles.emptyState}>
            <ShopIcon size={48} color={AppColors.gray} />
            <Text style={styles.emptyTitle}>No shops found</Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery
                ? 'Try searching with different keywords'
                : 'No shops available in your area'}
            </Text>
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
  headerCenter: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    marginRight: 30,
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
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: AppColors.gray,
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
    marginBottom: 6,
  },
  productsPreview: {
    fontSize: 12,
    color: AppColors.gray,
    fontStyle: 'italic',
  },
  contactButton: {
    flex: 1,
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
    justifyContent: 'flex-end',
    alignItems: 'center',
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
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.green,
    borderRadius: 10,
    paddingVertical: 14,
    gap: 8,
  },
  callButtonText: {
    color: AppColors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  // Banner styles for shop cards
  bannerContainer: {
    height: 120,
    marginBottom: 12,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  // Action buttons container
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  urlButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.blue,
    borderRadius: 8,
    paddingVertical: 10,
    gap: 6,
  },
  urlText: {
    color: AppColors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  // Modal banner styles
  modalBannerContainer: {
    height: 200,
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalBannerImage: {
    width: '100%',
    height: '100%',
  },
  // URL link style
  urlLink: {
    color: AppColors.blue,
    fontSize: 14,
    textDecorationLine: 'underline',
    flex: 1,
  },
  // Modal action buttons
  modalActionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  visitButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.blue,
    borderRadius: 10,
    paddingVertical: 14,
    gap: 8,
  },
  visitButtonText: {
    color: AppColors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  // New Modal Styles
  newModalContainer: {
    backgroundColor: AppColors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: '100%',
    height: '95%',
    overflow: 'hidden',
  },
  newModalHeader: {
    position: 'relative',
    height: 180,
  },
  headerBannerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  headerBannerImage: {
    width: '100%',
    height: '100%',
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  headerWithoutBanner: {
    backgroundColor: AppColors.primary,
    height: '100%',
  },
  newCloseButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    padding: 8,
    zIndex: 10,
  },
  headerContent: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    zIndex: 5,
  },
  newShopName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: AppColors.white,
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 3,
  },
  categoryBadge: {
    backgroundColor: AppColors.orange,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    alignSelf: 'flex-start',
  },
  categoryBadgeText: {
    color: AppColors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  newModalContent: {
    flex: 1,
    padding: 20,
    paddingBottom: 0,
  },
  infoCard: {
    backgroundColor: AppColors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
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
  newCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  newCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.dark,
    marginLeft: 8,
  },
  newOwnerName: {
    fontSize: 18,
    fontWeight: '600',
    color: AppColors.dark,
    marginBottom: 8,
  },
  newLocationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  newLocationText: {
    fontSize: 14,
    color: AppColors.gray,
    marginLeft: 6,
  },
  descriptionText: {
    fontSize: 14,
    color: AppColors.gray,
    lineHeight: 20,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  productChip: {
    backgroundColor: AppColors.lightGray,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 4,
  },
  productChipText: {
    fontSize: 12,
    color: AppColors.dark,
    fontWeight: '500',
  },
  websiteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: AppColors.lightGray,
    padding: 12,
    borderRadius: 8,
  },
  websiteUrl: {
    fontSize: 14,
    color: AppColors.blue,
    flex: 1,
    marginRight: 8,
  },
  fixedActionContainer: {
    flexDirection: 'row',
    padding: 20,
    paddingTop: 16,
    paddingBottom: 20,
    gap: 12,
    backgroundColor: AppColors.white,
    borderTopWidth: 1,
    borderTopColor: AppColors.border,
  },
  newCallButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.green,
    borderRadius: 12,
    paddingVertical: 16,
    gap: 8,
  },
  newCallButtonText: {
    color: AppColors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  newVisitButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.blue,
    borderRadius: 12,
    paddingVertical: 16,
    gap: 8,
  },
  newVisitButtonText: {
    color: AppColors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  bannerCardImage: {
    width: '100%',
    minHeight: 200,
    maxHeight: 400,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: '#f5f5f5',
  },
});
