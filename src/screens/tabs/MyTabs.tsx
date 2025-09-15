import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native'
import React from 'react'

import HomeScreen from './HomeScreen';
import CustomerListScreen from './CustomerListScreen';
import AddScreen from './AddScreen';
import HistoryScreen from './HistoryScreen';
import AccountScreen from './AccountScreen';


const Tab = createBottomTabNavigator();

const MyTabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Customer" component={CustomerListScreen} />
      <Tab.Screen name="Add" component={AddScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  )
}

export default MyTabs