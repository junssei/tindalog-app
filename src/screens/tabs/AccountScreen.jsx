import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import React, { useState, useEffect } from 'react';

import COLORS from '../../constants/colors';
import FONTS from '../../constants/fonts';

const AccountScreen = () => {
  const navigation = useNavigation();

  const logoutUser = async () => {
    Alert.alert('Success', 'Logout successful!');
    await AsyncStorage.removeItem('isLoggedIn');
    await AsyncStorage.removeItem('userData');
    navigation.replace('WELCOME');
    console.log('Logged out');
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{
          gap: 32,
          paddingVertical: 42,
          paddingHorizontal: 42,
          backgroundColor: '#FFFFFF',
        }}
      >
        <View>
          <View>
            <Text> Username </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={logoutUser}
          style={{
            gap: 8,
            padding: 12,
            borderRadius: 12,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: COLORS.PINK,
          }}
        >
          <Icon name="log-out-outline" size={22} color={COLORS.DARK} />
          <Text> Logout </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default AccountScreen;
