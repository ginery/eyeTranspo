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
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      retrieveDestination();
      //console.log('refreshed_home');
      Tts.stop();
      Tts.speak('You are in menu page.');
      Tts.speak(
        'The menu list are trip schedules, track buses, report drivers/conductor, profile and lastly logout',
      );

      // retrieveIp();
      // setModalShow(true);
    });

    return unsubscribe;
  }, [navigation]);
  const retrieveDestination = async () => {
    try {
      const valueString = await AsyncStorage.getItem('user_destination');
      if (valueString != null) {
        const value = JSON.parse(valueString);
        console.log(value);
        setShowMenu(true);
      } else {
        setShowMenu(false);
      }
    } catch (error) {
      console.log(error);
    }
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
                  navigation.navigate('Track Buses');
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
