import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets, } from 'react-native-safe-area-context';
import { View, Text, Button, Image, Platform, TouchableOpacity, StyleSheet, Touchable } from 'react-native';
import { useNavigation, } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';

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
    const navigation = useNavigation();
    const [page, setPage] = useState(0);

    return(
        <View style={{
            gap: 24,
            justifyContent: "center",
            alignItems: "center",
        }}>
            <View style={{
                justifyContent: "center",
                alignItems: "center",
            }}>
                <Image source={board[page].images} style={{ width: 300, height: 300, }} />
                <Text style={{ fontFamily: FONTS.MEDIUM, fontSize: 18, textAlign: "center"}}> {board[page].description} </Text>
            </View>
            <View style={{
                gap: 32,
                flexDirection: "row",
            }}>
                <TouchableOpacity 
                    onPress={() => { setPage(page - 1) }}
                    disabled={page === 0}
                >
                    <Text> 
                        <Icon name="arrow-left" size={30} color={COLORS.DARK} />
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => { setPage(page + 1) }}
                    disabled={page === board.length-1}
                >
                    <Text> 
                        <Icon name="arrow-right" size={30} color={COLORS.DARK} />
                    </Text>
                </TouchableOpacity>
            </View>
            { page === board.length-1 && (
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
            )}
        </View>
    )
}

const OnBoardingScreen = () => {
    return (
        <SafeAreaProvider>
            <SafeAreaView style={{
                paddingVertical: 42,
                paddingHorizontal: 42,
                backgroundColor: "#FFFFFF",
            }}>
                <View style={{
                    gap: 24,
                    width: "100%",
                    height: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                }}>
                    <Render/>
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
    borderRadius: 4,
    height: 50,
    width: 300,
    alignItems: "center",
    justifyContent: "center",
  },
})

export default OnBoardingScreen