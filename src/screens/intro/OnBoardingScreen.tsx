import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets, } from 'react-native-safe-area-context';
import { View, Text, Button, Image, Platform, TouchableOpacity, StyleSheet, Touchable } from 'react-native'
import { createStaticNavigation, useNavigation, } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react'

import COLORS from '../../constants/colors';
import FONTS from '../../constants/fonts';

const board = [
    {
        KEY: 1,
        images: require('../../assets/images/coin.png'),
        description: 'Welcome to TindaLog—your digital tindahan logbook.' 
    },
    {
        KEY: 2,
        images: require('../../assets/images/notebook.png'),
        description: 'Easily track sales, utang, and payments per customer.' 
    },
    {
        KEY: 3,
        images: require('../../assets/images/store.png'),
        description: 'Simple, friendly, and made for our community stores.' 
    },
]

const Render = () => {
    const [page, setPage] = useState(0);

    return(
        <View>
            {/* <Image source={}/> */}
            <Text> {board[page].description} </Text>
            <TouchableOpacity>
            </TouchableOpacity>
        </View>
    )
}

const OnBoardingScreen = () => {

    const navigation = useNavigation();
    return (
        <SafeAreaProvider>
            <SafeAreaView>
                <Render/>
                <View style={{
                    width: "100%",
                    height: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                }}>
                    <TouchableOpacity style={[
                        styles.button, 
                        styles.primaryButton
                    ]}
                    onPress={() => {
                        navigation.navigate("WELCOME");
                    }}>
                        <Text style={[
                        styles.primaryButtonText
                        ]}> Get Started </Text>
                    </TouchableOpacity>
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

export default OnBoardingScreen