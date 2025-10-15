import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets, } from 'react-native-safe-area-context';
import { View, Text, Image, TouchableOpacity, StyleSheet, TextInput, Dimensions, Alert, BackHandler, RefreshControl, ScrollView } from 'react-native'
import { useFocusEffect } from '@react-navigation/native';
import React, { useEffect, useState, useCallback } from 'react'
import FONTS from '../../constants/fonts';
import COLORS from '../../constants/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const add_customer = () => {
  const [name, setName] = useState('');
  const [phonenumber, setPhonenumber] = useState('');
  const [address, setAddress] = useState('');
  const [gender, setGender] = useState('Male');
  const [error, setErrors] = useState('');


  const validationForm = () => {
    let errors = {};
    if(!name) errors.name = "Fullname is required";
    if(!phonenumber) errors.phonenumber = "Phonenumber is required";
    if(!address) errors.address = "Address is required";
    if(!gender) errors.gender = "Gender is required";

    setErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleLogin = async () => {
    if(validationForm()){
      try {
        const res = await fetch("https://tindalog-backend.up.railway.app/customers/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ c_fullname, c_phonenumber, c_address, c_gender, userid }),
        });

        const data = await res.json();

        if (res.ok) {
          Alert.alert("Success", "Customer created successfully!");
          console.log("Customer:", data.user);
          
          navigation.navigate("CUSTOMERLISTSCREEN");
        } else {
          Alert.alert("Error", data.error || "Customer creation failed");
        }
      } catch (err) {
        console.error(err);
        Alert.alert("Error", "Something went wrong");
      }

      setName("");
      setPhonenumber("");
      setAddress("");
      setGender("Male");
      setErrors({});
    }
  }

  return (
    <SafeAreaProvider>
      <ScrollView>
        <SafeAreaView style={{
          gap: 32,
          paddingTop: 42,
          paddingBottom: 220,
          paddingHorizontal: 42,
          backgroundColor: "#FFFFFF",
          }}>
            <View style={{
              gap: 12,
              flexDirection: "column",
            }}>
              <Text style={{
                fontFamily: FONTS.EXTRABOLD,
                fontSize: 24,
                color: COLORS.DARK,
              }}> Add Customer </Text>
              <View style={{
                gap: 24,
              }}>
                <View style={[ styles.inputContainer ]}>
                  <Icon name="person" size={24} color={COLORS.DARK} />
                  <TextInput 
                  placeholder='Customer Name'
                  placeholderTextColor={ COLORS.DARKGRAY }
                  style={[ styles.input, {fontFamily: FONTS.MEDIUM,
                    fontSize: 18, color: COLORS.DARK} 
                  ]}
                  onChangeText={setName}
                  value={name}
                  />
                </View>
              </View>
          </View>
        </SafeAreaView>
      </ScrollView>
    </SafeAreaProvider>
  )
}

export default add_customer

const styles = StyleSheet.create({
  error:{
    fontSize: 16,
    color: COLORS.PINK,
    fontFamily: FONTS.MEDIUM,
  },
  inputContainer:{
    gap: 16,
    paddingVertical: 12,
    paddingHorizontal: 18,
    width: "100%",
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.GRAY,
  },
  
  input:{
    width: 160,
    position: "relative",
  },

  primaryButton:{
    backgroundColor: COLORS.PRIMARY,
  },
  primaryButtonText:{
    fontFamily: FONTS.SEMIBOLD,
    color: COLORS.DARK,
    fontSize: 20,
  },
  secondaryButton:{
    backgroundColor: COLORS.DARK,
  },
  SecondaryButtonText:{
    fontFamily: FONTS.SEMIBOLD,
    color: COLORS.WHITE,
    fontSize: 20,
  },
  
  button:{
    borderRadius: 4,
    height: 50,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
})