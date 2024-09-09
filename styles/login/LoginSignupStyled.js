// styles/login/LoginSignupStyled.js
import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const Logo = styled.Image`
  width: 150px;
  height: 150px;
  border-radius: 75px;
`;

export const Button = styled.TouchableOpacity`
  margin-top: 20px;
  padding: 10px;
  background-color: ${({ color }) => color || '#007aff'};
  border-radius: 5px;
  width: 200px;
  align-items: center;
`;

export const ButtonText = styled.Text`
  color: white;
`;
