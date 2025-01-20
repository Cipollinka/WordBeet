import AsyncStorage from '@react-native-async-storage/async-storage';
import { is } from 'date-fns/locale';
import React, { useEffect, useState, useMemo, useRef } from 'react';
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

} from 'react-native';


const data = [
  { backgroundColor: '#6CB9AD', text: 'All' },
  { backgroundColor: '#324DDD', text: 'Earned' },
  { backgroundColor: '#F41414', text: 'Lost' },
];




const fontSFProMedium = 'SFProText-Medium';
const fontSFProSemiBold = 'SFProText-SemiBold';
const fontSFProBold = 'SFProText-Bold';
const fontSFProHeavy = 'SFProText-Heavy';
const fontSigmarRegular = 'Sigmar-Regular';
const fontSigmarOne = 'SigmarOne-Regular';


const StatisticScreen = ({ selectedScreenPage, stars, level }) => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));

  const [totalWords, setTotalWords] = useState(0);
  const [totalEarned, setTotalEarned] = useState(0);
  const [totalLost, setTotalLost] = useState(0);
  const [maxValue, setMaxValue] = useState(0);
  const maxChartHeight = dimensions.height * 0.16;
  const [levelProgress, setLevelProgress] = useState(0);


  useEffect(() => {
    (async () => {
      const words = parseInt(await AsyncStorage.getItem('totalWords')) || 0;
      const earned = parseInt(await AsyncStorage.getItem('totalEarned')) || 0;
      const lost = parseInt(await AsyncStorage.getItem('totalLost')) || 0;



      setMaxValue(Math.max(totalEarned + totalLost, totalEarned, totalLost))
      setTotalWords(words);
      setTotalEarned(earned);
      setTotalLost(lost);
      setLevelProgress(Math.floor(words % 100));
    })();
  }, [selectedScreenPage]);






  return (
    <View style={{
      width: dimensions.width,
      flex: 1,
      alignItems: 'center',
      justifyContent: 'flex-start',
      position: 'relative',
      marginTop: '12%',
    }} >
      <View style={{ width: '103%', flex: 1, paddingHorizontal: 4, alignSelf: 'center' }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{
              width: '95%',
              alignSelf: 'center',
              marginBottom: dimensions.height * 0.01,

            }}
          >
            <View style={{
              alignItems: 'center',
              justifyContent: 'space-between',
              flexDirection: 'row',
              width: '95%', alignSelf: 'center',
              paddingHorizontal: dimensions.width * 0.02,
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
                Statistics
              </Text>

              <View style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',

              }}>
                <View style={{
                  backgroundColor: 'white',
                  borderRadius: dimensions.width * 0.1,
                  paddingHorizontal: dimensions.width * 0.1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft: '27%',


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


          <View style={{ width: '85%', alignSelf: 'center', }}>
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
                  height: dimensions.width * 0.08, // встановлюємо висоту
                  overflow: 'hidden', // приховуємо вихід за межі
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



          <View style={{
            marginTop: -dimensions.height * 0.03,

          }}>
            <ImageBackground
              source={require('../assets/images/settingsImage.png')}
              resizeMode="stretch"
              style={{
                justifyContent: 'space-between',
                alignItems: 'center',
                flex: 1,
                width: dimensions.width * 1.2,
                height: dimensions.height * 0.4,
                alignSelf: 'center',
                marginHorizontal: dimensions.width * 0.05,


              }}
            >
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: dimensions.height * 0.109,
              }}>

                <View style={{
                  width: '45%', position: 'relative', justifyContent: 'space-between',
                  alignItems: 'center', flex: 1,
                  maxHeight: dimensions.height * 0.1,
                }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '50%', marginLeft: '14%', alignItems: 'flex-end', }}>
                    <View style={{ alignItems: 'center' }}>
                      <View style={{ height: maxChartHeight, width: dimensions.width * 0.05, backgroundColor: '#6CB9AD' }} />
                    </View>
                    <View style={{ alignItems: 'center' }}>
                      <View style={{ height: totalEarned ? (maxChartHeight * (totalEarned * 100) / ((totalEarned + totalLost))) / 100 : 0, width: dimensions.width * 0.05, backgroundColor: '#324DDD' }} />
                    </View>
                    <View style={{ alignItems: 'center' }}>
                      <View style={{ height: totalLost ? (maxChartHeight * (totalLost * 100) / ((totalEarned + totalLost))) / 100 : 0, width: dimensions.width * 0.05, backgroundColor: '#F41414' }} />
                    </View>
                  </View>

                </View>

                <View style={{
                  width: '45%', position: 'relative', justifyContent: 'space-between',
                  alignItems: 'center', flex: 1,
                }}>
                  {data.map((item, index) => (
                    <View key={index} style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: '#C35218',
                      padding: dimensions.width * 0.014,
                      borderTopRightRadius: dimensions.width * 0.05,
                      borderBottomLeftRadius: dimensions.width * 0.05,

                      width: '60%',
                      marginBottom: dimensions.width * 0.04,
                    }}>
                      <View style={{
                        paddingVertical: dimensions.width * 0.02,
                        paddingLeft: dimensions.width * 0.043,
                        paddingRight: dimensions.width * 0.03,
                        backgroundColor: item.backgroundColor,
                        borderRadius: dimensions.width * 0.01,
                        width: '25%',
                      }} />
                      <Text
                        style={{
                          fontFamily: fontSFProBold,
                          textAlign: "center",
                          paddingLeft: dimensions.width * 0.03,
                          fontSize: dimensions.width * 0.034,
                          color: 'white',
                          width: '60%',
                        }}
                      >
                        {item.text}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </ImageBackground>
          </View>

          <View style={{
            marginTop: -dimensions.height * 0.025,
            width: '85%',
            alignSelf: 'center',
          }}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',

            }}>
              <Text
                style={{
                  fontFamily: fontSFProMedium,

                  textAlign: "left",

                  paddingLeft: dimensions.width * 0.05,
                  fontSize: dimensions.width * 0.05,
                  padding: dimensions.width * 0.02,
                  paddingTop: dimensions.width * 0.046,
                  paddingLeft: dimensions.width * 0.01,

                  color: 'white',

                }}
              >
                All: {totalEarned && totalLost ? totalEarned + totalLost : '0'}
              </Text>
              <Image
                source={require('../assets/icons/starIcon.png')}
                style={{
                  width: dimensions.width * 0.1,
                  height: dimensions.width * 0.1,
                  marginTop: dimensions.width * 0.012,
                  marginLeft: -dimensions.width * 0.01,
                }}
                resizeMode="contain"
              />

            </View>


            <Text
              style={{
                fontFamily: fontSFProMedium,

                textAlign: "left",

                paddingLeft: dimensions.width * 0.05,
                fontSize: dimensions.width * 0.05,
                paddingLeft: dimensions.width * 0.01,

                color: 'white',

              }}
            >
              Total earned: {totalEarned ? totalEarned : '0'}
            </Text>


            <Text
              style={{
                fontFamily: fontSFProMedium,

                textAlign: "left",

                paddingLeft: dimensions.width * 0.05,
                fontSize: dimensions.width * 0.05,
                paddingLeft: dimensions.width * 0.01,

                color: 'white',

              }}
            >
              Total lost: {totalLost ? totalLost : '0'}
            </Text>


            <Text
              style={{
                fontFamily: fontSFProMedium,

                textAlign: "left",

                paddingLeft: dimensions.width * 0.05,
                fontSize: dimensions.width * 0.055,
                paddingLeft: dimensions.width * 0.01,
                fontWeight: 'bold',

                color: 'white',

              }}
            >
              Total words: {totalWords ? totalWords : '0'}
            </Text>
          </View>


        </ScrollView>
      </View>
    </View>
  );
};

export default StatisticScreen;
