import AsyncStorage from '@react-native-async-storage/async-storage';

import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native'
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets, } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import React, { useState, useEffect } from 'react'

import COLORS from '../../constants/colors';
import FONTS from '../../constants/fonts';

const AccountScreen = () => {
  const navigation = useNavigation();

  const logoutUser = async () => {
    await AsyncStorage.removeItem('isLoggedIn');
    navigation.replace('WELCOME');
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{
        gap: 32,
        paddingVertical: 42,
        paddingHorizontal: 42,
        backgroundColor: "#FFFFFF",
        }}>
          <TouchableOpacity
            onPress={ logoutUser }
          >
            <Text> Logout </Text>
          </TouchableOpacity>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

export default AccountScreen