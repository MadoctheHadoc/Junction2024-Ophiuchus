import React, { useState, useEffect, useRef } from 'react';
import { Text, View, Pressable, Modal, Image, TextInput, StyleSheet, Alert } from 'react-native';
import { Camera, CameraType } from 'expo-camera/legacy';
import { useNavigation } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const CameraScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [photoUri, setPhotoUri] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [photoName, setPhotoName] = useState('');
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
      setPhotoUri(photo.uri);  // Store the photo URI
      setModalVisible(true);   // Show the save prompt modal
    }
  };

  const savePhoto = async () => {
    try {
      // Define the directory and file path
      const devicesDir = `${FileSystem.documentDirectory}devices`;
      const fileUri = `${devicesDir}/${photoName || 'photo'}.jpg`;

      // Ensure the devices directory exists
      const dirInfo = await FileSystem.getInfoAsync(devicesDir);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(devicesDir, { intermediates: true });
        console.log('Directory created at:', devicesDir);
      } else {
        console.log('Directory already exists:', devicesDir);
      }

      // Move the photo to the devices directory with a .jpg extension
      await FileSystem.moveAsync({
        from: photoUri,
        to: fileUri,
      });

      if(false){
        Alert.alert('Bad photo. Please take it again');
        setModalVisible(false);
        navigation.goBack(); // Navigate back after saving

      }else if(true){
        Alert.alert('Good photo. Please verify text');
        navigation.navigate('LoremScreen', { imageUri: photoUri });

      }else{

      }
    } catch (error) {
      console.error("Error saving photo:", error);
      Alert.alert('Error', 'Could not save the photo. Please try again.');
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
      <Camera style={{ flex: 1 }} type={CameraType.back} ref={cameraRef}>
        <View style={styles.cameraOverlay}>
          <Pressable style={styles.captureButton} onPress={takePicture}>
            <Text style={styles.captureButtonText}>Take Picture</Text>
          </Pressable>
        </View>
      </Camera>

      {/* Modal for Save Prompt */}
      {photoUri && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
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
                  onPress={() => setModalVisible(false)}
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