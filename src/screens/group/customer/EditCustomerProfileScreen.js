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
import { Dropdown } from 'react-native-paper-dropdown';
import { useNavigation } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';

const EditCustomerProfileScreen = ({ route }) => {
  const {
    userID,
    customerID,
    customerGender,
    customerAddress,
    customerFullName,
    customerPhoneNumber,
  } = route.params;

  const OPTIONS = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' },
  ];

  const [userid, setUserID] = useState(`${userID}`);
  const [name, setName] = useState(`${customerFullName}`);
  const [gender, setGender] = useState(`${customerGender}`);
  const [address, setAddress] = useState(`${customerAddress}`);
  const [customerid, setCustomerID] = useState(`${customerID}`);
  const [phonenumber, setPhonenumber] = useState(`${customerPhoneNumber}`);

  const [errors, setErrors] = useState('');
  const [buttonIsDisabled, setButtonIsDisabled] = useState(false);

  const validationForm = () => {
    const validationErrors = {};
    if (!name) validationErrors.name = 'Fullname is required';
    if (!phonenumber) validationErrors.phonenumber = 'Phonenumber is required';
    if (!address) validationErrors.address = 'Address is required';
    if (!gender) validationErrors.gender = 'Gender is required';

    setErrors(validationErrors);

    return Object.keys(validationErrors).length === 0;
  };

  const handleUpdate = async () => {
    if (validationForm()) {
      try {
        setButtonIsDisabled(true);
        const res = await fetch(
          'https://tindalog-backend.up.railway.app/customers/edit',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              c_fullname: name,
              c_phonenumber: phonenumber,
              c_address: address,
              c_gender: gender,
              userid: userid,
              id: customerid,
            }),
          },
        );

        const data = await res.json();

        if (res.ok) {
          Alert.alert('Success', 'Customer updated successfully!');
          navigation.navigate('CUSTOMERLISTSCREEN');
          setButtonIsDisabled(false);
          setPhonenumber('');
          setAddress('');
          setErrors({});
          setName('');
        } else {
          Alert.alert('Error', data.error || 'Customer creation failed');
        }
      } catch (err) {
        console.error(err);
        Alert.alert('Error', 'Something went wrong');
      }
    }
  };

  const navigation = useNavigation();
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <ScrollView>
          <SafeAreaView style={styles.container}>
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
                onSelect={value => setGender(value ?? '')}
              />
            </View>
            <TouchableOpacity
              disabled={buttonIsDisabled}
              style={[styles.button, styles.primaryButton]}
              onPress={handleUpdate}
            >
              <Text style={[styles.primaryButtonText]}>
                {' '}
                Update Customer #{customerID}{' '}
              </Text>
            </TouchableOpacity>
            <View>
              {buttonIsDisabled ? (
                <Text style={[styles.error, { textAlign: 'center' }]}>
                  Please wait...
                </Text>
              ) : null}
            </View>
          </SafeAreaView>
        </ScrollView>
      </PaperProvider>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 32,
    paddingTop: 42,
    paddingBottom: 220,
    paddingHorizontal: 42,
    backgroundColor: '#FFFFFF',
  },

  profile: {
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
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

  error: {
    fontSize: 16,
    color: COLORS.PINK,
    fontFamily: FONTS.MEDIUM,
  },

  inputContainer: {
    gap: 16,
    width: '100%',
    borderRadius: 6,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
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

export default EditCustomerProfileScreen;
