import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  FlatList,
  RefreshControl,
  ScrollView,
  Alert,
  Linking,
  ActivityIndicator,
} from 'react-native';
import FONTS from '../../../constants/fonts';
import COLORS from '../../../constants/colors';
import React, { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const CustomerProfileScreen = ({ route }) => {
  const {
    userID,
    customerID,
    customerGender,
    customerAddress,
    customerFullName,
    customerPhoneNumber,
  } = route.params;
  const [customer, setCustomer] = useState();

  React.useEffect(() => {
    const url = `https://tindalog-backend.up.railway.app/user/${userID}/customer/${customerID}/profile`;

    fetch(url)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => setCustomer(data))
      .catch(err => console.error('Error fetching customer:', err));
  }, [userID, customerID]);

  const navigation = useNavigation();

  // Optionally handle loading state
  if (!customer)
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <View style={styles.profile}>
            <Image
              source={
                customerGender === 'male'
                  ? require('../../../assets/profiles/male.png')
                  : customerGender === 'female'
                  ? require('../../../assets/profiles/female.png')
                  : require('../../../assets/profiles/default.png')
              }
              style={styles.avatar}
            />
            <View style={styles.profile_details}>
              <Text style={{ fontSize: 24, fontFamily: FONTS.BOLD }}>
                {customerFullName}
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: FONTS.REGULAR,
                  color: COLORS.DARKGRAY,
                }}
              >
                Customer
              </Text>
              <TouchableOpacity
                onPress={() => {
                  Linking.openURL(`tel:${customerPhoneNumber}`);
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    color: COLORS.BLUE,
                    fontFamily: FONTS.REGULAR,
                    textDecorationLine: 'underline',
                  }}
                >
                  {customerPhoneNumber}
                </Text>
              </TouchableOpacity>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: FONTS.REGULAR,
                }}
              >
                {customerAddress}
              </Text>
            </View>
            <View style={styles.profileAction}>
              <TouchableOpacity style={styles.button}>
                <Icon name="add" size={22} color={COLORS.DARK} />
                <Text style={styles.buttonText}> Transaction </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  navigation.navigate('EDITCUSTOMERPROFILESCREEN', {
                    userID: userID,
                    customerID: customerID,
                    customerGender: customerGender,
                    customerAddress: customerAddress,
                    customerFullName: customerFullName,
                    customerPhoneNumber: customerPhoneNumber,
                  });
                }}
              >
                <Icon name="create" size={22} color={COLORS.DARK} />
                <Text style={styles.buttonText}> Edit </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                gap: 16,
                height: 300,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ActivityIndicator size="large" color="#A2D2FF" />
              <Text style={{ fontSize: 24, fontFamily: FONTS.BOLD }}>
                Loading...
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.profile}>
          <Image
            source={
              customer.c_gender === 'male'
                ? require('../../../assets/profiles/male.png')
                : customer.c_gender === 'female'
                ? require('../../../assets/profiles/female.png')
                : require('../../../assets/profiles/default.png')
            }
            style={styles.avatar}
          />
          <View style={styles.profile_details}>
            <Text style={{ fontSize: 24, fontFamily: FONTS.BOLD }}>
              {customer.c_fullname}
            </Text>
            <Text
              style={{
                fontSize: 18,
                fontFamily: FONTS.REGULAR,
                color: COLORS.DARKGRAY,
              }}
            >
              Customer
            </Text>
            <TouchableOpacity
              onPress={() => {
                Linking.openURL(`tel:${customer.c_phonenumber}`);
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  color: COLORS.BLUE,
                  fontFamily: FONTS.REGULAR,
                  textDecorationLine: 'underline',
                }}
              >
                {customer.c_phonenumber}
              </Text>
            </TouchableOpacity>
            <Text
              style={{
                fontSize: 18,
                fontFamily: FONTS.REGULAR,
              }}
            >
              {customer.c_address}
            </Text>
          </View>
          <View style={styles.profileAction}>
            <TouchableOpacity style={styles.button}>
              <Icon name="add" size={22} color={COLORS.DARK} />
              <Text style={styles.buttonText}> Transaction </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                navigation.navigate('EDITCUSTOMERPROFILESCREEN', {
                  userID: customer.id,
                  customerID: customer.id,
                  customerGender: customer.c_gender,
                  customerAddress: customer.c_address,
                  customerFullName: customer.c_fullname,
                  customerPhoneNumber: customer.c_phonenumber,
                });
              }}
            >
              <Icon name="create" size={22} color={COLORS.DARK} />
              <Text style={styles.buttonText}> Edit </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.profileStatus}>
            <Text style={{ fontSize: 18, fontFamily: FONTS.REGULAR }}>
              {' '}
              Status:{' '}
            </Text>
            <Text style={{ fontSize: 18, fontFamily: FONTS.REGULAR }}>
              {' '}
              Credit:{' '}
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  profile: {
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatar: {
    width: 132,
    height: 132,
    borderWidth: 6,
    borderRadius: 72,
    borderColor: COLORS.PRIMARY,
  },

  profile_details: {
    gap: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },

  profileAction: {
    // gap: 16,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  button: {
    padding: 12,
    width: '45%',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.BLUE,
  },

  buttonText: {
    fontSize: 16,
    fontFamily: FONTS.MEDIUM,
  },

  profileStatus: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default CustomerProfileScreen;
