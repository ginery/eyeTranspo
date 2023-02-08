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
  const bus_id = route.params;
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
    retrieveDestination();
    refreshLocation();
  }, [1]);
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      retrieveUser();
      retrieveDestination();
      refreshLocation();
      Tts.stop();

      Tts.speak('You are in track passenger page.');

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
  const retrieveDestination = async () => {
    try {
      const valueString = await AsyncStorage.getItem('user_destination');
      if (valueString != null) {
        const value = JSON.parse(valueString);
        // console.log(value);
        setTripId(value.trip_id);
        setDlat(value.d_lat);
        setDlong(value.d_long);
        setBusNumber(value.bus_number);
        setBusId(value.bus_id);
        // setTripScheduleId(value.trip_schedule_id);
        // setDateArrival(value.date_arrived);
        // setDateDeparted(value.date_departed);
        getTripDetails(value.trip_id);
      }
    } catch (error) {
      console.log(error);
    }
  };
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
          Alert.alert('Internet Connection Error');
        });
    } catch (e) {
      console.log('Error in getAddressFromCoordinates', e);
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
          setDriverName(o.driver_name);
          setBusRoute(o.bus_route);
          setDateArrived(o.date_arrived);
          setDateDeparted(o.date_departed);
          var loc = o.bus_location.split(',');
          setBusLocation(loc);
          // var d = o.destination.split(',');
          setUserDestination(o.destination.split(','));
        }
      })
      .catch(error => {
        Tts.speak('Internet Connection Error');
        console.error(error);
        setButtonStatus(false);
        //  Alert.alert('Internet Connection Error');
      });
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
  const data = [
    {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
      fullName: 'Aafreen Khan',
      timeStamp: '12:47 PM',
      recentText: 'Good Day!',
      avatarUrl:
        'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
      fullName: 'Sujitha Mathur',
      timeStamp: '11:11 PM',
      recentText: 'Cheer up, there!',
      avatarUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyEaZqT3fHeNrPGcnjLLX1v_W4mvBlgpwxnA&usqp=CAU',
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      fullName: 'Anci Barroco',
      timeStamp: '6:22 PM',
      recentText: 'Good Day!',
      avatarUrl: 'https://miro.medium.com/max/1400/0*0fClPmIScV5pTLoE.jpg',
    },
    {
      id: '68694a0f-3da1-431f-bd56-142371e29d72',
      fullName: 'Aniket Kumar',
      timeStamp: '8:56 PM',
      recentText: 'All the best',
      avatarUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSr01zI37DYuR8bMV5exWQBSw28C1v_71CAh8d7GP1mplcmTgQA6Q66Oo--QedAN1B4E1k&usqp=CAU',
    },
    {
      id: '28694a0f-3da1-471f-bd96-142456e29d72',
      fullName: 'Kiara',
      timeStamp: '12:47 PM',
      recentText: 'I will call today.',
      avatarUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBwgu1A5zgPSvfE83nurkuzNEoXs9DMNr8Ww&usqp=CAU',
    },
  ];
  const getTransactionByBus = () => {
    const formData = new FormData();
    formData.append('bus_id', busId);
    fetch(window.name + 'getTransactionByBus.php', {
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
        }
      })
      .catch(error => {
        Tts.speak('Internet Connection Error');
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
          zIndex={-1}></MapView>
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
        <Center height={170}>
          <Box width="100%" p={3}>
            <FlatList
              data={data}
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
                        {item.fullName}
                      </Text>
                      <Text
                        color="coolGray.600"
                        _dark={{
                          color: 'warmGray.200',
                        }}>
                        {item.recentText}
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
                      {item.timeStamp}
                    </Text>
                  </HStack>
                </Box>
              )}
              keyExtractor={item => item.id}
            />
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
