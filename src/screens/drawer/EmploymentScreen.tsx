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

// SVG Icon Components
const BriefcaseIcon = ({ size = 20, color = "#666", filled = false }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16m8 0H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2z" 
          fill={filled ? color : "none"} 
          stroke={color} 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"/>
  </Svg>
);

const SearchIcon = ({ size = 20, color = "#666", filled = false }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="11" cy="11" r="8" 
            fill={filled ? color : "none"} 
            stroke={color} 
            strokeWidth="2"/>
    <Path d="M21 21l-4.35-4.35" 
          stroke={color} 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"/>
    <Circle cx="11" cy="11" r="3" 
            fill={filled ? "#fff" : "none"} 
            stroke={filled ? "#fff" : color} 
            strokeWidth="1.5"/>
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

const CurrencyIcon = ({ size = 20, color = "#666", filled = false }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M6 3v18M18 3v18M8 21h8M8 3h8M12 3v18" 
          stroke={color} 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"/>
    <Path d="M17 9a5 5 0 0 0-5-2c-2 0-3 1-3 3s1 3 3 3 3 1 3 3-1 3-3 3a5 5 0 0 0-5-2" 
          fill={filled ? color : "none"} 
          stroke={color} 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"/>
  </Svg>
);

const TimeIcon = ({ size = 20, color = "#666", filled = false }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" 
            fill={filled ? color : "none"} 
            stroke={color} 
            strokeWidth="2"/>
    <Path d="M12 6v6l3 3" 
          stroke={filled ? "#fff" : color} 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"/>
  </Svg>
);

const PdfIcon = ({ size = 20, color = "#666", filled = false }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" 
          fill={filled ? color : "none"} 
          stroke={color} 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"/>
    <Path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" 
          stroke={filled ? "#fff" : color} 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"/>
  </Svg>
);

const MessageIcon = ({ size = 20, color = "#666", filled = false }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" 
          fill={filled ? color : "none"} 
          stroke={color} 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"/>
    <Path d="M8 9h8M8 13h6" 
          stroke={filled ? "#fff" : color} 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"/>
  </Svg>
);

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
    <Circle cx="8" cy="14" r="1" 
            fill={filled ? "#fff" : color}/>
    <Circle cx="12" cy="14" r="1" 
            fill={filled ? "#fff" : color}/>
    <Circle cx="16" cy="14" r="1" 
            fill={filled ? "#fff" : color}/>
  </Svg>
);

const CheckIcon = ({ size = 20, color = "#666", filled = false }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" 
            fill={filled ? color : "none"} 
            stroke={color} 
            strokeWidth="2"/>
    <Path d="M9 12l2 2 4-4" 
          stroke={filled ? "#fff" : color} 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"/>
  </Svg>
);

const CloseIcon = ({ size = 20, color = "#666", filled = false }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" 
            fill={filled ? color : "none"} 
            stroke={color} 
            strokeWidth="2"/>
    <Path d="M15 9l-6 6M9 9l6 6" 
          stroke={filled ? "#fff" : color} 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"/>
  </Svg>
);

const EmptyIcon = ({ size = 60, color = "#666", filled = false }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="11" cy="11" r="8" 
            fill={filled ? color : "none"} 
            stroke={color} 
            strokeWidth="2"/>
    <Path d="M21 21l-4.35-4.35" 
          stroke={color} 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"/>
    <Path d="M8 11h6M11 8v6" 
          stroke={filled ? "#fff" : color} 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"/>
  </Svg>
);

const TagIcon = ({ size = 20, color = "#666", filled = false }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" 
          fill={filled ? color : "none"} 
          stroke={color} 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"/>
    <Circle cx="7" cy="7" r="1" 
            fill={filled ? "#fff" : color}/>
  </Svg>
);

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
};

interface JobPost {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'offer' | 'need';
  category: string;
  salary: string;
  experience: string;
  description: string;
  requirements: string[];
  postedBy: string;
  postedDate: string;
  contact: string;
  pdfUrl?: string;
  isUrgent: boolean;
  deadline?: string;
}

const jobPosts: JobPost[] = [
  {
    id: '1',
    title: 'Senior Software Developer',
    company: 'TechCorp Solutions',
    location: 'Mumbai, Maharashtra',
    type: 'offer',
    category: 'IT & Software',
    salary: '₹12-18 LPA',
    experience: '3-5 years',
    description: 'We are looking for a skilled software developer to join our dynamic team. You will be responsible for developing web applications using modern technologies.',
    requirements: ['React.js/Node.js', 'JavaScript/TypeScript', 'MongoDB/PostgreSQL', 'Git version control'],
    postedBy: 'Rajesh Kumar',
    postedDate: '2025-03-15',
    contact: 'rajesh@techcorp.com',
    pdfUrl: 'https://example.com/job-details-1.pdf',
    isUrgent: true,
    deadline: '2025-03-30'
  },
  {
    id: '2',
    title: 'Accountant Required',
    company: 'Community Member',
    location: 'Delhi NCR',
    type: 'need',
    category: 'Finance & Accounting',
    salary: '₹4-7 LPA',
    experience: '2-4 years',
    description: 'Looking for an experienced accountant for our family business. Must be familiar with GST, taxation, and financial reporting.',
    requirements: ['B.Com/M.Com', 'Tally ERP experience', 'GST knowledge', 'Excel proficiency'],
    postedBy: 'Priya Sharma',
    postedDate: '2025-03-14',
    contact: '+91 98765 43210',
    isUrgent: false
  },
  {
    id: '3',
    title: 'Marketing Executive',
    company: 'Growth Marketing Agency',
    location: 'Bangalore, Karnataka',
    type: 'offer',
    category: 'Marketing & Sales',
    salary: '₹5-8 LPA',
    experience: '1-3 years',
    description: 'Join our marketing team to drive digital campaigns and boost brand awareness. Experience in social media marketing preferred.',
    requirements: ['Digital Marketing', 'Social Media', 'Content Creation', 'Analytics'],
    postedBy: 'Amit Patel',
    postedDate: '2025-03-13',
    contact: 'careers@growthagency.com',
    pdfUrl: 'https://example.com/marketing-job.pdf',
    isUrgent: false
  },
  {
    id: '4',
    title: 'Need Graphic Designer',
    company: 'Freelance Project',
    location: 'Remote/Work from Home',
    type: 'need',
    category: 'Design & Creative',
    salary: '₹25,000-40,000/project',
    experience: '1-2 years',
    description: 'Looking for a creative graphic designer for branding project. Need someone who can create logos, brochures, and digital assets.',
    requirements: ['Adobe Creative Suite', 'Logo Design', 'Brand Identity', 'Print Design'],
    postedBy: 'Sunita Singh',
    postedDate: '2025-03-12',
    contact: 'sunita.designs@gmail.com',
    isUrgent: true,
    deadline: '2025-03-25'
  },
  {
    id: '5',
    title: 'Data Analyst',
    company: 'Analytics Pro Ltd',
    location: 'Pune, Maharashtra',
    type: 'offer',
    category: 'Data & Analytics',
    salary: '₹8-12 LPA',
    experience: '2-4 years',
    description: 'Seeking a data analyst to help derive insights from large datasets and create meaningful reports for business decisions.',
    requirements: ['Python/R', 'SQL', 'Power BI/Tableau', 'Statistics'],
    postedBy: 'Vikash Kumar',
    postedDate: '2025-03-11',
    contact: 'hr@analyticspro.com',
    pdfUrl: 'https://example.com/data-analyst-role.pdf',
    isUrgent: false
  },
  {
    id: '6',
    title: 'Teacher Needed',
    company: 'Community School',
    location: 'Chennai, Tamil Nadu',
    type: 'need',
    category: 'Education & Training',
    salary: '₹3-5 LPA',
    experience: '1-3 years',
    description: 'Our community school needs a dedicated teacher for mathematics and science subjects for classes 6-10.',
    requirements: ['B.Ed/M.Ed', 'Math/Science background', 'Communication skills', 'Passion for teaching'],
    postedBy: 'School Committee',
    postedDate: '2025-03-10',
    contact: '+91 87654 32109',
    isUrgent: true,
    deadline: '2025-03-20'
  }
];

const categories = ['All', 'IT & Software', 'Finance & Accounting', 'Marketing & Sales', 'Design & Creative', 'Data & Analytics', 'Education & Training'];

export default function EmploymentScreen() {
  const [selectedTab, setSelectedTab] = useState<'all' | 'offers' | 'needs'>('all');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedJob, setSelectedJob] = useState<JobPost | null>(null);
  const [showJobModal, setShowJobModal] = useState(false);

  const filteredJobs = jobPosts.filter(job => {
    const tabFilter = selectedTab === 'all' || 
                     (selectedTab === 'offers' && job.type === 'offer') ||
                     (selectedTab === 'needs' && job.type === 'need');
    
    const categoryFilter = selectedCategory === 'All' || job.category === selectedCategory;
    
    return tabFilter && categoryFilter;
  });

  const openPDF = async (pdfUrl: string, title: string) => {
    try {
      await Linking.openURL(pdfUrl);
    } catch (error) {
      Alert.alert('Error', 'Unable to open PDF. Please try again later.');
    }
  };

  const contactEmployer = (contact: string, title: string) => {
    Alert.alert(
      'Contact Employer',
      `Job: ${title}\nContact: ${contact}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call', onPress: () => Linking.openURL(`tel:${contact.replace(/[^\d+]/g, '')}`) },
        { text: 'Email', onPress: () => Linking.openURL(`mailto:${contact}`) }
      ]
    );
  };

  const JobCard = ({ job }: { job: JobPost }) => (
    <TouchableOpacity
      style={[
        styles.jobCard,
        job.type === 'offer' ? styles.offerCard : styles.needCard,
        job.isUrgent && styles.urgentCard
      ]}
      onPress={() => {
        setSelectedJob(job);
        setShowJobModal(true);
      }}
      activeOpacity={0.8}
    >
      {job.isUrgent && (
        <View style={styles.urgentBadge}>
          <ClockIcon size={10} color={AppColors.white} />
          <Text style={styles.urgentText}>URGENT</Text>
        </View>
      )}

      <View style={styles.jobHeader}>
        <View style={styles.jobTitleSection}>
          <Text style={styles.jobTitle} numberOfLines={2}>{job.title}</Text>
          <Text style={styles.companyName}>{job.company}</Text>
        </View>
        <View style={[
          styles.typeIndicator,
          { backgroundColor: job.type === 'offer' ? AppColors.success : AppColors.blue }
        ]}>
          {job.type === 'offer' ? (
            <BriefcaseIcon size={14} color={AppColors.white} />
          ) : (
            <SearchIcon size={14} color={AppColors.white} />
          )}
        </View>
      </View>

      <View style={styles.jobDetails}>
        <View style={styles.detailRow}>
          <LocationIcon size={12} color={AppColors.gray} />
          <Text style={styles.detailText}>{job.location}</Text>
        </View>
        <View style={styles.detailRow}>
          <CurrencyIcon size={12} color={AppColors.gray} />
          <Text style={styles.detailText}>{job.salary}</Text>
        </View>
        <View style={styles.detailRow}>
          <TimeIcon size={12} color={AppColors.gray} />
          <Text style={styles.detailText}>{job.experience}</Text>
        </View>
      </View>

      <Text style={styles.jobDescription} numberOfLines={2}>
        {job.description}
      </Text>

      <View style={styles.jobFooter}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{job.category}</Text>
        </View>
        <View style={styles.jobActions}>
          {job.pdfUrl && (
            <TouchableOpacity
              style={styles.pdfButton}
              onPress={() => openPDF(job.pdfUrl!, job.title)}
            >
              <PdfIcon size={14} color={AppColors.danger} />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.contactButton}
            onPress={() => contactEmployer(job.contact, job.title)}
          >
            <MessageIcon size={14} color={AppColors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.postInfo}>
        <Text style={styles.postedBy}>By {job.postedBy}</Text>
        <Text style={styles.postedDate}>{new Date(job.postedDate).toLocaleDateString()}</Text>
      </View>

      {job.deadline && (
        <View style={styles.deadlineInfo}>
          <CalendarIcon size={10} color={AppColors.warning} />
          <Text style={styles.deadlineText}>
            Deadline: {new Date(job.deadline).toLocaleDateString()}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const JobDetailModal = () => (
    <Modal
      visible={showJobModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowJobModal(false)}
    >
      {selectedJob && (
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Job Details</Text>
            <TouchableOpacity
              onPress={() => setShowJobModal(false)}
              style={styles.closeButton}
            >
              <CloseIcon size={24} color={AppColors.dark} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.jobDetailHeader}>
              <Text style={styles.jobDetailTitle}>{selectedJob.title}</Text>
              <Text style={styles.jobDetailCompany}>{selectedJob.company}</Text>
              <View style={[
                styles.typeIndicatorLarge,
                { backgroundColor: selectedJob.type === 'offer' ? AppColors.success : AppColors.blue }
              ]}>
                <Text style={styles.typeText}>
                  {selectedJob.type === 'offer' ? 'JOB OFFER' : 'JOB NEEDED'}
                </Text>
              </View>
            </View>

            <View style={styles.jobDetailSection}>
              <Text style={styles.sectionTitle}>Job Information</Text>
              <View style={styles.infoGrid}>
                <View style={styles.infoItem}>
                  <LocationIcon size={16} color={AppColors.primary} />
                  <Text style={styles.infoLabel}>Location</Text>
                  <Text style={styles.infoValue}>{selectedJob.location}</Text>
                </View>
                <View style={styles.infoItem}>
                  <CurrencyIcon size={16} color={AppColors.primary} />
                  <Text style={styles.infoLabel}>Salary</Text>
                  <Text style={styles.infoValue}>{selectedJob.salary}</Text>
                </View>
                <View style={styles.infoItem}>
                  <TimeIcon size={16} color={AppColors.primary} />
                  <Text style={styles.infoLabel}>Experience</Text>
                  <Text style={styles.infoValue}>{selectedJob.experience}</Text>
                </View>
                <View style={styles.infoItem}>
                  <TagIcon size={16} color={AppColors.primary} />
                  <Text style={styles.infoLabel}>Category</Text>
                  <Text style={styles.infoValue}>{selectedJob.category}</Text>
                </View>
              </View>
            </View>

            <View style={styles.jobDetailSection}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.descriptionText}>{selectedJob.description}</Text>
            </View>

            <View style={styles.jobDetailSection}>
              <Text style={styles.sectionTitle}>Requirements</Text>
              {selectedJob.requirements.map((req, index) => (
                <View key={index} style={styles.requirementItem}>
                  <CheckIcon size={14} color={AppColors.success} />
                  <Text style={styles.requirementText}>{req}</Text>
                </View>
              ))}
            </View>

            <View style={styles.jobDetailSection}>
              <Text style={styles.sectionTitle}>Contact Information</Text>
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Posted by: {selectedJob.postedBy}</Text>
                <Text style={styles.contactValue}>{selectedJob.contact}</Text>
                {selectedJob.deadline && (
                  <Text style={styles.deadlineInfo}>
                    Application Deadline: {new Date(selectedJob.deadline).toLocaleDateString()}
                  </Text>
                )}
              </View>
            </View>

            <View style={styles.modalActions}>
              {selectedJob.pdfUrl && (
                <TouchableOpacity
                  style={styles.pdfButtonLarge}
                  onPress={() => openPDF(selectedJob.pdfUrl!, selectedJob.title)}
                >
                  <PdfIcon size={20} color={AppColors.white} />
                  <Text style={styles.pdfButtonText}>View PDF Details</Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity
                style={styles.contactButtonLarge}
                onPress={() => contactEmployer(selectedJob.contact, selectedJob.title)}
              >
                <MessageIcon size={20} color={AppColors.white} />
                <Text style={styles.contactButtonText}>Contact Now</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      )}
    </Modal>
  );

  return (
    <View style={styles.container}>
      {/* Header Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <BriefcaseIcon size={18} color={AppColors.success} />
          <Text style={styles.statNumber}>{jobPosts.filter(j => j.type === 'offer').length}</Text>
          <Text style={styles.statLabel}>Job Offers</Text>
        </View>
        <View style={[styles.statCard, styles.middleStatCard]}>
          <SearchIcon size={18} color={AppColors.blue} />
          <Text style={styles.statNumber}>{jobPosts.filter(j => j.type === 'need').length}</Text>
          <Text style={styles.statLabel}>Job Needs</Text>
        </View>
        <View style={styles.statCard}>
          <ClockIcon size={18} color={AppColors.warning} />
          <Text style={styles.statNumber}>{jobPosts.filter(j => j.isUrgent).length}</Text>
          <Text style={styles.statLabel}>Urgent</Text>
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'all' && styles.activeTab]}
          onPress={() => setSelectedTab('all')}
        >
          <Text style={[styles.tabText, selectedTab === 'all' && styles.activeTabText]}>
            All Jobs
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'offers' && styles.activeTab]}
          onPress={() => setSelectedTab('offers')}
        >
          <Text style={[styles.tabText, selectedTab === 'offers' && styles.activeTabText]}>
            Offers
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'needs' && styles.activeTab]}
          onPress={() => setSelectedTab('needs')}
        >
          <Text style={[styles.tabText, selectedTab === 'needs' && styles.activeTabText]}>
            Needs
          </Text>
        </TouchableOpacity>
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

      {/* Job Posts */}
      <ScrollView
        style={styles.jobsList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.jobsContent}
      >
        {filteredJobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}

        {filteredJobs.length === 0 && (
          <View style={styles.emptyState}>
            <EmptyIcon size={60} color={AppColors.gray} />
            <Text style={styles.emptyTitle}>No Jobs Found</Text>
            <Text style={styles.emptyText}>
              Try adjusting your filters or check back later for new opportunities.
            </Text>
          </View>
        )}
      </ScrollView>

      <JobDetailModal />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.lightGray,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: AppColors.white,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.border,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  middleStatCard: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: AppColors.border,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: AppColors.dark,
    marginTop: 4,
  },
  statLabel: {
    fontSize: 11,
    color: AppColors.gray,
    marginTop: 2,
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: AppColors.white,
    paddingHorizontal: 15,
    paddingVertical: 10,
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
    marginHorizontal: 2,
  },
  activeTab: {
    backgroundColor: AppColors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: AppColors.gray,
  },
  activeTabText: {
    color: AppColors.white,
  },
  categoryContainer: {
    backgroundColor: AppColors.cream,
    paddingVertical: 8,
    maxHeight: 45,
  },
  categoryContent: {
    paddingHorizontal: 15,
  },
  categoryButton: {
    backgroundColor: AppColors.white,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    marginRight: 6,
    borderWidth: 1,
    borderColor: AppColors.border,
    minHeight: 28,
    justifyContent: 'center',
  },
  categoryButtonActive: {
    backgroundColor: AppColors.teal,
    borderColor: AppColors.teal,
  },
  categoryButtonText: {
    fontSize: 12,
    color: AppColors.dark,
    fontWeight: '500',
  },
  categoryButtonTextActive: {
    color: AppColors.white,
  },
  jobsList: {
    flex: 1,
  },
  jobsContent: {
    padding: 12,
  },
  jobCard: {
    backgroundColor: AppColors.white,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
    borderLeftWidth: 3,
  },
  offerCard: {
    borderLeftColor: AppColors.success,
  },
  needCard: {
    borderLeftColor: AppColors.blue,
  },
  urgentCard: {
    borderWidth: 1,
    borderColor: AppColors.warning,
  },
  urgentBadge: {
    position: 'absolute',
    top: -4,
    right: 12,
    backgroundColor: AppColors.warning,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    zIndex: 1,
  },
  urgentText: {
    color: AppColors.white,
    fontSize: 9,
    fontWeight: 'bold',
    marginLeft: 3,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  jobTitleSection: {
    flex: 1,
    marginRight: 10,
  },
  jobTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: AppColors.dark,
    marginBottom: 3,
    lineHeight: 18,
  },
  companyName: {
    fontSize: 13,
    color: AppColors.primary,
    fontWeight: '500',
  },
  typeIndicator: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  jobDetails: {
    marginBottom: 8,
    gap: 2,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  detailText: {
    fontSize: 11,
    color: AppColors.gray,
    marginLeft: 5,
  },
  jobDescription: {
    fontSize: 13,
    color: AppColors.dark,
    lineHeight: 18,
    marginBottom: 8,
  },
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryBadge: {
    backgroundColor: AppColors.lightGray,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 10,
  },
  categoryText: {
    fontSize: 10,
    color: AppColors.teal,
    fontWeight: '500',
  },
  jobActions: {
    flexDirection: 'row',
    gap: 4,
  },
  pdfButton: {
    padding: 6,
  },
  contactButton: {
    padding: 6,
  },
  postInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  postedBy: {
    fontSize: 10,
    color: AppColors.gray,
  },
  postedDate: {
    fontSize: 10,
    color: AppColors.gray,
  },
  deadlineInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.cream,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  deadlineText: {
    fontSize: 10,
    color: AppColors.warning,
    fontWeight: '500',
    marginLeft: 3,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: AppColors.dark,
    marginTop: 15,
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
    borderBottomWidth: 1,
    borderBottomColor: AppColors.border,
    paddingTop: 50,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: AppColors.dark,
  },
  closeButton: {
    padding: 5,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  jobDetailHeader: {
    paddingVertical: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: AppColors.border,
  },
  jobDetailTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: AppColors.dark,
    textAlign: 'center',
    marginBottom: 8,
  },
  jobDetailCompany: {
    fontSize: 16,
    color: AppColors.primary,
    fontWeight: '500',
    marginBottom: 12,
  },
  typeIndicatorLarge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  typeText: {
    color: AppColors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  jobDetailSection: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.border,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.dark,
    marginBottom: 12,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  infoItem: {
    width: '50%',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 12,
    color: AppColors.gray,
    marginTop: 4,
    marginLeft: 20,
  },
  infoValue: {
    fontSize: 14,
    color: AppColors.dark,
    fontWeight: '500',
    marginLeft: 20,
  },
  descriptionText: {
    fontSize: 14,
    color: AppColors.dark,
    lineHeight: 22,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  requirementText: {
    fontSize: 14,
    color: AppColors.dark,
    marginLeft: 8,
  },
  contactInfo: {
    backgroundColor: AppColors.lightGray,
    padding: 15,
    borderRadius: 8,
  },
  contactLabel: {
    fontSize: 14,
    color: AppColors.gray,
    marginBottom: 4,
  },
  contactValue: {
    fontSize: 16,
    color: AppColors.dark,
    fontWeight: '500',
  },
  pdfButtonLarge: {
    backgroundColor: AppColors.danger,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  pdfButtonText: {
    color: AppColors.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  contactButtonLarge: {
    backgroundColor: AppColors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  contactButtonText: {
    color: AppColors.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});