import React, { useState } from "react";
import { FlatList, Alert, Linking, View, ActivityIndicator } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { auth, db } from "../../firebaseConfig";
import { doc, getDoc, updateDoc, arrayRemove } from "firebase/firestore";
import {
  StyledIonicons,
  BottomBar,
  BottomBarItem,
  BottomBarText,
} from "../../styles/bottomBarStyled";
import {
  ProductCard,
  ProductName,
  ProductInfo,
} from "../../styles/products/ProductStyled";
import {
  PageTitle,
  EmptyText,
  ProductButton,
  ProductButtonText,
  ListContainer,
  RemoveButtonText,
  RemoveButton,
  ButtonRow,
} from "../../styles/userProfile/SavedProductsStyled";
import { SafeArea } from "../../styles/home/HomeStyled";

const SavedProducts = () => {
  const [savedProducts, setSavedProducts] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      const fetchSavedProducts = async () => {
        const user = auth.currentUser;
        if (user) {
          try {
            setLoading(true); // Start loading
            const userDocRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
              const userData = userDoc.data();
              setSavedProducts(userData.savedProducts || []);
            }
          } catch (error) {
            console.error("Error fetching saved products:", error);
            Alert.alert("Error", "Failed to load saved products.");
          } finally {
            setLoading(false); // Stop loading
          }
        } else {
          setLoading(false); // Stop loading if no user
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
      <ButtonRow>
        <ProductButton onPress={() => Linking.openURL(item.link)}>
          <ProductButtonText>View Product</ProductButtonText>
        </ProductButton>
        <RemoveButton onPress={() => removeProduct(item)}>
          <RemoveButtonText>Remove</RemoveButtonText>
        </RemoveButton>
      </ButtonRow>
    </ProductCard>
  );

  return (
    <SafeArea style={{ backgroundColor: "#FFF4F4" }}>
      <View style={{ flex: 1 }}>
        <PageTitle>Saved Products</PageTitle>
        {loading ? ( // Show loading spinner while fetching data
          <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />
        ) : savedProducts.length > 0 ? (
          <FlatList
            data={savedProducts}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: 20 }}
          />
        ) : (
          <EmptyText>You haven't saved any products yet.</EmptyText>
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
