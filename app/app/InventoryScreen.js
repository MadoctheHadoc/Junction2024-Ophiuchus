import React from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  Image,
  Dimensions,
  Text  // Added Text import
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const InventoryScreen = () => {
  const navigation = useNavigation();
  const screenWidth = Dimensions.get('window').width;

  return (
    <View style={styles.container}>
      <View style={styles.floorPlanContainer}>
        <Image 
          source={require('../assets/images/floor_plan.png')}  // Update this path to your floor plan image
          style={styles.floorPlan}
          resizeMode="contain"
        />
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('CameraScreen')}
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
  },
  floorPlanContainer: {
    flex: 1,
    margin: 20,  // This adds padding around the floor plan
    backgroundColor: 'white',  // White background for the floor plan
    borderRadius: 10,  // Optional: rounded corners
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  floorPlan: {
    width: '100%',
    height: '100%',
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
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
});

export default InventoryScreen;