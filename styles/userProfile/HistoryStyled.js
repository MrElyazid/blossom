import styled from "styled-components/native";
import { Dimensions, Platform } from "react-native";

const { width } = Dimensions.get("window");

export const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  font-family: ${Platform.OS === "ios" ? "American Typewriter" : "serif"};
  color: #E9AFB9;
  margin-bottom: 15px;
  margin-top: 40px;
  text-align: center;
`;

export const ContainerH = styled.View`
  background-color: #fff;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 15px;
  elevation: 3;
  border-width: 1px;
  border-color: #E9AFB9;
  padding-vertical: 10px;
  width: ${width * 0.9}px;
  align-self: center;
`;

export const ContentWrapper = styled.View`
  flex-direction: row;
  align-items: flex-start;
`;

export const PlaceholderText = styled.Text`
  font-size: 14px;
  color: #999;
  font-family: ${Platform.OS === "ios" ? "American Typewriter" : "serif"};
`;

export const StyledImage = styled.Image`
  width: 100px;
  height: 100px;
  border-radius: 8px;
  margin-right: 15px;
`;

export const TextContent = styled.View`
  flex: 1;
`;

export const Text1 = styled.Text`
  font-size: 20px;
  font-weight: bold;
  font-family: ${Platform.OS === "ios" ? "American Typewriter" : "serif"};
  margin-bottom: 10px;
`;

export const Text2 = styled.Text`
  font-family: ${Platform.OS === "ios" ? "American Typewriter" : "serif"};
  font-size: 14px;
  margin-bottom: 5px;
`;