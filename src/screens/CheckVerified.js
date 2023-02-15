import React from 'react';
import {
  Box,
  Heading,
  AspectRatio,
  Image,
  Text,
  Center,
  HStack,
  Stack,
  NativeBaseProvider,
  Avatar,
  Input,
  Icon,
  ScrollView,
  Button,
  useToast,
} from 'native-base';
import Rating from 'react-native-easy-rating';
import FontIcon from 'react-native-vector-icons/FontAwesome5';
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
import {
  TouchableOpacity,
  Alert,
  ImageBackground,
  ToastAndroid,
} from 'react-native';
export default function CheckVerifiedScreen({navigation}) {
  React.useEffect(() => {
    const interval = setInterval(() => {
      retrieveData();
    }, 5000);

    return () => {
      clearInterval(interval);
    }; // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  }, [navigation]);
  const retrieveData = async () => {
    try {
      const valueString = await AsyncStorage.getItem('user_details');
      //console.log(valueString);
      //console.log('test1');
      if (valueString != null) {
        const value = JSON.parse(valueString);
        // setUserID(value.user_id);
        checkIfVerified(value.user_id, value.category);
      }
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
            ToastAndroid.showWithGravity(
              'Great! your account was successfully verified.',
              ToastAndroid.SHORT,
              ToastAndroid.CENTER,
            );
            if (category == 'U') {
              navigation.replace('Tab View');
            } else if (category == 'C') {
              navigation.navigate('Tab View 2');
            } else {
              navigation.replace('Login');
            }
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
  const removeValue = async () => {
    try {
      await AsyncStorage.removeItem('user_details');
      navigation.navigate('Landing');
    } catch (e) {
      // remove error
    }

    console.log('Done.');
  };
  return (
    <NativeBaseProvider>
      <Center
        flex={1}
        px="3"
        alignItems="center"
        // borderColor="amber"
        // borderWidth={1}
      >
        <Image
          alt="gif loading"
          source={require('../assets/images/checking_img.gif')}
          style={{width: 300, height: 300}}
        />
        <Center
          style={{
            height: 100,
          }}>
          <Text fontSize="xl" textAlign="center">
            Account is not yet verified. Please wait for verification.
          </Text>
          <PacmanIndicator size={48} color="#54b5df" />
        </Center>
      </Center>
      <Center mb={5}>
        <Button
          onPress={() => {
            removeValue();
          }}
          w="80%">
          Go back to login
        </Button>
      </Center>
    </NativeBaseProvider>
  );
}
