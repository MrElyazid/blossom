import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons from Expo

// Styled Ionicons with dynamic size and color
export const StyledIonicons = styled(Ionicons)`
  font-size: ${(props) => props.size || 24}px;
  color: ${(props) => props.color || '#E9AFB9'};
`;

// Bottom bar with subtle shadow and rounded design
export const BottomBar = styled.View`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  flex-direction: row;
  justify-content: space-around;
  padding: 10px 0;
  background-color: #fff;
  border-top-left-radius: 25px;
  border-top-right-radius: 25px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  height: 70px;
  border-width: 2px;
  border-color: #E9AFB9;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.2;
  shadow-radius: 4px;
  elevation: 5; /* For Android shadow */
`;

// Individual bar items
export const BottomBarItem = styled.TouchableOpacity`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

// Text with dynamic color for active/inactive state
export const BottomBarText = styled.Text`
  color: ${(props) => props.color || '#333'};
  font-size: 12px;
  margin-top: 5px;
  font-weight: ${(props) => (props.active ? 'bold' : 'normal')};
`;
