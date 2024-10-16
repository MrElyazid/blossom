// pages/products/Product.js
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import {
  SafeArea,
  ScrollContainer,
  ContentContainer,
  BottomBar,
  BottomBarItem,
  BottomBarText,
} from "../../styles/home/HomeStyled";
import {
  BackButton,
  BackButtonText,
  CatImage,
} from "../../styles/products/ProductStyled";

const Product = () => {
  const [catImages, setCatImages] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchCatImages = async () => {
      try {
        const response = await fetch(
          "https://api.thecatapi.com/v1/images/search?limit=4"
        );
        const data = await response.json();
        setCatImages(data.map((item) => item.url));
      } catch (error) {
        console.error("Error fetching cat images: ", error);
      }
    };

    fetchCatImages();
  }, []);

  return (
    <SafeArea>
      <ScrollContainer>
        <ContentContainer>
          <BackButton onPress={() => navigation.navigate("Result")}>
            <BackButtonText>← Back</BackButtonText>
          </BackButton>
          {catImages.map((image, index) => (
            <CatImage key={index} source={{ uri: image }} />
          ))}
        </ContentContainer>
      </ScrollContainer>
      <BottomBar>
        <BottomBarItem onPress={() => navigation.navigate("Home")}>
          <Ionicons name="home-outline" size={24} color="#333" />
          <BottomBarText>Home</BottomBarText>
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

export default Product;
