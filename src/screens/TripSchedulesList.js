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
import {set} from 'react-native-reanimated';
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
  const [tripScheduleData, setTripScheduleData] = React.useState([]);
  const [loadingModal, setLoadingModal] = React.useState(false);
  const [busId, setBusId] = React.useState(0);
  const [tripScheduleId, setTripScheduleId] = React.useState(0);
  const [dateDeparted, setDateDeparted] = React.useState('');
  const [dateArrival, setDateArrival] = React.useState('');
  const [busRoute, setBusRoute] = React.useState('');

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      Tts.stop();
      //console.log('refreshed_home');
      getCurrentLocationMap();
      retrieveUser();
      getTripSchedules();
      Tts.speak('You are in trip schedule page.');
      tripScheduleData.map((item, index) => {
        // console.log(item.fullName);
        Tts.speak(
          'Bus number ' + item.bus_number + ' where going to ' + item.bus_route,
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
      getTripSchedules();
      setRefreshing(false);
    }, 1000);
  }, []);

  const getTripSchedules = () => {
    setLoadingModal(true);
    const formData = new FormData();
    formData.append('headings', cardinal_directions);
    fetch(window.name + 'getTripSchedules.php', {
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
        var data = responseJson.array_data.map(function (item, index) {
          return {
            trip_id: item.trip_id,
            bus_id: item.bus_id,
            bus_number: item.bus_number,
            bus_route: item.bus_route,
            trip_schedule_id: item.trip_schedule_id,
            headings: item.headings,
            date_departed: item.date_departed,
            date_arrived: item.date_arrived,
          };
        });
        setTripScheduleData(data);
        setLoadingModal(false);
      })
      .catch(error => {
        Tts.speak('Internet Connection Error');
        console.error(error);
        setButtonStatus(false);
        setLoadingModal(false);
        //  Alert.alert('Internet Connection Error');
      });
  };
  const addTransaction = () => {};
  return (
    <NativeBaseProvider safeAreaTop>
      <Box p={5}>
        <Heading
          fontSize="4xl"
          p="4"
          pb="3"
          style={{
            borderBottomColor: 'black',
            borderBottomWidth: 1,
            borderStyle: 'dashed',
          }}
          mb={2}>
          Trip Schedules {cardinal_directions}
        </Heading>
        {tripScheduleData != '' ? (
          <FlatList
            h="85%"
            data={tripScheduleData}
            renderItem={({item}) => (
              <TouchableOpacity
                onPress={() => {
                  Tts.stop();
                  Tts.speak(
                    'You are selected a BUS with a number ' +
                      item.bus_number +
                      'going to' +
                      item.bus_route +
                      '. Alright, please search your destination.',
                  );
                  setBusId(item.bus_id);
                  setTripScheduleId(item.trip_schedule_id);
                  setDateArrival(item.date_arrived);
                  setDateDeparted(item.date_departed);
                  setBusNumber(item.bus_number);
                  setBusRoute(item.busRoute);
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
                        BUS #: {item.bus_number}
                      </Text>
                      <Text
                        fontSize="2xl"
                        color="coolGray.600"
                        _dark={{
                          color: 'warmGray.200',
                        }}>
                        {item.bus_route}
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
            refreshControl={
              <RefreshControl
                title="Pull to refresh"
                tintColor="black"
                titleColor="Black"
                colors={['#e99340']}
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }
          />
        ) : (
          <Center>No trip found...</Center>
        )}
      </Box>
      {/* <Center width="100%" bg="emerald.100">
        {cardinal_directions}
      </Center> */}
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
                              color: 'black',
                            },
                            textInput: {
                              color: 'black',
                              fontSize: 50,
                              height: 80,
                            },
                            predefinedPlacesDescription: {
                              color: 'black',
                            },
                            textInputContainer: {
                              borderColor: 'black',
                              borderWidth: 1,
                              color: 'black',
                            },
                            row: {
                              // borderColor: 'black',
                              // borderWidth: 1,
                              backgroundColor: '#FFFFFF',
                              paddingTop: 10,
                              height: 50,
                              flexDirection: 'row',
                              color: 'black',
                            },
                            listView: {color: 'black'},
                            loader: {
                              flexDirection: 'row',
                              justifyContent: 'flex-end',
                              height: 20,
                              color: 'black',
                            },
                          }}
                          renderRow={rowData => {
                            const title =
                              rowData.structured_formatting.main_text;
                            const address =
                              rowData.structured_formatting.secondary_text;
                            return (
                              <HStack>
                                <Text
                                  style={{
                                    paddingTop: 10,
                                    fontSize: 30,
                                    height: 50,
                                    // borderColor: 'black',
                                    // borderWidth: 1,
                                  }}>
                                  {title}{' '}
                                </Text>
                                <Text
                                  style={{
                                    paddingTop: 10,
                                    fontSize: 30,
                                    height: 50,
                                    // borderColor: 'black',
                                    // borderWidth: 1,
                                  }}>
                                  {address}
                                </Text>
                              </HStack>
                            );
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
                              bus_id: busId,
                              trip_schedule_id: tripScheduleId,
                              date_arrived: dateArrival,
                              date_departed: dateDeparted,
                              bus_route: busRoute,
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
        <Modal
          style={{
            justifyContent: 'center',
          }}
          animationType="fade"
          transparent={true}
          visible={loadingModal}>
          <Box
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Center bg="#2a2a2ab8" width="100%" height="100%">
              <Center width="100%" height="50%" borderRadius={10}>
                <ActivityIndicator size="large" color="white" />
                <Text color="white">Loading...</Text>
              </Center>
            </Center>
          </Box>
        </Modal>
      </Box>
    </NativeBaseProvider>
  );
}
