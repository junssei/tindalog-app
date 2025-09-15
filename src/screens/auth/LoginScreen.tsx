import { View, Text, Image, TouchableOpacity, StyleSheet, TextInput } from 'react-native'
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets, } from 'react-native-safe-area-context';
import React from 'react'

const LoginScreen = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <View style={{
          justifyContent: "center",
          alignItems: "center",
          height: "100%", }}>
            <View>
              <TextInput placeholder='Email'/>
            </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

export default LoginScreen