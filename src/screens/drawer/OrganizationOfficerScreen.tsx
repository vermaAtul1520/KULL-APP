import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
  SafeAreaView,
  Image,
  Linking,
} from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';

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

const BackIcon = ({ size = 24, color = "#fff" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M19 12H5M12 19L5 12L12 5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const PhoneIcon = ({ size = 16, color = "#666" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke={color} strokeWidth="2" fill="none"/>
  </Svg>
);

const EmailIcon = ({ size = 16, color = "#666" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke={color} strokeWidth="2" fill="none"/>
    <Path d="M22 6L12 13L2 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const CalendarIcon = ({ size = 16, color = "#666" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M8 2v4M16 2v4M3 10h18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6z" stroke={color} strokeWidth="2" fill="none"/>
  </Svg>
);

const CrownIcon = ({ size = 24, color = "#fff" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M5 16L3 6l5.5 4L12 3l3.5 7L21 6l-2 10H5z" stroke={color} strokeWidth="2" fill={color}/>
    <Path d="M5 21h14" stroke={color} strokeWidth="2" strokeLinecap="round"/>
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

// Officer Interface based on your user profile structure
interface Officer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  roleInCommunity: string;
  createdAt: string;
  
  profileImage?: string;
  joinedDate: string;
  isActive: boolean;
  position: string; // Officer position
  department?: string;
  responsibilities?: string[];
}

// Dummy officers data based on your user structure
const officers: Officer[] = [
  {
    _id: "689cdacc78b58ec1abd03a31",
    firstName: "Rajesh",
    lastName: "Sharma",
    email: "rajesh.sharma@example.com",
    phone: "9876543210",
    role: "officer",
    status: "active",
    roleInCommunity: "president",
    createdAt: "2025-08-13T18:34:52.916+00:00",
    
    profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    joinedDate: "2023-01-15",
    isActive: true,
    position: "Community President",
    department: "Administration",
    responsibilities: ["Overall community leadership", "Strategic planning", "External relations", "Board meetings"]
  },
  {
    _id: "689cdacc78b58ec1abd03a32",
    firstName: "Priya",
    lastName: "Patel",
    email: "priya.patel@example.com",
    phone: "9876543211",
    role: "officer",
    status: "active",
    roleInCommunity: "secretary",
    createdAt: "2024-02-20T10:15:30.500+00:00",
    
    profileImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    joinedDate: "2023-03-10",
    isActive: true,
    position: "Secretary",
    department: "Administration",
    responsibilities: ["Meeting minutes", "Document management", "Communication", "Record keeping"]
  },
  {
    _id: "689cdacc78b58ec1abd03a33",
    firstName: "Amit",
    lastName: "Kumar",
    email: "amit.kumar@example.com",
    phone: "9876543212",
    role: "officer",
    status: "active",
    roleInCommunity: "treasurer",
    createdAt: "2024-03-15T14:22:45.750+00:00",
    
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    joinedDate: "2023-04-05",
    isActive: true,
    position: "Treasurer",
    department: "Finance",
    responsibilities: ["Financial management", "Budget planning", "Expense tracking", "Financial reports"]
  },
  {
    _id: "689cdacc78b58ec1abd03a34",
    firstName: "Sunita",
    lastName: "Reddy",
    email: "sunita.reddy@example.com",
    phone: "9876543213",
    role: "officer",
    status: "active",
    roleInCommunity: "welfare_head",
    createdAt: "2024-04-10T16:30:20.200+00:00",
    
    profileImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    joinedDate: "2023-05-20",
    isActive: true,
    position: "Welfare Head",
    department: "Community Welfare",
    responsibilities: ["Resident welfare", "Event planning", "Community services", "Support programs"]
  },
  {
    _id: "689cdacc78b58ec1abd03a35",
    firstName: "Ravi",
    lastName: "Singh",
    email: "ravi.singh@example.com",
    phone: "9876543214",
    role: "officer",
    status: "active",
    roleInCommunity: "security_head",
    createdAt: "2024-05-08T12:45:10.100+00:00",
    
    profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    joinedDate: "2023-06-12",
    isActive: true,
    position: "Security Head",
    department: "Security & Safety",
    responsibilities: ["Security management", "Safety protocols", "Emergency response", "Vendor coordination"]
  },
  {
    _id: "689cdacc78b58ec1abd03a36",
    firstName: "Meera",
    lastName: "Joshi",
    email: "meera.joshi@example.com",
    phone: "9876543215",
    role: "officer",
    status: "active",
    roleInCommunity: "maintenance_head",
    createdAt: "2024-06-12T09:20:35.300+00:00",
    
    profileImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
    joinedDate: "2023-07-18",
    isActive: true,
    position: "Maintenance Head",
    department: "Infrastructure",
    responsibilities: ["Maintenance oversight", "Infrastructure planning", "Contractor management", "Facility upkeep"]
  },
  {
    _id: "689cdacc78b58ec1abd03a37",
    firstName: "Vikash",
    lastName: "Agrawal",
    email: "vikash.agrawal@example.com",
    phone: "9876543216",
    role: "officer",
    status: "active",
    roleInCommunity: "cultural_head",
    createdAt: "2024-07-20T11:15:25.800+00:00",
    
    profileImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
    joinedDate: "2023-08-25",
    isActive: true,
    position: "Cultural Head",
    department: "Events & Culture",
    responsibilities: ["Cultural events", "Festival organization", "Entertainment programs", "Community engagement"]
  }
];

const getPositionColor = (roleInCommunity: string) => {
  switch(roleInCommunity) {
    case 'president': return AppColors.sport;
    case 'secretary': return AppColors.blue;
    case 'treasurer': return AppColors.green;
    case 'welfare_head': return AppColors.purple;
    case 'security_head': return AppColors.orange;
    case 'maintenance_head': return AppColors.teal;
    case 'cultural_head': return '#e91e63';
    default: return AppColors.gray;
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

const getYearsOfService = (joinedDate: string) => {
  const joined = new Date(joinedDate);
  const now = new Date();
  const years = Math.floor((now.getTime() - joined.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
  const months = Math.floor(((now.getTime() - joined.getTime()) % (365.25 * 24 * 60 * 60 * 1000)) / (30.44 * 24 * 60 * 60 * 1000));
  
  if (years > 0) {
    return `${years}+ year${years > 1 ? 's' : ''}`;
  } else {
    return `${months} month${months > 1 ? 's' : ''}`;
  }
};

const OfficersScreen = () => {
  const navigation = useNavigation();
  const [filteredOfficers, setFilteredOfficers] = useState<Officer[]>(officers);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter officers based on search
  useEffect(() => {
    filterOfficers();
  }, [searchQuery]);

  const filterOfficers = () => {
    let filtered = officers;

    if (searchQuery.trim()) {
      filtered = filtered.filter(officer => {
        const query = searchQuery.toLowerCase();
        return (
          officer.firstName.toLowerCase().includes(query) ||
          officer.lastName.toLowerCase().includes(query) ||
          officer.position.toLowerCase().includes(query) ||
          officer.department?.toLowerCase().includes(query) ||
          officer.email.toLowerCase().includes(query) ||
          officer.roleInCommunity.toLowerCase().includes(query)
        );
      });
    }

    setFilteredOfficers(filtered);
  };

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate API refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleEmail = (email: string) => {
    Linking.openURL(`mailto:${email}`);
  };

  // Officer Card Component
  const OfficerCard = ({ item }: { item: Officer }) => (
    <View style={styles.officerCard}>
      <View style={styles.cardHeader}>
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <Image 
              source={{ uri: item.profileImage || 'https://via.placeholder.com/80' }} 
              style={styles.profileImage}
            />
            <View style={[styles.statusIndicator, { backgroundColor: item.isActive ? AppColors.success : AppColors.gray }]} />
          </View>
          
          <View style={styles.profileInfo}>
            <Text style={styles.officerName}>
              {item.firstName} {item.lastName}
            </Text>
            <View style={[styles.positionBadge, { backgroundColor: getPositionColor(item.roleInCommunity) }]}>
              <CrownIcon size={14} color={AppColors.white} />
              <Text style={styles.positionText}>{item.position}</Text>
            </View>
            {item.department && (
              <Text style={styles.departmentText}>{item.department}</Text>
            )}
          </View>
        </View>

        <View style={styles.serviceInfo}>
          <Text style={styles.serviceYears}>{getYearsOfService(item.joinedDate)}</Text>
          <Text style={styles.serviceLabel}>of service</Text>
        </View>
      </View>

      {/* Responsibilities */}
      {item.responsibilities && item.responsibilities.length > 0 && (
        <View style={styles.responsibilitiesSection}>
          <Text style={styles.responsibilitiesTitle}>Key Responsibilities:</Text>
          <View style={styles.responsibilitiesList}>
            {item.responsibilities.slice(0, 2).map((responsibility, index) => (
              <Text key={index} style={styles.responsibilityItem}>• {responsibility}</Text>
            ))}
            {item.responsibilities.length > 2 && (
              <Text style={styles.moreResponsibilities}>
                +{item.responsibilities.length - 2} more...
              </Text>
            )}
          </View>
        </View>
      )}

      {/* Contact Information */}
      <View style={styles.contactSection}>
        <View style={styles.contactRow}>
          <View style={styles.contactItem}>
            <EmailIcon size={14} color={AppColors.gray} />
            <Text style={styles.contactText}>{item.email}</Text>
          </View>
          <TouchableOpacity 
            style={styles.contactButton}
            onPress={() => handleEmail(item.email)}
          >
            <Text style={styles.contactButtonText}>Email</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.contactRow}>
          <View style={styles.contactItem}>
            <PhoneIcon size={14} color={AppColors.gray} />
            <Text style={styles.contactText}>{item.phone}</Text>
          </View>
          <TouchableOpacity 
            style={styles.contactButton}
            onPress={() => handleCall(item.phone)}
          >
            <Text style={styles.contactButtonText}>Call</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Footer Info */}
      <View style={styles.cardFooter}>
        <View style={styles.footerItem}>
          <CalendarIcon size={12} color={AppColors.gray} />
          <Text style={styles.footerText}>Joined: {formatDate(item.joinedDate)}</Text>
        </View>
        <View style={[styles.statusChip, { backgroundColor: item.status === 'active' ? AppColors.success : AppColors.gray }]}>
          <Text style={styles.statusChipText}>{item.status.toUpperCase()}</Text>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={AppColors.primary} />
        <Text style={styles.loadingText}>Loading officers...</Text>
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
          <Text style={styles.headerTitle}>Community Officers</Text>
          <Text style={styles.headerSubtitle}>{filteredOfficers.length} active officers</Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{officers.length}</Text>
          <Text style={styles.statLabel}>Total Officers</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{officers.filter(o => o.status === 'active').length}</Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{new Set(officers.map(o => o.department)).size}</Text>
          <Text style={styles.statLabel}>Departments</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{Math.round(officers.reduce((sum, o) => sum + parseFloat(getYearsOfService(o.joinedDate)), 0) / officers.length * 10) / 10}</Text>
          <Text style={styles.statLabel}>Avg. Experience</Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <SearchIcon size={20} color={AppColors.gray} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search officers, positions, departments..."
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

      {/* Officers List */}
      <FlatList
        data={filteredOfficers}
        renderItem={({ item }) => <OfficerCard item={item} />}
        keyExtractor={(item) => item._id}
        style={styles.officersList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[AppColors.primary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No Officers Found</Text>
            <Text style={styles.emptyText}>
              {searchQuery
                ? 'Try adjusting your search terms'
                : 'No officers available'}
            </Text>
          </View>
        }
      />
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
    fontSize: 18,
    fontWeight: 'bold',
    color: AppColors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
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
  
  // Officers List styles
  officersList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  officerCard: {
    backgroundColor: AppColors.white,
    marginVertical: 8,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  
  // Card Header
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  profileSection: {
    flexDirection: 'row',
    flex: 1,
  },
  profileImageContainer: {
    position: 'relative',
    marginRight: 12,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: AppColors.lightGray,
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: AppColors.white,
  },
  profileInfo: {
    flex: 1,
    paddingTop: 4,
  },
  officerName: {
    fontSize: 18,
    fontWeight: '600',
    color: AppColors.dark,
    marginBottom: 4,
  },
  positionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
    gap: 4,
  },
  positionText: {
    fontSize: 12,
    color: AppColors.white,
    fontWeight: '600',
  },
  departmentText: {
    fontSize: 13,
    color: AppColors.gray,
    fontStyle: 'italic',
  },
  serviceInfo: {
    alignItems: 'flex-end',
  },
  serviceYears: {
    fontSize: 16,
    fontWeight: 'bold',
    color: AppColors.primary,
  },
  serviceLabel: {
    fontSize: 11,
    color: AppColors.gray,
  },
  
  // Responsibilities Section
  responsibilitiesSection: {
    marginBottom: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: AppColors.border,
  },
  responsibilitiesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.dark,
    marginBottom: 6,
  },
  responsibilitiesList: {
    gap: 2,
  },
  responsibilityItem: {
    fontSize: 13,
    color: AppColors.gray,
    lineHeight: 18,
  },
  moreResponsibilities: {
    fontSize: 12,
    color: AppColors.primary,
    fontWeight: '500',
    marginTop: 2,
  },
  
  // Contact Section
  contactSection: {
    gap: 8,
    marginBottom: 12,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  contactText: {
    fontSize: 13,
    color: AppColors.gray,
    flex: 1,
  },
  contactButton: {
    backgroundColor: AppColors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  contactButtonText: {
    fontSize: 12,
    color: AppColors.white,
    fontWeight: '500',
  },
  
  // Card Footer
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: AppColors.border,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerText: {
    fontSize: 12,
    color: AppColors.gray,
  },
  statusChip: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  statusChipText: {
    fontSize: 10,
    color: AppColors.white,
    fontWeight: '600',
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
});

export default OfficersScreen;