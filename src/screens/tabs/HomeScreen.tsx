import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets, } from 'react-native-safe-area-context';
import { View, Text, Image, TouchableOpacity, StyleSheet, TextInput, Dimensions, Alert, BackHandler } from 'react-native'
import { useFocusEffect } from '@react-navigation/native';
import React, { useEffect, useState, useCallback } from 'react'
import { ScrollView } from 'react-native-gesture-handler';
import FONTS from '../../constants/fonts';
import COLORS from '../../constants/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = () => {
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        Alert.alert(
          'Exit App',
          'Do you want to exit?',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'YES', onPress: () => BackHandler.exitApp() },
          ],
          { cancelable: false }
        );
        return true; // block default behavior
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress
      );

      return () => backHandler.remove();
    }, [])
  );

  // Time
  const [currentTime, setCurrentTime] = useState(new Date());

  React.useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour >= 5 && hour < 12) {
      return 'Good Morning!';
    } else if (hour >= 12 && hour < 18) {
      return 'Good Afternoon!';
    } else {
      return 'Good Evening!';
    }
  };

  // Get user data
  const [user, setUser] = useState<any>(null);
  React.useEffect(() => {
    const loadUserData = async () => {
      try{
        const user_data = await AsyncStorage.getItem('userData');
        if(user_data) setUser(JSON.parse(user_data));
      } catch (err) {
        console.error("Failed to load user data", err);
      }
    };

    loadUserData();
  }, [])

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
            flexDirection: "row",
            alignItems: 'center',
          }}>
            <Image
            source={require(`../../assets/profiles/chubbyadmin.png`)}
            style={{ width: 42, height: 42 }}
            />
           
            <View>
              <Text style={{
                fontSize: 14,
                fontFamily: FONTS.LIGHT,
                textTransform: "capitalize",
              }}> { getGreeting() } </Text>
              {user ? (
                <>
                  <Text style={{
                    fontSize: 16,
                    fontFamily: FONTS.BOLD,
                    textTransform: "capitalize",
                  }}> {user.name} {user.role} </Text>
                </>
                ) : (
                  <Text>Loading user...</Text>
              )}
            </View>
          </View>
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