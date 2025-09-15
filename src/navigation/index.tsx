import { createStackNavigator } from '@react-navigation/stack'
import SCREENS from '../screens';
import WelcomeScreen from '../screens/intro/WelcomeScreen'
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import OnBoardingScreen from '../screens/intro/OnBoardingScreen';

const Stack = createStackNavigator();

const StackNavigation = () => {
  return (
    <Stack.Navigator>
        <Stack.Screen
        name={SCREENS.INTRO}
        component={OnBoardingScreen}
        options={{headerShown: false}}
        />
        <Stack.Screen
        name={SCREENS.WELCOME}
        component={WelcomeScreen}
        options={{headerShown: false}}
        />
        <Stack.Screen
        name={SCREENS.LOGIN}
        component={LoginScreen}
        options={{headerShown: false}}
        />
        <Stack.Screen
        name={SCREENS.SIGNUP}
        component={SignupScreen}
        options={{headerShown: false}}
        />
    </Stack.Navigator>
  )
}

export default StackNavigation