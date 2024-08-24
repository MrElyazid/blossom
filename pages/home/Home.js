import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import BlossomLogo from '../../assets/BlossomLogo.png';
import Navbar from '../../components/Navbar';
import {
  Container,
  Logo,
  Text,
  Button,
  ButtonText,
  ImageContainer,
  PreviewImage,
  Loader,
  BottomBar,
  BottomBarItem,
  BottomBarText
} from '../../styles/home/HomeStyled';

const Home = () => {
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
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
        to: newPath,
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
      await new Promise((resolve) => setTimeout(resolve, 3000));
      const result = await simulateUploadAndFetchDiagnosis(image);
      navigation.navigate('Result', { diagnosis: result });
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch diagnosis');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Logo source={BlossomLogo} />
      <Text>Select an option to continue</Text>
      <Button onPress={pickImage}>
        <ButtonText>Upload Image</ButtonText>
      </Button>
      <Button onPress={takePhoto}>
        <ButtonText>Take Photo</ButtonText>
      </Button>
      {image && (
        <ImageContainer>
          <PreviewImage source={{ uri: image }} />
          <Button onPress={diagnose} disabled={isLoading}>
            <ButtonText>Start Diagnosis</ButtonText>
          </Button>
        </ImageContainer>
      )}
      {isLoading && <Loader size="large" color="#ff69b4" />}
      <BottomBar>
        <BottomBarItem onPress={() => navigation.navigate('Home')}>
          <Ionicons name="home-outline" size={24} color="#333" />
          <BottomBarText>Home</BottomBarText>
        </BottomBarItem>
        <BottomBarItem onPress={() => navigation.navigate('Scan')}>
          <Ionicons name="search-outline" size={24} color="#333" />
          <BottomBarText>Scan</BottomBarText>
        </BottomBarItem>
        <BottomBarItem onPress={() => navigation.navigate('History')}>
          <Ionicons name="stats-chart-outline" size={24} color="#333" />
          <BottomBarText>History</BottomBarText>
        </BottomBarItem>
        <BottomBarItem onPress={() => navigation.navigate('Profile')}>
          <Ionicons name="person-outline" size={24} color="#333" />
          <BottomBarText>Profile</BottomBarText>
        </BottomBarItem>
      </BottomBar>
    </Container>
  );
};

export default Home;
