import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const InventoryScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const floor = route.params?.floor || "No floor selected"; // Default message if undefined

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inventory for {floor}</Text>
      {/* Floor plan and device markers would go here */}

      {/* Red Add Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('CameraScreen')} // Navigate to CameraScreen
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e3a5f',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: 'red',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 30,
    right: 30,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
});

export default InventoryScreen;
