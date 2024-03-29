import React from 'react';
import {
  Box,
  Center,
  NativeBaseProvider,
  VStack,
  ScrollView,
  Heading,
  useTheme,
  HStack,
  StatusBar,
  Input,
  Text,
  Button,
} from 'native-base';
import {Modal} from 'react-native';
import FontIcon from 'react-native-vector-icons/FontAwesome5';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Tts from 'react-native-tts';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Later on in your styles..

export default function TabMenu2({navigation}) {
  const [showMenu, setShowMenu] = React.useState(false);
  const [busNumber, setBusNumber] = React.useState(0);
  const [modalBusNumber, setModalBusNumber] = React.useState(false);
  const [busId, setBusId] = React.useState(0);
  const [user_id, setUserId] = React.useState(0);
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      retrieveUser();
      Tts.stop();
      Tts.speak('You are in menu page.');
      Tts.speak(
        'The menu list are trip schedules, track buses, profile and lastly logout',
      );
    });

    return unsubscribe;
  }, [navigation]);
  React.useEffect(() => {
    retrieveUser();
  }, [1]);
  const retrieveUser = async () => {
    try {
      const valueString = await AsyncStorage.getItem('user_details');
      if (valueString != null) {
        const value = JSON.parse(valueString);
        console.log(value);
        setUserId(value.user_id);
      } else {
        console.log('login');
      }
      //setUserID(value.user_fname);
    } catch (error) {
      console.log(error);
    }
  };
  const getBusDetail = () => {
    console.log('test');
    const formData = new FormData();
    formData.append('user_id', user_id);
    fetch(window.name + 'getBusDetails.php', {
      method: 'POST',
      headers: {
        Accept: 'applicatiion/json',
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.array_data != '') {
          var o = responseJson.array_data[0];
          setBusId(o.bus_id);
          setModalBusNumber(false);
        } else {
          setModalBusNumber(true);
        }
        console.log(responseJson);
      })
      .catch(error => {
        console.log(error);
        //  Alert.alert('Internet Connection Error');
      });
  };
  return (
    <NativeBaseProvider>
      <StatusBar backgroundColor="#2f46c6" barStyle="light-content" />
      <ScrollView
        style={{
          width: '100%',
          height: '100%',
        }}>
        <VStack bg="#2f46c6">
          <TouchableOpacity
            onPress={() => {
              Tts.stop();
              Tts.speak('TRIP SCHEDULES');
              navigation.navigate('Driver Trip Schedule', {
                user_id: user_id,
              });
            }}>
            <Box
              style={{
                width: '100%',
                height: 200,
                borderColor: '#dd302f',
                borderBottomWidth: 1,
                justifyContent: 'center',
              }}>
              <HStack
                style={{
                  width: '100%',
                  height: '100%',
                  textAlign: 'justify',
                }}>
                <Center w="89%">
                  <Text color="white" fontSize="4xl">
                    TRIP SCHEDULES
                  </Text>
                </Center>
                <Center>
                  <Text fontSize="4xl">
                    <FontIcon name="chevron-right" color="white" size={50} />
                  </Text>
                </Center>
              </HStack>
            </Box>
          </TouchableOpacity>
          {/* <TouchableOpacity
            onPress={() => {
              Tts.stop();
              navigation.navigate('Track Passenger', {
                user_id: user_id,
              });
              Tts.speak('Track Passenger');
            }}>
            <Box
              style={{
                width: '100%',
                height: 200,
                borderColor: '#dd302f',
                borderBottomWidth: 1,
                justifyContent: 'center',
              }}>
              <HStack
                style={{
                  width: '100%',
                  height: '100%',
                  textAlign: 'justify',
                }}>
                <Center w="89%">
                  <Text fontSize="4xl" color="white">
                    TRACK PASSENGER
                  </Text>
                </Center>
                <Center>
                  <Text fontSize="4xl">
                    <FontIcon name="chevron-right" color="white" size={50} />
                  </Text>
                </Center>
              </HStack>
            </Box>
          </TouchableOpacity> */}

          <TouchableOpacity
            onPress={() => {
              Tts.stop();
              navigation.navigate('Profile');
              Tts.speak('PROFILE');
            }}>
            <Box
              style={{
                width: '100%',
                height: 200,
                borderColor: '#dd302f',
                borderBottomWidth: 1,
                justifyContent: 'center',
              }}>
              <HStack
                style={{
                  width: '100%',
                  height: '100%',
                  textAlign: 'justify',
                }}>
                <Center w="89%">
                  <Text fontSize="4xl" color="white">
                    PROFILE
                  </Text>
                </Center>
                <Center>
                  <Text fontSize="4xl">
                    <FontIcon name="chevron-right" color="white" size={50} />
                  </Text>
                </Center>
              </HStack>
            </Box>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              Tts.stop();
              AsyncStorage.removeItem('user_details');
              navigation.navigate('Login');
              Tts.speak('Logging out.');
            }}>
            <Box
              style={{
                width: '100%',
                height: 200,
                borderColor: '#dd302f',
                borderBottomWidth: 1,
                justifyContent: 'center',
              }}>
              <HStack
                style={{
                  width: '100%',
                  height: '100%',
                  textAlign: 'justify',
                }}>
                <Center w="89%">
                  <Text fontSize="4xl" color="white">
                    LOG OUT
                  </Text>
                </Center>
                <Center>
                  <Text fontSize="4xl">
                    <FontIcon name="chevron-right" color="white" size={50} />
                  </Text>
                </Center>
              </HStack>
            </Box>
          </TouchableOpacity>
        </VStack>
      </ScrollView>
      <Modal
        style={{
          justifyContent: 'center',
        }}
        animationType="fade"
        transparent={true}
        visible={false}>
        <Box style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Center bg="#2a2a2ab8" width="100%" height="100%">
            <Box
              bg="white"
              width="80%"
              height={240}
              padding={5}
              borderRadius={5}>
              <Text fontSize="2xl">BUS NUMBER</Text>
              <Input
                value={busNumber}
                onChangeText={text => setBusNumber(text)}
                variant="filled"
                style={{
                  color: 'white',
                  backgroundColor: '#0033c491',
                  height: 80,
                  fontSize: 50,
                }}
                placeholder="Bus #"
                placeholderTextColor="white"
              />

              <Button
                onPress={() => {
                  getBusDetail();
                }}
                size="lg"
                mt={3}>
                <Text fontWeight="bold" color="white" fontSize="lg">
                  SUBMIT
                </Text>
              </Button>
            </Box>
          </Center>
        </Box>
      </Modal>
    </NativeBaseProvider>
  );
}
