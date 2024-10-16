// styles/home/ResultStyled.js
import styled from "styled-components/native";

export const BackButton = styled.TouchableOpacity`
  align-self: flex-start;
  margin-bottom: 20px;
`;

export const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
`;

export const ResultItem = styled.View`
  background-color: white;
  border-radius: 10px;
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
  color: #ff69b4;
  margin-bottom: 5px;
`;

export const ConfidenceText = styled.Text`
  font-size: 16px;
  color: #333;
  margin-bottom: 5px;
`;

export const CoordinatesText = styled.Text`
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
`;

export const NoDataText = styled.Text`
  font-size: 16px;
  color: #666;
  text-align: center;
`;

export const ConsultButton = styled.TouchableOpacity`
  background-color: #ff69b4;
  padding-vertical: 15px;
  border-radius: 25px;
  align-items: center;
  margin-vertical: 20px;
`;

export const ConsultButtonText = styled.Text`
  color: white;
  font-size: 18px;
  font-weight: bold;
`;
