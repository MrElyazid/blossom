// styles/userProfile/ProfileStyled.js
import styled from "styled-components/native";

export const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`;

export const Email = styled.Text`
  font-size: 18px;
  margin-bottom: 20px;
`;

export const LogoutButton = styled.TouchableOpacity`
  background-color: #ff6347;
  padding: 10px;
  border-radius: 5px;
`;

export const LogoutButtonText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: bold;
`;
