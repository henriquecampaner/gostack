import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Profile from '../pages/Profile';
import Dashboard from '../pages/Dashboard';
import AppointmentCreated from '../pages/AppointmentCreated';
import CreateAppointment from '../pages/CreateAppointment';

const App = createStackNavigator();

const AppRoutes: React.FC = () => (
  <App.Navigator
    screenOptions={{
      headerShown: false,
      cardStyle: { backgroundColor: '#312e38' },
    }}
  >
    {/* Appointment Flux */}
    <App.Screen name="Dashboard" component={Dashboard} />
    <App.Screen name="AppointmentCreated" component={AppointmentCreated} />
    <App.Screen name="CreateAppointment" component={CreateAppointment} />

    {/* Profile */}
    <App.Screen name="Profile" component={Profile} />
  </App.Navigator>
);

export default AppRoutes;
