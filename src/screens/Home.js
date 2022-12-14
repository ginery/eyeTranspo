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

export default function HomeScreen() {
  const navigation = useNavigation();
  const [productData, setProductData] = React.useState([]);
  const [user_id, set_user_id] = React.useState(0);
  const toast = useToast();
  const [counterOder, setCounterOrder] = React.useState(0);
  const [refreshing, setRefreshing] = React.useState(false);
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
      getProducts();
      retrieveUser();

      console.log('user_id' + user_id);
    });
    return () => {
      unsubscribe;
    };
  }, [navigation]);
  React.useEffect(() => {
    getProducts();
    retrieveUser();
  }, [user_id]);

  const getProducts = () => {
    setModalVisible(true);
    fetch(window.name + 'getProducts.php', {
      method: 'GET',
      header: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        // console.log(responseJson);
        if (responseJson.array_data != '') {
          var data = responseJson.array_data.map(function (item, index) {
            return {
              product_id: item.id,
              category_id: item.category_id,
              name: item.name,
              price: item.price,
              photo: item.photo,
              shrtDesc: item.shrtDesc,
              prodAvailability: item.prodAvailability,
            };
          });

          setProductData(data);
          cartCounter();
          setTimeout(() => {
            setModalVisible(false);
          }, 1000);
          // console.log(data);
        } else {
          setProductData([]);
          cartCounter();
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
        // console.log(respo/nseJson);
        if (responseJson.array_data != '') {
          if (responseJson.array_data[0].res == 1) {
            toast.show(
              {
                render: () => {
                  return (
                    <Box bg="primary.500" px="2" py="1" rounded="sm" mb={5}>
                      Item added to card
                    </Box>
                  );
                },
              },
              500,
            );
            cartCounter();
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
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getProducts();
    cartCounter();
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
        <HStack space={2}>
          <TouchableOpacity
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
                  position: 'absolute',
                  top: -10,
                  left: -40,
                  bottom: 0,
                  width: 40,
                  height: 25,
                }}>
                {counterOder}
              </Badge>
            )}
          </TouchableOpacity>
        </HStack>
      </HStack>
      <Box
        p={2}
        style={{
          // borderColor: 'black',
          // borderWidth: 1,
          height: '91%',
        }}>
        <FlatList
          style={{
            // borderColor: 'black',
            // borderWidth: 1,
            height: '100%',
          }}
          contentContainerStyle={{
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: 10,
          }}
          w="100%"
          h="100%"
          data={productData}
          numColumns={2}
          keyExtractor={item => item.product_id}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() => {
                setModalVisible(true);
                addToCart(item.product_id);
              }}
              alignItems="center"
              style={{flex: 1, marginRight: 10, marginBottom: 10}}>
              <Box>
                <Box
                  maxW="100%"
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
                  <Box>
                    <AspectRatio w="100%" ratio={16 / 9}>
                      <Image
                        source={{
                          uri: global.global_image + item.photo,
                        }}
                        alt="image"
                      />
                    </AspectRatio>
                  </Box>
                  <Stack p="2">
                    <Stack space={2}>
                      <Text
                        fontSize="xs"
                        _light={{
                          color: '#ad8765',
                        }}
                        _dark={{
                          color: 'white',
                        }}
                        fontWeight="500"
                        ml="-0.5"
                        mt="-1">
                        {item.name}
                      </Text>
                    </Stack>

                    <HStack alignItems="center">
                      <Text
                        color="coolGray.600"
                        _dark={{
                          color: 'warmGray.200',
                        }}
                        fontWeight="400">
                        PHP. {item.price}
                      </Text>
                    </HStack>
                  </Stack>
                </Box>
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
