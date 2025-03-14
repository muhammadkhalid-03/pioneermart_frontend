import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import SearchBar from "./SearchBar";
import { useState } from "react";
import { ItemType } from "@/types/types";

// interface HeaderProps {
//   onSearchResults: (results: ItemType[]) => void;
// }

const Header: React.FC = () => {
  const insets = useSafeAreaInsets();
  //   const [searchResults, setSearchResults] = useState<ItemType[]>([]);

  //   const handleSearchResults = (results: ItemType[]) => {
  //     // setSearchResults(results);
  //     onSearchResults(results);
  //   };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Text style={styles.logo}>PM</Text>
      <SearchBar />
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingBottom: 10,
    gap: 15,
  },
  logo: {
    fontSize: 24,
    fontWeight: "700",
    color: "black",
  },
  // searchBar: {
  //     flex: 1,
  //     backgroundColor: "#D3D3D3",
  //     paddingVertical: 8,
  //     paddingHorizontal: 10,
  //     flexDirection: 'row',
  //     justifyContent: 'center',
  //     borderRadius: 15,
  // },
  // searchTxt: {
  //     color: "black",
  // }
});
