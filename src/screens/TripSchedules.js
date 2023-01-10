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

export default function TripScheduleScreen({navigation}) {
  // const navigation = useNavigation();
  const toast = useToast();
  const [refreshing, setRefreshing] = React.useState(false);
  const [modalVisible, setModalVisible] = React.useState(false);
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      Tts.stop();
      //console.log('refreshed_home');

      // Tts.speak('You are in trip schedule page.');
      Tts.speak('Please select where to go either south or north?');
      // data.map((item, index) => {
      //   console.log(item.fullName);
      //   Tts.speak(
      //     'Bus number ' + item.fullName + ' where going to ' + item.recentText,
      //   );
      // });

      // retrieveIp();
      // setModalShow(true);
    });

    return unsubscribe;
  }, [navigation]);
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
        <Heading fontSize="6xl" p="4" pb="3">
          Where to..?
        </Heading>
        <Center h="60%" width="100%">
          {/* <Text fontSize="6xl">Where to..?</Text> */}
          <Button
            onPress={() => {
              Tts.speak('You are going north!');
              navigation.navigate('Trip Schedule List', {
                cardinal_directions: 'north',
              });
            }}
            w="80%"
            h="120"
            style={{
              marginBottom: 50,
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
              navigation.navigate('Trip Schedule List', {
                cardinal_directions: 'south',
              });
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
      </Box>
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
            Alert.alert('Modal has been closed.');
            setModalVisible(!modalVisible);
          }}>
          <Box
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Center bg="#2a2a2ab8" width="50%" height="20%" borderRadius={10}>
              <ActivityIndicator size="large" color="white" />
              <Text color="white">Loading...</Text>
            </Center>
          </Box>
        </Modal>
      </Box>
    </NativeBaseProvider>
  );
}
