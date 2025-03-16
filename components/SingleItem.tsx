import { ItemType } from "@/types/types";
import {
  Dimensions,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router } from "expo-router";
import { useRoute } from "@react-navigation/native";
import { useItemsStore } from "@/stores/useSearchStore";
import { useAuth } from "@/app/contexts/AuthContext";

type Props = {
  item: ItemType;
};

const width = Dimensions.get("window").width - 40; // -40 b/c marginHorizontal in index.tsx is 20 so we need to reduce the width by 20x2

const SingleItem = ({ item }: Props) => {
  // const { isFavorite } = useFavorites();
  const route = useRoute();
  const { toggleFavorite } = useItemsStore();
  const { authToken } = useAuth();

  const handleItemPress = () => {
    router.push({
      pathname: "/ItemDetails",
      params: { item: JSON.stringify(item) },
    });
  };

  return (
    <TouchableOpacity
      onPress={route.name === "ItemDetails" ? () => {} : handleItemPress}
    >
      <View style={styles.container}>
        <Image source={{ uri: item.image }} style={styles.itemImage} />
        {route.name !== "additionalinfo/MyItems" ? (
          <TouchableOpacity
            style={styles.favBtn}
            onPress={() => toggleFavorite(item.id, authToken || "")}
          >
            <AntDesign
              name={item.is_favorited ? "heart" : "hearto"}
              size={22}
              color="black"
            />
          </TouchableOpacity>
        ) : null}
        {route.name === "ItemDetails" ? null : (
          <Text style={styles.title}>${item.price}</Text>
        )}
        {route.name === "ItemDetails" ? null : (
          <Text style={styles.title}>{item.title}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default SingleItem;

const styles = StyleSheet.create({
  container: {
    width: (width - 20) / 2, // Ensure spacing works correctly
    marginHorizontal: 5, // Add margin for spacing
  },
  itemImage: {
    width: "100%",
    height: 200,
    borderRadius: 15,
    marginTop: 10,
    marginBottom: 10,
  },
  favBtn: {
    position: "absolute",
    right: 20,
    top: 20,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    padding: 5,
    borderRadius: 30,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "black",
  },
});
