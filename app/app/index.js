import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Image, TouchableOpacity, FlatList, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const LOCATIONIQ_API_KEY = 'pk.1240cb39cbe961097a9eeab0b0870dd1'; // Replace with your LocationIQ API key

const HomeScreen = () => {
  const [address, setAddress] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const navigation = useNavigation();

  // Fetch suggestions from LocationIQ API
  const fetchLocations = async (query) => {
    if (query.length < 3) {
      setSuggestions([]); // Clear suggestions if query is too short
      return;
    }

    try {
      const response = await fetch(
        `https://us1.locationiq.com/v1/autocomplete.php?key=${LOCATIONIQ_API_KEY}&q=${query}&format=json`
      );
      const data = await response.json();
      const locationSuggestions = data.map((item) => ({
        id: item.place_id,
        name: item.display_name,
      }));
      setSuggestions(locationSuggestions);
    } catch (error) {
      console.error('Error fetching location suggestions:', error);
    }
  };

  const handleAddressChange = (text) => {
    setAddress(text);
    fetchLocations(text);
  };

  const handleLocationSelect = (location) => {
    setAddress(location);
    setSuggestions([]); // Clear suggestions after selection
    navigation.navigate('InventoryScreen', { location }); // Navigate with selected location
  };

  return (
    <View style={styles.container}>
      {/* KONE Logo */}
      <Image
        source={require('../assets/images/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Address Input with Embedded Arrow */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter address"
          placeholderTextColor="#1e3a5f"
          value={address}
          onChangeText={handleAddressChange}
        />
        <TouchableOpacity onPress={() => handleLocationSelect(address)} style={styles.arrowButton}>
          <Ionicons name="arrow-forward" size={20} color="#1e3a5f" />
        </TouchableOpacity>
      </View>

      {/* Suggestions List */}
      {suggestions.length > 0 && (
        <FlatList
          data={suggestions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleLocationSelect(item.name)} style={styles.suggestionItem}>
              <Text style={styles.suggestionText}>{item.name}</Text>
            </TouchableOpacity>
          )}
          style={styles.suggestionsContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 60,
    maxHeight: '100%', // Restrict container to top half of the screen
  },
  logo: {
    width: 250, // Adjusted for a smaller screen area
    height: 250,
    right: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '85%',
    height: 40,
    backgroundColor: 'rgba(30, 58, 95, 0.1)',
    borderRadius: 20,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#1e3a5f',
    marginTop: -20, // Adjust vertical positioning
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1e3a5f',
    backgroundColor: 'transparent',
  },
  arrowButton: {
    paddingLeft: 8,
  },
  suggestionsContainer: {
    width: '85%',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    maxHeight: 200,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2.5,
    borderWidth: 1,
    marginTop: 10, // Adjusted positioning within limited space
    borderColor: '#ddd',
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd',
  },
  suggestionText: {
    color: '#1e3a5f',
    fontSize: 15,
  },
});


export default HomeScreen;