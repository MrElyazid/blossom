// styles/home/ResultStyled.js
import styled from "styled-components/native";
import { ScrollView, SafeAreaView } from "react-native";
import { Platform } from "react-native";
import { Ionicons } from '@expo/vector-icons';

export const BackButton = styled.TouchableOpacity`
  align-self: flex-start;
  margin-bottom: 20px;
  margin-top: 20px;
`;

export const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  font-family: ${Platform.OS === "ios" ? "American Typewriter" : "serif"};
  color: #E9AFB9;
  margin-bottom: 15px;
  margin-top: 0px;
  text-align: center;
`;

export const Title1 = styled(Title)`
  text-align: left;
  align-self: flex-start;
  margin-left: 5px; 
  font-size: 21px;
`;

export const ResultItem = styled.View`
  background-color: #E9AFB9;
  border-radius: 15px;
  padding-vertical: 10px;
  min-width: 360px;  
  max-width: 500px;
  padding: 15px;
  margin-bottom: 15px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.23;
  shadow-radius: 2.62px;
  elevation: 4;
`;

export const ClassText = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 5px;
  font-family: ${Platform.OS === "ios" ? "American Typewriter" : "serif"};
`;

export const ConfidenceText = styled(ClassText)`
font-weight: lighter;
  font-size: 16px;
  color: #ffffff;
  margin-bottom: 5px;
`;

export const CoordinatesText = styled(ClassText)`
font-weight: bold;
  font-size: 14px;
  color: #ffffff;
  margin-bottom: 10px;
`;
export const ConsultButton = styled.TouchableOpacity`
  padding-vertical: 10px;
  min-width: 200px;  
  max-width: 300px;  
  border-radius: 25px;
  margin-bottom: 15px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
  elevation: 5;
  align-items: center;
  justify-content: center;
  color: #E9AFB9; 
  background-color: white;
  font-size: 18px; 
  border-width: 1px;
  border-color: #E9AFB9;
  margin-top: 15px;
`;

export const ConsultButtonText = styled.Text`
  font-weight: bold;
  font-family: ${Platform.OS === "ios" ? "American Typewriter" : "serif"};
  color: #E9AFB9; 
  background-color: white;
  font-size: 18px; 
`;

export const NoDataText = styled.Text`
  font-size: 16px;
  color: #666;
  text-align: center;
`;



