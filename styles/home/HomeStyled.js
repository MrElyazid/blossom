// styles/home/HomeStyled.js
import styled from "styled-components/native";
import { ScrollView, SafeAreaView } from "react-native";
import { Platform } from "react-native";
import { Ionicons } from '@expo/vector-icons';

export const SafeArea = styled(SafeAreaView)`
  flex: 1;
  background-color: #ffffff;
`;

export const ScrollContainer = styled(ScrollView)`
  flex: 1;
`;

export const ContentContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: flex-start;
  padding: 20px;
  padding-bottom: 70px;
`;

export const Logo = styled.Image`
  margin-top: 30px;
  margin-bottom: 10px;
  width: 250;
  height: 200;
  borderRadius: 75px;
`;

export const Text = styled.Text`
  font-size: 24px;
  color: #2C2C2C;
  margin-bottom: 20px;
  text-align: center;
  font-weight: 600;
  font-family: ${Platform.OS === "ios" ? "American Typewriter" : "serif"};
`;

export const Button = styled.TouchableOpacity`
  background-color: #F7A1A1;
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
`;


export const ButtonText = styled.Text`
  color: #ffffff;
  font-size: 18px;
  font-weight: bold;
  font-family: ${Platform.OS === "ios" ? "American Typewriter" : "serif"};
`;

export const AnalyseButton = styled(Button)`
  color: #E9AFB9; 
  background-color: white;
  font-size: 18px; 
  border-width: 1px;
  border-color: #E9AFB9;
  margin-top: 15px;
`;

export const ButtonTextAnalyse = styled(ButtonText)`
  color: #E9AFB9; 
  background-color: white;
  font-size: 18px; 
`;

export const ImageContainer = styled.View`
  align-items: center;
  margin-top: 20px;
  width: 100%;
`;

export const PreviewImage = styled.Image`
  width: 250px;
  height: 250px;
  margin-bottom: 15px;
  border-radius: 10px;
  border-width: 2px;
  border-color: #E9AFB9;
`;

export const Loader = styled.ActivityIndicator`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.7);
`;

export const StyledIonicons = styled(Ionicons)`
  size: 24px;
  color: #E9AFB9;
`;

export const ProgressBar = styled.View`
  width: 80%;
  height: 10px;
  background-color: #e0e0e0;
  border-radius: 5px;
  overflow: hidden;
  margin-top: 10px;
  margin-bottom: 20px;
`;

export const ProgressBarFill = styled.View`
  height: 100%;
  background-color: #E9AFB9;
`;
