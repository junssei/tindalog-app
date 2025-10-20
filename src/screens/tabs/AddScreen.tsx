import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Dimensions,
  Alert,
  BackHandler,
  FlatList,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import FONTS from '../../constants/fonts';
import COLORS from '../../constants/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { useNavigation } from '@react-navigation/native';
import SCREENS from '..';

const AddScreen = () => {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaProvider
      style={{
        gap: 32,
        paddingVertical: 42,
        paddingHorizontal: 42,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
      }}
    >
      <SafeAreaView
        style={{
          gap: 32,
          paddingVertical: 42,
          paddingHorizontal: 42,
          borderRadius: 16,
          backgroundColor: 'rgba(255,255,255,1)',
        }}
      >
        <TouchableOpacity
          onPress={navigation.goBack}
          style={{
            position: 'absolute',
            right: -15,
            top: -18,
          }}
        >
          <Icon name="close" size={42} color={COLORS.PINK} />
        </TouchableOpacity>
        <View style={{ gap: 16 }}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: COLORS.YELLOW }]}
            onPress={() => navigation.navigate(SCREENS.ADDSALESCREEN)}
          >
            <MaterialDesignIcons
              name="chart-line"
              size={24}
              color={COLORS.DARK}
            />
            <Text style={[styles.buttonText]}> Sale </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: COLORS.PINK }]}
            onPress={() => navigation.navigate(SCREENS.ADDUTANGSCREEN)}
          >
            <MaterialDesignIcons
              name="hand-coin-outline"
              size={24}
              color={COLORS.DARK}
            />
            <Text style={[styles.buttonText]}> Utang </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: COLORS.BLUE }]}
            onPress={() => navigation.navigate(SCREENS.ADDPAYMENTSCREEN)}
          >
            <MaterialDesignIcons
              name="cash-fast"
              size={24}
              color={COLORS.DARK}
            />
            <Text style={[styles.buttonText]}> Payment </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: COLORS.PRIMARY }]}
            onPress={() => navigation.navigate(SCREENS.ADDCUSTOMERSCREEN)}
          >
            <MaterialDesignIcons
              name="account-group"
              size={24}
              color={COLORS.DARK}
            />
            <Text style={[styles.buttonText]}> Customer </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  button: {
    gap: 4,
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  buttonText: {
    color: COLORS.DARK,
    fontFamily: FONTS.BOLD,
  },
});

export default AddScreen;
