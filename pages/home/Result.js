import React, { useState, useEffect } from "react";
import { View, Image, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import Svg, { Rect } from "react-native-svg";
import { Text as SvgText } from "react-native-svg";
import axios from "axios";
import { Text } from "../../styles/home/HomeStyled";
import {
  StyledIonicons,
  BottomBar,
  BottomBarItem,
  BottomBarText,
} from "../../styles/bottomBarStyled";
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
  const { diagnosis, skinType, imageUri, scanDate, email, istaken } =
    route.params || {};
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [canInsertData, setCanInsertData] = useState(false);

  const fetchDates = async () => {
    console.log("fetchDates called");

    if (!email) {
      console.error("Email is missing.");
      return;
    }

    try {
      const response = await axios.post(
        "https://rag-bl-6rgb.vercel.app/getdates",
        { user_email: email }
      );
      const scanDates = response.data.scan_dates || [];
      console.log("Fetched Dates:", scanDates);

      if (!scanDate) {
        console.error("scanDate is undefined.");
        return;
      }

      const isSameDayScan = scanDates.some((date) => {
        const existingDate = new Date(date).toISOString().split("T")[0];
        const currentScanDate = new Date(scanDate).toISOString().split("T")[0];
        return existingDate === currentScanDate;
      });

      setCanInsertData(!isSameDayScan);
      console.log("Setting canInsertData:", !isSameDayScan);
    } catch (error) {
      console.log("Error fetching scan dates:", error);
    }
  };

  const insertData = async () => {
    if (!istaken) {
      console.log("istaken:", istaken);
      console.log(
        "Skipping data insertion: the photo is not taken by the user."
      );
      return;
    }

    if (!canInsertData) {
      console.log("canInsertData:", canInsertData);
      console.log("Skipping data insertion: conditions not met.");
      return;
    }

    try {
      const skinCondition =
        diagnosis?.predictions?.[0]?.class?.toLowerCase().replace(" ", "_") ||
        "";
      const skinTypeClass =
        skinType?.top?.toLowerCase().replace("-", "_") || "";

      const fetchedProducts = await fetchProducts(skinCondition, skinTypeClass);

      if (!fetchedProducts || fetchedProducts.length === 0) {
        console.error("No products fetched.");
        return;
      }

      const data = {
        "user-email": email,
        "scan-date": scanDate,
        "user-skin-type": skinType?.top || "Unknown",
        "user-skin-diseases": [
          ...new Set(
            diagnosis?.predictions?.map((prediction) => prediction.class) || [
              "Unknown",
            ]
          ),
        ],
        products: fetchedProducts.map((product) => ({
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

      // Uncomment to actually insert the data
      const response = await axios.post(
        "https://rag-bl-6rgb.vercel.app/insert",
        data
      );
      console.log("Response from insertion:", response.data);
    } catch (error) {
      console.error("Error fetching products or inserting data:", error);
    }
  };

  useEffect(() => {
    const init = async () => {
      console.log("Initializing...");
      await fetchDates();
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

  useEffect(() => {
    if (canInsertData) {
      insertData();
    }
  }, [canInsertData]);
  const renderDiagnosisResult = () => {
    if (
      !diagnosis ||
      !diagnosis.predictions ||
      diagnosis.predictions.length === 0
    ) {
      return <NoDataText>No detections found.</NoDataText>;
    }

    return diagnosis.predictions.map((prediction, index) => (
      <ResultItem key={index}>
        <ClassText>Class: {prediction.class}</ClassText>
        <ConfidenceText>
          Confidence: {(prediction?.confidence * 100)?.toFixed(2) || "N/A"}%
        </ConfidenceText>
        <CoordinatesText>
          Coordinates: ({prediction.x.toFixed(2)}, {prediction.y.toFixed(2)}) -
          ({(prediction.x + prediction.width).toFixed(2)},{" "}
          {(prediction.y + prediction.height).toFixed(2)})
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

  const diseaseColors = {
    acne: "rgba(255, 0, 0, 0.5)", // Red for acne
    eczema: "rgba(0, 0, 255, 0.5)", // Blue for eczema
    rosacea: "rgba(255, 165, 0, 0.5)", // Orange for rosacea
    blackheads: "rgba(0, 255, 0, 0.5)", // Green for blackheads
    wrinkles: "rgba(255, 255, 0, 0.5)", // Yellow for wrinkles
    whiteheads: "rgba(255, 255, 255, 0.5)", // White for whiteheads
    default: "rgba(0, 0, 0, 0.5)", // Default color
  };

  const renderBoundingBoxes = () => {
    if (
      !diagnosis ||
      !diagnosis.predictions ||
      imageDimensions.width === 0 ||
      imageDimensions.height === 0
    )
      return null;
  
    return (
      <View style={{ position: "relative" }}>
        <Svg
          viewBox={`0 0 ${imageDimensions.width} ${imageDimensions.height}`}
          width={imageDimensions.width}
          height={imageDimensions.height}
          style={{ position: "absolute" }}
        >
          {/* Dessin des bounding boxes */}
          {diagnosis.predictions.map((prediction, index) => {
            const { x, y, width, height, class: diseaseClass } = prediction;
            const boxColor =
              diseaseColors[diseaseClass.toLowerCase()] || diseaseColors.default;
  
            return (
              <React.Fragment key={`box-${index}`}>
                <Rect
                  x={x}
                  y={y}
                  width={width}
                  height={height}
                  stroke={boxColor}
                  strokeWidth={2}
                  fill="none"
                />
              </React.Fragment>
            );
          })}
  
          {/* Dessin des étiquettes */}
          {diagnosis.predictions.map((prediction, index) => {
            const { x, y, class: diseaseClass } = prediction;
            const label = diseaseClass.charAt(0).toUpperCase() + diseaseClass.slice(1);
  
            return (
              <React.Fragment key={`label-${index}`}>
                {/* Fond de l'étiquette */}
                <Rect
                  x={x}
                  y={y - 20}
                  width={label.length * 8}
                  height={16}
                  fill="rgba(255, 255, 255, 0.7)"
                  rx={4}
                />
                {/* Texte de l'étiquette */}
                <SvgText
                  x={x + 4}
                  y={y - 8}
                  fontSize="12"
                  fill="black"
                >
                  {label}
                </SvgText>
              </React.Fragment>
            );
          })}
        </Svg>
      </View>
    );
  };

  // Function to render the color swatches with names
  const renderLegend = () => {
    const diseaseColors = {
      acne: "rgba(255, 0, 0, 0.5)", // Red for acne
      eczema: "rgba(0, 0, 255, 0.5)", // Blue for eczema
      rosacea: "rgba(255, 165, 0, 0.5)", // Orange for rosacea
      blackheads: "rgba(0, 255, 0, 0.5)", // Green for blackheads
      wrinkles: "rgba(255, 255, 0, 0.5)", // Yellow for wrinkles
      whiteheads: "rgba(255, 255, 255, 0.5)", // White for whiteheads
      default: "rgba(0, 0, 0, 0.5)", // Default color
    };

    return (
      <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 10 }}>
        {Object.entries(diseaseColors).map(([condition, color]) => (
          <View
            key={condition}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginRight: 15,
              marginBottom: 10,
              paddingVertical: 2, // Adjust vertical alignment
            }}
          >
            <View
              style={{
                width: 12, // Smaller swatch size
                height: 12, // Smaller swatch size
                backgroundColor: color,
                marginRight: 8, // More space between swatch and text
                borderRadius: 3, // Rounded corners for the color swatch
              }}
            />
            {/* Ensure the text is vertically aligned with the swatch */}
            <Text style={{ fontSize: 12, lineHeight: 15, marginBottom: 0 }}>
              {condition.charAt(0).toUpperCase() + condition.slice(1)}{" "}
              {/* Capitalize disease name */}
            </Text>
          </View>
        ))}
      </View>
    );
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
                {renderBoundingBoxes() ||null}
              </Svg>
            </View>
          )}

          {/* Color Legend */}
          <Title1>Skin Disease Colors</Title1>
          <View style={{ marginBottom: 20 }}>{renderLegend()}</View>

          <Title1>SKIN DISEASE</Title1>
          {renderDiagnosisResult()}
          <Title1>SKIN TYPE ANALYSIS</Title1>
          {renderSkinTypeResult()}
          <ConsultButton
            onPress={() =>
              navigation.navigate("Product", { diagnosis, skinType })
            }
          >
            <ConsultButtonText>Consult Products</ConsultButtonText>
          </ConsultButton>
        </ContentContainer>
      </ScrollContainer>
      <BottomBar>
        <BottomBarItem onPress={() => navigation.navigate("Home")}>
          <StyledIonicons name="home-outline" />
          <BottomBarText>Home</BottomBarText>
        </BottomBarItem>
        <BottomBarItem onPress={() => navigation.navigate("SavedProducts")}>
          <StyledIonicons name="bookmark-outline" />
          <BottomBarText>Products</BottomBarText>
        </BottomBarItem>
        <BottomBarItem onPress={() => navigation.navigate("History")}>
          <StyledIonicons name="stats-chart-outline" />
          <BottomBarText>History</BottomBarText>
        </BottomBarItem>
        <BottomBarItem onPress={() => navigation.navigate("Chatbot")}>
          <StyledIonicons name="chatbox-ellipses-outline" />
          <BottomBarText>ChatBot</BottomBarText>
        </BottomBarItem>
      </BottomBar>
    </SafeArea>
  );
};

export default Result;
