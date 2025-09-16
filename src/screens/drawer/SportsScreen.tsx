import React, { useState, useEffect } from 'react';
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
import { WebView } from 'react-native-webview';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

// Custom SVG Icons
const SearchIcon = ({ size = 24, color = "#2a2a2a" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" fill={color}/>
  </Svg>
);

const CloseIcon = ({ size = 24, color = "#666" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill={color}/>
  </Svg>
);

const PdfIcon = ({ size = 24, color = "#fff" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" fill={color}/>
  </Svg>
);

const ImageIcon = ({ size = 24, color = "#fff" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M8.5,13.5L11,16.5L14.5,12L19,18H5M21,19V5C21,3.89 20.1,3 19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19Z" fill={color}/>
  </Svg>
);

const SportIcon = ({ size = 24, color = "#fff" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="none"/>
    <Path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke={color} strokeWidth="2" fill="none"/>
  </Svg>
);

const BackIcon = ({ size = 24, color = "#fff" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M19 12H5M12 19L5 12L12 5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const TrophyIcon = ({ size = 16, color = "#666" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M6 9a9 9 0 1 0 12 0" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M12 16v6M8 22h8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const CalendarIcon = ({ size = 16, color = "#666" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke={color} strokeWidth="2" fill="none"/>
    <Path d="M16 2v4M8 2v4M3 10h18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const MapIcon = ({ size = 16, color = "#666" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke={color} strokeWidth="2" fill="none"/>
    <Circle cx="12" cy="10" r="3" stroke={color} strokeWidth="2" fill="none"/>
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
  id: string;
  title: string;
  organizer: string;
  location: string;
  description: string;
  category: string;
  type: 'pdf' | 'image' | 'event';
  url: string;
  thumbnailUrl?: string;
  eventDate: string;
  registrationFee: string;
  eventType: 'tournament' | 'match' | 'training';
  postedBy: string;
  language: string;
  isUpcoming?: boolean;
}

// Dummy data with sports events, tournaments, and matches
const sportsEvents: SportsEvent[] = [
  {
    id: '1',
    title: 'Annual Cricket Championship 2025',
    organizer: 'Mumbai Cricket Association',
    location: 'Wankhede Stadium, Mumbai',
    description: 'Join the biggest cricket tournament of the year! Open registration for all age groups. Tournament rules, fixtures, and registration details included in the official brochure.',
    category: 'Cricket',
    type: 'pdf',
    url: 'https://morth.nic.in/sites/default/files/dd12-13_0.pdf',
    eventDate: '15-20 March 2025',
    registrationFee: '₹500 per team',
    eventType: 'tournament',
    postedBy: 'Cricket Committee',
    language: 'English',
    isUpcoming: true
  },
  {
    id: '2',
    title: 'Football League Season Opener',
    organizer: 'Delhi Football Club',
    location: 'Jawaharlal Nehru Stadium, Delhi',
    description: 'Season opening match poster with team lineups, match schedule, and ticket information. Support your local teams in this exciting football championship.',
    category: 'Football',
    type: 'image',
    url: 'https://images.rawpixel.com/image_png_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvam9iNjgwLTE2Ni1wLWwxZGJ1cTN2LnBuZw.png',
    thumbnailUrl: 'https://images.rawpixel.com/image_png_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvam9iNjgwLTE2Ni1wLWwxZGJ1cTN2LnBuZw.png',
    eventDate: '5 April 2025',
    registrationFee: '₹200-800',
    eventType: 'match',
    postedBy: 'Football Association',
    language: 'Hindi'
  },
  {
    id: '3',
    title: 'Basketball Training Camp Brochure',
    organizer: 'Bangalore Basketball Academy',
    location: 'Sports Complex, Bangalore',
    description: 'Professional basketball training camp for youth players. Complete training schedule, coaching staff details, and registration process outlined in detailed brochure.',
    category: 'Basketball',
    type: 'pdf',
    url: 'https://morth.nic.in/sites/default/files/dd12-13_0.pdf',
    eventDate: '1-30 April 2025',
    registrationFee: '₹3000 per month',
    eventType: 'training',
    postedBy: 'Basketball Coach',
    language: 'English',
    isUpcoming: true
  },
  {
    id: '4',
    title: 'Tennis Tournament Results',
    organizer: 'Chennai Tennis Club',
    location: 'SDAT Tennis Stadium, Chennai',
    description: 'Final results and winners of the annual tennis championship. Complete bracket results, match scores, and winner photographs in commemorative poster format.',
    category: 'Tennis',
    type: 'image',
    url: 'https://images.rawpixel.com/image_png_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvam9iNjgwLTE2Ni1wLWwxZGJ1cTN2LnBuZw.png',
    thumbnailUrl: 'https://images.rawpixel.com/image_png_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvam9iNjgwLTE2Ni1wLWwxZGJ1cTN2LnBuZw.png',
    eventDate: 'Completed Feb 2025',
    registrationFee: 'Results Only',
    eventType: 'tournament',
    postedBy: 'Tennis Club Secretary',
    language: 'English'
  },
  {
    id: '5',
    title: 'Swimming Championship Guidelines',
    organizer: 'Hyderabad Aquatic Center',
    location: 'Olympic Pool, Hyderabad',
    description: 'Official swimming competition rules, event categories, timing standards, and registration procedures. All participants must review these guidelines before registration.',
    category: 'Swimming',
    type: 'pdf',
    url: 'https://morth.nic.in/sites/default/files/dd12-13_0.pdf',
    eventDate: '10-12 May 2025',
    registrationFee: '₹300 per event',
    eventType: 'tournament',
    postedBy: 'Swimming Association',
    language: 'English',
    isUpcoming: true
  },
  {
    id: '6',
    title: 'Athletic Meet Event Poster',
    organizer: 'Pune Athletic Club',
    location: 'Shiv Chhatrapati Sports Complex',
    description: 'Annual athletic meet featuring track and field events. Event schedule, participant guidelines, and prize distribution details in colorful event poster.',
    category: 'Athletics',
    type: 'image',
    url: 'https://images.rawpixel.com/image_png_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvam9iNjgwLTE2Ni1wLWwxZGJ1cTN2LnBuZw.png',
    thumbnailUrl: 'https://images.rawpixel.com/image_png_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvam9iNjgwLTE2Ni1wLWwxZGJ1cTN2LnBuZw.png',
    eventDate: '25-27 April 2025',
    registrationFee: '₹150 per event',
    eventType: 'tournament',
    postedBy: 'Athletic Committee',
    language: 'Marathi',
    isUpcoming: true
  },
  {
    id: '7',
    title: 'Badminton League Rules & Format',
    organizer: 'Kolkata Badminton Association',
    location: 'Netaji Indoor Stadium, Kolkata',
    description: 'Complete league format, match rules, player regulations, and tournament structure for the professional badminton league season.',
    category: 'Badminton',
    type: 'pdf',
    url: 'https://morth.nic.in/sites/default/files/dd12-13_0.pdf',
    eventDate: 'June-Aug 2025',
    registrationFee: '₹1000 per player',
    eventType: 'tournament',
    postedBy: 'League Organizer',
    language: 'English'
  },
  {
    id: '8',
    title: 'Volleyball Championship Highlights',
    organizer: 'Goa Volleyball Federation',
    location: 'Beach Sports Arena, Goa',
    description: 'Championship highlights, winning moments, team photographs, and tournament memories captured in this commemorative poster presentation.',
    category: 'Volleyball',
    type: 'image',
    url: 'https://images.rawpixel.com/image_png_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvam9iNjgwLTE2Ni1wLWwxZGJ1cTN2LnBuZw.png',
    thumbnailUrl: 'https://images.rawpixel.com/image_png_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvam9iNjgwLTE2Ni1wLWwxZGJ1cTN2LnBuZw.png',
    eventDate: 'Completed Jan 2025',
    registrationFee: 'Highlights Only',
    eventType: 'tournament',
    postedBy: 'Sports Photographer',
    language: 'English'
  }
];

const getEventTypeColor = (eventType: string) => {
  switch(eventType) {
    case 'tournament': return AppColors.sport;
    case 'match': return AppColors.blue;
    case 'training': return AppColors.green;
    default: return AppColors.gray;
  }
};

const SportsScreen = () => {
  const navigation = useNavigation();
  const [filteredEvents, setFilteredEvents] = useState<SportsEvent[]>(sportsEvents);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<SportsEvent | null>(null);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [pdfModalVisible, setPdfModalVisible] = useState(false);

  // Filter events based on search only
  useEffect(() => {
    filterEvents();
  }, [searchQuery]);

  const filterEvents = () => {
    let filtered = sportsEvents;

    // Apply search filter only
    if (searchQuery.trim()) {
      filtered = filtered.filter(event => {
        const query = searchQuery.toLowerCase();
        return (
          event.title.toLowerCase().includes(query) ||
          event.description.toLowerCase().includes(query) ||
          event.category.toLowerCase().includes(query) ||
          event.organizer.toLowerCase().includes(query) ||
          event.location.toLowerCase().includes(query)
        );
      });
    }

    setFilteredEvents(filtered);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const openEvent = (event: SportsEvent) => {
    setSelectedEvent(event);
    if (event.type === 'image') {
      setImageModalVisible(true);
    } else if (event.type === 'pdf') {
      setPdfModalVisible(true);
    } else {
      Alert.alert('Event Details', `${event.title}\n\n${event.description}\n\nDate: ${event.eventDate}\nLocation: ${event.location}\nFee: ${event.registrationFee}`, [
        { text: 'Close', style: 'cancel' }
      ]);
    }
  };

  const closeModals = () => {
    setImageModalVisible(false);
    setPdfModalVisible(false);
    setSelectedEvent(null);
  };

  // PDF Modal Component
  const PdfModal = () => {
    const getPdfViewerUrl = (pdfUrl: string) => {
      return `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(pdfUrl)}`;
    };

    return (
      <Modal
        visible={pdfModalVisible}
        transparent={false}
        animationType="slide"
        onRequestClose={closeModals}
      >
        <View style={styles.pdfModalContainer}>
          <StatusBar backgroundColor={AppColors.teal} barStyle="light-content" />
          <View style={styles.pdfModalHeader}>
            <View style={styles.pdfHeaderContent}>
              <View style={styles.titleContainer}>
                <Text style={styles.pdfModalTitle} numberOfLines={1}>
                  {selectedEvent?.title}
                </Text>
                <Text style={styles.viewerLabel}>🏆 Sports Event</Text>
              </View>
              <TouchableOpacity onPress={closeModals} style={styles.pdfCloseButton}>
                <CloseIcon size={24} color={AppColors.white} />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.pdfContent}>
            {selectedEvent && (
              <WebView
                source={{ uri: getPdfViewerUrl(selectedEvent.url) }}
                style={styles.webView}
                startInLoadingState={true}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                renderLoading={() => (
                  <View style={styles.loadingContainer}>
                    <View style={styles.loadingSpinner}>
                      <Text style={styles.loadingEmoji}>📋</Text>
                    </View>
                    <Text style={styles.loadingText}>Loading Event Details...</Text>
                  </View>
                )}
                onError={() => {
                  Alert.alert('Error', 'Unable to load event details');
                }}
              />
            )}
          </View>
        </View>
      </Modal>
    );
  };

  // Image Modal Component
  const ImageModal = () => (
    <Modal
      visible={imageModalVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={closeModals}
    >
      <View style={styles.modalOverlay}>
        <StatusBar backgroundColor="rgba(0,0,0,0.9)" barStyle="light-content" />
        <View style={styles.modalHeader}>
          <View style={styles.modalHeaderContent}>
            <Text style={styles.modalTitle} numberOfLines={1}>
              {selectedEvent?.title}
            </Text>
            <TouchableOpacity onPress={closeModals} style={styles.closeButton}>
              <CloseIcon size={24} color={AppColors.white} />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.imageModalContent}>
          {selectedEvent && (
            <Image
              source={{ uri: selectedEvent.url }}
              style={styles.fullScreenImage}
              resizeMode="contain"
            />
          )}
        </View>
        
        <View style={styles.modalFooter}>
          <Text style={styles.modalFooterText}>
            {selectedEvent?.organizer} • {selectedEvent?.location}
          </Text>
        </View>
      </View>
    </Modal>
  );

  // Event Card Component
  const EventCard = ({ item }: { item: SportsEvent }) => (
    <TouchableOpacity
      style={styles.eventCard}
      onPress={() => openEvent(item)}
      activeOpacity={0.8}
    >
      <View style={styles.eventHeader}>
        <View style={[styles.typeIndicator, { backgroundColor: getEventTypeColor(item.eventType) }]}>
          {item.type === 'pdf' && <PdfIcon size={24} color={AppColors.white} />}
          {item.type === 'image' && <ImageIcon size={24} color={AppColors.white} />}
          {item.type === 'event' && <SportIcon size={24} color={AppColors.white} />}
        </View>
        {item.isUpcoming && (
          <View style={styles.upcomingBadge}>
            <TrophyIcon size={12} color={AppColors.white} />
            <Text style={styles.upcomingText}>UPCOMING</Text>
          </View>
        )}
      </View>

      {item.type === 'image' && item.thumbnailUrl && (
        <View style={styles.imagePreview}>
          <Image 
            source={{ uri: item.thumbnailUrl }} 
            style={styles.previewImage}
            resizeMode="cover"
          />
        </View>
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
            <Text style={styles.detailText}>{item.eventDate}</Text>
          </View>
          <View style={styles.detailRow}>
            <MapIcon size={14} color={AppColors.gray} />
            <Text style={styles.detailText}>{item.location}</Text>
          </View>
        </View>
        
        <View style={styles.eventFooter}>
          <View style={styles.eventMeta}>
            <Text style={styles.categoryText}>{item.category}</Text>
            <Text style={styles.feeText}>{item.registrationFee}</Text>
          </View>
          <View style={styles.badgeContainer}>
            <View style={[styles.typeBadge, { backgroundColor: getEventTypeColor(item.eventType) }]}>
              <Text style={styles.typeBadgeText}>
                {item.eventType.toUpperCase()}
              </Text>
            </View>
            <View style={[styles.formatBadge, { backgroundColor: AppColors.primary }]}>
              <Text style={styles.formatBadgeText}>{item.type.toUpperCase()}</Text>
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
          <Text style={styles.headerSubtitle}>{filteredEvents.length} events available</Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{sportsEvents.length}</Text>
          <Text style={styles.statLabel}>Total Events</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{sportsEvents.filter(e => e.eventType === 'tournament').length}</Text>
          <Text style={styles.statLabel}>Tournaments</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{sportsEvents.filter(e => e.eventType === 'match').length}</Text>
          <Text style={styles.statLabel}>Matches</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{sportsEvents.filter(e => e.isUpcoming).length}</Text>
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
          <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearSearchIcon}>
            <CloseIcon size={20} color={AppColors.gray} />
          </TouchableOpacity>
        )}
      </View>

      {/* Event List */}
      <FlatList
        data={filteredEvents}
        renderItem={({ item }) => <EventCard item={item} />}
        keyExtractor={(item) => item.id}
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

      <ImageModal />
      <PdfModal />
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
    shadowOffset: { width: 0, height: 1 },
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
    shadowOffset: { width: 0, height: 2 },
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  loadingEmoji: {
    fontSize: 32,
    textAlign: 'center',
  },
});

export default SportsScreen;