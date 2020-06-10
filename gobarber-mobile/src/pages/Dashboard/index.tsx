import React from 'react';

// Authorization
import { useAuth } from '../../hooks/Auth';

// Styles
import { Container, Header, HeaderTitle, UserName } from './styles';

const Dashboard: React.FC = () => {
  const { signOut, user } = useAuth();

  return (
    <Container>
      <Header>
        <HeaderTitle>
          Welcone, {'\n'}
          <UserName>{user.name}</UserName>
        </HeaderTitle>
      </Header>
    </Container>
  );
};

export default Dashboard;
