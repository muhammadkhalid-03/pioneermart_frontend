import { View, Text, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SearchBar from "./SearchBar";

const Header: React.FC = () => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* <Text style={styles.logo}>PM</Text> */}
      <SearchBar />
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    // flexDirection: "row",
    // justifyContent: "space-between",
    // alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingBottom: 12,
    // gap: 10,
  },
  // logo: {
  //   fontSize: 24,
  //   fontWeight: "700",
  //   color: "black",
  // },
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
