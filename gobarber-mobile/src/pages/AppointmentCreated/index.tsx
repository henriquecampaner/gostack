import React, { useCallback, useMemo } from 'react';
import Icon from 'react-native-vector-icons/Feather';
import { format } from 'date-fns';
import enGB from 'date-fns/locale/en-GB';

import { useNavigation, useRoute } from '@react-navigation/native';
import {
  Container,
  Title,
  Description,
  OkBotton,
  OkButtonText,
} from './styles';

interface RouteParams {
  date: number;
}

const AppointmentCreated: React.FC = () => {
  const { reset } = useNavigation();

  const { params } = useRoute();
  const routeParams = params as RouteParams;

  const formattedDate = useMemo(() => {
    return format(routeParams.date, "EEEE',' do MMMM yyyy','  'at' HH:mm'h' ", {
      locale: enGB,
    });
  }, [routeParams.date]);

  const handleOkPressed = useCallback(() => {
    reset({
      routes: [
        {
          name: 'Dashboard',
        },
      ],
      index: 0,
    });
  }, [reset]);

  return (
    <Container>
      <Icon name="check" size={80} color="#04d361" />

      <Title>Schedule {'\n'} Completed!</Title>
      <Description>{formattedDate}</Description>

      <OkBotton onPress={handleOkPressed}>
        <OkButtonText>Ok</OkButtonText>
      </OkBotton>
    </Container>
  );
};

export default AppointmentCreated;
