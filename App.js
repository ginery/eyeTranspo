import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import DrawerNavigator from './src/components/DrawerNavigation';
import {NativeBaseProvider, Text} from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {navigationRef} from './src/components/RootNavigation';
import * as RootNavigation from './src/components/RootNavigation';
// import Geolocation from '@react-native-community/geolocation';
import {PermissionsAndroid} from 'react-native';
// Geolocation.getCurrentPosition(info => console.log(info));
import Geolocation from 'react-native-geolocation-service';

// local connection
// window.name = 'http://192.168.57.94/kinaiya/mobile/';
// global.global_image = 'http://192.168.57.94/kinaiya/images/';
// online connection
// window.name = 'https://trisakay.tech/mobile/';

export default function App() {
  return (
    <NativeBaseProvider>
      <NavigationContainer ref={navigationRef}>
        <DrawerNavigator />
      </NavigationContainer>
    </NativeBaseProvider>
  );
}
