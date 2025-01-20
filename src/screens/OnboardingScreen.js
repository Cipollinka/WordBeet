import React, { useEffect, useRef, useState } from 'react';
import { View, FlatList, Animated, Text, TouchableOpacity, ImageBackground, Dimensions, Image, Platform, TextInput, SafeAreaView } from 'react-native';
import { styled } from 'nativewind';
import wordBetOnboardingData from '../components/wordBetOnboardingData';
import { useNavigation } from '@react-navigation/native';
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledView = styled(View);

const fontSFProMedium = 'SFProText-Medium';

const OnboardingScreen = () => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [currentIndex, setCurrentIndex] = useState(0);
  const slidesRef = useRef(null);
  const navigation = useNavigation();
  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollNextSlide = () => {
    slidesRef.current.scrollToIndex({ index: currentIndex + 1 });
  };




  const viewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems && viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;


  useEffect(() => {
    const onChange = ({ window }) => {
      setDimensions(window);
    };
    const dimensionListener = Dimensions.addEventListener('change', onChange);
    return () => {
      dimensionListener.remove();
    };

  }, []);


  const renderItem = ({ item }) => (
    <ImageBackground
      source={item.bgImage}
      style={{
        justifyContent: 'space-between',
        alignItems: 'center',
        flex: 1,
        width: dimensions.width,
        height: dimensions.height,
      }}
      resizeMode="stretch"
    >


      <SafeAreaView style={{
        width: dimensions.width,
        alignItems: 'center',
        flex: 1,
        justifyContent: 'flex-start',
        position: 'relative',

      }} >
        <View style={{
          position: 'absolute',
          alignItems: 'center',
          height: dimensions.width < 380 ? '25%' : '23%',
          alignSelf: 'center',
          zIndex: 0,
          bottom: '23%',
          width: '85%',
          borderRadius: '8%',
        }}>

          <Text
            style={{
              fontSize: dimensions.width * 0.07,
              fontFamily: fontSFProMedium,
              color: 'white',
              maxWidth: '100%',
              alignSelf: 'center',
              textAlign: 'center',
            }}>
            {item.title}
          </Text>
          <Text
            style={{
              fontSize: dimensions.width * 0.05,
              marginTop: dimensions.height * 0.03,
              alignSelf: 'center',
              maxWidth: '100%',
              color: 'white',
              fontFamily: fontSFProMedium,
              textAlign: 'center',

            }}>
            {item.description}
          </Text>
        </View>

      </SafeAreaView>
    </ImageBackground>
  );

  return (
    <StyledView
      style={{ 
        alignItems: 'center', 
        backgroundColor: '#06263D', 
        justifyContent: 'space-between', 
        flex: 1, 
      }}
    >
      <StyledView style={{ display: 'flex' }}>
        <FlatList
          data={wordBetOnboardingData}
          renderItem={renderItem}
          showsHorizontalScrollIndicator={false}
          horizontal
          keyExtractor={(item) => item.id.toString()}
          pagingEnabled
          bounces={false}
          scrollEnabled={currentIndex === 0}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
            useNativeDriver: false,
          })}
          onViewableItemsChanged={viewableItemsChanged}
          scrollEventThrottle={32}
          viewabilityConfig={viewConfig}
          ref={slidesRef}
        />
      </StyledView>

      <StyledTouchableOpacity
        onPress={() => {
          if (currentIndex === wordBetOnboardingData.length - 1) {
            navigation.navigate('Home');
          } else scrollNextSlide();
        }}
        style={{
          backgroundColor: 'white',
          paddingVertical: 16,
          bottom: '12%',
          marginBottom: 40,
          borderRadius: dimensions.width * 0.04,
          paddingHorizontal: 28,
          width: '80%',
          alignSelf: 'center',

        }}
      >
        <Text
          style={{
            fontFamily: fontSFProMedium,
            textAlign: 'center', fontWeight: 600,
            color: 'black',
            fontSize: wordBetOnboardingData.length - 1 ?
              dimensions.width * 0.04 : dimensions.width * 0.05,
          }}>
          {currentIndex === wordBetOnboardingData.length - 1 ? "Start" : "Next"}
        </Text>
      </StyledTouchableOpacity>

    </StyledView>
  );
};

export default OnboardingScreen;
