import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Image, TouchableOpacity, useWindowDimensions } from 'react-native';
import FONTS from '../constants/fonts';
import COLORS from '../constants/colors';
import Icon from 'react-native-vector-icons/Ionicons';

import SCREENS from '../screens';
import WelcomeScreen from '../screens/intro/WelcomeScreen'
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import OnBoardingScreen from '../screens/intro/OnBoardingScreen';

import HomeScreen from '../screens/tabs/HomeScreen';
import CustomerListScreen from '../screens/tabs/CustomerListScreen';
import AddScreen from '../screens/tabs/AddScreen';
import HistoryScreen from '../screens/tabs/HistoryScreen';
import AccountScreen from '../screens/tabs/AccountScreen';
import NotificationScreen from '../screens/tabs/NotificationScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const StackNavigation = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const [isLoggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const checkStorage = async () => {
      try {
        const onboarding = await AsyncStorage.getItem('onboardingCompleted');
        const loggedIn = await AsyncStorage.getItem("isLoggedIn");
        
        if (onboarding) setOnboardingCompleted(true);
        if (loggedIn) setLoggedIn(true);

      } catch (err) {
        console.log('Error checking storage:', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkStorage();
  }, []);

  if (isLoading) return SCREENS.WELCOME;

  // Decide where to start
  let initialRoute = SCREENS.INTRO;
  if (onboardingCompleted && !isLoggedIn) {
    initialRoute = SCREENS.WELCOME;
  } else if (onboardingCompleted && isLoggedIn) {
    initialRoute = SCREENS.HOMESCREEN;
  }

  return (
    <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen
        name={SCREENS.INTRO}
        component={OnBoardingScreen}
        options={{headerShown: false}}/>
        <Stack.Screen
        name={SCREENS.WELCOME}
        component={WelcomeScreen}
        options={{headerShown: false}}/>
        <Stack.Screen
        name={SCREENS.LOGIN}
        component={LoginScreen}
        options={{
          headerTitle: "",
          headerShown: true,
          headerBackButtonDisplayMode: "minimal",
        }}/>
        <Stack.Screen
        name={SCREENS.SIGNUP}
        component={SignupScreen}
        options={{
          headerTitle: "",
          headerShown: true,
          headerBackButtonDisplayMode: "minimal",
        }}/>
        <Stack.Screen
        name={SCREENS.HOMESCREEN}
        component={TabNavigation}
        options={{
          headerShown: false,
        }}/>

        <Stack.Group>
          <Stack.Screen
          name={SCREENS.ADDSCREEN}
          component={AddScreen}
          options={{
            presentation: "transparentModal",
            headerMode: "screen",
            headerShown: false,
            animation: 'fade',
          }}
          />
        </Stack.Group>

        <Stack.Screen
        name={SCREENS.NOTIFICATIONSCREEN}
        component={NotificationScreen}
        options={{
          headerShown: true,
          headerBackButtonDisplayMode: "minimal",
        }}
        />
    </Stack.Navigator>
  )
}

const TabNavigation = () => {
  const navigation = useNavigation();

  return <Tab.Navigator
    screenOptions={{
      tabBarStyle:{
        paddingTop: 16,
        paddingBottom: 8,
        height: 80,
        position: "absolute",
      },
      tabBarAllowFontScaling:true,
      tabBarItemStyle: {
        borderRadius: 16,
        marginHorizontal: 6,
      },
      tabBarLabelStyle:{
        fontSize: 10,
        color: COLORS.DARK,
        fontFamily: FONTS.MEDIUM, 
      },
      tabBarActiveBackgroundColor: COLORS.PRIMARY,
      tabBarInactiveTintColor: 'rgba(0,0,0,0)',
      animation: 'shift',
      headerTitleStyle: { fontFamily: FONTS.BOLD },
      headerRight: () => (
        <TouchableOpacity>
          <Icon name='notifications' size={24} color={COLORS.DARK} />
        </TouchableOpacity>
      ),
      headerRightContainerStyle: {
        paddingRight: 15,
      },
    }}
  >
    <Tab.Screen 
      name={SCREENS.HOMESCREEN}
      component={HomeScreen}
      options={{
        title: "Home",
        tabBarIcon: ({focused}) => (
          <Icon
          name={focused ? 'home' : 'home-outline'}
          size={24}
          color={COLORS.DARK}
          />
        ),
        headerShown: false,
      }}
    />
    <Tab.Screen 
      name={SCREENS.CUSTOMERLISTSCREEN}
      component={CustomerListScreen}
      options={{
        title: "Customer",
        tabBarIcon: ({focused}) => (
          <Icon name={focused ? 'people' : 'people-outline'} size={24} color={COLORS.DARK} />
        ),
      }}
    />
    <Tab.Screen 
      name={SCREENS.TEMPADD}
      component={AddScreen}
      options={{
        tabBarLabel: () => null,
        tabBarShowLabel: false,
        tabBarIcon: ({focused}) => (
          <Icon
          name='add-circle'
          size={64}
          color={COLORS.DARK}
          style={{
            margin: -16,
          }}
          />
        )
      }}
      listeners={({ navigation }) => ({
        tabPress: (e) => {
          e.preventDefault();
          navigation.navigate(SCREENS.ADDSCREEN);
        },
      })}
    />
    <Tab.Screen 
      name={SCREENS.HISTORYSCREEN}
      component={HistoryScreen}
      options={{
        title: "History",
        tabBarIcon: ({focused}) => (
          <Icon name={focused ? 'time' : 'time-outline'} size={24} color={COLORS.DARK} />
        )
      }}
    />
    <Tab.Screen 
      name={SCREENS.ACCOUNTSCREEN}
      component={AccountScreen}
      options={{
        title: "Account",
        tabBarIcon: ({focused}) => (
          <Icon name={focused ? 'person' : 'person-outline'} size={24} color={COLORS.DARK} />
        )
      }}
    />
  </Tab.Navigator>
}

export default StackNavigation