import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Alert,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { CameraView, useCameraPermissions } from "expo-camera";
import { MaterialIcons } from "@expo/vector-icons";
import Foundation from "@expo/vector-icons/Foundation";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "expo-router";
import { ScrollView } from "react-native";
import DangerModal from "@/components/DangerModal";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useUserStore } from "@/stores/userStore";

const ProfileScreen = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const insets = useSafeAreaInsets();
  const camera = useRef<CameraView>(null); //TODO: Implement camera feature to upload items
  const { authToken, onLogout } = useAuth();
  const router = useRouter();

  const { userData, isLoading, error, fetchUserData } = useUserStore();

  useEffect(() => {
    if (authToken) {
      loadUserProfile();
    }
  }, [authToken]);

  const loadUserProfile = async () => {
    try {
      await fetchUserData(authToken || "");
    } catch (error) {
      Alert.alert("Error", "Failed to load profile. Please try again");
    }
  };

  const [isClearHistoryVisible, setIsClearHistoryVisible] = useState(false);
  const [isLogoutVisible, setIsLogoutVisible] = useState(false);

  const openClearHistoryModal = () => {
    setIsClearHistoryVisible(true);
    console.log("Wants to clear history...");
  };

  const closeClearHistoryModal = () => {
    setIsClearHistoryVisible(false);
    console.log("Doesn't want to clear history...");
  };

  const openLogoutModal = () => {
    setIsLogoutVisible(true);
    console.log("Wants to log out...");
  };

  const closeLogoutModal = () => {
    setIsLogoutVisible(false);
    console.log("Doesn't want to log out...");
  };

  if (isLoading && !userData) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]}>
      <DangerModal
        isVisible={isClearHistoryVisible}
        onClose={closeClearHistoryModal}
        dangerMessage={"Are you sure you want to clear your history?"}
        dangerOption1="Yes"
        // TODO: add clear history function
      />
      <DangerModal
        isVisible={isLogoutVisible}
        onClose={closeLogoutModal}
        dangerMessage={"Are you sure you want to logout?"}
        dangerOption1="Log out"
        onDone={async () => await onLogout()}
      />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Profile</Text>
      </View>

      {/* Top row with profile image and email */}
      <View style={styles.topRowContainer}>
        <View style={styles.profileContainer}>
          <Image
            source={require("./../../assets/images/profile.jpeg")}
            style={styles.profileImage}
          />
        </View>

        <View style={styles.userInfoContainer}>
          <View style={styles.userInfoEmailContainer}>
            <MaterialIcons name="email" size={22} color="#555" />
            <Text style={styles.userEmail}>{userData?.email}</Text>
          </View>
        </View>
      </View>

      {/* General Information Section */}
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>General Information</Text>

        {/* Purchase Requests */}
        <TouchableOpacity
          style={styles.infoItem}
          onPress={() => router.push("/additionalinfo/PurchaseRequests")}
        >
          <View style={styles.infoItemLeft}>
            <FontAwesome name="send" size={22} color="#555" />
            <Text style={styles.infoItemText}>Purchase Requests</Text>
          </View>
          <MaterialIcons name="chevron-right" size={22} color="#999" />
        </TouchableOpacity>

        {/* My Items */}
        <TouchableOpacity
          style={styles.infoItem}
          // onPress={() => console.log("Wants to look at items...")}
          onPress={() => router.push("/additionalinfo/MyItems")}
        >
          <View style={styles.infoItemLeft}>
            <Foundation name="shopping-bag" size={22} color="#555" />
            <Text style={styles.infoItemText}>My Items</Text>
          </View>
          <MaterialIcons name="chevron-right" size={22} color="#999" />
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Clear History */}
        <TouchableOpacity
          style={styles.infoItem}
          onPress={openClearHistoryModal}
        >
          <View style={styles.infoItemLeft}>
            <MaterialIcons name="delete-outline" size={22} color="#555" />
            <Text style={styles.infoItemText}>Clear History</Text>
          </View>
          <MaterialIcons name="chevron-right" size={22} color="#999" />
        </TouchableOpacity>

        {/* FAQs */}
        <TouchableOpacity
          style={styles.infoItem}
          onPress={() => router.push("/additionalinfo/FAQs")}
        >
          <View style={styles.infoItemLeft}>
            <MaterialIcons name="help-outline" size={22} color="#555" />
            <Text style={styles.infoItemText}>FAQs</Text>
          </View>
          <MaterialIcons name="chevron-right" size={22} color="#999" />
        </TouchableOpacity>

        {/* Contact Us */}
        <TouchableOpacity
          style={styles.infoItem}
          onPress={() => router.push("/additionalinfo/ContactUs")}
        >
          <View style={styles.infoItemLeft}>
            <MaterialIcons name="mail-outline" size={22} color="#555" />
            <Text style={styles.infoItemText}>Contact Us</Text>
          </View>
          <MaterialIcons name="chevron-right" size={22} color="#999" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={openLogoutModal}>
        <MaterialIcons
          name="logout"
          size={22}
          color="white"
          style={styles.logoutIcon}
        />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>

      {/* <CameraModal
        visible={cameraVisible}
        onClose={() => setCameraVisible(false)}
        onCapture={handleImageCapture}
      /> */}
    </ScrollView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
  topRowContainer: {
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    padding: 10,
  },
  profileContainer: {
    position: "relative",
    marginRight: 15,
  },
  profileImage: {
    width: 140,
    height: 140,
    borderRadius: 40,
  },
  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#4285F4",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },
  userInfoContainer: {
    flex: 1,
    justifyContent: "center",
  },
  userInfoEmailContainer: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  userEmail: {
    fontSize: 16,
    color: "#666",
    marginLeft: 8,
  },
  infoSection: {
    marginTop: 25,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  infoItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoItemText: {
    fontSize: 12,
    color: "#333",
    marginLeft: 12,
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 8,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f44336",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: "100%",
    marginTop: 20,
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
});
