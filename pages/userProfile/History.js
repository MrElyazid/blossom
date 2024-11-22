import React, { useState, useEffect } from "react";
import { Text, FlatList, View, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { auth, db } from "../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { StyledIonicons, BottomBar, BottomBarItem, BottomBarText } from "../../styles/bottomBarStyled";
import { SafeArea } from "../../styles/home/HomeStyled";
import { Title, ContainerH, Text1, Text2, ContentWrapper, PlaceholderText, StyledImage, TextContent } from "../../styles/userProfile/HistoryStyled";

const History = () => {
  const navigation = useNavigation();
  const [scanHistory, setScanHistory] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchScanHistory = async () => {
      setLoading(true); // Start loading
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setScanHistory(userData.scans || []);
        }
      }
      setLoading(false); // End loading
    };

    fetchScanHistory();
  }, []);

  const renderScanItem = ({ item }) => (
    <ContainerH>
      <ContentWrapper>
        {item.imageUrl ? (
          <StyledImage source={{ uri: item.imageUrl }} resizeMode="cover" />
        ) : (
          <PlaceholderText>Not available for image</PlaceholderText>
        )}
        <TextContent>
          <Text1>Date: {new Date(item.date).toLocaleString()}</Text1>
          <Text2>
            Diagnosis:{" "}
            {item.diagnosisResult &&
            item.diagnosisResult.predictions &&
            item.diagnosisResult.predictions.length > 0
              ? item.diagnosisResult.predictions[0].class
              : "N/A"}
          </Text2>
          <Text2>
            Skin Type: {item.skinTypeResult ? item.skinTypeResult.top : "N/A"}
          </Text2>
        </TextContent>
      </ContentWrapper>
    </ContainerH>
  );

  return (
    <SafeArea style={{ backgroundColor: "#FFF4F4" }}>
      <View style={{ flex: 1, padding: 20 }}>
        <Title>SCANNING HISTORY</Title>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : scanHistory.length > 0 ? (
          <FlatList
            data={scanHistory.sort((a, b) => new Date(b.date) - new Date(a.date))}
            renderItem={renderScanItem}
            keyExtractor={(item, index) => index.toString()}
          />
        ) : (
          <Text>No scan history available.</Text>
        )}
      </View>
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
        <BottomBarItem onPress={() => navigation.navigate("Chatbot")}>
          <StyledIonicons name="chatbox-ellipses-outline" />
          <BottomBarText>ChatBot</BottomBarText>
        </BottomBarItem>
        {/* <BottomBarItem onPress={() => navigation.navigate("Profile")}>
          <StyledIonicons name="person-outline" />
          <BottomBarText>ACCOUNT</BottomBarText>
        </BottomBarItem> */}
      </BottomBar>
    </SafeArea>
  );
};

export default History;
