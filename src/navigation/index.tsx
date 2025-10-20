import AsyncStorage from '@react-native-async-storage/async-storage';

import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import SCREENS from '../screens';
import WelcomeScreen from '../screens/intro/WelcomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import OnBoardingScreen from '../screens/intro/OnBoardingScreen';

import UserStackNavigation from './usernavigation';
import AdminTabNavigation from './adminnavigation';

const MainStack = createStackNavigator();

// Main Stack
const StackNavigation = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState<{ role?: string } | null>(null);

  useEffect(() => {
    const checkStorage = async () => {
      try {
        const onboarding = await AsyncStorage.getItem('onboardingCompleted');
        const loggedIn = await AsyncStorage.getItem('isLoggedIn');
        const userData = await AsyncStorage.getItem('userData');

        if (onboarding) setOnboardingCompleted(true);
        if (loggedIn) setLoggedIn(true);
        if (userData) setUser(JSON.parse(userData));
      } catch (err) {
        console.log('Error checking storage:', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkStorage();
  }, []);

  if (isLoading) return SCREENS.WELCOME;

  let initialRoute = SCREENS.INTRO;
  if (onboardingCompleted && !isLoggedIn) {
    initialRoute = SCREENS.WELCOME;
  } else if (onboardingCompleted && isLoggedIn) {
    if (user?.role === 'admin') initialRoute = SCREENS.DASHBOARDSCREEN;
    if (user?.role === 'shopkeeper') initialRoute = SCREENS.HOMESCREEN;
  }

  return (
    <MainStack.Navigator initialRouteName={initialRoute}>
      <MainStack.Screen
        name={SCREENS.INTRO}
        component={OnBoardingScreen}
        options={{ headerShown: false }}
      />
      <MainStack.Screen
        name={SCREENS.WELCOME}
        component={WelcomeScreen}
        options={{ headerShown: false }}
      />
      <MainStack.Screen
        name={SCREENS.LOGIN}
        component={LoginScreen}
        options={{
          headerTitle: '',
          headerShown: true,
          headerBackButtonDisplayMode: 'minimal',
        }}
      />
      <MainStack.Screen
        name={SCREENS.SIGNUP}
        component={SignupScreen}
        options={{
          headerTitle: '',
          headerShown: true,
          headerBackButtonDisplayMode: 'minimal',
        }}
      />

      <MainStack.Screen
        name={'DASHBOARDSCREEN'}
        component={AdminTabNavigation}
        options={{
          headerShown: false,
        }}
      />

      <MainStack.Screen
        name={'HOMESCREEN'}
        component={UserStackNavigation}
        options={{
          headerShown: false,
        }}
      />
    </MainStack.Navigator>
  );
};

export default StackNavigation;
