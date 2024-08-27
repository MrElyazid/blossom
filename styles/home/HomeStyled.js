// styles/home/HomeStyled.js
import styled from 'styled-components/native';
import { ScrollView, SafeAreaView } from 'react-native';

export const SafeArea = styled(SafeAreaView)`
  flex: 1;
  background-color: #f0f8ff;
`;

export const ScrollContainer = styled(ScrollView)`
  flex: 1;
`;

export const ContentContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: flex-start;
  padding: 20px;
  padding-bottom: 90px; /* Add padding to accommodate the BottomBar */
`;

export const Logo = styled.Image`
  width: 120px;
  height: 120px;
  border-radius: 60px;
  border-width: 3px;
  border-color: #ff69b4;
  margin-bottom: 30px;
`;

export const Text = styled.Text`
  font-size: 22px;
  color: #333;
  margin-bottom: 30px;
  text-align: center;
  font-weight: 600;
`;

export const Button = styled.TouchableOpacity`
  background-color: #ff69b4;
  padding-horizontal: 30px;
  padding-vertical: 15px;
  border-radius: 25px;
  margin-bottom: 20px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
  elevation: 5;
`;

export const ButtonText = styled.Text`
  color: white;
  font-size: 18px;
  font-weight: bold;
`;

export const ImageContainer = styled.View`
  align-items: center;
  margin-top: 20px;
  width: 100%;
`;

export const PreviewImage = styled.Image`
  width: 250px;
  height: 250px;
  margin-bottom: 20px;
  border-radius: 10px;
  border-width: 2px;
  border-color: #ff69b4;
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

export const BottomBar = styled.View`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  flex-direction: row;
  justify-content: space-around;
  padding: 10px 0;
  background-color: #f8d7da;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  height: 70px;
`;

export const BottomBarItem = styled.TouchableOpacity`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const BottomBarText = styled.Text`
  color: #333;
  font-size: 12px;
  margin-top: 5px;
`;

export const ProgressBar = styled.View`
  width: 80%;
  height: 10px;
  background-color: #e0e0e0;
  border-radius: 5px;
  overflow: hidden;
  margin-top: 10px;
`;

export const ProgressBarFill = styled.View`
  height: 100%;
  background-color: #ff69b4;
`;
