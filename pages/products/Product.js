import React, { useState, useEffect } from "react";
import { View, Text, Linking, Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
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
  ProductCard,
  ProductName,
  ProductInfo,
  ProductLink,
} from "../../styles/products/ProductStyled";

const Product = () => {
  const [products, setProducts] = useState([]);
  const navigation = useNavigation();
  const route = useRoute();
  const { diagnosis, skinType } = route.params || {};

  useEffect(() => {
    const openDatabaseAndFetchProducts = async () => {
      try {
        console.log("useEffect triggered");

        const dbName = 'products_database.db';
        const dbPath = `${FileSystem.documentDirectory}SQLite/${dbName}`;

        // Check if database exists, if not, copy it from the bundle
        const dbExists = await FileSystem.getInfoAsync(dbPath);
        if (!dbExists.exists) {
          await FileSystem.makeDirectoryAsync(`${FileSystem.documentDirectory}SQLite`, { intermediates: true });
          await FileSystem.downloadAsync(
            Asset.fromModule(require('../../products_database.db')).uri,
            dbPath
          );
        }

        if (SQLite.openDatabaseAsync) {
          console.log("SQLite.openDatabase is available");
          const db = SQLite.openDatabaseAsync(dbName);
          console.log("Database opened: ", db);
          await fetchRelevantProducts(db);
        } else {
          console.error("SQLite.openDatabase is not defined");
          Alert.alert("Error", "SQLite is not available on this device.");
        }
      } catch (error) {
        console.error("Error in useEffect: ", error);
        Alert.alert("Error", "An unexpected error occurred.");
      }
    };

    openDatabaseAndFetchProducts();
  }, [diagnosis, skinType]);

  const fetchRelevantProducts = async (db) => {
    try {
      console.log("Fetching relevant products...");
  
      let skinCondition = diagnosis?.predictions?.[0]?.class?.toLowerCase().replace(' ', '_') || '';
      let skinTypeClass = skinType?.top?.toLowerCase().replace('-', '_') || '';
  
      console.log("Skin Condition: ", skinCondition);
      console.log("Skin Type Class: ", skinTypeClass);
  
      const query = `
        SELECT *, 
          (${skinCondition} + ${skinTypeClass}) as compatibility_score
        FROM products
        WHERE ${skinCondition} > 0 OR ${skinTypeClass} > 0
        ORDER BY compatibility_score DESC
        LIMIT 3
      `;
  
      console.log("SQL Query: ", query);
  
      db.transaction(tx => {
        tx.executeSql(
          query,
          [],
          (_, { rows: { _array } }) => {
            console.log("Query Results: ", _array);
            setProducts(_array);
          },
          (_, error) => {
            console.error("Error executing query: ", error);
            Alert.alert("Error", "Failed to fetch products from the database.");
          }
        );
      });
    } catch (error) {
      console.error("Error fetching products: ", error);
      Alert.alert("Error", "Failed to fetch products from the database.");
    }
  };
  

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
          {products.length > 0 ? (
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
