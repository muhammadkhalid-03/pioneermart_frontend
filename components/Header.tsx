import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import SearchBar from "./SearchBar";
import { useState } from "react";
import { ItemType } from "@/types/types";

const Header: React.FC = () => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <SearchBar />
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingBottom: 10,
    gap: 15,
  },
});
