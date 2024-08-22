// pages/products/Product.js
import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Navbar from '../../components/Navbar'; // Adjust the import path as needed

const Product = () => {
  const [catImages, setCatImages] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchCatImages = async () => {
      try {
        const response = await fetch('https://api.thecatapi.com/v1/images/search?limit=4');
        const data = await response.json();
        setCatImages(data.map(item => item.url));
      } catch (error) {
        console.error('Error fetching cat images: ', error);
      }
    };

    fetchCatImages();
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Result')}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {catImages.map((image, index) => (
          <Image key={index} source={{ uri: image }} style={styles.catImage} />
        ))}
      </ScrollView>
      <Navbar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  backButton: {
    marginBottom: 16,
  },
  backButtonText: {
    fontSize: 18,
    color: '#007BFF',
  },
  scrollView: {
    alignItems: 'center',
  },
  catImage: {
    width: 200,
    height: 200,
    marginBottom: 16,
  },
});

export default Product;