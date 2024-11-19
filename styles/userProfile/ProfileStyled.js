import styled from 'styled-components/native';
import { TouchableOpacity, Text } from 'react-native';

// Profile Card Styling
export const ProfileCard = styled.View`
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  margin: 20px;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.1;
  shadow-radius: 6px;
  elevation: 5;
`;

// Profile Details Section
export const ProfileDetails = styled.View`
  margin-top: 15px;
`;

// Title Styling
export const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #333;
  text-align: center;
`;

// Email Text Styling
export const Email = styled.Text`
  font-size: 16px;
  color: #777;
  margin-top: 10px;
`;

// Info Text Styling
export const InfoText = styled.Text`
  font-size: 18px;
  color: #333;
  margin-top: 8px;
`;

// Logout Button Styling
export const LogoutButton = styled.TouchableOpacity`
  background-color: #ff6347;
  border-radius: 25px;
  padding: 10px 20px;
  align-items: center;
  margin-top: 20px;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.1;
  shadow-radius: 6px;
  elevation: 5;
`;

export const LogoutButtonText = styled.Text`
  color: #fff;
  font-size: 18px;
  font-weight: bold;
`;

