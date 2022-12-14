import * as React from 'react';
import {View, useWindowDimensions, Alert, TouchableOpacity} from 'react-native';
import {
  NativeBaseProvider,
  Box,
  VStack,
  HStack,
  Button,
  IconButton,
  Text,
  Center,
  StatusBar,
  Pressable,
  Link,
  FormControl,
  Heading,
  Avatar,
  Spacer,
  Container,
  Image,
  Stack,
  AspectRatio,
  ScrollView,
  Badge,
} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import HomeScreenScreen from './Home';
import HistoryScreen from './History';
import ProfileScreen from './Profile';
import AsyncStorage from '@react-native-async-storage/async-storage';
const MyTab = ({...props}) => (
  <Box
    // flex={1}
    // bg="black"
    safeAreaTop
    style={
      {
        //   borderColor: 'black',
        //   borderWidth: 3,
        // height: '72%',
      }
    }>
    <Center flex={1}></Center>
    <HStack
      bg="#ad8765"
      alignItems="center"
      safeAreaBottom
      shadow={6}
      px={3}
      py={2}>
      <Pressable
        // cursor="pointer"
        // opacity={props.select === 0 ? 1 : 0.5}
        onPress={() => {
          props.taps(0);
          props.jumpTo('HomeScreen');
        }}
        py="2"
        flex={1}>
        <Center>
          <Icon
            name="store"
            size={22}
            color={props.select === 0 ? 'white' : '#ceaa89'}
          />
          <Text color={props.select === 0 ? 'white' : '#ceaa89'} fontSize="14">
            Products
          </Text>
        </Center>
      </Pressable>
      <Pressable
        // cursor="pointer"
        // opacity={props.select === 1 ? 1 : 0.5}
        onPress={() => {
          props.taps(1);
          props.jumpTo('History');
        }}
        py={2}
        flex={1}>
        <Center>
          <Icon
            name="list"
            size={22}
            color={props.select === 1 ? 'white' : '#ceaa89'}
          />
          <Text color={props.select === 1 ? 'white' : '#ceaa89'} fontSize="14">
            History
          </Text>
        </Center>
      </Pressable>

      <Pressable
        // opacity={props.select === 2 ? 1 : 0.8}
        color="red"
        onPress={() => {
          props.taps(2);
          props.jumpTo('Profile');
        }}
        py={2}
        flex={1}>
        {/* {props.counter != 0 ? (
          <Center
            bg="#fd2e2e"
            // border="white"
            _text={{color: 'white', fontWeight: '700', fontSize: 'xs'}}
            position="absolute"
            right={8}
            top={1}
            h="5"
            w="5"
            p="0"
            rounded="10">
            {props.counter}
          </Center>
        ) : null} */}
        <Center>
          <Icon
            name="user"
            size={22}
            color={props.select === 2 ? 'white' : '#ceaa89'}
          />
          <Text color={props.select === 2 ? 'white' : '#ceaa89'} fontSize="14">
            Profile
          </Text>
        </Center>
      </Pressable>
    </HStack>
  </Box>
);

const renderScene = ({route}) => {
  switch (route.key) {
    case 'HomeScreen':
      return <HomeScreenScreen />;
    case 'History':
      return <HistoryScreen />;
    case 'Profile':
      return <ProfileScreen />;
    default:
      return null;
  }
};
export default function TabViewScreen({navigation}) {
  const layout = useWindowDimensions();
  const [selected, setSelected] = React.useState(0);
  const [index, setIndex] = React.useState(0);
  const [user_id, setUserid] = React.useState();

  const [routes] = React.useState([
    {key: 'HomeScreen', title: 'HomeScreen'},
    {key: 'History', title: 'History'},
    {key: 'Profile', title: 'Profile'},
  ]);
  React.useEffect(() => {
    retrieveData();
  }, [1]);
  // React.useEffect(() => {
  //   const unsubscribe = navigation.addListener('focus', () => {
  //     console.log('refreshed_home');
  //     retrieveData();
  //     countOrderPending();
  //   });
  //   return unsubscribe;
  // }, [navigation]);

  const retrieveData = async () => {
    try {
      const valueString = await AsyncStorage.getItem('user_details');
      // console.log(valueString);
      const value = JSON.parse(valueString);
      if (value == null) {
        console.log('empty');
      } else {
        setUserid(value.user_id);
        // console.log(value);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const cartCounter = () => {
    // console.log(user_id);
    const formData = new FormData();
    formData.append('user_id', user_id);
    fetch(window.name + 'cartCounter.php', {
      method: 'POST',
      header: {
        Accept: 'application/json',
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
        console.error(error);
        // Alert.alert('Internet Connection Error');
      });
  };
  return (
    <NativeBaseProvider>
      <Box safeAreaTop backgroundColor="#ad8765" />

      <TabView
        renderTabBar={props => (
          <MyTab {...props} select={selected} taps={setSelected} />
        )}
        swipeEnabled={false}
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{width: 100}}
        tabBarPosition="bottom"
      />
    </NativeBaseProvider>
  );
}
