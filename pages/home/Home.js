import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Alert } from 'react-native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import BlossomLogo from '../../assets/BlossomLogo.png';
import {
  SafeArea,
  ScrollContainer,
  ContentContainer,
  Logo,
  Text,
  Button,
  ButtonText,
  ImageContainer,
  PreviewImage,
  Loader,
  BottomBar,
  BottomBarItem,
  BottomBarText,
  ProgressBar,
  ProgressBarFill
} from '../../styles/home/HomeStyled';

const Home = () => {
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [diagnosisComplete, setDiagnosisComplete] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState(null);
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      setImage(null);
      setIsLoading(false);
      setProgress(0);
      setDiagnosisComplete(false);
      setDiagnosisResult(null);
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

  const uploadImageAndFetchDiagnosis = async (imageUri) => {
    try {
      const formData = new FormData();
      formData.append('image', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'image.jpg',
      });

      const response = await axios.post('http://10.0.2.2:5000/classify', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Diagnosis Response: ', response.data);
      return response.data;
    } catch (error) {
      console.log('Error fetching data: ', error);
      throw error;
    }
  };

  const diagnose = async () => {
    setIsLoading(true);
    setProgress(0);
    try {
      for (let i = 0; i <= 100; i += 10) {
        setProgress(i);
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
      const result = await uploadImageAndFetchDiagnosis(image);
      setDiagnosisResult(result);
      setDiagnosisComplete(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch diagnosis');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDiagnosisButton = () => {
    if (diagnosisComplete) {
      navigation.navigate('Result', { diagnosis: diagnosisResult });
    } else {
      diagnose();
    }
  };

  return (
    <SafeArea>
      <ScrollContainer>
        <ContentContainer>
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
              <Button onPress={handleDiagnosisButton} disabled={isLoading}>
                <ButtonText>{diagnosisComplete ? 'See Result' : 'Diagnosis'}</ButtonText>
              </Button>
            </ImageContainer>
          )}
          {isLoading && (
            <>
              <Loader size="large" color="#ff69b4" />
              <ProgressBar>
                <ProgressBarFill style={{ width: `${progress}%` }} />
              </ProgressBar>
            </>
          )}
        </ContentContainer>
      </ScrollContainer>
      <BottomBar>
        <BottomBarItem onPress={() => navigation.navigate('Home')}>
          <Ionicons name="home-outline" size={24} color="#333" />
          <BottomBarText>Home</BottomBarText>
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
    </SafeArea>
  );
};

export default Home;
