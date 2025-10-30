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
import { useNavigation } from '@react-navigation/native';

const ViewProductScreen = ({ route }) => {
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

  const [item, setItem] = useState('');
  const [history, setHistory] = useState([]);
  const [totals, setTotals] = useState({ total_quantity: 0, total_sales: 0 });
  const [loadingHistory, setLoadingHistory] = useState(true);
  React.useEffect(() => {
    const url = `https://tindalog-backend.up.railway.app/user/${userID}/product/${product_id}`;

    fetch(url)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        setItem(data[0]);
        console.log('Successfully fetching product!');
      })
      .catch(err => console.error('Error fetching product:', err));
  }, [userID, product_id]);

  useEffect(() => {
    const loadHistory = async () => {
      setLoadingHistory(true);
      try {
        const url = `https://tindalog-backend.up.railway.app/products/${product_id}/history?userId=${userID}&limit=100`;
        const res = await fetch(url);
        const data = await res.json();
        if (res.ok) {
          setHistory(Array.isArray(data?.history) ? data.history : []);
          setTotals({
            total_quantity: Number(data?.total_quantity || 0),
            total_sales: Number(data?.total_sales || 0),
          });
        } else {
          setHistory([]);
        }
      } catch (e) {
        setHistory([]);
      } finally {
        setLoadingHistory(false);
      }
    };
    loadHistory();
  }, [userID, product_id]);

  const confirmDelete = product_id => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this product?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive', // makes it red on iOS
          onPress: () => handleDelete(product_id),
        },
      ],
      { cancelable: true },
    );
  };

  const handleDelete = async product_id => {
    try {
      const res = await fetch(
        `https://tindalog-backend.up.railway.app/products/delete/${product_id}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        },
      );

      const data = await res.json();

      if (res.ok) {
        Alert.alert('Success', 'Product deleted successfully');
        navigation.navigate('HOMESCREEN', { screen: 'PRODUCTSCREEN' });
      } else {
        Alert.alert('Error', data.error || 'Failed to delete product');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Something went wrong');
    }
  };

  const navigation = useNavigation();

  // Optionally handle loading state
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.View}>
          <Image
            source={require('../../../assets/images/product.png')}
            style={styles.viewImage}
          />
          <View style={styles.viewDetails}>
            <View>
              <Text style={styles.viewDetailsTitle}> {product_name} </Text>
              <Text style={styles.viewDetailsSub}> {brand} </Text>
            </View>
          </View>
          <View style={styles.viewAction}>
            <TouchableOpacity
              style={[styles.button, styles.defaultButton]}
              onPress={() => {
                navigation.navigate('EDITPRODUCTSCREEN', {
                  userID: userID,
                  unit: unit,
                  brand: brand,
                  price: price,
                  stock: stock,
                  category: category,
                  product_id: product_id,
                  description: description,
                  product_name: product_name,
                });
              }}
            >
              <Icon name="create" size={22} color={COLORS.DARK} />
              <Text style={styles.buttonText}> Edit </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.deleteButton]}
              onPress={() => confirmDelete(product_id)}
            >
              <Icon name="trash" size={22} color={COLORS.DARK} />
              <Text style={styles.buttonText}> Delete </Text>
            </TouchableOpacity>
          </View>
          {!item ? (
            <View
              style={{
                gap: 16,
                height: 300,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ActivityIndicator size="large" color="#A2D2FF" />
              <Text style={{ fontSize: 24, fontFamily: FONTS.BOLD }}>
                Loading...
              </Text>
            </View>
          ) : (
            // All
            <View style={styles.viewStatus}>
              <Text style={{ fontSize: 18, fontFamily: FONTS.REGULAR }}>
                Stocks: {item?.stock}
              </Text>
              <Text style={{ fontSize: 18, fontFamily: FONTS.REGULAR }}>
                Price: ₱{item?.price}
              </Text>
            </View>
          )}

          {/* History */}
          <View style={{ width: '100%', marginTop: 16 }}>
            <Text style={{ fontFamily: FONTS.BOLD, fontSize: 18, color: COLORS.DARK }}>Purchase History</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
              <Text style={{ fontFamily: FONTS.MEDIUM, color: COLORS.DARKGRAY }}>Total Qty: {totals.total_quantity}</Text>
              <Text style={{ fontFamily: FONTS.MEDIUM, color: COLORS.DARKGRAY }}>Total Sales: ₱{totals.total_sales.toFixed(2)}</Text>
            </View>
            {loadingHistory ? (
              <View style={{ paddingVertical: 16, alignItems: 'center' }}>
                <ActivityIndicator size="small" color={COLORS.BLUE} />
              </View>
            ) : (
              <FlatList
                contentContainerStyle={{ paddingTop: 8 }}
                data={history}
                keyExtractor={(row, idx) => String(row.order_id) + '-' + idx}
                renderItem={({ item: row }) => (
                  <View style={{
                    borderWidth: 1,
                    borderColor: COLORS.DARK,
                    borderRadius: 10,
                    padding: 12,
                    marginBottom: 10,
                    backgroundColor: '#FFF',
                  }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={{ fontFamily: FONTS.MEDIUM, color: COLORS.DARK }}>
                        {row.customer_name || 'Customer'}
                      </Text>
                      <Text style={{ fontFamily: FONTS.REGULAR, color: COLORS.DARKGRAY }}>
                        {new Date(row.created_at).toLocaleDateString()}
                      </Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
                      <Text style={{ fontFamily: FONTS.MEDIUM, color: COLORS.DARK }}>Qty: {row.quantity}</Text>
                      <Text style={{ fontFamily: FONTS.MEDIUM, color: COLORS.DARK }}>Subtotal: ₱{Number(row.subtotal).toFixed(2)}</Text>
                    </View>
                    <Text style={{ fontFamily: FONTS.REGULAR, color: COLORS.DARKGRAY, marginTop: 2 }}>Status: {row.status}</Text>
                  </View>
                )}
                ListEmptyComponent={() => (
                  <Text style={{ fontFamily: FONTS.MEDIUM, color: COLORS.DARKGRAY, paddingVertical: 12 }}>No purchase history</Text>
                )}
              />
            )}
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  View: {
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  viewImage: {
    width: 132,
    height: 132,
    borderWidth: 6,
    borderRadius: 72,
    borderColor: COLORS.PRIMARY,
  },

  viewDetails: {
    gap: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },

  viewDetailsTitle: {
    fontSize: 20,
    fontFamily: FONTS.BOLD,
  },

  viewDetailsSub: {
    fontSize: 16,
    textAlign: 'center',
    color: COLORS.DARKGRAY,
    fontFamily: FONTS.MEDIUM,
  },

  viewAction: {
    gap: 8,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },

  button: {
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  defaultButton: {
    backgroundColor: COLORS.BLUE,
  },

  deleteButton: {
    backgroundColor: COLORS.PINK,
  },

  buttonText: {
    fontSize: 16,
    fontFamily: FONTS.MEDIUM,
  },

  viewStatus: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default ViewProductScreen;
