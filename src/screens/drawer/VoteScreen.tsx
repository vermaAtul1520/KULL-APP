import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Svg, {Path} from 'react-native-svg';
import {AppColors} from '@app/screens/Occasions/constants';

// Back Icon Component
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

// Dummy candidate data
const candidatesData = [
  {
    id: '1',
    name: 'Anita Verma',
    image:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    party: 'hand',
    hasVoted: false,
  },
  {
    id: '2',
    name: 'Rahul Yadav',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    party: 'vote',
    hasVoted: false,
  },
  {
    id: '3',
    name: 'Sunita Reddy',
    image:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    party: 'lotus',
    hasVoted: false,
  },
  {
    id: '4',
    name: 'Manoj Patel',
    image:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    party: 'vote',
    hasVoted: false,
  },
  {
    id: '5',
    name: 'Manoj Patel',
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    party: 'vote',
    hasVoted: false,
  },
];

// Hand Icon Component
const HandIcon = ({size = 24, color = AppColors.white}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M18 11V6a2 2 0 0 0-4 0v5M14 11V4a2 2 0 0 0-4 0v7M10 11V6a2 2 0 0 0-4 0v5M6 11v4a6 6 0 0 0 12 0v-4"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={color}
    />
  </Svg>
);

// Lotus Icon Component
const LotusIcon = ({size = 24, color = AppColors.white}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2C8 2 5 5 5 9c0 2 1 4 3 5-2 1-3 3-3 5 0 4 3 7 7 7s7-3 7-7c0-2-1-4-3-5 2-1 3-3 3-5 0-4-3-7-7-7z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={color}
    />
  </Svg>
);

const VoteScreen = (): React.JSX.Element => {
  const navigation = useNavigation();
  const [candidates, setCandidates] = useState(candidatesData);

  const handleVote = (candidateId: string) => {
    setCandidates(prevCandidates =>
      prevCandidates.map(candidate =>
        candidate.id === candidateId
          ? {...candidate, hasVoted: true}
          : candidate,
      ),
    );
  };

  const renderPartySymbol = (party: string) => {
    switch (party) {
      case 'hand':
        return <HandIcon size={20} color={AppColors.white} />;
      case 'lotus':
        return <LotusIcon size={20} color={AppColors.white} />;
      case 'vote':
      default:
        return <Text style={styles.voteButtonText}>Vote</Text>;
    }
  };

  const renderCandidate = ({item}: {item: any}) => (
    <View style={styles.candidateCard}>
      <View style={styles.candidateInfo}>
        <Image source={{uri: item.image}} style={styles.candidateImage} />
        <Text style={styles.candidateName}>{item.name}</Text>
      </View>
      <TouchableOpacity
        style={[styles.voteButton, item.hasVoted && styles.votedButton]}
        onPress={() => handleVote(item.id)}
        disabled={item.hasVoted}>
        {renderPartySymbol(item.party)}
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <BackIcon size={24} color={AppColors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Vote</Text>
      </View>

      <FlatList
        data={candidates}
        renderItem={renderCandidate}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        style={styles.flatList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.lightGray,
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
  },
  flatList: {
    flex: 1,
  },
  listContainer: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  candidateCard: {
    backgroundColor: AppColors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: AppColors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  candidateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  candidateImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  candidateName: {
    fontSize: 18,
    fontWeight: '600',
    color: AppColors.dark,
    flex: 1,
  },
  voteButton: {
    backgroundColor: AppColors.success,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  votedButton: {
    backgroundColor: AppColors.gray,
  },
  voteButtonText: {
    color: AppColors.white,
    fontSize: 14,
    fontWeight: '700',
  },
});

export default VoteScreen;
