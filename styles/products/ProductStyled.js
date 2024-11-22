import styled from "styled-components/native";
import { Dimensions, Platform } from "react-native";

const { width } = Dimensions.get("window");

export const BackButton = styled.TouchableOpacity`
  align-self: flex-start;
  margin-bottom: 20px;
  margin-top: 20px;
`;

export const Text = styled.Text`
  font-size: 24px;
  font-weight: bold;
  font-family: ${Platform.OS === "ios" ? "American Typewriter" : "serif"};
  color: #E9AFB9;
  margin-bottom: 15px;
  margin-top: 0px;
  text-align: center;
`;

export const ProductCard = styled.View`
  background-color: #fff;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 15px;
  elevation: 3;
  border-width: 1px;
  border-color: #E9AFB9;
  padding-vertical: 35px;
  width: ${width * 0.9}px;
  align-self: center;
`;

export const ProductName = styled.Text`
  font-size: 20px;
  font-weight: bold;
  font-family: ${Platform.OS === "ios" ? "American Typewriter" : "serif"};
  margin-bottom: 10px;
`;

export const ProductInfo = styled.Text`
  font-family: ${Platform.OS === "ios" ? "American Typewriter" : "serif"};
  font-size: 14px;
  margin-bottom: 5px;
`;

export const ProductLink = styled.Text`
  color: #ffffff;
  background-color: #E9AFB9;
  border-radius: 25px;
  margin-bottom: 10px;
  padding-vertical: 10px;
  padding-horizontal: 30px;
  font-family: ${Platform.OS === "ios" ? "American Typewriter" : "serif"};
  width: 150px;
  font-weight: bold;
  font-size: 16px;
  margin-top: 10px;
`;


export const SaveButton = styled.TouchableOpacity`
  background-color: ${(props) => (props.isSaved ? "#9c9798" : "#ffffff")};
  padding: 10px;
  border-radius: 25px;
  margin-bottom: 10px;
  padding-vertical: 10px;
  padding-horizontal: 30px;
  width: 150px;
  border-width: 1px;
  border-color: #E9AFB9;
`;

export const SaveButtonText = styled.Text`
  color: ${(props) => (props.isSaved ? "#ffffff" : "#E9AFB9")};;
  text-align: center;
  font-family: ${Platform.OS === "ios" ? "American Typewriter" : "serif"};
  font-weight: bold;
  font-size: 16px;
`;