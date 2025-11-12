import {getAuthHeaders, getCommunityId} from '@app/constants/apiUtils';
import {BASE_URL} from '@app/constants/constant';
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  Dimensions,
  RefreshControl,
  StatusBar,
  SafeAreaView,
  Image,
} from 'react-native';
import Pdf from 'react-native-pdf';
import Svg, {Path, Circle, Rect} from 'react-native-svg';
import {useNavigation} from '@react-navigation/native';

const {width, height} = Dimensions.get('window');

// Custom SVG Icons
const SearchIcon = ({size = 24, color = '#2a2a2a'}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
      fill={color}
    />
  </Svg>
);

const CloseIcon = ({size = 24, color = '#666'}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
      fill={color}
    />
  </Svg>
);

const PdfIcon = ({size = 24, color = '#fff'}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"
      fill={color}
    />
  </Svg>
);

const ImageIcon = ({size = 24, color = '#fff'}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M8.5,13.5L11,16.5L14.5,12L19,18H5M21,19V5C21,3.89 20.1,3 19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19Z"
      fill={color}
    />
  </Svg>
);

const SportIcon = ({size = 24, color = '#fff'}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="none" />
    <Path
      d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
      stroke={color}
      strokeWidth="2"
      fill="none"
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

const TrophyIcon = ({size = 16, color = '#666'}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M6 9a9 9 0 1 0 12 0"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 16v6M8 22h8"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const CalendarIcon = ({size = 16, color = '#666'}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect
      x="3"
      y="4"
      width="18"
      height="18"
      rx="2"
      ry="2"
      stroke={color}
      strokeWidth="2"
      fill="none"
    />
    <Path
      d="M16 2v4M8 2v4M3 10h18"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const MapIcon = ({size = 16, color = '#666'}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
      stroke={color}
      strokeWidth="2"
      fill="none"
    />
    <Circle cx="12" cy="10" r="3" stroke={color} strokeWidth="2" fill="none" />
  </Svg>
);

const AppColors = {
  primary: '#7dd3c0',
  black: '#000000',
  white: '#ffffff',
  gray: '#666666',
  dark: '#2a2a2a',
  teal: '#1e6b5c',
  cream: '#f5f5dc',
  blue: '#4169e1',
  lightGray: '#f0f0f0',
  orange: '#ff8c00',
  red: '#dc143c',
  green: '#228b22',
  border: '#e5e7eb',
  success: '#10b981',
  warning: '#f59e0b',
  purple: '#8b5cf6',
  sport: '#e74c3c',
};

// Sports Event Interface
interface SportsEvent {
  _id: string;
  title: string;
  organizer: string;
  location: string;
  description: string;
  category: string;
  type: 'pdf' | 'image';
  url: string;
  thumbnailUrl?: string;
  eventDate: string;
  registrationFee: string;
  eventType: 'tournament' | 'match' | 'training';
  isUpcoming?: boolean;
  isActive: boolean;
  community: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

const getEventTypeColor = (eventType: string) => {
  switch (eventType) {
    case 'tournament':
      return AppColors.sport;
    case 'match':
      return AppColors.blue;
    case 'training':
      return AppColors.green;
    default:
      return AppColors.gray;
  }
};

// Format date for display
const formatEventDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
};

const SportsScreen = () => {
  const navigation = useNavigation();
  const [sportsEvents, setSportsEvents] = useState<SportsEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<SportsEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<SportsEvent | null>(null);
  const [eventDetailModalVisible, setEventDetailModalVisible] = useState(false);

  // PDF viewer states
  const [pdfLoading, setPdfLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // Fetch sports events from API
  const fetchSportsEvents = async () => {
    try {
      const headers = await getAuthHeaders();
      const communityId = await getCommunityId();

      // Build query with community filter
      const filter = JSON.stringify({community: communityId});
      const url = `${BASE_URL}/api/sportsEvents?filter=${encodeURIComponent(
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
        setSportsEvents(result.data);
        setFilteredEvents(result.data);
      } else {
        console.error('API returned unsuccessful response:', result);
        setSportsEvents([]);
        setFilteredEvents([]);
      }
    } catch (error) {
      console.error('Error fetching sports events:', error);
      Alert.alert('Error', 'Failed to load sports events. Please try again.');
      setSportsEvents([]);
      setFilteredEvents([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchSportsEvents();
  }, []);

  // Filter events based on search
  useEffect(() => {
    filterEvents();
  }, [searchQuery, sportsEvents]);

  const filterEvents = () => {
    let filtered = sportsEvents;

    if (searchQuery.trim()) {
      filtered = filtered.filter(event => {
        const query = searchQuery.toLowerCase();
        return (
          event.title?.toLowerCase().includes(query) ||
          event.description?.toLowerCase().includes(query) ||
          event.category?.toLowerCase().includes(query) ||
          event.organizer?.toLowerCase().includes(query) ||
          event.location?.toLowerCase().includes(query)
        );
      });
    }

    setFilteredEvents(filtered);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchSportsEvents();
    setRefreshing(false);
  };

  const openEvent = (event: SportsEvent) => {
    setSelectedEvent(event);
    setEventDetailModalVisible(true);
    // if (event.type === 'image') {
    //   setImageModalVisible(true);
    // } else if (event.type === 'pdf') {
    //   setPdfModalVisible(true);
    // } else {
    //   setEventDetailModalVisible(true);
    // }
  };

  const closeModals = () => {
    setEventDetailModalVisible(false);
    setSelectedEvent(null);
  };

  // Get full image URL with fallback
  const getFullImageUrl = (imageUrl?: string) => {
    if (!imageUrl) {
      // Fallback dummy sports image
      return 'https://images.rawpixel.com/image_png_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvam9iNjgwLTE2Ni1wLWwxZGJ1cTN2LnBuZw.png';
    }
    // Use the full URL directly from API (already complete URLs)
    return imageUrl;
  };

  // Event Detail Modal Component
  const EventDetailModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={eventDetailModalVisible}
        onRequestClose={closeModals}>
        <View style={styles.detailModalOverlay}>
          <View style={styles.detailModalContainer}>
            <ScrollView
              style={styles.detailModalContent}
              showsVerticalScrollIndicator={false}>
              {selectedEvent && (
                <>
                  {/* Modal Header */}
                  <View style={styles.detailModalHeader}>
                    <Text style={styles.detailModalTitle}>Event Details</Text>
                    <TouchableOpacity
                      onPress={closeModals}
                      style={styles.detailCloseButton}>
                      <CloseIcon size={24} color="#2a2a2a" />
                    </TouchableOpacity>
                  </View>

                  {selectedEvent.thumbnailUrl && (
                    <Image
                      source={{uri: selectedEvent.thumbnailUrl}}
                      style={styles.sportEventImage}
                      resizeMode="contain"
                    />
                  )}

                  {selectedEvent.type === 'pdf' && selectedEvent.url && (
                    <View style={styles.pdfContainer}>
                      {pdfLoading && (
                        <View style={styles.pdfLoadingContainer}>
                          <ActivityIndicator
                            size="large"
                            color={AppColors.primary}
                          />
                          <Text style={styles.pdfLoadingText}>
                            Loading PDF...
                          </Text>
                        </View>
                      )}
                      <Pdf
                        trustAllCerts={false}
                        source={{
                          uri: selectedEvent.url,
                          cache: true,
                        }}
                        style={styles.pdfWebView}
                        onLoadComplete={(numberOfPages, filePath) => {
                          console.log('✅ PDF loaded successfully');
                          console.log(`Number of pages: ${numberOfPages}`);
                          setTotalPages(numberOfPages);
                          setPdfLoading(false);
                        }}
                        onPageChanged={(page, numberOfPages) => {
                          console.log(`Current page: ${page}/${numberOfPages}`);
                          setCurrentPage(page);
                        }}
                        onError={error => {
                          console.error('❌ PDF Error:', error);
                          setPdfLoading(false);
                          Alert.alert(
                            'Error',
                            'Could not load PDF. Please check your internet connection and try again.',
                          );
                        }}
                        enablePaging={true}
                        horizontal={false}
                        fitPolicy={0}
                        spacing={10}
                        enableAntialiasing={true}
                      />
                      {!pdfLoading && totalPages > 0 && (
                        <View style={styles.pdfPageIndicator}>
                          <Text style={styles.pdfPageText}>
                            📖 Page {currentPage} / {totalPages}
                          </Text>
                        </View>
                      )}
                    </View>
                  )}

                  {selectedEvent.type !== 'image' &&
                    selectedEvent.type !== 'pdf' &&
                    selectedEvent.url && (
                      <View style={styles.detailModalImageContainer}>
                        <Image
                          source={{
                            uri: getFullImageUrl(
                              selectedEvent.thumbnailUrl || selectedEvent.url,
                            ),
                          }}
                          style={styles.detailModalImage}
                          resizeMode="cover"
                        />
                      </View>
                    )}

                  {/* Event Title */}
                  <Text style={styles.detailModalEventTitle}>
                    {selectedEvent.title}
                  </Text>

                  {/* Organizer Info */}
                  <View style={styles.detailModalOrganizerContainer}>
                    <Text style={styles.detailModalOrganizer}>
                      Organized by {selectedEvent.organizer}
                    </Text>
                    <View
                      style={[
                        styles.eventTypeBadge,
                        {
                          backgroundColor: getEventTypeColor(
                            selectedEvent.eventType,
                          ),
                        },
                      ]}>
                      <Text style={styles.eventTypeBadgeText}>
                        {selectedEvent.eventType.toUpperCase()}
                      </Text>
                    </View>
                  </View>

                  {/* Event Details */}
                  <View style={styles.detailsSection}>
                    <Text style={styles.sectionTitle}>Event Information</Text>

                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>📅 Date:</Text>
                      <Text style={styles.detailValue}>
                        {formatEventDate(selectedEvent.eventDate)}
                      </Text>
                    </View>

                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>📍 Location:</Text>
                      <Text style={styles.detailValue}>
                        {selectedEvent.location}
                      </Text>
                    </View>

                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>🏷️ Category:</Text>
                      <Text style={styles.detailValue}>
                        {selectedEvent.category}
                      </Text>
                    </View>

                    {selectedEvent.registrationFee && (
                      <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>💰 Fee:</Text>
                        <Text style={styles.detailValue}>
                          {selectedEvent.registrationFee}
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Description */}
                  <View style={styles.detailsSection}>
                    <Text style={styles.sectionTitle}>Description</Text>
                    <Text style={styles.descriptionText}>
                      {selectedEvent.description}
                    </Text>
                  </View>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  // Event Card Component
  const EventCard = ({item}: {item: SportsEvent}) => (
    <TouchableOpacity
      style={styles.eventCard}
      onPress={() => openEvent(item)}
      activeOpacity={0.8}>
      <View style={styles.eventHeader}>
        <View
          style={[
            styles.typeIndicator,
            {backgroundColor: getEventTypeColor(item.eventType)},
          ]}>
          {item.type === 'pdf' && <PdfIcon size={24} color={AppColors.white} />}
          {item.type === 'image' && (
            <ImageIcon size={24} color={AppColors.white} />
          )}
        </View>
        {item.isUpcoming && (
          <View style={styles.upcomingBadge}>
            <TrophyIcon size={12} color={AppColors.white} />
            <Text style={styles.upcomingText}>UPCOMING</Text>
          </View>
        )}
      </View>

      {item.thumbnailUrl && (
        <Image
          source={{uri: item.thumbnailUrl}}
          style={styles.sportEventImage}
          resizeMode="contain"
        />
      )}

      <View style={styles.eventInfo}>
        <Text style={styles.eventTitle}>{item.title}</Text>
        <Text style={styles.organizerName}>{item.organizer}</Text>
        <Text style={styles.eventDescription} numberOfLines={3}>
          {item.description}
        </Text>

        <View style={styles.eventDetails}>
          <View style={styles.detailRow}>
            <CalendarIcon size={14} color={AppColors.gray} />
            <Text style={styles.detailText}>
              {formatEventDate(item.eventDate)}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <MapIcon size={14} color={AppColors.gray} />
            <Text style={styles.detailText}>{item.location}</Text>
          </View>
        </View>

        <View style={styles.eventFooter}>
          <View style={styles.eventMeta}>
            <Text style={styles.categoryText}>{item.category}</Text>
            {item.registrationFee && (
              <Text style={styles.feeText}>{item.registrationFee}</Text>
            )}
          </View>
          <View style={styles.badgeContainer}>
            <View
              style={[
                styles.typeBadge,
                {backgroundColor: getEventTypeColor(item.eventType)},
              ]}>
              <Text style={styles.typeBadgeText}>
                {item.eventType.toUpperCase()}
              </Text>
            </View>
            <View
              style={[
                styles.formatBadge,
                {backgroundColor: AppColors.primary},
              ]}>
              <Text style={styles.formatBadgeText}>
                {item.type.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={AppColors.primary} />
        <Text style={styles.loadingText}>Loading sports events...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={AppColors.primary} barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <BackIcon size={24} color={AppColors.white} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Sports</Text>
          <Text style={styles.headerSubtitle}>
            {filteredEvents.length} events available
          </Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{sportsEvents.length}</Text>
          <Text style={styles.statLabel}>Total Events</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {sportsEvents.filter(e => e.eventType === 'tournament').length}
          </Text>
          <Text style={styles.statLabel}>Tournaments</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {sportsEvents.filter(e => e.eventType === 'match').length}
          </Text>
          <Text style={styles.statLabel}>Matches</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {sportsEvents.filter(e => e.isUpcoming).length}
          </Text>
          <Text style={styles.statLabel}>Upcoming</Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <SearchIcon size={20} color={AppColors.gray} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search events, sports, organizers, locations..."
          placeholderTextColor={AppColors.gray}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearchQuery('')}
            style={styles.clearSearchIcon}>
            <CloseIcon size={20} color={AppColors.gray} />
          </TouchableOpacity>
        )}
      </View>

      {/* Event List */}
      <FlatList
        data={filteredEvents}
        renderItem={({item}) => <EventCard item={item} />}
        keyExtractor={item => item._id}
        style={styles.eventList}
        showsVerticalScrollIndicator={false}
        numColumns={1}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[AppColors.primary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No Events Found</Text>
            <Text style={styles.emptyText}>
              {searchQuery
                ? 'Try adjusting your search terms'
                : 'No sports events available'}
            </Text>
          </View>
        }
      />

      <EventDetailModal />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.lightGray,
  },

  // Header styles
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

  // Stats styles
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: AppColors.white,
    paddingHorizontal: 15,
    paddingVertical: 15,
    justifyContent: 'space-around',
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

  // Search styles
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.white,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    margin: 16,
    shadowColor: AppColors.black,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: AppColors.dark,
    marginLeft: 8,
    paddingVertical: 4,
  },
  clearSearchIcon: {
    padding: 4,
  },

  // Event List styles
  eventList: {
    flex: 1,
    paddingHorizontal: 10,
  },
  eventCard: {
    backgroundColor: AppColors.white,
    marginHorizontal: 5,
    marginVertical: 6,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    paddingBottom: 8,
  },
  typeIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  upcomingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.warning,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  upcomingText: {
    fontSize: 10,
    color: AppColors.white,
    fontWeight: 'bold',
  },
  imagePreview: {
    height: 120,
    marginHorizontal: 12,
    marginBottom: 8,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: AppColors.lightGray,
  },
  detailModalImageContainer: {
    width: '100%',
    overflow: 'hidden',
    resizeMode: 'cover',
    marginBottom: 16,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  eventInfo: {
    padding: 12,
    paddingTop: 0,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.dark,
    marginBottom: 4,
    lineHeight: 20,
  },
  organizerName: {
    fontSize: 13,
    color: AppColors.primary,
    fontWeight: '500',
    marginBottom: 6,
  },
  eventDescription: {
    fontSize: 13,
    color: AppColors.gray,
    lineHeight: 18,
    marginBottom: 10,
  },
  eventDetails: {
    marginBottom: 10,
    gap: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 12,
    color: AppColors.gray,
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  eventMeta: {
    flex: 1,
  },
  categoryText: {
    fontSize: 12,
    color: AppColors.sport,
    fontWeight: '600',
    marginBottom: 2,
  },
  feeText: {
    fontSize: 11,
    color: AppColors.teal,
    fontWeight: '500',
  },
  badgeContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  typeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  typeBadgeText: {
    fontSize: 10,
    color: AppColors.white,
    fontWeight: '500',
  },
  formatBadge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  formatBadgeText: {
    fontSize: 10,
    color: AppColors.white,
    fontWeight: '500',
  },

  // Loading & Empty states
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

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
  },
  modalHeader: {
    paddingTop: StatusBar.currentHeight || 40,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  modalHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: AppColors.white,
    marginRight: 20,
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  imageModalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  fullScreenImage: {
    width: width - 40,
    height: height - 200,
    borderRadius: 8,
  },
  modalFooter: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: 'center',
  },
  modalFooterText: {
    color: AppColors.white,
    fontSize: 14,
    opacity: 0.8,
  },

  // PDF Modal Styles
  pdfModalContainer: {
    flex: 1,
    backgroundColor: AppColors.white,
  },
  pdfModalHeader: {
    backgroundColor: AppColors.teal,
    paddingTop: StatusBar.currentHeight || 40,
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  pdfHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleContainer: {
    flex: 1,
    marginRight: 20,
  },
  pdfModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: AppColors.white,
  },
  viewerLabel: {
    fontSize: 12,
    color: AppColors.white,
    opacity: 0.9,
    marginTop: 2,
  },
  pdfCloseButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  pdfContent: {
    flex: 1,
  },
  webView: {
    flex: 1,
  },
  loadingSpinner: {
    marginBottom: 20,
    padding: 20,
    backgroundColor: AppColors.white,
    borderRadius: 50,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  loadingEmoji: {
    fontSize: 32,
    textAlign: 'center',
  },

  // Event Detail Modal Styles
  detailModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  detailModalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.9,
  },
  detailModalContent: {
    padding: 10,
  },
  detailModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  detailCloseButton: {
    padding: 8,
  },
  detailModalImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginBottom: 16,
  },

  detailModalFullImage: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
    marginBottom: 16,
    backgroundColor: '#f5f5f5',
  },
  pdfContainer: {
    width: '100%',
    height: 400,
    marginBottom: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    overflow: 'hidden',
  },
  pdfWebView: {
    flex: 1,
  },
  pdfLoadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  pdfLoadingText: {
    marginTop: 10,
    fontSize: 14,
    color: AppColors.gray,
  },
  detailModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2a2a2a',
  },
  detailModalEventTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2a2a2a',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  detailModalOrganizerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  detailModalOrganizer: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.primary,
    flex: 1,
  },
  eventTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  eventTypeBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: AppColors.white,
  },
  detailsSection: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2a2a2a',
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailLabel: {
    fontSize: 14,
    color: AppColors.gray,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#2a2a2a',
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  descriptionText: {
    fontSize: 14,
    color: '#2a2a2a',
    lineHeight: 20,
  },
  sportEventImage: {
    width: '100%',
    minHeight: 200,
    maxHeight: 400,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: '#f5f5f5',
  },
  pdfPageIndicator: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  pdfPageText: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: AppColors.white,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    fontSize: 12,
    fontWeight: '600',
  },
});

export default SportsScreen;
