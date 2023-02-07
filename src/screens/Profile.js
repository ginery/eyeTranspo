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
  VStack,
  FormControl,
  Input,
  Button,
} from 'native-base';
import Rating from 'react-native-easy-rating';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Tts from 'react-native-tts';
export default function Profile({navigation}) {
  const [user_id, setUserId] = React.useState(0);
  const [userFullName, setUserFullName] = React.useState('');
  const [userFname, setUserFname] = React.useState('');
  const [userLname, setUserLname] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const retrieveData = async () => {
    try {
      const valueString = await AsyncStorage.getItem('user_details');
      // console.log(valueString);
      const value = JSON.parse(valueString);
      if (value == null) {
        console.log('empty');
      } else {
        // console.log(value);
        setUserId(value.user_id);
        setUserFullName(value.user_fname + ' ' + value.user_lname);
      }
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      retrieveData();
      //console.log('refreshed_home');
      Tts.stop();
      Tts.speak('You are in profile.');

      // retrieveIp();
      // setModalShow(true);
    });

    return unsubscribe;
  }, [navigation]);
  const updateProfile = () => {
    setLoadingModal(true);
    const formData = new FormData();
    formData.append('user_id', user_id);
    formData.append('fname', userFname);
    formData.append('lname', userLname);
    formData.append('username', username);
    formData.append('password', password);
    fetch(window.name + 'updateProfile.php', {
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
      })
      .catch(error => {
        Tts.speak('Internet Connection Error');
        console.error(error);

        //  Alert.alert('Internet Connection Error');
      });
  };
  return (
    <NativeBaseProvider>
      <Center flex={1} px="3" pt="3">
        <Box alignItems="center" h="100%" w="100%">
          <Box
            h="100%"
            w="100%"
            // maxW="80"
            rounded="lg"
            overflow="hidden"
            borderColor="coolGray.200"
            borderWidth="1"
            _dark={{
              borderColor: 'coolGray.600',
              backgroundColor: 'gray.700',
            }}
            _web={{
              shadow: 2,
              borderWidth: 0,
            }}
            _light={{
              backgroundColor: 'gray.50',
            }}>
            <Stack p="4" space={3}>
              <Stack space={2}>
                <Heading size="2xl" ml="-1">
                  {userFullName}
                </Heading>
                <Text
                  fontSize="xs"
                  _light={{
                    color: 'violet.500',
                  }}
                  _dark={{
                    color: 'violet.400',
                  }}
                  fontWeight="500"
                  ml="-0.5"
                  mt="-1"></Text>
              </Stack>
              <Center w="100%">
                <Box safeArea p="2" w="100%">
                  <VStack space={3} mt="2">
                    <FormControl bg="white">
                      <Input
                        variant="filled"
                        style={{
                          color: 'white',
                          backgroundColor: '#0033c491',
                          borderRadius: 15,
                          height: 80,
                          fontSize: 50,
                        }}
                        w="100%"
                        value={userFname}
                        onChangeText={text => setUserFname(text)}
                        placeholder="First Name"
                        placeholderTextColor="white"
                        onPressIn={() => {
                          Tts.stop();
                          Tts.speak('Please update your first name here.');
                        }}
                      />
                    </FormControl>
                    <FormControl bg="white">
                      <Input
                        variant="filled"
                        style={{
                          color: 'white',
                          backgroundColor: '#0033c491',
                          borderRadius: 15,
                          height: 80,
                          fontSize: 50,
                        }}
                        w="100%"
                        value={userLname}
                        onChangeText={text => setUserLname(text)}
                        placeholder="Last Name"
                        placeholderTextColor="white"
                        onPressIn={() => {
                          Tts.stop();
                          Tts.speak('Please update your last name here.');
                        }}
                      />
                    </FormControl>
                    <FormControl bg="white">
                      <Input
                        variant="filled"
                        style={{
                          color: 'white',
                          backgroundColor: '#0033c491',
                          borderRadius: 15,
                          height: 80,
                          fontSize: 50,
                        }}
                        w="100%"
                        value={username}
                        onChangeText={text => setUsername(text)}
                        placeholder="Username"
                        placeholderTextColor="white"
                        onPressIn={() => {
                          Tts.stop();
                          Tts.speak('Please update your username here.');
                        }}
                      />
                    </FormControl>
                    <FormControl bg="white">
                      <Input
                        variant="filled"
                        style={{
                          color: 'white',
                          backgroundColor: '#0033c491',
                          borderRadius: 15,
                          height: 80,
                          fontSize: 50,
                        }}
                        w="100%"
                        type="passowrd"
                        value={password}
                        onChangeText={text => setPassword(text)}
                        placeholder="Password"
                        placeholderTextColor="white"
                        onPressIn={() => {
                          Tts.stop();
                          Tts.speak('Please update your password here.');
                        }}
                      />
                    </FormControl>
                    <Button
                      style={{
                        height: 80,
                      }}
                      mt="2"
                      onPress={() => {
                        Tts.stop();
                        updateProfile();
                      }}
                      bgColor="#f25655"
                      bg="#dd302f"
                      _text={{color: 'white', fontSize: 30}}>
                      Save Changes
                    </Button>
                  </VStack>
                </Box>
              </Center>
              <HStack
                alignItems="center"
                space={4}
                justifyContent="space-between"></HStack>
            </Stack>
          </Box>
        </Box>
      </Center>
    </NativeBaseProvider>
  );
}
