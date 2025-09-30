import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
} from 'react-native';
import { useAuth } from '@app/navigators';
import { useLanguage } from '@app/hooks/LanguageContext';
import { searchUsers, addFamilyMember } from '@app/utils/familyTreeApi';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

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
};

interface SearchUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profileImage: string | null;
  code: string;
  gender: string;
}

const RELATIONSHIP_TYPES = {
  'Parents': ['father', 'mother'],
  'Spouse': ['husband', 'wife', 'spouse'],
  'Children': ['son', 'daughter'],
  'Siblings': ['brother', 'sister'],
  'Grandparents': ['grandfather', 'grandmother'],
  'Grandchildren': ['grandson', 'granddaughter'],
  'Extended': ['uncle', 'aunt', 'nephew', 'niece', 'cousin'],
  'In-laws': [
    'father-in-law', 'mother-in-law',
    'son-in-law', 'daughter-in-law',
    'brother-in-law', 'sister-in-law'
  ],
};

const AddFamilyMemberScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<SearchUser | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRelation, setSelectedRelation] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  // Dummy search results for when API is not available
  const dummyUsers: SearchUser[] = [
    {
      _id: 'user-1',
      firstName: 'Alice',
      lastName: 'Johnson',
      email: 'alice@example.com',
      phone: '9876543215',
      profileImage: null,
      code: 'AJ3215',
      gender: 'female',
    },
    {
      _id: 'user-2',
      firstName: 'Robert',
      lastName: 'Williams',
      email: 'robert@example.com',
      phone: '9876543216',
      profileImage: null,
      code: 'RW3216',
      gender: 'male',
    },
    {
      _id: 'user-3',
      firstName: 'Emily',
      lastName: 'Brown',
      email: 'emily@example.com',
      phone: '9876543217',
      profileImage: null,
      code: 'EB3217',
      gender: 'female',
    },
  ];

  const handleSearch = async () => {
    if (searchQuery.length < 2) {
      Alert.alert(t('Error') || 'Error', t('Please enter at least 2 characters') || 'Please enter at least 2 characters');
      return;
    }

    setLoading(true);
    try {
      const response = await searchUsers(searchQuery);
      if (response.success) {
        setSearchResults(response.data);
      } else {
        // Use dummy data if API fails
        const filtered = dummyUsers.filter(user =>
          user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.code.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchResults(filtered);
      }
    } catch (error) {
      console.error('Search error:', error);
      // Use dummy data on error
      const filtered = dummyUsers.filter(user =>
        user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.code.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filtered);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectUser = (user: SearchUser) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  const handleAddMember = async () => {
    if (!selectedUser || !selectedRelation) {
      Alert.alert(t('Error') || 'Error', t('Please select a relationship type') || 'Please select a relationship type');
      return;
    }

    try {
      const response = await addFamilyMember(selectedUser._id, selectedRelation);
      if (response.success) {
        Alert.alert(
          t('Success') || 'Success',
          t('Family member added successfully!') || 'Family member added successfully!',
          [
            {
              text: t('OK') || 'OK',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      } else {
        if (response.message && response.message.includes('already exists')) {
          Alert.alert(t('Error') || 'Error', t('Relationship already exists. You can update it instead.') || 'Relationship already exists. You can update it instead.');
        } else {
          Alert.alert(t('Error') || 'Error', response.message || t('Failed to add family member') || 'Failed to add family member');
        }
      }
    } catch (error: any) {
      console.error('Add member error:', error);
      Alert.alert(t('Error') || 'Error', error.message || t('Failed to add family member') || 'Failed to add family member');
    } finally {
      setModalVisible(false);
      setSelectedUser(null);
      setSelectedRelation('');
    }
  };

  const renderSearchResult = ({ item }: { item: SearchUser }) => {
    const getInitials = () => {
      return `${item.firstName.charAt(0)}${item.lastName.charAt(0)}`.toUpperCase();
    };

    return (
      <TouchableOpacity
        style={styles.resultCard}
        onPress={() => handleSelectUser(item)}>
        <View style={styles.resultInfo}>
          <View style={styles.resultAvatar}>
            {item.profileImage ? (
              <Image source={{ uri: item.profileImage }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>{getInitials()}</Text>
              </View>
            )}
          </View>
          <View style={styles.resultDetails}>
            <Text style={styles.resultName}>
              {item.firstName} {item.lastName}
            </Text>
            <Text style={styles.resultCode}>Code: {item.code}</Text>
            <Text style={styles.resultPhone}>{item.phone}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.addIconButton}
          onPress={() => handleSelectUser(item)}>
          <Icon name="plus-circle" size={32} color={AppColors.teal} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const renderRelationshipGroup = (category: string, relations: string[]) => (
    <View key={category} style={styles.categoryGroup}>
      <Text style={styles.categoryTitle}>{t(category) || category}</Text>
      {relations.map((relation, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.relationOption,
            selectedRelation === relation && styles.relationOptionSelected,
          ]}
          onPress={() => {
            setSelectedRelation(relation);
            setShowDropdown(false);
          }}>
          <Text
            style={[
              styles.relationText,
              selectedRelation === relation && styles.relationTextSelected,
            ]}>
            {relation}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={AppColors.dark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('Add Family Member') || 'Add Family Member'}</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Icon name="magnify" size={24} color={AppColors.gray} />
          <TextInput
            style={styles.searchInput}
            placeholder={t('Search by name, phone, or code') || 'Search by name, phone, or code'}
            placeholderTextColor={AppColors.gray}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icon name="close-circle" size={24} color={AppColors.gray} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>{t('Search') || 'Search'}</Text>
        </TouchableOpacity>
      </View>

      {/* Search Results */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={AppColors.primary} />
          <Text style={styles.loadingText}>{t('Searching...') || 'Searching...'}</Text>
        </View>
      ) : searchResults.length > 0 ? (
        <FlatList
          data={searchResults}
          renderItem={renderSearchResult}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.resultsList}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      ) : searchQuery.length > 0 ? (
        <View style={styles.emptyState}>
          <Icon name="account-search" size={80} color={AppColors.gray} />
          <Text style={styles.emptyTitle}>{t('No Results Found') || 'No Results Found'}</Text>
          <Text style={styles.emptyMessage}>
            {t('Try searching with a different name, phone, or code') || 'Try searching with a different name, phone, or code'}
          </Text>
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Icon name="account-search" size={80} color={AppColors.gray} />
          <Text style={styles.emptyTitle}>{t('Search for Family Members') || 'Search for Family Members'}</Text>
          <Text style={styles.emptyMessage}>
            {t('Enter at least 2 characters to start searching') || 'Enter at least 2 characters to start searching'}
          </Text>
        </View>
      )}

      {/* Relationship Selection Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('Select Relationship') || 'Select Relationship'}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Icon name="close" size={24} color={AppColors.dark} />
              </TouchableOpacity>
            </View>

            {selectedUser && (
              <View style={styles.selectedUserCard}>
                <View style={styles.selectedUserAvatar}>
                  {selectedUser.profileImage ? (
                    <Image source={{ uri: selectedUser.profileImage }} style={styles.avatarImage} />
                  ) : (
                    <View style={styles.avatarPlaceholder}>
                      <Text style={styles.avatarText}>
                        {`${selectedUser.firstName.charAt(0)}${selectedUser.lastName.charAt(0)}`.toUpperCase()}
                      </Text>
                    </View>
                  )}
                </View>
                <View>
                  <Text style={styles.selectedUserName}>
                    {selectedUser.firstName} {selectedUser.lastName}
                  </Text>
                  <Text style={styles.selectedUserCode}>Code: {selectedUser.code}</Text>
                </View>
              </View>
            )}

            <Text style={styles.modalLabel}>{t('Choose relationship type:') || 'Choose relationship type:'}</Text>

            <ScrollView style={styles.relationshipList} showsVerticalScrollIndicator={false}>
              {Object.entries(RELATIONSHIP_TYPES).map(([category, relations]) =>
                renderRelationshipGroup(category, relations)
              )}
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setModalVisible(false);
                  setSelectedRelation('');
                }}>
                <Text style={styles.cancelButtonText}>{t('Cancel') || 'Cancel'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  styles.confirmButton,
                  !selectedRelation && styles.disabledButton,
                ]}
                onPress={handleAddMember}
                disabled={!selectedRelation}>
                <Text style={styles.confirmButtonText}>{t('Add') || 'Add'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.lightGray,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: AppColors.white,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.border,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: AppColors.dark,
  },
  placeholder: {
    width: 40,
  },
  searchContainer: {
    padding: 16,
    backgroundColor: AppColors.white,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.lightGray,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    fontSize: 16,
    color: AppColors.dark,
  },
  searchButton: {
    backgroundColor: AppColors.teal,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  searchButtonText: {
    color: AppColors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: AppColors.gray,
  },
  resultsList: {
    padding: 16,
  },
  resultCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: AppColors.white,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  resultInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  resultAvatar: {
    marginRight: 12,
  },
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: AppColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '600',
    color: AppColors.white,
  },
  resultDetails: {
    flex: 1,
  },
  resultName: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.dark,
    marginBottom: 4,
  },
  resultCode: {
    fontSize: 14,
    color: AppColors.teal,
    fontFamily: 'monospace',
    marginBottom: 2,
  },
  resultPhone: {
    fontSize: 14,
    color: AppColors.gray,
  },
  addIconButton: {
    padding: 8,
  },
  separator: {
    height: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: AppColors.dark,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 16,
    color: AppColors.gray,
    textAlign: 'center',
    lineHeight: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: AppColors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: AppColors.dark,
  },
  selectedUserCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.lightGray,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  selectedUserAvatar: {
    marginRight: 12,
  },
  selectedUserName: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.dark,
    marginBottom: 4,
  },
  selectedUserCode: {
    fontSize: 14,
    color: AppColors.teal,
    fontFamily: 'monospace',
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: AppColors.dark,
    marginBottom: 16,
  },
  relationshipList: {
    maxHeight: 400,
    marginBottom: 20,
  },
  categoryGroup: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.teal,
    marginBottom: 12,
  },
  relationOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: AppColors.border,
    marginBottom: 8,
  },
  relationOptionSelected: {
    backgroundColor: AppColors.teal,
    borderColor: AppColors.teal,
  },
  relationText: {
    fontSize: 15,
    color: AppColors.dark,
    textTransform: 'capitalize',
  },
  relationTextSelected: {
    color: AppColors.white,
    fontWeight: '600',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  cancelButton: {
    backgroundColor: AppColors.lightGray,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  cancelButtonText: {
    color: AppColors.dark,
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButton: {
    backgroundColor: AppColors.teal,
  },
  confirmButtonText: {
    color: AppColors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: AppColors.gray,
    opacity: 0.5,
  },
});

export default AddFamilyMemberScreen;