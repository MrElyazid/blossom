import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  StyledIonicons,
  BottomBar,
  BottomBarItem,
  BottomBarText,
} from "../../styles/bottomBarStyled";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Alert } from "react-native";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import BlossomLogo from "../../assets/BlossomLogo.png";
import { db, auth } from "../../firebaseConfig";
import {
  doc,
  setDoc,
  updateDoc,
  increment,
  arrayUnion,
  getDoc,
} from "firebase/firestore";
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
  // BottomBar,
  // BottomBarItem,
  // BottomBarText,
  ProgressBar,
  ProgressBarFill,
  AnalyseButton,
  ButtonTextAnalyse,
} from "../../styles/home/HomeStyled";
import { FA5Style } from "@expo/vector-icons/build/FontAwesome5";

const Home = () => {
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [diagnosisComplete, setDiagnosisComplete] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState(null);
  const [skinTypeResult, setSkinTypeResult] = useState(null);
  const navigation = useNavigation();
  const [scanDate, setScanDate] = useState(null);
const [istaken, setIstaken] = useState(false);
  useFocusEffect(
    React.useCallback(() => {
      setImage(null);
      setIsLoading(false);
      setProgress(0);
      setDiagnosisComplete(false);
      setDiagnosisResult(null);
      setSkinTypeResult(null);
      setIstaken(false);
      setScanDate(null);
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
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      saveImage(result.assets[0].uri);
      setIstaken(false);
    }
  };

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      saveImage(result.assets[0].uri);
      setIstaken(true);
    }
  };

  const uploadImageToCloudinary = async (imageUri) => {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not authenticated");
    }

    const timestamp = Date.now();
    const imageName = `${user.uid}/${timestamp}`;

    const formData = new FormData();
    formData.append("file", {
      uri: imageUri,
      type: "image/jpeg",
      name: imageName,
    });
    formData.append("upload_preset", "vst5cxe3"); // Replace with your upload preset

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/dqwffwydx/image/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data.secure_url; // Return the URL of the uploaded image
  };


  const uploadImageAndFetchDiagnosis = async (imageUri) => {
    try {
      // Convert the image to a base64 encoded string
      const base64Image = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
  
      // Perform the POST request with base64 image data
      const response = await axios({
        method: "POST",
        url: "https://detect.roboflow.com/skin-disease-detection-vtmmm/3",
        params: {
          api_key: "cQ1a6z6OVW1zSOmYdupk",
          include_coordinates: true,
        },
        data: base64Image,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted =
            Math.round((progressEvent.loaded * 100) / progressEvent.total) / 2;
          setProgress((prevProgress) =>
            Math.max(prevProgress, percentCompleted)
          );
        },
      });
  
      console.log("Diagnosis Response: ", response.data);
      return response.data;
    } catch (error) {
      console.log("Error fetching data: ", error);
      throw error;
    }
  };



  // const uploadImageAndFetchDiagnosis = async (imageUri) => {
  //   try {
  //     const formData = new FormData();
  //     formData.append("image", {
  //       uri: imageUri,
  //       type: "image/jpeg",
  //       name: "image.jpg",
  //     });

  //     const response = await axios.post(
  //       "https://04bd-105-74-67-132.ngrok-free.app/classify",
  //       formData,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //         onUploadProgress: (progressEvent) => {
  //           const percentCompleted =
  //             Math.round((progressEvent.loaded * 100) / progressEvent.total) /
  //             2;
  //           setProgress((prevProgress) =>
  //             Math.max(prevProgress, percentCompleted)
  //           );
  //         },
  //       }
  //     );

  //     console.log("Diagnosis Response: ", response.data);
  //     return response.data;
  //   } catch (error) {
  //     console.log("Error fetching data: ", error);
  //     throw error;
  //   }
  // };

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

      const imageUrl = await uploadImageToCloudinary(image);

      const scanData = {
        date: new Date().toISOString(),
        diagnosisResult,
        skinTypeResult,
        imageUrl,
      };
      setScanDate(scanData.date.split("T")[0]);
      const userDocRef = doc(db, "users", user.uid);

      // Check if the user document exists
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // If document doesn't exist, create it with initial data
        await setDoc(userDocRef, {
          scans: [scanData],
          totalScans: 1,
          createdAt: new Date().toISOString(),
          userId: user.uid,
          email: user.email,
        });
      } else {
        // If document exists, update it
        await updateDoc(userDocRef, {
          scans: arrayUnion(scanData),
          totalScans: increment(1),
        });
      }

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
    const user = auth.currentUser;
    if (diagnosisComplete) {
      console.log("Diagnosis Result before navigation:", diagnosisResult);
      console.log("Skin Type Result before navigation:", skinTypeResult);
      navigation.navigate("Result", {
        diagnosis: diagnosisResult,
        skinType: skinTypeResult,
        imageUri: image,
        scanDate: "2024-11-18",
        email:user.email,
        istaken: istaken
      });
    } else {
      diagnose();
    }
  };

  const handleChatbotButton = () => {
    navigation.navigate("Chatbot"); // Navigate to the Chatbot page
  };

  return (
    <SafeArea>
      <ScrollContainer>
        <ContentContainer>
          <Logo source={BlossomLogo} />
          <Text>Select an option to continue</Text>
          {image && (
            <ImageContainer>
              <PreviewImage source={{ uri: image }} />
              <AnalyseButton
                onPress={handleDiagnosisButton}
                disabled={isLoading}
              >
                <ButtonTextAnalyse>
                  {diagnosisComplete ? "See Result" : "ANALYSE"}
                </ButtonTextAnalyse>
              </AnalyseButton>
            </ImageContainer>
          )}
          {isLoading && (
            <>
              <Loader size="large" color="#E9AFB9" />
              <ProgressBar>
                <ProgressBarFill style={{ width: `${progress}%` }} />
              </ProgressBar>
            </>
          )}
          <Button onPress={pickImage}>
            <ButtonText>UPLOAD IMAGE</ButtonText>
          </Button>
          <Button onPress={takePhoto}>
            <ButtonText>TAKE PHOTO</ButtonText>
          </Button>
          <Button onPress={handleChatbotButton}>
            <ButtonText>CHAT WITH BOT</ButtonText>
          </Button>
        </ContentContainer>
      </ScrollContainer>
      <BottomBar>
        <BottomBarItem onPress={() => navigation.navigate("Home")}>
          <StyledIonicons name="home-outline" />
          <BottomBarText>HOME</BottomBarText>
        </BottomBarItem>
        <BottomBarItem onPress={() => navigation.navigate("SavedProducts")}>
          <StyledIonicons name="bookmark-outline" />
          <BottomBarText>PRODUCTS</BottomBarText>
        </BottomBarItem>
        <BottomBarItem onPress={() => navigation.navigate("History")}>
          <StyledIonicons name="stats-chart-outline" />
          <BottomBarText>History</BottomBarText>
        </BottomBarItem>
        <BottomBarItem onPress={() => navigation.navigate("Profile")}>
          <StyledIonicons name="person-outline" />
          <BottomBarText>ACCOUNT</BottomBarText>
        </BottomBarItem>
      </BottomBar>
    </SafeArea>
  );
};


export default Home;