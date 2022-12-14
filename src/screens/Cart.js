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
  FlatList,
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
  Badge,
  Divider,
  useToast,
  Pressable,
  Icon,
  Image,
} from 'native-base';
import Rating from 'react-native-easy-rating';
import {useNavigation} from '@react-navigation/native';
import ProgressBar from 'react-native-animated-progress';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontIcon from 'react-native-vector-icons/FontAwesome5';
import MapViewDirections from 'react-native-maps-directions';
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

export default function Cart({navigation, route}) {
  const toast = useToast();
  const [btnEdit, setBtnSet] = React.useState(false);
  const [user_id, set_user_id] = React.useState(0);
  const [cartData, setCartData] = React.useState([]);
  const [totalAmount, setTotalAmount] = React.useState(0);
  const [orderStatus, setOrderStatus] = React.useState('');
  const [modalVisible, setModalVisible] = React.useState(false);
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
      getCart();
      getTotalAmount();
      getOrderStatus();
      // console.log('user_id' + user_id);
    });
    return () => {
      unsubscribe;
    };
  }, [navigation]);
  React.useEffect(() => {
    retrieveUser();
    getCart();
    getTotalAmount();
    getOrderStatus();
  }, [user_id]);
  const getCart = () => {
    setModalVisible(true);
    const formData = new FormData();
    formData.append('user_id', user_id);
    fetch(window.name + 'getCart.php', {
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
          var data = responseJson.array_data.map(function (item, index) {
            return {
              cart_id: item.id,
              user_id: item.user_id,
              product_id: item.product_id,
              product: item.product,
              product_photo: item.product_photo,
              photo: item.photo,
              price: item.price,
              quantity: item.quantity,
            };
          });
          setCartData(data);
          getTotalAmount();
          setTimeout(() => {
            setModalVisible(false);
          }, 1000);
        } else {
          setCartData([]);
          getTotalAmount(0);
          setTimeout(() => {
            setModalVisible(false);
          }, 1000);
        }
      })
      .catch(error => {
        console.error(error);
        Alert.alert('Internet Connection Error');
      });
  };
  const addToCart = product_id => {
    setModalVisible(true);
    const formData = new FormData();
    formData.append('user_id', user_id);
    formData.append('product_id', product_id);
    fetch(window.name + 'addToCart.php', {
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
          if (responseJson.array_data[0].res == 1) {
            toast.show(
              {
                render: () => {
                  return (
                    <Box bg="success.500" px="2" py="1" rounded="sm" mb={5}>
                      Item quantity modified.
                    </Box>
                  );
                },
              },
              500,
            );
            getCart();
          }
        }
      })
      .catch(error => {
        console.error(error);
        Alert.alert('Internet Connection Error');
      });
  };
  const minustoCart = product_id => {
    setModalVisible(true);
    const formData = new FormData();
    formData.append('user_id', user_id);
    formData.append('product_id', product_id);
    fetch(window.name + 'minusToCart.php', {
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
          if (responseJson.array_data[0].res == 1) {
            toast.show({
              render: () => {
                return (
                  <Box bg="success.500" px="2" py="1" rounded="sm" mb={5}>
                    Item quantity modified.
                  </Box>
                );
              },
            });
            getCart();
          }
        }
      })
      .catch(error => {
        console.error(error);
        Alert.alert('Internet Connection Error');
      });
  };
  const getTotalAmount = () => {
    const formData = new FormData();
    formData.append('user_id', user_id);
    fetch(window.name + 'getTotalAmountOrders.php', {
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
          // console.log(responseJson);
          setTotalAmount(responseJson.array_data[0].totalAmount);
        }
      })
      .catch(error => {
        console.error(error);
        Alert.alert('Internet Connection Error');
      });
  };
  const deleteProductToCart = cart_id => {
    setModalVisible(true);
    const formData = new FormData();
    formData.append('user_id', user_id);
    formData.append('cart_id', cart_id);
    fetch(window.name + 'deleteProduct.php', {
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
          toast.show({
            render: () => {
              return (
                <Box bg="error.500" px="2" py="1" rounded="sm" mb={5}>
                  Item deleted.
                </Box>
              );
            },
          });
          getCart();
        }
      })
      .catch(error => {
        console.error(error);
        Alert.alert('Internet Connection Error');
      });
  };
  const checkOutOrder = () => {
    setModalVisible(true);
    const formData = new FormData();
    formData.append('user_id', user_id);
    fetch(window.name + 'checkOutOrder.php', {
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
            toast.show({
              render: () => {
                return (
                  <Box bg="success.500" px="2" py="1" rounded="sm" mb={5}>
                    Great! Check out success.
                  </Box>
                );
              },
            });
            getCart();
            setTimeout(() => {
              navigation.navigate('History');
              setModalVisible(false);
            }, 1000);
          } else {
            toast.show({
              render: () => {
                return (
                  <Box bg="error.500" px="2" py="1" rounded="sm" mb={5}>
                    Empty cart.
                  </Box>
                );
              },
            });
            getCart();
            setTimeout(() => {
              setModalVisible(false);
            }, 1000);
          }
        }
      })
      .catch(error => {
        console.error(error);
        Alert.alert('Internet Connection Error');
      });
  };
  const getOrderStatus = () => {
    const formData = new FormData();
    formData.append('user_id', user_id);
    fetch(window.name + 'getOrderStatus.php', {
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
          setOrderStatus(responseJson.array_data[0].order_status);
        } else {
          setOrderStatus('');
        }
      })
      .catch(error => {
        console.error(error);
        Alert.alert('Internet Connection Error');
      });
  };
  return (
    <NativeBaseProvider>
      <HStack
        shadow={6}
        bg="#ad8765"
        px={3}
        py={4}
        justifyContent="space-between"
        alignItems="center">
        <HStack space={4} alignItems="center">
          <TouchableOpacity
            onPress={() => {
              console.log('test');
              navigation.goBack();
            }}>
            <FontIcon name="arrow-left" size={22} color="white" />
          </TouchableOpacity>
          <Text color="white" fontSize={20} fontWeight="bold">
            Cart
          </Text>
        </HStack>
        <HStack space={2}>
          {btnEdit ? (
            <TouchableOpacity
              onPress={() => {
                setBtnSet(false);
              }}>
              <Text color="white" fontSize={15}>
                Done
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => {
                setBtnSet(true);
              }}>
              <Text color="white" fontSize={15}>
                Edit
              </Text>
            </TouchableOpacity>
          )}
        </HStack>
      </HStack>
      {/* <VStack alignItems="center">
        <Center w="100%" h="40%" bg="white">
          <VStack space={2} alignItems="center">
            <Center w="80" h="20">
              <HStack>
                <Text style={{fontSize: 16, fontWeight: 'bold'}}>
                  Total Fare:
                </Text>
                <Text style={{fontSize: 16, fontWeight: 'bold'}}> 1.00</Text>
              </HStack>
            </Center>
          </VStack>
        </Center>
      </VStack> */}
      <Box>
        {cartData == '' ? null : (
          <FlatList
            data={cartData}
            keyExtractor={item => item.cart_id}
            renderItem={({item}) => (
              <Box
                m={2}
                borderBottomWidth="1"
                _dark={{
                  borderColor: '#ad8765',
                }}
                borderColor="#ad8765"
                pl={['0', '4']}
                pr={['0', '5']}
                py="2">
                <HStack space={[2, 3]} justifyContent="space-between">
                  <Center>
                    <Image
                      source={{
                        uri: global.global_image + item.product_photo,
                      }}
                      alt="Alternate Text"
                      size="md"
                    />
                  </Center>
                  <VStack>
                    <Text
                      _dark={{
                        color: 'warmGray.50',
                      }}
                      color="coolGray.800"
                      bold>
                      {item.product}
                    </Text>
                    <Text
                      color="coolGray.600"
                      _dark={{
                        color: 'warmGray.200',
                      }}>
                      {item.price}
                    </Text>
                    <HStack>
                      <TouchableOpacity
                        onPress={() => {
                          minustoCart(item.product_id);
                        }}
                        style={{
                          borderColor: '#c9c9c9',
                          borderWidth: 1,
                          width: 30,
                        }}>
                        <Center>
                          <Text>
                            <FontIcon name="minus" size={10} />
                          </Text>
                        </Center>
                      </TouchableOpacity>
                      <Center
                        style={{
                          borderColor: '#c9c9c9',
                          borderWidth: 1,
                          width: 40,
                        }}>
                        {item.quantity}
                      </Center>
                      <TouchableOpacity
                        onPress={() => {
                          addToCart(item.product_id);
                        }}
                        style={{
                          borderColor: '#c9c9c9',
                          borderWidth: 1,
                          width: 30,
                        }}>
                        <Center>
                          <Text>
                            <FontIcon name="plus" size={10} />
                          </Text>
                        </Center>
                      </TouchableOpacity>
                    </HStack>
                  </VStack>
                  <Spacer />
                  {/* <Text
                  fontSize="xs"
                  _dark={{
                    color: 'warmGray.50',
                  }}
                  color="coolGray.800"
                  alignSelf="flex-start">
                  {item.timeStamp}
                </Text> */}
                  {btnEdit ? (
                    <TouchableOpacity
                      onPress={() => {
                        deleteProductToCart(item.cart_id);
                      }}
                      style={
                        {
                          // borderColor: '#c9c9c9',
                          // borderWidth: 1,
                        }
                      }>
                      <Text
                        fontSize="xs"
                        _dark={{
                          color: 'warmGray.50',
                        }}
                        color="coolGray.800"
                        alignSelf="flex-start">
                        <FontIcon name="trash" size={15} color="#ef4444" />
                      </Text>
                    </TouchableOpacity>
                  ) : null}
                </HStack>
              </Box>
            )}
          />
        )}
      </Box>

      <HStack
        bg="white"
        alignItems="center"
        safeAreaBottom
        shadow={6}
        width="100%"
        h={50}
        style={{
          position: 'absolute',
          bottom: 0,

          flexDirection: 'row',
        }}>
        <Box
          style={{
            // borderColor: 'black',
            // borderWidth: 1,
            alignContent: 'flex-start',
            alignSelf: 'flex-start',
            marginRight: 'auto',
            height: '100%',
            justifyContent: 'center',
          }}>
          <Center>
            <HStack>
              <Text
                style={{
                  color: '#ad8765',
                  fontWeight: 'bold',
                }}>
                Total Amount:
              </Text>
              <Text style={{marginLeft: 10, fontSize: 15}}>
                PHP. {totalAmount}
              </Text>
            </HStack>
          </Center>
        </Box>
        <Box
          style={{
            alignContent: 'flex-start',
            alignSelf: 'flex-start',
          }}>
          <Button
            borderRadius={0}
            h="100%"
            bgColor="#bb936f"
            bg="#ad8765"
            onPress={() => {
              checkOutOrder();
            }}>
            Check Out
          </Button>
        </Box>
      </HStack>

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
