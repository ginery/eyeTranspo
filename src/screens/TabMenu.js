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

export default function App({navigation}) {
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      //console.log('refreshed_home');
      Tts.speak('You are in menu page.');
      Tts.speak(
        'The menu list are trip schedules, track buses, report drivers/conductor and lastly logout',
      );

      // retrieveIp();
      // setModalShow(true);
    });

    return unsubscribe;
  }, [navigation]);
  const {colors} = useTheme();
  return (
    <NativeBaseProvider>
      <StatusBar backgroundColor="#ffe869" barStyle="light-content" />
      <ScrollView
        style={{
          width: '100%',
          height: '100%',
        }}>
        <VStack bg="#ffe869">
          <TouchableOpacity
            onPress={() => {
              console.log('tetst');
              Tts.speak('TRIP SCHEDULES');
            }}>
            <Box
              style={{
                width: '100%',
                height: 200,
                borderColor: '#e9d356',
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
                    }}>
                    TRIP SCHEDULES
                  </Text>
                </Center>
                <Center>
                  <Text
                    style={{
                      fontSize: 50,
                    }}>
                    <FontIcon name="chevron-right" size={50} />
                  </Text>
                </Center>
              </HStack>
            </Box>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              console.log('tetst');
              Tts.speak('TRACK BUSES');
            }}>
            <Box
              style={{
                width: '100%',
                height: 200,
                borderColor: '#e9d356',
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
                    }}>
                    TRACK BUSES
                  </Text>
                </Center>
                <Center>
                  <Text
                    style={{
                      fontSize: 50,
                    }}>
                    <FontIcon name="chevron-right" size={50} />
                  </Text>
                </Center>
              </HStack>
            </Box>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              console.log('tetst');
              Tts.speak('REPORT DRIVERS/CONDUCTOR');
            }}>
            <Box
              style={{
                width: '100%',
                height: 200,
                borderColor: '#e9d356',
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
                    }}>
                    REPORT DRIVERS/CONDUCTOR
                  </Text>
                </Center>
                <Center>
                  <Text
                    style={{
                      fontSize: 50,
                    }}>
                    <FontIcon name="chevron-right" size={50} />
                  </Text>
                </Center>
              </HStack>
            </Box>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              console.log('tetst');
              AsyncStorage.clear();
              navigation.navigate('Login');
              Tts.speak('Logging out.');
            }}>
            <Box
              style={{
                width: '100%',
                height: 200,
                borderColor: '#e9d356',
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
                    }}>
                    LOG OUT
                  </Text>
                </Center>
                <Center>
                  <Text
                    style={{
                      fontSize: 50,
                    }}>
                    <FontIcon name="chevron-right" size={50} />
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
