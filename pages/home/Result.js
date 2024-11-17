import React, { useState, useEffect } from "react";
import { View, Image, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import Svg, { Rect } from "react-native-svg";
import { StyledIonicons, BottomBar, BottomBarItem, BottomBarText } from '../../styles/bottomBarStyled'; 
import {
  SafeArea,
  ScrollContainer,
  ContentContainer,
  // BottomBar,
  // BottomBarItem,
  // BottomBarText,
} from "../../styles/home/HomeStyled";
import {
  BackButton,
  Title,
  ResultItem,
  ClassText,
  ConfidenceText,
  CoordinatesText,
  NoDataText,
  ConsultButton,
  ConsultButtonText,
} from "../../styles/home/ResultStyled";
import { fetchProducts } from "../utils/fetchProducts"; // Import the reusable function

const Result = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { diagnosis, skinType, imageUri , scanDate, email} = route.params || {};
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });


  //hadi bach t insere data f route dial chatbot 
  const insertData = async () => {
    try {
      // Get skin condition and skin type class
      let skinCondition =
        diagnosis?.predictions?.[0]?.class?.toLowerCase().replace(" ", "_") ||
        "";
      let skinTypeClass =
        skinType?.top?.toLowerCase().replace("-", "_") || "";
  
      console.log("Skin Condition:", skinCondition);
      console.log("Skin Type Class:", skinTypeClass);
  
      // Fetch products based on skin condition and type
      const fetchedProducts = await fetchProducts(skinCondition, skinTypeClass);
      
      console.log("Fetched Products from insertData:", fetchedProducts);
  
      // Prepare data for insertion
      const data = {
        "user-email": email,
        "scan-date": scanDate,
        "user-skin-type": skinType?.top || "Unknown",
        // Use Set to remove duplicate skin diseases
        "user-skin-diseases": [...new Set(diagnosis?.predictions?.map(prediction => prediction.class) || ["Unknown"])],
        // Here we map over the fetched products and add details to the array
        "products": fetchedProducts.map((product) => ({
          name: product.name || "Unknown",
          description: product.description || "No description available",
          category: product.category || "Uncategorized",
          composition: product.composition || "No composition data",
          skinConditionScores: {
            acne: product.acne || "N/A",
            blackheads: product.blackheads || "N/A",
            eczema: product.eczema || "N/A",
            rosacea: product.rosacea || "N/A",
            wrinkles: product.wrinkles || "N/A",
            whiteheads: product.whiteheads || "N/A",
          },
          skinTypeScores: {
            normal_skin: product.normal_skin || "N/A",
            oily_skin: product.oily_skin || "N/A",
            dry_skin: product.dry_skin || "N/A",
            combination_skin: product.combination_skin || "N/A",
            sensitive_skin: product.sensitive_skin || "N/A",
          },
          link: product.link || "No link available",
          price: product.price || "No price available",
        })),
      };
  
      console.log("Data to be inserted:", data);

      
    } catch (error) {
      console.error("Error fetching products or inserting data:", error);
    }
  };
  

  useEffect(() => {
    insertData();
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
  }, [imageUri, diagnosis, skinType]); // Add dependencies here
  

  const renderDiagnosisResult = () => {
    if (!diagnosis || !diagnosis.predictions || diagnosis.predictions.length === 0) {
      return <NoDataText>No detections found.</NoDataText>;
    }

    return diagnosis.predictions.map((prediction, index) => (
      <ResultItem key={index}>
        <ClassText>Class: {prediction.class}</ClassText>
        {/* {console.log("Class:", prediction.class)} */}
        <ConfidenceText>Confidence: {(prediction.confidence * 100).toFixed(2)}%</ConfidenceText>
        <CoordinatesText>
          Coordinates: ({(prediction.x ).toFixed(2)}, {(prediction.y).toFixed(2)}) 
          - ({((prediction.x + prediction.width)).toFixed(2)}, {((prediction.y + prediction.height)).toFixed(2)})
        </CoordinatesText>
      </ResultItem>
    ));
  };

  const renderSkinTypeResult = () => {
    if (!skinType || !skinType.top) {
      return <NoDataText>Skin type analysis not available.</NoDataText>;
    }

    return (
      <ResultItem>
        <ClassText>Skin Type: {skinType.top}</ClassText>
        {/* {console.log("Skin type:", skinType.top)} */}
        <ConfidenceText>Confidence: {(skinType.confidence * 100).toFixed(2)}%</ConfidenceText>
      </ResultItem>
    );
  };

  const renderBoundingBoxes = () => {
    if (!diagnosis || !diagnosis.predictions) return null;

    return diagnosis.predictions.map((prediction, index) => {
      const { x1, y1, x2, y2 } = prediction;

      const boxX = x1 * imageDimensions.width;
      const boxY = y1 * imageDimensions.height;
      const boxWidth = (x2 - x1) * imageDimensions.width;
      const boxHeight = (y2 - y1) * imageDimensions.height;

      return (
        <Rect
          key={index}
          x={boxX}
          y={boxY}
          width={boxWidth}
          height={boxHeight}
          strokeWidth="2"
          stroke="red"
          fill="rgba(255, 0, 0, 0.2)"
        />
      );
    });
  };

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
                style={{ width: imageDimensions.width, height: imageDimensions.height }}
                resizeMode="contain"
              />
              <Svg
                height={imageDimensions.height}
                width={imageDimensions.width}
                style={{ position: "absolute", top: 0, left: 0 }}
              >
                {renderBoundingBoxes()}
              </Svg>
            </View>
          )}
          {renderDiagnosisResult()}
          <Title>Skin Type Analysis</Title>
          {renderSkinTypeResult()}
          <ConsultButton
            onPress={() => navigation.navigate("Product", { diagnosis, skinType })}
          >
            <ConsultButtonText>Consult Products</ConsultButtonText>
          </ConsultButton>
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

export default Result;
