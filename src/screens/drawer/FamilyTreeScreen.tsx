import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
  Pressable,
} from 'react-native';
import { useAuth } from '@app/navigators';
import { useLanguage } from '@app/hooks/LanguageContext';
import { getFamilyTree, removeFamilyMember, updateFamilyRelationship } from '@app/utils/familyTreeApi';
import { useFocusEffect } from '@react-navigation/native';
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

interface FamilyMember {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profileImage: string | null;
  code: string;
  gender: string;
  relationType: string;
  relationshipId: string;
  addedOn: string;
}

interface FamilyTreeData {
  parents: FamilyMember[];
  children: FamilyMember[];
  siblings: FamilyMember[];
  spouse: FamilyMember[];
  grandparents: FamilyMember[];
  grandchildren: FamilyMember[];
  extended: FamilyMember[];
}

const RELATIONSHIP_TYPES = [
  'father', 'mother', 'son', 'daughter',
  'husband', 'wife', 'spouse',
  'brother', 'sister',
  'grandfather', 'grandmother', 'grandson', 'granddaughter',
  'uncle', 'aunt', 'nephew', 'niece', 'cousin',
  'father-in-law', 'mother-in-law', 'son-in-law', 'daughter-in-law',
  'brother-in-law', 'sister-in-law'
];

const FamilyTreeScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [familyTree, setFamilyTree] = useState<FamilyTreeData | null>(null);
  const [totalMembers, setTotalMembers] = useState(0);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [newRelationType, setNewRelationType] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  // Dummy data for initial state
  const dummyFamilyTree: FamilyTreeData = {
    parents: [
      {
        _id: 'dummy-1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '9876543210',
        profileImage: null,
        code: 'JD3210',
        gender: 'male',
        relationType: 'father',
        relationshipId: 'rel-1',
        addedOn: new Date().toISOString(),
      },
      {
        _id: 'dummy-2',
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
        phone: '9876543211',
        profileImage: null,
        code: 'JD3211',
        gender: 'female',
        relationType: 'mother',
        relationshipId: 'rel-2',
        addedOn: new Date().toISOString(),
      },
    ],
    children: [
      {
        _id: 'dummy-3',
        firstName: 'Tom',
        lastName: 'Doe',
        email: 'tom@example.com',
        phone: '9876543212',
        profileImage: null,
        code: 'TD3212',
        gender: 'male',
        relationType: 'son',
        relationshipId: 'rel-3',
        addedOn: new Date().toISOString(),
      },
    ],
    siblings: [],
    spouse: [
      {
        _id: 'dummy-4',
        firstName: 'Mary',
        lastName: 'Doe',
        email: 'mary@example.com',
        phone: '9876543213',
        profileImage: null,
        code: 'MD3213',
        gender: 'female',
        relationType: 'wife',
        relationshipId: 'rel-4',
        addedOn: new Date().toISOString(),
      },
    ],
    grandparents: [],
    grandchildren: [],
    extended: [
      {
        _id: 'dummy-5',
        firstName: 'Bob',
        lastName: 'Smith',
        email: 'bob@example.com',
        phone: '9876543214',
        profileImage: null,
        code: 'BS3214',
        gender: 'male',
        relationType: 'uncle',
        relationshipId: 'rel-5',
        addedOn: new Date().toISOString(),
      },
    ],
  };

  useEffect(() => {
    loadFamilyTree();
  }, []);

  // Reload family tree when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadFamilyTree();
    }, [])
  );

  const loadFamilyTree = async () => {
    setLoading(true);
    try {
      const response = await getFamilyTree();
      if (response.success) {
        setFamilyTree(response.data);
        setTotalMembers(response.totalMembers);
      } else {
        // Use dummy data if no real data
        setFamilyTree(dummyFamilyTree);
        setTotalMembers(6);
      }
    } catch (error) {
      console.error('Error loading family tree:', error);
      // Use dummy data on error
      setFamilyTree(dummyFamilyTree);
      setTotalMembers(6);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = (member: FamilyMember) => {
    Alert.alert(
      t('Remove Family Member') || 'Remove Family Member',
      `${t('Remove')} ${member.firstName} ${member.lastName} ${t('from your family tree?')}`,
      [
        {
          text: t('Cancel') || 'Cancel',
          style: 'cancel',
        },
        {
          text: t('Remove') || 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await removeFamilyMember(member.relationshipId);
              if (response.success) {
                Alert.alert(t('Success') || 'Success', t('Family member removed successfully') || 'Family member removed successfully');
                loadFamilyTree();
              }
            } catch (error) {
              Alert.alert(t('Error') || 'Error', t('Failed to remove family member') || 'Failed to remove family member');
            }
          },
        },
      ]
    );
  };

  const handleEditMember = (member: FamilyMember) => {
    setSelectedMember(member);
    setNewRelationType(member.relationType);
    setEditModalVisible(true);
  };

  const handleUpdateRelationship = async () => {
    if (!selectedMember || !newRelationType) return;

    try {
      const response = await updateFamilyRelationship(selectedMember.relationshipId, newRelationType);
      if (response.success) {
        Alert.alert(t('Success') || 'Success', t('Relationship updated successfully') || 'Relationship updated successfully');
        setEditModalVisible(false);
        loadFamilyTree();
      }
    } catch (error) {
      Alert.alert(t('Error') || 'Error', t('Failed to update relationship') || 'Failed to update relationship');
    }
  };

  const renderMemberCard = (member: FamilyMember) => {
    const getInitials = () => {
      return `${member.firstName.charAt(0)}${member.lastName.charAt(0)}`.toUpperCase();
    };

    return (
      <View key={member._id} style={styles.memberCard}>
        <View style={styles.memberInfo}>
          <View style={styles.memberAvatar}>
            {member.profileImage ? (
              <Image source={{ uri: member.profileImage }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>{getInitials()}</Text>
              </View>
            )}
          </View>
          <View style={styles.memberDetails}>
            <Text style={styles.memberName}>
              {member.firstName} {member.lastName}
            </Text>
            <Text style={styles.memberRelation}>{member.relationType}</Text>
            <Text style={styles.memberCode}>Code: {member.code}</Text>
          </View>
        </View>
        <View style={styles.memberActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleEditMember(member)}>
            <Icon name="pencil" size={20} color={AppColors.teal} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleRemoveMember(member)}>
            <Icon name="delete" size={20} color={AppColors.danger} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderSection = (title: string, members: FamilyMember[], icon: string) => {
    if (!members || members.length === 0) return null;

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Icon name={icon} size={24} color={AppColors.teal} />
          <Text style={styles.sectionTitle}>
            {title} ({members.length})
          </Text>
        </View>
        {members.map(member => renderMemberCard(member))}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={AppColors.primary} />
        <Text style={styles.loadingText}>{t('Loading family tree...') || 'Loading family tree...'}</Text>
      </View>
    );
  }

  const renderTreeMember = (member: FamilyMember) => {
    const getInitials = () => {
      return `${member.firstName.charAt(0)}${member.lastName.charAt(0)}`.toUpperCase();
    };

    return (
      <View key={member._id} style={styles.treeMember}>
        <TouchableOpacity
          style={styles.treeMemberCard}
          onPress={() => handleEditMember(member)}>
          <View style={styles.treeMemberAvatar}>
            {member.profileImage ? (
              <Image source={{ uri: member.profileImage }} style={styles.treeAvatarImage} />
            ) : (
              <View style={[styles.treeAvatarPlaceholder, { backgroundColor: member.gender === 'male' ? '#4A90E2' : '#E24A90' }]}>
                <Text style={styles.treeAvatarText}>{getInitials()}</Text>
              </View>
            )}
          </View>
          <Text style={styles.treeMemberName}>{member.firstName}</Text>
          <Text style={styles.treeMemberRelation}>{member.relationType}</Text>
          <TouchableOpacity
            style={styles.treeRemoveButton}
            onPress={() => handleRemoveMember(member)}>
            <Icon name="close-circle" size={18} color={AppColors.danger} />
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
    );
  };

  const renderTreeRow = (members: FamilyMember[], showConnector = false) => {
    if (!members || members.length === 0) return null;

    return (
      <View style={styles.treeRow}>
        {showConnector && <View style={styles.verticalConnector} />}
        <View style={styles.treeRowMembers}>
          {members.map((member, index) => (
            <React.Fragment key={member._id}>
              {renderTreeMember(member)}
              {index < members.length - 1 && <View style={styles.horizontalConnector} />}
            </React.Fragment>
          ))}
        </View>
      </View>
    );
  };

  const renderCurrentUser = () => {
    return (
      <View style={styles.treeRow}>
        <View style={styles.verticalConnector} />
        <View style={styles.currentUserRow}>
          <View style={styles.treeMember}>
            <View style={styles.currentUserCard}>
              <View style={styles.treeMemberAvatar}>
                {user?.profileImage ? (
                  <Image source={{ uri: user.profileImage }} style={styles.treeAvatarImage} />
                ) : (
                  <View style={[styles.treeAvatarPlaceholder, { backgroundColor: AppColors.teal }]}>
                    <Text style={styles.treeAvatarText}>
                      {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                    </Text>
                  </View>
                )}
              </View>
              <Text style={styles.treeMemberName}>{user?.firstName}</Text>
              <Text style={[styles.treeMemberRelation, { color: AppColors.teal }]}>You</Text>
            </View>
          </View>

          {familyTree?.spouse && familyTree.spouse.length > 0 && (
            <>
              <View style={styles.spouseConnector} />
              {renderTreeMember(familyTree.spouse[0])}
            </>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={AppColors.dark} />
        </TouchableOpacity>
        <Text style={styles.topHeaderTitle}>{t('Family Tree') || 'Family Tree'}</Text>
        <TouchableOpacity
          style={styles.infoButton}
          onPress={() => Alert.alert(t('Family Tree'), t('View and manage your family relationships in a hierarchical tree format.'))}>
          <Icon name="information-outline" size={24} color={AppColors.dark} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.statsCard}>
            <Icon name="family-tree" size={40} color={AppColors.primary} />
            <Text style={styles.statsNumber}>{totalMembers}</Text>
            <Text style={styles.statsLabel}>{t('Total Family Members') || 'Total Family Members'}</Text>
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('AddFamilyMember')}>
            <Icon name="account-plus" size={24} color={AppColors.white} />
            <Text style={styles.addButtonText}>{t('Add Member') || 'Add Member'}</Text>
          </TouchableOpacity>
        </View>

        {/* Empty State */}
        {totalMembers === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="tree-outline" size={80} color={AppColors.gray} />
            <Text style={styles.emptyTitle}>{t('No Family Members Yet') || 'No Family Members Yet'}</Text>
            <Text style={styles.emptyMessage}>
              {t('Start building your family tree by adding members') || 'Start building your family tree by adding members'}
            </Text>
          </View>
        ) : (
          <View style={styles.treeContainer}>
            {/* Grandparents */}
            {familyTree?.grandparents && familyTree.grandparents.length > 0 && (
              <>
                <View style={styles.generationHeader}>
                  <Icon name="account-tie" size={16} color={AppColors.teal} />
                  <Text style={styles.generationLabel}>{t('Grandparents') || 'Grandparents'}</Text>
                </View>
                {renderTreeRow(familyTree.grandparents, false)}
              </>
            )}

            {/* Parents */}
            {familyTree?.parents && familyTree.parents.length > 0 && (
              <>
                <View style={styles.generationHeader}>
                  <Icon name="account-supervisor" size={16} color={AppColors.teal} />
                  <Text style={styles.generationLabel}>{t('Parents') || 'Parents'}</Text>
                </View>
                {renderTreeRow(familyTree.parents, familyTree.grandparents.length > 0)}
              </>
            )}

            {/* Siblings */}
            {familyTree?.siblings && familyTree.siblings.length > 0 && (
              <>
                <View style={styles.generationHeader}>
                  <Icon name="account-multiple" size={16} color={AppColors.teal} />
                  <Text style={styles.generationLabel}>{t('Siblings') || 'Siblings'}</Text>
                </View>
                {renderTreeRow(familyTree.siblings, true)}
              </>
            )}

            {/* Current User & Spouse */}
            <View style={styles.generationHeader}>
              <Icon name="account-heart" size={16} color={AppColors.teal} />
              <Text style={styles.generationLabel}>{t('You & Spouse') || 'You & Spouse'}</Text>
            </View>
            {renderCurrentUser()}

            {/* Children */}
            {familyTree?.children && familyTree.children.length > 0 && (
              <>
                <View style={styles.generationHeader}>
                  <Icon name="human-child" size={16} color={AppColors.teal} />
                  <Text style={styles.generationLabel}>{t('Children') || 'Children'}</Text>
                </View>
                {renderTreeRow(familyTree.children, true)}
              </>
            )}

            {/* Grandchildren */}
            {familyTree?.grandchildren && familyTree.grandchildren.length > 0 && (
              <>
                <View style={styles.generationHeader}>
                  <Icon name="baby-face-outline" size={16} color={AppColors.teal} />
                  <Text style={styles.generationLabel}>{t('Grandchildren') || 'Grandchildren'}</Text>
                </View>
                {renderTreeRow(familyTree.grandchildren, true)}
              </>
            )}

            {/* Extended Family */}
            {familyTree?.extended && familyTree.extended.length > 0 && (
              <View style={styles.extendedSection}>
                <View style={styles.generationHeader}>
                  <Icon name="account-group" size={16} color={AppColors.teal} />
                  <Text style={styles.generationLabel}>{t('Extended Family') || 'Extended Family'}</Text>
                </View>
                <View style={styles.extendedGrid}>
                  {familyTree.extended.map(member => renderTreeMember(member))}
                </View>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Edit Modal */}
      <Modal
        visible={editModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('Edit Relationship') || 'Edit Relationship'}</Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Icon name="close" size={24} color={AppColors.dark} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalLabel}>{t('Select Relationship Type') || 'Select Relationship Type'}</Text>

            <Pressable
              style={styles.dropdownButton}
              onPress={() => setShowDropdown(!showDropdown)}>
              <Text style={styles.dropdownButtonText}>
                {newRelationType || t('Select...') || 'Select...'}
              </Text>
              <Icon name={showDropdown ? "chevron-up" : "chevron-down"} size={24} color={AppColors.gray} />
            </Pressable>

            {showDropdown && (
              <ScrollView style={styles.dropdownList}>
                {RELATIONSHIP_TYPES.map((type, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setNewRelationType(type);
                      setShowDropdown(false);
                    }}>
                    <Text style={styles.dropdownItemText}>{type}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setEditModalVisible(false)}>
                <Text style={styles.cancelButtonText}>{t('Cancel') || 'Cancel'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleUpdateRelationship}>
                <Text style={styles.saveButtonText}>{t('Save') || 'Save'}</Text>
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
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppColors.lightGray,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: AppColors.gray,
  },
  header: {
    backgroundColor: AppColors.white,
    padding: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statsCard: {
    alignItems: 'center',
    marginBottom: 20,
  },
  statsNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: AppColors.dark,
    marginTop: 8,
  },
  statsLabel: {
    fontSize: 16,
    color: AppColors.gray,
    marginTop: 4,
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: AppColors.teal,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  addButtonText: {
    color: AppColors.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 22,
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
  section: {
    marginTop: 20,
    marginHorizontal: 16,
    backgroundColor: AppColors.white,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: AppColors.dark,
    marginLeft: 12,
  },
  memberCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.border,
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  memberAvatar: {
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
  memberDetails: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.dark,
    marginBottom: 4,
  },
  memberRelation: {
    fontSize: 14,
    color: AppColors.teal,
    textTransform: 'capitalize',
    marginBottom: 2,
  },
  memberCode: {
    fontSize: 12,
    color: AppColors.gray,
    fontFamily: 'monospace',
  },
  memberActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: AppColors.white,
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxHeight: '80%',
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
  modalLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: AppColors.dark,
    marginBottom: 12,
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: AppColors.border,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  dropdownButtonText: {
    fontSize: 16,
    color: AppColors.dark,
    textTransform: 'capitalize',
  },
  dropdownList: {
    maxHeight: 200,
    borderWidth: 1,
    borderColor: AppColors.border,
    borderRadius: 8,
    marginBottom: 20,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.border,
  },
  dropdownItemText: {
    fontSize: 16,
    color: AppColors.dark,
    textTransform: 'capitalize',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
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
  saveButton: {
    backgroundColor: AppColors.teal,
  },
  saveButtonText: {
    color: AppColors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: AppColors.white,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.border,
  },
  backButton: {
    padding: 8,
  },
  topHeaderTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: AppColors.dark,
  },
  infoButton: {
    padding: 8,
  },
  treeContainer: {
    padding: 20,
    alignItems: 'center',
  },
  generationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 12,
  },
  generationLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.teal,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginLeft: 6,
  },
  treeRow: {
    alignItems: 'center',
    position: 'relative',
  },
  treeRowMembers: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  treeMember: {
    margin: 8,
  },
  treeMemberCard: {
    alignItems: 'center',
    padding: 12,
    backgroundColor: AppColors.white,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: AppColors.border,
    width: 100,
    position: 'relative',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  currentUserCard: {
    alignItems: 'center',
    padding: 12,
    backgroundColor: AppColors.white,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: AppColors.teal,
    width: 100,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  treeMemberAvatar: {
    marginBottom: 8,
  },
  treeAvatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  treeAvatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  treeAvatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: AppColors.white,
  },
  treeMemberName: {
    fontSize: 13,
    fontWeight: '600',
    color: AppColors.dark,
    textAlign: 'center',
    marginBottom: 2,
  },
  treeMemberRelation: {
    fontSize: 10,
    color: AppColors.gray,
    textTransform: 'capitalize',
    textAlign: 'center',
  },
  treeRemoveButton: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: AppColors.white,
    borderRadius: 10,
  },
  verticalConnector: {
    width: 2,
    height: 30,
    backgroundColor: AppColors.border,
    marginBottom: -10,
  },
  horizontalConnector: {
    height: 2,
    width: 20,
    backgroundColor: AppColors.border,
    marginHorizontal: 4,
  },
  currentUserRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spouseConnector: {
    height: 2,
    width: 30,
    backgroundColor: AppColors.teal,
    marginHorizontal: 8,
  },
  extendedSection: {
    marginTop: 32,
    width: '100%',
    alignItems: 'center',
  },
  extendedGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 8,
  },
});

export default FamilyTreeScreen;