import * as React from 'react';
import {
  Box,
  Heading,
  VStack,
  FormControl,
  Input,
  Button,
  Center,
  NativeBaseProvider,
  AspectRatio,
  Image,
  Stack,
  Text,
  HStack,
  Icon,
  useToast,
} from 'native-base';
import FontIcon from 'react-native-vector-icons/FontAwesome5';
import {
  TouchableOpacity,
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Modal,
  ActivityIndicator,
} from 'react-native';
import {useHeaderHeight} from '@react-navigation/elements';
export default function Register({navigation}) {
  const height = useHeaderHeight();
  const toast = useToast();
  const [fname, setFname] = React.useState('');
  const [lname, setLname] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [contactNumber, setContactNumber] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [retypePassword, setRetypePassword] = React.useState('');
  const [buttonStatus, setButtonStatus] = React.useState(false);
  const [modalVisible, setModalVisible] = React.useState(false);
  const registerUser = () => {
    setModalVisible(true);
    console.log(retypePassword);
    if (
      fname == '' ||
      lname == '' ||
      email == '' ||
      address == '' ||
      password == '' ||
      contactNumber == ''
    ) {
      toast.show({
        render: () => {
          return (
            <Box bg="error.500" px="2" py="1" rounded="sm" mb={5}>
              <Text color="white">
                Oh no! Please Fill out all the text field.
              </Text>
            </Box>
          );
        },
      });
    } else {
      if (password == retypePassword) {
        const formData = new FormData();
        formData.append('fname', fname);
        formData.append('lname', lname);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('contactNumber', contactNumber);
        formData.append('address', address);
        fetch(window.name + 'register.php', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
          },
          body: formData,
        })
          .then(response => response.json())
          .then(responseJson => {
            if (responseJson.array_data != '') {
              console.log(responseJson);
              var data = responseJson.array_data[0];
              console.log(data);
              if (data.res >= 1) {
                toast.show({
                  render: () => {
                    return (
                      <Box bg="emerald.500" px="2" py="1" rounded="sm" mb={5}>
                        <Text color="white">
                          Great! Successfully added account.
                        </Text>
                      </Box>
                    );
                  },
                });
                setButtonStatus(true);
                setTimeout(() => {
                  setModalVisible(false);
                }, 1000);
                setTimeout(function () {
                  navigation.navigate('Login');
                }, 1500);
              } else if (data.res == -2) {
                Alert.alert('Name already exist.');
              } else {
                Alert.alert('Something went wrong.');
              }
            }
          })
          .catch(error => {
            console.error(error);
            Alert.alert('Internet Connection Error');
          });
      } else {
        toast.show({
          render: () => {
            return (
              <Box bg="warning.500" px="2" py="1" rounded="sm" mb={5}>
                <Text color="white">Oops! Password doesn't match</Text>
              </Box>
            );
          },
        });
      }
    }
  };
  return (
    <NativeBaseProvider>
      <ImageBackground
        source={require('../assets/images/login_bg.png')}
        resizeMode="cover"
        style={{flex: 1, justifyContent: 'center'}}>
        <Box alignItems="center" w="100%">
          <Box
            style={
              {
                // borderBottomLeftRadius: 100,
                // borderColor: 'black',
                // borderWidth: 1,
              }
            }
            overflow="hidden"
            borderColor="coolGray.200"
            _web={{
              shadow: 2,
              borderWidth: 0,
            }}
            _light={{
              backgroundColor: 'gray.50',
            }}
            background="rgba(52, 52, 52, 0.8)"
            w="100%"
            h={100}>
            <Box>
              <Image
                style={{
                  // borderColor: 'green',
                  // borderWidth: 1,
                  alignSelf: 'flex-end',
                  width: 240,
                  height: 50,
                  resizeMode: 'stretch',
                }}
                size="lg"
                source={require('../assets/images/Kinaiya-logo_login.png')}
                alt="Alternate Text"
              />

              <Heading
                pr={5}
                style={{
                  // borderColor: 'black',
                  // borderWidth: 1,
                  textAlign: 'right',
                }}
                mt="1"
                color="coolGray.600"
                _dark={{
                  color: 'warmGray.200',
                }}
                fontWeight="medium"
                size="xs">
                <Text color="white">
                  An E-commerce Website for the Ituman-Maghat-Bukidnon IPs of
                  Negros Occidental
                </Text>
              </Heading>
              {/* <AspectRatio w="100%" ratio={16 / 9}></AspectRatio> */}
            </Box>
          </Box>
        </Box>
        <Center px="3" background="#E1D9D1">
          <Center w="100%">
            <Box safeArea p="2" w="90%">
              <VStack space={3} mt="5">
                <FormControl
                  bg="white"
                  borderRadius={25}
                  borderColor="gray.100"
                  borderWidth={2}>
                  <Input
                    variant="rounded"
                    style={{
                      color: 'black',
                      backgroundColor: 'white',
                    }}
                    w="100%"
                    onChangeText={text => setFname(text)}
                    InputLeftElement={
                      <Icon
                        as={<FontIcon name="user" />}
                        size={4}
                        ml="3"
                        mr="3"
                        color="black"
                      />
                    }
                    placeholder="First Name"
                  />
                </FormControl>
                <FormControl
                  bg="white"
                  borderRadius={25}
                  borderColor="gray.100"
                  borderWidth={2}>
                  <Input
                    variant="rounded"
                    style={{
                      color: 'black',
                      backgroundColor: 'white',
                    }}
                    w="100%"
                    onChangeText={text => setLname(text)}
                    InputLeftElement={
                      <Icon
                        as={<FontIcon name="user" />}
                        size={4}
                        ml="3"
                        mr="3"
                        color="black"
                      />
                    }
                    placeholder="Last Name"
                  />
                </FormControl>
                <FormControl
                  bg="white"
                  borderRadius={25}
                  borderColor="gray.100"
                  borderWidth={2}>
                  <Input
                    variant="rounded"
                    style={{
                      color: 'black',
                      backgroundColor: 'white',
                    }}
                    w="100%"
                    onChangeText={text => setContactNumber(text)}
                    InputLeftElement={
                      <Icon
                        as={<FontIcon name="mobile" />}
                        size={4}
                        ml="3"
                        mr="3"
                        color="black"
                      />
                    }
                    placeholder="Phone Number"
                  />
                </FormControl>
                <FormControl
                  bg="white"
                  borderRadius={25}
                  borderColor="gray.100"
                  borderWidth={2}>
                  <Input
                    variant="rounded"
                    style={{
                      color: 'black',
                      backgroundColor: 'white',
                    }}
                    w="100%"
                    onChangeText={text => setAddress(text)}
                    InputLeftElement={
                      <Icon
                        as={<FontIcon name="building" />}
                        size={4}
                        ml="3"
                        mr="3"
                        color="black"
                      />
                    }
                    placeholder="Address"
                  />
                </FormControl>
                <FormControl
                  bg="white"
                  borderRadius={25}
                  borderColor="gray.100"
                  borderWidth={2}>
                  <Input
                    variant="rounded"
                    style={{
                      color: 'black',
                      backgroundColor: 'white',
                    }}
                    w="100%"
                    onChangeText={text => setEmail(text)}
                    InputLeftElement={
                      <Icon
                        as={<FontIcon name="user" />}
                        size={4}
                        ml="3"
                        mr="3"
                        color="black"
                      />
                    }
                    placeholder="Email"
                  />
                </FormControl>
                <FormControl
                  bg="white"
                  borderRadius={25}
                  borderColor="gray.100"
                  borderWidth={2}>
                  <Input
                    variant="rounded"
                    style={{
                      color: 'black',
                      backgroundColor: 'white',
                    }}
                    w="100%"
                    type="password"
                    onChangeText={text => setPassword(text)}
                    InputLeftElement={
                      <Icon
                        as={<FontIcon name="lock" />}
                        size={4}
                        ml="3"
                        mr="3"
                        color="black"
                      />
                    }
                    placeholder="Password"
                  />
                </FormControl>
                <FormControl
                  bg="white"
                  borderRadius={25}
                  borderColor="gray.100"
                  borderWidth={2}>
                  <Input
                    variant="rounded"
                    style={{
                      color: 'black',
                      backgroundColor: 'white',
                    }}
                    w="100%"
                    type="password"
                    onChangeText={text => setRetypePassword(text)}
                    InputLeftElement={
                      <Icon
                        as={<FontIcon name="lock" />}
                        size={4}
                        ml="3"
                        mr="3"
                        color="black"
                      />
                    }
                    placeholder="Retype Password"
                  />
                </FormControl>
                <Button
                  disabled={buttonStatus}
                  mt="2"
                  onPress={() => {
                    registerUser();
                  }}
                  bgColor="#bb936f"
                  bg="#ad8765"
                  style={{borderRadius: 20}}>
                  Submit
                </Button>
                <HStack
                  space={1}
                  alignItems="center"
                  style={{
                    //   borderColor: 'black',
                    //   borderWidth: 1,
                    //   backgroundColor: '#8b8b8b',
                    justifyContent: 'center',
                    alignItems: 'center',

                    //   height: 100,
                  }}>
                  <Text style={{color: 'gray'}}>Already register?</Text>

                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('Login');
                    }}>
                    <Text
                      style={{
                        color: '#ad8765',
                        borderBottomWidth: 1,
                        borderColor: '#ad8765',
                      }}>
                      SIGN IN
                    </Text>
                  </TouchableOpacity>
                </HStack>
              </VStack>
            </Box>
          </Center>
        </Center>
      </ImageBackground>
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
