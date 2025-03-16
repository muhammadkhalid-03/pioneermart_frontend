import { View, Text, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SearchBar from "./SearchBar";

type HeaderProps = {
  screenId: "home" | "favorites" | "myItems";
};
const Header: React.FC<HeaderProps> = ({ screenId }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <SearchBar screenId={screenId} />
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
});
