import AsyncStorage from '@react-native-async-storage/async-storage';

import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native'
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets, } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import React, { useState, useEffect } from 'react'

import COLORS from '../../constants/colors';
import FONTS from '../../constants/fonts';

const LoginScreen = () => {
  const navigation = useNavigation();

  const [ email, setEmail ] = useState("");
  const [ password, setPassword ] = useState("");
  const [ errors, setErrors ] = useState({});

  const [ togglePassword, setTogglePassword] = useState(true);
  const [ toggleEye, setToggleEye ] = useState("eye-off");
  const [ togglePWPlaceHolder, setTogglePWPlaceHolder] = useState("********");

  function togglePass(){
    if(togglePassword === true){
      setTogglePassword(false)
      setToggleEye("eye")
      setTogglePWPlaceHolder("Password")
    } else {
      setTogglePassword(true)
      setToggleEye("eye-off")
      setTogglePWPlaceHolder("********");
    }
  }

  const validationForm = () => {
    let errors = {};
    if(!email) errors.email = "Username is required";
    if(!password) errors.password = "Password is required";

    setErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleLogin = async () => {
    if(validationForm()){
      try {
        const res = await fetch("https://tindalog-backend.up.railway.app/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (res.ok) {
          Alert.alert("Success", "Login successful!");
          console.log("User:", data.user);

          await AsyncStorage.setItem("isLoggedIn", "true");
          await AsyncStorage.setItem("userData", JSON.stringify(data.user));
          
          if(data.user.role === "admin"){
            navigation.navigate("DASHBOARD");
          } else {
            navigation.navigate("HOMESCREEN");
          }
        } else {
          Alert.alert("Error", data.error || "Login failed");
        }
      } catch (err) {
        console.error(err);
        Alert.alert("Error", "Something went wrong");
      }

      setEmail("");
      setPassword("");
      setErrors({});
    }
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{
        paddingVertical: 42,
        paddingHorizontal: 42,
        backgroundColor: "#FFFFFF",
      }}>
        <View style={{
          gap: 24,
          height: "100%",
          justifyContent: "center",
          }}>
            <Text style={{
              fontFamily: FONTS.EXTRABOLD,
              fontSize: 40,
              color: COLORS.DARK,
            }}> Login Your Account </Text>
            <View style={{
              gap: 24,
            }}>
              <View style={{ alignItems: "flex-end", }}>
                <View style={[ styles.inputContainer ]}>
                  <Icon name="mail" size={24} color={COLORS.DARK} />
                  <TextInput 
                  placeholder='Email'
                  placeholderTextColor={ COLORS.DARKGRAY }
                  style={[ styles.input, {fontFamily: FONTS.MEDIUM,
                    fontSize: 18, color: COLORS.DARK} 
                  ]}
                  onChangeText={setEmail}
                  value={email}
                  />
                </View>
                {
                  errors.email ? <Text style={ styles.error }>{errors.email}</Text> : null
                }
              </View>
              <View style={{
                gap: 8,
                alignItems: "flex-end",
              }}>
                <View style={[ styles.inputContainer, {justifyContent: "space-between"} ]}>
                  <View style={{
                    gap: 16,
                    flexDirection: "row",
                    alignItems: "center",
                  }}>
                    <Icon name="lock-closed" size={24} color={COLORS.DARK} />
                    <TextInput
                    secureTextEntry={togglePassword}
                    placeholder={togglePWPlaceHolder}
                    placeholderTextColor={ COLORS.DARKGRAY }
                    style={[ styles.input, {fontFamily: FONTS.MEDIUM,
                      fontSize: 18, color: COLORS.DARK}]}
                    onChangeText={setPassword}
                    value={password}
                    />
                  </View>
                  <TouchableOpacity onPress={
                    togglePass
                  }>
                    <Icon name={toggleEye} size={24} color={COLORS.DARK} />
                  </TouchableOpacity>
                </View>
                {
                  errors.password ? <Text style={ styles.error }>{errors.password}</Text> : null
                }
                <TouchableOpacity>
                  <Text style={{
                    fontFamily: FONTS.MEDIUM,
                    fontSize: 18,
                  }}> Forgot Password? </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={[
                  styles.button, 
                  styles.primaryButton
                ]}
                onPress={ handleLogin }
                >
                  <Text style={[
                    styles.primaryButtonText
                  ]}> Login </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                navigation.navigate("SIGNUP");
              }}>
                <Text
                  style={{
                    fontFamily: FONTS.REGULAR,
                    textAlign: "center",
                    fontSize: 18,
                  }}
                >
                  Don't have an Account?{" "}
                  <Text
                    style={{
                      fontFamily: FONTS.MEDIUM,
                      fontSize: 18,
                    }}
                  >
                    Register
                  </Text>
                </Text>
              </TouchableOpacity>
            </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

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

export default LoginScreen