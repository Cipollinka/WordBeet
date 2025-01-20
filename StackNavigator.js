import React, { useContext, useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { loadUserData } from './src/redux/userSlice';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { UserProvider, UserContext } from './src/context/UserContext';
import { TailwindProvider } from 'tailwind-rn';
import OnboardingScreen from './src/screens/OnboardingScreen';
import { ActivityIndicator, View, Platform } from 'react-native';
import HomeScreen from './src/screens/HomeScreen';
import { Provider, useDispatch } from 'react-redux';
import store from './src/redux/store';
import utilities from './tailwind.json';
import DeviceInfo from 'react-native-device-info';

const Stack = createNativeStackNavigator();

const WordBetStack = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <UserProvider>
          <TailwindProvider utilities={utilities}>
            <SafeAreaProvider>
              <AppNavigator />
            </SafeAreaProvider>
          </TailwindProvider>
        </UserProvider>
      </Provider>
    </GestureHandlerRootView>
  );
};

const AppNavigator = () => {
  const { user, setUser } = useContext(UserContext);
  const [initializingWordBetApp, setInitializingMinSpiritApp] = useState(true);
  const [onboardVisible, setOnboardVisible] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUserData());
  }, [dispatch]);

  useEffect(() => {
    const loadUserThis = async () => {
      try {
        const deviceId = await DeviceInfo.getUniqueId();
        const storageKey = `currentUser_${deviceId}`;
        const storedUser = await AsyncStorage.getItem(storageKey);
        const isOnboardingWasStarted = await AsyncStorage.getItem('isOnboardingWasStarted');

        if (storedUser) {
          setUser(JSON.parse(storedUser));
          setOnboardVisible(false);
        } else if (isOnboardingWasStarted) {
          setOnboardVisible(false);
        } else {
          setOnboardVisible(true);
          await AsyncStorage.setItem('isOnboardingWasStarted', 'true');
        }
      } catch (error) {
        console.error('Error cur loading of user', error);
      } finally {
        setInitializingMinSpiritApp(false);
      }
    };
    loadUserThis();
  }, [setUser]);

  if (initializingWordBetApp) {
    return (
      <View style={{
        justifyContent: 'center',
        backgroundColor: '#C05018',
        alignItems: 'center',
        flex: 1,
      }}>
        <ActivityIndicator color="white" size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={onboardVisible ? 'OnboardingScreen' : 'OnboardingScreen'}>
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="OnboardingScreen" component={OnboardingScreen}
          options={{
            headerShown: false
          }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default WordBetStack;
