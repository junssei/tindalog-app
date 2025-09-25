import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets, } from 'react-native-safe-area-context';
import { View, Text, Image, TouchableOpacity, StyleSheet, TextInput, Dimensions, Alert, BackHandler } from 'react-native'
import React, { useState } from 'react'
import { ScrollView } from 'react-native-gesture-handler';
import FONTS from '../../constants/fonts';
import COLORS from '../../constants/colors';
import Icon from 'react-native-vector-icons/Ionicons';

const HomeScreen = () => {

  React.useEffect(() => {
  const onBackPress = () => {
      Alert.alert(
        'Exit App',
        'Do you want to exit?',
        [
          {
            text: 'Cancel',
            onPress: () => {
              // Do nothing
            },
            style: 'cancel',
          },
          { text: 'YES', onPress: () => BackHandler.exitApp() },
        ],
        { cancelable: false }
      );

      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackPress
    );

    return () => backHandler.remove();
  }, []);

  return (
    <SafeAreaProvider>
      <ScrollView>
        <SafeAreaView style={{
          gap: 32,
          paddingVertical: 42,
          paddingHorizontal: 42,
          backgroundColor: "#FFFFFF",
          }}>  
          <View style={[styles.section, ]}>
            <Text style={[styles.sectionTitleHeader]}> Total </Text>
            <View style={[styles.card, {backgroundColor: COLORS.PRIMARY}]}>
              <Icon name='home' size={32} color={COLORS.DARK} />
              <View style={[styles.cardTextSection, {alignItems:"center"}]}>
                <Text style={{fontFamily: FONTS.REGULAR,fontSize: 24, }}> 5 </Text>
                <Text style={{fontFamily: FONTS.LIGHT, fontSize: 16, }}> Customers </Text>
              </View>
            </View>
            <View style={[styles.card, {backgroundColor: COLORS.PINK}]}>
              <Icon name='cash' size={32} color={COLORS.DARK} />
              <View style={[styles.cardTextSection, {alignItems:"center"}]}>
                <Text style={{fontFamily: FONTS.REGULAR,fontSize: 24, }}> 5 </Text>
                <Text style={{fontFamily: FONTS.LIGHT, fontSize: 16, }}> Utang </Text>
              </View>
            </View>
            <View style={[styles.card, {backgroundColor: COLORS.YELLOW}]}>
              <Icon name='pricetag' size={32} color={COLORS.DARK} />
              <View style={[styles.cardTextSection, {alignItems:"center"}]}>
                <Text style={{fontFamily: FONTS.REGULAR,fontSize: 24, }}> 5 </Text>
                <Text style={{fontFamily: FONTS.LIGHT, fontSize: 16, }}> Today Sales </Text>
              </View>
            </View>
          </View>
          <View style={[styles.section, ]}>
            <Text style={[styles.sectionTitleHeader]}> Quick Action </Text>
            <View style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              alignContent: "center",
              rowGap: 12,
              flexWrap: "wrap",
              flexDirection: "row",
            }}>
              <TouchableOpacity style={[styles.button, {backgroundColor: COLORS.YELLOW}]}
              onPress={() => {
                console.log("Hello World");
              }}
              >
                <Icon name='add' size={24} color={COLORS.DARK} />
                <Text style={[ styles.buttonText ]}> Sale </Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, {backgroundColor: COLORS.PINK}]}>
                <Icon name='add' size={24} color={COLORS.DARK} />
                <Text style={[ styles.buttonText ]}> Utang </Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, {backgroundColor: COLORS.BLUE}]}>
                <Icon name='add' size={24} color={COLORS.DARK} />
                <Text style={[ styles.buttonText ]}> Payment </Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, {backgroundColor: COLORS.PRIMARY}]}>
                <Icon name='add' size={24} color={COLORS.DARK} />
                <Text style={[ styles.buttonText ]}> Customer </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={[styles.section, ]}>
            <Text style={[styles.sectionTitleHeader]}> Recent Transactions </Text>
          </View>
          <View style={[styles.section, ]}>
            <Text style={[styles.sectionTitleHeader]}> Top Utangers </Text>
          </View>
        </SafeAreaView>
      </ScrollView>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  section:{
    gap: 12,
  },
  sectionTitleHeader:{
    fontSize: 24,
    color: COLORS.DARK,
    fontFamily: FONTS.BOLD,
  },
  card:{
    gap: 8,
    borderWidth: 3,
    borderStyle: "solid",
    borderRadius: 24,
    padding: 16,
    alignItems: "center",
  },
  cardTextSection:{
    gap: 0,
  },
  button:{
    gap: 4,
    borderRadius: 6,
    paddingVertical: 4,
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 12,
  },
  buttonText:{
    color: COLORS.DARK,
    fontFamily: FONTS.BOLD,
  }
})

export default HomeScreen