import axios from "axios";
import { useState } from "react";
import { TextInput, TouchableOpacity, Text, View, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { useAuth } from "./contexts/AuthContext";
import { BASE_URL } from "@/config";

const OtpScreen = () => {
  const { email } = useLocalSearchParams();
  const [otp, setOtp] = useState("");
  const { setAuthToken } = useAuth();

  const verifyOtp = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/api/otpauth/verify-otp/`, {
        email,
        otp,
      });
      const { access, refresh } = response.data;
      if (access && refresh) {
        await AsyncStorage.setItem("authToken", access);
        setAuthToken(access); //update the context
        Alert.alert("Success", "Login successful!");
        router.push("/(tabs)");
      } else {
        Alert.alert("Error", "Token not received from server.");
      }
    } catch (error) {
      console.log(error);
      alert("Invalid OTP");
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <Text style={{ fontSize: 20, marginBottom: 20 }}>Enter OTP</Text>
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: "gray",
          padding: 10,
          width: "80%",
          marginBottom: 20,
        }}
        placeholder="Enter OTP"
        value={otp}
        onChangeText={setOtp}
        keyboardType="numeric"
      />
      <TouchableOpacity
        style={{ backgroundColor: "blue", padding: 15, borderRadius: 5 }}
        onPress={verifyOtp}
      >
        <Text style={{ color: "white", fontSize: 16 }}>Verify OTP</Text>
      </TouchableOpacity>
    </View>
  );
};

export default OtpScreen;
