import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Dimensions,
  Alert,
  BackHandler,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import React, { useEffect, useState, useCallback } from 'react';
import FONTS from '../../constants/fonts';
import COLORS from '../../constants/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dropdown } from 'react-native-paper-dropdown';
import { Provider as PaperProvider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const add_customer = () => {
  const navigation = useNavigation<any>();

  const [buttonIsDisabled, setButtonIsDisabled] = useState(false);

  type User = { id: string; [key: string]: any } | null;
  const [user, setUser] = useState<User>(null);
  const userid = user?.id ?? null;
  const [name, setName] = useState('');
  const [phonenumber, setPhonenumber] = useState('');
  const [address, setAddress] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [gender, setGender] = useState('');

  const OPTIONS = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' },
  ];

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

  const validationForm = () => {
    const validationErrors: Record<string, string> = {};
    if (!name) validationErrors.name = 'Fullname is required';
    if (!phonenumber) validationErrors.phonenumber = 'Phonenumber is required';
    if (!address) validationErrors.address = 'Address is required';
    if (!gender) validationErrors.gender = 'Gender is required';

    setErrors(validationErrors);

    return Object.keys(validationErrors).length === 0;
  };

  const handleCreate = async () => {
    if (validationForm()) {
      try {
        setButtonIsDisabled(true);
        const res = await fetch(
          'https://tindalog-backend.up.railway.app/customers/create',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              c_fullname: name,
              c_phonenumber: phonenumber,
              c_address: address,
              c_gender: gender,
              userid,
            }),
          },
        );

        const data = await res.json();

        if (res.ok) {
          Alert.alert('Success', 'Customer created successfully!');
          // navigation.navigate('CUSTOMERLISTSCREEN');
          navigation.goBack();
          setButtonIsDisabled(false);
          setName('');
          setPhonenumber('');
          setAddress('');
          setErrors({});
        } else {
          Alert.alert('Error', data.error || 'Customer creation failed');
        }
      } catch (err) {
        console.error(err);
        Alert.alert('Error', 'Something went wrong');
      }
    }
  };

  return (
    <SafeAreaProvider>
      <PaperProvider>
        <ScrollView>
          <SafeAreaView
            style={{
              gap: 32,
              paddingTop: 42,
              paddingBottom: 220,
              paddingHorizontal: 42,
              backgroundColor: '#FFFFFF',
            }}
          >
            <View
              style={{
                gap: 12,
                flexDirection: 'column',
              }}
            >
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Icon name="arrow-back" size={32} color={COLORS.DARK} />
              </TouchableOpacity>
              <Text
                style={{
                  fontFamily: FONTS.EXTRABOLD,
                  fontSize: 24,
                  color: COLORS.DARK,
                }}
              >
                {' '}
                Add Customer{' '}
              </Text>
              <View
                style={{
                  gap: 24,
                }}
              >
                <View style={[styles.inputContainer]}>
                  <Icon name="person" size={24} color={COLORS.DARK} />
                  <TextInput
                    editable={!buttonIsDisabled}
                    placeholder="Customer Name"
                    placeholderTextColor={COLORS.DARKGRAY}
                    style={[
                      styles.input,
                      {
                        fontFamily: FONTS.MEDIUM,
                        fontSize: 18,
                        color: COLORS.DARK,
                      },
                    ]}
                    onChangeText={setName}
                    value={name}
                  />
                </View>
                <View style={[styles.inputContainer]}>
                  <Icon name="call" size={24} color={COLORS.DARK} />
                  <TextInput
                    editable={!buttonIsDisabled}
                    placeholder="Phone Number"
                    placeholderTextColor={COLORS.DARKGRAY}
                    style={[
                      styles.input,
                      {
                        fontFamily: FONTS.MEDIUM,
                        fontSize: 18,
                        color: COLORS.DARK,
                      },
                    ]}
                    onChangeText={setPhonenumber}
                    value={phonenumber}
                  />
                </View>
                <View style={[styles.inputContainer]}>
                  <Icon name="location" size={24} color={COLORS.DARK} />
                  <TextInput
                    editable={!buttonIsDisabled}
                    placeholder="Address"
                    placeholderTextColor={COLORS.DARKGRAY}
                    style={[
                      styles.input,
                      {
                        fontFamily: FONTS.MEDIUM,
                        fontSize: 18,
                        color: COLORS.DARK,
                      },
                    ]}
                    onChangeText={setAddress}
                    value={address}
                  />
                </View>
                <View style={[{ width: '100%' }]}>
                  <Dropdown
                    label="Gender"
                    placeholder="Select Gender"
                    options={OPTIONS}
                    value={gender}
                    onSelect={(value?: string) => setGender(value ?? '')}
                  />
                </View>
                <TouchableOpacity
                  disabled={buttonIsDisabled}
                  style={[styles.button, styles.primaryButton]}
                  onPress={handleCreate}
                >
                  <Text style={[styles.primaryButtonText]}>
                    {' '}
                    Create Customer{' '}
                  </Text>
                </TouchableOpacity>
                <View>
                  {buttonIsDisabled ? (
                    <Text style={[styles.error, { textAlign: 'center' }]}>
                      Please wait...
                    </Text>
                  ) : null}
                </View>
              </View>
            </View>
          </SafeAreaView>
        </ScrollView>
      </PaperProvider>
    </SafeAreaProvider>
  );
};

export default add_customer;

const styles = StyleSheet.create({
  error: {
    fontSize: 16,
    color: COLORS.PINK,
    fontFamily: FONTS.MEDIUM,
  },
  inputContainer: {
    gap: 16,
    paddingVertical: 12,
    paddingHorizontal: 18,
    width: '100%',
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.GRAY,
  },

  input: {
    width: 160,
    position: 'relative',
  },

  primaryButton: {
    backgroundColor: COLORS.PRIMARY,
  },
  primaryButtonText: {
    fontFamily: FONTS.SEMIBOLD,
    color: COLORS.DARK,
    fontSize: 20,
  },
  secondaryButton: {
    backgroundColor: COLORS.DARK,
  },
  SecondaryButtonText: {
    fontFamily: FONTS.SEMIBOLD,
    color: COLORS.WHITE,
    fontSize: 20,
  },

  button: {
    borderRadius: 4,
    height: 50,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
