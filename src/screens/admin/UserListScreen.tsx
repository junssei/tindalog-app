import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
} from 'react-native';
import React, { useState, useEffect } from 'react';
import FONTS from '../../constants/fonts';
import COLORS from '../../constants/colors';
import Icon from 'react-native-vector-icons/Ionicons';

type Users = {
  id: number;
  email: string;
  username: string;
  tindahan_name: string;
  role: string;
};

const UserListScreen = () => {
  const [user, setUser] = useState<Users[]>([]);
  const [query, setQuery] = useState('');

  React.useEffect(() => {
    const url = `https://tindalog-backend.up.railway.app/users`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setUser(data);
        } else {
          setUser(data.data || []);
        }
      })
      .catch(err => console.error('Error fetching users:', err));
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
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
              placeholderTextColor={COLORS.DARKGRAY}
              value={query}
              onChangeText={setQuery}
              style={[
                styles.input,
                { fontFamily: FONTS.MEDIUM, fontSize: 16, color: COLORS.DARK },
              ]}
            />
          </View>
        </View>
        <FlatList
          contentContainerStyle={{ paddingBottom: 220, paddingTop: 12 }}
          data={user.filter(c =>
            c.username.toLowerCase().includes(query.toLowerCase()),
          )}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity activeOpacity={0.85} style={styles.card}>
              <View style={styles.cardRow}>
                <Image
                  source={
                    item.c_gender === 'Male'
                      ? require('../../assets/profiles/male.png')
                      : item.c_gender === 'Female'
                      ? require('../../assets/profiles/female.png')
                      : require('../../assets/profiles/default.png')
                  }
                  style={styles.avatar}
                />

                <View style={styles.cardTextSection}>
                  <Text style={styles.name}>{item.username}</Text>
                  <Text style={styles.subtitle}>{item.role}</Text>
                </View>

                <Icon name="chevron-forward" size={22} color={COLORS.DARK} />
              </View>

              <View style={styles.divider} />

              <TouchableOpacity
                style={styles.transactionButton}
                onPress={() => {
                  /* TODO: transaction */
                }}
              >
                <Text style={styles.transactionButtonText}>+ Transaction</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          )}
          ListEmptyComponent={() => (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 16, color: 'gray' }}>No rows found</Text>
            </View>
          )}
        />
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
  input: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FBFF',
    borderWidth: 1,
    borderColor: COLORS.BLUE,
    paddingHorizontal: 12,
    borderRadius: 30,
    height: 44,
  },
  typeChip: {
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: COLORS.DARK,
    backgroundColor: '#FFFFFF',
    marginLeft: 12,
  },
  typeChipText: {
    fontFamily: FONTS.MEDIUM,
    color: COLORS.DARK,
    fontSize: 14,
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
  status: {
    fontFamily: FONTS.MEDIUM,
    fontSize: 14,
  },
  credit: {
    fontFamily: FONTS.MEDIUM,
    fontSize: 14,
    color: COLORS.DARKGRAY,
  },
  divider: {
    height: 1,
    backgroundColor: '#E6E6E6',
    marginVertical: 10,
  },
  transactionButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#E6F0FA',
    borderWidth: 1,
    borderColor: '#9CC9F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  transactionButtonText: {
    fontFamily: FONTS.BOLD,
    color: '#2E6EA6',
  },
});

export default UserListScreen;
