import * as React from 'react';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import {
  Box,
  Heading,
  AspectRatio,
  Image,
  Text,
  Center,
  HStack,
  Stack,
  NativeBaseProvider,
  Container,
  Avatar,
} from 'native-base';
import {Alert, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function Sidebar({...props}) {
  React.useEffect(() => {
    retrieveData();
  });
  const [user_id, setUserID] = React.useState();
  const [user_fname, setUserFname] = React.useState();
  const retrieveData = async () => {
    try {
      const valueString = await AsyncStorage.getItem('user_details');
      //console.log(valueString);
      //console.log('test1');
      if (valueString != null) {
        const value = JSON.parse(valueString);
        setUserID(value.user_id);
        setUserFname(value.user_fname);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Box
        style={
          {
            //  borderColor: 'black',
            //   borderWidth: 1,
          }
        }
        overflow="hidden"
        shadow={1}
        _light={{backgroundColor: '#ad8765'}}
        _dark={{backgroundColor: 'gray.700'}}>
        <Stack p="4" space={3}>
          <Stack space={2}>
            <Center>
              {/* <Avatar
                style={{
                  borderWidth: 3,
                  borderColor: 'white',
                }}
                bg="indigo.500"
                alignSelf="center"
                size="2xl"
                source={require('../assets/images/profile.jpg')}>
                RS
              </Avatar> */}
              <Heading size="md" ml="-1">
                {user_fname}
              </Heading>
              <HStack>
                <Text
                  fontSize="sm"
                  _light={{color: 'white'}}
                  _dark={{color: 'white'}}
                  fontWeight="500"
                  ml="-0.5"
                  mt="-1">
                  Welcome!
                </Text>
              </HStack>
            </Center>
          </Stack>
        </Stack>
      </Box>
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />

        {/* <DrawerItem
          label="Profile"
          onPress={() => {
            props.navigation.navigate('Profile');
          }}
          icon={() => <Icon name="user-alt" size={22} color="#98d6f1" />}
        /> */}
        <DrawerItem
          label="Sign Out"
          onPress={() => {
            AsyncStorage.removeItem('user_details');
            props.navigation.navigate('Login');
          }}
          icon={() => <Icon name="sign-out-alt" size={22} color="#ad8765" />}
        />
      </DrawerContentScrollView>
    </>
  );
}
