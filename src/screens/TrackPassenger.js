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
import {useNavigation} from '@react-navigation/native';
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
export default function TrackPassengerScreen({navigation, route}) {
  // const navigation = useNavigation();
  // const bus_id = route.params;
  // const [user_id, set_user_id] = React.useState(0);
  const {user_id, bus_id} = route.params;
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
  const [busTransactionData, setBusTransactionData] = React.useState([]);
  const [passenderLocData, setPassengerLocData] = React.useState([]);
  const retrieveUser = async () => {
    try {
      const valueString = await AsyncStorage.getItem('user_details');
      if (valueString != null) {
        const value = JSON.parse(valueString);
        // set_user_id(value.user_id);
        refreshLocation(value.user_id);
        // console.log(value.user_id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // retrieveUser();
      // // getBusTransaction();
      getBusDetails();
      // refreshLocation();
      // Tts.stop();
      // Tts.speak('You are in track passenger page.');
      // console.log('user_id' + user_id);
    });
    var watchID = Geolocation.watchPosition(
      latestposition => console.log(latestposition),
      error => console.log(error),
      {enableHighAccuracy: true, timeout: 5000, maximumAge: 5000},
    );
    const interval = setInterval(() => {
      refreshLocation();
      // retrieveUser();
      getBusTransaction();
    }, 5000);

    return () => {
      clearInterval(interval);
      Geolocation.clearWatch(watchID);
      unsubscribe;
    };
  }, [navigation]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    setTimeout(function () {
      setRefreshing(false);
    }, 1000);
  }, []);
  const refreshLocation = () => {
    // console.log('get location');
    Geolocation.getCurrentPosition(info => {
      console.log(info);
      setLatitude(info.coords.latitude);
      setLongitude(info.coords.longitude);
      updateLocation(user_id, info.coords.latitude, info.coords.longitude);
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
          Alert.alert('Internet Connection Error');
        });
    } catch (e) {
      console.log('Error in getAddressFromCoordinates', e);
    }
  };

  const sendReport = () => {
    const formData = new FormData();
    formData.append('trip_id', tripId);
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
    formData.append('trip_id', tripId);
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
            AsyncStorage.removeItem('user_destination');
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

  const getBusDetails = () => {
    // console.log(user_id);
    const formData = new FormData();
    formData.append('user_id', user_id);
    fetch(window.name + 'getBusDetails.php', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    })
      .then(response => response.json())
      .then(responseJson => {
        // console.log(responseJson);
        if (responseJson.array_data != '') {
          getBusTransaction(responseJson.array_data[0].bus_id);
          setBusId(responseJson.array_data[0].bus_id);
        }
      })
      .catch(error => {
        Tts.speak('Internet Connection Error');
        console.error(error, 'getBusDetails');
        // setButtonStatus(false);
        //  Alert.alert('Internet Connection Error');
      });
  };
  const getBusTransaction = () => {
    console.log(bus_id);
    const formData = new FormData();
    formData.append('bus_id', bus_id);
    fetch(window.name + 'getBusTransaction.php', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    })
      .then(response => response.json())
      .then(responseJson => {
        // console.log(responseJson);
        if (responseJson.array_data != '') {
          var data = responseJson.array_data.map(function (item, index) {
            return {
              transaction_id: item.transaction_id,
              trip_id: item.trip_id,
              bus_id: item.bus_id,
              passenger_id: item.passenger_id,
              passenger_name: item.passenger_name,
              fare: item.fare,
              remarks: item.remarks,
              status: item.status,
              date_added: item.date_added,
              destination: item.destination,
            };
          });
          var data_p = responseJson.array_data.map(function (item, index) {
            return {
              transaction_id: item.transaction_id,
              trip_id: item.trip_id,
              bus_id: item.bus_id,
              passenger_id: item.passenger_id,
              passenger_name: item.passenger_name,
              destination: item.destination,
              passenger_loc: item.passenger_loc,
            };
          });
          setPassengerLocData(data_p);
          setBusTransactionData(data);
        }
      })
      .catch(error => {
        Tts.speak('Internet Connection Error');
        console.error(error, 'getBusTransaction');
        // setButtonStatus(false);
        //  Alert.alert('Internet Connection Error');
      });
  };
  const delayNotification = () => {
    // console.log(busId);
    const formData = new FormData();
    formData.append('bus_id', bus_id);
    fetch(window.name + 'delaysNotification.php', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    })
      .then(response => response.json())
      .then(responseJson => {
        // console.log(responseJson);
        ToastAndroid.showWithGravity(
          'Notifications sent.',
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
        );
      })
      .catch(error => {
        Tts.speak('Internet Connection Error');
        console.error(error, 'getBusDetails');
        // setButtonStatus(false);
        //  Alert.alert('Internet Connection Error');
      });
  };
  const updateLocation = (user_id, lat, long) => {
    const formData = new FormData();
    formData.append('user_id', user_id);
    formData.append('location', lat + ',' + long);
    fetch(window.name + 'updateCurrentLocation.php', {
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
            ToastAndroid.showWithGravity(
              'Location Updated.',
              ToastAndroid.SHORT,
              ToastAndroid.BOTTOM,
            );
          }
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
    <NativeBaseProvider safeAreaTop>
      <Center bg="gray.100" height="50%">
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
          region={{
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}
          zIndex={-1}>
          {passenderLocData.map((item, index) => {
            var p_loc = item.passenger_loc.split(',');
            return (
              // <Marker
              //   coordinate={{
              //     latitude: parseFloat(p_loc[0]),
              //     longitude: parseFloat(p_loc[0]),
              //   }} //driver
              // >
              //   <Center w="100%">
              //     <Badge colorScheme="info" borderRadius={3}>
              //       {item.passenger_name}
              //     </Badge>
              //   </Center>
              // </Marker>
              <Marker
                coordinate={{
                  latitude: parseFloat(p_loc[0]),
                  longitude: parseFloat(p_loc[1]),
                }}
                // title={'title'}
                // description={'description'}
              />
            );
          })}
        </MapView>
      </Center>
      <VStack mt={5}>
        <Center h="68%">
          <Center
            style={{
              borderBottomColor: 'black',
              borderBottomWidth: 1,
              borderStyle: 'dashed',
            }}
            w="90%">
            <HStack width="100%" mt={3} mb={1}>
              <Center width="50%">
                <Heading>Passenger list</Heading>
              </Center>
              <Center width="50%" alignItems="flex-end">
                <Button
                  onPress={() => {
                    delayNotification();
                  }}>
                  <HStack>
                    <Icon name="bell" size={20} color="white" />
                    <Text color="white"> Delays</Text>
                  </HStack>
                </Button>
              </Center>
            </HStack>
          </Center>

          <Box width="100%" height="100%" p={3}>
            {busTransactionData != '' ? (
              <FlatList
                data={busTransactionData}
                keyExtractor={item => item.transaction_id}
                renderItem={({item}) => (
                  <Box
                    mb="2"
                    borderRadius={5}
                    borderWidth="1"
                    _dark={{
                      borderColor: 'muted.50',
                    }}
                    borderColor="muted.800"
                    pl={['0', '4']}
                    pr={['0', '5']}
                    py="2">
                    <HStack space={[2, 3]} p="2" justifyContent="space-between">
                      <VStack>
                        <Text
                          _dark={{
                            color: 'warmGray.50',
                          }}
                          color="coolGray.800"
                          bold>
                          {item.passenger_name}
                        </Text>
                        <Text
                          color="coolGray.600"
                          _dark={{
                            color: 'warmGray.200',
                          }}>
                          {item.date_added}
                        </Text>
                      </VStack>
                      <Spacer />
                      <Text
                        fontSize="xs"
                        _dark={{
                          color: 'warmGray.50',
                        }}
                        color="coolGray.800"
                        alignSelf="flex-start">
                        {item.status == 'P' ? (
                          <Badge colorScheme="warning">PENDING</Badge>
                        ) : item.status == 'B' ? (
                          <Badge colorScheme="success">BOARDED</Badge>
                        ) : null}
                      </Text>
                    </HStack>
                  </Box>
                )}
              />
            ) : (
              <Center>Empty records.</Center>
            )}
          </Box>
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
