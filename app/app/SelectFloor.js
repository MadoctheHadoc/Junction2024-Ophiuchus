// app/SelectFloor.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SelectFloor = () => {
  return (
    <View style={styles.container}>
      <Text>Select Floor</Text>
      {/* Implement floor selection functionality */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SelectFloor;
