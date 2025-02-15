import styled from 'styled-components/native';
import { RectButton } from 'react-native-gesture-handler';
import colors from '../../styles/colors';

export const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 0 24px;
`;

export const Title = styled.Text`
  font-size: 32px;
  color: ${colors.text};
  font-family: 'RobotoSlab-Medium';
  margin-top: 18px;
  text-align: center;
`;

export const Description = styled.Text`
  font-family: 'RobotoSlab-regular';
  font-size: 18px;
  color: #999591;
  margin-top: 16px;
`;

export const OkBotton = styled(RectButton)`
  background: ${colors.primary};
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  margin-top: 24px;
  padding: 12px 24px;
`;

export const OkButtonText = styled.Text`
  font-family: 'RobotoSlab-Medium';
  color: #312e38;
  font-size: 18px;
`;
