import React, { useState, useEffect } from "react";
import { View, Image, Dimensions, Text, StyleSheet } from "react-native";
import Svg, { Rect, Text as SvgText } from "react-native-svg";
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
  Title,
  ConsultButton,
  ConsultButtonText,
} from "../../styles/home/ResultStyled";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

const Result = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { diagnosis, skinType, imageUri } = route.params || {};
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    if (imageUri) {
      Image.getSize(imageUri, (width, height) => {
        const screenWidth = Dimensions.get("window").width;
        const scaleFactor = screenWidth / width;
        setImageDimensions({
          width: screenWidth,
          height: height * scaleFactor,
        });
      });
    }
  }, [imageUri]);

  const skinIssues = [
    { label: "Acne", x1: 0.25, y1: 0.4, x2: 0.4, y2: 0.5, color: "red", confidence: "85%", coordinates: "(68.5, 279.04) - (160.37, 347.10)" },
    { label: "Blackheads", x1: 0.55, y1: 0.4, x2: 0.6, y2: 0.5, color: "black", confidence: "90%", coordinates: "(150.9, 280.97) - (348.56, 346.22)" },
    // Add more items as needed
  ];

  const renderSkinIssuesOnImage = () => {
    return skinIssues.map((issue, index) => {
      const boxX = issue.x1 * imageDimensions.width;
      const boxY = issue.y1 * imageDimensions.height;
      const boxWidth = (issue.x2 - issue.x1) * imageDimensions.width;
      const boxHeight = (issue.y2 - issue.y1) * imageDimensions.height;

      return (
        <React.Fragment key={index}>
          <Rect
            x={boxX}
            y={boxY}
            width={boxWidth}
            height={boxHeight}
            strokeWidth="2"
            stroke={issue.color}
            fill={issue.color + "33"} // Semi-transparent fill
          />
          <SvgText
            x={boxX}
            y={boxY > 10 ? boxY - 5 : boxY + 15} // Position label near the box
            fill={issue.color}
            fontSize="14"
            fontWeight="bold"
          >
            {issue.label}
          </SvgText>
        </React.Fragment>
      );
    });
  };

  const renderDetailedSkinAnalysis = () => (
    <View style={styles.detailedAnalysisContainer}>
      {skinIssues.map((issue, index) => (
        <View key={index} style={styles.detailedItem}>
          <Text style={styles.detailedText}>Class: {issue.label}</Text>
          <Text style={styles.detailedText}>Confidence: {issue.confidence}</Text>
          <Text style={styles.detailedText}>Coordinates: {issue.coordinates}</Text>
        </View>
      ))}
    </View>
  );

  return (
    <SafeArea>
      <ScrollContainer>
        <ContentContainer>
          <BackButton onPress={() => navigation.navigate("Home")}>
            <Ionicons name="arrow-back" size={24} color="#ff69b4" />
          </BackButton>
          <Title>Diagnosis Result</Title>
          {imageUri && (
            <View style={{ position: "relative", marginBottom: 20 }}>
              <Image
                source={{ uri: imageUri }}
                style={{
                  width: imageDimensions.width,
                  height: imageDimensions.height,
                }}
                resizeMode="contain"
              />
              <Svg
                height={imageDimensions.height}
                width={imageDimensions.width}
                style={{ position: "absolute", top: 0, left: 0 }}
              >
                {renderSkinIssuesOnImage()}
              </Svg>
            </View>
          )}
          <Title>Skin Issue Overview</Title>
          {renderDetailedSkinAnalysis()}
          <ConsultButton onPress={() => navigation.navigate("Product", { diagnosis, skinType })}>
            <ConsultButtonText>Consult Products</ConsultButtonText>
          </ConsultButton>
        </ContentContainer>
      </ScrollContainer>

      {/* Bottom Bar */}
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

const styles = StyleSheet.create({
  detailedAnalysisContainer: {
    marginVertical: 20,
    paddingHorizontal: 15,
  },
  detailedItem: {
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
  },
  detailedText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 2,
  },
});

export default Result;
