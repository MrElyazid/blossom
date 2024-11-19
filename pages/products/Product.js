import React, { useState, useEffect } from "react";
import { View, Linking, Alert, ActivityIndicator, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StyledIonicons, BottomBar, BottomBarItem, BottomBarText } from '../../styles/bottomBarStyled';  
import { Ionicons } from "@expo/vector-icons";
import { db, auth } from "../../firebaseConfig";
import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import { SafeArea, ScrollContainer, ContentContainer } from "../../styles/home/HomeStyled";
import { BackButton, BackButtonText, ProductCard, ProductName, ProductInfo, ProductLink, Text, SaveButton, SaveButtonText } from "../../styles/products/ProductStyled";
import { fetchProducts } from "../utils/fetchProducts";  // Import the fetchProducts utility
import Toast from "react-native-toast-message";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedProducts, setSavedProducts] = useState([]);
  const navigation = useNavigation();
  const route = useRoute();
  const { diagnosis, skinType } = route.params || {};

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        console.log("useEffect triggered");

        let skinCondition =
          diagnosis?.predictions?.[0]?.class?.toLowerCase().replace(" ", "_") ||
          "";
        let skinTypeClass =
          skinType?.top?.toLowerCase().replace("-", "_") || "";

        console.log("Skin Condition:", skinCondition);
        console.log("Skin Type Class:", skinTypeClass);

        // Call the reusable fetchProducts function
        const fetchedProducts = await fetchProducts(skinCondition, skinTypeClass);
        
        console.log("Fetched Products:", fetchedProducts);
        setProducts(fetchedProducts);

        // Fetch saved products
        const user = auth.currentUser;
        if (user) {
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setSavedProducts(userData.savedProducts || []);
          }
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        Toast.show({
          type: 'error',
          text1: 'Error fetching products',
          text2: 'Please try again later.',
          style: {
            backgroundColor: 'red',
          },
          textStyle: {
            color: 'white',
          },
        });
      
        Alert.alert("Error", "Failed to fetch products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [diagnosis, skinType]);

  const saveProduct = async (product) => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Error", "You must be logged in to save products.");
      return;
    }

    try {
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        savedProducts: arrayUnion(product),
      });
      setSavedProducts([...savedProducts, product.id]);
      Toast.show({
        type: "success", // or "error"
        text1: "Product saved successfully!",
      });
    } catch (error) {
      console.error("Error saving product:", error);
  //
      // Show error toast
      Toast.show({
        type: "error",
        text1: "Error saving product",
        text2: "Please try again later.",
      });
  
      Alert.alert("Error", "Failed to save product. Please try again.");
    }
  };

  const renderProduct = (product) => (
    <ProductCard key={product.id}>
      <ProductName>{product.name}</ProductName>
      <ProductInfo>Price: {product.price}</ProductInfo>
      <ProductInfo>Composition: {product.composition}</ProductInfo>
      <ProductInfo>
        Compatibility Score: {product.compatibility_score.toFixed(2)}
      </ProductInfo>
      <ProductLink onPress={() => Linking.openURL(product.link)}>
        View Product
      </ProductLink>
      <SaveButton
        isSaved={savedProducts.includes(product.id)}
        onPress={() => saveProduct(product)}
        disabled={savedProducts.includes(product.id)}
      >
      <SaveButtonText isSaved={savedProducts.includes(product.id)}>
    {savedProducts.includes(product.id) ? "Saved" : "Save Product"}
      </SaveButtonText>
      </SaveButton>
    </ProductCard>
  );

  return (
    <SafeArea>
      <ScrollContainer>
        <ContentContainer>
        <BackButton onPress={() => navigation.navigate("Home")}>
            <Ionicons name="arrow-back" size={24} />
          </BackButton>
          <Text>
            Recommended Products
          </Text>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : products.length > 0 ? (
            products.map(renderProduct)
          ) : (
            <Text>No products found. Please try again.</Text>
          )}
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
      <Toast />
    </SafeArea>
  );
};

export default Product;
