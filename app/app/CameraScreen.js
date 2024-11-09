import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Platform } from 'react-native';
import { Camera } from 'expo-camera';

const CameraScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
      } else {
        setHasPermission(false);
      }
    })();
  }, []);

  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <Text style={styles.webText}>Camera is not supported on the web.</Text>
      </View>
    );
  }

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      {photo ? (
        <Image source={{ uri: photo }} style={styles.capturedPhoto} />
      ) : (
        <Camera
          style={styles.camera}
          type={Camera.Constants.Type.back}
          ref={(ref) => setCameraRef(ref)}
        />
      )}

      {photo ? (
        <TouchableOpacity style={styles.retakeButton} onPress={() => setPhoto(null)}>
          <Text style={styles.buttonText}>Retake</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.captureButton} onPress={async () => {
          if (cameraRef) {
            const photo = await cameraRef.takePictureAsync();
            setPhoto(photo.uri);
          }
        }}>
          <Text style={styles.buttonText}>Capture</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e3a5f',
    justifyContent: 'center',
    alignItems: 'center',
  },
  webText: {
    color: '#fff',
    fontSize: 18,
  },
  camera: {
    width: '100%',
    height: '80%',
  },
  capturedPhoto: {
    width: '100%',
    height: '80%',
  },
  captureButton: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 50,
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
  },
  retakeButton: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 50,
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default CameraScreen;
