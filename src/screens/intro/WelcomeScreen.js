import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets, } from 'react-native-safe-area-context';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { createStaticNavigation, useNavigation, } from '@react-navigation/native';
import COLORS from '../../constants/colors';
import FONTS from '../../constants/fonts';

const WelcomeScreen = props => {
  const navigation = useNavigation();
  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <View style={{
          justifyContent: "center",
          alignItems: "center",
          height: "100%", }}>
          <Image
          source={require('../../assets/images/tindalog_logo2.png')}
          style={{
            width: 300,
            height: 300, }}/>
          <View style={{
            gap: 32,
            width: 325,
            justifyContent: "center",
            alignItems: "center", 
          }}>
            <Text style={{
              width: "100%",
              fontSize: 40,
              color: COLORS.DARK,
              textAlign: "center",
              fontFamily: 'OutfitBold',
            }}> Welcome to 
              <Text style={{ color: COLORS.PINK }}> Tinda</Text>
              <Text style={{ color: COLORS.PRIMARY }}>Log</Text>
            </Text>
            <View style={{
              gap: 16,
            }}>
              <TouchableOpacity
              style={[
                styles.button, 
                styles.primaryButton
              ]}
              onPress={() => {
                navigation.navigate("LOGIN");
              }}
              >
                <Text style={[
                  styles.primaryButtonText
                ]}> Login </Text>
              </TouchableOpacity>
              <TouchableOpacity
              style={[
                styles.button, 
                styles.secondaryButton
              ]}
              onPress={() => {
                navigation.navigate("SIGNUP");
              }}>
                <Text style={[
                  styles.SecondaryButtonText
                ]}> Register </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
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
    height: 50,
    width: 300,
    alignItems: "center",
    justifyContent: "center",
  },
})

export default WelcomeScreen