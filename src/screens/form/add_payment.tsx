import {
  View,
  Text,
  Alert,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Modal,
} from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import COLORS from '../../constants/colors';
import FONTS from '../../constants/fonts';

const API_URL = 'https://tindalog-backend.up.railway.app';

type Credit = {
  id: number;
  customerid: number;
  user_id?: number | null;
  balance: number;
  status: string;
  order_id?: number;
};

type Customer = {
  id: number;
  c_fullname: string;
};

const add_payment = () => {
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<number | null>(null);

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [credits, setCredits] = useState<Credit[]>([]);

  const [customerModal, setCustomerModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedCreditId, setSelectedCreditId] = useState<number | null>(null);
  const [amount, setAmount] = useState('');

  useEffect(() => {
    const init = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const parsed = JSON.parse(userData);
          setUserId(parsed?.id ?? null);
        }
      } catch {}
    };
    init();
  }, []);

  useEffect(() => {
    if (!userId) return;
    const load = async () => {
      setLoading(true);
      try {
        // fetch customers and overview credits
        const [custRes, overRes] = await Promise.all([
          fetch(`${API_URL}/user/${userId}/customerlist`),
          fetch(`${API_URL}/overview?limit=500`),
        ]);
        const custData = await custRes.json();
        const overData = await overRes.json();
        const allCustomers: Customer[] = Array.isArray(custData) ? custData : [];
        const allCredits: Credit[] = Array.isArray(overData?.credits) ? overData.credits : [];
        setCustomers(allCustomers);
        // filter credits to this user and with unpaid balance
        const filtered = allCredits.filter((c) => (c.user_id == null || c.user_id === userId) && Number(c.balance) > 0 && c.status !== 'paid');
        setCredits(filtered);
      } catch (e) {
        Alert.alert('Error', 'Failed to load customers/credits');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userId]);

  const customersWithDebt = useMemo(() => {
    const ids = new Set(credits.map((c) => c.customerid));
    return customers.filter((c) => ids.has(c.id));
  }, [customers, credits]);

  const customerCredits = useMemo(() => {
    if (!selectedCustomer) return [] as Credit[];
    return credits.filter((c) => c.customerid === selectedCustomer.id);
  }, [credits, selectedCustomer]);

  const selectedCredit = useMemo(
    () => customerCredits.find((c) => c.id === selectedCreditId) || null,
    [customerCredits, selectedCreditId],
  );

  const submitPayment = async () => {
    const amt = parseFloat(amount || '0');
    if (!selectedCustomer) return Alert.alert('Missing', 'Please select a customer');
    if (!selectedCredit) return Alert.alert('Missing', 'Please select a credit');
    if (!amt || amt <= 0) return Alert.alert('Invalid Amount', 'Enter a positive amount');
    if (amt > Number(selectedCredit.balance)) return Alert.alert('Too Much', 'Amount exceeds remaining balance');

    try {
      const res = await fetch(`${API_URL}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ creditid: selectedCredit.id, amount_paid: amt }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        Alert.alert('Payment Error', data?.error || 'Failed to record payment');
        return;
      }
      Alert.alert('Success', 'Payment recorded', [{ text: 'OK' }]);
      // Refresh credits
      setAmount('');
      setSelectedCreditId(null);
      setSelectedCustomer(null);
      // force reload
      if (userId) {
        try {
          const overRes = await fetch(`${API_URL}/overview?limit=500`);
          const overData = await overRes.json();
          const allCredits: Credit[] = Array.isArray(overData?.credits) ? overData.credits : [];
          const filtered = allCredits.filter((c) => (c.user_id == null || c.user_id === userId) && Number(c.balance) > 0 && c.status !== 'paid');
          setCredits(filtered);
        } catch {}
      }
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Failed to record payment');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.BLUE} />
        <Text style={{ marginTop: 8, fontFamily: FONTS.MEDIUM, color: COLORS.DARK }}> Loading... </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, padding: 20, backgroundColor: COLORS.WHITE, paddingTop: 64 }}>
      <Text style={{ fontFamily: FONTS.EXTRABOLD, fontSize: 22, color: COLORS.DARK, marginBottom: 12 }}>
        Record Payment
      </Text>

      <View style={{ gap: 12 }}>
        {/* Customer selector */}
        <TouchableOpacity
          onPress={() => setCustomerModal(true)}
          style={{
            height: 48,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: COLORS.DARKGRAY,
            paddingHorizontal: 12,
            alignItems: 'flex-start',
            justifyContent: 'center',
            backgroundColor: COLORS.GRAY,
          }}
        >
          <Text style={{ fontFamily: FONTS.MEDIUM, color: COLORS.DARK }}>
            {selectedCustomer ? selectedCustomer.c_fullname : 'Select customer with utang'}
          </Text>
        </TouchableOpacity>

        {/* Credit selector (after customer) */}
        {selectedCustomer ? (
          <View style={{ gap: 8 }}>
            <Text style={{ fontFamily: FONTS.MEDIUM, color: COLORS.DARKGRAY }}>Select Credit</Text>
            <FlatList
              data={customerCredits}
              keyExtractor={(item) => String(item.id)}
              horizontal
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => setSelectedCreditId(item.id)}
                  style={{
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    borderWidth: 1,
                    borderColor: selectedCreditId === item.id ? COLORS.BLUE : COLORS.DARKGRAY,
                    backgroundColor: selectedCreditId === item.id ? COLORS.BLUE : COLORS.GRAY,
                    borderRadius: 8,
                    marginRight: 8,
                  }}
                >
                  <Text style={{ fontFamily: FONTS.MEDIUM, color: COLORS.DARK }}>
                    #{item.id} • Bal ₱{Number(item.balance).toFixed(2)}
                  </Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={() => (
                <Text style={{ fontFamily: FONTS.MEDIUM, color: COLORS.DARKGRAY }}>
                  No open credits for this customer
                </Text>
              )}
            />
          </View>
        ) : null}

        {/* Amount input */}
        <View>
          <Text style={{ fontFamily: FONTS.MEDIUM, color: COLORS.DARKGRAY }}>Amount</Text>
          <TextInput
            value={amount}
            onChangeText={setAmount}
            placeholder="0.00"
            placeholderTextColor={COLORS.DARK}
            keyboardType="numeric"
            style={{
              height: 48,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: COLORS.DARKGRAY,
              paddingHorizontal: 12,
              backgroundColor: COLORS.GRAY,
              color: COLORS.DARK,
              fontFamily: FONTS.MEDIUM,
            }}
          />
        </View>

        <TouchableOpacity
          onPress={submitPayment}
          style={{
            height: 48,
            borderRadius: 8,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: COLORS.DARK,
          }}
        >
          <Text style={{ color: '#FFF', fontFamily: FONTS.SEMIBOLD, fontSize: 16 }}>Save Payment</Text>
        </TouchableOpacity>
      </View>

      {/* Customer Modal */}
      <Modal visible={customerModal} animationType="slide" onRequestClose={() => setCustomerModal(false)}>
        <View style={{ padding: 20, gap: 12 }}>
          <Text style={{ fontFamily: FONTS.BOLD, fontSize: 18, color: COLORS.DARK }}>Select Customer</Text>
          <FlatList
            data={customersWithDebt}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  setSelectedCustomer(item);
                  setSelectedCreditId(null);
                  setCustomerModal(false);
                }}
                style={{
                  padding: 12,
                  borderWidth: 1,
                  borderColor: COLORS.DARK,
                  borderRadius: 10,
                  marginBottom: 10,
                  backgroundColor: '#FFF',
                }}
              >
                <Text style={{ fontFamily: FONTS.MEDIUM, color: COLORS.DARK }}>{item.c_fullname}</Text>
                <Text style={{ fontFamily: FONTS.REGULAR, color: COLORS.DARKGRAY }}>Has outstanding credits</Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={() => (
              <Text style={{ fontFamily: FONTS.MEDIUM, color: COLORS.DARKGRAY }}>No customers with utang</Text>
            )}
          />
          <TouchableOpacity onPress={() => setCustomerModal(false)} style={{ alignSelf: 'flex-end' }}>
            <Text style={{ fontFamily: FONTS.SEMIBOLD, color: COLORS.DARK }}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default add_payment;