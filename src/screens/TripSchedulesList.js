/**
 * Made by: ginx - juancoder
 */

import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
  Alert,
  RefreshControl,
  Image,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from 'react-native';

import MapView, {
  enableLatestRenderer,
  PROVIDER_GOOGLE,
  Marker,
  Circle,
} from 'react-native-maps';
// import Geolocation from '@react-native-community/geolocation';

import Geolocation from 'react-native-geolocation-service';
import {
  Box,
  Heading,
  Avatar,
  HStack,
  VStack,
  Text,
  Spacer,
  Center,
  NativeBaseProvider,
  Button,
  Actionsheet,
  Progress,
  useDisclose,
  useToast,
  FlatList,
  Container,
  AspectRatio,
  Stack,
  Divider,
  Badge,
} from 'native-base';
import Rating from 'react-native-easy-rating';
import {useNavigation} from '@react-navigation/native';
import ProgressBar from 'react-native-animated-progress';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Tts from 'react-native-tts';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
enableLatestRenderer();
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: '100%',
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    // borderWidth: 1,
    // borderColor: 'black',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default function TripScheduleListScreen({navigation, route}) {
  // const navigation = useNavigation();
  const toast = useToast();
  const [refreshing, setRefreshing] = React.useState(false);
  const [modalVisible, setModalVisible] = React.useState(false);

  const {cardinal_directions} = route.params;
  const [latitude, setLatitude] = React.useState(0);
  const [longitude, setLongitude] = React.useState(0);
  const [busNumber, setBusNumber] = React.useState(0);
  const [user_id, set_user_id] = React.useState(0);
  const [buttonEnable, setButtonEnable] = React.useState(false);
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      Tts.stop();
      //console.log('refreshed_home');
      getCurrentLocationMap();
      retrieveUser();
      Tts.speak('You are in trip schedule page.');
      data.map((item, index) => {
        // console.log(item.fullName);
        Tts.speak(
          'Bus number ' + item.fullName + ' where going to ' + item.recentText,
        );
      });

      // retrieveIp();
      // setModalShow(true);
    });

    return unsubscribe;
  }, [navigation]);
  const getCurrentLocationMap = () => {
    Geolocation.getCurrentPosition(info => {
      // console.log(info);
      setLatitude(info.coords.latitude);
      setLongitude(info.coords.longitude);
    });
  };
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
        set_user_id(value.user_id);

        // console.log(value.user_id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    setTimeout(function () {
      setRefreshing(false);
    }, 1000);
  }, []);
  const data = [
    {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
      fullName: '5809',
      timeStamp: '12:47 PM',
      recentText: 'Bacolod City',
      avatarUrl:
        'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
      fullName: '3028',
      timeStamp: '11:11 PM',
      recentText: 'Bago City',
      avatarUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyEaZqT3fHeNrPGcnjLLX1v_W4mvBlgpwxnA&usqp=CAU',
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      fullName: '6899',
      timeStamp: '6:22 PM',
      recentText: 'Sagay City',
      avatarUrl: 'https://miro.medium.com/max/1400/0*0fClPmIScV5pTLoE.jpg',
    },
    {
      id: '68694a0f-3da1-431f-bd56-142371e29d72',
      fullName: '5897',
      timeStamp: '8:56 PM',
      recentText: 'San Carlos City',
      avatarUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSr01zI37DYuR8bMV5exWQBSw28C1v_71CAh8d7GP1mplcmTgQA6Q66Oo--QedAN1B4E1k&usqp=CAU',
    },
    {
      id: '28694a0f-3da1-471f-bd96-142456e29d72',
      fullName: '5322',
      timeStamp: '12:47 PM',
      recentText: 'Silay City',
      avatarUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBwgu1A5zgPSvfE83nurkuzNEoXs9DMNr8Ww&usqp=CAU',
    },
  ];

  return (
    <NativeBaseProvider safeAreaTop>
      <Box p={5}>
        <Heading fontSize="4xl" p="4" pb="3">
          Trip Schedules
        </Heading>
        <FlatList
          data={data}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() => {
                Tts.stop();
                Tts.speak(
                  'You are selected a BUS with a number ' +
                    item.fullName +
                    'going to' +
                    item.recentText +
                    '. Alright, please pin your destination.',
                );
                // Tts.speak('Hello, world!', {
                //   androidParams: {
                //     KEY_PARAM_PAN: -1,
                //     KEY_PARAM_VOLUME: 5,
                //     KEY_PARAM_STREAM: 'STREAM_MUSIC',
                //   },
                // });
                setBusNumber(item.fullName);
                setModalVisible(true);
                // navigation.navigate('Track Buses');
              }}>
              <Box
                borderRadius={10}
                borderWidth="1"
                mb={1}
                _dark={{
                  borderColor: 'muted.50',
                }}
                borderColor="muted.800"
                pl={3}
                pr={3}
                py="2">
                <HStack space={[2, 3]} justifyContent="space-between">
                  <VStack>
                    <Text
                      fontSize="3xl"
                      _dark={{
                        color: 'warmGray.50',
                      }}
                      color="coolGray.800"
                      bold>
                      BUS #: {item.fullName}
                    </Text>
                    <Text
                      fontSize="2xl"
                      color="coolGray.600"
                      _dark={{
                        color: 'warmGray.200',
                      }}>
                      {item.recentText}
                    </Text>
                  </VStack>
                  <Spacer />
                  {/* <Text
                  fontSize="xs"
                  _dark={{
                    color: 'warmGray.50',
                  }}
                  color="coolGray.800"
                  alignSelf="flex-start">
                  {item.timeStamp}
                </Text> */}
                </HStack>
              </Box>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.id}
        />
      </Box>
      <Center width="100%" bg="emerald.100">
        {cardinal_directions}
      </Center>
      <Box
        p={2}
        style={{
          // borderColor: 'black',
          // borderWidth: 1,
          height: '91%',
        }}>
        <Modal
          style={{
            justifyContent: 'center',
          }}
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
          <Box
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Center bg="#2a2a2ab8" width="100%" height="100%">
              <Center width="100%" height="50%" borderRadius={5}>
                <Box alignItems="center" width="90%">
                  <Box
                    width="100%"
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
                    <TouchableOpacity
                      onPress={() => {
                        setModalVisible(!modalVisible);
                      }}>
                      <Box>
                        <Center
                          bg="#e99340"
                          _dark={{
                            bg: '#e99340',
                          }}
                          _text={{
                            color: 'warmGray.50',
                            fontWeight: '700',
                            fontSize: 'xs',
                          }}
                          position="absolute"
                          // bottom="0"
                          top="0"
                          right="0"
                          px="3"
                          py="1.5">
                          X
                        </Center>
                      </Box>
                    </TouchableOpacity>
                    <Stack p="4" space={3}>
                      <Stack space={2}>
                        <Heading size="md" ml="-1">
                          Search Destination
                        </Heading>
                      </Stack>
                      {/*
                      <Center
                        w="100%"
                        h="80%"
                        borderColor="#e99340"
                        borderWidth={2}>
                        <View style={styles.container}>
                          <MapView
                            provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                            style={styles.map}
                            region={{
                              latitude: latitude,
                              longitude: longitude,
                              latitudeDelta: 0.015,
                              longitudeDelta: 0.0121,
                            }}>
                          
                            <Marker
                              draggable
                              onDragEnd={e => {
                                console.log(
                                  'dragEnd',
                                  e.nativeEvent.coordinate,
                                );
                                setDestination(e.nativeEvent.coordinate);
                              }}
                              tracksViewChanges={false}
                              zIndex={3}
                              coordinate={{
                                latitude: parseFloat(latitude),
                                longitude: parseFloat(longitude),
                              }}>
                              <Center w="100%">
                                <Image
                                  source={require('../assets/images/logo_1.png')}
                                  style={{
                                    width: 86,
                                    height: 88,
                                  }}
                                  resizeMode="contain"
                                />
                              </Center>
                            </Marker>
                          </MapView>
                        </View> 
                      </Center>*/}
                      <Center w="100%" h="80%">
                        <GooglePlacesAutocomplete
                          GooglePlacesDetailsQuery={{fields: 'geometry'}}
                          fetchDetails={true} // you need this to fetch the details object onPress
                          styles={{
                            container: {
                              flex: 1,
                              // borderColor: 'black',
                              // borderWidth: 1,
                              width: '100%',
                            },
                          }}
                          enablePoweredByContainer={true}
                          placeholder="Search destination here"
                          onPress={(data, details = null) => {
                            // 'details' is provided when fetchDetails = true
                            console.log(details?.geometry?.location.lat);
                            setItemStorage('user_destination', {
                              user_id: user_id,
                              d_lat: details?.geometry?.location.lat,
                              d_long: details?.geometry?.location.lng,
                              bus_number: busNumber,
                            });
                            setButtonEnable(true);
                          }}
                          query={{
                            key: 'AIzaSyDoePlR12j4XnPgKCc0YWpI_7rtI6TPNms',
                            language: 'en',
                          }}
                        />
                      </Center>
                    </Stack>
                    <Center marginBottom={10}>
                      {buttonEnable == true && (
                        <Button
                          onPress={() => {
                            navigation.navigate('Track Buses');
                          }}
                          size="lg">
                          SET DESTINATION
                        </Button>
                      )}
                    </Center>
                  </Box>
                </Box>
              </Center>
            </Center>
          </Box>
        </Modal>
      </Box>
    </NativeBaseProvider>
  );
}
