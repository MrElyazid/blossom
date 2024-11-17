import React, { useState, useEffect } from "react";
import { View, Image, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import Svg, { Rect } from "react-native-svg";
import axios from "axios";
import { StyledIonicons, BottomBar, BottomBarItem, BottomBarText } from "../../styles/bottomBarStyled";
import {
  SafeArea,
  ScrollContainer,
  ContentContainer,
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
  Title1,
} from "../../styles/home/ResultStyled";
import { fetchProducts } from "../utils/fetchProducts"; // Reusable function

const Result = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { diagnosis, skinType, imageUri, scanDate, email, istaken } = route.params || {};
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [isMoreThanOneDay, setIsMoreThanOneDay] = useState(false);


  //probleme de comparaison + scan date() dans home.js + axios err if no dates 
  const fetchDates = async () => {
    console.log("fetchDates called");
    if (!email) {
      console.error("Email is missing.");
      return;
    }
    try {
      const response = await axios.post("https://rag-bl-6rgb.vercel.app/getdates", { "user_email": email });
      const scanDates = response.data.scan_dates || [];
      console.log("Fetched Dates:", scanDates);
  
      if (scanDates.length === 0) {
        console.log("No previous scan dates found.");
        setIsMoreThanOneDay(true); // Aucun scan antérieur, autoriser l'insertion.
        return;
      }
  
      if (!scanDate) {
        console.error("scanDate is undefined.");
        return;
      }
  
      let moreThanOneDay = false;
  
      for (let i = 0; i < scanDates.length; i++) {
        const pastDate = scanDates[i];
        const diffTime = Math.abs(new Date(scanDate) - new Date(pastDate));
        const diffDays = diffTime / (1000 * 60 * 60 * 24);
  
        console.log(`Comparing: scanDate=${scanDate}, pastDate=${pastDate}, Diff Days=${diffDays}`);
        if (diffDays > 0) {
          moreThanOneDay = true;
          break;
        }
      }
  
      setIsMoreThanOneDay(moreThanOneDay);
    } catch (error) {
      console.error("Error fetching scan dates:", error);
    }
  };
  
  

  const insertData = async () => {
    if (!istaken && !isMoreThanOneDay) {
      console.log("Skipping data insertion: conditions not met (istaken=false and isMoreThanOneDay=false).");
      return;
    }
    try {
      const skinCondition =
        diagnosis?.predictions?.[0]?.class?.toLowerCase().replace(" ", "_") || "";
      const skinTypeClass =
        skinType?.top?.toLowerCase().replace("-", "_") || "";
  
      console.log("Skin Condition:", skinCondition);
      console.log("Skin Type Class:", skinTypeClass);
  
      const fetchedProducts = await fetchProducts(skinCondition, skinTypeClass);
  
      if (!fetchedProducts || fetchedProducts.length === 0) {
        console.error("No products fetched.");
        return;
      }
  
      const data = {
        "user-email": email,
        "scan-date": scanDate,
        "user-skin-type": skinType?.top || "Unknown",
        "user-skin-diseases": [...new Set(diagnosis?.predictions?.map(prediction => prediction.class) || ["Unknown"])],
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
  
     // const response = await axios.post("https://rag-bl-6rgb.vercel.app/insert", data);
     // console.log("Response from insertion:", response.data);
    } catch (error) {
      console.error("Error fetching products or inserting data:", error);
    }
  };
  

  useEffect(() => {
    const init = async () => {
      console.log("Initializing...");
      await fetchDates();
      await insertData();
    };
    init();

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
  }, [imageUri, diagnosis, skinType]);

  const renderDiagnosisResult = () => {
    if (!diagnosis || !diagnosis.predictions || diagnosis.predictions.length === 0) {
      return <NoDataText>No detections found.</NoDataText>;
    }

    return diagnosis.predictions.map((prediction, index) => (
      <ResultItem key={index}>
        <ClassText>Class: {prediction.class}</ClassText>
        <ConfidenceText>
          Confidence: {(prediction?.confidence * 100)?.toFixed(2) || "N/A"}%
        </ConfidenceText>
        <CoordinatesText>
          Coordinates: ({(prediction.x).toFixed(2)}, {(prediction.y).toFixed(2)}) - ({((prediction.x + prediction.width)).toFixed(2)}, {((prediction.y + prediction.height)).toFixed(2)})
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
        <ConfidenceText>
          Confidence: {(skinType.confidence * 100)?.toFixed(2) || "N/A"}%
        </ConfidenceText>
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
            <Ionicons name="arrow-back" size={24} />
          </BackButton>
          <Title>SKIN ANALYSIS</Title>
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
          <Title1>SKIN DISEASE</Title1>
          {renderDiagnosisResult()}
          <Title1>SKIN TYPE ANALYSIS</Title1>
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
          <StyledIonicons name="save-outline" />
          <BottomBarText>FAVORITES</BottomBarText>
        </BottomBarItem>
        <BottomBarItem onPress={() => navigation.navigate("Profile")}>
          <StyledIonicons name="person-outline" />
          <BottomBarText>PROFILE</BottomBarText>
        </BottomBarItem>
      </BottomBar>
    </SafeArea>
  );
};

export default Result;
