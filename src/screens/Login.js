/**
 * Made by: ginx - juancoder
 */

import * as React from 'react';
import {
  Center,
  NativeBaseProvider,
  Input,
  Icon,
  Stack,
  Text,
  Button,
  Image,
  HStack,
  Heading,
  Spinner,
  StatusBar,
  useToast,
  Box,
  TextArea,
} from 'native-base';
import FontIcon from 'react-native-vector-icons/FontAwesome5';
import {View} from 'react-native';
import {background, buttonStyle} from 'styled-system';
import {
  TouchableOpacity,
  Alert,
  ImageBackground,
  Modal,
  ActivityIndicator,
  Vibration,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Tts from 'react-native-tts';
export default function App({navigation, route}) {
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      //console.log('refreshed_home');
      Tts.speak('You are in login page.');
      setButtonStatus(false);
      setUsername('');
      setPassword('');
      retrieveUser();
      // retrieveIp();
      // setModalShow(true);
    });

    return unsubscribe;
  }, [navigation]);
  const toast = useToast();
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [buttonStatus, setButtonStatus] = React.useState(false);
  const [modalShow, setModalShow] = React.useState(false);
  const [ipAddress, setIpAddress] = React.useState('');
  const setItemStorage = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      // Error saving data
    }
  };

  const retrieveUser = async () => {
    try {
      const valueString = await AsyncStorage.getItem('user_details');
      if (valueString != null) {
        const value = JSON.parse(valueString);

        console.log('user');
        navigation.navigate('Tab View');
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
  const retrieveIp = async () => {
    try {
      const valueString = await AsyncStorage.getItem('local_ip');
      if (valueString != null) {
        const value = JSON.parse(valueString);
        console.log(value);
        if (value.ip_address == '') {
          setModalShow(true);
        } else {
          setModalShow(true);
          window.name = 'http://' + value.ip_address + '/kinaiya/mobile/';
          global.global_image =
            'http://' + value.ip_address + '/kinaiya/images/';
          setIpAddress(value.ip_address);
        }
      } else {
        setModalShow(true);
      }

      //setUserID(value.user_fname);
    } catch (error) {
      console.log(error);
    }
  };
  const login = () => {
    setButtonStatus(true);
    if (username == '') {
      Tts.speak('Please fillout the username.');
      Vibration.vibrate(0.5 * 1000);
      setButtonStatus(false);
    } else if (password == '') {
      Tts.speak('Please fillout the password.');
      Vibration.vibrate(0.5 * 1000);
      setButtonStatus(false);
    } else {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);
      fetch(window.name + 'login.php', {
        method: 'POST',
        headers: {
          Accept: 'applicatiion/json',
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      })
        .then(response => response.json())
        .then(responseJson => {
          console.log(responseJson);
          var data = responseJson.array_data[0];
          if (data.response == 1) {
            Tts.speak('Signing in. Please wait.');
            toast.show({
              render: () => {
                return (
                  <Box bg="emerald.500" px="2" py="1" rounded="sm" mb={5}>
                    <Text color="white">Great! Please Wait.</Text>
                  </Box>
                );
              },
            });
            setItemStorage('user_details', {
              user_id: data.user_id,
              user_fname: data.user_fname,
              user_lname: data.user_lname,
            });
            setButtonStatus(true);
            setTimeout(function () {
              navigation.navigate('Tab View');
            }, 1000);
          } else if (data.response == -1) {
            Tts.speak('Signing in. Please wait.');
            toast.show({
              render: () => {
                return (
                  <Box bg="error.500" px="2" py="1" rounded="sm" mb={5}>
                    <Text color="white">Sorry! Account doesn't exist.</Text>
                  </Box>
                );
              },
            });
          } else if (data.response == 0) {
            setButtonStatus(false);
            Tts.speak(
              'Aw snap! username or pasword is not right. Please try again.',
            );
            Vibration.vibrate(2 * 1000);
            toast.show({
              render: () => {
                return (
                  <Box bg="error.500" px="2" py="1" rounded="sm" mb={5}>
                    <Text color="white">
                      Aw snap! username or pasword is not right. Please try
                      again.
                    </Text>
                  </Box>
                );
              },
            });
          }
          console.log(data);
        })
        .catch(error => {
          console.error(error);
          //  Alert.alert('Internet Connection Error');
        });
    }

    // Alert.alert(username);
  };
  const setIp = () => {
    setItemStorage('local_ip', {
      ip_address: ipAddress,
    });
    setModalShow(false);
  };
  return (
    <NativeBaseProvider>
      {/* <ImageBackground
        source={require('../assets/images/login_bg.png')}
        resizeMode="cover"
        style={{flex: 1, justifyContent: 'center'}}> */}
      <StatusBar backgroundColor="#ad8765" barStyle="light-content" />
      <Center
        flex={1}
        px="3"
        style={{
          borderColor: 'black',
          borderWidth: 1,
        }}>
        <Image
          style={{
            // borderColor: 'black',
            // borderWidth: 1,
            width: 350,
            height: 80,
            resizeMode: 'stretch',
          }}
          size="lg"
          source={require('../assets/images/eyetranspo_banner.png')}
          alt="Alternate Text"
        />

        <Stack
          space={4}
          w="100%"
          maxWidth="300"
          style={{
            padding: 5,
            // borderColor: 'black',
            // borderWidth: 1,
          }}>
          <Input
            variant="filled"
            style={{
              color: '#606060',
              backgroundColor: 'rgba(255, 217, 180, 0.45)',
              height: 80,
              fontSize: 50,
            }}
            value={username}
            onChangeText={text => setUsername(text)}
            // InputLeftElement={
            //   <Icon
            //     as={<FontIcon name="user" />}
            //     size={5}
            //     ml="2"
            //     color="white"
            //   />
            // }
            onPressIn={() => {
              Tts.stop();
              Tts.speak('Please Enter your username here.');
            }}
            placeholder="Username"
            placeholderTextColor="#606060"
          />
          <Input
            variant="filled"
            style={{
              color: '#606060',
              backgroundColor: 'rgba(255, 217, 180, 0.45)',
              height: 80,
              fontSize: 50,
            }}
            value={password}
            onPressIn={() => {
              Tts.stop();
              Tts.speak('Please Enter your password here.');
            }}
            onChangeText={text => setPassword(text)}
            type="password"
            // InputLeftElement={
            //   <Icon
            //     as={<FontIcon name="lock" />}
            //     size={5}
            //     ml="2"
            //     color="white"
            //   />
            // }
            placeholder="Password"
            placeholderTextColor="#606060"
          />
          <Button
            style={{
              height: 80,
            }}
            // borderRadius={20}
            disabled={buttonStatus}
            onPress={() => {
              Tts.stop();
              login();
            }}
            bgColor="#e99340"
            _text={{color: 'white'}}
            //  endIcon={<Icon as={<FontIcon name="sign-in-alt" />} size="5" />}>
          >
            <HStack space={2} alignItems="center">
              {buttonStatus == true && (
                <Spinner
                  accessibilityLabel="Loading posts"
                  size="lg"
                  color="white"
                />
              )}

              <Heading
                color="white"
                style={{
                  fontSize: 30,
                }}>
                {buttonStatus ? 'Loading' : 'SIGN IN'}
              </Heading>
              {buttonStatus == false && (
                <Icon
                  as={<FontIcon name="sign-in-alt" />}
                  size="30"
                  color="white"
                />
              )}
            </HStack>
          </Button>
          <HStack
            space={1}
            alignItems="center"
            style={{
              //   borderColor: 'black',
              //   borderWidth: 1,
              //   backgroundColor: '#8b8b8b',
              justifyContent: 'center',
              alignItems: 'center',

              //   height: 100,
            }}>
            <Text style={{color: 'gray', fontSize: 25, padding: 5}}>
              Don't have an account?
            </Text>

            <TouchableOpacity
              onPress={() => {
                Tts.speak('Sign up.');
                navigation.navigate('Register');
              }}>
              <Text
                style={{
                  color: '#e99340',
                  borderBottomWidth: 1,
                  borderColor: '#e99340',
                  fontSize: 25,
                  padding: 5,
                }}>
                SIGN UP
              </Text>
            </TouchableOpacity>
          </HStack>
        </Stack>
      </Center>
      {/* </ImageBackground> */}

      <Modal
        style={{
          justifyContent: 'center',
        }}
        animationType="fade"
        transparent={true}
        visible={modalShow}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setReferenceNumber('');
          setModalShow(!modalShow);
        }}>
        <Box style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Center bg="white" width={300} height={200} borderRadius={10} p={5}>
            <Text>Enter IP address</Text>
            <Box mb={3}>
              <Input
                value={ipAddress}
                onChangeText={text => setIpAddress(text)}
                mt={3}
                w="100%"
                placeholder="IP address."
              />
            </Box>
            <Button.Group space={2}>
              {/* <Button
                variant="ghost"
                colorScheme="blueGray"
                onPress={() => {
                  setModalShow(false);
                  setReferenceNumber('');
                }}>
                Cancel
              </Button> */}
              <Button
                bgColor="#bb936f"
                bg="#ad8765"
                onPress={() => {
                  setIp();
                }}>
                Set
              </Button>
            </Button.Group>
          </Center>
        </Box>
      </Modal>
    </NativeBaseProvider>
  );
}
