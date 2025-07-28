import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import Svg, { Path, Circle, Rect, G } from 'react-native-svg';

const {width, height} = Dimensions.get('window');

const DonationScreen = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Dummy API URL - replace with your actual API endpoint
  const API_BASE_URL = 'https://your-api-domain.com/api';

  // Dummy data for development/testing
  const dummyDonations = [
    {
      id: 1,
      title: "Help Children's Hospital",
      organization: "Children's Health Foundation",
      accountNumber: "1234567890",
      description: "We are raising funds for the Children's Hospital to help them upgrade their medical equipment and provide better care for young patients.",
      date: "2023-12-01",
      category: "Healthcare",
      urgency: "High",
      qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=hospital@paytm&pn=Children%20Hospital&am=&cu=INR",
      beneficiaries: "500+ children",
      location: "Mumbai, Maharashtra",
      organizationType: "NGO",
      registrationNumber: "NGO/2020/001234",
      contactEmail: "donate@childrenhospital.org",
      contactPhone: "+91-9876543210",
      images: [
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400",
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400"
      ]
    },
    {
      id: 2,
      title: "Support Local Food Bank",
      organization: "Community Food Bank",
      accountNumber: "0987654321",
      description: "Our local food bank is running low on supplies. Your donation can help them feed more families in need during these challenging times.",
      date: "2023-11-20",
      category: "Food Security",
      urgency: "Medium",
      qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=foodbank@paytm&pn=Community%20Food%20Bank&am=&cu=INR",
      beneficiaries: "1000+ families",
      location: "Delhi, India",
      organizationType: "Trust",
      registrationNumber: "TRUST/2019/005678",
      contactEmail: "help@communityfoodbank.org",
      contactPhone: "+91-9876543211",
      images: [
        "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=400",
        "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400"
      ]
    },
    {
      id: 3,
      title: "Education for Rural Children",
      organization: "Rural Education Foundation",
      accountNumber: "1122334455",
      description: "Supporting education infrastructure in rural areas. Help us build schools and provide quality education to underprivileged children.",
      date: "2023-12-15",
      category: "Education",
      urgency: "Medium",
      qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=education@paytm&pn=Rural%20Education&am=&cu=INR",
      beneficiaries: "2000+ children",
      location: "Rajasthan, India",
      organizationType: "Foundation",
      registrationNumber: "FOUND/2018/009876",
      contactEmail: "info@ruraleducation.org",
      contactPhone: "+91-9876543212",
      images: [
        "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=400",
        "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400"
      ]
    },
    {
      id: 4,
      title: "Clean Water Initiative",
      organization: "Water For All Foundation",
      accountNumber: "5566778899",
      description: "Providing clean drinking water to remote villages. Your contribution will help install water purification systems and wells.",
      date: "2023-11-10",
      category: "Environment",
      urgency: "High",
      qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=water@paytm&pn=Water%20Foundation&am=&cu=INR",
      beneficiaries: "50+ villages",
      location: "Uttar Pradesh, India",
      organizationType: "NGO",
      registrationNumber: "NGO/2021/002345",
      contactEmail: "contact@waterforall.org",
      contactPhone: "+91-9876543213",
      images: [
        "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400",
        "https://images.unsplash.com/photo-1615729947596-a598e5de0ab3?w=400"
      ]
    },
    {
      id: 5,
      title: "Senior Citizen Care",
      organization: "Elderly Care Society",
      accountNumber: "9988776655",
      description: "Supporting elderly people with healthcare, food, and shelter. Help us provide dignity and care to our senior citizens.",
      date: "2023-12-05",
      category: "Healthcare",
      urgency: "Low",
      qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=elderly@paytm&pn=Elderly%20Care&am=&cu=INR",
      beneficiaries: "300+ seniors",
      location: "Bangalore, Karnataka",
      organizationType: "Society",
      registrationNumber: "SOC/2020/007890",
      contactEmail: "care@elderlycare.org",
      contactPhone: "+91-9876543214",
      images: [
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400",
        "https://images.unsplash.com/photo-1521791055366-0d553872125f?w=400"
      ]
    }
  ];

  // API call to fetch donations
  const fetchDonations = async () => {
    try {
      setLoading(true);
      
      // Replace this with actual API call
      // const response = await fetch(`${API_BASE_URL}/donations`, {
      //   method: 'GET',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': 'Bearer your-token-here', // if needed
      //   },
      // });
      
      // if (!response.ok) {
      //   throw new Error(`HTTP error! status: ${response.status}`);
      // }
      
      // const data = await response.json();
      // setDonations(data.donations || data);
      
      // For demo purposes, using dummy data with simulated API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setDonations(dummyDonations);
      
    } catch (error) {
      console.error('Error fetching donations:', error);
      Alert.alert(
        'Error', 
        'Failed to load donations. Please check your internet connection and try again.',
        [
          {text: 'Retry', onPress: fetchDonations},
          {text: 'Cancel', style: 'cancel'}
        ]
      );
      // Fallback to dummy data
      setDonations(dummyDonations);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDonations();
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'High': return '#FF6B6B';
      case 'Medium': return '#FFD93D';
      case 'Low': return '#6BCF7F';
      default: return '#999';
    }
  };

  // SVG Icon Components
  const MedicalIcon = ({ size = 20, color = "#2a2a2a" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M19 8h-2v3h-3v2h3v3h2v-3h3v-2h-3V8zM4 6h5v2h2V6h1V4H4v2zm0 7h8v-2H4v2zm0 4h8v-2H4v2zM10 4H8v2H6V4H4v2h2v2h2V6h2V4z" fill={color}/>
    </Svg>
  );

  const EducationIcon = ({ size = 20, color = "#2a2a2a" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z" fill={color}/>
    </Svg>
  );

  const FoodIcon = ({ size = 20, color = "#2a2a2a" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M8.1 13.34l2.83-2.83L3.91 3.5c-1.56 1.56-1.56 4.09 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.20-1.10-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z" fill={color}/>
    </Svg>
  );

  const EnvironmentIcon = ({ size = 20, color = "#2a2a2a" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.06.82C6.16 17.77 9 14.5 12 14.5s5.84 3.27 7.12 7.66l1.06-.82C18.1 16.17 16 10 17 8zM16.5 3c0 1.11-.89 2-2 2L9 5c-1.11 0-2-.89-2-2s.89-2 2-2 2 .89 2 2 2 .89 2 2-.89 2-2 2z" fill={color}/>
    </Svg>
  );

  const HeartIcon = ({ size = 20, color = "#2a2a2a" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill={color}/>
    </Svg>
  );

  const ArrowLeftIcon = ({ size = 24, color = "#2a2a2a" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" fill={color}/>
    </Svg>
  );

  const FilterIcon = ({ size = 24, color = "#2a2a2a" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z" fill={color}/>
    </Svg>
  );

  const LocationIcon = ({ size = 16, color = "#666" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill={color}/>
    </Svg>
  );

  const CalendarIcon = ({ size = 16, color = "#666" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" fill={color}/>
    </Svg>
  );

  const GroupIcon = ({ size = 16, color = "#666" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zM4 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm5 7c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4.85 2.15L12 15l-1.85-1.85C9.7 13.7 9 14.83 9 16v3h6v-3c0-1.17-.7-2.3-1.15-2.85zm7.5 0L19.5 15l-1.85-1.85c-.45.55-1.15 1.68-1.15 2.85v3h6v-3c0-1.17-.7-2.3-1.15-2.85zm-15 0L4.5 15l-1.85-1.85C2.2 13.7 1.5 14.83 1.5 16v3h6v-3c0-1.17-.7-2.3-1.15-2.85z" fill={color}/>
    </Svg>
  );

  const CertificateIcon = ({ size = 16, color = "#666" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M4 3c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h8l-1 1v2h1.5l.5-.5.5.5H15v-2l-1-1h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2H4zm8 6c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm4 8.43c0-.81-.48-1.53-1.22-1.85C13.93 15.21 13 14.24 13 13c0-.8.8-2 2-2s2 1.2 2 2c0 1.24-.93 2.21-1.78 2.58-.74.32-1.22 1.04-1.22 1.85z" fill={color}/>
    </Svg>
  );

  const EmailIcon = ({ size = 16, color = "#666" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill={color}/>
    </Svg>
  );

  const PhoneIcon = ({ size = 16, color = "#666" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" fill={color}/>
    </Svg>
  );

  const DocumentIcon = ({ size = 16, color = "#666" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" fill={color}/>
    </Svg>
  );

  const BankIcon = ({ size = 16, color = "#666" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M11.5 1L2 6v2h20V6m-5 4v7h3v-7m-9 7h3v-7h-3m4 0v7h3v-7M2 20h20v2H2z" fill={color}/>
    </Svg>
  );

  const CloseIcon = ({ size = 24, color = "#666" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill={color}/>
    </Svg>
  );

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Healthcare': return MedicalIcon;
      case 'Education': return EducationIcon;
      case 'Food Security': return FoodIcon;
      case 'Environment': return EnvironmentIcon;
      default: return HeartIcon;
    }
  };

  const openDonationModal = (donation) => {
    setSelectedDonation(donation);
    setModalVisible(true);
  };

  const closeDonationModal = () => {
    setModalVisible(false);
    setSelectedDonation(null);
  };

  const renderDonationCard = ({item}) => {
    const CategoryIconComponent = getCategoryIcon(item.category);
    
    return (
      <TouchableOpacity 
        style={styles.donationCard} 
        onPress={() => openDonationModal(item)}
        activeOpacity={0.8}
      >
        <View style={styles.cardHeader}>
          <View style={styles.titleContainer}>
            <CategoryIconComponent size={20} color="#2a2a2a" />
            <Text style={styles.donationTitle} numberOfLines={2}>
              {item.title}
            </Text>
          </View>
          <View style={[styles.urgencyBadge, {backgroundColor: getUrgencyColor(item.urgency)}]}>
            <Text style={styles.urgencyText}>{item.urgency}</Text>
          </View>
        </View>
        
        <Text style={styles.organizationName}>{item.organization}</Text>
        <Text style={styles.accountNumber}>Ac No: {item.accountNumber}</Text>
        
        <Text style={styles.description} numberOfLines={3}>
          {item.description}
        </Text>
        
        <View style={styles.cardFooter}>
          <View style={styles.beneficiariesContainer}>
            <GroupIcon size={14} color="#666" />
            <Text style={styles.beneficiariesText}>{item.beneficiaries}</Text>
          </View>
          <Text style={styles.dateText}>{item.date}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderDonationModal = () => {
    if (!selectedDonation) return null;

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeDonationModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Donation Details</Text>
              <TouchableOpacity onPress={closeDonationModal} style={styles.closeButton}>
                <CloseIcon size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.modalBody}>
                {/* QR Code Section */}
                <View style={styles.qrSection}>
                  <Text style={styles.qrTitle}>Scan to Donate</Text>
                  <View style={styles.qrContainer}>
                    <Image 
                      source={{uri: selectedDonation.qrCode}} 
                      style={styles.qrImage}
                      resizeMode="contain"
                    />
                  </View>
                  <Text style={styles.qrSubtext}>
                    Scan this QR code with any UPI app to donate
                  </Text>
                </View>

                {/* Donation Info */}
                <View style={styles.infoSection}>
                  <Text style={styles.modalDonationTitle}>{selectedDonation.title}</Text>
                  <Text style={styles.modalOrganization}>{selectedDonation.organization}</Text>
                  
                  <View style={styles.accountInfo}>
                    <BankIcon size={16} color="#666" />
                    <Text style={styles.accountText}>Account: {selectedDonation.accountNumber}</Text>
                  </View>

                  <Text style={styles.modalDescription}>{selectedDonation.description}</Text>

                  {/* Details Grid */}
                  <View style={styles.detailsGrid}>
                    <View style={styles.detailItem}>
                      <LocationIcon size={16} color="#666" />
                      <Text style={styles.detailText}>{selectedDonation.location}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <CalendarIcon size={16} color="#666" />
                      <Text style={styles.detailText}>{selectedDonation.date}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <GroupIcon size={16} color="#666" />
                      <Text style={styles.detailText}>{selectedDonation.beneficiaries}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <CertificateIcon size={16} color="#666" />
                      <Text style={styles.detailText}>{selectedDonation.organizationType}</Text>
                    </View>
                  </View>

                  {/* Contact Info */}
                  <View style={styles.contactSection}>
                    <Text style={styles.contactTitle}>Contact Information</Text>
                    <View style={styles.contactItem}>
                      <EmailIcon size={16} color="#666" />
                      <Text style={styles.contactText}>{selectedDonation.contactEmail}</Text>
                    </View>
                    <View style={styles.contactItem}>
                      <PhoneIcon size={16} color="#666" />
                      <Text style={styles.contactText}>{selectedDonation.contactPhone}</Text>
                    </View>
                    <View style={styles.contactItem}>
                      <DocumentIcon size={16} color="#666" />
                      <Text style={styles.contactText}>Reg: {selectedDonation.registrationNumber}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2a2a2a" />
        <Text style={styles.loadingText}>Loading donations...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <ArrowLeftIcon size={24} color="#2a2a2a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Donations</Text>
        <TouchableOpacity style={styles.filterButton}>
          <FilterIcon size={24} color="#2a2a2a" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={donations}
        renderItem={renderDonationCard}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={onRefresh}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <HeartIcon size={64} color="#ccc" />
            <Text style={styles.emptyText}>No donations available</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchDonations}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {renderDonationModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5dc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f5f5dc',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2a2a2a',
  },
  filterButton: {
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5dc',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  listContainer: {
    padding: 16,
  },
  donationCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  donationTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2a2a2a',
    marginLeft: 8,
    flex: 1,
  },
  urgencyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  urgencyText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  organizationName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  accountNumber: {
    fontSize: 13,
    color: '#888',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    marginBottom: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  beneficiariesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  beneficiariesText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#888',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#2a2a2a',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.9,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2a2a2a',
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 20,
  },
  qrSection: {
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 20,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
  },
  qrTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2a2a2a',
    marginBottom: 16,
  },
  qrContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  qrImage: {
    width: 180,
    height: 180,
  },
  qrSubtext: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  infoSection: {
    flex: 1,
  },
  modalDonationTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2a2a2a',
    marginBottom: 8,
  },
  modalOrganization: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  accountInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  accountText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  modalDescription: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
    marginBottom: 20,
  },
  detailsGrid: {
    marginBottom: 24,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },
  contactSection: {
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 12,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2a2a2a',
    marginBottom: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },
});

export default DonationScreen;







// import React, {useState, useEffect} from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   StyleSheet,
//   Modal,
//   Image,
//   ScrollView,
//   ActivityIndicator,
//   Alert,
//   Dimensions,
//   SafeAreaView,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// const {width, height} = Dimensions.get('window');

// const DonationScreen = () => {
//   const [donations, setDonations] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedDonation, setSelectedDonation] = useState(null);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);

//   // Dummy API URL - replace with your actual API endpoint
//   const API_BASE_URL = 'https://your-api-domain.com/api';

//   // Dummy data for development/testing
//   const dummyDonations = [
//     {
//       id: 1,
//       title: "Help Children's Hospital",
//       organization: "Children's Health Foundation",
//       accountNumber: "1234567890",
//       description: "We are raising funds for the Children's Hospital to help them upgrade their medical equipment and provide better care for young patients.",
//       date: "2023-12-01",
//       targetAmount: 500000,
//       raisedAmount: 275000,
//       category: "Healthcare",
//       urgency: "High",
//       qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=hospital@paytm&pn=Children%20Hospital&am=&cu=INR",
//       beneficiaries: "500+ children",
//       location: "Mumbai, Maharashtra",
//       organizationType: "NGO",
//       registrationNumber: "NGO/2020/001234",
//       contactEmail: "donate@childrenhospital.org",
//       contactPhone: "+91-9876543210",
//       images: [
//         "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400",
//         "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400"
//       ]
//     },
//     {
//       id: 2,
//       title: "Support Local Food Bank",
//       organization: "Community Food Bank",
//       accountNumber: "0987654321",
//       description: "Our local food bank is running low on supplies. Your donation can help them feed more families in need during these challenging times.",
//       date: "2023-11-20",
//       targetAmount: 200000,
//       raisedAmount: 125000,
//       category: "Food Security",
//       urgency: "Medium",
//       qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=foodbank@paytm&pn=Community%20Food%20Bank&am=&cu=INR",
//       beneficiaries: "1000+ families",
//       location: "Delhi, India",
//       organizationType: "Trust",
//       registrationNumber: "TRUST/2019/005678",
//       contactEmail: "help@communityfoodbank.org",
//       contactPhone: "+91-9876543211",
//       images: [
//         "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=400",
//         "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400"
//       ]
//     },
//     {
//       id: 3,
//       title: "Education for Rural Children",
//       organization: "Rural Education Foundation",
//       accountNumber: "1122334455",
//       description: "Supporting education infrastructure in rural areas. Help us build schools and provide quality education to underprivileged children.",
//       date: "2023-12-15",
//       targetAmount: 750000,
//       raisedAmount: 320000,
//       category: "Education",
//       urgency: "Medium",
//       qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=education@paytm&pn=Rural%20Education&am=&cu=INR",
//       beneficiaries: "2000+ children",
//       location: "Rajasthan, India",
//       organizationType: "Foundation",
//       registrationNumber: "FOUND/2018/009876",
//       contactEmail: "info@ruraleducation.org",
//       contactPhone: "+91-9876543212",
//       images: [
//         "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=400",
//         "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400"
//       ]
//     },
//     {
//       id: 4,
//       title: "Clean Water Initiative",
//       organization: "Water For All Foundation",
//       accountNumber: "5566778899",
//       description: "Providing clean drinking water to remote villages. Your contribution will help install water purification systems and wells.",
//       date: "2023-11-10",
//       targetAmount: 400000,
//       raisedAmount: 180000,
//       category: "Environment",
//       urgency: "High",
//       qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=water@paytm&pn=Water%20Foundation&am=&cu=INR",
//       beneficiaries: "50+ villages",
//       location: "Uttar Pradesh, India",
//       organizationType: "NGO",
//       registrationNumber: "NGO/2021/002345",
//       contactEmail: "contact@waterforall.org",
//       contactPhone: "+91-9876543213",
//       images: [
//         "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400",
//         "https://images.unsplash.com/photo-1615729947596-a598e5de0ab3?w=400"
//       ]
//     },
//     {
//       id: 5,
//       title: "Senior Citizen Care",
//       organization: "Elderly Care Society",
//       accountNumber: "9988776655",
//       description: "Supporting elderly people with healthcare, food, and shelter. Help us provide dignity and care to our senior citizens.",
//       date: "2023-12-05",
//       targetAmount: 300000,
//       raisedAmount: 95000,
//       category: "Healthcare",
//       urgency: "Low",
//       qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=elderly@paytm&pn=Elderly%20Care&am=&cu=INR",
//       beneficiaries: "300+ seniors",
//       location: "Bangalore, Karnataka",
//       organizationType: "Society",
//       registrationNumber: "SOC/2020/007890",
//       contactEmail: "care@elderlycare.org",
//       contactPhone: "+91-9876543214",
//       images: [
//         "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400",
//         "https://images.unsplash.com/photo-1521791055366-0d553872125f?w=400"
//       ]
//     }
//   ];

//   // API call to fetch donations
//   const fetchDonations = async () => {
//     try {
//       setLoading(true);
      
//       // Replace this with actual API call
//       // const response = await fetch(`${API_BASE_URL}/donations`, {
//       //   method: 'GET',
//       //   headers: {
//       //     'Content-Type': 'application/json',
//       //     'Authorization': 'Bearer your-token-here', // if needed
//       //   },
//       // });
      
//       // if (!response.ok) {
//       //   throw new Error(`HTTP error! status: ${response.status}`);
//       // }
      
//       // const data = await response.json();
//       // setDonations(data.donations || data);
      
//       // For demo purposes, using dummy data with simulated API delay
//       await new Promise(resolve => setTimeout(resolve, 1000));
//       setDonations(dummyDonations);
      
//     } catch (error) {
//       console.error('Error fetching donations:', error);
//       Alert.alert(
//         'Error', 
//         'Failed to load donations. Please check your internet connection and try again.',
//         [
//           {text: 'Retry', onPress: fetchDonations},
//           {text: 'Cancel', style: 'cancel'}
//         ]
//       );
//       // Fallback to dummy data
//       setDonations(dummyDonations);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   useEffect(() => {
//     fetchDonations();
//   }, []);

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchDonations();
//   };

//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       maximumFractionDigits: 0,
//     }).format(amount);
//   };

//   const getProgressPercentage = (raised, target) => {
//     return Math.min((raised / target) * 100, 100);
//   };

//   const getUrgencyColor = (urgency) => {
//     switch (urgency) {
//       case 'High': return '#FF6B6B';
//       case 'Medium': return '#FFD93D';
//       case 'Low': return '#6BCF7F';
//       default: return '#999';
//     }
//   };

//   const getCategoryIcon = (category) => {
//     switch (category) {
//       case 'Healthcare': return 'medical-bag';
//       case 'Education': return 'school';
//       case 'Food Security': return 'food';
//       case 'Environment': return 'leaf';
//       default: return 'heart';
//     }
//   };

//   const openDonationModal = (donation) => {
//     setSelectedDonation(donation);
//     setModalVisible(true);
//   };

//   const closeDonationModal = () => {
//     setModalVisible(false);
//     setSelectedDonation(null);
//   };

//   const renderDonationCard = ({item}) => {
//     const progressPercentage = getProgressPercentage(item.raisedAmount, item.targetAmount);
    
//     return (
//       <TouchableOpacity 
//         style={styles.donationCard} 
//         onPress={() => openDonationModal(item)}
//         activeOpacity={0.8}
//       >
//         <View style={styles.cardHeader}>
//           <View style={styles.titleContainer}>
//             <Icon 
//               name={getCategoryIcon(item.category)} 
//               size={20} 
//               color="#2a2a2a" 
//             />
//             <Text style={styles.donationTitle} numberOfLines={2}>
//               {item.title}
//             </Text>
//           </View>
//           <View style={[styles.urgencyBadge, {backgroundColor: getUrgencyColor(item.urgency)}]}>
//             <Text style={styles.urgencyText}>{item.urgency}</Text>
//           </View>
//         </View>
        
//         <Text style={styles.organizationName}>{item.organization}</Text>
//         <Text style={styles.accountNumber}>Ac No: {item.accountNumber}</Text>
        
//         <Text style={styles.description} numberOfLines={3}>
//           {item.description}
//         </Text>
        
//         <View style={styles.progressContainer}>
//           <View style={styles.progressInfo}>
//             <Text style={styles.progressText}>
//               {formatCurrency(item.raisedAmount)} raised of {formatCurrency(item.targetAmount)}
//             </Text>
//             <Text style={styles.progressPercentage}>
//               {progressPercentage.toFixed(0)}%
//             </Text>
//           </View>
//           <View style={styles.progressBar}>
//             <View 
//               style={[styles.progressFill, {width: `${progressPercentage}%`}]} 
//             />
//           </View>
//         </View>
        
//         <View style={styles.cardFooter}>
//           <View style={styles.beneficiariesContainer}>
//             <Icon name="account-group" size={14} color="#666" />
//             <Text style={styles.beneficiariesText}>{item.beneficiaries}</Text>
//           </View>
//           <Text style={styles.dateText}>{item.date}</Text>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   const renderDonationModal = () => {
//     if (!selectedDonation) return null;

//     const progressPercentage = getProgressPercentage(
//       selectedDonation.raisedAmount, 
//       selectedDonation.targetAmount
//     );

//     return (
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={modalVisible}
//         onRequestClose={closeDonationModal}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <View style={styles.modalHeader}>
//               <Text style={styles.modalTitle}>Donation Details</Text>
//               <TouchableOpacity onPress={closeDonationModal} style={styles.closeButton}>
//                 <Icon name="close" size={24} color="#666" />
//               </TouchableOpacity>
//             </View>
            
//             <ScrollView showsVerticalScrollIndicator={false}>
//               <View style={styles.modalBody}>
//                 {/* QR Code Section */}
//                 <View style={styles.qrSection}>
//                   <Text style={styles.qrTitle}>Scan to Donate</Text>
//                   <View style={styles.qrContainer}>
//                     <Image 
//                       source={{uri: selectedDonation.qrCode}} 
//                       style={styles.qrImage}
//                       resizeMode="contain"
//                     />
//                   </View>
//                   <Text style={styles.qrSubtext}>
//                     Scan this QR code with any UPI app to donate
//                   </Text>
//                 </View>

//                 {/* Donation Info */}
//                 <View style={styles.infoSection}>
//                   <Text style={styles.modalDonationTitle}>{selectedDonation.title}</Text>
//                   <Text style={styles.modalOrganization}>{selectedDonation.organization}</Text>
                  
//                   <View style={styles.accountInfo}>
//                     <Icon name="bank" size={16} color="#666" />
//                     <Text style={styles.accountText}>Account: {selectedDonation.accountNumber}</Text>
//                   </View>

//                   <Text style={styles.modalDescription}>{selectedDonation.description}</Text>

//                   {/* Progress */}
//                   <View style={styles.modalProgressContainer}>
//                     <View style={styles.progressInfo}>
//                       <Text style={styles.modalProgressText}>
//                         {formatCurrency(selectedDonation.raisedAmount)} raised of {formatCurrency(selectedDonation.targetAmount)}
//                       </Text>
//                       <Text style={styles.modalProgressPercentage}>
//                         {progressPercentage.toFixed(0)}%
//                       </Text>
//                     </View>
//                     <View style={styles.progressBar}>
//                       <View 
//                         style={[styles.progressFill, {width: `${progressPercentage}%`}]} 
//                       />
//                     </View>
//                   </View>

//                   {/* Details Grid */}
//                   <View style={styles.detailsGrid}>
//                     <View style={styles.detailItem}>
//                       <Icon name="map-marker" size={16} color="#666" />
//                       <Text style={styles.detailText}>{selectedDonation.location}</Text>
//                     </View>
//                     <View style={styles.detailItem}>
//                       <Icon name="calendar" size={16} color="#666" />
//                       <Text style={styles.detailText}>{selectedDonation.date}</Text>
//                     </View>
//                     <View style={styles.detailItem}>
//                       <Icon name="account-group" size={16} color="#666" />
//                       <Text style={styles.detailText}>{selectedDonation.beneficiaries}</Text>
//                     </View>
//                     <View style={styles.detailItem}>
//                       <Icon name="certificate" size={16} color="#666" />
//                       <Text style={styles.detailText}>{selectedDonation.organizationType}</Text>
//                     </View>
//                   </View>

//                   {/* Contact Info */}
//                   <View style={styles.contactSection}>
//                     <Text style={styles.contactTitle}>Contact Information</Text>
//                     <View style={styles.contactItem}>
//                       <Icon name="email" size={16} color="#666" />
//                       <Text style={styles.contactText}>{selectedDonation.contactEmail}</Text>
//                     </View>
//                     <View style={styles.contactItem}>
//                       <Icon name="phone" size={16} color="#666" />
//                       <Text style={styles.contactText}>{selectedDonation.contactPhone}</Text>
//                     </View>
//                     <View style={styles.contactItem}>
//                       <Icon name="file-document" size={16} color="#666" />
//                       <Text style={styles.contactText}>Reg: {selectedDonation.registrationNumber}</Text>
//                     </View>
//                   </View>
//                 </View>
//               </View>
//             </ScrollView>
//           </View>
//         </View>
//       </Modal>
//     );
//   };

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#2a2a2a" />
//         <Text style={styles.loadingText}>Loading donations...</Text>
//       </View>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity style={styles.backButton}>
//           <Icon name="arrow-left" size={24} color="#2a2a2a" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Donations</Text>
//         <TouchableOpacity style={styles.filterButton}>
//           <Icon name="filter-variant" size={24} color="#2a2a2a" />
//         </TouchableOpacity>
//       </View>

//       <FlatList
//         data={donations}
//         renderItem={renderDonationCard}
//         keyExtractor={(item) => item.id.toString()}
//         showsVerticalScrollIndicator={false}
//         refreshing={refreshing}
//         onRefresh={onRefresh}
//         contentContainerStyle={styles.listContainer}
//         ListEmptyComponent={
//           <View style={styles.emptyContainer}>
//             <Icon name="heart-outline" size={64} color="#ccc" />
//             <Text style={styles.emptyText}>No donations available</Text>
//             <TouchableOpacity style={styles.retryButton} onPress={fetchDonations}>
//               <Text style={styles.retryText}>Retry</Text>
//             </TouchableOpacity>
//           </View>
//         }
//       />

//       {renderDonationModal()}
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5dc',
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     backgroundColor: '#f5f5dc',
//     borderBottomWidth: 1,
//     borderBottomColor: '#e0e0e0',
//   },
//   backButton: {
//     padding: 8,
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: '#2a2a2a',
//   },
//   filterButton: {
//     padding: 8,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f5f5dc',
//   },
//   loadingText: {
//     marginTop: 16,
//     fontSize: 16,
//     color: '#666',
//   },
//   listContainer: {
//     padding: 16,
//   },
//   donationCard: {
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 16,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 3.84,
//     elevation: 5,
//   },
//   cardHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//     marginBottom: 8,
//   },
//   titleContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//     marginRight: 8,
//   },
//   donationTitle: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#2a2a2a',
//     marginLeft: 8,
//     flex: 1,
//   },
//   urgencyBadge: {
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 12,
//   },
//   urgencyText: {
//     fontSize: 12,
//     fontWeight: '600',
//     color: '#fff',
//   },
//   organizationName: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#666',
//     marginBottom: 4,
//   },
//   accountNumber: {
//     fontSize: 13,
//     color: '#888',
//     marginBottom: 12,
//   },
//   description: {
//     fontSize: 14,
//     color: '#555',
//     lineHeight: 20,
//     marginBottom: 16,
//   },
//   progressContainer: {
//     marginBottom: 16,
//   },
//   progressInfo: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   progressText: {
//     fontSize: 13,
//     color: '#666',
//     fontWeight: '500',
//   },
//   progressPercentage: {
//     fontSize: 13,
//     fontWeight: '700',
//     color: '#2a2a2a',
//   },
//   progressBar: {
//     height: 6,
//     backgroundColor: '#e0e0e0',
//     borderRadius: 3,
//   },
//   progressFill: {
//     height: '100%',
//     backgroundColor: '#4CAF50',
//     borderRadius: 3,
//   },
//   cardFooter: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   beneficiariesContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   beneficiariesText: {
//     fontSize: 12,
//     color: '#666',
//     marginLeft: 4,
//   },
//   dateText: {
//     fontSize: 12,
//     color: '#888',
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingTop: 100,
//   },
//   emptyText: {
//     fontSize: 16,
//     color: '#666',
//     marginTop: 16,
//     marginBottom: 24,
//   },
//   retryButton: {
//     backgroundColor: '#2a2a2a',
//     paddingHorizontal: 24,
//     paddingVertical: 12,
//     borderRadius: 8,
//   },
//   retryText: {
//     color: '#fff',
//     fontSize: 14,
//     fontWeight: '600',
//   },

//   // Modal Styles
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'flex-end',
//   },
//   modalContent: {
//     backgroundColor: '#fff',
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     maxHeight: height * 0.9,
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     paddingTop: 20,
//     paddingBottom: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#e0e0e0',
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#2a2a2a',
//   },
//   closeButton: {
//     padding: 4,
//   },
//   modalBody: {
//     padding: 20,
//   },
//   qrSection: {
//     alignItems: 'center',
//     marginBottom: 24,
//     paddingVertical: 20,
//     backgroundColor: '#f8f8f8',
//     borderRadius: 12,
//   },
//   qrTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#2a2a2a',
//     marginBottom: 16,
//   },
//   qrContainer: {
//     backgroundColor: '#fff',
//     padding: 16,
//     borderRadius: 12,
//     marginBottom: 12,
//   },
//   qrImage: {
//     width: 180,
//     height: 180,
//   },
//   qrSubtext: {
//     fontSize: 12,
//     color: '#666',
//     textAlign: 'center',
//   },
//   infoSection: {
//     flex: 1,
//   },
//   modalDonationTitle: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: '#2a2a2a',
//     marginBottom: 8,
//   },
//   modalOrganization: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#666',
//     marginBottom: 8,
//   },
//   accountInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   accountText: {
//     fontSize: 14,
//     color: '#666',
//     marginLeft: 8,
//   },
//   modalDescription: {
//     fontSize: 15,
//     color: '#555',
//     lineHeight: 22,
//     marginBottom: 20,
//   },
//   modalProgressContainer: {
//     marginBottom: 24,
//   },
//   modalProgressText: {
//     fontSize: 14,
//     color: '#666',
//     fontWeight: '500',
//   },
//   modalProgressPercentage: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#2a2a2a',
//   },
//   detailsGrid: {
//     marginBottom: 24,
//   },
//   detailItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   detailText: {
//     fontSize: 14,
//     color: '#666',
//     marginLeft: 8,
//     flex: 1,
//   },
//   contactSection: {
//     backgroundColor: '#f8f8f8',
//     padding: 16,
//     borderRadius: 12,
//   },
//   contactTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#2a2a2a',
//     marginBottom: 12,
//   },
//   contactItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   contactText: {
//     fontSize: 13,
//     color: '#666',
//     marginLeft: 8,
//     flex: 1,
//   },
// });

// export default DonationScreen;