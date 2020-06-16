import styled from 'styled-components/native';
import { Platform } from 'react-native';

import colors from '../../styles/colors';

export const Container = styled.ScrollView`
  position: relative;
  flex: 1;
  padding: 0 30px ${Platform.OS === 'android' ? 60 : 40}px;
`;

export const Title = styled.Text`
  font-family: 'RobotoSlab-Medium';
  font-size: 20px;
  color: ${colors.text};
  margin: 24px 0px;
`;

export const UserAvatarButton = styled.TouchableOpacity``;

export const UserAvatar = styled.Image`
  width: 186px;
  height: 186px;
  border-radius: 98px;
  align-self: center;
`;

export const BackButton = styled.TouchableOpacity`
  margin-top: 32px;
`;
