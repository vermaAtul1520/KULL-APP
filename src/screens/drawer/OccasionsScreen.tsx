import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
  Dimensions,
  Modal,
} from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

const { width } = Dimensions.get('window');

const AppColors = {
  primary: '#7dd3c0',
  black: '#000000',
  white: '#ffffff',
  gray: '#666666',
  dark: '#2a2a2a',
  teal: '#1e6b5c',
  cream: '#f5f5dc',
  lightGray: '#f8f9fa',
  border: '#e5e7eb',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  blue: '#3b82f6',
  purple: '#8b5cf6',
  orange: '#f97316',
};

// SVG Icons
const CalendarIcon = ({ size = 20, color = "#666", filled = false }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="4" width="18" height="18" rx="2" ry="2" 
          fill={filled ? color : "none"} 
          stroke={color} 
          strokeWidth="2"/>
    <Path d="M16 2v4M8 2v4M3 10h18" 
          stroke={color} 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"/>
  </Svg>
);

const LocationIcon = ({ size = 20, color = "#666", filled = false }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" 
          fill={filled ? color : "none"} 
          stroke={color} 
          strokeWidth="2"/>
    <Circle cx="12" cy="10" r="3" 
            fill={filled ? "#fff" : "none"} 
            stroke={filled ? "#fff" : color} 
            strokeWidth="2"/>
  </Svg>
);

const ClockIcon = ({ size = 20, color = "#666", filled = false }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" 
            fill={filled ? color : "none"} 
            stroke={color} 
            strokeWidth="2"/>
    <Path d="M12 6v6l4 2" 
          stroke={filled ? "#fff" : color} 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"/>
  </Svg>
);

const PeopleIcon = ({ size = 20, color = "#666", filled = false }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" 
          fill={filled ? color : "none"} 
          stroke={color} 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"/>
    <Circle cx="9" cy="7" r="4" 
            fill={filled ? color : "none"} 
            stroke={color} 
            strokeWidth="2"/>
    <Path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" 
          stroke={color} 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"/>
  </Svg>
);

const StarIcon = ({ size = 20, color = "#666", filled = false }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" 
          fill={filled ? color : "none"} 
          stroke={color} 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"/>
  </Svg>
);

const HeartIcon = ({ size = 20, color = "#666", filled = false }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" 
          fill={filled ? color : "none"} 
          stroke={color} 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"/>
  </Svg>
);

const ShareIcon = ({ size = 20, color = "#666", filled = false }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="18" cy="5" r="3" 
            fill={filled ? color : "none"} 
            stroke={color} 
            strokeWidth="2"/>
    <Circle cx="6" cy="12" r="3" 
            fill={filled ? color : "none"} 
            stroke={color} 
            strokeWidth="2"/>
    <Circle cx="18" cy="19" r="3" 
            fill={filled ? color : "none"} 
            stroke={color} 
            strokeWidth="2"/>
    <Path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" 
          stroke={color} 
          strokeWidth="2"/>
  </Svg>
);

interface Occasion {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  category: string;
  attendees: number;
  maxAttendees?: number;
  organizer: string;
  image?: string;
  isHighlighted: boolean;
  tags: string[];
  registrationRequired: boolean;
  registrationDeadline?: string;
}

const occasions: Occasion[] = [
  {
    id: '1',
    title: 'Diwali Celebration 2025',
    date: '2025-10-24',
    time: '6:00 PM - 10:00 PM',
    location: 'Community Hall, Main Center',
    description: 'Join us for a grand Diwali celebration with traditional performances, delicious food, rangoli competition, and fireworks display. Bring your family and friends for an evening of joy and festivities.',
    category: 'Festival',
    attendees: 245,
    maxAttendees: 300,
    organizer: 'Cultural Committee',
    isHighlighted: true,
    tags: ['Festival', 'Family', 'Food', 'Performance'],
    registrationRequired: true,
    registrationDeadline: '2025-10-20'
  },
  {
    id: '2',
    title: 'Monthly Satsang',
    date: '2025-03-28',
    time: '7:00 AM - 9:00 AM',
    location: 'Prayer Hall',
    description: 'Monthly spiritual gathering with community prayers, bhajan singing, and spiritual discourse. Experience peace and connect with fellow community members.',
    category: 'Religious',
    attendees: 89,
    maxAttendees: 150,
    organizer: 'Spiritual Committee',
    isHighlighted: false,
    tags: ['Spiritual', 'Prayer', 'Community'],
    registrationRequired: false
  },
  {
    id: '3',
    title: 'Youth Sports Tournament',
    date: '2025-04-05',
    time: '9:00 AM - 5:00 PM',
    location: 'Community Sports Ground',
    description: 'Annual sports tournament for youth featuring cricket, badminton, table tennis, and athletics. Prizes for winners and participation certificates for all.',
    category: 'Sports',
    attendees: 156,
    maxAttendees: 200,
    organizer: 'Youth Committee',
    isHighlighted: true,
    tags: ['Sports', 'Youth', 'Competition'],
    registrationRequired: true,
    registrationDeadline: '2025-04-01'
  },
  {
    id: '4',
    title: 'Health & Wellness Workshop',
    date: '2025-03-30',
    time: '10:00 AM - 2:00 PM',
    location: 'Conference Room A',
    description: 'Learn about healthy living, nutrition, yoga, and meditation. Expert speakers will share valuable insights on maintaining physical and mental well-being.',
    category: 'Educational',
    attendees: 67,
    maxAttendees: 100,
    organizer: 'Health Committee',
    isHighlighted: false,
    tags: ['Health', 'Yoga', 'Education'],
    registrationRequired: true,
    registrationDeadline: '2025-03-27'
  },
  {
    id: '5',
    title: 'Community Service Drive',
    date: '2025-04-12',
    time: '8:00 AM - 12:00 PM',
    location: 'Local Schools & Parks',
    description: 'Join our community service initiative to clean local schools and parks. Help make our neighborhood cleaner and greener for everyone.',
    category: 'Service',
    attendees: 123,
    organizer: 'Service Committee',
    isHighlighted: false,
    tags: ['Service', 'Environment', 'Community'],
    registrationRequired: false
  },
  {
    id: '6',
    title: 'Cultural Dance Performance',
    date: '2025-04-18',
    time: '7:00 PM - 9:30 PM',
    location: 'Main Auditorium',
    description: 'Evening of classical and folk dance performances by community members. Witness the rich cultural heritage through beautiful dance forms.',
    category: 'Cultural',
    attendees: 198,
    maxAttendees: 250,
    organizer: 'Cultural Committee',
    isHighlighted: true,
    tags: ['Dance', 'Culture', 'Performance'],
    registrationRequired: false
  }
];

const categories = ['All', 'Festival', 'Religious', 'Sports', 'Educational', 'Service', 'Cultural'];

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Festival': return AppColors.orange;
    case 'Religious': return AppColors.purple;
    case 'Sports': return AppColors.blue;
    case 'Educational': return AppColors.success;
    case 'Service': return AppColors.teal;
    case 'Cultural': return AppColors.danger;
    default: return AppColors.gray;
  }
};

export const OccasionsScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedOccasion, setSelectedOccasion] = useState<Occasion | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  const filteredOccasions = selectedCategory === 'All' 
    ? occasions 
    : occasions.filter(occasion => occasion.category === selectedCategory);

  const toggleFavorite = (occasionId: string) => {
    setFavorites(prev => 
      prev.includes(occasionId) 
        ? prev.filter(id => id !== occasionId)
        : [...prev, occasionId]
    );
  };

  const handleRegister = (occasion: Occasion) => {
    if (occasion.registrationRequired) {
      Alert.alert(
        'Register for Event',
        `Would you like to register for "${occasion.title}"?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Register', 
            onPress: () => Alert.alert('Success', 'Registration successful! You will receive a confirmation email shortly.')
          }
        ]
      );
    } else {
      Alert.alert('Info', 'No registration required for this event. Just show up!');
    }
  };

  const shareEvent = (occasion: Occasion) => {
    const shareText = `Join me at ${occasion.title} on ${new Date(occasion.date).toLocaleDateString()} at ${occasion.location}. ${occasion.description}`;
    Alert.alert('Share Event', shareText);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getAttendancePercentage = (occasion: Occasion) => {
    if (!occasion.maxAttendees) return 0;
    return (occasion.attendees / occasion.maxAttendees) * 100;
  };

  const OccasionCard = ({ occasion }: { occasion: Occasion }) => (
    <TouchableOpacity
      style={[
        styles.occasionCard,
        occasion.isHighlighted && styles.highlightedCard
      ]}
      onPress={() => {
        setSelectedOccasion(occasion);
        setShowModal(true);
      }}
      activeOpacity={0.8}
    >
      {occasion.isHighlighted && (
        <View style={styles.highlightBadge}>
          <StarIcon size={12} color={AppColors.white} filled />
          <Text style={styles.highlightText}>FEATURED</Text>
        </View>
      )}

      <View style={styles.cardHeader}>
        <View style={styles.occasionInfo}>
          <Text style={styles.occasionTitle} numberOfLines={2}>{occasion.title}</Text>
          <View style={styles.organizerContainer}>
            <Text style={styles.organizerText}>by {occasion.organizer}</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => toggleFavorite(occasion.id)}
          style={styles.favoriteButton}
        >
          <HeartIcon 
            size={20} 
            color={favorites.includes(occasion.id) ? AppColors.danger : AppColors.gray}
            filled={favorites.includes(occasion.id)}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.occasionDetails}>
        <View style={styles.detailRow}>
          <CalendarIcon size={16} color={AppColors.primary} />
          <Text style={styles.detailText}>{formatDate(occasion.date)}</Text>
        </View>
        <View style={styles.detailRow}>
          <ClockIcon size={16} color={AppColors.primary} />
          <Text style={styles.detailText}>{occasion.time}</Text>
        </View>
        <View style={styles.detailRow}>
          <LocationIcon size={16} color={AppColors.primary} />
          <Text style={styles.detailText} numberOfLines={1}>{occasion.location}</Text>
        </View>
      </View>

      <Text style={styles.occasionDescription} numberOfLines={3}>
        {occasion.description}
      </Text>

      <View style={styles.tagsContainer}>
        {occasion.tags.slice(0, 3).map((tag, index) => (
          <View key={index} style={[styles.tag, { backgroundColor: getCategoryColor(occasion.category) + '20' }]}>
            <Text style={[styles.tagText, { color: getCategoryColor(occasion.category) }]}>{tag}</Text>
          </View>
        ))}
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.attendanceContainer}>
          <PeopleIcon size={16} color={AppColors.gray} />
          <Text style={styles.attendanceText}>
            {occasion.attendees}{occasion.maxAttendees ? `/${occasion.maxAttendees}` : ''} attending
          </Text>
          {occasion.maxAttendees && (
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${Math.min(getAttendancePercentage(occasion), 100)}%` }
                ]} 
              />
            </View>
          )}
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.shareButton}
            onPress={() => shareEvent(occasion)}
          >
            <ShareIcon size={16} color={AppColors.gray} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.registerButton,
              { backgroundColor: getCategoryColor(occasion.category) }
            ]}
            onPress={() => handleRegister(occasion)}
          >
            <Text style={styles.registerButtonText}>
              {occasion.registrationRequired ? 'Register' : 'Join'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {occasion.registrationDeadline && (
        <View style={styles.deadlineContainer}>
          <Text style={styles.deadlineText}>
            Registration deadline: {formatDate(occasion.registrationDeadline)}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const OccasionModal = () => (
    <Modal
      visible={showModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowModal(false)}
    >
      {selectedOccasion && (
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Event Details</Text>
            <TouchableOpacity
              onPress={() => setShowModal(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.modalEventHeader}>
              <Text style={styles.modalEventTitle}>{selectedOccasion.title}</Text>
              <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(selectedOccasion.category) }]}>
                <Text style={styles.categoryBadgeText}>{selectedOccasion.category}</Text>
              </View>
            </View>

            <View style={styles.modalDetailsSection}>
              <View style={styles.modalDetailRow}>
                <CalendarIcon size={20} color={AppColors.primary} />
                <View style={styles.modalDetailInfo}>
                  <Text style={styles.modalDetailLabel}>Date & Time</Text>
                  <Text style={styles.modalDetailValue}>
                    {formatDate(selectedOccasion.date)} • {selectedOccasion.time}
                  </Text>
                </View>
              </View>

              <View style={styles.modalDetailRow}>
                <LocationIcon size={20} color={AppColors.primary} />
                <View style={styles.modalDetailInfo}>
                  <Text style={styles.modalDetailLabel}>Location</Text>
                  <Text style={styles.modalDetailValue}>{selectedOccasion.location}</Text>
                </View>
              </View>

              <View style={styles.modalDetailRow}>
                <PeopleIcon size={20} color={AppColors.primary} />
                <View style={styles.modalDetailInfo}>
                  <Text style={styles.modalDetailLabel}>Organizer</Text>
                  <Text style={styles.modalDetailValue}>{selectedOccasion.organizer}</Text>
                </View>
              </View>
            </View>

            <View style={styles.descriptionSection}>
              <Text style={styles.descriptionTitle}>About this Event</Text>
              <Text style={styles.descriptionText}>{selectedOccasion.description}</Text>
            </View>

            <View style={styles.attendanceSection}>
              <Text style={styles.attendanceTitle}>Attendance</Text>
              <View style={styles.attendanceStats}>
                <Text style={styles.attendanceCount}>
                  {selectedOccasion.attendees} people attending
                  {selectedOccasion.maxAttendees && ` (${selectedOccasion.maxAttendees} max)`}
                </Text>
                {selectedOccasion.maxAttendees && (
                  <View style={styles.progressBarLarge}>
                    <View 
                      style={[
                        styles.progressFillLarge, 
                        { 
                          width: `${Math.min(getAttendancePercentage(selectedOccasion), 100)}%`,
                          backgroundColor: getCategoryColor(selectedOccasion.category)
                        }
                      ]} 
                    />
                  </View>
                )}
              </View>
            </View>

            <View style={styles.tagsSection}>
              <Text style={styles.tagsTitle}>Tags</Text>
              <View style={styles.tagsGrid}>
                {selectedOccasion.tags.map((tag, index) => (
                  <View key={index} style={[styles.modalTag, { backgroundColor: getCategoryColor(selectedOccasion.category) + '20' }]}>
                    <Text style={[styles.modalTagText, { color: getCategoryColor(selectedOccasion.category) }]}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.shareButtonLarge}
                onPress={() => shareEvent(selectedOccasion)}
              >
                <ShareIcon size={20} color={AppColors.gray} />
                <Text style={styles.shareButtonLargeText}>Share Event</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[
                  styles.registerButtonLarge,
                  { backgroundColor: getCategoryColor(selectedOccasion.category) }
                ]}
                onPress={() => handleRegister(selectedOccasion)}
              >
                <Text style={styles.registerButtonLargeText}>
                  {selectedOccasion.registrationRequired ? 'Register Now' : 'Join Event'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      )}
    </Modal>
  );

  return (
    <View style={styles.container}>
      {/* Stats Header */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{occasions.length}</Text>
          <Text style={styles.statLabel}>Total Events</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{occasions.filter(o => o.isHighlighted).length}</Text>
          <Text style={styles.statLabel}>Featured</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{favorites.length}</Text>
          <Text style={styles.statLabel}>Favorites</Text>
        </View>
      </View>

      {/* Category Filter */}
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
              selectedCategory === category && styles.categoryButtonActive,
              selectedCategory === category && { backgroundColor: getCategoryColor(category) }
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

      {/* Events List */}
      <ScrollView
        style={styles.eventsList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.eventsContent}
      >
        {filteredOccasions.map((occasion) => (
          <OccasionCard key={occasion.id} occasion={occasion} />
        ))}

        {filteredOccasions.length === 0 && (
          <View style={styles.emptyState}>
            <CalendarIcon size={60} color={AppColors.gray} />
            <Text style={styles.emptyTitle}>No Events Found</Text>
            <Text style={styles.emptyText}>
              No events available for this category. Check back later!
            </Text>
          </View>
        )}
      </ScrollView>

      <OccasionModal />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.lightGray,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: AppColors.white,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.border,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: AppColors.primary,
  },
  statLabel: {
    fontSize: 11,
    color: AppColors.gray,
    marginTop: 2,
    textAlign: 'center',
  },
  categoryContainer: {
    backgroundColor: AppColors.white,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.border,
    maxHeight: 60,
  },
  categoryContent: {
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  categoryButton: {
    backgroundColor: AppColors.lightGray,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: AppColors.border,
    minHeight: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryButtonActive: {
    borderColor: 'transparent',
  },
  categoryButtonText: {
    fontSize: 12,
    color: AppColors.dark,
    fontWeight: '500',
    textAlign: 'center',
  },
  categoryButtonTextActive: {
    color: AppColors.white,
  },
  eventsList: {
    flex: 1,
  },
  eventsContent: {
    padding: 12,
  },
  occasionCard: {
    backgroundColor: AppColors.white,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  highlightedCard: {
    borderWidth: 2,
    borderColor: AppColors.warning,
  },
  highlightBadge: {
    position: 'absolute',
    top: -4,
    right: 12,
    backgroundColor: AppColors.warning,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    zIndex: 1,
  },
  highlightText: {
    color: AppColors.white,
    fontSize: 9,
    fontWeight: 'bold',
    marginLeft: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  occasionInfo: {
    flex: 1,
    marginRight: 10,
  },
  occasionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: AppColors.dark,
    marginBottom: 4,
    lineHeight: 20,
  },
  organizerContainer: {
    backgroundColor: AppColors.lightGray,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  organizerText: {
    fontSize: 11,
    color: AppColors.gray,
    fontWeight: '500',
  },
  favoriteButton: {
    padding: 6,
  },
  occasionDetails: {
    marginBottom: 10,
    gap: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 13,
    color: AppColors.dark,
    marginLeft: 6,
    flex: 1,
  },
  occasionDescription: {
    fontSize: 13,
    color: AppColors.gray,
    lineHeight: 18,
    marginBottom: 10,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  tag: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 10,
    marginRight: 4,
    marginBottom: 3,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '500',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  attendanceContainer: {
    flex: 1,
    marginRight: 12,
  },
  attendanceText: {
    fontSize: 12,
    color: AppColors.gray,
    marginLeft: 6,
    marginBottom: 4,
  },
  progressBar: {
    height: 4,
    backgroundColor: AppColors.lightGray,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: AppColors.success,
    borderRadius: 2,
  },
  shareButton: {
    padding: 8,
    marginRight: 8,
  },
  registerButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  registerButtonText: {
    color: AppColors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  deadlineContainer: {
    marginTop: 8,
    padding: 8,
    backgroundColor: AppColors.warning + '20',
    borderRadius: 8,
  },
  deadlineText: {
    fontSize: 11,
    color: AppColors.warning,
    fontWeight: '500',
    textAlign: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: AppColors.dark,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: AppColors.gray,
    textAlign: 'center',
    paddingHorizontal: 40,
  },

  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: AppColors.white,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: AppColors.dark,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: AppColors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: AppColors.dark,
    fontWeight: 'bold',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  modalEventHeader: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.border,
  },
  modalEventTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: AppColors.dark,
    marginBottom: 12,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  categoryBadgeText: {
    color: AppColors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  modalDetailsSection: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.border,
  },
  modalDetailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  modalDetailInfo: {
    marginLeft: 12,
    flex: 1,
  },
  modalDetailLabel: {
    fontSize: 12,
    color: AppColors.gray,
    fontWeight: '500',
    marginBottom: 2,
  },
  modalDetailValue: {
    fontSize: 16,
    color: AppColors.dark,
    fontWeight: '500',
  },
  descriptionSection: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.border,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.dark,
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 14,
    color: AppColors.gray,
    lineHeight: 22,
  },
  attendanceSection: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.border,
  },
  attendanceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.dark,
    marginBottom: 12,
  },
  attendanceStats: {
    marginBottom: 8,
  },
  attendanceCount: {
    fontSize: 14,
    color: AppColors.gray,
    marginBottom: 8,
  },
  progressBarLarge: {
    height: 8,
    backgroundColor: AppColors.lightGray,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFillLarge: {
    height: '100%',
    borderRadius: 4,
  },
  tagsSection: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.border,
  },
  tagsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.dark,
    marginBottom: 12,
  },
  tagsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  modalTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  modalTagText: {
    fontSize: 14,
    fontWeight: '500',
  },
  modalActions: {
    paddingVertical: 20,
    paddingBottom: 40,
  },
  shareButtonLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.lightGray,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  shareButtonLargeText: {
    fontSize: 16,
    color: AppColors.dark,
    fontWeight: '600',
    marginLeft: 8,
  },
  registerButtonLarge: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  registerButtonLargeText: {
    color: AppColors.white,
    fontSize: 16,
    fontWeight: '700',
  },
});