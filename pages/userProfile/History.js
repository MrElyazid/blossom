// pages/userProfile/History.js
import React, { useState, useEffect } from "react";
import { Text, FlatList, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { auth, db } from "../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import {
  SafeArea,
  BottomBar,
  BottomBarItem,
  BottomBarText,
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
      <Text>Diagnosis: {item.diagnosisResult.predictions[0].class}</Text>
      <Text>Skin Type: {item.skinTypeResult.top}</Text>
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

export default History;
