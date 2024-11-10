import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';


const ConfirmationScreen = ({ }) => {
    const navigation = useNavigation();

    const handleAccept = () => {
        // Handle accept action
        console.log('Accepted');
    };

    const handleReject = () => {
        // Handle reject action
        console.log('Rejected');
    };

    return (
        <View style={styles.container}>
            {/* Paragraph Text */}
            <Text style={styles.paragraph}>
                This is a confirmation screen. Please make your selection below.
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
        backgroundColor: '#1e3a5f', // Dark blue background color to match theme
        alignItems: 'center',
        justifyContent: 'center', // Center content vertically
        paddingHorizontal: 16,
    },
    paragraph: {
        color: '#fff', // White text for paragraph
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 40,
    },
    acceptButton: {
        width: '90%',
        height: 50,
        backgroundColor: '#28a745', // Green button for accept
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    rejectButton: {
        width: '90%',
        height: 50,
        backgroundColor: '#dc3545', // Red button for reject
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff', // White text color for button text
        fontSize: 18,
    },
});

export default ConfirmationScreen;
