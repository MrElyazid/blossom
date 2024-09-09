import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import {
  SafeArea,
  ScrollContainer,
  ContentContainer,
  BottomBar,
  BottomBarItem,
  BottomBarText,
} from '../../styles/home/HomeStyled';

const Result = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { diagnosis } = route.params || {};

  const renderDiagnosisResult = () => {
    if (!diagnosis || diagnosis.length === 0) {
      return <Text style={styles.noData}>No detections found.</Text>;
    }

    return diagnosis.map((prediction, index) => (
      <View key={index} style={styles.resultItem}>
        <Text style={styles.class}>Class: {prediction.class}</Text>
        <Text style={styles.confidence}>Confidence: {(prediction.confidence * 100).toFixed(2)}%</Text>
        <Text style={styles.coordinates}>
          Coordinates: ({prediction.x1.toFixed(2)}, {prediction.y1.toFixed(2)}) - ({prediction.x2.toFixed(2)}, {prediction.y2.toFixed(2)})
        </Text>
      </View>
    ));
  };

  return (
    <SafeArea>
      <ScrollContainer>
        <ContentContainer>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Ionicons name="arrow-back" size={24} color="#ff69b4" />
          </TouchableOpacity>
          <Text style={styles.title}>Diagnosis Result</Text>
          {renderDiagnosisResult()}
          <TouchableOpacity
            style={styles.consultButton}
            onPress={() => navigation.navigate('Product')}
          >
            <Text style={styles.consultButtonText}>Consult Products</Text>
          </TouchableOpacity>
        </ContentContainer>
      </ScrollContainer>
      <BottomBar>
        <BottomBarItem onPress={() => navigation.navigate('Home')}>
          <Ionicons name="home-outline" size={24} color="#333" />
          <BottomBarText>Home</BottomBarText>
        </BottomBarItem>
        <BottomBarItem onPress={() => navigation.navigate('History')}>
          <Ionicons name="stats-chart-outline" size={24} color="#333" />
          <BottomBarText>History</BottomBarText>
        </BottomBarItem>
        <BottomBarItem onPress={() => navigation.navigate('Profile')}>
          <Ionicons name="person-outline" size={24} color="#333" />
          <BottomBarText>Profile</BottomBarText>
        </BottomBarItem>
      </BottomBar>
    </SafeArea>
  );
};

const styles = StyleSheet.create({
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  resultItem: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  class: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff69b4',
    marginBottom: 5,
  },
  confidence: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  coordinates: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  noData: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  consultButton: {
    backgroundColor: '#ff69b4',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginVertical: 20,
  },
  consultButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Result;