import { View, Text, Dimensions, Image, TouchableOpacity, TextInput, ImageBackground, Modal, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ChevronLeftIcon } from 'react-native-heroicons/solid';
import { is } from 'date-fns/locale';
import AsyncStorage from '@react-native-async-storage/async-storage';
import gamingWords from '../components/gamingWords';


import { useDispatch, useSelector } from 'react-redux';
import { updateUserData, saveUserData } from '../redux/userSlice';


const fontSFProMedium = 'SFProText-Medium';
const fontSFProSemiBold = 'SFProText-SemiBold';
const fontSFProBold = 'SFProText-Bold';

const ShantellSansLight = 'ShantellSans-Light';

const GamingScreen = ({ selectedScreenPage, setSelectedScreenPage, profileImageUri, level, levelProgress }) => {
    const [dimensions, setDimensions] = useState(Dimensions.get('window'));
    const [isInstructionVisible, setInstructionVisible] = useState(false);
    const [bet, setBet] = useState('');
    const [answer, setAnswer] = useState('');
    const [isGameStarted, setGameStarted] = useState(false);
    const [isGameResultModalVisible, setGameResultModalVisible] = useState(false);
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');

    const [usedWordsIds, setUsedWordsIds] = useState([]);
    const [currentWord, setCurrentWord] = useState('');

    const [sessionEarned, setSessionEarned] = useState(0);
    const [sessionLost, setSessionLost] = useState(0);


    const dispatch = useDispatch();
    const stars = useSelector(state => state.user.stars);

    useEffect(() => {
        (async () => {
            try {
                const storedName = await AsyncStorage.getItem('name');
                if (storedName) setName(storedName);

                const storedSurname = await AsyncStorage.getItem('surname');
                if (storedSurname) setSurname(storedSurname);

            } catch (e) {
                Alert.alert('Error', 'Failed to load data from storage');
            }
        })();
    }, []);


    const addStars = (amount) => {
        const updatedStarsAmount = stars + amount;
        dispatch(updateUserData({ stars: updatedStarsAmount, }));
        dispatch(saveUserData({ stars: updatedStarsAmount, }));
    };


    const validateBet = (text) => {
        const betValue = parseFloat(text);
        if (!isNaN(betValue)) {
            setBet(text);
        }
    };

    const checkBetRange = () => {
        const betValue = parseFloat(bet);
        if (isNaN(betValue) || betValue <= 0 || betValue > stars) {
            Alert.alert('Error', 'Insufficient stars or incorrect value entered');
        } else {
            setBet(betValue.toString());
            selectRandomWord();
            setGameStarted(true);
        }
    };


    const selectRandomWord = () => {
        if (usedWordsIds.length === gamingWords.length) {
            setUsedWordsIds([]);
        }

        const availableWords = gamingWords.filter(word => !usedWordsIds.includes(word.id));
        const randomWord = availableWords[Math.floor(Math.random() * availableWords.length)];

        setCurrentWord(randomWord.word);
        setUsedWordsIds([...usedWordsIds, randomWord.id]);
    };


    const checkAnswer = async () => {
        const betValue = parseInt(bet);
        let totalWords = parseInt(await AsyncStorage.getItem('totalWords')) || 0;
        let completedWords = parseInt(await AsyncStorage.getItem('completedWords')) || 0;
        let totalEarned = parseInt(await AsyncStorage.getItem('totalEarned')) || 0;
        let totalLost = parseInt(await AsyncStorage.getItem('totalLost')) || 0;

        totalWords += 1;
        await AsyncStorage.setItem('totalWords', totalWords.toString());

        if (answer.toLowerCase() === currentWord.toLowerCase()) {
            selectRandomWord();
            addStars(betValue * 2);
            setSessionEarned(sessionEarned + betValue * 2);
            setAnswer('');
            completedWords += 1;
            totalEarned += betValue * 2;
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

            <View style={{ width: '88%', height: '100%', paddingHorizontal: 4, position: 'relative', flex: 1, justifyContent: 'flex-start', marginTop: dimensions.width < 380 ? -dimensions.height * 0.04 : 0, }}>
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
                    {!isInstructionVisible && !isGameStarted ? 'Let\'s Gaming' : !isInstructionVisible && isGameStarted ? 'Random Words' : 'Instruction'}
                </Text>
                {!isInstructionVisible && !isGameStarted ? (
                    <View>
                        <View
                            style={{
                                width: '100%',
                                alignSelf: 'center',
                                marginBottom: dimensions.height * 0.01,

                            }}
                        >
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
                                marginTop: dimensions.height * 0.01,
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
                                </View>



                                <Text
                                    style={{
                                        fontWeight: 600,
                                        textAlign: "left",
                                        alignSelf: 'flex-start',
                                        fontSize: dimensions.width * 0.05,
                                        paddingVertical: dimensions.width * 0.028,
                                        paddingHorizontal: dimensions.width * 0.05,
                                        color: 'white',
                                        marginTop: dimensions.width < 380 ? -dimensions.height * 0.014 : dimensions.height * 0.01,
                                        marginBottom: dimensions.height * 0.01,

                                    }}
                                >
                                    Bet on the game
                                </Text>


                                <View style={{
                                    backgroundColor: 'white',
                                    borderRadius: dimensions.width * 0.1,
                                    alignSelf: 'flex-start',
                                    marginLeft: '10%',
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
                                        Your Bet
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
                                        placeholder="Enter the bet..."
                                        placeholderTextColor="rgba(255, 255, 255, 0.7)"
                                        value={bet}
                                        onChangeText={validateBet}
                                        keyboardType="numeric"

                                    />
                                </View>

                                <TouchableOpacity
                                    onPress={() => setInstructionVisible(true)}
                                    style={{
                                        alignItems: 'center',
                                        width: '86%',
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
                                        Instruction
                                    </Text>
                                </TouchableOpacity>

                            </View>
                        </View>

                    </View>

                ) : !isInstructionVisible && isGameStarted ? (
                    <View>
                        <View
                            style={{
                                width: '100%',
                                alignSelf: 'center',
                                marginBottom: dimensions.height * 0.01,
                                marginTop: -dimensions.height * 0.01,

                            }}
                        >
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
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
                                            color: 'white',
                                            textAlign: "center",
                                            marginTop: dimensions.height * 0.01,
                                            fontWeight: 600,

                                        }}
                                    >
                                        Your Bet: {bet}
                                    </Text>
                                    <Image
                                        source={require('../assets/icons/starIcon.png')}
                                        style={{
                                            width: dimensions.width * 0.1,
                                            height: dimensions.width * 0.1,
                                            left: '-3%',
                                            overflow: 'hidden',
                                            textAlign: 'center',
                                            marginTop: dimensions.height * 0.01,
                                        }}
                                        resizeMode="contain"
                                    />

                                </View>
                                <Text
                                    style={{
                                        fontSize: dimensions.width * 0.1,
                                        padding: dimensions.width * 0.03,
                                        fontFamily: ShantellSansLight,
                                        color: 'white',
                                        textAlign: "center",
                                        marginTop: dimensions.height * 0.01,
                                        fontWeight: 600,

                                    }}
                                >
                                    1/1
                                </Text>

                            </View>


                            <View style={{ justifyContent: 'center', alignItems: 'center', width: '150%', alignSelf: 'center', marginTop: dimensions.height * 0.01 }}>
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
                                        fontSize: dimensions.width * 0.1,
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
                                marginTop: dimensions.height * 0.03,
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
                ) : (
                    <View>
                        <View
                            style={{
                                width: '100%',
                                alignSelf: 'center',
                                marginBottom: dimensions.height * 0.01,

                            }}
                        >
                            <Text
                                style={{
                                    fontSize: dimensions.width * 0.05,
                                    padding: dimensions.width * 0.03,
                                    fontFamily: fontSFProBold,
                                    color: 'white',
                                    textAlign: "center",
                                    marginTop: dimensions.height * 0.01,
                                    fontWeight: 600,

                                }}
                            >
                                Bet ont the right word
                            </Text>

                            <Text
                                style={{
                                    fontSize: dimensions.width * 0.07,
                                    padding: dimensions.width * 0.03,
                                    fontFamily: fontSFProBold,
                                    color: 'white',
                                    textAlign: "center",
                                    marginTop: dimensions.height * 0.01,
                                    fontWeight: 'bold',

                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: dimensions.width * 0.05,
                                        padding: dimensions.width * 0.03,
                                        fontFamily: fontSFProSemiBold,
                                        fontWeight: 600,
                                        color: 'white',
                                        textAlign: "center",

                                    }}
                                >
                                    For the correct answer
                                </Text> x2
                            </Text>

                            <Text
                                style={{
                                    fontSize: dimensions.width * 0.05,
                                    padding: dimensions.width * 0.03,
                                    fontFamily: fontSFProBold,
                                    color: 'white',
                                    textAlign: "center",
                                    marginTop: dimensions.height * 0.01,
                                    fontWeight: 600,

                                }}
                            >
                                For a mistake, the game ends and stars are deducted
                            </Text>

                            <Text
                                style={{
                                    fontSize: dimensions.width * 0.05,
                                    padding: dimensions.width * 0.03,
                                    fontFamily: fontSFProBold,
                                    color: 'white',
                                    textAlign: "center",
                                    marginTop: dimensions.height * 0.01,
                                    fontWeight: 600,

                                }}
                            >
                                You have a limited time to answer
                            </Text>


                            <Text
                                style={{
                                    fontSize: dimensions.width * 0.05,
                                    padding: dimensions.width * 0.03,
                                    fontFamily: fontSFProBold,
                                    color: '#23C10E',
                                    textAlign: "flex-start",
                                    marginTop: dimensions.height * 0.01,
                                    fontWeight: 700,

                                }}
                            >
                                That's right
                            </Text>

                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignSelf: 'center',
                                alignItems: 'center',
                                left: '-3%',
                            }}>
                                <Text
                                    style={{
                                        fontWeight: 700,
                                        textAlign: "left",
                                        alignSelf: 'flex-start',
                                        fontSize: dimensions.width * 0.055,
                                        paddingVertical: dimensions.width * 0.028,
                                        paddingHorizontal: dimensions.width * 0.05,
                                        color: 'white',

                                    }}
                                >
                                    15
                                </Text>
                                <Image
                                    source={require('../assets/icons/starIcon.png')}
                                    style={{
                                        width: dimensions.width * 0.1,
                                        height: dimensions.width * 0.1,
                                        left: '-40%',
                                        overflow: 'hidden',
                                        textAlign: 'center'
                                    }}
                                    resizeMode="contain"
                                />



                                <Image
                                    source={require('../assets/images/arrowImage.png')}
                                    style={{
                                        width: dimensions.width * 0.19,
                                        height: dimensions.width * 0.05,
                                        left: '-25%',
                                        overflow: 'hidden',
                                        textAlign: 'center',
                                        alignItems: 'center',
                                        marginHorizontal: dimensions.width * 0.04,
                                    }}
                                    resizeMode="stretch"
                                />


                                <Text
                                    style={{
                                        fontWeight: 700,
                                        textAlign: "left",
                                        alignSelf: 'flex-start',
                                        fontSize: dimensions.width * 0.055,
                                        paddingVertical: dimensions.width * 0.028,

                                        color: 'white',

                                    }}
                                >
                                    30
                                </Text>
                                <Image
                                    source={require('../assets/icons/starIcon.png')}
                                    style={{
                                        width: dimensions.width * 0.1,
                                        height: dimensions.width * 0.1,

                                        overflow: 'hidden',
                                        textAlign: 'center'
                                    }}
                                    resizeMode="contain"
                                />

                            </View>




                            <Text
                                style={{
                                    fontSize: dimensions.width * 0.05,
                                    padding: dimensions.width * 0.03,
                                    fontFamily: fontSFProBold,
                                    color: '#F14D4D',
                                    textAlign: "flex-start",
                                    marginTop: dimensions.height * 0.01,
                                    fontWeight: 700,

                                }}
                            >
                                Wrong
                            </Text>

                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignSelf: 'center',
                                alignItems: 'center',
                                left: '-3%',
                            }}>
                                <Text
                                    style={{
                                        fontWeight: 700,
                                        textAlign: "left",
                                        alignSelf: 'flex-start',
                                        fontSize: dimensions.width * 0.055,
                                        paddingVertical: dimensions.width * 0.028,
                                        paddingHorizontal: dimensions.width * 0.05,
                                        color: 'white',

                                    }}
                                >
                                    15
                                </Text>
                                <Image
                                    source={require('../assets/icons/starIcon.png')}
                                    style={{
                                        width: dimensions.width * 0.1,
                                        height: dimensions.width * 0.1,
                                        left: '-40%',
                                        overflow: 'hidden',
                                        textAlign: 'center'
                                    }}
                                    resizeMode="contain"
                                />



                                <Image
                                    source={require('../assets/images/arrowImage.png')}
                                    style={{
                                        width: dimensions.width * 0.19,
                                        height: dimensions.width * 0.05,
                                        left: '-25%',
                                        overflow: 'hidden',
                                        textAlign: 'center',
                                        alignItems: 'center',
                                        marginHorizontal: dimensions.width * 0.04,
                                    }}
                                    resizeMode="stretch"
                                />


                                <Text
                                    style={{
                                        fontWeight: 700,
                                        textAlign: "left",
                                        alignSelf: 'flex-start',
                                        fontSize: dimensions.width * 0.055,
                                        paddingVertical: dimensions.width * 0.028,

                                        color: 'white',

                                    }}
                                >
                                    0
                                </Text>
                                <Image
                                    source={require('../assets/icons/starIcon.png')}
                                    style={{
                                        width: dimensions.width * 0.1,
                                        height: dimensions.width * 0.1,

                                        overflow: 'hidden',
                                        textAlign: 'center'
                                    }}
                                    resizeMode="contain"
                                />

                            </View>


                            <Text
                                style={{
                                    fontSize: dimensions.width * 0.07,
                                    padding: dimensions.width * 0.03,
                                    fontFamily: fontSFProBold,
                                    color: 'white',
                                    textAlign: "center",
                                    marginTop: dimensions.height * 0.025,
                                    fontWeight: 700,

                                }}
                            >
                                Good luck!
                            </Text>


                        </View>

                    </View>

                )}


                {isGameStarted && !isInstructionVisible && (
                    <TouchableOpacity
                        disabled={answer === ''}
                        onPress={() => {
                            checkAnswer();
                            // setGameResultModalVisible(true);
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
                            opacity: answer === '' ? 0.5 : 1,
                            

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
                    disabled={(bet === '' || bet === null || bet === '0') && !isInstructionVisible}
                    onPress={() => {
                        if (isInstructionVisible && !isGameStarted) setInstructionVisible(false)
                        else if (!isInstructionVisible && isGameStarted) {
                            setGameResultModalVisible(true);
                            // setGameStarted(false);
                        }
                        else { checkBetRange(); };
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
                        bottom: '14%',
                        opacity: (bet === '' || bet === null || bet === '0') && !isInstructionVisible ? 0.5 : 1,

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
                        {!isInstructionVisible && !isGameStarted ? 'Start' : !isInstructionVisible && isGameStarted ? 'End' : 'I get it.'}
                    </Text>
                </TouchableOpacity>
            </View>


            <Modal
                visible={isGameResultModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => {
                    setGameResultModalVisible(false);
                    setGameStarted(false);
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
                                setGameStarted(false);
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
                                        Your Bet:
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
                                        {bet}
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
                                setGameStarted(false);
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

export default GamingScreen