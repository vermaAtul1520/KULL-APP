/*
REACT NATIVE VERSION WITH SIMPLE FILE UPLOAD
Uses only built-in React Native components to avoid native module issues
*/

import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  Dimensions,
  StatusBar,
  SafeAreaView,
  Platform,
  PermissionsAndroid,
  Image,
} from 'react-native';
import { launchImageLibrary, launchCamera, MediaType } from 'react-native-image-picker';
import Svg, { Path, Circle, Rect, Polygon } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

// Custom SVG Icons
const BackIcon = ({ size = 24, color = "#fff" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M19 12H5M12 19L5 12L12 5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const TextIcon = ({ size = 24, color = "#666" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke={color} strokeWidth="2" fill="none"/>
    <Path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const ImageIcon = ({ size = 24, color = "#666" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke={color} strokeWidth="2" fill="none"/>
    <Circle cx="8.5" cy="8.5" r="1.5" stroke={color} strokeWidth="2" fill="none"/>
    <Path d="M21 15l-5-5L5 21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const VideoIcon = ({ size = 24, color = "#666" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Polygon points="23 7 16 12 23 17 23 7" stroke={color} strokeWidth="2" fill="none"/>
    <Rect x="1" y="5" width="15" height="14" rx="2" ry="2" stroke={color} strokeWidth="2" fill="none"/>
  </Svg>
);

const PdfIcon = ({ size = 24, color = "#666" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" fill={color}/>
  </Svg>
);

const CloseIcon = ({ size = 20, color = "#666" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M18 6L6 18M6 6l12 12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const CheckIcon = ({ size = 24, color = "#fff" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M20 6L9 17L4 12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const UploadIcon = ({ size = 24, color = "#666" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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

// Upload file interface
interface UploadFile {
  id: string;
  name: string;
  type: 'image' | 'video' | 'text';
  size: number;
  uri: string;
  mimeType: string;
  base64?: string;
}

const AppealScreen = () => {
  const navigation = useNavigation();
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [uploadedFile, setUploadedFile] = useState<UploadFile | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [textNote, setTextNote] = useState('');
  const [showTextInput, setShowTextInput] = useState(false);
 
  const categories = [
    'General Suggestion',
    'Technical Issue',
    'Service Complaint',
    'Feature Request',
    'Policy Concern',
    'Other'
  ];

  // Request permissions for camera and storage
  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const grants = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        ]);

        if (
          grants['android.permission.CAMERA'] === PermissionsAndroid.RESULTS.GRANTED &&
          grants['android.permission.READ_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED
        ) {
          console.log('Permissions granted');
        } else {
          console.log('Some permissions denied');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  useEffect(() => {
    requestPermissions();
  }, []);

  // Image picker for images and videos
  const handleImagePicker = (type: 'image' | 'video') => {
    const mediaType: MediaType = type === 'image' ? 'photo' : 'video';
    
    Alert.alert(
      `Select ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      `Choose how you want to add your ${type}`,
      [
        { text: 'Camera', onPress: () => openCamera(mediaType) },
        { text: 'Gallery', onPress: () => openGallery(mediaType) },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const openCamera = (mediaType: MediaType) => {
    const options = {
      mediaType,
      quality: 0.8 as number,
      maxWidth: 1000,
      maxHeight: 1000,
      includeBase64: true,
    };

    launchCamera(options, (response) => {
      if (response.assets && response.assets[0]) {
        processMediaFile(response.assets[0], mediaType);
      }
    });
  };

  const openGallery = (mediaType: MediaType) => {
    const options = {
      mediaType,
      quality: 0.8 as number,
      maxWidth: 1000,
      maxHeight: 1000,
      includeBase64: true,
    };

    launchImageLibrary(options, (response) => {
      if (response.assets && response.assets[0]) {
        processMediaFile(response.assets[0], mediaType);
      }
    });
  };

  const processMediaFile = (asset: any, mediaType: MediaType) => {
    if (!asset.uri) return;

    const file: UploadFile = {
      id: Date.now().toString(),
      name: asset.fileName || `${mediaType}_${Date.now()}.${asset.type?.split('/')[1] || 'jpg'}`,
      type: mediaType === 'photo' ? 'image' : 'video',
      size: asset.fileSize || 0,
      uri: asset.uri,
      mimeType: asset.type || (mediaType === 'photo' ? 'image/jpeg' : 'video/mp4'),
      base64: asset.base64,
    };

    setUploadedFile(file);
    setShowTextInput(false);
  };

  // Handle text note creation
  const handleTextNoteCreation = () => {
    setShowTextInput(true);
    setUploadedFile(null);
  };

  const saveTextNote = () => {
    if (!textNote.trim()) {
      Alert.alert('Error', 'Please enter some text for your note.');
      return;
    }

    const file: UploadFile = {
      id: Date.now().toString(),
      name: `text_note_${Date.now()}.txt`,
      type: 'text',
      size: textNote.length,
      uri: 'text://local',
      mimeType: 'text/plain',
      base64: Buffer.from(textNote, 'utf8').toString('base64'),
    };

    setUploadedFile(file);
    setShowTextInput(false);
    setTextNote('');
  };

  const cancelTextNote = () => {
    setShowTextInput(false);
    setTextNote('');
  };

  // Handle different file upload types
  const handleFileUpload = (type: 'text' | 'image' | 'video') => {
    switch (type) {
      case 'image':
        handleImagePicker('image');
        break;
      case 'video':
        handleImagePicker('video');
        break;
      case 'text':
        handleTextNoteCreation();
        break;
      default:
        break;
    }
  };

  const getFileSize = (sizeInBytes: number): string => {
    if (sizeInBytes < 1024) return `${sizeInBytes} B`;
    if (sizeInBytes < 1024 * 1024) return `${(sizeInBytes / 1024).toFixed(1)} KB`;
    if (sizeInBytes < 1024 * 1024 * 1024) return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(sizeInBytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  };

  const removeFile = () => {
    setUploadedFile(null);
    setShowTextInput(false);
  };

  // Create API payload
  const createApiPayload = () => {
    const payload = {
      subject: subject.trim(),
      description: description.trim(),
      category: category,
      userId: "user_123",
      userEmail: "user@example.com",
      userName: "John Doe",
      submissionTime: new Date().toISOString(),
      deviceInfo: {
        platform: Platform.OS,
        version: Platform.Version,
      },
      priority: "medium",
      status: "submitted",
      attachment: uploadedFile ? {
        id: uploadedFile.id,
        name: uploadedFile.name,
        type: uploadedFile.type,
        size: uploadedFile.size,
        mimeType: uploadedFile.mimeType,
        base64Data: uploadedFile.base64,
        uri: uploadedFile.uri,
      } : null,
      metadata: {
        hasAttachment: !!uploadedFile,
        attachmentType: uploadedFile?.type || null,
        attachmentSize: uploadedFile?.size || 0,
        expectedResponseTime: "2-3 business days",
        language: "en",
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      }
    };

    return payload;
  };

  const handleSubmitAppeal = async () => {
    if (!subject.trim() || !description.trim() || !category) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    // Check file size limit (10MB)
    if (uploadedFile && uploadedFile.size > 10 * 1024 * 1024) {
      Alert.alert('File Too Large', 'Please select a file smaller than 10MB.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = createApiPayload();
      console.log('Appeal API Payload:', JSON.stringify(payload, null, 2));
      
      // Simulate API call
      const response = await submitAppealToAPI(payload);
      
      if (response.success) {
        Alert.alert(
          'Appeal Submitted Successfully!',
          `Thank you for your submission. Your appeal ID is: ${response.appealId}. We will review your appeal and get back to you within 2-3 business days.`,
          [
            {
              text: 'OK',
              onPress: () => {
                setSubject('');
                setDescription('');
                setCategory('');
                setUploadedFile(null);
                setShowTextInput(false);
                setTextNote('');
              }
            }
          ]
        );
      } else {
        throw new Error(response.message || 'Failed to submit appeal');
      }
    } catch (error) {
      console.error('Error submitting appeal:', error);
      Alert.alert('Error', 'Failed to submit appeal. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitAppealToAPI = async (payload: any) => {
    return new Promise<{success: boolean, appealId?: string, message?: string}>((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          appealId: `APL-${Date.now()}`,
          message: 'Appeal submitted successfully'
        });
      }, 2000);
    });
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'text':
        return <TextIcon size={20} color={AppColors.blue} />;
      case 'image':
        return <ImageIcon size={20} color={AppColors.green} />;
      case 'video':
        return <VideoIcon size={20} color={AppColors.purple} />;
      default:
        return <TextIcon size={20} color={AppColors.gray} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={AppColors.primary} barStyle="light-content" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <BackIcon size={24} color={AppColors.white} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Appeal & Suggestions</Text>
          <Text style={styles.headerSubtitle}>Share your feedback with us</Text>
        </View>
      </View>

      <ScrollView style={styles.formContainer}>
        {/* Introduction */}
        <View style={styles.introCard}>
          <Text style={styles.introTitle}>Submit Your Appeal</Text>
          <Text style={styles.introDescription}>
            We value your feedback and suggestions. Please provide detailed information about your concern or suggestion. 
            You can attach one supporting file (max 10MB) to help us better understand your request.
          </Text>
        </View>

        {/* Category Selection */}
        <View style={styles.formSection}>
          <Text style={styles.sectionLabel}>Category *</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryContainer}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryChip,
                  category === cat && styles.selectedCategoryChip
                ]}
                onPress={() => setCategory(cat)}
              >
                <Text style={[
                  styles.categoryChipText,
                  category === cat && styles.selectedCategoryChipText
                ]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Subject */}
        <View style={styles.formSection}>
          <Text style={styles.sectionLabel}>Subject *</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter a brief subject for your appeal"
            placeholderTextColor={AppColors.gray}
            value={subject}
            onChangeText={setSubject}
            maxLength={100}
          />
          <Text style={styles.charCount}>{subject.length}/100</Text>
        </View>

        {/* Description */}
        <View style={styles.formSection}>
          <Text style={styles.sectionLabel}>Description *</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            placeholder="Provide detailed information about your appeal or suggestion. Include relevant context, steps to reproduce (if applicable), and expected outcomes."
            placeholderTextColor={AppColors.gray}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={6}
            maxLength={1000}
            textAlignVertical="top"
          />
          <Text style={styles.charCount}>{description.length}/1000</Text>
        </View>

        {/* File Upload Section */}
        <View style={styles.formSection}>
          <Text style={styles.sectionLabel}>Attachment (Optional)</Text>
          <Text style={styles.sectionDescription}>
            Add a supporting file - create a text note, take/select an image, or record/select a video
          </Text>
          
          {!uploadedFile && !showTextInput ? (
            <View style={styles.uploadButtonsContainer}>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={() => handleFileUpload('text')}
              >
                <TextIcon size={20} color={AppColors.blue} />
                <Text style={styles.uploadButtonText}>Text Note</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={() => handleFileUpload('image')}
              >
                <ImageIcon size={20} color={AppColors.green} />
                <Text style={styles.uploadButtonText}>Image</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={() => handleFileUpload('video')}
              >
                <VideoIcon size={20} color={AppColors.purple} />
                <Text style={styles.uploadButtonText}>Video</Text>
              </TouchableOpacity>
            </View>
          ) : showTextInput ? (
            <View style={styles.textInputContainer}>
              <Text style={styles.textInputTitle}>Create Text Note</Text>
              <TextInput
                style={[styles.textInput, styles.textNoteArea]}
                placeholder="Type your text note here..."
                placeholderTextColor={AppColors.gray}
                value={textNote}
                onChangeText={setTextNote}
                multiline
                numberOfLines={4}
                maxLength={500}
                textAlignVertical="top"
              />
              <Text style={styles.charCount}>{textNote.length}/500</Text>
              
              <View style={styles.textNoteButtons}>
                <TouchableOpacity
                  style={[styles.textNoteButton, styles.cancelButton]}
                  onPress={cancelTextNote}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.textNoteButton, styles.saveButton]}
                  onPress={saveTextNote}
                  disabled={!textNote.trim()}
                >
                  <Text style={styles.saveButtonText}>Save Note</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : uploadedFile ? (
            <View style={styles.uploadedFileContainer}>
              <Text style={styles.uploadedFileTitle}>Uploaded File</Text>
              <View style={styles.fileItem}>
                <View style={styles.fileInfo}>
                  {getFileIcon(uploadedFile.type)}
                  <View style={styles.fileDetails}>
                    <Text style={styles.fileName} numberOfLines={1}>{uploadedFile.name}</Text>
                    <Text style={styles.fileSize}>{getFileSize(uploadedFile.size)}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={removeFile}
                >
                  <CloseIcon size={16} color={AppColors.red} />
                </TouchableOpacity>
              </View>
              
              {uploadedFile.type === 'image' && uploadedFile.uri && (
                <Image source={{ uri: uploadedFile.uri }} style={styles.previewImage} />
              )}
              
              <TouchableOpacity
                style={styles.replaceButton}
                onPress={() => {
                  removeFile();
                }}
              >
                <Text style={styles.replaceButtonText}>Replace File</Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>

        {/* Submit Button */}
        <View style={styles.submitSection}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              (!subject.trim() || !description.trim() || !category || isSubmitting) && styles.submitButtonDisabled
            ]}
            onPress={handleSubmitAppeal}
            disabled={!subject.trim() || !description.trim() || !category || isSubmitting}
          >
            {isSubmitting ? (
              <Text style={styles.submitButtonText}>Submitting...</Text>
            ) : (
              <>
                <CheckIcon size={20} color={AppColors.white} />
                <Text style={styles.submitButtonText}>Submit Appeal</Text>
              </>
            )}
          </TouchableOpacity>
          
          <Text style={styles.submitNote}>
            By submitting this appeal, you agree to our terms of service and privacy policy. 
            We will review your submission within 2-3 business days.
          </Text>
        </View>
      </ScrollView>
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

  // Form container
  formContainer: {
    flex: 1,
    padding: 16,
  },

  // Introduction section
  introCard: {
    backgroundColor: AppColors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  introTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: AppColors.dark,
    marginBottom: 8,
  },
  introDescription: {
    fontSize: 14,
    color: AppColors.gray,
    lineHeight: 20,
  },

  // Form sections
  formSection: {
    backgroundColor: AppColors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.dark,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 13,
    color: AppColors.gray,
    marginBottom: 12,
    lineHeight: 18,
  },

  // Category selection
  categoryContainer: {
    flexDirection: 'row',
  },
  categoryChip: {
    backgroundColor: AppColors.lightGray,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  selectedCategoryChip: {
    backgroundColor: AppColors.primary,
    borderColor: AppColors.primary,
  },
  categoryChipText: {
    fontSize: 14,
    color: AppColors.gray,
    fontWeight: '500',
  },
  selectedCategoryChipText: {
    color: AppColors.white,
  },

  // Text inputs
  textInput: {
    borderWidth: 1,
    borderColor: AppColors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: AppColors.dark,
    backgroundColor: AppColors.white,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: AppColors.gray,
    textAlign: 'right',
    marginTop: 4,
  },

  // Upload buttons
  uploadButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  uploadButton: {
    flex: 1,
    minWidth: 80,
    backgroundColor: AppColors.lightGray,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  uploadButtonText: {
    fontSize: 12,
    color: AppColors.gray,
    marginTop: 4,
    fontWeight: '500',
  },

  // Text input container
  textInputContainer: {
    marginTop: 8,
  },
  textInputTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.dark,
    marginBottom: 8,
  },
  textNoteArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  textNoteButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  textNoteButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: AppColors.lightGray,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  saveButton: {
    backgroundColor: AppColors.primary,
  },
  cancelButtonText: {
    fontSize: 14,
    color: AppColors.gray,
    fontWeight: '500',
  },
  saveButtonText: {
    fontSize: 14,
    color: AppColors.white,
    fontWeight: '500',
  },

  // Uploaded file
  uploadedFileContainer: {
    marginTop: 8,
  },
  uploadedFileTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.dark,
    marginBottom: 8,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: AppColors.lightGray,
    borderRadius: 8,
    padding: 10,
    marginBottom: 6,
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  fileDetails: {
    marginLeft: 10,
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    color: AppColors.dark,
    fontWeight: '500',
  },
  fileSize: {
    fontSize: 12,
    color: AppColors.gray,
    marginTop: 2,
  },
  removeButton: {
    padding: 4,
  },
  previewImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
    resizeMode: 'cover',
  },
  replaceButton: {
    backgroundColor: AppColors.lightGray,
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 8,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  replaceButtonText: {
    fontSize: 12,
    color: AppColors.gray,
    fontWeight: '500',
  },

  // Submit section
  submitSection: {
    marginBottom: 32,
  },
  submitButton: {
    backgroundColor: AppColors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  submitButtonDisabled: {
    backgroundColor: AppColors.gray,
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.white,
  },
  submitNote: {
    fontSize: 12,
    color: AppColors.gray,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 16,
    paddingHorizontal: 16,
  },
});

export default AppealScreen;