import React from 'react';

import { AuthProvider } from './Auth';
import { TaostProvider } from './Toast';

const AppProvider: React.FC = ({ children }) => (
  <AuthProvider>
    <TaostProvider>{children}</TaostProvider>
  </AuthProvider>
);

export default AppProvider;
