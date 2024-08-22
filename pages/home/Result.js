import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Navbar from '../../components/Navbar';

const Result = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { diagnosis } = route.params || {};

  const renderDiagnosisResult = () => {
    if (!diagnosis || diagnosis.length === 0) {
      return <Text style={styles.noData}>No diagnosis data available.</Text>;
    }

    return diagnosis.map((item, index) => (
      <View key={index} style={styles.resultItem}>
        <Text style={styles.disease}>{item.disease}</Text>
        <Text style={styles.probability}>Probability: {item.probability}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.dryness}>Dryness: {item.dryness}</Text>
        <Text style={styles.gender}>Expected Gender: {item.expected_gender}</Text>
        <View style={styles.skinProperties}>
          <Text style={styles.skinPropertyTitle}>Skin Properties:</Text>
          <Text>Hydration: {item.skin_properties.hydration_level}</Text>
          <Text>Oiliness: {item.skin_properties.oiliness_level}</Text>
          <Text>Sensitivity: {item.skin_properties.sensitivity_level}</Text>
        </View>
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Ionicons name="arrow-back" size={24} color="#ff69b4" />
      </TouchableOpacity>
      <Text style={styles.title}>Diagnosis Result</Text>
      <ScrollView style={styles.scrollView}>
        {renderDiagnosisResult()}
      </ScrollView>
      <TouchableOpacity
        style={styles.consultButton}
        onPress={() => navigation.navigate('Product')}
      >
        <Text style={styles.consultButtonText}>Consult Products</Text>
      </TouchableOpacity>
      <Navbar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff',
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 60,
    marginBottom: 20,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
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
  disease: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff69b4',
    marginBottom: 5,
  },
  probability: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  dryness: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  gender: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
  },
  skinProperties: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
  },
  skinPropertyTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
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