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
} from 'native-base';
import Rating from 'react-native-easy-rating';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Tts from 'react-native-tts';
export default function Profile({navigation}) {
  const [userFullName, setUserFullName] = React.useState('');
  const retrieveData = async () => {
    try {
      const valueString = await AsyncStorage.getItem('user_details');
      // console.log(valueString);
      const value = JSON.parse(valueString);
      if (value == null) {
        console.log('empty');
      } else {
        // console.log(value);
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

  return (
    <NativeBaseProvider>
      <Center flex={1} px="3" pt="3">
        <Box alignItems="center">
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
            <Box>
              <AspectRatio w="100%" ratio={16 / 9}>
                {/* <Image
                  w="100%"
                  h={200}
                  source={require('../assets/images/bus_cover_photo.jpg')}
                  alt="image"
                  resizeMode="contain"
                /> */}
              </AspectRatio>
              <Center alignSelf="center" position="absolute" bottom="0" pb="3">
                {/* <Avatar
                  style={{
                    borderColor: 'white',
                    borderWidth: 4,
                  }}
                  w="100"
                  h="100"
                  alignSelf="center"
                  bg="amber.500"
                  source={require('../assets/images/profile.jpg')}>
                  AK
                </Avatar> */}
              </Center>
            </Box>
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
                          color: '#606060',
                          backgroundColor: 'rgba(255, 217, 180, 0.45)',
                          borderRadius: 15,
                          height: 80,
                          fontSize: 50,
                        }}
                        w="100%"
                        onChangeText={text => setFname(text)}
                        placeholder="First Name"
                        placeholderTextColor="#606060"
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
                          color: '#606060',
                          backgroundColor: 'rgba(255, 217, 180, 0.45)',
                          borderRadius: 15,
                          height: 80,
                          fontSize: 50,
                        }}
                        w="100%"
                        onChangeText={text => setFname(text)}
                        placeholder="Last Name"
                        placeholderTextColor="#606060"
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
                          color: '#606060',
                          backgroundColor: 'rgba(255, 217, 180, 0.45)',
                          borderRadius: 15,
                          height: 80,
                          fontSize: 50,
                        }}
                        w="100%"
                        onChangeText={text => setFname(text)}
                        placeholder="Username"
                        placeholderTextColor="#606060"
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
                          color: '#606060',
                          backgroundColor: 'rgba(255, 217, 180, 0.45)',
                          borderRadius: 15,
                          height: 80,
                          fontSize: 50,
                        }}
                        w="100%"
                        onChangeText={text => setFname(text)}
                        placeholder="Password"
                        placeholderTextColor="#606060"
                        onPressIn={() => {
                          Tts.stop();
                          Tts.speak('Please update your password here.');
                        }}
                      />
                    </FormControl>
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
