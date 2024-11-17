import React, { useState, useEffect } from "react";
import { Text, FlatList, View, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { auth, db } from "../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { StyledIonicons, BottomBar, BottomBarItem, BottomBarText } from '../../styles/bottomBarStyled';  
import {
  SafeArea,
  // BottomBar,
  // BottomBarItem,
  // BottomBarText,
} from "../../styles/home/HomeStyled";
import { Title } from "../../styles/userProfile/HistoryStyled";

const History = () => {
  const navigation = useNavigation();
  const [scanHistory, setScanHistory] = useState([]);

  useEffect(() => {
    const fetchScanHistory = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setScanHistory(userData.scans || []);
        }
      }
    };

    fetchScanHistory();
  }, []);

  const renderScanItem = ({ item }) => (
    <View
      style={{
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        paddingBottom: 10,
      }}
    >
      <Text style={{ fontWeight: "bold" }}>
        Date: {new Date(item.date).toLocaleString()}
      </Text>
      <Text>
        Diagnosis: {item.diagnosisResult && item.diagnosisResult.predictions && item.diagnosisResult.predictions.length > 0 ? item.diagnosisResult.predictions[0].class : "N/A"}
      </Text>
      <Text>Skin Type: {item.skinTypeResult ? item.skinTypeResult.top : "N/A"}</Text>
      {item.imageUrl ? (
        <Image
          source={{ uri: item.imageUrl }}
          style={{ width: 100, height: 100, marginTop: 10 }}
          resizeMode="cover"
        />
      ) : (
        <Text style={{ marginTop: 10 }}>Not available for image</Text>
      )}
    </View>
  );

  return (
    <SafeArea>
      <View style={{ flex: 1, padding: 20 }}>
        <Title>Scan History</Title>
        {scanHistory.length > 0 ? (
          <FlatList
            data={scanHistory.sort(
              (a, b) => new Date(b.date) - new Date(a.date)
            )}
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
      <BottomBarItem onPress={() => navigation.navigate("Profile")}>
        <StyledIonicons name="person-outline" />
        <BottomBarText>ACCOUNT</BottomBarText>
      </BottomBarItem>
    </BottomBar>
    </SafeArea>
  );
};

export default History;
