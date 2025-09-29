import { View, Text, Image, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native'
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets, } from 'react-native-safe-area-context';
import { DefaultTheme, NavigationContainer, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import React, { useState }from 'react'

import COLORS from '../../constants/colors';
import FONTS from '../../constants/fonts';

const SignupScreen = () => {
  const navigation = useNavigation();

  const [ email, setEmail ] = useState("");
  const [ username, setUsername ] = useState("");
  const [ password, setPassword ] = useState("");
  const [ confirmPassword, setConfirmPassword ] = useState("");
  const [ togglePWPlaceHolder, setTogglePWPlaceHolder] = useState("********");
  
  const [errors, setErrors ] = useState({});

  const [ togglePassword, setTogglePassword] = useState(true);
  const [ toggleEye, setToggleEye ] = useState("eye-off");

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
    if(!username) errors.username = "Username is required";
    if(!email) errors.email = "Email is required";
    if(!password) errors.password = "Password is required";
    if(!confirmPassword) errors.confirmPassword = "Password is required";
    if(confirmPassword != password) errors.matchConfirmPassword = "Password doesn't matched";

    setErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleRegister = async () => {
    if(validationForm()){
      try {
        const res = await fetch("https://tl-backend-07ks.onrender.com/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, email, password }),
        });
  
        const data = await res.json();
  
        if (res.ok) {
          Alert.alert("Success", "Registration successful!");
          navigation.navigate("LOGIN");
          setUsername("");
          setEmail("");
          setPassword("");
          setConfirmPassword("");
          setErrors({});
        } else {
          Alert.alert("Error", data.error || "Registration failed");
        }
      } catch (err) {
        console.error(err);
        Alert.alert("Error", "Something went wrong");
      }
    }
  };

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
            }}> Create Your Account </Text>
            <View style={{
              gap: 24,
            }}>
              {/* Username */}
              <View style={{ alignItems: "flex-end", }}>
                <View style={[ styles.inputContainer ]}>
                  <Icon name="person" size={24} color={COLORS.DARK} />
                  <TextInput 
                  placeholder='Username'
                  placeholderTextColor={ COLORS.DARKGRAY }
                  style={[ styles.input, {fontFamily: FONTS.MEDIUM,
                    fontSize: 18, color: COLORS.DARK} 
                  ]}
                  value={username}
                  onChangeText={setUsername}
                  />
                </View>
                {
                  errors.username ? <Text style={ styles.error }>{errors.username}</Text> : null
                }
              </View>
              {/* Email */}
              <View style={{ alignItems: "flex-end", }}>
                <View style={[ styles.inputContainer ]}>
                  <Icon name="mail" size={24} color={COLORS.DARK} />
                  <TextInput 
                  inputMode='email'
                  placeholder='Email'
                  placeholderTextColor={ COLORS.DARKGRAY }
                  style={[ styles.input, {fontFamily: FONTS.MEDIUM,
                    fontSize: 18, color: COLORS.DARK} 
                  ]}
                  value={email}
                  onChangeText={setEmail}
                  />
                </View>
                {
                  errors.email ? <Text style={ styles.error }>{errors.email}</Text> : null
                }
              </View>
              {/* Password */}
              <View style={{ alignItems: "flex-end", }}>
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
                      value={password}
                      onChangeText={setPassword}
                      />
                    </View>
                    <TouchableOpacity onPress={ togglePass }>
                      <Icon name={toggleEye} size={24} color={COLORS.DARK} />
                    </TouchableOpacity>
                  </View>
                </View>
                {
                  errors.password ? <Text style={ styles.error }>{errors.password}</Text> : null
                }
              </View>
              {/* Confirm Password */}
              <View style={{ alignItems: "flex-end", }}>
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
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      />
                    </View>
                    <TouchableOpacity onPress={ togglePass }>
                      <Icon name={toggleEye} size={24} color={COLORS.DARK} />
                    </TouchableOpacity>
                  </View>
                </View>
                {
                  errors.confirmPassword ? <Text style={ styles.error }>{errors.confirmPassword}</Text> : null
                }
                {
                  errors.matchConfirmPassword ? <Text style={ styles.error }>{errors.matchConfirmPassword}</Text> : null
                }
              </View>
              <TouchableOpacity
                style={[
                  styles.button, 
                  styles.primaryButton
                ]}
                onPress={ handleRegister }
                >
                  <Text style={[
                    styles.primaryButtonText
                  ]}> Create Account </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("LOGIN");
                }}>
                <Text style={{
                  fontFamily: FONTS.REGULAR,
                  textAlign: "center",
                  fontSize: 18,
                }}> Already Have An Account?
                    <Text style={{
                      fontFamily: FONTS.MEDIUM,
                      fontSize: 18,
                    }
                  }> Login </Text>
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
    position: "relative",
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
    position: "relative",
    width: 160,
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

export default SignupScreen