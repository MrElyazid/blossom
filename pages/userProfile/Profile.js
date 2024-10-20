// pages/userProfile/Profile.js
import React, { useState } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { auth, db } from "../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import {
  SafeArea,
  ScrollContainer,
  ContentContainer,
  BottomBar,
  BottomBarItem,
  BottomBarText,
} from "../../styles/home/HomeStyled";
import {
  Title,
  Email,
  LogoutButton,
  LogoutButtonText,
  InfoText,
} from "../../styles/userProfile/ProfileStyled";

const Profile = () => {
  const [userEmail, setUserEmail] = useState("");
  const [totalScans, setTotalScans] = useState(0);
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      const fetchUserData = async () => {
        const user = auth.currentUser;
        if (user) {
          setUserEmail(user.email);
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setTotalScans(userData.totalScans || 0);
          }
        }
      };

      fetchUserData();
    }, [])
  );

  const handleLogout = () => {
    auth
      .signOut()
      .then(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: "App" }],
        });
      })
      .catch((error) => {
        console.error("Logout error:", error);
      });
  };

  return (
    <SafeArea>
      <ScrollContainer>
        <ContentContainer>
          <Title>Profile</Title>
          <Email>User Email: {userEmail}</Email>
          <InfoText>Total Scans: {totalScans}</InfoText>
          <LogoutButton onPress={handleLogout}>
            <LogoutButtonText>Log Out</LogoutButtonText>
          </LogoutButton>
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

export default Profile;
