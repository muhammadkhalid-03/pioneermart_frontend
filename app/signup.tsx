import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import Entypo from "@expo/vector-icons/Entypo";
import { router, Stack } from "expo-router";
import { Colors } from "react-native/Libraries/NewAppScreen";
import InputField from "@/components/inputField";
import axios from "axios";
import { BASE_URL } from "@/config";

type Props = {};

const SignUpScreen = (props: Props) => {
  const [email, setEmail] = useState("");

  const requestOTP = async () => {
    try {
      const OTP_URL = `${BASE_URL}/api/otpauth/request-otp/`;
      await axios.post(
        OTP_URL,
        {
          // response for future error checking
          email: email,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      console.log("requested OTP....");
      router.push({ pathname: "/OtpScreen", params: { email: email } });
    } catch (error) {
      alert("Failed to do OTP stuff");
    }
  };
  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Sign Up",
          headerTitleAlign: "center",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Entypo name="cross" size={24} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <View style={styles.container}>
        <Text style={styles.title}>Create an Account</Text>
        <InputField
          placeholder="Email Address"
          placeholderTextColor={Colors.gray}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TouchableOpacity style={styles.btn}>
          <Text style={styles.btnTxt} onPress={requestOTP}>
            Send Code
          </Text>
        </TouchableOpacity>
        <View style={styles.divider} />
      </View>
    </>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 20,
    color: Colors.black,
  },
  btn: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 18,
    alignSelf: "stretch",
    borderRadius: 5,
    marginTop: 20,
  },
  btnTxt: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  loginTxt: {
    marginBottom: 20,
    marginTop: 20,
    fontSize: 14,
    color: Colors.black,
    lineHeight: 24,
  },
  loginTxtSpan: {
    fontWeight: "600",
    color: Colors.primary,
  },
  divider: {
    borderTopColor: Colors.gray,
    borderTopWidth: StyleSheet.hairlineWidth,
    width: "30%",
    marginBottom: 30,
  },
});
