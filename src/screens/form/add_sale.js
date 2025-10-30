import {
  View,
  Text,
  Image,
  Alert,
  Modal,
  FlatList,
  TextInput,
  Dimensions,
  StyleSheet,
  ScrollView,
  BackHandler,
  RefreshControl,
  TouchableOpacity,
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
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';

const API_URL = 'https://tindalog-backend.up.railway.app';

const add_sale = () => {
  const [buttonIsDisabled, setButtonIsDisabled] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');

  const [user, setUser] = useState('');
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);

  const [errors, setErrors] = useState({});
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [paymentType, setPaymentType] = useState('cash');
  const [partialPayment, setPartialPayment] = useState('');
  const [processingOrder, setProcessingOrder] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showNativeDatePicker, setShowNativeDatePicker] = useState(false);
  const [pickerDate, setPickerDate] = useState(new Date());

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

  const resetForm = () => {
    setButtonIsDisabled(false);
    setProcessingOrder(false);
    setErrors({});
    setCart([]);
    setSelectedCustomer(null);
    setSearchQuery('');
    setCustomerSearchQuery('');
    setPartialPayment('');
    setDueDate('');
    setPaymentType('cash');
    setShowCustomerModal(false);
  };

  const userid = user?.id ?? null;

  const current = new Date();

  // Date limits: min = first day of current month; max = end of month six months ahead
  const getMinDate = () => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  };
  const getMaxDate = () => {
    const d = new Date();
    // move 6 months ahead, then set to last day of that month
    const ahead = new Date(d.getFullYear(), d.getMonth() + 6, 1);
    return new Date(ahead.getFullYear(), ahead.getMonth() + 1, 0);
  };
  const clampToRange = (date) => {
    const min = getMinDate();
    const max = getMaxDate();
    if (date < min) return min;
    if (date > max) return max;
    return date;
  };

  const validationForm = () => {
    const validationErrors = {};
    // if (!productname) validationErrors.productname = 'Product Name is required';
    // if (!price) validationErrors.price = 'Price is required';

    setErrors(validationErrors);

    return Object.keys(validationErrors).length === 0;
  };

  // removed legacy create-order handler; processSale handles full flow

  useEffect(() => {
    if (userid) {
      fetchData();
    }
  }, [userid]);

  const fetchData = async () => {
    try {
      const [productsRes, customersRes] = await Promise.all([
        fetch(`${API_URL}/user/${userid}/productlist`),
        fetch(`${API_URL}/user/${userid}/customerlist`),
      ]);

      const productsData = await productsRes.json();
      const customersData = await customersRes.json();

      setProducts(Array.isArray(productsData) ? productsData : []);
      setCustomers(Array.isArray(customersData) ? customersData : []);
    } catch (error) {
      Alert.alert('Error', 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = product => {
    const productId = product.product_id ?? product.id;
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        Alert.alert('Out of Stock', 'No more stock available');
        return;
      }
      setCart(
        cart.map(item =>
          item.id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      );
    } else {
      if (product.stock <= 0) {
        Alert.alert('Out of Stock', 'This product is out of stock');
        return;
      }
      setCart([...cart, { ...product, id: productId, quantity: 1 }]);
    }
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(current =>
      current.map(item =>
        item.id === productId
          ? { ...item, quantity: Math.min(newQuantity, item.stock) }
          : item,
      ),
    );
  };

  const selectCustomer = customer => {
    setSelectedCustomer(customer);
    setShowCustomerModal(false);
  };

  const removeFromCart = productId => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const getTotalAmount = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const getTotalItems = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  const processSale = async () => {
    // Validations
    if (cart.length === 0) {
      Alert.alert('Empty Cart', 'Please add items to cart first');
      return;
    }
    if (!selectedCustomer) {
      Alert.alert('No Customer', 'Please select a customer');
      return;
    }
    if (!userid) {
      Alert.alert('Not Ready', 'User not loaded yet. Please try again.');
      return;
    }

    const totalAmount = getTotalAmount();
    const partialAmount = parseFloat(partialPayment) || 0;

    if (paymentType === 'partial' && partialAmount >= totalAmount) {
      Alert.alert(
        'Invalid Amount',
        'Partial payment should be less than total amount',
      );
      return;
    }

    if (paymentType === 'credit' && !dueDate) {
      Alert.alert(
        'Missing Due Date',
        'Please set a due date for credit payment',
      );
      return;
    }

    setProcessingOrder(true);

    try {
      // 1. Create the order
      const orderResponse = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerid: selectedCustomer.id,
          userid: userid,
          quantity: getTotalItems(),
          total_amount: totalAmount,
          status: 'completed',
        }),
      });

      const orderData = await orderResponse.json().catch(() => ({}));
      if (!orderResponse.ok || !orderData?.id) {
        const message = orderData?.error || 'Failed to create order';
        Alert.alert('Order Error', message);
        return;
      }
      const orderId = orderData.id;

      // 2. Create order items
      const orderItems = cart.map(item => ({
        orderid: orderId,
        productid: item.id,
        quantity: item.quantity,
        subtotal: item.price * item.quantity,
      }));

      const itemsRes = await fetch(`${API_URL}/order-items/bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: orderItems }),
      });
      const itemsData = await itemsRes.json().catch(() => ({}));
      if (!itemsRes.ok) {
        Alert.alert('Order Items Error', itemsData?.error || 'Failed to add items');
        return;
      }

      // 3. Update product stock
      for (const item of cart) {
        const stockRes = await fetch(`${API_URL}/products/${item.id}/reduce-stock`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ quantity: item.quantity }),
        });
        if (!stockRes.ok) {
          const stockData = await stockRes.json().catch(() => ({}));
          Alert.alert('Stock Error', stockData?.error || `Failed to update stock for product ${item.id}`);
          return;
        }
      }

      // 4. Handle payment type
      if (paymentType === 'credit' || paymentType === 'partial' || paymentType === 'cash') {
        const creditAmount =
          paymentType === 'credit' ? totalAmount : totalAmount - partialAmount;

        // Create credit record
        const creditResponse = await fetch(`${API_URL}/credits`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customerid: selectedCustomer.id,
            amount: paymentType === 'cash' ? totalAmount : creditAmount,
            balance: paymentType === 'cash' ? totalAmount : creditAmount,
            status: 'unpaid',
            due_date: dueDate,
            orderid: orderId, // Link to this order
            userid: userid,
          }),
        });

        const creditData = await creditResponse.json().catch(() => ({}));
        if (!creditResponse.ok || !creditData?.id) {
          Alert.alert('Credit Error', creditData?.error || 'Failed to create credit');
          return;
        }

        // If partial or cash payment, record the payment
        if ((paymentType === 'partial' && partialAmount > 0) || paymentType === 'cash') {
          const payRes = await fetch(`${API_URL}/payments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              creditid: creditData.id,
              amount_paid: paymentType === 'cash' ? totalAmount : partialAmount,
            }),
          });
          if (!payRes.ok) {
            const payData = await payRes.json().catch(() => ({}));
            Alert.alert('Payment Error', payData?.error || 'Failed to record payment');
            return;
          }

          if (paymentType === 'partial') {
            // Update credit balance metadata for partial only (payments endpoint already updates balance/status)
            const upRes = await fetch(`${API_URL}/credits/${creditData.id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                balance: creditAmount,
                status: 'partial',
              }),
            });
            if (!upRes.ok) {
              const upData = await upRes.json().catch(() => ({}));
              Alert.alert('Credit Update Error', upData?.error || 'Failed to update credit');
              return;
            }
          }
        }
      }

      Alert.alert(
        'Sale Recorded!',
        `Total: ₱${totalAmount.toFixed(2)}\nPayment: ${
          paymentType === 'cash'
            ? 'Fully Paid'
            : paymentType === 'partial'
            ? `Partial (₱${partialAmount}) - Credit: ₱${(
                totalAmount - partialAmount
              ).toFixed(2)}`
            : 'On Credit'
        }`,
        [{ text: 'New Sale', onPress: resetForm }],
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to process sale: ' + error.message);
    } finally {
      setProcessingOrder(false);
    }
  };

  const navigation = useNavigation();

  return (
    <SafeAreaProvider>
      <PaperProvider>
        <SafeAreaView style={styles.container}>
          {
            // Use a single top-level FlatList to avoid nesting VirtualizedList inside ScrollView
          }
          <FlatList
            data={
              selectedCustomer
                ? Array.isArray(products)
                  ? products.filter(c =>
                      c.product_name?.toLowerCase().includes(searchQuery.toLowerCase()),
                    )
                  : []
                : []
            }
            keyExtractor={(item, index) =>
              item.product_id ? item.product_id.toString() : index.toString()
            }
            renderItem={({ item }) => {
              const cartItem = cart.find(c => c.id === (item.product_id ?? item.id));
              const quantityInCart = cartItem ? cartItem.quantity : 0;
              return (
                <TouchableOpacity
                  style={styles.cardlist}
                  onPress={() => {
                    addToCart(item);
                  }}
                >
                  <Image
                    source={require('../../assets/images/product.png')}
                    style={styles.cardlistImg}
                  />

                  <View style={styles.cardlistDetails}>
                    <Text
                      style={styles.cardlistTitle}
                      numberOfLines={2}
                      ellipsizeMode="tail"
                    >
                      {item.product_name} - {item.brand}
                    </Text>

                    <View style={styles.cardlistInfo}>
                      <Text style={styles.cardlistText}>₱{item.price}</Text>
                      <Text style={styles.cardlistText}>
                        Stocks: {item.stock - quantityInCart}
                      </Text>
                    </View>
                    {quantityInCart > 0 && (
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>{quantityInCart}</Text>
                      </View>
                    )}
                    {item.stock <= 0 && (
                      <View style={styles.outOfStock}>
                        <Text style={styles.outOfStockText}>UBOS NA</Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              );
            }}
            ListHeaderComponent={
              <View style={{ gap: 12 }}>
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
                  {' '}Create Sale/Order{' '}
                </Text>

                {selectedCustomer ? (
                  <View style={{ gap: 16 }}>
                    <View>
                      <TouchableOpacity onPress={() => setShowCustomerModal(true)}>
                        <View style={[styles.inputContainer]}>
                          <Icon name="person" size={24} color={COLORS.DARKGRAY} />
                          <TextInput
                            editable={false}
                            placeholder=""
                            placeholderTextColor={COLORS.DARK}
                            style={[
                              styles.input,
                              {
                                fontFamily: FONTS.MEDIUM,
                                fontSize: 18,
                                color: COLORS.DARKGRAY,
                              },
                            ]}
                            onChangeText={setSelectedCustomer}
                            value={selectedCustomer.c_fullname}
                          />
                        </View>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.headerRow}>
                      <View style={styles.searchBox}>
                        <Icon
                          name="search"
                          size={18}
                          color={COLORS.DARK}
                          style={{ marginRight: 8 }}
                        />
                        <TextInput
                          placeholder="Search"
                          placeholderTextColor={COLORS.DARK}
                          value={searchQuery}
                          onChangeText={setSearchQuery}
                          style={[
                            styles.input,
                            {
                              fontFamily: FONTS.MEDIUM,
                              fontSize: 16,
                              color: COLORS.DARK,
                            },
                          ]}
                        />
                      </View>
                    </View>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={[styles.button, styles.blueButton]}
                    onPress={() => setShowCustomerModal(true)}
                  >
                    <Text style={[styles.blueButtonText]}> Select Customer </Text>
                  </TouchableOpacity>
                )}
              </View>
            }
            ListEmptyComponent={
              selectedCustomer ? (
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingVertical: 24,
                  }}
                >
                  <TouchableOpacity onPress={() => fetchData()}>
                    <Icon name="refresh" size={42} color={COLORS.DARKGRAY} />
                  </TouchableOpacity>
                  <Text style={{ fontSize: 16, color: 'gray' }}>No rows found</Text>
                </View>
              ) : null
            }
            ListFooterComponent={
              <View style={{ marginTop: 16 }}>
                {/* Cart */}
                {selectedCustomer && (
                  <View>
                    <Text style={{ fontSize: 24, fontFamily: FONTS.BOLD, marginBottom: 8 }}>
                      {' '}Cart{' '}
                    </Text>
                    {cart.length > 0 && (
                      <View style={styles.cartFooter}>
                        <View style={styles.cartItems}>
                          {cart.map(item => (
                            <View key={item.id} style={styles.cartItem}>
                              <Text style={styles.cartItemName} numberOfLines={1}>
                                {item.product_name}
                              </Text>
                              <View style={styles.cartItemControls}>
                              <TouchableOpacity
                                onPress={() =>
                                  updateQuantity(item.id, item.quantity - 1)
                                }
                              >
                                <MCIcon name="minus-circle" size={24} color="#FF5252" />
                              </TouchableOpacity>
                                <Text style={styles.cartItemQuantity}>
                                  {item.quantity}
                                </Text>
                              <TouchableOpacity
                                onPress={() =>
                                  updateQuantity(item.id, item.quantity + 1)
                                }
                              >
                                <MCIcon name="plus-circle" size={24} color="#4CAF50" />
                              </TouchableOpacity>
                                <Text style={styles.cartItemPrice}>
                                  ₱{(item.price * item.quantity).toFixed(2)}
                                </Text>
                              </View>
                            </View>
                          ))}
                        </View>

                        <View style={styles.paymentSection}>
                          <Text style={styles.paymentLabel}>Payment:</Text>
                          <View style={styles.paymentButtons}>
                            <TouchableOpacity
                              style={[
                                styles.paymentBtn,
                                paymentType === 'cash' && styles.paymentBtnActive,
                              ]}
                              onPress={() => setPaymentType('cash')}
                            >
                              <MCIcon
                                name="cash"
                                size={20}
                                color={paymentType === 'cash' ? '#FFF' : '#666'}
                              />
                              <Text
                                style={[
                                  styles.paymentBtnText,
                                  paymentType === 'cash' && styles.paymentBtnTextActive,
                                ]}
                              >
                                Cash
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={[
                                styles.paymentBtn,
                                paymentType === 'partial' && styles.paymentBtnActive,
                              ]}
                              onPress={() => setPaymentType('partial')}
                            >
                              <MCIcon
                                name="cash-multiple"
                                size={20}
                                color={paymentType === 'partial' ? '#FFF' : '#666'}
                              />
                              <Text
                                style={[
                                  styles.paymentBtnText,
                                  paymentType === 'partial' && styles.paymentBtnTextActive,
                                ]}
                              >
                                Partial
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={[
                                styles.paymentBtn,
                                paymentType === 'credit' && styles.paymentBtnActive,
                              ]}
                              onPress={() => setPaymentType('credit')}
                            >
                              <MCIcon
                                name="notebook-outline"
                                size={20}
                                color={paymentType === 'credit' ? '#FFF' : '#666'}
                              />
                              <Text
                                style={[
                                  styles.paymentBtnText,
                                  paymentType === 'credit' && styles.paymentBtnTextActive,
                                ]}
                              >
                                Utang
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>

                        {paymentType === 'partial' && (
                          <View style={styles.partialPaymentInput}>
                            <Text style={styles.inputLabel}>Bayad Muna:</Text>
                          <TextInput
                              style={styles.amountInput}
                              placeholder="0.00"
                            placeholderTextColor={COLORS.DARK}
                              keyboardType="numeric"
                              value={partialPayment}
                              onChangeText={setPartialPayment}
                            />
                          </View>
                        )}

                        {(paymentType === 'credit' || paymentType === 'partial') && (
                          <View style={styles.dueDateInput}>
                            <Text style={styles.inputLabel}>Due Date:</Text>
                            <TouchableOpacity
                              style={styles.dateInput}
                              onPress={() => {
                                const parsed = dueDate && /^\d{4}-\d{2}-\d{2}$/.test(dueDate)
                                  ? new Date(dueDate)
                                  : new Date();
                                const base = clampToRange(parsed);
                                setPickerDate(base);
                                setShowNativeDatePicker(true);
                              }}
                            >
                              <Text style={{ color: COLORS.DARK }}>
                                {dueDate ? dueDate : 'YYYY-MM-DD'}
                              </Text>
                            </TouchableOpacity>
                          </View>
                        )}

                        <View style={styles.totalSection}>
                          <View>
                            <Text style={styles.totalLabel}>Total:</Text>
                            <Text style={styles.totalAmount}>
                              ₱{getTotalAmount().toFixed(2)}
                            </Text>
                            {paymentType === 'partial' && partialPayment && (
                              <Text style={styles.creditAmount}>
                                Utang: ₱{(
                                  getTotalAmount() - parseFloat(partialPayment)
                                ).toFixed(2)}
                              </Text>
                            )}
                          </View>
                          <TouchableOpacity
                            style={styles.processButton}
                            onPress={processSale}
                            disabled={processingOrder}
                          >
                            {processingOrder ? (
                              <ActivityIndicator color="#FFF" />
                            ) : (
                              <>
                                <MCIcon name="check-circle" size={24} color="#FFF" />
                                <Text style={styles.processButtonText}>Record Sale</Text>
                              </>
                            )}
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                  </View>
                )}

                {loading ? (
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      paddingVertical: 16,
                    }}
                  >
                    <ActivityIndicator size="large" color={COLORS.BLUE} />
                    <Text style={{ fontSize: 20, fontFamily: FONTS.MEDIUM }}>
                      {' '}Fetching data...{' '}
                    </Text>
                  </View>
                ) : null}

                {/* Removed old Create Order button in favor of Record Sale */}
              </View>
            }
            contentContainerStyle={{
              paddingBottom: 42,
              paddingTop: 0,
            }}
          />

          {/* Modal and Select Customer Button */}
            {showCustomerModal ? (
              <Modal
                animationType="slide"
                visible={showCustomerModal}
                onRequestClose={() => setShowCustomerModal(false)}
              >
                <View style={{ padding: 20, gap: 16 }}>
                  <TouchableOpacity
                    style={{ alignItems: 'flex-end' }}
                    onPress={() => setShowCustomerModal(false)}
                  >
                    <Icon name="close" size={32} color={COLORS.DARK} />
                  </TouchableOpacity>
                  <View style={styles.headerRow}>
                    <View style={styles.searchBox}>
                      <Icon
                        name="search"
                        size={18}
                        color={COLORS.DARK}
                        style={{ marginRight: 8 }}
                      />
                      <TextInput
                        placeholder="Search"
                        placeholderTextColor={COLORS.DARK}
                        value={customerSearchQuery}
                        onChangeText={setCustomerSearchQuery}
                        style={[
                          styles.input,
                          {
                            fontFamily: FONTS.MEDIUM,
                            fontSize: 16,
                            color: COLORS.DARK,
                          },
                        ]}
                      />
                    </View>
                  </View>
                  <FlatList
                    nestedScrollEnabled={true}
                    contentContainerStyle={{
                      paddingBottom: 220,
                      paddingTop: 12,
                    }}
                    data={customers.filter(c =>
                      c.c_fullname
                        .toLowerCase()
                        .includes(customerSearchQuery.toLowerCase()),
                    )}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        activeOpacity={0.85}
                        style={styles.card}
                        onPress={() => {
                          selectCustomer(item);
                        }}
                      >
                        <View style={styles.cardRow}>
                          <Image
                            source={
                              item.c_gender === 'male'
                                ? require('../../assets/profiles/male.png')
                                : item.c_gender === 'female'
                                ? require('../../assets/profiles/female.png')
                                : require('../../assets/profiles/default.png')
                            }
                            style={styles.avatar}
                          />

                          <View style={styles.cardTextSection}>
                            <Text style={styles.name}>{item.c_fullname}</Text>
                            <Text style={styles.subtitle}>Customer</Text>
                          </View>
                        </View>
                        <View style={styles.divider} />
                      </TouchableOpacity>
                    )}
                    // Empty
                    ListEmptyComponent={() => (
                      <View
                        style={{
                          flex: 1,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <TouchableOpacity onPress={() => fetchData()}>
                          <Icon
                            name="refresh"
                            size={42}
                            color={COLORS.DARKGRAY}
                          />
                        </TouchableOpacity>
                        <Text style={{ fontSize: 16, color: 'gray' }}>
                          No rows found
                        </Text>
                      </View>
                    )}
                  />
                </View>
              </Modal>
            ) : null}

          {showNativeDatePicker ? (
            <DateTimePicker
              value={pickerDate}
              mode="date"
              display="calendar"
              minimumDate={getMinDate()}
              maximumDate={getMaxDate()}
              onChange={(event, date) => {
                if (event.type === 'dismissed') {
                  setShowNativeDatePicker(false);
                  return;
                }
                const picked = clampToRange(date || pickerDate);
                setPickerDate(picked);
                const y = picked.getFullYear();
                const m = String(picked.getMonth() + 1).padStart(2, '0');
                const d = String(picked.getDate()).padStart(2, '0');
                setDueDate(`${y}-${m}-${d}`);
                setShowNativeDatePicker(false);
              }}
            />
          ) : null}
        </SafeAreaView>
      </PaperProvider>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 24,
    height: '100%',
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.GRAY,
    borderWidth: 0,
    paddingHorizontal: 18,
    borderRadius: 6,
    height: 50,
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

  blueButton: {
    backgroundColor: COLORS.BLUE,
  },
  blueButtonText: {
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

  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: COLORS.DARK,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  cardTextSection: {
    marginLeft: 12,
    flex: 1,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  name: {
    fontFamily: FONTS.BOLD,
    fontSize: 16,
    color: COLORS.DARK,
  },
  subtitle: {
    fontFamily: FONTS.MEDIUM,
    fontSize: 12,
    color: COLORS.DARKGRAY,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },

  cardlist: {
    borderWidth: 2,
    borderColor: COLORS.DARK,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.WHITE,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    width: '100%',
    gap: 12,
  },

  cardlistImg: {
    width: 64,
    height: 64,
    borderRadius: 12,
  },

  cardlistDetails: {
    flex: 1,
    justifyContent: 'center',
    // 👇 prevents overflow beyond padding
    overflow: 'hidden',
  },

  cardlistTitle: {
    flexShrink: 1,
    flexWrap: 'wrap',
    width: '100%', // 👈 keeps text within parent width
    color: COLORS.DARK,
    fontFamily: FONTS.BOLD,
    fontSize: 16,
    marginBottom: 6,
  },

  cardlistInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },

  cardlistText: {
    color: COLORS.DARK,
    fontFamily: FONTS.REGULAR,
    fontSize: 14,
  },

  cartItem: {
    gap: 8,
    flexDirection: 'row',
  },
  cartFooter: {
    gap: 16,
    padding: 12,
    borderWidth: 2,
    borderColor: COLORS.DARK,
    borderRadius: 12,
    backgroundColor: COLORS.WHITE,
  },
  cartItems: {
    gap: 12,
  },
  cartItemName: {
    flex: 1,
    color: COLORS.DARK,
    fontFamily: FONTS.MEDIUM,
    fontSize: 16,
  },
  cartItemControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cartItemQuantity: {
    minWidth: 28,
    textAlign: 'center',
    color: COLORS.DARK,
    fontFamily: FONTS.BOLD,
    fontSize: 16,
  },
  cartItemPrice: {
    marginLeft: 8,
    color: COLORS.DARK,
    fontFamily: FONTS.SEMIBOLD,
    fontSize: 16,
  },
  paymentSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: COLORS.DARKGRAY,
    gap: 8,
  },
  paymentLabel: {
    color: COLORS.DARK,
    fontFamily: FONTS.BOLD,
    fontSize: 16,
    marginBottom: 8,
  },
  paymentButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  paymentBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: COLORS.DARKGRAY,
    borderRadius: 20,
    backgroundColor: COLORS.WHITE,
    flexGrow: 0,
    flexShrink: 0,
    marginRight: 4,
    marginBottom: 4,
  },
  paymentBtnActive: {
    backgroundColor: COLORS.BLUE,
    borderColor: COLORS.BLUE,
  },
  paymentBtnText: {
    color: '#666',
    fontFamily: FONTS.MEDIUM,
    fontSize: 14,
  },
  paymentBtnTextActive: {
    color: '#FFF',
  },
  partialPaymentInput: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  inputLabel: {
    color: COLORS.DARK,
    fontFamily: FONTS.MEDIUM,
    fontSize: 14,
    minWidth: 90,
  },
  amountInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: COLORS.DARKGRAY,
    borderRadius: 8,
    backgroundColor: COLORS.GRAY,
    color: COLORS.DARK,
    fontFamily: FONTS.MEDIUM,
  },
  dueDateInput: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  dateInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: COLORS.DARKGRAY,
    borderRadius: 8,
    backgroundColor: COLORS.GRAY,
    color: COLORS.DARK,
    fontFamily: FONTS.MEDIUM,
  },
  totalSection: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: COLORS.DARKGRAY,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  totalLabel: {
    color: COLORS.DARKGRAY,
    fontFamily: FONTS.MEDIUM,
    fontSize: 14,
  },
  totalAmount: {
    color: COLORS.DARK,
    fontFamily: FONTS.EXTRABOLD,
    fontSize: 22,
  },
  creditAmount: {
    marginTop: 2,
    color: COLORS.DARK,
    fontFamily: FONTS.MEDIUM,
    fontSize: 14,
  },
  processButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.DARK,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  processButtonText: {
    color: '#FFF',
    fontFamily: FONTS.SEMIBOLD,
    fontSize: 16,
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: COLORS.BLUE,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    color: COLORS.DARK,
    fontFamily: FONTS.BOLD,
    fontSize: 12,
  },
  outOfStock: {
    position: 'absolute',
    top: 8,
    left: 80,
    backgroundColor: COLORS.PINK,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  outOfStockText: {
    color: COLORS.WHITE,
    fontFamily: FONTS.BOLD,
    fontSize: 12,
  },
});

export default add_sale;
