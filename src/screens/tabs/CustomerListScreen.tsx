import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets, } from 'react-native-safe-area-context';
import { View, Text, Image, TouchableOpacity, StyleSheet, TextInput, Dimensions, Alert, BackHandler, FlatList } from 'react-native'
import React, { useState, useEffect } from 'react'
import { ScrollView } from 'react-native-gesture-handler';
import FONTS from '../../constants/fonts';
import COLORS from '../../constants/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';

const CustomerListScreen = () => {
  const [customer, setCustomer] = useState([])

  useEffect(() => {
    fetch("https://tl-backend-07ks.onrender.com/customers")
      .then((res) => res.json())
      .then((data) => setCustomer(data))
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  return (
    <SafeAreaProvider>
      <ScrollView>
        <SafeAreaView style={{
          gap: 32,
          paddingVertical: 42,
          paddingHorizontal: 42,
          backgroundColor: "#FFFFFF",
          }}>
            <View>
              <FlatList
              data={customer}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View>
                    <View>
                    <Image
                      source={
                      item.c_gender == 'male'
                        ? require('../../assets/profiles/male.png')
                        : item.c_gender == 'female'
                        ? require('../../assets/profiles/female.png')
                        : require('../../assets/profiles/default.png')
                      }
                      style={{ width: 42, height: 42 }}
                    />
                    </View>
                  <Text>{item.c_fullname}</Text>
                  <Text>{item.c_gender}</Text>
                </View>
              )}
              />
            </View>
        </SafeAreaView>
      </ScrollView>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  section:{
    gap: 12,
  },
  sectionTitleHeader:{
    fontSize: 24,
    color: COLORS.DARK,
    fontFamily: FONTS.BOLD,
  },
  card:{
    gap: 8,
    borderWidth: 3,
    borderStyle: "solid",
    borderRadius: 24,
    padding: 16,
    alignItems: "center",
  },
  cardTextSection:{
    gap: 0,
  },
  button:{
    gap: 4,
    borderRadius: 6,
    paddingVertical: 4,
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 12,
  },
  buttonText:{
    color: COLORS.DARK,
    fontFamily: FONTS.BOLD,
  }
})

export default CustomerListScreen