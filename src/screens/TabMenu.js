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
} from 'native-base';
import {Text} from 'react-native';
import FontIcon from 'react-native-vector-icons/FontAwesome5';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Tts from 'react-native-tts';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Later on in your styles..

export default function TabMenu({navigation}) {
  const [showMenu, setShowMenu] = React.useState(false);
  const [user_id, set_user_id] = React.useState(0);
  const [bus_id, setBusId] = React.useState(0);
  const [trip_id, setTripId] = React.useState(0);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      retrieveUser();
      //console.log('refreshed_home');
      Tts.stop();
      Tts.speak('You are in menu page.');

      // retrieveIp();
      // setModalShow(true);
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
        // console.log(value);
        set_user_id(value.user_id);
        checkTransactionStatus(value.user_id);
      } else {
        console.log('login');
      }
      //setUserID(value.user_fname);
    } catch (error) {
      console.log(error);
    }
  };
  const checkTransactionStatus = user_id => {
    console.log(user_id);
    const formData = new FormData();
    formData.append('user_id', user_id);
    fetch(window.name + 'getTransactionStatus.php', {
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
        if (responseJson.array_data != '') {
          if (responseJson.array_data[0].status == 1) {
            setBusId(responseJson.array_data[0].bus_id);
            setTripId(responseJson.array_data[0].trip_id);

            setShowMenu(true);
            Tts.speak(
              'The menu list are track buses, profile and lastly logout',
            );
          } else {
            Tts.speak(
              'The menu list are trip schedule, profile and lastly logout',
            );
            setShowMenu(false);
          }
          // getTripDetails(responseJson.array_data[0].response);
        }
      })
      .catch(error => {
        Tts.speak('Internet Connection Error');
        console.error(error, 'getTransactionStatus');

        //  Alert.alert('Internet Connection Error');
      });
  };
  const setItemStorage = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      // Error saving data
    }
  };
  const getTripDetails = trip_id => {
    const formData = new FormData();
    formData.append('trip_id', trip_id);
    fetch(window.name + 'getTripDetails.php', {
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
        if (responseJson.array_data != '') {
          var o = responseJson.array_data[0];
          var destination = o.destination.split(',');
          // setItemStorage('user_destination', {
          //   user_id: user_id,
          //   trip_id: o.trip_id,
          //   d_lat: destination[0],
          //   d_long: destination[1],
          //   bus_number: o.bus_number,
          //   bus_id: o.bus_id,
          //   date_arrived: o.date_arrived,
          //   date_departed: o.date_departed,
          //   bus_route: o.bus_route,
          //   conductor_id: o.conductor_id,
          // });
          setShowMenu(true);
        }
      })
      .catch(error => {
        Tts.speak('Internet Connection Error');
        console.error(error);
        setButtonStatus(false);
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
          {showMenu == false && (
            <>
              <TouchableOpacity
                onPress={() => {
                  Tts.stop();
                  Tts.speak('TRIP SCHEDULES');
                  navigation.navigate('Trip Schedule');
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
                      <Text
                        style={{
                          fontSize: 50,
                          color: 'white',
                        }}>
                        TRIP SCHEDULES
                      </Text>
                    </Center>
                    <Center>
                      <Text
                        style={{
                          fontSize: 50,
                        }}>
                        <FontIcon
                          color="white"
                          name="chevron-right"
                          size={50}
                        />
                      </Text>
                    </Center>
                  </HStack>
                </Box>
              </TouchableOpacity>
            </>
          )}
          {showMenu == true && (
            <>
              <TouchableOpacity
                onPress={() => {
                  Tts.stop();
                  navigation.navigate('Track Buses', {
                    bus_id: bus_id,
                    trip_id: trip_id,
                    user_id: user_id,
                  });
                  Tts.speak('TRACK BUSES');
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
                      <Text
                        style={{
                          fontSize: 50,
                          color: 'white',
                        }}>
                        TRACK BUSES
                      </Text>
                    </Center>
                    <Center>
                      <Text
                        style={{
                          fontSize: 50,
                        }}>
                        <FontIcon
                          color="white"
                          name="chevron-right"
                          size={50}
                        />
                      </Text>
                    </Center>
                  </HStack>
                </Box>
              </TouchableOpacity>
            </>
          )}
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
                  <Text
                    style={{
                      fontSize: 50,
                      color: 'white',
                    }}>
                    PROFILE
                  </Text>
                </Center>
                <Center>
                  <Text
                    style={{
                      fontSize: 50,
                    }}>
                    <FontIcon color="white" name="chevron-right" size={50} />
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
                  <Text
                    style={{
                      fontSize: 50,
                      color: 'white',
                    }}>
                    LOG OUT
                  </Text>
                </Center>
                <Center>
                  <Text
                    style={{
                      fontSize: 50,
                    }}>
                    <FontIcon color="white" name="chevron-right" size={50} />
                  </Text>
                </Center>
              </HStack>
            </Box>
          </TouchableOpacity>
        </VStack>
      </ScrollView>
    </NativeBaseProvider>
  );
}
