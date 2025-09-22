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
      <SafeAreaView style={{
        paddingVertical: 42,
        paddingHorizontal: 42,
        backgroundColor: "#FFFFFF",
      }}>
        <ScrollView>
          <View>
            <Text>Total</Text>
            <View>
              <Icon name='home' size={24} color={COLORS.DARK} />
              <Text> 5 </Text>
              <Text> Customers </Text>
            </View>
            <View>
              <Icon name='home' size={24} color={COLORS.DARK} />
              <Text> 5 </Text>
              <Text> Utang </Text>
            </View>
            <View>
              <Icon name='home' size={24} color={COLORS.DARK} />
              <Text> 5 </Text>
              <Text> Today Sales </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

export default HomeScreen