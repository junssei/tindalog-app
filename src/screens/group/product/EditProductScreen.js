import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  FlatList,
  RefreshControl,
  ScrollView,
  Alert,
  Linking,
  ActivityIndicator,
} from 'react-native';
import FONTS from '../../../constants/fonts';
import COLORS from '../../../constants/colors';
import React, { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { Dropdown } from 'react-native-paper-dropdown';
import { useNavigation } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';

const EditProductScreen = ({ route }) => {
  const {
    unit,
    brand,
    price,
    stock,
    userID,
    category,
    product_id,
    description,
    product_name,
  } = route.params;

  const [unitValue, setUnit] = useState(`${unit}`);
  const [stockValue, setStock] = useState(`${stock}`);
  const [priceValue, setPrice] = useState(`${price}`);
  const [brandNameValue, setBrandName] = useState(`${brand}`);
  const [categoryValue, setCategory] = useState(`${category}`);
  const [descriptionValue, setDescription] = useState(`${description}`);
  const [productNameValue, setProductName] = useState(`${product_name}`);

  const [errors, setErrors] = useState('');
  const [buttonIsDisabled, setButtonIsDisabled] = useState(false);

  const validationForm = () => {
    const validationErrors = {};
    if (!productNameValue)
      validationErrors.productname = 'Product Name is required';
    if (!priceValue) validationErrors.price = 'Price is required';

    setErrors(validationErrors);

    return Object.keys(validationErrors).length === 0;
  };

  const handleUpdate = async () => {
    if (validationForm()) {
      try {
        setButtonIsDisabled(true);
        const res = await fetch(
          `https://tindalog-backend.up.railway.app/products/update/${product_id}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              product_name: productNameValue,
              category: categoryValue,
              brand: brandNameValue,
              description: descriptionValue,
              price: Number(priceValue),
              stock: Number(stockValue),
              unit: unitValue,
            }),
          },
        );

        const data = await res.json();

        if (res.ok) {
          Alert.alert('Success', 'Product updated successfully!');
          navigation.navigate('HOMESCREEN', {
            screen: 'PRODUCTSCREEN',
          });
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
          Alert.alert('Error', data.error || 'Product update failed');
          setButtonIsDisabled(false);
        }
      } catch (err) {
        console.error(err);
        Alert.alert('Error', 'Something went wrong');
      }
    }
  };

  const navigation = useNavigation();
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <ScrollView>
          <SafeAreaView style={styles.container}>
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
                  value={productNameValue}
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
                  value={brandNameValue}
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
                  value={categoryValue}
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
                  value={descriptionValue}
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
                  value={priceValue}
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
                  value={stockValue}
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
                  value={unitValue}
                />
              </View>
            </View>
            {/* Button */}
            <TouchableOpacity
              disabled={buttonIsDisabled}
              style={[styles.button, styles.primaryButton]}
              onPress={handleUpdate}
            >
              <Text style={[styles.primaryButtonText]}>
                {' '}
                Update Product #{product_id}{' '}
              </Text>
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

export default EditProductScreen;
