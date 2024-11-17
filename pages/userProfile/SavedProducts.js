import React, { useState } from "react";
import {
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  Linking,
  View,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { auth, db } from "../../firebaseConfig";
import { doc, getDoc, updateDoc, arrayRemove } from "firebase/firestore";
import { StyledIonicons, BottomBar, BottomBarItem, BottomBarText } from '../../styles/bottomBarStyled';  
import {
  SafeArea,
  // BottomBar,
  // BottomBarItem,
  // BottomBarText,
} from "../../styles/home/HomeStyled";
import {
  ProductCard,
  ProductName,
  ProductInfo,
  ProductLink,
} from "../../styles/products/ProductStyled";

const SavedProducts = () => {
  const [savedProducts, setSavedProducts] = useState([]);
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      const fetchSavedProducts = async () => {
        const user = auth.currentUser;
        if (user) {
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setSavedProducts(userData.savedProducts || []);
          }
        }
      };

      fetchSavedProducts();
    }, [])
  );

  const removeProduct = async (product) => {
    const user = auth.currentUser;
    if (user) {
      try {
        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, {
          savedProducts: arrayRemove(product),
        });
        setSavedProducts(savedProducts.filter((p) => p.id !== product.id));
        Alert.alert("Success", "Product removed from saved list.");
      } catch (error) {
        console.error("Error removing product:", error);
        Alert.alert("Error", "Failed to remove product. Please try again.");
      }
    }
  };

  const renderProduct = ({ item }) => (
    <ProductCard>
      <ProductName>{item.name}</ProductName>
      <ProductInfo>Price: {item.price}</ProductInfo>
      <ProductInfo>Composition: {item.composition}</ProductInfo>
      <ProductInfo>
        Compatibility Score: {item.compatibility_score.toFixed(2)}
      </ProductInfo>
      <TouchableOpacity
        onPress={() => Linking.openURL(item.link)}
        style={{
          backgroundColor: "green",
          padding: 10,
          borderRadius: 5,
          marginTop: 10,
        }}
      >
        <Text style={{ color: "white", textAlign: "center" }}>View Product</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => removeProduct(item)}
        style={{
          backgroundColor: "#FF3B30",
          padding: 10,
          borderRadius: 5,
          marginTop: 10,
        }}
      >
        <Text style={{ color: "white", textAlign: "center" }}>Remove</Text>
      </TouchableOpacity>
    </ProductCard>
  );

  return (
    <SafeArea>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", margin: 20, textAlign: 'center' }}>
          Saved Products
        </Text>
        {savedProducts.length > 0 ? (
          <FlatList
            data={savedProducts}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: 20 }}
          />
        ) : (
          <Text style={{ margin: 20 }}>
            You haven't saved any products yet.
          </Text>
        )}
      </View>
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

export default SavedProducts;
