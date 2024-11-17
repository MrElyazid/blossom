// bottomBarStyled.js
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons from Expo

// Styled Ionicons with common styles
export const StyledIonicons = styled(Ionicons)`
  size: 24px;
  color: #E9AFB9;
`;

export const BottomBar = styled.View`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  flex-direction: row;
  justify-content: space-around;
  padding: 10px 0;
  background-color: #ffffff;
  border-top-left-radius: 25px;
  border-top-right-radius: 25px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  height: 70px;
  border-width: 2px;
  border-color: #E9AFB9;
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
