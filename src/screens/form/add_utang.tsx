import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
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
};

type Customer = {
  id: number;
  c_fullname: string;
};

const add_utang = () => {
  const [userId, setUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [credits, setCredits] = useState<Credit[]>([]);

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
        const [custRes, overRes] = await Promise.all([
          fetch(`${API_URL}/user/${userId}/customerlist`),
          fetch(`${API_URL}/overview?limit=500`),
        ]);
        const custData = await custRes.json();
        const overData = await overRes.json();
        setCustomers(Array.isArray(custData) ? custData : []);
        const allCredits: Credit[] = Array.isArray(overData?.credits) ? overData.credits : [];
        const filtered = allCredits.filter((c) => (c.user_id == null || c.user_id === userId) && Number(c.balance) > 0 && c.status !== 'paid');
        setCredits(filtered);
      } catch {
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userId]);

  const utangByCustomer = useMemo(() => {
    const map = new Map<number, number>();
    for (const c of credits) {
      map.set(c.customerid, (map.get(c.customerid) || 0) + Number(c.balance || 0));
    }
    return map;
  }, [credits]);

  const customersWithDebt = useMemo(() => {
    return customers
      .filter((c) => utangByCustomer.has(c.id))
      .map((c) => ({ ...c, totalUtang: utangByCustomer.get(c.id) || 0 }))
      .sort((a, b) => (b.totalUtang as number) - (a.totalUtang as number));
  }, [customers, utangByCustomer]);

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.BLUE} />
        <Text style={{ marginTop: 8, fontFamily: FONTS.MEDIUM, color: COLORS.DARK }}> Loading... </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontFamily: FONTS.EXTRABOLD, fontSize: 22, color: COLORS.DARK, marginBottom: 12 }}>
        Customers with Utang
      </Text>

      <FlatList
        data={customersWithDebt}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View
            style={{
              padding: 14,
              borderWidth: 1,
              borderColor: COLORS.DARK,
              borderRadius: 12,
              backgroundColor: '#FFF',
              marginBottom: 12,
            }}
          >
            <Text style={{ fontFamily: FONTS.BOLD, color: COLORS.DARK, fontSize: 16 }}>
              {item.c_fullname}
            </Text>
            <Text style={{ fontFamily: FONTS.MEDIUM, color: COLORS.DARKGRAY, marginTop: 2 }}>
              Outstanding: ₱{Number((item as any).totalUtang || 0).toFixed(2)}
            </Text>
          </View>
        )}
        ListEmptyComponent={() => (
          <Text style={{ fontFamily: FONTS.MEDIUM, color: COLORS.DARKGRAY }}>No customers with utang</Text>
        )}
      />
    </SafeAreaView>
  );
};

export default add_utang;