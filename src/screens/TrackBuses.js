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
import MapView, {
  enableLatestRenderer,
  PROVIDER_GOOGLE,
  Marker,
  Circle,
} from 'react-native-maps';
// import Geolocation from '@react-native-community/geolocation';
import Geolocation from 'react-native-geolocation-service';
import {round} from 'react-native-reanimated';
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
export default function TrackBusesScreen() {
  const navigation = useNavigation();
  const [user_id, set_user_id] = React.useState(0);
  const [modalShow, setModalShow] = React.useState(false);
  const [referenceNumber, setReferenceNumber] = React.useState('');
  const [modalVisible, setModalVisible] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [latitude, setLatitude] = React.useState(0);
  const [longitude, setLongitude] = React.useState(0);
  const [reverseGeoResponse, setReversegeoResponse] = React.useState('');
  const mapRef = React.useRef();
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
    const unsubscribe = navigation.addListener('focus', () => {
      retrieveUser();
      refreshLocation();
      // mapRef
      //   .addressForCoordinate({
      //     latitude: latitude,
      //     longitude: longitude,
      //   })
      //   .then(res => console.log(res));

      Tts.speak('You are in track buses page.');

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
    console.log('get location');
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
      'Bus 12563 is about' +
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
          Tts.speak('Please select where to go south or north?');
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
          showsTraffic={true}
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
            origin={{latitude: latitude, longitude: longitude}}
            destination={{
              latitude: 9.1763435,
              longitude: 122.938621,
            }}
            waypoints={
              waypointarray.length > 2 ? waypointarray.slice(1, -1) : undefined
            }
            apikey="AIzaSyDoePlR12j4XnPgKCc0YWpI_7rtI6TPNms"
            strokeWidth={8}
            strokeColor="#0a95ff8a" //#4a89f3
            onStart={params => {
              console.log(
                `Started routing between "${params.origin}" and "${params.destination}"`,
              );
            }}
            onReady={result => {
              getAddressFromCoordinates(latitude, longitude);
              // distanceUpdate(result.distance, result.duration);

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
        </MapView>
      </Center>
      <Center bg="emerald.100" h="50%" width="100%">
        <Text fontSize="6xl">Where to..?</Text>
        <Button
          onPress={() => {
            Tts.speak('You are going north!');
          }}
          w="80%"
          h="120"
          style={{
            marginBottom: 5,
            marginTop: 10,
          }}
          _text={{
            fontSize: 60,
            justifyContent: 'center',
            textAlign: 'justify',
          }}>
          NORTH
        </Button>
        <Button
          onPress={() => {
            Tts.speak('You are going south!');
          }}
          w="80%"
          h="120"
          style={{
            marginBottom: 5,
          }}
          _text={{
            fontSize: 60,
            justifyContent: 'center',
            textAlign: 'justify',
          }}>
          SOUTH
        </Button>
      </Center>
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
