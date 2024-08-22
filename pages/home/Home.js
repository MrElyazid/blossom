import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import BlossomLogo from '../../assets/BlossomLogo.png';
import Navbar from '../../components/Navbar';

const Home = () => {
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      // Reset the state when the screen comes into focus
      setImage(null);
      setIsLoading(false);
    }, [])
  );

  const saveImage = async (uri) => {
    const fileName = uri.split('/').pop();
    const newPath = FileSystem.documentDirectory + fileName;
    try {
      await FileSystem.moveAsync({
        from: uri,
        to: newPath
      });
      setImage(newPath);
      Alert.alert('Success', 'Image saved successfully');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to save image');
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      saveImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      saveImage(result.assets[0].uri);
    }
  };

  const simulateUploadAndFetchDiagnosis = async (imageUri) => {
    try {
      const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
      
      const diseases = ['Psoriasis', 'Eczema', 'Rosacea', 'Acne', 'Vitiligo'];
      const genders = ['Male', 'Female'];
      
      const diagnosisResponse = response.data.slice(0, 3).map((item, index) => ({
        disease: diseases[index],
        probability: (Math.random() * 100).toFixed(2) + '%',
        description: `This is a brief description for ${diseases[index]}.`,
        dryness: (Math.random() * 100).toFixed(2) + '%',
        expected_gender: genders[Math.floor(Math.random() * genders.length)],
        skin_properties: {
          hydration_level: (Math.random() * 100).toFixed(2) + '%',
          oiliness_level: (Math.random() * 100).toFixed(2) + '%',
          sensitivity_level: (Math.random() * 100).toFixed(2) + '%',
        },
      }));

      console.log('Diagnosis Response: ', diagnosisResponse);
      return diagnosisResponse;
    } catch (error) {
      console.log('Error fetching data: ', error);
      throw error;
    }
  };

  const diagnose = async () => {
    setIsLoading(true);
    try {
      // Simulate waiting time
      await new Promise(resolve => setTimeout(resolve, 3000));
      const result = await simulateUploadAndFetchDiagnosis(image);
      navigation.navigate('Result', { diagnosis: result });
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch diagnosis');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={BlossomLogo} style={styles.logo} />
      <Text style={styles.text}>Select an option to continue</Text>
      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Upload Image</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={takePhoto}>
        <Text style={styles.buttonText}>Take Photo</Text>
      </TouchableOpacity>
      {image && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: image }} style={styles.previewImage} />
          <TouchableOpacity 
            style={styles.button} 
            onPress={diagnose}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              Start Diagnosis
            </Text>
          </TouchableOpacity>
        </View>
      )}
      {isLoading && (
        <ActivityIndicator size="large" color="#ff69b4" style={styles.loader} />
      )}
      <Navbar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#ff69b4',
    marginBottom: 30,
  },
  text: {
    fontSize: 22,
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#ff69b4',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
  },
  previewImage: {
    width: 250,
    height: 250,
    marginBottom: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ff69b4',
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
});

export default Home;
