import React from 'react';
import {
  Box,
  FlatList,
  Heading,
  Avatar,
  HStack,
  VStack,
  Text,
  Spacer,
  Center,
  NativeBaseProvider,
  Badge,
  useToast,
  Button,
  TextArea,
  Stack,
  AspectRatio,
  Image,
  Pressable,
  Flex,
  AlertDialog,
} from 'native-base';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
  Alert,
  RefreshControl,
  ActivityIndicator,
  Modal,
  ToastAndroid,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Rating from 'react-native-easy-rating';
// import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Tts from 'react-native-tts';
import MapViewDirections from 'react-native-maps-directions';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import MapView, {
  enableLatestRenderer,
  PROVIDER_GOOGLE,
  Marker,
  Circle,
} from 'react-native-maps';
// import Geolocation from '@react-native-community/geolocation';
import Geolocation from 'react-native-geolocation-service';
import {round} from 'react-native-reanimated';
import {firebase} from '@react-native-firebase/database';
navigator.geolocation = require('react-native-geolocation-service');

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
export default function TrackBusesScreen({navigation, route}) {
  // const navigation = useNavigation();
  const [user_id, set_user_id] = React.useState(0);
  const [modalShow, setModalShow] = React.useState(false);
  const [referenceNumber, setReferenceNumber] = React.useState('');
  const [modalVisible, setModalVisible] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [latitude, setLatitude] = React.useState(0);
  const [longitude, setLongitude] = React.useState(0);
  const [reverseGeoResponse, setReversegeoResponse] = React.useState('');
  const [d_lat, setDlat] = React.useState(0);
  const [d_long, setDlong] = React.useState(0);
  const [busNumber, setBusNumber] = React.useState(0);
  const [isOpen, setIsOpen] = React.useState(false);
  const {bus_id, trip_id} = route.params;
  const [busId, setBusId] = React.useState(0);
  const [tripScheduleId, setTripScheduleId] = React.useState(0);
  const [dateDeparted, setDateDeparted] = React.useState('');
  const [dateArrived, setDateArrived] = React.useState('');
  const [busRoute, setBusRoute] = React.useState('');
  const [tripId, setTripId] = React.useState('');
  const [driverName, setDriverName] = React.useState('');
  const onClose = () => setIsOpen(false);
  const [modalReport, setModalReport] = React.useState(false);
  const [report, setReport] = React.useState('');
  const [busLocation, setBusLocation] = React.useState([]);
  const cancelRef = React.useRef(null);
  const [userDestination, setUserDestination] = React.useState([]);
  const [tripStatus, getTripStatus] = React.useState('');
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
  React.useEffect(() => {
    retrieveUser();
    refreshLocation();
  }, [1]);
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      retrieveUser();
      refreshLocation();
      Tts.stop();
      Tts.speak('You are in track buses page.');
      getTripDetails();
      // console.log('user_id' + user_id);
    });
    var watchID = Geolocation.watchPosition(
      latestposition => {
        // setLastPosition(latestposition);
      },
      error => console.log(error),
      {enableHighAccuracy: true, timeout: 3000, maximumAge: 10000},
    );
    const interval = setInterval(() => {
      refreshLocation();
    }, 300000);

    return () => {
      clearInterval(interval);
      Geolocation.clearWatch(watchID);
      unsubscribe;
    };
  }, [navigation]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getOrderHistory();
    setTimeout(function () {
      setRefreshing(false);
    }, 1000);
  }, []);
  const refreshLocation = u_id => {
    // console.log('get location');
    Geolocation.getCurrentPosition(info => {
      console.log(info);
      setLatitude(info.coords.latitude);
      setLongitude(info.coords.longitude);
    });
  };
  const waypointarray = [
    {
      latitude: 10.6827032,
      longitude: 122.9438118,
    },
    {
      latitude: 9.1763435,
      longitude: 122.938621,
    },
  ];
  const distanceUpdate = (distance, duration) => {
    if (distance > 1) {
      var distanceTotal = Math.round(distance);
      if (Math.round(distance) > 1) {
        var kilometer = 'kilometers';
      } else {
        var kilometer = 'kilometer';
      }
    } else {
      var distanceTotal = distance * 1000;
      if (distanceTotal > 1) {
        var kilometer = 'meters';
      } else {
        var kilometer = 'meter';
      }
    }
    if (duration < 60) {
      var durationTotal = Math.round(duration);
      if (Math.round(duration) > 1) {
        var minutes = 'minutes';
      } else {
        var minutes = 'minute';
      }
    } else {
      var time = duration / 60;
      var durationTotal = Math.round(time);
      if (time > 1) {
        var minutes = 'hours';
      } else {
        var minutes = 'hour';
      }
    }

    // console.log(reverseGeoResponse + 'hello');
    Tts.speak(
      'Bus ' +
        busNumber +
        ' is about' +
        distanceTotal +
        kilometer +
        ' away from you. Estimated arrival is ' +
        Math.round(durationTotal) +
        minutes,
    );
    // console.log(Math.round(distance));
  };
  const getAddressFromCoordinates = async (latitude, longitude) => {
    try {
      fetch(
        'https://maps.googleapis.com/maps/api/geocode/json?latlng=' +
          latitude +
          ',' +
          longitude +
          '&key=AIzaSyDoePlR12j4XnPgKCc0YWpI_7rtI6TPNms',
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
          },
        },
      )
        .then(response => response.json())
        .then(responseJson => {
          // var json = JSON.parse(responseJson);

          Tts.speak(
            'You are currently in ' +
              String(
                responseJson.results[0].formatted_address.replace(
                  ', Philippines',
                  ' ',
                ),
              ),
          );

          // setReversegeoResponse(
          //   String(responseJson.results[0].formatted_address),
          // );
          // setReversegeoResponse('Not Available');
        })
        .catch(error => {
          console.error(error);
          Alert.alert('Internet Connection Error', 'getAddressFromCoordinates');
        });
    } catch (e) {
      console.log('Error in getAddressFromCoordinates', e);
    }
  };
  const getTripDetails = () => {
    const formData = new FormData();
    formData.append('trip_id', trip_id);
    formData.append('user_id', user_id);
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
          setDriverName(o.driver_name);
          setBusRoute(o.bus_route);
          setDateArrived(o.date_arrived);
          setDateDeparted(o.date_departed);
          setBusNumber(o.bus_number);
          var loc = o.bus_location.split(',');
          setBusLocation(loc);
          // var d = o.destination.split(',');
          setUserDestination(o.destination.split(','));
          getTripStatus(o.status);
        }
      })
      .catch(error => {
        Tts.speak('Internet Connection Error');
        console.error(error, 'getTripDetails');
        setButtonStatus(false);
        Alert.alert('Internet Connection Error', 'getTripDetails');
      });
  };
  const sendReport = () => {
    const formData = new FormData();
    formData.append('trip_id', trip_id);
    formData.append('report', report);
    fetch(window.name + 'reportDriverConductor.php', {
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
          if (responseJson.array_data[0]) {
            setModalReport(false);
          }
        }
      })
      .catch(error => {
        Tts.speak('Internet Connection Error');
        console.error(error);
        // setButtonStatus(false);
        //  Alert.alert('Internet Connection Error');
      });
  };
  const cancelTrip = () => {
    const formData = new FormData();
    formData.append('trip_id', trip_id);
    fetch(window.name + 'cancelTrips.php', {
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
          if (responseJson.array_data[0].response == 1) {
            // AsyncStorage.removeItem('user_destination');
            navigation.navigate('Tab View');
          }
        }
      })
      .catch(error => {
        Tts.speak('Internet Connection Error');
        console.error(error);
        // setButtonStatus(false);
        //  Alert.alert('Internet Connection Error');
      });
  };
  const updateStatus = status => {
    const formData = new FormData();
    formData.append('trip_id', trip_id);
    formData.append('status', status);
    fetch(window.name + 'updateTripStatus.php', {
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
          if (responseJson.array_data[0].response == 1) {
            getTripDetails();
            if (tripStatus == 'B') {
              ToastAndroid.showWithGravity(
                'Great! You are on board.',
                ToastAndroid.SHORT,
                ToastAndroid.CENTER,
              );
            } else if (tripStatus == 'A') {
              ToastAndroid.showWithGravity(
                'Great! You arrived at your destination.',
                ToastAndroid.SHORT,
                ToastAndroid.CENTER,
              );
            }
          }
        }
      })
      .catch(error => {
        Tts.speak('Internet Connection Error', 'Update transaction');
        console.error(error);
        // setButtonStatus(false);
        //  Alert.alert('Internet Connection Error');
      });
  };
  return (
    <NativeBaseProvider safeAreaTop>
      <Center bg="gray.100" h="50%">
        <MapView
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={styles.map}
          showsUserLocation={true}
          showsMyLocationButton={true}
          showsBuildings={true}
          loadingEnabled={true}
          // showsTraffic={true}
          loadingIndicatorColor="#e99340"
          zoomControlEnabled={true}
          directionsServiceBaseUrl="https://maps.googleapis.com/maps/api/js?key=AIzaSyDoePlR12j4XnPgKCc0YWpI_7rtI6TPNms&callback=initMap"
          mapType="standard"
          region={{
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}
          zIndex={-1}>
          <MapViewDirections
            origin={{
              latitude: busLocation != '' ? parseFloat(busLocation[0]) : '',
              longitude: busLocation != '' ? parseFloat(busLocation[1]) : '',
            }}
            destination={{
              latitude:
                userDestination != '' ? parseFloat(userDestination[0]) : '',
              longitude:
                userDestination != '' ? parseFloat(userDestination[1]) : '',
            }}
            // waypoints={
            //   waypointarray.length > 2 ? waypointarray.slice(1, -1) : undefined
            // }
            apikey="AIzaSyDoePlR12j4XnPgKCc0YWpI_7rtI6TPNms"
            strokeWidth={8}
            strokeColor="#0a95ff8a" //#4a89f3
            onStart={params => {
              // console.log(
              //   `Started routing between "${params.origin}" and "${params.destination}"`,
              // );
            }}
            onReady={result => {
              getAddressFromCoordinates(latitude, longitude);
              // distanceUpdate(result.distance, result.duration);

              // console.log(`Distance: ${result.distance} km`);
              // console.log(`Duration: ${result.duration} min.`);

              // fitToCoordinates(result.coordinates, {
              //   edgePadding: {
              //     right: width / 20,
              //     bottom: height / 20,
              //     left: width / 20,
              //     top: height / 20,
              //   },
              // });
            }}
          />
          <MapViewDirections
            origin={{
              latitude: latitude,
              longitude: longitude,
            }}
            destination={{
              latitude: userDestination != '' ? parseFloat(busLocation[0]) : '',
              longitude:
                userDestination != '' ? parseFloat(busLocation[1]) : '',
            }}
            // waypoints={
            //   waypointarray.length > 2 ? waypointarray.slice(1, -1) : undefined
            // }
            apikey="AIzaSyDoePlR12j4XnPgKCc0YWpI_7rtI6TPNms"
            // strokeWidth={8}
            // strokeColor="green" //#4a89f3
            onStart={params => {
              console.log(
                `Started routing between "${params.origin}" and "${params.destination}"`,
              );
            }}
            onReady={result => {
              // getAddressFromCoordinates(latitude, longitude);
              distanceUpdate(result.distance, result.duration);
              console.log(`Distance: ${result.distance} km`);
              console.log(`Duration: ${result.duration} min.`);
              // fitToCoordinates(result.coordinates, {
              //   edgePadding: {
              //     right: width / 20,
              //     bottom: height / 20,
              //     left: width / 20,
              //     top: height / 20,
              //   },
              // });
            }}
          />
          {busLocation != '' && (
            <Marker
              coordinate={{
                latitude: parseFloat(busLocation[0]),
                longitude: parseFloat(busLocation[1]),
              }}
              title={'title'}
              description={'description'}
            />
          )}
          {userDestination != '' && (
            <Marker
              coordinate={{
                latitude:
                  userDestination != '' ? parseFloat(userDestination[0]) : '',
                longitude:
                  userDestination != '' ? parseFloat(userDestination[1]) : '',
              }}
              title={'title'}
              description={'description'}
            />
          )}
        </MapView>
      </Center>
      <VStack mt={5}>
        <Box alignItems="center">
          <Box
            w="95%"
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
            <Stack p="4" space={1}>
              <Stack space={1}>
                <Heading size="2xl" ml="-1">
                  {driverName} {'['}
                  {busNumber}
                  {']'}
                </Heading>
                <Text
                  fontSize="xl"
                  _light={{
                    color: '#2f46c6',
                  }}
                  _dark={{
                    color: '#2f46c6',
                  }}
                  fontWeight="500"
                  ml="-0.5"
                  mt="-1">
                  {busRoute}
                </Text>
              </Stack>
              <HStack
                alignItems="center"
                space={4}
                justifyContent="space-between">
                <VStack alignItems="flex-start">
                  <Text
                    color="coolGray.600"
                    _dark={{
                      color: 'warmGray.200',
                    }}
                    fontSize="lg"
                    fontWeight="400">
                    Arrived: {dateArrived}
                  </Text>
                  <Text
                    color="coolGray.600"
                    _dark={{
                      color: 'warmGray.200',
                    }}
                    fontSize="lg"
                    fontWeight="400">
                    Departed: {dateDeparted}
                  </Text>
                </VStack>
              </HStack>
            </Stack>
          </Box>
        </Box>
        <Center>
          <HStack
            mt={1}
            width="95%"
            justifyContent="center"
            // borderColor="black"
            // borderWidth={2}
            h="60">
            {tripStatus == 'P' ? (
              <Pressable
                w="100%"
                onPress={() => {
                  updateStatus('B');
                }}>
                {({isHovered, isFocused, isPressed}) => {
                  return (
                    <Center
                      h="100%"
                      bg={
                        isPressed
                          ? 'primary.200'
                          : isHovered
                          ? 'coolGray.200'
                          : 'primary.500'
                      }
                      style={{
                        transform: [
                          {
                            scale: isPressed ? 0.96 : 1,
                          },
                        ],
                      }}>
                      <Text
                        fontSize="4xl"
                        color={
                          isPressed
                            ? 'black'
                            : isHovered
                            ? 'coolGray.200'
                            : 'white'
                        }>
                        Boarding
                      </Text>
                    </Center>
                  );
                }}
              </Pressable>
            ) : (
              <Pressable
                w="100%"
                onPress={() => {
                  updateStatus('A');
                }}>
                {({isHovered, isFocused, isPressed}) => {
                  return (
                    <Center
                      h="100%"
                      bg={
                        isPressed
                          ? 'emerald.200'
                          : isHovered
                          ? 'coolGray.200'
                          : 'emerald.500'
                      }
                      style={{
                        transform: [
                          {
                            scale: isPressed ? 0.96 : 1,
                          },
                        ],
                      }}>
                      <Text
                        fontSize="4xl"
                        color={
                          isPressed
                            ? 'black'
                            : isHovered
                            ? 'coolGray.200'
                            : 'white'
                        }>
                        Arrived
                      </Text>
                    </Center>
                  );
                }}
              </Pressable>
            )}
          </HStack>
          <HStack
            mt={1}
            width="95%"
            justifyContent="center"
            // borderColor="black"
            // borderWidth={2}
            h="100">
            <Pressable
              w="50%"
              onPress={() => {
                Tts.speak('Report?');
                setModalReport(true);
              }}>
              {({isHovered, isFocused, isPressed}) => {
                return (
                  <Center
                    h="100%"
                    bg={
                      isPressed
                        ? 'warning.200'
                        : isHovered
                        ? 'coolGray.200'
                        : 'warning.500'
                    }
                    style={{
                      transform: [
                        {
                          scale: isPressed ? 0.96 : 1,
                        },
                      ],
                    }}>
                    <Text
                      fontSize="4xl"
                      color={
                        isPressed
                          ? 'black'
                          : isHovered
                          ? 'coolGray.200'
                          : 'white'
                      }>
                      Report
                    </Text>
                  </Center>
                );
              }}
            </Pressable>
            <Pressable
              w="50%"
              onPress={() => {
                Tts.stop();
                Tts.speak(
                  'Cancel trip? This action will remove your current trip schedule. Please select either to proceed canceling or not.',
                );
                setIsOpen(!isOpen);
              }}>
              {({isHovered, isFocused, isPressed}) => {
                return (
                  <Center
                    h="100%"
                    bg={
                      isPressed
                        ? 'error.200'
                        : isHovered
                        ? 'coolGray.200'
                        : 'error.500'
                    }
                    style={{
                      transform: [
                        {
                          scale: isPressed ? 0.96 : 1,
                        },
                      ],
                    }}>
                    <Text
                      fontSize="4xl"
                      color={
                        isPressed
                          ? 'black'
                          : isHovered
                          ? 'coolGray.200'
                          : 'white'
                      }>
                      Cancel
                    </Text>
                  </Center>
                );
              }}
            </Pressable>
          </HStack>
        </Center>
      </VStack>
      <Center>
        <AlertDialog
          leastDestructiveRef={cancelRef}
          isOpen={isOpen}
          onClose={onClose}>
          <AlertDialog.Content>
            <AlertDialog.CloseButton />
            <AlertDialog.Header>
              <Text fontSize="3xl" fontWeight="bold">
                Cancel trip?
              </Text>
            </AlertDialog.Header>
            <AlertDialog.Body>
              <Text fontSize="3xl">
                This action will remove your current trip schedule.
              </Text>
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <Button.Group space={2}>
                <Button
                  variant="unstyled"
                  colorScheme="coolGray"
                  onPress={onClose}
                  ref={cancelRef}>
                  <Text fontSize="3xl">Cancel</Text>
                </Button>
                <Button
                  colorScheme="danger"
                  onPress={() => {
                    cancelTrip();
                  }}>
                  <Text fontSize="3xl" color="white">
                    Proceed
                  </Text>
                </Button>
              </Button.Group>
            </AlertDialog.Footer>
          </AlertDialog.Content>
        </AlertDialog>
      </Center>

      <Modal
        style={{
          justifyContent: 'center',
        }}
        animationType="fade"
        transparent={true}
        visible={modalReport}
        onRequestClose={() => {
          // Alert.alert('Modal has been closed.');
          setModalReport(!modalReport);
        }}>
        <Box
          bg="#2a2a2ab8"
          style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          {/* <TouchableOpacity>
            <Badge
              colorScheme="success"
              style={{
                top: 0,
                right: 0,
              }}>
              fdsggsdgfsdgX
            </Badge>
          </TouchableOpacity> */}
          <Center bg="white" width="80%" height="200" borderRadius={10}>
            <Text fontSize="xl" fontWeight="bold" mb={2}>
              Report Driver/Conductor?
            </Text>
            <Box alignItems="center" w="100%" mb={2}>
              <TextArea
                value={report}
                onChangeText={text => setReport(text)}
                fontSize="xl"
                h={20}
                placeholder="Text Area Placeholder"
                w="90%"
              />
            </Box>
            <Button
              width="90%"
              onPress={() => {
                sendReport();
              }}>
              <Heading color="white">Proceed</Heading>
            </Button>
          </Center>
        </Box>
      </Modal>
      {/* !#end of mmodal report */}
      <Modal
        style={{
          justifyContent: 'center',
        }}
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <Box style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Center bg="#2a2a2ab8" width="50%" height="20%" borderRadius={10}>
            <ActivityIndicator size="large" color="white" />
            <Text color="white">Loading...</Text>
          </Center>
        </Box>
      </Modal>
    </NativeBaseProvider>
  );
}
