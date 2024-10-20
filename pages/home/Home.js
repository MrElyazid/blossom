import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Alert } from "react-native";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import BlossomLogo from "../../assets/BlossomLogo.png";
import { db, auth } from "../../firebaseConfig";
import { doc, setDoc, updateDoc, increment, arrayUnion } from "firebase/firestore";
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
  ProgressBarFill,
} from "../../styles/home/HomeStyled";

const Home = () => {
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [diagnosisComplete, setDiagnosisComplete] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState(null);
  const [skinTypeResult, setSkinTypeResult] = useState(null);
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      setImage(null);
      setIsLoading(false);
      setProgress(0);
      setDiagnosisComplete(false);
      setDiagnosisResult(null);
      setSkinTypeResult(null);
    }, [])
  );

  const saveImage = async (uri) => {
    const fileName = uri.split("/").pop();
    const newPath = FileSystem.documentDirectory + fileName;
    try {
      await FileSystem.moveAsync({
        from: uri,
        to: newPath,
      });
      setImage(newPath);
      Alert.alert("Success", "Image saved successfully");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to save image");
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
      formData.append("image", {
        uri: imageUri,
        type: "image/jpeg",
        name: "image.jpg",
      });

      const response = await axios.post(
        "https://d3ff-105-71-18-171.ngrok-free.app/classify",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted =
              Math.round((progressEvent.loaded * 100) / progressEvent.total) /
              2;
            setProgress((prevProgress) =>
              Math.max(prevProgress, percentCompleted)
            );
          },
        }
      );

      console.log("Diagnosis Response: ", response.data);
      return response.data;
    } catch (error) {
      console.log("Error fetching data: ", error);
      throw error;
    }
  };

  const fetchSkinTypeAnalysis = async (imageUri) => {
    try {
      const base64Image = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const response = await axios({
        method: "POST",
        url: "https://detect.roboflow.com/blossom-vhk4n/1",
        params: {
          api_key: "5SVhyIFgWpAUZYBY3dIM",
        },
        data: base64Image,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted =
            Math.round((progressEvent.loaded * 100) / progressEvent.total) / 2 +
            50;
          setProgress((prevProgress) =>
            Math.max(prevProgress, percentCompleted)
          );
        },
      });

      console.log("Skin Type Analysis Response: ", response.data);
      return response.data;
    } catch (error) {
      console.log("Error fetching skin type data: ", error);
      throw error;
    }
  };

  const saveScanData = async (diagnosisResult, skinTypeResult) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("User not authenticated");
      }

      const scanData = {
        date: new Date().toISOString(),
        diagnosisResult,
        skinTypeResult,
      };

      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        scans: arrayUnion(scanData),
        totalScans: increment(1),
      });

      console.log("Scan data saved successfully");
    } catch (error) {
      console.error("Error saving scan data:", error);
      Alert.alert("Error", "Failed to save scan data");
    }
  };

  const diagnose = async () => {
    setIsLoading(true);
    setProgress(0);
    try {
      const [diagnosisResult, skinTypeResult] = await Promise.all([
        uploadImageAndFetchDiagnosis(image),
        fetchSkinTypeAnalysis(image),
      ]);
      setDiagnosisResult(diagnosisResult);
      setSkinTypeResult(skinTypeResult);
      setDiagnosisComplete(true);
      setProgress(100);

      // Save scan data to Firestore
      await saveScanData(diagnosisResult, skinTypeResult);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch diagnosis or skin type analysis");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDiagnosisButton = () => {
    if (diagnosisComplete) {
      console.log("Diagnosis Result before navigation:", diagnosisResult);
      console.log("Skin Type Result before navigation:", skinTypeResult);
      navigation.navigate("Result", {
        diagnosis: diagnosisResult,
        skinType: skinTypeResult,
        imageUri: image,
      });
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
                <ButtonText>
                  {diagnosisComplete ? "See Result" : "Diagnosis"}
                </ButtonText>
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
        <BottomBarItem onPress={() => navigation.navigate("Home")}>
          <Ionicons name="home-outline" size={24} color="#333" />
          <BottomBarText>Home</BottomBarText>
        </BottomBarItem>
        <BottomBarItem onPress={() => navigation.navigate("SavedProducts")}>
          <Ionicons name="bookmark-outline" size={24} color="#333" />
          <BottomBarText>Saved</BottomBarText>
        </BottomBarItem>
        <BottomBarItem onPress={() => navigation.navigate("History")}>
          <Ionicons name="stats-chart-outline" size={24} color="#333" />
          <BottomBarText>History</BottomBarText>
        </BottomBarItem>
        <BottomBarItem onPress={() => navigation.navigate("Profile")}>
          <Ionicons name="person-outline" size={24} color="#333" />
          <BottomBarText>Profile</BottomBarText>
        </BottomBarItem>
      </BottomBar>
    </SafeArea>
  );
};

export default Home;
