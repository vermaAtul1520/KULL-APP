import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ActivityIndicator,
  Modal,
} from 'react-native';
import {
  launchImageLibrary,
  launchCamera,
  MediaType,
  ImagePickerResponse,
  CameraOptions,
  ImageLibraryOptions,
} from 'react-native-image-picker';
import {uploadImageToCloudinary} from '@app/utils/imageUpload';

const AppColors = {
  primary: '#7dd3c0',
  black: '#000000',
  white: '#ffffff',
  gray: '#666666',
  dark: '#2a2a2a',
  teal: '#1e6b5c',
  cream: '#f5f5dc',
  lightGray: '#f0f0f0',
  red: '#dc143c',
};

interface ImagePickerComponentProps {
  onImageSelected: (imageUrl: string) => void;
  currentImage?: string;
  size?: number;
  disabled?: boolean;
}

const ImagePickerComponent: React.FC<ImagePickerComponentProps> = ({
  onImageSelected,
  currentImage,
  size = 100,
  disabled = false,
}) => {
  const [uploading, setUploading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const showImagePicker = () => {
    if (disabled) return;
    setModalVisible(true);
  };

  const selectImage = (useCamera: boolean) => {
    setModalVisible(false);

    const options = {
      mediaType: 'photo' as MediaType,
      includeBase64: false,
      maxHeight: 1000,
      maxWidth: 1000,
      quality: 0.8,
    };

    const callback = (response: ImagePickerResponse) => {
      if (response.didCancel || response.errorMessage) {
        console.log('Image picker cancelled or error:', response.errorMessage);
        return;
      }

      if (response.assets && response.assets[0]) {
        const asset = response.assets[0];
        if (asset.uri) {
          uploadImage(asset.uri, asset.fileName);
        }
      }
    };

    if (useCamera) {
      launchCamera(options as CameraOptions, callback);
    } else {
      launchImageLibrary(options as ImageLibraryOptions, callback);
    }
  };

  const uploadImage = async (imageUri: string, fileName?: string) => {
    setUploading(true);

    try {
      const result = await uploadImageToCloudinary(imageUri, fileName);

      if (result.success && result.url) {
        onImageSelected(result.url);
        Alert.alert('Success', 'Profile image uploaded successfully!');
      } else {
        Alert.alert('Upload Failed', result.error || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Error', 'Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const renderProfileImage = () => {
    if (currentImage) {
      return (
        <Image
          source={{uri: currentImage}}
          style={[styles.profileImage, {width: size, height: size}]}
        />
      );
    }

    // Default avatar with initials or icon
    return (
      <View style={[styles.defaultAvatar, {width: size, height: size}]}>
        <Text style={styles.avatarText}>📷</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.imageContainer, {opacity: disabled ? 0.6 : 1}]}
        onPress={showImagePicker}
        disabled={disabled}>
        {renderProfileImage()}

        {uploading && (
          <View style={styles.uploadingOverlay}>
            <ActivityIndicator size="small" color={AppColors.white} />
          </View>
        )}

        {!disabled && (
          <View style={styles.editIcon}>
            <Text style={styles.editIconText}>✏️</Text>
          </View>
        )}
      </TouchableOpacity>

      <Text style={styles.uploadText}>
        {uploading ? 'Uploading...' : 'Tap to change photo'}
      </Text>

      {/* Image Source Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Image Source</Text>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => selectImage(true)}>
              <Text style={styles.modalButtonText}>📷 Camera</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => selectImage(false)}>
              <Text style={styles.modalButtonText}>🖼️ Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setModalVisible(false)}>
              <Text style={[styles.modalButtonText, styles.cancelButtonText]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 10,
  },
  imageContainer: {
    position: 'relative',
    borderRadius: 60,
    borderWidth: 3,
    borderColor: AppColors.teal,
    padding: 3,
  },
  profileImage: {
    borderRadius: 60,
  },
  defaultAvatar: {
    backgroundColor: AppColors.lightGray,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 30,
  },
  uploadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIcon: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: AppColors.teal,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIconText: {
    fontSize: 12,
  },
  uploadText: {
    marginTop: 8,
    fontSize: 12,
    color: AppColors.gray,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: AppColors.white,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginHorizontal: 40,
    minWidth: 250,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: AppColors.black,
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: AppColors.teal,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 30,
    marginVertical: 5,
    minWidth: 150,
    alignItems: 'center',
  },
  modalButtonText: {
    color: AppColors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: AppColors.gray,
    marginTop: 10,
  },
  cancelButtonText: {
    color: AppColors.white,
  },
});

export default ImagePickerComponent;
