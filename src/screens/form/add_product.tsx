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
  RefreshControl,
  ScrollView,
} from 'react-native';
import FONTS from '../../constants/fonts';
import COLORS from '../../constants/colors';
import React, { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { Dropdown } from 'react-native-paper-dropdown';
import { useNavigation } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const add_product = () => {
  const navigation = useNavigation<any>();

  return (
    <View>
      <Text>add_product</Text>
    </View>
  );
};

export default add_product;
