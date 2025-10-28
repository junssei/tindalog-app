import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
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
  ActivityIndicator,
} from 'react-native';
import FONTS from '../../constants/fonts';
import COLORS from '../../constants/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import { Dropdown } from 'react-native-paper-dropdown';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import React, { useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';

const add_product = () => {
  const [buttonIsDisabled, setButtonIsDisabled] = useState(false);

  type User = { id: string; [key: string]: any } | null;
  const [user, setUser] = useState<User>(null);
  const userid = user?.id ?? null;

  const [unit, setUnit] = useState('');
  const [stock, setStock] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [brandName, setBrandName] = useState('');
  const [productname, setProductName] = useState('');
  const [description, setDescription] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  React.useEffect(() => {
    const loadUserData = async () => {
      try {
        const user_data = await AsyncStorage.getItem('userData');
        if (user_data) setUser(JSON.parse(user_data));
      } catch (err) {
        console.error('Failed to load user data', err);
      }
    };

    loadUserData();
  }, []);

  const validationForm = () => {
    const validationErrors: Record<string, string> = {};
    if (!productname) validationErrors.productname = 'Product Name is required';
    if (!price) validationErrors.price = 'Price is required';

    setErrors(validationErrors);

    return Object.keys(validationErrors).length === 0;
  };

  const handleCreate = async () => {
    if (validationForm()) {
      try {
        setButtonIsDisabled(true);
        const res = await fetch(
          'https://tindalog-backend.up.railway.app/products/create',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userid: user?.id,
              product_name: productname,
              category: category,
              brand: brandName,
              description: description,
              price: Number(price),
              stock: Number(stock),
              unit: unit,
            }),
          },
        );

        const data = await res.json();

        if (res.ok) {
          Alert.alert('Success', 'Product created successfully!');
          // navigation.navigate('CUSTOMERLISTSCREEN');
          navigation.goBack();
          setButtonIsDisabled(false);
          setUnit('');
          setStock('');
          setPrice('');
          setCategory('');
          setBrandName('');
          setProductName('');
          setDescription('');
          setErrors({});
        } else {
          Alert.alert('Error', data.error || 'Product creation failed');
          setButtonIsDisabled(false);
        }
      } catch (err) {
        console.error(err);
        Alert.alert('Error', 'Something went wrong');
      }
    }
  };

  const navigation = useNavigation<any>();

  return (
    <SafeAreaProvider>
      <PaperProvider>
        <ScrollView>
          <SafeAreaView style={styles.container}>
            <View
              style={{
                gap: 12,
                flexDirection: 'column',
              }}
            >
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Icon name="arrow-back" size={32} color={COLORS.DARK} />
              </TouchableOpacity>
              <Text
                style={{
                  fontFamily: FONTS.EXTRABOLD,
                  fontSize: 24,
                  color: COLORS.DARK,
                }}
              >
                {' '}
                Add Product{' '}
              </Text>
              {/* Product */}
              <View>
                <View style={[styles.inputContainer]}>
                  <Icon name="apps" size={24} color={COLORS.DARK} />
                  <TextInput
                    editable={!buttonIsDisabled}
                    placeholder="Product Name"
                    placeholderTextColor={COLORS.DARKGRAY}
                    style={[
                      styles.input,
                      {
                        fontFamily: FONTS.MEDIUM,
                        fontSize: 18,
                        color: COLORS.DARK,
                      },
                    ]}
                    onChangeText={setProductName}
                    value={productname}
                  />
                </View>
                <Text style={styles.error}> *Required </Text>
                {errors.productname ? (
                  <Text style={styles.error}>{errors.productname}</Text>
                ) : null}
              </View>
              {/* Brand Name */}
              <View>
                <View style={[styles.inputContainer]}>
                  <Icon name="apps" size={24} color={COLORS.DARK} />
                  <TextInput
                    editable={!buttonIsDisabled}
                    placeholder="Brand Name"
                    placeholderTextColor={COLORS.DARKGRAY}
                    style={[
                      styles.input,
                      {
                        fontFamily: FONTS.MEDIUM,
                        fontSize: 18,
                        color: COLORS.DARK,
                      },
                    ]}
                    onChangeText={setBrandName}
                    value={brandName}
                  />
                </View>
              </View>
              {/* Category */}
              <View>
                <View style={[styles.inputContainer]}>
                  <Icon name="list" size={24} color={COLORS.DARK} />
                  <TextInput
                    editable={!buttonIsDisabled}
                    placeholder="Category"
                    placeholderTextColor={COLORS.DARKGRAY}
                    style={[
                      styles.input,
                      {
                        fontFamily: FONTS.MEDIUM,
                        fontSize: 18,
                        color: COLORS.DARK,
                      },
                    ]}
                    onChangeText={setCategory}
                    value={category}
                  />
                </View>
              </View>
              {/* Description */}
              <View>
                <View style={[styles.inputContainer]}>
                  <TextInput
                    editable={!buttonIsDisabled}
                    placeholder="Description"
                    placeholderTextColor={COLORS.DARKGRAY}
                    style={[
                      {
                        height: 100,
                        fontSize: 18,
                        width: '100%',
                        color: COLORS.DARK,
                        borderColor: 'gray',
                        fontFamily: FONTS.MEDIUM,
                      },
                    ]}
                    multiline={true}
                    numberOfLines={4}
                    textAlignVertical="top"
                    onChangeText={setDescription}
                    value={description}
                  />
                </View>
              </View>
              {/* Price */}
              <View>
                <View style={[styles.inputContainer]}>
                  <MaterialDesignIcons
                    name="currency-php"
                    size={24}
                    color={COLORS.DARK}
                  />
                  <TextInput
                    editable={!buttonIsDisabled}
                    placeholder="Set Price"
                    placeholderTextColor={COLORS.DARKGRAY}
                    keyboardType="number-pad"
                    style={[
                      styles.input,
                      {
                        fontFamily: FONTS.MEDIUM,
                        fontSize: 18,
                        color: COLORS.DARK,
                      },
                    ]}
                    onChangeText={setPrice}
                    value={price}
                  />
                </View>
                <Text style={styles.error}> *Required </Text>
              </View>
              {/* Stock */}
              <View>
                <View style={[styles.inputContainer]}>
                  <MaterialDesignIcons
                    name="chart-timeline-variant"
                    size={24}
                    color={COLORS.DARK}
                  />
                  <TextInput
                    editable={!buttonIsDisabled}
                    keyboardType="number-pad"
                    placeholder="Set Stock"
                    placeholderTextColor={COLORS.DARKGRAY}
                    style={[
                      styles.input,
                      {
                        fontFamily: FONTS.MEDIUM,
                        fontSize: 18,
                        color: COLORS.DARK,
                      },
                    ]}
                    onChangeText={setStock}
                    value={stock}
                  />
                </View>
              </View>
              {/* Unit */}
              <View>
                <View style={[styles.inputContainer]}>
                  <MaterialDesignIcons
                    name="package-variant"
                    size={24}
                    color={COLORS.DARK}
                  />
                  <TextInput
                    editable={!buttonIsDisabled}
                    placeholder="Set Unit eg(piece, kilo)"
                    placeholderTextColor={COLORS.DARKGRAY}
                    style={[
                      styles.input,
                      {
                        fontFamily: FONTS.MEDIUM,
                        fontSize: 18,
                        color: COLORS.DARK,
                      },
                    ]}
                    onChangeText={setUnit}
                    value={unit}
                  />
                </View>
              </View>
              {/* Button */}
              <TouchableOpacity
                disabled={buttonIsDisabled}
                style={[styles.button, styles.primaryButton]}
                onPress={handleCreate}
              >
                <Text style={[styles.primaryButtonText]}> Create Product </Text>
              </TouchableOpacity>
              {/* Loading */}
              <View>
                {buttonIsDisabled ? (
                  <View style={{ alignItems: 'center' }}>
                    <ActivityIndicator size="small" color="#A2D2FF" />
                    <Text style={[styles.error, { textAlign: 'center' }]}>
                      Please wait...
                    </Text>
                  </View>
                ) : null}
              </View>
            </View>
          </SafeAreaView>
        </ScrollView>
      </PaperProvider>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 32,
    paddingTop: 42,
    paddingBottom: 42,
    paddingHorizontal: 42,
    backgroundColor: '#FFFFFF',
  },

  error: {
    fontSize: 16,
    color: COLORS.PINK,
    textAlign: 'right',
    fontFamily: FONTS.MEDIUM,
  },

  inputContainer: {
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 18,
    width: '100%',
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.GRAY,
  },

  input: {
    width: '100%',
    paddingRight: 32,
    position: 'relative',
  },

  primaryButton: {
    backgroundColor: COLORS.PRIMARY,
  },
  primaryButtonText: {
    fontFamily: FONTS.SEMIBOLD,
    color: COLORS.DARK,
    fontSize: 20,
  },
  secondaryButton: {
    backgroundColor: COLORS.DARK,
  },
  SecondaryButtonText: {
    fontFamily: FONTS.SEMIBOLD,
    color: COLORS.WHITE,
    fontSize: 20,
  },

  button: {
    borderRadius: 4,
    height: 50,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default add_product;
