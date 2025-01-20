import React, { useEffect, useState, useMemo, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
  Alert,
  SafeAreaView,
  ImageBackground,
  Modal,
  TextInput,

} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import StatisticScreen from './StatisticScreen';
import SettingsScreen from './SettingsScreen';
import TeachScreen from './TeachScreen';
import GamingScreen from './GamingScreen';
import moment from 'moment';


import { useDispatch, useSelector } from 'react-redux';
import { updateUserData, saveUserData } from '../redux/userSlice';

const fontSFProMedium = 'SFProText-Medium';
const fontSFProSemiBold = 'SFProText-SemiBold';
const fontSFProBold = 'SFProText-Bold';
const fontSFProHeavy = 'SFProText-Heavy';
const fontSigmarRegular = 'Sigmar-Regular';
const fontSigmarOne = 'SigmarOne-Regular';


const HomeScreen = () => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [selectedScreenPage, setSelectedScreenPage] = useState('Home');
  const [level, setLevel] = useState(1);
  const [levelProgress, setLevelProgress] = useState(0);
  const [totalWords, setTotalWords] = useState(0);

  const dispatch = useDispatch();
  const stars = useSelector(state => state.user.stars);

  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [profileImageUri, setProfileImageUri] = useState(null);
  const [lastClaim, setLastClaim] = useState(null);
  const [nextClaimTime, setNextClaimTime] = useState(null);
  const [timer, setTimer] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [claimAmount, setClaimAmount] = useState(300);

  useEffect(() => {
    const fetchLastClaim = async () => {
      const lastClaimTime = await AsyncStorage.getItem('lastClaim');
      const lastClaimAmount = await AsyncStorage.getItem('lastClaimAmount');
      if (lastClaimTime) {
        setLastClaim(moment(lastClaimTime));
        calculateNextClaim(moment(lastClaimTime));
        setClaimAmount(lastClaimAmount ? parseInt(lastClaimAmount) + 100 : 300);
      } else {
        setLastClaim(null);
        setNextClaimTime(moment().add(24, 'hours'));
        setClaimAmount(300);
      }
    };

    fetchLastClaim();
  }, []);


  useEffect(() => {
    if (nextClaimTime) {
      const interval = setInterval(() => {
        const now = moment();
        const duration = moment.duration(nextClaimTime.diff(now));
        setTimer(formatTime(duration.hours(), duration.minutes(), duration.seconds()));
        if (duration.asSeconds() <= 0) {
          setDisabled(false);
          clearInterval(interval);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [nextClaimTime]);

  const formatTime = (hours, minutes, seconds) => {
    const pad = (num) => (num < 10 ? `0${num}` : num);
    return `${pad(hours)}:${pad(minutes)}h`;
  };

  const calculateNextClaim = (lastClaimTime) => {
    const nextClaim = lastClaimTime.add(24, 'hours');
    setNextClaimTime(nextClaim);
    setDisabled(true);
  };

  const handleClaim = async () => {
    const now = moment();
    await AsyncStorage.setItem('lastClaim', now.toISOString());
    await AsyncStorage.setItem('lastClaimAmount', claimAmount.toString());
    setLastClaim(now);
    calculateNextClaim(now);
    addStars(claimAmount);
    setClaimAmount(claimAmount + 100);
  };

  useEffect(() => {
    (async () => {
      try {
        const storedUri = await AsyncStorage.getItem('profileImageUri');
        if (storedUri) setProfileImageUri(storedUri);

        const storedName = await AsyncStorage.getItem('name');
        if (storedName) setName(storedName);

        const storedSurname = await AsyncStorage.getItem('surname');
        if (storedSurname) setSurname(storedSurname);

      } catch (e) {
        Alert.alert('Error', 'Failed to load data from storage');
      }
    })();
  }, [selectedScreenPage]);


  useEffect(() => {
    (async () => {
      const words = parseInt(await AsyncStorage.getItem('totalWords')) || 0;
      setTotalWords(words);
      setLevelProgress(Math.floor(words % 100));
      setLevel(Math.floor(words / 100) + 1);
    })();
  }, [selectedScreenPage]);



  const addStars = (amount) => {
    const updatedStarsAmount = stars + amount;
    dispatch(updateUserData({ stars: updatedStarsAmount, }));
    dispatch(saveUserData({ stars: updatedStarsAmount, }));
  };


  return (
    <ImageBackground
      source={require('../assets/images/backgroundImages/mainBG.png')}
      resizeMode="cover"
      style={{
        justifyContent: 'space-between',
        alignItems: 'center',
        flex: 1,
        width: '110%',
        alignSelf: 'center'
      }}
    >
      <View style={{
        alignItems: 'center',
        width: dimensions.width,
        position: 'relative',
        flex: 1,
        justifyContent: 'flex-start',
        width: '93%',
        

      }} >

        {selectedScreenPage === 'Home' ? (
          <View style={{ width: '100%', flex: 1, paddingHorizontal: 4, marginTop: '12%',  }}>
            <ScrollView
              showsVerticalScrollIndicator={false}
            >
              <View style={{
                width: '93%',
                alignSelf: 'center',
                
              }}>
                <View
                  style={{
                    width: '100%',
                    alignSelf: 'center',
                    marginBottom: dimensions.height * 0.01,

                  }}
                >
                  <View style={{
                    alignItems: 'center',
                    alignSelf: 'center',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    width: '93%', alignSelf: 'center',
                    flex: 1,
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
                      Your Progres
                    </Text>

                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                      <View style={{
                        backgroundColor: 'white',
                        borderRadius: dimensions.width * 0.1,
                        paddingHorizontal: dimensions.width * 0.1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginLeft: '10%'


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


                <View style={{ width: '93%', alignSelf: 'center', }}>
                  <ImageBackground
                    source={require('../assets/images/homeCard1.png')}
                    resizeMode="stretch"
                    style={{
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flex: 1,
                      width: '100%',
                      height: dimensions.height * 0.2,
                      borderRadius: dimensions.width * 0.05,
                      overflow: 'hidden',
                      position: 'relative',
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: fontSigmarRegular,

                        textAlign: "left",
                        alignSelf: 'flex-start',
                        paddingLeft: dimensions.width * 0.05,
                        fontSize: dimensions.width * 0.07,
                        padding: dimensions.width * 0.02,

                        color: 'black',

                      }}
                    >
                      lvl {level}
                    </Text>


                    <View style={{
                      position: 'absolute',
                      bottom: '7%',
                      width: '100%',
                      alignItems: 'flex-end',

                    }}>
                      <View style={{
                        flexDirection: 'row',
                        justifyContent: 'center',

                        marginRight: '5%',

                      }}>
                        <Image
                          source={require('../assets/images/nextLvlImage.png')}
                          style={{
                            width: dimensions.width * 0.14,
                            height: dimensions.width * 0.14,
                            top: '0%',
                            textAlign: 'center'
                          }}
                          resizeMode="contain"
                        />
                        <Text
                          style={{
                            fontFamily: fontSFProMedium,

                            textAlign: "left",

                            paddingLeft: dimensions.width * 0.05,
                            fontSize: dimensions.width * 0.04,
                            padding: dimensions.width * 0.02,
                            paddingTop: dimensions.width * 0.046,
                            paddingLeft: dimensions.width * 0.01,

                            color: 'black',

                          }}
                        >
                          {level + 1}00 words
                        </Text>

                      </View>

                      <View style={{
                        width: '64%',
                        backgroundColor: '#fccdb5',
                        borderRadius: dimensions.width * 0.1,
                        alignSelf: 'flex-end',
                        marginRight: '5%',
                        position: 'relative',
                        height: dimensions.width * 0.08,
                        overflow: 'hidden',
                      }}>
                        <View style={{
                          width: `${levelProgress}%`,
                          backgroundColor: '#f26a25',
                          height: '100%',
                          position: 'absolute',
                          left: 0,
                          top: 0,
                        }} />
                        <Text
                          style={{
                            fontFamily: fontSFProMedium,
                            textAlign: "right",
                            fontSize: dimensions.width * 0.04,
                            color: levelProgress >= 80 ? 'black' : '#D2591B',
                            zIndex: 1,
                            padding: dimensions.width * 0.016,
                          }}
                        >
                          {levelProgress ? levelProgress : '0'}%
                        </Text>
                      </View>
                    </View>
                  </ImageBackground>
                </View>



                <TouchableOpacity
                  onPress={() => setSelectedScreenPage('Teach')}
                  style={{
                    alignItems: 'center',
                    width: '90%',
                    marginTop: dimensions.height * 0.02,
                    backgroundColor: 'white',
                    alignSelf: 'center',
                    borderRadius: dimensions.width * 0.5,
                    justifyContent: 'center',

                  }}>

                  <Text
                    style={{
                      fontSize: dimensions.width * 0.05,
                      padding: dimensions.width * 0.03,
                      fontFamily: fontSFProBold,
                      color: '#C05018',
                      textAlign: "center",

                    }}
                  >
                    Let's Teach
                  </Text>
                </TouchableOpacity>


                <TouchableOpacity
                  onPress={() => setSelectedScreenPage('Gaming')}
                  style={{
                    alignItems: 'center',
                    width: '90%',
                    marginTop: dimensions.height * 0.03,
                    backgroundColor: 'white',
                    alignSelf: 'center',
                    borderRadius: dimensions.width * 0.5,
                    justifyContent: 'center',

                  }}>

                  <Text
                    style={{
                      fontSize: dimensions.width * 0.05,
                      padding: dimensions.width * 0.03,
                      fontFamily: fontSFProBold,
                      color: '#C05018',
                      textAlign: "center",

                    }}
                  >
                    Let's Gaming
                  </Text>
                </TouchableOpacity>

              </View>



              <Text
                style={{
                  fontFamily: fontSFProSemiBold,
                  textAlign: "flex-start",
                  fontSize: dimensions.width * 0.05,
                  marginTop: dimensions.width < 380 ? -dimensions.height * 0.001 : dimensions.height * 0.05,
                  color: 'white',
                  marginLeft: dimensions.width * 0.05,
                  marginBottom: dimensions.height * 0.01,

                }}
              >
                Bonus
              </Text>



              <View >
                <ImageBackground
                  source={require('../assets/images/mainBonusImage2.png')}
                  resizeMode="stretch"
                  style={{
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flex: 1,
                    width: dimensions.width * 1.1,
                    height: dimensions.height * 0.3,
                    alignSelf: 'center',


                  }}
                >
                  <View style={{
                    width: '93%', alignSelf: 'center', position: 'relative', justifyContent: 'space-between',
                    alignItems: 'center', flex: 1,
                  }}>

                    <View style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flex: 1,
                      width: '100%',
                      position: 'absolute',
                      top: '16%',
                      paddingHorizontal: dimensions.width * 0.05,
                      paddingRight: dimensions.width * 0.07,
                    }}>
                      <Text
                        style={{
                          fontFamily: fontSigmarRegular,
                          textAlign: "left",
                          paddingLeft: dimensions.width * 0.05,
                          fontSize: dimensions.width * 0.07,
                          color: 'white',
                        }}
                      >
                        lvl {level}
                      </Text>

                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text
                          style={{
                            fontFamily: fontSigmarRegular,
                            textAlign: "left",
                            paddingLeft: dimensions.width * 0.05,
                            fontSize: disabled ? dimensions.width * 0.1 : dimensions.width * 0.07,
                            color: 'white',
                          }}
                        >
                          {disabled ? '?' : claimAmount}
                        </Text>

                        <Image
                          source={require('../assets/icons/starIcon.png')}
                          style={{
                            width: dimensions.width * 0.16,
                            height: dimensions.width * 0.16,
                            marginLeft: dimensions.width * 0.02,
                          }}
                          resizeMode="contain"
                        />
                      </View>
                    </View>



                    <View style={{
                      position: 'absolute',
                      bottom: '25%',
                      width: '93%',


                    }}>
                      <Text
                        style={{
                          fontFamily: fontSigmarOne,
                          textAlign: "left",
                          paddingLeft: dimensions.width * 0.05,
                          fontSize: dimensions.width * 0.07,
                          color: 'white',
                        }}
                      >
                        Daily reward:
                      </Text>


                      <TouchableOpacity
                        style={{
                          backgroundColor: 'white',
                          width: '40%',
                          marginLeft: '6%',
                          marginTop: '2%',
                          borderRadius: dimensions.width * 0.1,
                        }}
                        onPress={handleClaim}
                        disabled={disabled}
                      >
                        <Text
                          style={{
                            fontFamily: fontSFProHeavy,
                            textAlign: 'center',
                            fontSize: dimensions.width * 0.05,
                            color: '#C05018',
                            paddingVertical: dimensions.height * 0.01,
                          }}
                        >
                          {disabled ? timer : 'Claim'}
                        </Text>
                      </TouchableOpacity>

                    </View>
                  </View>
                </ImageBackground>
              </View>


            </ScrollView>

            <View style={{ position: 'absolute', bottom: '14%', left: '50%', backgroundColor: '#3179AC' }}>

            </View>
          </View>

        ) : selectedScreenPage === 'Settings' ? (
          <SettingsScreen selectedScreenPage={selectedScreenPage} stars={stars} profileImageUri={profileImageUri}
            setProfileImageUri={setProfileImageUri} level={level} levelProgress={levelProgress} totalWords={totalWords}
          />
        ) : selectedScreenPage === 'Statistic' ? (
          <StatisticScreen selectedScreenPage={selectedScreenPage} stars={stars} level={level} levelProgress={levelProgress}/>
        ) : selectedScreenPage === 'Teach' ? (
          <TeachScreen setSelectedScreenPage={setSelectedScreenPage} selectedScreenPage={selectedScreenPage} stars={stars}
            profileImageUri={profileImageUri} name={name} surname={surname} level={level} levelProgress={levelProgress}
          />
        ) : selectedScreenPage === 'Gaming' ? (
          <GamingScreen setSelectedScreenPage={setSelectedScreenPage} selectedScreenPage={selectedScreenPage} profileImageUri={profileImageUri}
            level={level} levelProgress={levelProgress}
          />
        )
          : null}


        <View
          style={{
            position: 'absolute',
            bottom: '3%',

            width: '100%,',
            paddingHorizontal: dimensions.width * 0.03,

            height: '8%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            alignSelf: 'center',
            paddingVertical: dimensions.height * 0.03,
          }}
        >


          <TouchableOpacity
            onPress={() => setSelectedScreenPage('Home')}
            style={{
              alignItems: 'center',
              paddingHorizontal: dimensions.width * 0.0,
              borderRadius: dimensions.width * 0.025,
              marginRight: 5,
              backgroundColor: 'white',
              width: '26%',
              opacity: selectedScreenPage === 'Home' || (selectedScreenPage !== 'Statistic' && selectedScreenPage !== 'Settings') ? 1 : 0.5,

            }}
          >
            <Image
              source={require('../assets/icons/homeIcons/homeIcon.png')}
              style={{
                width: dimensions.width * 0.07,
                height: dimensions.width * 0.1,
                textAlign: 'center'
              }}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSelectedScreenPage('Statistic')}
            style={{
              alignItems: 'center',

              paddingHorizontal: dimensions.width * 0.0,
              borderRadius: dimensions.width * 0.025,
              marginRight: 5,
              backgroundColor: 'white',
              width: '26%',
              opacity: selectedScreenPage === 'Statistic' ? 1 : 0.5,

            }}
          >
            <Image
              source={require('../assets/icons/homeIcons/statisticIcon.png')}
              style={{
                width: dimensions.width * 0.07,
                height: dimensions.width * 0.1,
                textAlign: 'center'
              }}
              resizeMode="contain"
            />
          </TouchableOpacity>




          <TouchableOpacity
            onPress={() => setSelectedScreenPage('Settings')}
            style={{
              alignItems: 'center',
              paddingHorizontal: dimensions.width * 0.0,
              borderRadius: dimensions.width * 0.025,
              marginRight: 5,
              backgroundColor: 'white',
              width: '26%',
              opacity: selectedScreenPage === 'Settings' ? 1 : 0.5,

            }}
          >
            <Image
              source={require('../assets/icons/homeIcons/settingsIcon.png')}
              style={{
                width: dimensions.width * 0.07,
                height: dimensions.width * 0.1,
                textAlign: 'center'
              }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>

    </ImageBackground>
  );
};

export default HomeScreen;
