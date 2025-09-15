import { View, Text, Image, TouchableOpacity, StyleSheet, TextInput } from 'react-native'
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets, } from 'react-native-safe-area-context';
import { DefaultTheme, NavigationContainer, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import React, { useState }from 'react'

import COLORS from '../../constants/colors';
import FONTS from '../../constants/fonts';

const LoginScreen = () => {
  const navigation = useNavigation();

  const [ username, setUsername ] = useState("");
  const [ password, setPassword ] = useState("");

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
              <View style={[ styles.inputContainer ]}>
                <Icon name="person" size={24} color={COLORS.DARK} />
                <TextInput 
                placeholder='Username'
                placeholderTextColor={ COLORS.DARKGRAY }
                style={[ styles.input, {fontFamily: FONTS.MEDIUM,
                  fontSize: 18, color: COLORS.DARK} 
                ]}
                />
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
                    secureTextEntry={false}
                    placeholder='Password'
                    placeholderTextColor={ COLORS.DARKGRAY }
                    style={[ styles.input, {fontFamily: FONTS.MEDIUM,
                      fontSize: 18, color: COLORS.DARK}]}
                    />
                  </View>
                  <Icon name="eye-off" size={24} color={COLORS.DARK} />
                </View>
                <Text style={{
                  fontFamily: FONTS.MEDIUM,
                  fontSize: 18,
                }}> Forgot Password? </Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.button, 
                  styles.primaryButton
                ]}
                onPress={() => {
                  navigation.navigate("");
                }}
                >
                  <Text style={[
                    styles.primaryButtonText
                  ]}> Login </Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={{
                  fontFamily: FONTS.REGULAR,
                  textAlign: "center",
                  fontSize: 18,
                }}> Don't have an Account?
                    <Text style={{
                      fontFamily: FONTS.MEDIUM,
                      fontSize: 18,
                    }
                  }> Register </Text>
                </Text>
              </TouchableOpacity>
            </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
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