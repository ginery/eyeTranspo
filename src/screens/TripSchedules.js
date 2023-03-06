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
      Tts.speak(
        'Please select where to go either to bacolod city or la castellana city?',
      );
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <NativeBaseProvider safeAreaTop>
      <Box p={5}>
        <Heading fontSize="5xl" p="4" pb="3">
          Where to..?
        </Heading>
        <Center h="60%" width="100%">
          {/* <Text fontSize="6xl">Where to..?</Text> */}
          <Button
            bgColor="#f25655"
            bg="#dd302f"
            onPress={() => {
              Tts.speak('You are going to bacolod!');
              navigation.replace('Trip Schedule List', {
                cardinal_directions: 'TO BACOLOD',
              });
            }}
            w="80%"
            h="120"
            style={{
              marginBottom: 50,
              marginTop: 10,
            }}
            _text={{
              fontSize: 35,
              justifyContent: 'center',
              textAlign: 'justify',
            }}>
            TO BACOLOD
          </Button>
          <Button
            bgColor="#f25655"
            bg="#dd302f"
            onPress={() => {
              Tts.speak('You are going to la castellana!');
              navigation.replace('Trip Schedule List', {
                cardinal_directions: 'TO LA CASTELLANA',
              });
            }}
            w="80%"
            h="120"
            style={{
              marginBottom: 5,
            }}
            _text={{
              fontSize: 25,
              justifyContent: 'center',
              textAlign: 'center',
            }}>
            TO LA CASTELLA
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
