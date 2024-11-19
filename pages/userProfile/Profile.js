import React, { useState } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { auth, db } from "../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { StyledIonicons, BottomBar, BottomBarItem, BottomBarText } from '../../styles/bottomBarStyled';  
import {
  SafeArea,
  ScrollContainer,
  ContentContainer,
} from "../../styles/home/HomeStyled";
import {
  Title,
  Email,
  LogoutButton,
  LogoutButtonText,
  InfoText,
  ProfileCard,
  ProfileDetails,
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
    <SafeArea style={{ backgroundColor: "#FFF4F4" }}>
      <ScrollContainer>
        <ContentContainer>
          <ProfileCard>
            <Title>Profile</Title>
            <ProfileDetails>
              <Email>User Email: {userEmail}</Email>
              <InfoText>Total Scans: {totalScans}</InfoText>
            </ProfileDetails>
            <LogoutButton onPress={handleLogout}>
              <LogoutButtonText>Log Out</LogoutButtonText>
            </LogoutButton>
          </ProfileCard>
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
        <BottomBarItem onPress={() => navigation.navigate("Chatbot")}>
          <StyledIonicons name="person-outline" />
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

export default Profile;
