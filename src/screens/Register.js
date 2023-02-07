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
  ScrollView,
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
import Tts from 'react-native-tts';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
export default function Register({navigation}) {
  const height = useHeaderHeight();
  const toast = useToast();
  const [fname, setFname] = React.useState('');
  const [mname, setMname] = React.useState('');
  const [lname, setLname] = React.useState('');
  const [contactNumber, setContactNumber] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [buttonStatus, setButtonStatus] = React.useState(false);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [image_preview, Setimage_preview] = React.useState(false);
  const [imageUri, SetimageUri] = React.useState('');
  const [image_file_type, Setimage_file_type] = React.useState('');
  const [imageName, setImageName] = React.useState('');
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      //console.log('refreshed_home');
      Tts.speak('You are in signup page.');
      Tts.speak('Kindly enter the information required to register.');

      // retrieveIp();
      // setModalShow(true);
    });

    return unsubscribe;
  }, [navigation]);
  const registerUser = () => {
    Tts.speak('Signing up..please wait');
    if (
      fname == '' ||
      lname == '' ||
      password == '' ||
      contactNumber == '' ||
      username == ''
    ) {
      Tts.speak('Oh no! Please fill out all the informations required.');
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
      setModalVisible(true);
      // if (password == retypePassword) {
      const formData = new FormData();
      formData.append('fname', fname);
      formData.append('mname', mname);
      formData.append('lname', lname);
      formData.append('contactNumber', contactNumber);
      formData.append('username', username);
      formData.append('password', password);
      formData.append('file', {
        uri: imageUri,
        name: imageName,
        type: image_file_type,
      });

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
              Tts.speak('Great! you are successfully registered.');
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
              setModalVisible(true);
              Alert.alert('Name already exist.');
            } else {
              setModalVisible(true);
              Alert.alert('Something went wrong.');
            }
          }
        })
        .catch(error => {
          console.error(error);
          Alert.alert('Internet Connection Error');
          setModalVisible(false);
        });
    }
  };
  const open_file = () => {
    const options = {
      title: 'Select Avatar',
      customButtons: [{name: 'fb', title: 'Choose Photo from Facebook'}],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    launchCamera(options, response => {
      // Use launchImageLibrary to open image gallery
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = {uri: response.assets[0].uri};

        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };

        console.log(source);
        Setimage_file_type(response.assets[0].type);
        SetimageUri(response.assets[0].uri);
        setImageName(response.assets[0].fileName);
        Setimage_preview(true);
      }
    });
  };
  return (
    <NativeBaseProvider>
      <Box alignItems="center" w="100%">
        <Box
          style={
            {
              // // borderBottomLeftRadius: 100,
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
          background="white"
          w="100%"
          h={110}>
          <Box>
            <Image
              style={{
                // borderColor: 'green',
                // borderWidth: 1,
                alignSelf: 'flex-end',
                width: 100,
                height: 50,
                resizeMode: 'stretch',
              }}
              size="lg"
              source={require('../assets/images/eyetranspo_banner.png')}
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
              size="md">
              <Text color="coolGray.600">
                A bus tracker app specially designed for visually impared
                passenger.
              </Text>
            </Heading>
            {/* <AspectRatio w="100%" ratio={16 / 9}></AspectRatio> */}
          </Box>
        </Box>
      </Box>
      <ScrollView w={['100%', '300']} h="80">
        <Center px="3" mt={2} background="white">
          <Center w="100%">
            <Box safeArea p="2" w="90%">
              <VStack space={3} mt="5">
                <FormControl bg="white">
                  <Input
                    variant="filled"
                    style={{
                      color: 'white',
                      backgroundColor: '#0033c491',
                      borderRadius: 15,
                      height: 80,
                      fontSize: 50,
                    }}
                    w="100%"
                    onChangeText={text => setFname(text)}
                    placeholder="First Name"
                    placeholderTextColor="white"
                    onPressIn={() => {
                      Tts.stop();
                      Tts.speak('Please Enter your first name here.');
                    }}
                  />
                </FormControl>
                <FormControl bg="white">
                  <Input
                    variant="filled"
                    style={{
                      color: 'white',
                      backgroundColor: '#0033c491',
                      borderRadius: 15,
                      height: 80,
                      fontSize: 50,
                    }}
                    w="100%"
                    onChangeText={text => setMname(text)}
                    placeholder="Mid Name"
                    placeholderTextColor="white"
                    onPressIn={() => {
                      Tts.stop();
                      Tts.speak('Please Enter your middle name here.');
                    }}
                  />
                </FormControl>
                <FormControl bg="white">
                  <Input
                    variant="filled"
                    style={{
                      color: 'white',
                      backgroundColor: '#0033c491',
                      borderRadius: 15,
                      height: 80,
                      fontSize: 50,
                    }}
                    w="100%"
                    onChangeText={text => setLname(text)}
                    placeholder="Last Name"
                    placeholderTextColor="white"
                    onPressIn={() => {
                      Tts.stop();
                      Tts.speak('Please Enter your last name here.');
                    }}
                  />
                </FormControl>
                <FormControl bg="white">
                  <Input
                    variant="filled"
                    style={{
                      color: 'white',
                      backgroundColor: '#0033c491',
                      borderRadius: 15,
                      height: 80,
                      fontSize: 50,
                    }}
                    w="100%"
                    onChangeText={text => setContactNumber(text)}
                    placeholder="Phone #"
                    placeholderTextColor="white"
                    onPressIn={() => {
                      Tts.stop();
                      Tts.speak('Please Enter your phone number here.');
                    }}
                  />
                </FormControl>

                <FormControl bg="white">
                  <Input
                    variant="filled"
                    style={{
                      color: 'white',
                      backgroundColor: '#0033c491',
                      borderRadius: 15,
                      height: 80,
                      fontSize: 50,
                    }}
                    w="100%"
                    type="text"
                    onChangeText={text => setUsername(text)}
                    placeholder="Username"
                    placeholderTextColor="white"
                    onPressIn={() => {
                      Tts.stop();
                      Tts.speak('Please Enter your username here.');
                    }}
                  />
                </FormControl>
                <FormControl bg="white">
                  <Input
                    variant="filled"
                    style={{
                      color: 'white',
                      backgroundColor: '#0033c491',
                      borderRadius: 15,
                      height: 80,
                      fontSize: 50,
                    }}
                    w="100%"
                    type="password"
                    onChangeText={text => setPassword(text)}
                    placeholder="Password"
                    placeholderTextColor="white"
                    onPressIn={() => {
                      Tts.stop();
                      Tts.speak('Please Enter your password here.');
                    }}
                  />
                </FormControl>

                <Button
                  style={{
                    height: 80,
                  }}
                  disabled={buttonStatus}
                  mt="2"
                  onPress={() => {
                    open_file();
                  }}
                  bgColor="#f25655"
                  bg="#dd302f"
                  _text={{color: 'white', fontSize: 30}}>
                  UPLOAD PWD ID
                </Button>
                <Button
                  style={{
                    height: 80,
                  }}
                  disabled={buttonStatus}
                  mt="2"
                  onPress={() => {
                    Tts.stop();
                    registerUser();
                  }}
                  bgColor="#f25655"
                  bg="#dd302f"
                  _text={{color: 'white', fontSize: 30}}>
                  SIGN UP
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
                  <Text style={{color: 'gray', fontSize: 25, paddingTop: 5}}>
                    Already register?
                  </Text>

                  <TouchableOpacity
                    onPress={() => {
                      Tts.stop();
                      navigation.navigate('Login');
                    }}>
                    <Text
                      style={{
                        color: '#dd302f',
                        borderBottomWidth: 1,
                        borderColor: '#dd302f',
                        fontSize: 25,
                        paddingTop: 5,
                      }}>
                      SIGN IN
                    </Text>
                  </TouchableOpacity>
                </HStack>
              </VStack>
            </Box>
          </Center>
        </Center>
      </ScrollView>

      <Modal
        style={{
          justifyContent: 'center',
        }}
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          // Alert.alert('Modal has been closed.');
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
