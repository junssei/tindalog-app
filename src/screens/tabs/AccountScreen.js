import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

import COLORS from '../../constants/colors';
import FONTS from '../../constants/fonts';
import { ScrollView } from 'react-native-gesture-handler';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';

const AccountScreen = () => {
  const navigation = useNavigation();

  const [profile, setProfile] = useState('');
  const [user, setUser] = useState('');
  React.useEffect(() => {
    const loadUserData = async () => {
      try {
        const user_data = await AsyncStorage.getItem('userData');
        if (user_data) setUser(JSON.parse(user_data));
      } catch (err) {
        console.error('Failed to load user data', err);
      }
    };

    loadUserData();
  }, []);

  React.useEffect(() => {
    if (!user || !user.id) return;

    const url = `https://tindalog-backend.up.railway.app/user/${user.id}`;
    fetch(url)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => setProfile(data))
      .catch(err => console.error('Error fetching user:', err));
  }, [user]);

  const logoutUser = async () => {
    Alert.alert('Success', 'Logout successful!');
    await AsyncStorage.removeItem('isLoggedIn');
    await AsyncStorage.removeItem('userData');
    navigation.replace('WELCOME');
    console.log('Logged out');
  };

  return (
    <SafeAreaProvider>
      <ScrollView>
        <SafeAreaView
          style={{
            gap: 32,
            paddingVertical: 42,
            paddingHorizontal: 20,
            backgroundColor: '#FFFFFF',
          }}
        >
          <View style={styles.profile}>
            {user.gender === 'Male' ? (
              <Image
                source={require('../../assets/profiles/male.png')}
                style={styles.profileImg}
              />
            ) : user.gender === 'Female' ? (
              <Image
                source={require('../../assets/profiles/male.png')}
                style={styles.profileImg}
              />
            ) : (
              <Image
                source={require('../../assets/profiles/male.png')}
                style={styles.profileImg}
              />
            )}
            <View style={styles.profileDetails}>
              <Text style={styles.profileUsername}>{user.username}</Text>
              <Text style={styles.profileEmail}>{user.email}</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={logoutUser}
            style={{
              gap: 8,
              padding: 12,
              borderRadius: 12,
              flexDirection: 'row',
              alignItems: 'baseline',
              justifyContent: 'center',
              backgroundColor: COLORS.BLUE,
            }}
          >
            <MaterialDesignIcons
              size={24}
              name="account-edit"
              color={COLORS.DARK}
            />
            <Text
              style={{
                fontSize: 20,
                color: COLORS.DARK,
                fontFamily: FONTS.SEMIBOLD,
              }}
            >
              {' '}
              Edit Profile{' '}
            </Text>
          </TouchableOpacity>

          {/* Menus */}
          <View>
            <Text>Account & Store Info</Text>
            <TouchableOpacity style={styles.menu}>
              <MaterialDesignIcons
                size={24}
                name="account-outline"
                color={COLORS.DARK}
              />
              <Text style={styles.menuText}> Account </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menu}>
              <MaterialDesignIcons
                size={24}
                name="storefront"
                color={COLORS.DARK}
              />
              <Text style={styles.menuText}> Store Information </Text>
            </TouchableOpacity>
          </View>
          <View>
            <Text>About App</Text>
            <TouchableOpacity style={styles.menu}>
              <MaterialDesignIcons
                size={24}
                name="information-box-outline"
                color={COLORS.DARK}
              />
              <Text style={styles.menuText}> About TindaLog </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menu}>
              <MaterialDesignIcons
                size={24}
                name="arrow-up-bold-box-outline"
                color={COLORS.DARK}
              />
              <Text style={styles.menuText}> App Version / Updates </Text>
            </TouchableOpacity>
          </View>

          {/*  */}
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
            <MaterialDesignIcons
              style={{ transform: [{ scaleX: -1 }] }}
              name="logout-variant"
              size={24}
              color={COLORS.DARK}
            />
            <Text
              style={{
                fontSize: 20,
                color: COLORS.DARK,
                fontFamily: FONTS.SEMIBOLD,
              }}
            >
              {' '}
              Logout{' '}
            </Text>
          </TouchableOpacity>
        </SafeAreaView>
        <View
          style={{
            // borderTopWidth: 1,
            paddingVertical: 32,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: COLORS.DARK,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              color: '#999999',
              textAlign: 'center',
              fontFamily: FONTS.MEDIUM,
            }}
          >
            © {new Date().getFullYear()} TindaLog. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  profile: {
    gap: 8,
    alignItems: 'center',
  },

  profileDetails: {
    alignItems: 'center',
  },

  profileImg: {
    width: 124,
    height: 124,
  },

  profileUsername: {
    fontSize: 24,
    fontFamily: FONTS.BOLD,
    textTransform: 'uppercase',
  },

  profileEmail: {
    fontSize: 16,
    textAlign: 'center',
    color: COLORS.DARKGRAY,
    fontFamily: FONTS.REGULAR,
  },

  menu: {
    gap: 12,
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomWidth: 2,
    paddingVertical: 16,
    borderBottomColor: COLORS.GRAY,
  },

  menuText: {
    fontSize: 16,
    fontFamily: FONTS.REGULAR,
  },
});

export default AccountScreen;
