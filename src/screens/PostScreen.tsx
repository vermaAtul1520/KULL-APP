import {getAuthHeaders, getCommunityId} from '@app/constants/apiUtils';
import {BASE_URL} from '@app/constants/constant';
import {useAuth} from '@app/navigators';
import {useLanguage} from '@app/hooks/LanguageContext'; // Add this import
import BannerComponent from '@app/navigators/BannerComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
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
  TextInput,
  Alert,
  Dimensions,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import Svg, {Path, Circle, Rect, G} from 'react-native-svg';

const {width, height} = Dimensions.get('window');

// API Interfaces
interface CommentAuthor {
  _id: string;
  firstName: string;
  lastName: string;
}

interface Author {
  _id: string;
  firstName: string;
  lastName: string;
  roleInCommunity: string;
}

interface Community {
  _id: string;
  name: string;
}

interface ApiComment {
  _id: string;
  post: string;
  author: CommentAuthor;
  content: string;
  parentComment: string | null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  replies: ApiComment[];
}

interface CommentsResponse {
  count: number;
  comments: ApiComment[];
}

interface Post {
  _id: string;
  title: string;
  content: string;
  imageUrl: string | null;
  author: Author;
  community: Community;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  // Additional local properties
  likes?: number;
  comments?: number;
  isLiked?: boolean;
  commentsData?: ApiComment[];
}

interface APIResponse {
  success: boolean;
  data: Post[];
}

const PostScreen = () => {
  const {user, token} = useAuth();
  const {t} = useLanguage(); // Add this line
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isAdmin, setIsAdmin] = useState(true);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    imageUrl: '',
    selectedImage: null as string | null,
  });
  const [newComment, setNewComment] = useState('');
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);
  const [postingComment, setPostingComment] = useState(false);
  const [replyingTo, setReplyingTo] = useState<{
    id: string;
    author: string;
  } | null>(null);

  console.log('commentsss', filteredPosts);

  const navigation = useNavigation();

  // Search functionality
  useEffect(() => {
    filterPosts();
  }, [searchQuery, posts]);

  const filterPosts = () => {
    if (searchQuery.trim() === '') {
      setFilteredPosts(posts);
    } else {
      const query = searchQuery.toLowerCase().trim();
      const filtered = posts.filter(
        post =>
          post.title.toLowerCase().includes(query) ||
          post.content.toLowerCase().includes(query) ||
          `${post.author.firstName} ${post.author.lastName}`
            .toLowerCase()
            .includes(query) ||
          post.community.name.toLowerCase().includes(query),
      );
      setFilteredPosts(filtered);
    }
  };

  // SVG Icon Components
  const PlusIcon = ({size = 24, color = '#fff'}) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill={color} />
    </Svg>
  );

  const SearchIcon = ({size = 20, color = '#666'}) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
        fill={color}
      />
    </Svg>
  );

  const LikeIcon = ({size = 20, color = '#666', filled = false}) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"
        fill={filled ? '#3b82f6' : 'none'}
        stroke={filled ? '#3b82f6' : color}
        strokeWidth="2"
      />
    </Svg>
  );

  const CommentIcon = ({size = 20, color = '#666'}) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
        fill="none"
        stroke={color}
        strokeWidth="2"
      />
    </Svg>
  );

  const DownloadIcon = ({size = 20, color = '#666'}) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"
        fill="none"
        stroke={color}
        strokeWidth="2"
      />
    </Svg>
  );

  const ArrowLeftIcon = ({size = 24, color = '#2a2a2a'}) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"
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

  const SendIcon = ({size = 20, color = '#3b82f6'}) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M2 21l21-9L2 3v7l15 2-15 2v7z" fill={color} />
    </Svg>
  );

  const CameraIcon = ({size = 20, color = '#666'}) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
        fill="none"
        stroke={color}
        strokeWidth="2"
      />
      <Circle
        cx="12"
        cy="13"
        r="4"
        fill="none"
        stroke={color}
        strokeWidth="2"
      />
    </Svg>
  );

  const GalleryIcon = ({size = 20, color = '#666'}) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="2"
        ry="2"
        fill="none"
        stroke={color}
        strokeWidth="2"
      />
      <Circle cx="8.5" cy="8.5" r="1.5" fill={color} />
      <Path d="M21 15l-5-5L5 21" fill="none" stroke={color} strokeWidth="2" />
    </Svg>
  );

  const ReplyIcon = ({size = 16, color = '#3b82f6'}) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 10h10a8 8 0 1 1 0 16v-2.5a6 6 0 1 0 0-11H3v-3z"
        fill="none"
        stroke={color}
        strokeWidth="2"
      />
      <Path d="M6 4L3 7l3 3" fill="none" stroke={color} strokeWidth="2" />
    </Svg>
  );

  const DeleteIcon = ({size = 16, color = '#dc3545'}) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14zM10 11v6M14 11v6"
        fill="none"
        stroke={color}
        strokeWidth="2"
      />
    </Svg>
  );

  // API Functions
  const fetchPosts = async (): Promise<Post[]> => {
    try {
      const headers = await getAuthHeaders();
      const communityId = await getCommunityId();
      const response = await fetch(
        `${BASE_URL}/api/posts/community/${communityId}`,
        {
          method: 'GET',
          headers,
        },
      );

      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }

      const data: APIResponse = await response.json();

      return data.data.map(post => ({
        ...post,
        likes: 0,
        comments: 0,
        isLiked: false,
        commentsData: [],
      }));
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  };

  const createPost = async (postData: {
    title: string;
    content: string;
    imageUrl?: string;
  }) => {
    try {
      const headers = await getAuthHeaders();
      const COMMUNITY_ID = await getCommunityId();
      const response = await fetch(`${BASE_URL}/api/posts/`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          ...postData,
          community: COMMUNITY_ID,
        }),
      });

      console.log('responseArvind', response);

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  };

  const likePost = async (postId: string) => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${BASE_URL}/api/posts/likes/${postId}`, {
        method: 'POST',
        headers,
      });

      if (!response.ok) {
        throw new Error('Failed to like post');
      }

      const data = await response.json();

      console.log('dataaaaaaaaa', data);

      return data;
    } catch (error) {
      console.error('Error liking post:', error);
      throw error;
    }
  };

  // Comment API Functions
  const fetchComments = async (postId: string): Promise<ApiComment[]> => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${BASE_URL}/api/posts/comments/${postId}`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', errorText);
        throw new Error('Failed to fetch comments');
      }

      const responseText = await response.text();
      console.log('Raw response:', responseText);

      let data: CommentsResponse;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        console.error('Response text:', responseText);
        throw new Error('Invalid response format');
      }

      return data.comments || [];
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  };

  const postComment = async (
    postId: string,
    content: string,
    parentComment?: string,
  ) => {
    try {
      const headers = await getAuthHeaders();
      const body: any = {content};
      if (parentComment) {
        body.parentComment = parentComment;
      }

      const response = await fetch(`${BASE_URL}/api/posts/comments/${postId}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });

      console.log('responseArvind', response);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Post comment API Error:', errorText);
        throw new Error('Failed to post comment');
      }

      const responseText = await response.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Post comment JSON Parse Error:', parseError);
        // If it's just a success response without JSON, that's ok
        data = {success: true};
      }

      return data;
    } catch (error) {
      console.error('Error posting comment:', error);
      throw error;
    }
  };

  const deleteComment = async (commentId: string) => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(
        `${BASE_URL}/api/posts/comments/${commentId}`,
        {
          method: 'DELETE',
          headers,
        },
      );

      if (!response.ok) {
        throw new Error('Failed to delete comment');
      }

      return true;
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  };

  // Helper Functions
  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60),
    );

    if (diffInMinutes < 1) return t('Just now') || 'Just now';
    if (diffInMinutes < 60)
      return `${diffInMinutes} ${t('minutes ago') || 'minutes ago'}`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24)
      return `${diffInHours} ${t('hours ago') || 'hours ago'}`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} ${t('days ago') || 'days ago'}`;

    return date.toLocaleDateString();
  };

  const getAuthorAvatar = (author: Author | CommentAuthor): string => {
    const fullName = `${author.firstName} ${author.lastName}`;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      fullName,
    )}&background=2a2a2a&color=fff&size=100`;
  };

  // Main Functions
  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const fetchedPosts = await fetchPosts();
      setPosts(fetchedPosts);
      setFilteredPosts(fetchedPosts);
    } catch (error) {
      Alert.alert(
        t('Error') || 'Error',
        t('Failed to load posts. Please try again.') ||
          'Failed to load posts. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await loadPosts();
    } finally {
      setRefreshing(false);
    }
  };

  const handleLike = async (post: Post) => {
    try {
      setPosts(prevPosts =>
        prevPosts.map(p =>
          p._id === post._id
            ? {
                ...p,
                isLiked: !p.isLiked,
                likes: (p.likes || 0) + (p.isLiked ? -1 : 1),
              }
            : p,
        ),
      );

      await likePost(post._id);
    } catch (error) {
      setPosts(prevPosts =>
        prevPosts.map(p =>
          p._id === post._id
            ? {
                ...p,
                isLiked: !p.isLiked,
                likes: (p.likes || 0) + (p.isLiked ? 1 : -1),
              }
            : p,
        ),
      );
      Alert.alert(
        t('Error') || 'Error',
        t('Failed to like post. Please try again.') ||
          'Failed to like post. Please try again.',
      );
    }
  };

  const handleDownload = (imageUrl: string | null, postTitle: string) => {
    if (!imageUrl) {
      Alert.alert(
        t('Error') || 'Error',
        t('No image to download') || 'No image to download',
      );
      return;
    }

    Alert.alert(
      t('Download Image') || 'Download Image',
      `${t('Download')} "${postTitle}" ${t('image?') || 'image?'}`,
      [
        {text: t('Cancel') || 'Cancel', style: 'cancel'},
        {
          text: t('Download') || 'Download',
          onPress: () => {
            Alert.alert(
              t('Success') || 'Success',
              t('Image downloaded successfully!') ||
                'Image downloaded successfully!',
            );
          },
        },
      ],
    );
  };

  const openComments = async (post: Post) => {
    console.log('Opening comments for post:', post._id);
    setSelectedPost({...post, commentsData: []});
    setShowCommentsModal(true);

    try {
      setLoadingComments(true);
      console.log('Fetching comments for post ID:', post._id);
      const comments = await fetchComments(post._id);
      console.log('Fetched comments:', comments);

      setSelectedPost(prev => ({
        ...prev!,
        commentsData: comments,
        comments: comments.length,
      }));

      setPosts(prevPosts =>
        prevPosts.map(p =>
          p._id === post._id
            ? {...p, comments: comments.length, commentsData: comments}
            : p,
        ),
      );
    } catch (error) {
      console.error('Error in openComments:', error);
      Alert.alert(
        t('Error') || 'Error',
        t('Failed to load comments. Please try again.') ||
          'Failed to load comments. Please try again.',
      );
      // Don't close the modal, just show the error state
    } finally {
      setLoadingComments(false);
    }
  };

  const handleCreatePost = async () => {
    const COMMUNITY_ID = await getCommunityId();
    if (!newPost.title.trim() || !newPost.content.trim()) {
      Alert.alert(
        t('Error') || 'Error',
        t('Please fill in all required fields') ||
          'Please fill in all required fields',
      );
      return;
    }

    setIsCreatingPost(true);

    try {
      const postData = {
        title: newPost.title.trim(),
        community: COMMUNITY_ID,
        content: newPost.content.trim(),
        imageUrl: newPost.selectedImage || newPost.imageUrl || undefined,
      };

      await createPost(postData);

      await loadPosts();

      setNewPost({title: '', content: '', imageUrl: '', selectedImage: null});
      setShowPostModal(false);
      Alert.alert(
        t('Success') || 'Success',
        t('Post created successfully!') || 'Post created successfully!',
      );
    } catch (error) {
      Alert.alert(
        t('Error') || 'Error',
        t('Failed to create post. Please try again.') ||
          'Failed to create post. Please try again.',
      );
    } finally {
      setIsCreatingPost(false);
    }
  };

  const handleImageSelection = (type: 'camera' | 'gallery') => {
    setShowImagePicker(false);

    if (type === 'camera') {
      Alert.alert(
        t('Camera') || 'Camera',
        t('Camera feature would open here. For demo, using a sample image.') ||
          'Camera feature would open here. For demo, using a sample image.',
      );
      const sampleImage = 'https://picsum.photos/800/600?random=1';
      setNewPost({...newPost, selectedImage: sampleImage});
    } else if (type === 'gallery') {
      Alert.alert(
        t('Gallery') || 'Gallery',
        t('Gallery would open here. For demo, using a sample image.') ||
          'Gallery would open here. For demo, using a sample image.',
      );
      const sampleImage = 'https://picsum.photos/800/600?random=2';
      setNewPost({...newPost, selectedImage: sampleImage});
    }
  };

  const addComment = async (comment: string) => {
    if (!comment.trim() || !selectedPost) return;

    try {
      setPostingComment(true);
      await postComment(selectedPost._id, comment, replyingTo?.id || undefined);

      const updatedComments = await fetchComments(selectedPost._id);

      setSelectedPost(prev => ({
        ...prev!,
        comments: updatedComments.length,
        commentsData: updatedComments,
      }));

      setPosts(prevPosts =>
        prevPosts.map(post =>
          post._id === selectedPost._id
            ? {
                ...post,
                comments: updatedComments.length,
                commentsData: updatedComments,
              }
            : post,
        ),
      );

      setReplyingTo(null);
    } catch (error) {
      Alert.alert(
        t('Error') || 'Error',
        t('Failed to post comment') || 'Failed to post comment',
      );
    } finally {
      setPostingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!selectedPost) return;

    Alert.alert(
      t('Delete Comment') || 'Delete Comment',
      t('Are you sure you want to delete this comment?') ||
        'Are you sure you want to delete this comment?',
      [
        {text: t('Cancel') || 'Cancel', style: 'cancel'},
        {
          text: t('Delete') || 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteComment(commentId);

              const updatedComments = await fetchComments(selectedPost._id);

              setSelectedPost(prev => ({
                ...prev!,
                comments: updatedComments.length,
                commentsData: updatedComments,
              }));

              setPosts(prevPosts =>
                prevPosts.map(post =>
                  post._id === selectedPost._id
                    ? {
                        ...post,
                        comments: updatedComments.length,
                        commentsData: updatedComments,
                      }
                    : post,
                ),
              );
            } catch (error) {
              Alert.alert(
                t('Error') || 'Error',
                t('Failed to delete comment') || 'Failed to delete comment',
              );
            }
          },
        },
      ],
    );
  };

  const renderComment = (comment: ApiComment, isReply = false) => (
    <View
      key={comment._id}
      style={[styles.commentItem, isReply && styles.replyItem]}>
      <View style={styles.commentHeader}>
        <Image
          source={{uri: getAuthorAvatar(comment.author)}}
          style={styles.commentAvatar}
        />
        <View style={styles.commentInfo}>
          <Text style={styles.commentAuthor}>
            {`${comment.author.firstName} ${comment.author.lastName}`.trim()}
          </Text>
          <Text style={styles.commentTime}>
            {formatTimeAgo(comment.createdAt)}
          </Text>
        </View>
      </View>

      <Text style={styles.commentText}>{comment.content}</Text>

      <View style={styles.commentActions}>
        {!isReply && (
          <TouchableOpacity
            style={styles.replyButton}
            onPress={() =>
              setReplyingTo({
                id: comment._id,
                author: `${comment.author.firstName} ${comment.author.lastName}`,
              })
            }>
            <Text style={styles.replyButtonText}>{t('Reply') || 'Reply'}</Text>
          </TouchableOpacity>
        )}

        {user && user._id === comment.author._id && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteComment(comment._id)}>
            <Text style={styles.deleteButtonText}>
              {t('Delete') || 'Delete'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {comment.replies && comment.replies.length > 0 && (
        <View style={styles.repliesContainer}>
          {comment.replies.map(reply => renderComment(reply, true))}
        </View>
      )}
    </View>
  );

  const renderPost = ({item}: {item: Post}) => (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <Image
          source={{uri: getAuthorAvatar(item.author)}}
          style={styles.authorAvatar}
        />
        <View style={styles.authorInfo}>
          <Text style={styles.authorName}>
            {`${item.author.firstName} ${item.author.lastName}`}
          </Text>
          <Text style={styles.timestamp}>{formatTimeAgo(item.createdAt)}</Text>
          <Text style={styles.communityName}>{item.community.name}</Text>
        </View>
      </View>

      <Text style={styles.postTitle}>{item.title}</Text>
      <Text style={styles.postContent}>{item.content}</Text>

      {item.imageUrl && (
        <Image source={{uri: item.imageUrl}} style={styles.postImage} />
      )}

      <View style={styles.postActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleLike(item)}>
          <LikeIcon
            size={20}
            color={item.isLiked ? '#3b82f6' : '#666'}
            filled={item.isLiked}
          />
          <Text style={[styles.actionText, item.isLiked && styles.likedText]}>
            {item.likes || 0}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => openComments(item)}>
          <CommentIcon size={20} color="#666" />
          <Text style={styles.actionText}>{item.comments || 0}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleDownload(item.imageUrl, item.title)}>
          <DownloadIcon size={20} color="#666" />
          <Text style={styles.actionText}>{t('Download') || 'Download'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCreatePostModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showPostModal}
      onRequestClose={() => setShowPostModal(false)}>
      <View style={styles.modalOverlay}>
        <View style={styles.createPostModal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {t('Create New Post') || 'Create New Post'}
            </Text>
            <TouchableOpacity onPress={() => setShowPostModal(false)}>
              <CloseIcon size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.createPostContent}
            showsVerticalScrollIndicator={false}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>{t('Title') || 'Title'} *</Text>
              <TextInput
                style={styles.titleInput}
                placeholder={t('Enter post title...') || 'Enter post title...'}
                value={newPost.title}
                onChangeText={text => setNewPost({...newPost, title: text})}
                multiline
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>
                {t('Content') || 'Content'} *
              </Text>
              <TextInput
                style={styles.contentInput}
                placeholder={
                  t("What's on your mind?") || "What's on your mind?"
                }
                value={newPost.content}
                onChangeText={text => setNewPost({...newPost, content: text})}
                multiline
                textAlignVertical="top"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>
                {t('Add Image') || 'Add Image'}
              </Text>
              <View style={styles.imageOptions}>
                <TouchableOpacity
                  style={styles.imageOption}
                  onPress={() => setShowImagePicker(true)}>
                  <CameraIcon size={24} color="#666" />
                  <Text style={styles.imageOptionText}>
                    {t('Camera/Gallery') || 'Camera/Gallery'}
                  </Text>
                </TouchableOpacity>

                <Text style={styles.orText}>{t('OR') || 'OR'}</Text>

                <TextInput
                  style={styles.imageUrlInput}
                  placeholder={t('Paste image URL...') || 'Paste image URL...'}
                  value={newPost.imageUrl}
                  onChangeText={text =>
                    setNewPost({...newPost, imageUrl: text})
                  }
                />
              </View>
            </View>

            {(newPost.selectedImage || newPost.imageUrl) && (
              <View style={styles.imagePreviewContainer}>
                <Text style={styles.inputLabel}>
                  {t('Preview') || 'Preview'}
                </Text>
                <Image
                  source={{uri: newPost.selectedImage || newPost.imageUrl}}
                  style={styles.previewImage}
                />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() =>
                    setNewPost({...newPost, selectedImage: null, imageUrl: ''})
                  }>
                  <Text style={styles.removeImageText}>
                    {t('Remove Image') || 'Remove Image'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setShowPostModal(false)}
              disabled={isCreatingPost}>
              <Text style={styles.cancelButtonText}>
                {t('Cancel') || 'Cancel'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modalButton,
                styles.postButton,
                {opacity: isCreatingPost ? 0.6 : 1},
              ]}
              onPress={handleCreatePost}
              disabled={isCreatingPost}>
              {isCreatingPost ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.postButtonText}>{t('Post') || 'Post'}</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={showImagePicker}
        onRequestClose={() => setShowImagePicker(false)}>
        <View style={styles.imagePickerOverlay}>
          <View style={styles.imagePickerModal}>
            <Text style={styles.imagePickerTitle}>
              {t('Select Image') || 'Select Image'}
            </Text>

            <TouchableOpacity
              style={styles.imagePickerOption}
              onPress={() => handleImageSelection('camera')}>
              <CameraIcon size={24} color="#2a2a2a" />
              <Text style={styles.imagePickerOptionText}>
                {t('Take Photo') || 'Take Photo'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.imagePickerOption}
              onPress={() => handleImageSelection('gallery')}>
              <GalleryIcon size={24} color="#2a2a2a" />
              <Text style={styles.imagePickerOptionText}>
                {t('Choose from Gallery') || 'Choose from Gallery'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.imagePickerCancel}
              onPress={() => setShowImagePicker(false)}>
              <Text style={styles.imagePickerCancelText}>
                {t('Cancel') || 'Cancel'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Modal>
  );

  const renderCommentsModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showCommentsModal}
      onRequestClose={() => {
        setShowCommentsModal(false);
        setReplyingTo(null);
      }}>
      <View style={styles.modalOverlay}>
        <View style={styles.commentsModal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {t('Comments') || 'Comments'} ({selectedPost?.comments || 0})
            </Text>
            <TouchableOpacity
              onPress={() => {
                setShowCommentsModal(false);
                setReplyingTo(null);
              }}>
              <CloseIcon size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.commentsContent}>
            {loadingComments ? (
              <View style={styles.loadingCommentsContainer}>
                <ActivityIndicator size="small" color="#2a2a2a" />
                <Text style={styles.loadingCommentsText}>
                  {t('Loading comments...') || 'Loading comments...'}
                </Text>
              </View>
            ) : selectedPost?.commentsData?.length === 0 ? (
              <View style={styles.noCommentsContainer}>
                <Text style={styles.noCommentsText}>
                  {t('No comments yet. Be the first to comment!') ||
                    'No comments yet. Be the first to comment!'}
                </Text>
              </View>
            ) : (
              selectedPost?.commentsData?.map(comment => renderComment(comment))
            )}
          </ScrollView>

          {replyingTo && (
            <View style={styles.replyingToIndicator}>
              <Text style={styles.replyingToText}>
                {t('Replying to') || 'Replying to'} {replyingTo.author}
              </Text>
              <TouchableOpacity onPress={() => setReplyingTo(null)}>
                <Text style={styles.cancelReplyText}>
                  {t('Cancel') || 'Cancel'}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.commentInputContainer}>
            <TextInput
              style={styles.commentInput}
              placeholder={
                replyingTo
                  ? t('Add a reply...') || 'Add a reply...'
                  : t('Add a comment...') || 'Add a comment...'
              }
              value={newComment}
              onChangeText={setNewComment}
              multiline
            />
            <TouchableOpacity
              style={[styles.sendButton, {opacity: postingComment ? 0.6 : 1}]}
              onPress={() => {
                addComment(newComment);
                setNewComment('');
              }}
              disabled={postingComment}>
              {postingComment ? (
                <ActivityIndicator size="small" color="#3b82f6" />
              ) : (
                <SendIcon size={20} color="#3b82f6" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2a2a2a" />
        <Text style={styles.loadingText}>
          {t('Loading posts...') || 'Loading posts...'}
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <BannerComponent />
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <ArrowLeftIcon size={24} color="#2a2a2a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('Posts') || 'Posts'}</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <SearchIcon size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder={
              t('Search posts by title, content, author...') ||
              'Search posts by title, content, author...'
            }
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              style={styles.clearSearchButton}>
              <CloseIcon size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Results Count */}
      {searchQuery.trim() !== '' && (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsText}>
            {filteredPosts.length}{' '}
            {filteredPosts.length !== 1
              ? t('posts') || 'posts'
              : t('post') || 'post'}{' '}
            {t('found') || 'found'}
            {filteredPosts.length !== posts.length &&
              ` (${t('filtered from') || 'filtered from'} ${posts.length})`}
          </Text>
        </View>
      )}

      <FlatList
        data={filteredPosts}
        renderItem={renderPost}
        keyExtractor={item => item._id}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={onRefresh}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchQuery.trim() !== ''
                ? t('No posts match your search criteria') ||
                  'No posts match your search criteria'
                : t('No posts available. Create the first post!') ||
                  'No posts available. Create the first post!'}
            </Text>
            {searchQuery.trim() !== '' && (
              <TouchableOpacity
                style={styles.clearSearchButton2}
                onPress={() => setSearchQuery('')}>
                <Text style={styles.clearSearchText}>
                  {t('Clear Search') || 'Clear Search'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        }
      />

      {isAdmin && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setShowPostModal(true)}>
          <PlusIcon size={24} color="#fff" />
        </TouchableOpacity>
      )}

      {renderCreatePostModal()}
      {renderCommentsModal()}
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
  headerRight: {
    width: 40,
  },

  // Search Bar Styles
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f5f5dc',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#2a2a2a',
    marginLeft: 8,
    paddingVertical: 4,
  },
  clearSearchButton: {
    padding: 4,
  },

  // Results Count Styles
  resultsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f5f5dc',
  },
  resultsText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },

  clearSearchButton2: {
    backgroundColor: '#2a2a2a',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  clearSearchText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  listContainer: {
    padding: 16,
  },
  postCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
  },
  timestamp: {
    fontSize: 12,
    color: '#ccc',
    marginBottom: 2,
  },
  communityName: {
    fontSize: 11,
    color: '#7dd3c0',
    fontWeight: '500',
  },
  postTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  postContent: {
    fontSize: 15,
    color: '#ddd',
    lineHeight: 22,
    marginBottom: 12,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#444',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  actionText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#ccc',
    fontWeight: '500',
  },
  likedText: {
    color: '#3b82f6',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2a2a2a',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  createPostModal: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: width * 0.95,
    maxHeight: height * 0.85,
    flex: 1,
  },
  commentsModal: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: width * 0.95,
    maxHeight: height * 0.75,
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2a2a2a',
  },
  createPostContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2a2a2a',
    marginBottom: 8,
  },
  titleInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#2a2a2a',
    backgroundColor: '#f8f9fa',
  },
  contentInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#2a2a2a',
    minHeight: 120,
    backgroundColor: '#f8f9fa',
  },
  imageOptions: {
    alignItems: 'center',
  },
  imageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    width: '100%',
    marginBottom: 10,
  },
  imageOptionText: {
    marginLeft: 10,
    fontSize: 15,
    color: '#2a2a2a',
    fontWeight: '500',
  },
  orText: {
    fontSize: 14,
    color: '#666',
    marginVertical: 10,
    fontWeight: '500',
  },
  imageUrlInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#2a2a2a',
    backgroundColor: '#f8f9fa',
    width: '100%',
  },
  imagePreviewContainer: {
    marginBottom: 20,
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 10,
  },
  removeImageButton: {
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#fee',
    borderRadius: 8,
  },
  removeImageText: {
    color: '#dc3545',
    fontSize: 14,
    fontWeight: '500',
  },
  modalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    gap: 10,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  postButton: {
    backgroundColor: '#2a2a2a',
  },
  postButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  imagePickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePickerModal: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: width * 0.8,
    alignItems: 'center',
  },
  imagePickerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2a2a2a',
    marginBottom: 20,
  },
  imagePickerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    width: '100%',
    marginBottom: 10,
  },
  imagePickerOptionText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#2a2a2a',
    fontWeight: '500',
  },
  imagePickerCancel: {
    marginTop: 10,
    paddingVertical: 12,
  },
  imagePickerCancelText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  // Comments styles
  commentsContent: {
    flex: 1,
    padding: 20,
  },
  loadingCommentsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingCommentsText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#666',
  },
  noCommentsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  noCommentsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  commentItem: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
  },
  commentInfo: {
    flex: 1,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2a2a2a',
    marginBottom: 2,
  },
  commentTime: {
    fontSize: 11,
    color: '#999',
  },
  commentText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    marginBottom: 8,
    marginLeft: 42,
  },
  commentActions: {
    flexDirection: 'row',
    marginLeft: 42,
    gap: 15,
  },
  replyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  replyButtonText: {
    fontSize: 12,
    color: '#3b82f6',
    fontWeight: '500',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  deleteButtonText: {
    fontSize: 12,
    color: '#dc3545',
    fontWeight: '500',
  },
  replyItem: {
    marginLeft: 30,
    paddingLeft: 15,
    borderLeftWidth: 2,
    borderLeftColor: '#e0e0e0',
  },
  repliesContainer: {
    marginTop: 10,
    marginLeft: 42,
  },
  replyingToIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#f8f9fa',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  replyingToText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  cancelReplyText: {
    fontSize: 14,
    color: '#dc3545',
    fontWeight: '500',
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#2a2a2a',
    maxHeight: 100,
    marginRight: 12,
  },
  sendButton: {
    padding: 8,
  },
});

export default PostScreen;
