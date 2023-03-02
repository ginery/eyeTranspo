import * as React from 'react';
import {
  View,
  useWindowDimensions,
  Alert,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import {NativeBaseProvider, Center, Spinner} from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  BallIndicator,
  BarIndicator,
  DotIndicator,
  MaterialIndicator,
  PacmanIndicator,
  PulseIndicator,
  SkypeIndicator,
  UIActivityIndicator,
  WaveIndicator,
} from 'react-native-indicators';
// import {useNavigation} from '@react-navigation/native';
export default function LandingScreen({navigation}) {
  // const navigation = useNavigation();
  // React.useEffect(() => {
  //   retrieveData();
  // }, [1]);
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('refreshed_home');
      retrieveData();
    });

    return unsubscribe;
  }, [navigation]);
  const retrieveData = async () => {
    try {
      const valueString = await AsyncStorage.getItem('user_details');

      if (valueString != null) {
        const value = JSON.parse(valueString);
        // console.log(value);
        checkIfVerified(value.user_id, value.category);
        // if (value.category == 'U') {
        //   console.log('user');
        //   navigation.navigate('Verify');
        // } else if (value.category == 'C') {
        //   navigation.navigate('Verify');
        // }
      } else {
        console.log('login');
        // navigate('Login');
        navigation.navigate('Login');
      }

      //setUserID(value.user_fname);
    } catch (error) {
      console.log(error);
    }
  };
  const checkIfVerified = (user_id, category) => {
    const formData = new FormData();
    formData.append('user_id', user_id);
    fetch(window.name + 'checkIfVerified.php', {
      method: 'POST',
      header: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        if (responseJson.array_data != '') {
          if (responseJson.array_data[0].response == 'A') {
            if (category == 'U') {
              navigation.replace('Tab View');
            } else if (category == 'C') {
              navigation.navigate('Tab View 2');
            } else {
              navigation.replace('Verify');
            }
          } else {
            navigation.replace('Verify');
          }
        } else {
          navigation.replace('Login');
        }
      })
      .catch(error => {
        console.error(error);
        Alert.alert('Internet Connection Error');
      });
  };
  return (
    <NativeBaseProvider>
      <Center flex={1} px="3">
        {/* <Spinner accessibilityLabel="Loading posts" size="lg" color="#ad8765" /> */}
        <BallIndicator color="#2e47c8" count={8} size={40} />
      </Center>
    </NativeBaseProvider>
  );
}
