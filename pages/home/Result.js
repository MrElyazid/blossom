// pages/home/Result.js
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  SafeArea,
  ScrollContainer,
  ContentContainer,
  BottomBar,
  BottomBarItem,
  BottomBarText,
} from '../../styles/home/HomeStyled';
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
} from '../../styles/home/ResultStyled';

const Result = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { diagnosis } = route.params || {};

  const renderDiagnosisResult = () => {
    if (!diagnosis || diagnosis.length === 0) {
      return <NoDataText>No detections found.</NoDataText>;
    }

    return diagnosis.map((prediction, index) => (
      <ResultItem key={index}>
        <ClassText>Class: {prediction.class}</ClassText>
        <ConfidenceText>Confidence: {(prediction.confidence * 100).toFixed(2)}%</ConfidenceText>
        <CoordinatesText>
          Coordinates: ({prediction.x1.toFixed(2)}, {prediction.y1.toFixed(2)}) -
          ({prediction.x2.toFixed(2)}, {prediction.y2.toFixed(2)})
        </CoordinatesText>
      </ResultItem>
    ));
  };

  return (
    <SafeArea>
      <ScrollContainer>
        <ContentContainer>
          <BackButton onPress={() => navigation.navigate('Home')}>
            <Ionicons name="arrow-back" size={24} color="#ff69b4" />
          </BackButton>
          <Title>Diagnosis Result</Title>
          {renderDiagnosisResult()}
          <ConsultButton onPress={() => navigation.navigate('Product')}>
            <ConsultButtonText>Consult Products</ConsultButtonText>
          </ConsultButton>
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

export default Result;