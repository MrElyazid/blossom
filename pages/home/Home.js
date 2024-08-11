import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebaseConfig'; // Import auth from firebaseConfig.js

const Home = ({ navigation }) => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      // The app will automatically navigate to the login screen
      // due to the auth state listener in App.js
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Welcome to Blossom AI</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>Your Dermatologist AI Companion</Text>
        <View style={styles.featureBox}>
          <Text style={styles.featureTitle}>Skin Analysis</Text>
          <Text style={styles.featureDescription}>
            Upload a photo of your skin concern and get an AI-powered analysis.
          </Text>
        </View>
        <View style={styles.featureBox}>
          <Text style={styles.featureTitle}>Treatment Recommendations</Text>
          <Text style={styles.featureDescription}>
            Receive personalized treatment suggestions based on your skin condition.
          </Text>
        </View>
        <View style={styles.featureBox}>
          <Text style={styles.featureTitle}>Skincare Routine</Text>
          <Text style={styles.featureDescription}>
            Get a customized skincare routine tailored to your skin type and concerns.
          </Text>
        </View>
        <TouchableOpacity style={styles.startButton}>
          <Text style={styles.startButtonText}>Start Skin Analysis</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {

 flex: 1,
    
backgroundColor: '#f5f5f5',
    
},
    
 header: {
    
flexDirection: 'row',
    
 justifyContent: 'space-between',
    
 alignItems: 'center',
    
 padding: 20,
    
 backgroundColor: '#007AFF',
    
},
    
 headerText: {
    
fontSize: 20,
    
 fontWeight: 'bold',
    
 color: 'white',
    
 },
    
logoutButton: {
    
 backgroundColor: 'white',
    
padding: 10,
    
 borderRadius: 5,
    
 },
    
 logoutButtonText: {
    
 color: '#007AFF',
    
 fontWeight: 'bold',
    
 },
    
content: {
    
 padding: 20,
    
 },
    
 title: {
    
 fontSize: 24,
    
 fontWeight: 'bold',
    
 marginBottom: 20,
    
 textAlign: 'center',
    
 },
    
 featureBox: {
    
backgroundColor: 'white',
    
 borderRadius: 10,
    
 padding: 15,
    
 marginBottom: 15,
    
},
    
 featureTitle: {
    
fontSize: 18,
    
fontWeight: 'bold',
    
marginBottom: 5,
    
 },
    
featureDescription: {
    
 fontSize: 16,
    
 color: '#666',
    
 },
    
 startButton: {
    
 backgroundColor: '#007AFF',
    
 padding: 15,
    
 borderRadius: 10,
    
 alignItems: 'center',
    
 marginTop: 20,
    
 },
    
startButtonText: {
    
color: 'white',
    
 fontSize: 18,
    
 fontWeight: 'bold',
    
},
});

export default Home;
