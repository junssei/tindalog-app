import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets, } from 'react-native-safe-area-context';
import { View, Text, Image, TouchableOpacity, StyleSheet, TextInput, Dimensions, Alert, BackHandler, FlatList } from 'react-native'
import React, { useState, useEffect } from 'react'
import { ScrollView } from 'react-native-gesture-handler';
import FONTS from '../../constants/fonts';
import COLORS from '../../constants/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';

const AddScreen = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{
        gap: 32,
        paddingVertical: 42,
        paddingHorizontal: 42,
        backgroundColor: "#FFFFFF",
        }}>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

export default AddScreen