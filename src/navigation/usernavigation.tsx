import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

import { TouchableOpacity } from 'react-native';
import FONTS from '../constants/fonts';
import COLORS from '../constants/colors';
import Icon from 'react-native-vector-icons/Ionicons';

import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SCREENS from '../screens';

import HomeScreen from '../screens/tabs/HomeScreen';
import CustomerListScreen from '../screens/tabs/CustomerListScreen';
import AddScreen from '../screens/tabs/AddScreen';
import HistoryScreen from '../screens/tabs/ProductScreen';
import AccountScreen from '../screens/tabs/AccountScreen';
import NotificationScreen from '../screens/tabs/NotificationScreen';

import AddCustomer from '../screens/form/add_customer';
import AddPayment from '../screens/form/add_payment';
import AddUtang from '../screens/form/add_utang';
import AddSale from '../screens/form/add_sale';
import CustomerProfileScreen from '../screens/group/customer/CustomerProfileScreen';
import EditCustomerProfileScreen from '../screens/group/customer/EditCustomerProfileScreen';
import ProductScreen from '../screens/tabs/ProductScreen';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';

const UserStack = createStackNavigator();
const UserTab = createBottomTabNavigator();

const UserStackNavigation = () => {
  return (
    <UserStack.Navigator initialRouteName={SCREENS.HOMESCREEN}>
      <UserStack.Screen
        name={SCREENS.HOMESCREEN}
        component={UserTabNavigation}
        options={{
          headerShown: false,
        }}
      />

      <UserStack.Group>
        <UserStack.Screen
          name={SCREENS.ADDSCREEN}
          component={AddScreen}
          options={{
            presentation: 'transparentModal',
            headerMode: 'screen',
            headerShown: false,
            animation: 'fade',
          }}
        />
      </UserStack.Group>

      <UserStack.Group>
        <UserStack.Screen
          name={SCREENS.VIEWCUSTOMERPROFILESCREEN}
          component={CustomerProfileScreen}
          options={{
            headerShown: true,
            headerTitleStyle: { fontFamily: FONTS.BOLD },
            headerTitle: 'Customer Profile',
            headerBackButtonDisplayMode: 'minimal',
            headerBackImage: () => (
              <Icon name="chevron-back" size={22} color={COLORS.DARK} />
            ),
          }}
        />

        <UserStack.Screen
          name={SCREENS.EDITCUSTOMERPROFILESCREEN}
          component={EditCustomerProfileScreen}
          options={{
            headerShown: true,
            headerTitleStyle: { fontFamily: FONTS.BOLD },
            headerTitle: 'Edit Customer Profile',
            headerBackButtonDisplayMode: 'minimal',
            headerBackImage: () => (
              <Icon name="chevron-back" size={22} color={COLORS.DARK} />
            ),
          }}
        />
      </UserStack.Group>

      <UserStack.Screen
        name={SCREENS.NOTIFICATIONSCREEN}
        component={NotificationScreen}
        options={{
          headerShown: true,
          headerTitle: 'NOTIFICATION',
          headerBackButtonDisplayMode: 'minimal',
          headerTitleStyle: { fontFamily: FONTS.BOLD },
          headerBackImage: () => (
            <Icon name="chevron-back" size={22} color={COLORS.DARK} />
          ),
        }}
      />

      <UserStack.Screen
        name={SCREENS.ADDPAYMENTSCREEN}
        component={AddPayment}
        options={{
          headerShown: true,
          headerBackButtonDisplayMode: 'minimal',
        }}
      />
      <UserStack.Screen
        name={SCREENS.ADDUTANGSCREEN}
        component={AddUtang}
        options={{
          headerShown: true,
          headerBackButtonDisplayMode: 'minimal',
        }}
      />
      <UserStack.Screen
        name={SCREENS.ADDSALESCREEN}
        component={AddSale}
        options={{
          headerShown: true,
          headerBackButtonDisplayMode: 'minimal',
        }}
      />
      <UserStack.Screen
        name={SCREENS.ADDCUSTOMERSCREEN}
        component={AddCustomer}
        options={{
          headerShown: false,
          headerBackButtonDisplayMode: 'minimal',
        }}
      />
    </UserStack.Navigator>
  );
};

const UserTabNavigation = () => {
  const navigation = useNavigation<any>();

  return (
    <UserTab.Navigator
      screenOptions={{
        tabBarStyle: {
          paddingTop: 16,
          paddingBottom: 8,
          height: 80,
          position: 'absolute',
        },
        tabBarAllowFontScaling: true,
        tabBarItemStyle: {
          borderRadius: 16,
          marginHorizontal: 6,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          color: COLORS.DARK,
          fontFamily: FONTS.MEDIUM,
        },
        tabBarActiveBackgroundColor: COLORS.PRIMARY,
        tabBarInactiveTintColor: 'rgba(0,0,0,0)',
        animation: 'shift',
        headerTitleStyle: { fontFamily: FONTS.BOLD },
        headerRight: () => (
          <TouchableOpacity
            onPress={() => navigation.navigate(SCREENS.NOTIFICATIONSCREEN)}
            style={{ marginRight: 15 }}
          >
            <Icon name="notifications" size={24} color={COLORS.DARK} />
          </TouchableOpacity>
        ),
        headerRightContainerStyle: {
          paddingRight: 15,
        },
      }}
    >
      <UserTab.Screen
        name={SCREENS.HOMESCREEN}
        component={HomeScreen}
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <Icon
              name={focused ? 'home' : 'home-outline'}
              size={24}
              color={COLORS.DARK}
            />
          ),
          headerShown: false,
        }}
      />
      <UserTab.Screen
        name={SCREENS.CUSTOMERLISTSCREEN}
        component={CustomerListScreen}
        options={{
          title: 'Customer',
          tabBarIcon: ({ focused }) => (
            <Icon
              name={focused ? 'people' : 'people-outline'}
              size={24}
              color={COLORS.DARK}
            />
          ),
        }}
      />
      <UserTab.Screen
        name={SCREENS.TEMPADD}
        component={AddScreen}
        options={{
          tabBarLabel: () => null,
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <Icon
              name="add-circle"
              size={64}
              color={COLORS.DARK}
              style={{
                margin: -16,
              }}
            />
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: e => {
            e.preventDefault();
            navigation.navigate(SCREENS.ADDSCREEN);
          },
        })}
      />
      <UserTab.Screen
        name={SCREENS.PRODUCTSCREEN}
        component={ProductScreen}
        options={{
          title: 'Products',
          tabBarIcon: ({ focused }) => (
            <MaterialDesignIcons
              name={focused ? 'egg' : 'egg-outline'}
              size={24}
              color={COLORS.DARK}
            />
          ),
        }}
      />
      <UserTab.Screen
        name={SCREENS.ACCOUNTSCREEN}
        component={AccountScreen}
        options={{
          title: 'Account',
          tabBarIcon: ({ focused }) => (
            <Icon
              name={focused ? 'person' : 'person-outline'}
              size={24}
              color={COLORS.DARK}
            />
          ),
        }}
      />
    </UserTab.Navigator>
  );
};

export default UserStackNavigation;
