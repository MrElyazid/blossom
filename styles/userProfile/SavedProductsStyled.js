import styled from "styled-components/native";
import { Platform } from "react-native";

export const PageTitle = styled.Text`
  font-size: 24px;
  font-weight: bold;
  font-family: ${Platform.OS === "ios" ? "American Typewriter" : "serif"};
  color: #E9AFB9;
  margin-bottom: 15px;
  margin-top: 40px;
  text-align: center;
`;

export const EmptyText = styled.Text`
  margin: 20px;
`;

export const ButtonRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
`;

export const ProductButton = styled.TouchableOpacity`
  background-color: ${(props) => (props.isSaved ? "#9c9798" : "#ffffff")};
  padding: 10px;
  border-radius: 25px;
  padding-vertical: 10px;
  padding-horizontal: 30px;
  width: 120px;
  border-width: 1px;
  border-color: #E9AFB9;
`;

export const ProductButtonText = styled.Text`
  color: ${(props) => (props.isSaved ? "#ffffff" : "#E9AFB9")};
  text-align: center;
  font-family: ${Platform.OS === "ios" ? "American Typewriter" : "serif"};
  font-weight: bold;
  font-size: 16px;
`;

export const RemoveButton = styled.TouchableOpacity`
  background-color: ${(props) => (props.isSaved ? "#9c9798" : "#a7241c")};
  padding: 10px;
  border-radius: 25px;
  padding-vertical: 10px;
  padding-horizontal: 30px;
  width: 120px;
  border-width: 1px;
  border-color: #a7241c;
`;

export const RemoveButtonText = styled.Text`
  color: #ffffff;
  text-align: center;
  font-family: ${Platform.OS === "ios" ? "American Typewriter" : "serif"};
  font-weight: bold;
  font-size: 16px;
`;


export const ListContainer = styled.View`
  flex: 1;
  padding-horizontal: 20px;
`;
