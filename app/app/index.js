import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const HomeScreen = () => {
  const [address, setAddress] = useState('');
  const [floor, setFloor] = useState('');
  const validAddresses = ['example']; // List of valid addresses

  const isAddressValid = validAddresses.includes(address.toLowerCase());

  return (
    <View style={styles.container}>
      {/* KONE Logo */}
      <Image source={{ uri: 'https://example.com/kone-logo.png' }} style={styles.logo} />

      {/* Address Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter address"
        placeholderTextColor="#999"
        value={address}
        onChangeText={setAddress}
      />

      {/* Display Floor Selection Dropdown only if address is valid */}
      {isAddressValid && (
        <View style={styles.dropdownContainer}>
          <Picker
            selectedValue={floor}
            onValueChange={(itemValue) => setFloor(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select Floor" value="" color="#999" />
            <Picker.Item label="Ground Floor" value="ground" />
            <Picker.Item label="1st Floor" value="1" />
            <Picker.Item label="2nd Floor" value="2" />
            <Picker.Item label="3rd Floor" value="3" />
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#222',
    padding: 16,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 40,
  },
  input: {
    width: '80%',
    height: 50,
    backgroundColor: '#f0f0f0',
    borderRadius: 25,
    paddingHorizontal: 20,
    marginBottom: 20,
    fontSize: 18,
    color: '#333',
  },
  dropdownContainer: {
    width: '80%',
    height: 50,
    backgroundColor: '#f0f0f0',
    borderRadius: 25,
    justifyContent: 'center',
  },
  picker: {
    height: 50,
    color: '#333',
  },
});

export default HomeScreen;
