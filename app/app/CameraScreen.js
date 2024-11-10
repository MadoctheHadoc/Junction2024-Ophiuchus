import React, { useState, useEffect, useRef } from 'react';
import { Text, View, Pressable, Modal, Image, TextInput, StyleSheet, Alert } from 'react-native';
import { Camera, CameraType } from 'expo-camera/legacy';
import { useNavigation } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';

const CameraScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [photoUri, setPhotoUri] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [photoName, setPhotoName] = useState('');
  const [isCameraActive, setIsCameraActive] = useState(true);
  const cameraRef = useRef(null);
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setPhotoUri(photo.uri);
      setModalVisible(true);
      setIsCameraActive(false); // Disable camera after taking picture
    }
  };

  const savePhoto = async () => {
    try {
      const devicesDir = `${FileSystem.documentDirectory}devices`;
      const fileUri = `${devicesDir}/${photoName || 'photo'}.jpg`;

      const dirInfo = await FileSystem.getInfoAsync(devicesDir);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(devicesDir, { intermediates: true });
        console.log('Directory created at:', devicesDir);
      }

      await FileSystem.moveAsync({
        from: photoUri,
        to: fileUri,
      });

      setModalVisible(false);
      await uploadPhoto(fileUri);
    } catch (error) {
      console.error("Error saving photo:", error);
      Alert.alert('Error', 'Could not save the photo. Please try again.');
    }
  };

  const uploadPhoto = async (fileUri) => {
    try {
      console.log('Uploading photo:', fileUri);
      const base64Image = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const fetchWithTimeout = async (url, options, timeout = 30000) => {
        return Promise.race([
          fetch(url, options),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Request timed out')), timeout)
          ),
        ]);
      };

      try {
        const response = await fetchWithTimeout('http://10.87.0.252:5000/upload_archi_image_to_iris', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            image: base64Image
          }),
        });

        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status}`);
        }

        const responseData = await response.json();
        console.log('Upload successful:', responseData);
        Alert.alert(
          'Success',
          'Image uploaded successfully',
          [{ text: 'OK', onPress: () => {
            console.log('OK Pressed');
            setIsCameraActive(true); // Re-enable camera after successful upload
          }}],
          { cancelable: false }
        );
        return responseData;

      } catch (error) {
        console.error('Upload error:', error);
        if (error.message === 'Request timed out') {
          Alert.alert(
            'Error',
            'The request timed out. Please try again.',
            [{ text: 'OK', onPress: () => setIsCameraActive(true) }],
            { cancelable: false }
          );
        } else {
          Alert.alert(
            'Error',
            'Failed to upload image. Please try again.',
            [{ text: 'OK', onPress: () => setIsCameraActive(true) }],
            { cancelable: false }
          );
        }
        throw error;
      }
    } catch (error) {
      console.error("Error preparing photo upload:", error);
      Alert.alert('Error', 'Could not prepare the photo for upload. Please try again.');
      setIsCameraActive(true);
      throw error;
    }
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      {isCameraActive ? (
        <Camera style={{ flex: 1 }} type={CameraType.back} ref={cameraRef}>
          <View style={styles.cameraOverlay}>
            <Pressable style={styles.captureButton} onPress={takePicture}>
              <Text style={styles.captureButtonText}>Take Picture</Text>
            </Pressable>
          </View>
        </Camera>
      ) : (
        <View style={styles.previewContainer}>
          {photoUri && <Image source={{ uri: photoUri }} style={styles.fullScreenImage} />}
        </View>
      )}

      {photoUri && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false);
            setIsCameraActive(true);
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Image source={{ uri: photoUri }} style={styles.capturedImage} />
              <TextInput
                style={styles.input}
                placeholder="Enter photo name"
                value={photoName}
                onChangeText={setPhotoName}
              />
              <View style={styles.modalButtons}>
                <Pressable style={styles.saveButton} onPress={savePhoto}>
                  <Text style={styles.buttonText}>Save</Text>
                </Pressable>
                <Pressable
                  style={styles.cancelButton}
                  onPress={() => {
                    setModalVisible(false);
                    setIsCameraActive(true);
                  }}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  previewContainer: {
    flex: 1,
    backgroundColor: '#f0f0f0', // Light gray background for preview
  },
  fullScreenImage: {
    flex: 1,
    resizeMode: 'contain',
  },
  captureButton: {
    backgroundColor: 'red',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 30,
  },
  captureButtonText: {
    color: 'white',
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  capturedImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  input: {
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  saveButton: {
    flex: 1,
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    marginRight: 5,
    alignItems: 'center',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginLeft: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default CameraScreen;