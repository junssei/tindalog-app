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
import FONTS from '../../constants/fonts';
import COLORS from '../../constants/colors';
import React, { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import SCREENS from '../../screens';

type Products = {
  product_id: number;
  userid: number;
  product_name: string;
  category: string;
  brand: string;
  description: string;
  price: number;
  stock: number;
  unit: string;
};

const ProductScreen = () => {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<Products[]>([]);

  // Get user data
  const [user, setUser] = useState<any>(null);
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

    if (user?.id) {
      const url = `https://tindalog-backend.up.railway.app/user/${user.id}/productlist`;

      fetch(url)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setProducts(data);
          } else {
            setProducts(data.data || []);
          }
        })
        .catch(err => console.error('Error fetching users:', err));
    }
  }, [user]);

  const navigation = useNavigation<any>();

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
          <TouchableOpacity
            onPress={() => navigation.navigate(SCREENS.ADDPRODUCTSCREEN as never)}
            style={styles.addButton}
            activeOpacity={0.85}
          >
            <Icon name="add" size={22} color={COLORS.DARK} />
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          contentContainerStyle={{ paddingBottom: 220, paddingTop: 12 }}
          data={products.filter(c =>
            c.product_name.toLowerCase().includes(query.toLowerCase()),
          )}
          keyExtractor={item => item.product_id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.cardlist}
              onPress={() => {
                navigation.navigate('VIEWPRODUCTSCREEN', {
                  userID: user.id,
                  unit: item.unit,
                  brand: item.brand,
                  price: item.price,
                  stock: item.stock,
                  category: item.category,
                  product_id: item.product_id,
                  description: item.description,
                  product_name: item.product_name,
                });
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
                  <Text style={styles.cardlistText}>Stocks: {item.stock}</Text>
                </View>
              </View>
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
              <Text style={{ fontSize: 16, color: COLORS.DARKGRAY, fontFamily: FONTS.MEDIUM }}>No products found</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate(SCREENS.ADDPRODUCTSCREEN as never)}
                style={[styles.addButton, { marginTop: 10 }]}
              >
                <Icon name="add" size={20} color={COLORS.DARK} />
                <Text style={styles.addButtonText}>Add Product</Text>
              </TouchableOpacity>
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
    backgroundColor: '#F6F8FC',
    borderWidth: 1,
    borderColor: '#D8E1F0',
    paddingHorizontal: 14,
    borderRadius: 12,
    height: 46,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.PRIMARY,
    borderWidth: 1,
    borderColor: COLORS.DARK,
    paddingHorizontal: 12,
    height: 44,
    borderRadius: 10,
    marginLeft: 10,
  },
  addButtonText: {
    fontFamily: FONTS.SEMIBOLD,
    color: COLORS.DARK,
    fontSize: 14,
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

  cardlist: {
    borderWidth: 2,
    borderColor: COLORS.DARK,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.WHITE,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
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
});

export default ProductScreen;
