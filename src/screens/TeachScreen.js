import { View, Text, Dimensions, Image, TouchableOpacity, Modal, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ChevronLeftIcon } from 'react-native-heroicons/solid';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserData, saveUserData } from '../redux/userSlice';
import gamingWords from '../components/gamingWords';
import teachPhrases from '../components/teachPhrases';
import AsyncStorage from '@react-native-async-storage/async-storage';


const fontSFProMedium = 'SFProText-Medium';
const fontSFProSemiBold = 'SFProText-SemiBold';
const fontSFProBold = 'SFProText-Bold';
const fontSFProHeavy = 'SFProText-Heavy';
const fontSigmarRegular = 'Sigmar-Regular';
const fontSigmarOne = 'SigmarOne-Regular';
const ShantellSansLight = 'ShantellSans-Light';

const TeachScreen = ({ selectedScreenPage, setSelectedScreenPage, name, surname, profileImageUri, level, levelProgress }) => {
    const [dimensions, setDimensions] = useState(Dimensions.get('window'));
    const [isTeachStarted, setIsTeachStarted] = useState(false);
    const [teachMode, setTeachMode] = useState('');
    const dispatch = useDispatch();
    const stars = useSelector(state => state.user.stars);
    const [isGameResultModalVisible, setGameResultModalVisible] = useState(false);
    const [sessionEarned, setSessionEarned] = useState(0);
    const [sessionLost, setSessionLost] = useState(0);
    const [answer, setAnswer] = useState('');
    const [usedWordsIds, setUsedWordsIds] = useState([]);
    const [usedPhrasesIds, setUsedPhrasesIds] = useState([]);
    const [currentWord, setCurrentWord] = useState('');


    const addStars = (amount) => {
        const updatedStarsAmount = stars + amount;
        dispatch(updateUserData({ stars: updatedStarsAmount, }));
        dispatch(saveUserData({ stars: updatedStarsAmount, }));
    };

    useEffect(() => {
        console.log('currentWord', currentWord);
    }, [currentWord])


    const selectRandomWord = () => {
        if (teachMode === 'Suggestions') {
          if (usedPhrasesIds.length === teachPhrases.length) {
            setUsedPhrasesIds([]);
          }
      
          const availablePhrases = teachPhrases.filter(phrase => !usedPhrasesIds.includes(phrase.id));
          const randomPhrase = availablePhrases[Math.floor(Math.random() * availablePhrases.length)];
      
          setCurrentWord(randomPhrase.phrase);
          setUsedPhrasesIds([...usedPhrasesIds, randomPhrase.id]);
        } else if (teachMode === 'Words') {
          if (usedWordsIds.length === gamingWords.length) {
            setUsedWordsIds([]);
          }
      
          const availableWords = gamingWords.filter(word => !usedWordsIds.includes(word.id));
          const randomWord = availableWords[Math.floor(Math.random() * availableWords.length)];
      
          setCurrentWord(randomWord.word);
          setUsedWordsIds([...usedWordsIds, randomWord.id]);
        }
      };


    const checkAnswer = async () => {
        const betValue = 15;
        let totalWords = parseInt(await AsyncStorage.getItem('totalWords')) || 0;
        let completedWords = parseInt(await AsyncStorage.getItem('completedWords')) || 0;
        let totalEarned = parseInt(await AsyncStorage.getItem('totalEarned')) || 0;
        let totalLost = parseInt(await AsyncStorage.getItem('totalLost')) || 0;

        totalWords += 1;
        await AsyncStorage.setItem('totalWords', totalWords.toString());

        if (answer.toLowerCase() === currentWord.toLowerCase()) {
            selectRandomWord();
            addStars(betValue);
            setSessionEarned(sessionEarned + betValue);
            setAnswer('');
            completedWords += 1;
            totalEarned += betValue;
            await AsyncStorage.setItem('completedWords', completedWords.toString());
            await AsyncStorage.setItem('totalEarned', totalEarned.toString());
        } else {
            if (stars - betValue < 0) {
                setSessionLost(sessionLost + betValue);
                setGameResultModalVisible(true);
            } else {
                selectRandomWord();
                setAnswer('');
                addStars(-betValue);
                totalLost += betValue;
                await AsyncStorage.setItem('totalLost', totalLost.toString());
            }
        }
    };

    return (
        <View style={{
            width: dimensions.width,
            flex: 1,
            alignItems: 'center',
            justifyContent: 'flex-start',
            position: 'relative',
            marginTop: '14%',
            width: '102%',
            alignSelf: 'center',
        }} >
            <View style={{ width: '88%', height: '100%', paddingHorizontal: 4, position: 'relative', flex: 1, justifyContent: 'flex-start' }}>

                <View
                    style={{
                        width: '100%',
                        alignSelf: 'center',
                        marginBottom: dimensions.height * 0.01,

                    }}
                >
                    <Text
                        style={{
                            fontFamily: fontSFProSemiBold,
                            textAlign: "left",
                            alignSelf: 'flex-start',
                            fontSize: dimensions.width * 0.07,
                            paddingLeft: '1%',

                            color: 'white',
                            paddingBottom: 8,

                        }}
                    >
                        Let's Teach
                    </Text>

                    {!isTeachStarted ? (
                        <View>
                            <TouchableOpacity
                                onPress={() => setSelectedScreenPage('Home')}
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignSelf: 'flex-start',
                                    alignItems: 'center',
                                    marginLeft: -dimensions.width * 0.01,


                                }}
                            >
                                <ChevronLeftIcon size={21} color='white' />
                                <Text
                                    style={{
                                        fontFamily: fontSFProSemiBold,
                                        textAlign: "center",
                                        fontSize: dimensions.width * 0.04,
                                        padding: dimensions.width * 0.02,
                                        paddingLeft: 0,

                                        color: 'white',

                                    }}
                                >
                                    Back
                                </Text>

                            </TouchableOpacity>


                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                alignSelf: 'center',
                            }}>
                                <View style={{
                                    width: '35%',

                                }}>
                                    <View style={{
                                        backgroundColor: profileImageUri ? 'transparent' : 'white',
                                        borderRadius: dimensions.width * 0.5,
                                        alignSelf: 'center',
                                        padding: profileImageUri ? 0 : dimensions.width * 0.05,


                                    }}>

                                        <Image
                                            source={
                                                profileImageUri
                                                    ? { uri: profileImageUri }
                                                    : require('../assets/images/profileImage.png')}
                                            style={{
                                                width: profileImageUri ? dimensions.width * 0.35 : dimensions.width * 0.25,
                                                height: profileImageUri ? dimensions.width * 0.35 : dimensions.width * 0.25,
                                                overflow: 'hidden',
                                                textAlign: 'center',
                                                padding: dimensions.width * 0.02,
                                                borderRadius: profileImageUri ? dimensions.width * 0.5 : 0,
                                            }}
                                            resizeMode="stretch"
                                        />
                                    </View>
                                </View>


                                <View style={{
                                    width: '60%',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
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
                                                fontSize: dimensions.width * 0.04,
                                                paddingVertical: dimensions.width * 0.028,
                                                paddingHorizontal: dimensions.width * 0.05,
                                                color: 'white',

                                            }}
                                        >
                                            {name ? name : 'Noname'}
                                        </Text>

                                    </View>




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
                                                fontSize: dimensions.width * 0.04,
                                                paddingVertical: dimensions.width * 0.028,
                                                paddingHorizontal: dimensions.width * 0.05,
                                                color: 'white',

                                            }}
                                        >
                                            {surname ? surname : 'Nosurname'}
                                        </Text>

                                    </View>

                                </View>

                            </View>


                            <View style={{
                                alignSelf: 'center',
                                width: '110%',
                                marginTop: dimensions.height * 0.03,
                            }}>
                                <Text
                                    style={{
                                        fontWeight: 600,
                                        textAlign: "left",
                                        alignSelf: 'flex-start',
                                        fontSize: dimensions.width * 0.04,
                                        paddingVertical: dimensions.width * 0.028,
                                        paddingHorizontal: dimensions.width * 0.05,
                                        color: 'white',

                                    }}
                                >
                                    Your statistics:
                                </Text>


                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginLeft: '5%',
                                    width: '85%',
                                }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                        <View style={{
                                            backgroundColor: 'white',
                                            borderRadius: dimensions.width * 0.1,
                                            paddingHorizontal: dimensions.width * 0.1,
                                            justifyContent: 'center',
                                            alignItems: 'center',



                                        }}>
                                            <Text
                                                style={{
                                                    fontFamily: fontSFProSemiBold,
                                                    textAlign: "center",
                                                    fontSize: dimensions.width * 0.04,
                                                    padding: dimensions.width * 0.01,

                                                    color: '#CE571B',

                                                }}
                                            >
                                                {stars ? stars : '0'}
                                            </Text>
                                        </View>
                                        <Image
                                            source={require('../assets/icons/starIcon.png')}
                                            style={{
                                                width: dimensions.width * 0.12,
                                                height: dimensions.width * 0.12,
                                                left: '-70%',
                                                overflow: 'hidden',
                                                textAlign: 'center'
                                            }}
                                            resizeMode="contain"
                                        />
                                    </View>


                                    <Text
                                        style={{
                                            fontWeight: 700,
                                            textAlign: "left",
                                            alignSelf: 'flex-start',
                                            fontSize: dimensions.width * 0.05,
                                            paddingVertical: dimensions.width * 0.028,
                                            color: 'white',
                                            marginLeft: -dimensions.width * 0.1,

                                        }}
                                    >
                                        lvl {level}
                                    </Text>



                                    <Text
                                        style={{
                                            fontWeight: 700,
                                            textAlign: "left",
                                            alignSelf: 'flex-start',
                                            fontSize: dimensions.width * 0.05,
                                            paddingVertical: dimensions.width * 0.028,
                                            color: 'white',

                                        }}
                                    >
                                        {levelProgress ? levelProgress : '0'}%
                                    </Text>


                                </View>

                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',

                                }}>

                                    <Text
                                        style={{
                                            fontWeight: 600,
                                            textAlign: "left",
                                            alignSelf: 'flex-start',
                                            fontSize: dimensions.width * 0.04,
                                            paddingVertical: dimensions.width * 0.028,
                                            paddingHorizontal: dimensions.width * 0.05,
                                            color: 'white',

                                        }}
                                    >
                                        Word reward: 15
                                    </Text>
                                    <Image
                                        source={require('../assets/icons/starIcon.png')}
                                        style={{
                                            width: dimensions.width * 0.075,
                                            height: dimensions.width * 0.075,
                                            left: '-40%',
                                            overflow: 'hidden',
                                            textAlign: 'center'
                                        }}
                                        resizeMode="contain"
                                    />
                                </View>
                                <TouchableOpacity
                                    onPress={() => setTeachMode('Suggestions')}
                                    style={{
                                        alignItems: 'center',
                                        width: '86%',
                                        marginTop: dimensions.height * 0.02,
                                        backgroundColor: teachMode === 'Suggestions' ? '#75CC33' : 'white',
                                        alignSelf: 'center',
                                        borderRadius: dimensions.width * 0.5,
                                        justifyContent: 'center',
                                        opacity: teachMode !== '' && teachMode !== 'Suggestions' ? 0.5 : 1,

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
                                        Suggestions
                                    </Text>
                                </TouchableOpacity>


                                <TouchableOpacity
                                    onPress={() => setTeachMode('Words')}
                                    style={{
                                        alignItems: 'center',
                                        width: '86%',
                                        marginTop: dimensions.height * 0.03,
                                        backgroundColor: teachMode === 'Words' ? '#75CC33' : 'white',
                                        alignSelf: 'center',
                                        borderRadius: dimensions.width * 0.5,
                                        justifyContent: 'center',
                                        opacity: teachMode !== '' && teachMode !== 'Words' ? 0.5 : 1,

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
                                        Words
                                    </Text>
                                </TouchableOpacity>



                            </View>

                        </View>
                    ) : (
                        <View>
                            <View
                                style={{
                                    width: '100%',
                                    alignSelf: 'center',
                                    marginBottom: dimensions.height * 0.01,
                                    marginTop: -dimensions.height * 0.01,

                                }}
                            >

                                <Text
                                    style={{
                                        fontSize: dimensions.width * 0.1,
                                        padding: dimensions.width * 0.03,
                                        fontFamily: ShantellSansLight,
                                        color: 'white',
                                        textAlign: "center",
                                        marginTop: dimensions.height * 0.01,
                                        fontWeight: 600,
                                        alignSelf: 'flex-end'

                                    }}
                                >
                                    1/∞
                                </Text>



                                <View style={{ justifyContent: 'center', alignItems: 'center', width: '150%', alignSelf: 'center', marginTop: dimensions.height * 0.01, position: 'relative', }}>
                                    <Image
                                        source={require('../assets/images/gameBgWords.png')}
                                        resizeMode="stretch"
                                        style={{
                                            width: dimensions.width * 1.1,
                                            height: dimensions.height * 0.3,
                                            alignSelf: 'center',
                                            zIndex: 1,
                                        }}
                                    />
                                    <Text
                                        style={{
                                            fontSize: teachMode === 'Suggestions' ? dimensions.width * 0.07 : dimensions.width * 0.1,
                                            padding: dimensions.width * 0.16,
                                            fontFamily: 'fontSFProBold',
                                            color: 'black',
                                            textAlign: 'center',
                                            marginTop: -dimensions.height * 0.25,
                                            marginBottom: dimensions.height * 0.03,
                                            fontWeight: '800',
                                            zIndex: 50,
                                        }}
                                    >
                                        {currentWord}
                                    </Text>
                                </View>




                                <View style={{
                                    backgroundColor: 'white',
                                    borderRadius: dimensions.width * 0.1,
                                    alignSelf: 'flex-start',
                                    marginLeft: '10%',
                                    marginBottom: -dimensions.width * 0.025,
                                    marginTop: dimensions.width < 380 ? dimensions.height * 0.03 : dimensions.height * 0.07,
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
                                        Your answer
                                    </Text>

                                </View>
                                <View style={{
                                    zIndex: 1,
                                    width: '90%',
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
                                        placeholder="Enter your answer..."
                                        placeholderTextColor="rgba(255, 255, 255, 0.7)"
                                        value={answer}
                                        onChangeText={(text) => setAnswer(text)}
                                    />
                                </View>




                            </View>

                        </View>
                    )}
                </View>
                {isTeachStarted && (
                    <TouchableOpacity
                        disabled={!isTeachStarted}
                        onPress={() => {
                            checkAnswer();
                        }}
                        style={{
                            alignItems: 'center',
                            width: '95%',
                            marginTop: dimensions.height * 0.01,
                            backgroundColor: 'white',
                            alignSelf: 'center',
                            borderRadius: dimensions.width * 0.5,
                            justifyContent: 'center',
                            position: 'absolute',
                            bottom: dimensions.width < 380 ? '23.5%' : '21.5%',
                            opacity: !isTeachStarted ? 0 : 1,

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
                            Next
                        </Text>
                    </TouchableOpacity>
                )}
                <TouchableOpacity
                    disabled={teachMode === ''}
                    onPress={() => {
                        if (!isTeachStarted) {
                            selectRandomWord();
                            setIsTeachStarted(true);
                        } else {
                            setGameResultModalVisible(true);
                            setTeachMode('');
                        };
                    }}
                    style={{
                        alignItems: 'center',
                        width: '95%',
                        marginTop: dimensions.height * 0.03,
                        backgroundColor: 'white',
                        alignSelf: 'center',
                        borderRadius: dimensions.width * 0.5,
                        justifyContent: 'center',
                        position: 'absolute',
                        bottom: '14%',
                        opacity: teachMode !== '' ? 1 : 0.5,

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
                        {!isTeachStarted ? 'Start' : 'End' }
                    </Text>
                </TouchableOpacity>
            </View>
            <Modal
                visible={isGameResultModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => {
                    setGameResultModalVisible(false);
                    setIsTeachStarted(false);
                    setSessionEarned(0);
                    setSessionLost(0);
                }}
            >
                <View style={{
                    flex: 1,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    justifyContent: 'center',
                    alignItems: 'center', // Вирівнювання по центру
                    width: '100%',
                    height: '100%',
                    position: 'relative',
                }}>
                    <View style={{
                        backgroundColor: 'white',
                        width: '90%',
                        alignSelf: 'center',
                        borderRadius: dimensions.width * 0.1,
                        padding: 20,
                        alignItems: 'center', // Вирівнювання по центру
                        position: 'relative',
                    }}>
                        <TouchableOpacity
                            onPress={() => {
                                setGameResultModalVisible(false);
                                setIsTeachStarted(false);
                                setSessionEarned(0);
                                setSessionLost(0);
                                setAnswer('');
                            }}
                            style={{
                                marginTop: dimensions.height * 0.01,
                                position: 'absolute',
                                top: '5%',
                                right: '5%',
                                zIndex: 50
                            }}>
                            <Image
                                source={require('../assets/icons/closeIconThis.png')}
                                style={{
                                    width: dimensions.width * 0.1,
                                    height: dimensions.width * 0.1,
                                    overflow: 'hidden',
                                    textAlign: 'center',

                                }}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>

                        <View style={{
                            display: 'flex',
                            width: '100%',
                            alignSelf: 'flex-start',
                            justifyContent: 'center'
                        }}>
                            


                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                    <Text
                                        style={{
                                            fontSize: dimensions.width * 0.05,
                                            padding: dimensions.width * 0.014,
                                            fontFamily: fontSFProBold,
                                            color: 'black',
                                            textAlign: "center",
                                            marginTop: dimensions.height * 0.01,
                                            fontWeight: '800',
                                            paddingRight: dimensions.width * 0.005,
                                        }}
                                    >
                                        You earned:
                                    </Text>

                                    <Text
                                        style={{
                                            fontSize: dimensions.width * 0.05,
                                            padding: dimensions.width * 0.014,
                                            fontFamily: fontSFProBold,
                                            color: '#E3611F',
                                            textAlign: "center",
                                            marginTop: dimensions.height * 0.01,
                                            fontWeight: '800',
                                        }}
                                    >
                                        {sessionEarned}
                                    </Text>
                                </View>

                                <Image
                                    source={require('../assets/icons/starIcon.png')}
                                    style={{
                                        width: dimensions.width * 0.1,
                                        height: dimensions.width * 0.1,
                                        left: '-10%',
                                        overflow: 'hidden',
                                        textAlign: 'center',
                                        marginTop: dimensions.height * 0.01,
                                    }}
                                    resizeMode="contain"
                                />
                            </View>


                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                    <Text
                                        style={{
                                            fontSize: dimensions.width * 0.05,
                                            padding: dimensions.width * 0.014,
                                            fontFamily: fontSFProBold,
                                            color: 'black',
                                            textAlign: "center",
                                            marginTop: dimensions.height * 0.01,
                                            fontWeight: '800',
                                            paddingRight: dimensions.width * 0.005,
                                        }}
                                    >
                                        You lost:
                                    </Text>

                                    <Text
                                        style={{
                                            fontSize: dimensions.width * 0.05,
                                            padding: dimensions.width * 0.014,
                                            fontFamily: fontSFProBold,
                                            color: '#E3611F',
                                            textAlign: "center",
                                            marginTop: dimensions.height * 0.01,
                                            fontWeight: '800',
                                        }}
                                    >
                                        {sessionLost}
                                    </Text>
                                </View>

                                <Image
                                    source={require('../assets/icons/starIcon.png')}
                                    style={{
                                        width: dimensions.width * 0.1,
                                        height: dimensions.width * 0.1,
                                        left: '-10%',
                                        overflow: 'hidden',
                                        textAlign: 'center',
                                        marginTop: dimensions.height * 0.01,
                                    }}
                                    resizeMode="contain"
                                />
                            </View>
                        </View>

                        <Text
                            style={{
                                fontSize: dimensions.width * 0.059,
                                padding: dimensions.width * 0.014,
                                fontFamily: fontSFProMedium,
                                color: sessionEarned > sessionLost ? '#23C10E' : '#E3611F',
                                textAlign: "center",
                                marginTop: dimensions.height * 0.025,
                                fontWeight: '500',
                            }}
                        >
                            {sessionEarned > sessionLost ? 'Good Game!' : 'Not a bad game)'}
                        </Text>
                        <TouchableOpacity
                            style={{
                                width: '100%',
                                backgroundColor: '#B94D16',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignSelf: 'center',
                                borderRadius: dimensions.width * 0.07,
                                marginTop: dimensions.height * 0.025,
                                alignItems: 'center',
                                paddingHorizontal: dimensions.width * 0.04,
                            }}
                            onPress={() => {
                                setGameResultModalVisible(false);
                                setIsTeachStarted(false);
                                setSessionEarned(0);
                                setSessionLost(0);
                                setAnswer('');
                            }}
                        >
                            <Text
                                style={{
                                    textAlign: "center",
                                    fontSize: dimensions.width * 0.044,
                                    padding: dimensions.width * 0.01,
                                    fontFamily: fontSFProBold,
                                    fontWeight: '800',
                                    color: 'white',
                                    marginRight: dimensions.width * 0.02,
                                    paddingVertical: dimensions.height * 0.014,
                                }}
                            >
                                Home
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

export default TeachScreen