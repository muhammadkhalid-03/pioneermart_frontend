import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Link, router, Stack } from 'expo-router'
import { Colors } from 'react-native/Libraries/NewAppScreen'
import Entypo from '@expo/vector-icons/Entypo'
import InputField from '@/components/inputField'

type Props = {}

const SignInScreen = (props: Props) => {
  return (
    <>
      <Stack.Screen options={{ headerTitle: 'Sign In', headerTitleAlign: 'center', headerLeft: () =>(
        <TouchableOpacity onPress={() => router.back()}>
          <Entypo name="cross" size={24} color="black" />
        </TouchableOpacity>
      )}} />
      <View style={styles.container}>
        <Text style={styles.title}>Login to your Account</Text>
        <InputField 
          placeholder="Email Address" 
          placeholderTextColor={Colors.gray} 
          autoCapitalize='none'
          keyboardType="email-address" />
        <InputField 
          placeholder="Password" 
          placeholderTextColor={Colors.gray} 
          secureTextEntry={true} />
        <TouchableOpacity style={styles.btn} onPress={() => {
          router.dismissAll();
          router.push('/(tabs)');
        }}>
          <Text style={styles.btnTxt}>Login</Text>
        </TouchableOpacity>
        <Text style={styles.loginTxt}>
          Don't have an account?{" "}
          <Link href={"/signup"} asChild>
            <TouchableOpacity>
              <Text style={styles.loginTxtSpan}>Sign Up</Text>
            </TouchableOpacity>
          </Link>
        </Text>
      </View>
    </>
  )
}

export default SignInScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    backgroundColor: Colors.background
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
    color: Colors.black,
  },
  btn: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 18,
    alignSelf: 'stretch',
    borderRadius: 5,
    marginTop: 20,
  },
  btnTxt: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  loginTxt: {
    marginBottom: 20,
    marginTop: 20,
    fontSize: 14,
    color: Colors.black,
    lineHeight: 24,
  },
  loginTxtSpan: {
    fontWeight: '600',
    color: Colors.primary,
  },
})