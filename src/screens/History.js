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
export default function HistoryScreen() {
  const navigation = useNavigation();
  const [counterOder, setCounterOrder] = React.useState(0);
  const [user_id, set_user_id] = React.useState(0);
  const [historyData, setHistoryData] = React.useState([]);
  const [modalShow, setModalShow] = React.useState(false);
  const [referenceNumber, setReferenceNumber] = React.useState('');
  const [orderID, setOrderID] = React.useState(0);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
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
      getOrderHistory();
      // console.log('user_id' + user_id);
    });
    return () => {
      unsubscribe;
    };
  }, [navigation]);
  React.useEffect(() => {
    getOrderHistory();
    retrieveUser();
  }, [user_id]);
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
        // console.log(responseJson);
        if (responseJson.array_data != '') {
          setCounterOrder(responseJson.array_data[0].cart_count);
        }
      })
      .catch(error => {
        console.error(error);
        // Alert.alert('Internet Connection Error');
      });
  };
  const getOrderHistory = () => {
    setModalVisible(true);
    const formData = new FormData();
    formData.append('user_id', user_id);
    fetch(window.name + 'getOrderHistory.php', {
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
          var data = responseJson.array_data.map(function (item, index) {
            return {
              order_id: item.order_id,
              amount: item.amount,
              OR_number: item.OR_number,
              BC_number: item.BC_number,
              ref_number: item.ref_number,
              custID: item.custID,
              orderDate: item.orderDate,
              orderStatus: item.orderStatus,
            };
          });
          setHistoryData(data);
          cartCounter();
          setTimeout(() => {
            setModalVisible(false);
          }, 1000);
        } else {
          setHistoryData([]);
          setTimeout(() => {
            setModalVisible(false);
          }, 1000);
        }
      })
      .catch(error => {
        console.error(error);
        // Alert.alert('Internet Connection Error');
      });
  };
  const payNow = () => {
    // console.log(user_id);
    setModalShow(false);
    setModalVisible(true);
    const formData = new FormData();
    formData.append('user_id', user_id);
    formData.append('order_id', orderID);
    formData.append('ref_number', referenceNumber);
    fetch(window.name + 'payNow.php', {
      method: 'POST',
      header: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.array_data != '') {
          console.log(responseJson);
          if (responseJson.array_data[0].res == 1) {
            setReferenceNumber('');
            getOrderHistory();
            setTimeout(() => {
              setModalVisible(false);
            }, 1000);
          }
        }
      })
      .catch(error => {
        console.error(error);
        // Alert.alert('Internet Connection Error');
      });
  };
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getOrderHistory();
    setTimeout(function () {
      setRefreshing(false);
    }, 1000);
  }, []);
  return (
    <NativeBaseProvider safeAreaTop>
      <HStack
        shadow={6}
        w="100%"
        bg="#ad8765"
        px={3}
        py={4}
        justifyContent="space-between"
        alignItems="center">
        <HStack space={4} alignItems="center">
          <TouchableOpacity
            onPress={() => {
              navigation.openDrawer();
            }}>
            <Icon name="bars" size={22} color="white" />
          </TouchableOpacity>
          <Text color="white" fontSize={20} fontWeight="bold">
            Kinaiya
          </Text>
        </HStack>
        {/* <HStack space={2}>
          <TouchableOpacity
            style={{
              borderColor: 'black',
              borderWidth: 1,
              width: 50,
              height: 30,
            }}
            onPress={() => {
              console.log('cart');
              navigation.navigate('Cart');
            }}>
            <Icon name="shopping-cart" size={20} color="white" />
            {counterOder == 0 || counterOder == null ? null : (
              <Badge
                colorScheme="error"
                alignSelf="center"
                variant="solid"
                borderRadius={15}
                style={{
                  borderColor: 'black',
                  borderWidth: 1,
                  position: 'absolute',
                  top: 0,
                  left: -40,
                  bottom: 0,
                  width: 40,
                  height: 25,
                }}>
                {counterOder}
              </Badge>
            )}
          </TouchableOpacity>
        </HStack> */}
      </HStack>
      <Box m={2}>
        <Heading fontSize="xl" p="4" pb="3">
          Order History
        </Heading>
        <FlatList
          data={historyData}
          keyExtractor={item => item.order_id}
          renderItem={({item}) => (
            <TouchableOpacity
              disabled={item.orderStatus == 'Pending' ? false : true}
              onPress={() => {
                setModalShow(true);
                setOrderID(item.order_id);
              }}>
              <Box
                borderBottomWidth="1"
                _dark={{
                  borderColor: '#ad8765',
                }}
                borderColor="#ad8765"
                pl={['0', '4']}
                pr={['0', '5']}
                py="2">
                <HStack space={[2, 3]} justifyContent="space-between">
                  <Avatar
                    size="48px"
                    source={require('../assets/images/profile.jpg')}
                  />
                  <VStack>
                    <Text
                      _dark={{
                        color: 'warmGray.50',
                      }}
                      color="coolGray.800"
                      bold>
                      {item.order_id}{' '}
                      {item.ref_number != ''
                        ? ' (' + item.ref_number + ')'
                        : ' (No reference number)'}
                    </Text>
                    <Text
                      color="coolGray.600"
                      _dark={{
                        color: 'warmGray.200',
                      }}>
                      {item.amount}
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
                    {item.orderStatus}
                  </Text>
                </HStack>
              </Box>
            </TouchableOpacity>
          )}
          refreshControl={
            <RefreshControl
              title="Pull to refresh"
              tintColor="#fff"
              titleColor="#fff"
              colors={['#ad8765', '#ffddbf']}
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        />

        <Modal
          style={{
            justifyContent: 'center',
          }}
          animationType="fade"
          transparent={true}
          visible={modalShow}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setReferenceNumber('');
            setModalShow(!modalShow);
          }}>
          <Box
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Center bg="white" width={300} height={200} borderRadius={10} p={5}>
              <Text>Enter Reference number</Text>
              <Box mb={3}>
                <TextArea
                  value={referenceNumber}
                  onChangeText={text => setReferenceNumber(text)}
                  mt={3}
                  w="100%"
                  h={20}
                  placeholder="Reference number here.."
                />
              </Box>
              <Button.Group space={2}>
                <Button
                  variant="ghost"
                  colorScheme="blueGray"
                  onPress={() => {
                    setModalShow(false);
                    setReferenceNumber('');
                  }}>
                  Cancel
                </Button>
                <Button
                  bgColor="#bb936f"
                  bg="#ad8765"
                  onPress={() => {
                    payNow();
                  }}>
                  Pay Now
                </Button>
              </Button.Group>
            </Center>
          </Box>
        </Modal>
      </Box>
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
