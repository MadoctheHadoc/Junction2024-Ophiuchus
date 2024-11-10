import React, { useState, useEffect, useRef } from 'react';
import { Text, View, Pressable, Modal, Image, TextInput, StyleSheet, Alert } from 'react-native';
import { Camera, CameraType } from 'expo-camera/legacy';
import { useNavigation } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import Globals from './globals';

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
      setPhotoUri(photo.uri);  // Store the temporary photo URI
      setModalVisible(true);   // Show the save prompt modal
    }
  };

  const savePhoto = async () => {
    try {
      // Define the custom directory and file path in the document directory
      const devicesDir = `${FileSystem.documentDirectory}devices`;
      const fileUri = `${devicesDir}/${photoName || 'photo'}.jpg`;

      // Ensure the custom devices directory exists
      const dirInfo = await FileSystem.getInfoAsync(devicesDir);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(devicesDir, { intermediates: true });
        console.log('Directory created at:', devicesDir);
      } else {
        console.log('Directory already exists:', devicesDir);
      }

      // Move the photo from the temporary location to the custom directory
      await FileSystem.moveAsync({
        from: photoUri,
        to: fileUri,
      });


      setModalVisible(false);

      // Send the image to the server
      await uploadPhoto(fileUri);

    } catch (error) {
      console.error("Error saving photo:", error);
      Alert.alert('Error', 'Could not save the photo. Please try again.');
    }
  };

  const uploadPhoto = async (fileUri) => {
  try {
    console.log('Uploading photo:', fileUri);
    // Read the file as base64
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

    // Send the image to the server
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
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
        { cancelable: false }
      );
  

      console.log(responseData);
      // if(Array.isArray(responseData)) {
      //   responseData.forEach((str, index) => {
      //     Alert.alert(`String ${index + 1}:`, str);
      //   });
      // }
        // Case 1: responseData is a list of strings, handle the array of strings   
      const { manufacturer, model, serial_number, installation_date, equipment_name } = responseData;
      if (manufacturer !== null) {
        Globals.setManufacturer(manufacturer);
      }
      if (model !== null) {
        Globals.setModel(model);
      }
      if (serial_number !== null) {
        Globals.setSerialNumber(serial_number);
      }
      if (installation_date !== null) {
        Globals.setInstallationDate(installation_date);
      }
      if (equipment_name !== null) {
        Globals.setEquipmentName(equipment_name);
      }
      
      const all5There = !(manufacturer === null || manufacturer === "") && !(model === null || model === "")
            && !(serial_number === null || serial_number === "") && !(equipment_name === null || equipment_name === "")
            && !(installation_date === null || installation_date === "");
      const all3There = !(manufacturer === null || manufacturer === "") && !(model === null || model === "") && !(serial_number === null || serial_number === "");

      if (all5There) {
        navigation.navigate('Confirmation');

      } else if (all3There) {
        Globals.WARNING = 'true';
        navigation.navigate('Confirmation');
      } else {
        Alert.alert('Retake photo!');
        navigation.navigate('CameraScreen');
      }

    } catch (error) {
      console.error('Upload error:', error);
      if (error.message === 'Request timed out') {
        Alert.alert(
          'Error',
          'The request timed out. Please try again.',
          [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
          { cancelable: false }
        );
      } else {
        Alert.alert(
          'Error',
          'Failed to upload image. Please try again.',
          [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
          { cancelable: false }
        );
      }
      throw error;
    }
  } catch (error) {
    console.error("Error preparing photo upload:", error);
    Alert.alert('Error', 'Could not prepare the photo for upload. Please try again.');
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