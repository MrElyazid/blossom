import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';

// 3asoli weld dar bo3aza

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

// App.js
//Hello HH
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import BlossomLogo from './assets/image.png';
import Home from './Home';

const Stack = createStackNavigator();

function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Blossom AI</Text>
      <Text style={styles.subtitle}>Your Dermatology and Skincare Companion</Text>
      <Image source={BlossomLogo} style={styles.image} />
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.buttonText}>Launch</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Home" component={Home} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#faf0f5', // Softer background color
    alignItems: 'center',
    justifyContent: 'center',
    padding: 25,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#e84393', // Deeper pink
    marginBottom: 15,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 20,
    color: '#666',
    marginBottom: 50,
    textAlign: 'center',
    lineHeight: 28,
  },
  image: {
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 4,
    borderColor: '#e84393',
    marginBottom: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  button: {
    backgroundColor: '#e84393',
    paddingHorizontal: 35,
    paddingVertical: 18,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
