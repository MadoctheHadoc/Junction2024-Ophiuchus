import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Globals from './globals'; // Import the Globals file

const ConfirmationScreen = () => {
    const navigation = useNavigation();

    const handleAccept = () => {
        console.log('Accepted');
    };

    const handleReject = () => {
        console.log('Rejected');
    };

    return (
        <View style={styles.container}>
            {/* Conditional Warning Text */}
            {Globals.WARNING === 'true' && (
                <Text style={styles.warningText}>⚠️ Warning: Please review your selection carefully!</Text>
            )}
            
            {/* Paragraph Text */}
            <Text style={styles.paragraph}>
                This is a confirmation screen. Please make your selection below.
            </Text>

            <Text style={styles.paragraph}>
                Manufacturer: {Globals.manufacturer}
            </Text>

            <Text style={styles.paragraph}>
                Model: {Globals.model}
            </Text>
            <Text style={styles.paragraph}>
                Serial Number: {Globals.serial_number}
            </Text>
            <Text style={styles.paragraph}>
                Installation Date: {Globals.installation_date}
            </Text>
            <Text style={styles.paragraph}>
                Equipment Name: {Globals.equipment_name}
            </Text>
            

            {/* Accept Button (Green) */}
            <TouchableOpacity style={styles.acceptButton} onPress={() => navigation.navigate('InventoryScreen')}>
                <Text style={styles.buttonText}>✔ Accept</Text>
            </TouchableOpacity>

            {/* Reject Button (Red) */}
            <TouchableOpacity style={styles.rejectButton} onPress={() => navigation.navigate('CameraScreen')}>
                <Text style={styles.buttonText}>❌ Reject</Text>
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
        paddingHorizontal: 16,
    },
    warningText: {
        color: '#ffcc00', // Yellow color for warning text
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    paragraph: {
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 40,
    },
    acceptButton: {
        width: '90%',
        height: 50,
        backgroundColor: '#28a745',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    rejectButton: {
        width: '90%',
        height: 50,
        backgroundColor: '#dc3545',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
    },
});

export default ConfirmationScreen;
