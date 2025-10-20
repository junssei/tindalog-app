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

// Admin
import DashboardScreen from '../screens/admin/DashboardScreen';
import UserListScreen from '../screens/admin/UserListScreen';
import AccountScreen from '../screens/admin/tabs/AccountScreen';

import NotificationScreen from '../screens/admin/tabs/NotificationScreen';

const AdminStack = createStackNavigator();
const AdminTab = createBottomTabNavigator();

const AdminStackNavigation = () => {
  const navigation = useNavigation<any>();

  return (
    <AdminStack.Navigator initialRouteName={SCREENS.DASHBOARDSCREEN}>
      <AdminStack.Screen
        name={SCREENS.DASHBOARDSCREEN}
        component={AdminTabNavigation}
        options={{
          headerShown: false,
        }}
      />
      <AdminStack.Screen
        name={SCREENS.NOTIFICATIONSCREEN}
        component={NotificationScreen}
        options={{
          headerShown: true,
        }}
      />
    </AdminStack.Navigator>
  );
};

const AdminTabNavigation = () => {
  const admin_navigation = useNavigation<any>();

  return (
    <AdminTab.Navigator
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
            onPress={() =>
              admin_navigation.navigate(SCREENS.NOTIFICATIONSCREEN)
            }
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
      <AdminTab.Screen
        name={SCREENS.DASHBOARDSCREEN}
        component={DashboardScreen}
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ focused }) => (
            <Icon
              name={focused ? 'grid' : 'grid-outline'}
              size={24}
              color={COLORS.DARK}
            />
          ),
          headerShown: true,
        }}
      />
      <AdminTab.Screen
        name={SCREENS.USERLISTSCREEN}
        component={UserListScreen}
        options={{
          title: 'Users',
          tabBarIcon: ({ focused }) => (
            <Icon
              name={focused ? 'people' : 'people-outline'}
              size={24}
              color={COLORS.DARK}
            />
          ),
        }}
      />
      <AdminTab.Screen
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
    </AdminTab.Navigator>
  );
};

export default AdminStackNavigation;
