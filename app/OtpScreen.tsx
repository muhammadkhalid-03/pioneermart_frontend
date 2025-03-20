import axios from "axios";
import { useState } from "react";
import {
  TouchableOpacity,
  Text,
  View,
  Alert,
  SafeAreaView,
  Dimensions,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { useAuth } from "./contexts/AuthContext";
import { BASE_URL } from "@/config";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { OtpInput } from "react-native-otp-entry";

const width = Dimensions.get("window").width;
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
        // await AsyncStorage.setItem("refreshToken", refresh); //added this for testing
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
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.contentContainer}>
            <MaterialIcons name="verified" size={180} color="#4b0082" />
            <Text style={styles.heading}>Enter Your Verification Code</Text>
            <Text style={styles.subheading}>We sent it to</Text>
            <Text style={styles.subheading}>your Grinnell email!</Text>

            <View style={styles.otpContainer}>
              <OtpInput
                numberOfDigits={6}
                onTextChange={(text) => setOtp(text)}
                focusColor="green"
                focusStickBlinkingDuration={400}
                disabled={false}
                theme={{
                  pinCodeContainerStyle: {
                    backgroundColor: "white",
                    width: 50,
                    height: 70,
                    borderRadius: 12,
                    paddingHorizontal: 10,
                  },
                }}
              />
            </View>

            <View style={styles.resendContainer}>
              <Text>Didn't receive the code ?</Text>
              <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.resendText}> Resend</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.verifyButton} onPress={verifyOtp}>
              <Text style={styles.verifyButtonText}>Verify</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default OtpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingBottom: 20,
  },
  contentContainer: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 22,
    marginTop: 30,
    marginBottom: 10,
    fontWeight: "600",
  },
  subheading: {
    fontSize: 16,
  },
  otpContainer: {
    marginTop: 50,
    marginBottom: 10,
    width: width - 20,
  },
  resendContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  resendText: {
    fontSize: 16,
    color: "#4b0082",
  },
  verifyButton: {
    width: width * 0.8,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: "center",
    backgroundColor: "#4b0082",
    marginTop: 20,
  },
  verifyButtonText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
  },
});
