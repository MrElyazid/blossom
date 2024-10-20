import React, { useState, useEffect } from "react";
import { View, Text, Linking, Alert, ActivityIndicator } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { db } from "../../firebaseConfig";
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import { SafeArea, ScrollContainer, ContentContainer, BottomBar, BottomBarItem, BottomBarText } from "../../styles/home/HomeStyled";
import { BackButton, BackButtonText, ProductCard, ProductName, ProductInfo, ProductLink } from "../../styles/products/ProductStyled";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const route = useRoute();
  const { diagnosis, skinType } = route.params || {};

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        console.log("useEffect triggered");

        let skinCondition = diagnosis?.predictions?.[0]?.class?.toLowerCase().replace(' ', '_') || '';
        let skinTypeClass = skinType?.top?.toLowerCase().replace('-', '_') || '';

        console.log("Skin Condition:", skinCondition);
        console.log("Skin Type Class:", skinTypeClass);

        const productsRef = collection(db, "products");
        const q = query(
          productsRef,
          where(skinCondition, ">", 0),
          orderBy(skinCondition, "desc"),
          orderBy(skinTypeClass, "desc"),
          limit(3)
        );

        const querySnapshot = await getDocs(q);
        const fetchedProducts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          compatibility_score: doc.data()[skinCondition] + doc.data()[skinTypeClass]
        }));

        console.log("Fetched Products:", fetchedProducts);
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
        Alert.alert("Error", "Failed to fetch products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [diagnosis, skinType]);

  const renderProduct = (product) => (
    <ProductCard key={product.id}>
      <ProductName>{product.name}</ProductName>
      <ProductInfo>Price: {product.price}</ProductInfo>
      <ProductInfo>Composition: {product.composition}</ProductInfo>
      <ProductInfo>Compatibility Score: {product.compatibility_score.toFixed(2)}</ProductInfo>
      <ProductLink onPress={() => Linking.openURL(product.link)}>
        View Product
      </ProductLink>
    </ProductCard>
  );

  return (
    <SafeArea>
      <ScrollContainer>
        <ContentContainer>
          <BackButton onPress={() => navigation.navigate("Result")}>
            <BackButtonText>← Back</BackButtonText>
          </BackButton>
          <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Recommended Products</Text>
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
