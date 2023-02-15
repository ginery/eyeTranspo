import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import LandingScreen from '../screens/LandingScreen';
import Login from '../screens/Login';
import TabViewScreen from '../screens/TabMenu';
import ProfileScreen from '../screens/Profile';
import RegisterScreen from '../screens/Register';
import TripScheduleScreen from '../screens/TripSchedules';
import TripScheduleListScreen from '../screens/TripSchedulesList';
import TrackBusesScreen from '../screens/TrackBuses';
import TabMenu2 from '../screens/TabMenu2';
import DriverTripSchedule from '../screens/DriverTripSchedule';
import TrackPassengerScreen from '../screens/TrackPassenger';
import CheckVerifiedScreen from '../screens/CheckVerified';
const Stack = createStackNavigator();
const MainStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Landing"
        component={LandingScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Tab View"
        component={TabViewScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Tab View 2"
        component={TabMenu2}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="Trip Schedule"
        component={TripScheduleScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Trip Schedule List"
        component={TripScheduleListScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Track Buses"
        component={TrackBusesScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Driver Trip Schedule"
        component={DriverTripSchedule}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Track Passenger"
        component={TrackPassengerScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Verify"
        component={CheckVerifiedScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};
export {MainStackNavigator};
