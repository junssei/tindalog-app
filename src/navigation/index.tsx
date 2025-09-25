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
import { HeaderTitle } from '@react-navigation/elements';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const StackNavigation = () => {
  return (
    <Stack.Navigator>
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
    </Stack.Navigator>
  )
}

const tabnavStyles = {
  tabBarStyle:{
    position: "absolute",
  },
  tabBarLabelStyle:{
    fontSize: 10,
    color: COLORS.DARK,
    fontFamily: FONTS.MEDIUM, 
  },
  tabBarActiveBackgroundColor:COLORS.PRIMARY,
  animation: 'shift',
}

const TabNavigation = () => {
  return <Tab.Navigator
    screenOptions={[tabnavStyles, {headerTitleStyle:{ fontFamily: FONTS.BOLD }},]}
  >
    <Tab.Screen 
      name={SCREENS.HOMESCREEN}
      component={HomeScreen}
      options={{
        title: "Home",
        tabBarIcon: ({focused}) => (
          <Icon name='home' size={24} color={COLORS.DARK} />
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
          <Icon name='people' size={24} color={COLORS.DARK} />
        ),
        headerRight: () => (
          <TouchableOpacity>
            <Icon name='notifications' size={24} color={COLORS.DARK} />
          </TouchableOpacity>
        )
      }}
    />
    <Tab.Screen 
      name={SCREENS.ADDSCREEN}
      component={AddScreen}
      options={{
        title: "Add",
        tabBarIcon: ({focused}) => (
          <Icon name='add-circle' size={24} color={COLORS.DARK} />
        )
      }}
    />
    <Tab.Screen 
      name={SCREENS.HISTORYSCREEN}
      component={HistoryScreen}
      options={{
        title: "History",
        tabBarIcon: ({focused}) => (
          <Icon name='time' size={24} color={COLORS.DARK} />
        )
      }}
    />
    <Tab.Screen 
      name={SCREENS.ACCOUNTSCREEN}
      component={AccountScreen}
      options={{
        title: "Account",
        tabBarIcon: ({focused}) => (
          <Icon name='person' size={24} color={COLORS.DARK} />
        )
      }}
    />
  </Tab.Navigator>
}

export default StackNavigation