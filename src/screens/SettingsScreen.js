import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  Share,
  ScrollView,
  Alert,
  SafeAreaView,
  ImageBackground,
  Modal,
  Switch,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon } from 'react-native-heroicons/solid';
import { launchImageLibrary } from 'react-native-image-picker';
import { is } from 'date-fns/locale';


const fontSFProMedium = 'SFProText-Medium';
const fontSFProSemiBold = 'SFProText-SemiBold';
const fontSFProBold = 'SFProText-Bold';


const SettingsScreen = ({ selectedScreenPage, stars, profileImageUri, setProfileImageUri, level, levelProgress, totalWords }) => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));

  const [isEditingNow, setIsEditingNow] = useState(false);

  const [enteredName, setEnteredName] = useState('');
  const [enteredSurname, setEnteredSurname] = useState('');
  const [enteredNationality, setEnteredNationality] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [nationality, setNationality] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const storedUri = await AsyncStorage.getItem('profileImageUri');
        if (storedUri) setProfileImageUri(storedUri);

        const storedName = await AsyncStorage.getItem('name');
        if (storedName) setName(storedName);

        const storedSurname = await AsyncStorage.getItem('surname');
        if (storedSurname) setSurname(storedSurname);

        const storedNationality = await AsyncStorage.getItem('nationality');
        if (storedNationality) setNationality(storedNationality);
      } catch (e) {
        Alert.alert('Error', 'Failed to load data from storage');
      }
    })();
  }, []);


  useEffect(() => {
    (async () => {
      try {
        const storedUri = await AsyncStorage.getItem('profileImageUri');
        if (storedUri) setProfileImageUri(storedUri);
      } catch (e) {
        Alert.alert('Error', 'Failed to load data from storage');
      }
    })();
  }, [selectedScreenPage, profileImageUri]);



  const handleSave = async () => {
    setName(enteredName);
    setSurname(enteredSurname);
    setNationality(enteredNationality);

    await AsyncStorage.setItem('name', enteredName);
    await AsyncStorage.setItem('surname', enteredSurname);
    await AsyncStorage.setItem('nationality', enteredNationality);

    setIsEditingNow(false);
  };








  const pickImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, async response => {
      if (!response.didCancel && !response.errorCode && response.assets?.length) {
        const uri = response.assets[0].uri;
        setProfileImageUri(uri);
        await AsyncStorage.setItem('profileImageUri', uri);
      }
    });
  };

  return (
    <View style={{
      width: dimensions.width,
      flex: 1,
      alignItems: 'center',
      justifyContent: 'flex-start',
      position: 'relative',
      marginTop: '12%',
    }} >
      <View style={{ width: '88%', height: '100%', paddingHorizontal: 4, position: 'relative', flex: 1, justifyContent: 'flex-start' }}>

        <View
          style={{
            width: '100%',
            alignSelf: 'center',
            marginBottom: dimensions.height * 0.01,

          }}
        >
          <View style={{
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: 'row',
            width: '100%', alignSelf: 'center',
          }}>
            <Text
              style={{
                fontFamily: fontSFProSemiBold,
                textAlign: "center",
                fontSize: dimensions.width * 0.07,

                color: 'white',
                paddingBottom: 8,

              }}
            >
              My Settings
            </Text>

            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <View style={{
                backgroundColor: 'white',
                borderRadius: dimensions.width * 0.1,
                paddingHorizontal: dimensions.width * 0.1,
                justifyContent: 'center',
                alignItems: 'center',
                marginLeft: '19%'


              }}>
                <Text
                  style={{
                    fontFamily: fontSFProSemiBold,
                    textAlign: "center",
                    fontSize: dimensions.width * 0.05,
                    padding: dimensions.width * 0.02,

                    color: '#CE571B',

                  }}
                >
                  {stars ? stars : '0'}
                </Text>
              </View>
              <Image
                source={require('../assets/icons/starIcon.png')}
                style={{
                  width: dimensions.width * 0.16,
                  height: dimensions.width * 0.16,
                  left: '-70%',
                  overflow: 'hidden',
                  textAlign: 'center'
                }}
                resizeMode="contain"
              />
            </View>

          </View>
        </View>

        <View style={{
          position: 'absolute',
          backgroundColor: '#FF6212',
          opacity: 1,
          bottom: 0,
          height: dimensions.height * 0.7,
          width: '116%',
          alignSelf: 'center',
          borderTopLeftRadius: dimensions.width * 0.21,
          borderTopRightRadius: dimensions.width * 0.21,
          paddingBottom: '50%'

        }}>
          <View style={{
            backgroundColor: profileImageUri ? 'transparent' : 'white',
            borderRadius: dimensions.width * 0.5,
            alignSelf: 'center',
            padding: profileImageUri ? 0 : dimensions.width * 0.1,
            marginTop: -dimensions.width * 0.23,
            marginBottom: dimensions.width * 0.05,
          }}>

            <TouchableOpacity onPress={pickImage}
              onLongPress={() => {

                Alert.alert(
                  'Delete photo',
                  'Are you sure you want to delete your profile picture?',
                  [
                    {
                      text: 'Cancel',
                      style: 'cancel',
                    },
                    {
                      text: 'Delete',
                      onPress: async () => {
                        await AsyncStorage.removeItem('profileImageUri');
                        setProfileImageUri(null);
                      },
                      style: 'destructive',
                    },
                  ],
                  { cancelable: true }
                )
              }}
            >
              <Image
                source={
                  profileImageUri
                    ? { uri: profileImageUri }
                    : require('../assets/images/profileImage.png')
                }
                style={{
                  width: profileImageUri ? dimensions.width * 0.45 : dimensions.width * 0.25,
                  height: profileImageUri ? dimensions.width * 0.45 : dimensions.width * 0.25,
                  overflow: 'hidden',
                  textAlign: 'center',
                  padding: dimensions.width * 0.02,
                  borderRadius: profileImageUri ? dimensions.width * 0.5 : 0,
                }}
                resizeMode="stretch"
              />
            </TouchableOpacity>
          </View>


          <View style={{
            backgroundColor: 'white',
            borderRadius: dimensions.width * 0.1,
            alignSelf: 'flex-start',
            marginLeft: '16%',
            marginBottom: -dimensions.width * 0.025,
            marginTop: -dimensions.height * 0.01,
            zIndex: 50,
          }}>
            <Text
              style={{
                fontWeight: 500,
                textAlign: "left",
                alignSelf: 'flex-start',
                fontSize: dimensions.width * 0.025,

                paddingHorizontal: dimensions.width * 0.02,
                paddingVertical: dimensions.width * 0.01,
                color: 'black',

              }}
            >
              Your Name
            </Text>

          </View>
          {isEditingNow ? (

            <View style={{
              zIndex: 1,
              width: '80%',
              alignItems: 'center',
              alignSelf: 'center',
              borderColor: 'rgba(255, 255, 255, 0.7)',
              borderWidth: 1.9,
              justifyContent: 'center',
              borderRadius: dimensions.width * 0.1,
            }}>
              <TextInput
                style={{
                  fontWeight: '500',
                  textAlign: "left",
                  alignSelf: 'flex-start',
                  fontSize: dimensions.width * 0.035,
                  paddingVertical: dimensions.width * 0.04,
                  paddingHorizontal: dimensions.width * 0.05,
                  color: 'white',
                  opacity: 0.7,
                  width: '100%',
                }}
                placeholder="Enter your Name..."
                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                value={enteredName}
                onChangeText={(text) => setEnteredName(text)}
              />
            </View>
          ) : (
            <View style={{
              zIndex: 1,
              width: '80%',
              alignItems: 'center',
              alignSelf: 'center',
              borderColor: 'rgba(255, 255, 255, 0.7)',
              borderWidth: 1.9,
              justifyContent: 'center',
              borderRadius: dimensions.width * 0.1,

            }}>
              <Text
                style={{
                  fontWeight: 500,
                  textAlign: "left",
                  alignSelf: 'flex-start',
                  fontSize: dimensions.width * 0.05,
                  padding: dimensions.width * 0.02,
                  paddingHorizontal: dimensions.width * 0.05,
                  color: 'white',

                }}
              >
                {name ? name : 'Please enter your name'}
              </Text>
            </View>
          )}





          <View style={{
            backgroundColor: 'white',
            borderRadius: dimensions.width * 0.1,
            alignSelf: 'flex-start',
            marginLeft: '16%',
            marginBottom: -dimensions.width * 0.025,
            marginTop: dimensions.height * 0.025,
            zIndex: 50,
          }}>
            <Text
              style={{
                fontWeight: 500,
                textAlign: "left",
                alignSelf: 'flex-start',
                fontSize: dimensions.width * 0.025,

                paddingHorizontal: dimensions.width * 0.02,
                paddingVertical: dimensions.width * 0.01,
                color: 'black',

              }}
            >
              Your Surname
            </Text>

          </View>
          {isEditingNow ? (
            <View style={{
              zIndex: 1,
              width: '80%',
              alignItems: 'center',
              alignSelf: 'center',
              borderColor: 'rgba(255, 255, 255, 0.7)',
              borderWidth: 1.9,
              justifyContent: 'center',
              borderRadius: dimensions.width * 0.1,
            }}>
              <TextInput
                style={{
                  fontWeight: '500',
                  textAlign: "left",
                  alignSelf: 'flex-start',
                  fontSize: dimensions.width * 0.035,
                  paddingVertical: dimensions.width * 0.04,
                  paddingHorizontal: dimensions.width * 0.05,
                  color: 'white',
                  opacity: 0.7,
                  width: '100%',
                }}
                placeholder="Enter your Surname..."
                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                value={enteredSurname}
                onChangeText={(text) => setEnteredSurname(text)}
              />
            </View>

          ) : (
            <View style={{
              zIndex: 1,
              width: '80%',
              alignItems: 'center',
              alignSelf: 'center',
              borderColor: 'rgba(255, 255, 255, 0.7)',
              borderWidth: 1.9,
              justifyContent: 'center',
              borderRadius: dimensions.width * 0.1,

            }}>
              <Text
                style={{
                  fontWeight: 500,
                  textAlign: "left",
                  alignSelf: 'flex-start',
                  fontSize: dimensions.width * 0.05,
                  padding: dimensions.width * 0.02,
                  paddingHorizontal: dimensions.width * 0.05,
                  color: 'white',

                }}
              >
                {surname ? surname : 'Please enter your surname'}
              </Text>

            </View>
          )}




          <View style={{
            backgroundColor: 'white',
            borderRadius: dimensions.width * 0.1,
            alignSelf: 'flex-start',
            marginLeft: '16%',
            marginBottom: -dimensions.width * 0.025,
            marginTop: dimensions.height * 0.025,
            zIndex: 50,
          }}>
            <Text
              style={{
                fontWeight: 500,
                textAlign: "left",
                alignSelf: 'flex-start',
                fontSize: dimensions.width * 0.025,

                paddingHorizontal: dimensions.width * 0.02,
                paddingVertical: dimensions.width * 0.01,
                color: 'black',

              }}
            >
              Your Nationality
            </Text>

          </View>
          {isEditingNow ? (
            <View style={{
              zIndex: 1,
              width: '80%',
              alignItems: 'center',
              alignSelf: 'center',
              borderColor: 'rgba(255, 255, 255, 0.7)',
              borderWidth: 1.9,
              justifyContent: 'center',
              borderRadius: dimensions.width * 0.1,
            }}>
              <TextInput
                style={{
                  fontWeight: '500',
                  textAlign: "left",
                  alignSelf: 'flex-start',
                  fontSize: dimensions.width * 0.035,
                  paddingVertical: dimensions.width * 0.04,
                  paddingHorizontal: dimensions.width * 0.05,
                  color: 'white',
                  opacity: 0.7,
                  width: '100%',
                }}
                placeholder="Enter your Nationality..."
                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                value={enteredNationality}
                onChangeText={(text) => setEnteredNationality(text)}
              />
            </View>
          ) : (
            <View style={{
              zIndex: 1,
              width: '80%',
              alignItems: 'center',
              alignSelf: 'center',
              borderColor: 'rgba(255, 255, 255, 0.7)',
              borderWidth: 1.9,
              justifyContent: 'center',
              borderRadius: dimensions.width * 0.1,

            }}>
              <Text
                style={{
                  fontWeight: 500,
                  textAlign: "left",
                  alignSelf: 'flex-start',
                  fontSize: dimensions.width * 0.05,
                  padding: dimensions.width * 0.02,
                  paddingHorizontal: dimensions.width * 0.05,
                  color: 'white',

                }}
              >
                {nationality ? nationality : 'Please enter your nationality'}
              </Text>
            </View>
          )}



          <TouchableOpacity
            onPress={() => {
              setIsEditingNow(!isEditingNow);
              if (isEditingNow) {
                handleSave();
              }
            }}
            style={{
              backgroundColor: 'white',
              borderRadius: dimensions.width * 0.1,
              alignSelf: 'flex-end',
              marginRight: '10%',
              marginBottom: -dimensions.width * 0.025,
              marginTop: dimensions.height * 0.021,
              zIndex: 50,
            }}>
            <Text
              style={{
                fontWeight: 500,
                textAlign: "left",
                alignSelf: 'flex-start',
                fontSize: dimensions.width * 0.046,
                fontFamily: fontSFProBold,
                fontWeight: 'bold',

                paddingVertical: dimensions.width * 0.02,
                paddingHorizontal: dimensions.width * 0.1,
                color: '#CE571B',

              }}
            >
              {isEditingNow ? 'Save' : 'Edit'}
            </Text>

          </TouchableOpacity>


          <Text
            style={{
              fontWeight: 500,
              textAlign: "left",
              alignSelf: 'flex-start',
              fontSize: dimensions.width < 380 ? dimensions.width * 0.05 : dimensions.width * 0.061,
              fontFamily: fontSFProBold,
              fontWeight: 'bold',
              marginTop: dimensions.width < 380 ? -dimensions.height * 0.04 : dimensions.height * 0.02,

              paddingVertical: dimensions.width * 0.02,
              paddingTop: dimensions.height * 0.02,
              paddingHorizontal: dimensions.width * 0.1,
              color: 'white',

            }}
          >
            Total words: {totalWords ? totalWords : '0'}
          </Text>


          

          <View style={{
            width: '80%',
            backgroundColor: '#fccdb5',
            borderRadius: dimensions.width * 0.1,
            alignSelf: 'center',
            position: 'relative',
            height: dimensions.width * 0.08,
            overflow: 'hidden',
          }}>
            <View style={{
              width: `${levelProgress}%`,
              backgroundColor: 'white',
              height: '100%',
              position: 'absolute',
              left: 0,
              top: 0,
            }} />
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: '100%',
              paddingHorizontal: dimensions.width * 0.02,
            }}>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center'
              }}>

                <Image
                  source={require('../assets/images/nextLvlImage.png')}
                  style={{
                    width: dimensions.width * 0.1,
                    height: dimensions.width * 0.1,
                    resizeMode: 'contain',
                  }}
                />
                <Text
                  style={{
                    fontFamily: fontSFProMedium,
                    fontSize: dimensions.width * 0.03,
                    color: 'black',
                    marginLeft: dimensions.width * 0.02,
                  }}
                >
                  {level + 1}00 words
                </Text>
              </View>
              <Text
                style={{
                  fontFamily: fontSFProMedium,
                  fontSize: dimensions.width * 0.04,
                  color: 'black',
                  marginRight: dimensions.width * 0.02,
                }}
              >
                {levelProgress}%
              </Text>
            </View>
          </View>
        </View>
      </View >
    </View >
  );
};

export default SettingsScreen;
