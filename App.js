import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Blossom</Text>
      <Text style={styles.subtitle}>Your Dermatology and Skincare Companion</Text>
      <Image source={{ uri: 'https://www.example.com/skincare.jpg' }} style={styles.image} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff',  // Light blue background
    alignItems: 'center',        // Center horizontally
    justifyContent: 'center',    // Center vertically
    padding: 20,                 // Add padding for better spacing
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ff69b4',            // Hot pink color
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    color: '#555',               // Darker grey color
    marginBottom: 20,
    textAlign: 'center',         // Center the subtitle text
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,           // Rounded image
    borderWidth: 3,
    borderColor: '#ff69b4',      // Hot pink border color
    marginBottom: 20,            // Bottom margin
  },
});
