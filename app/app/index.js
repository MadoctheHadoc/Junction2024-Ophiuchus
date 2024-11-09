import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const [address, setAddress] = useState('');
  const [floor, setFloor] = useState('');
  const validAddresses = ['example']; // List of valid addresses
  const navigation = useNavigation();

  const isAddressValid = validAddresses.includes(address.toLowerCase());

  const handleFloorSelection = (selectedFloor) => {
    setFloor(selectedFloor);
    if (selectedFloor) {
      // Navigate to InventoryScreen with the selected floor
      navigation.navigate('InventoryScreen', { floor: selectedFloor });
    }
  };

  return (
    <View style={styles.container}>
      {/* KONE Logo */}
      <Image
        source={require('../assets/images/kone-logo.png')} // Use local image
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Address Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter address"
        placeholderTextColor="#b0c4de" // Lighter blue for placeholder text
        value={address}
        onChangeText={setAddress}
      />

      {/* Floor Selection Dropdown */}
      {isAddressValid && (
        <View style={styles.dropdownContainer}>
          <Picker
            selectedValue={floor}
            onValueChange={handleFloorSelection}
            style={styles.picker}
            dropdownIconColor="#b0c4de" // Adjust icon color for better blending
          >
            <Picker.Item label="Select Floor" value="" color="#b0c4de" />
            <Picker.Item label="Ground Floor" value="ground" color="#fff" />
            <Picker.Item label="1st Floor" value="1" color="#fff" />
            <Picker.Item label="2nd Floor" value="2" color="#fff" />
            <Picker.Item label="3rd Floor" value="3" color="#fff" />
            {/* Add more floors as needed */}
          </Picker>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e3a5f', // Dark blue background color to match theme
    alignItems: 'center',
    justifyContent: 'center', // Center content vertically
    paddingHorizontal: 16,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 40,
  },
  input: {
    width: '90%',
    height: 50,
    backgroundColor: '#3b5998', // Slightly lighter blue for input field
    borderRadius: 25,
    paddingHorizontal: 20,
    marginBottom: 20,
    fontSize: 18,
    color: '#fff', // White text color
  },
  dropdownContainer: {
    width: '90%',
    height: 50,
    backgroundColor: '#3b5998', // Matching background color for consistency
    borderRadius: 25, // Rounded corners to match the input
    justifyContent: 'center',
    marginTop: 10,
    paddingHorizontal: 10,
  },
  picker: {
    color: '#fff', // White text color for picker items
    width: '100%', // Ensure picker fills the entire container
    backgroundColor: 'transparent', // Transparent to match container's background
  },
});

export default HomeScreen;
