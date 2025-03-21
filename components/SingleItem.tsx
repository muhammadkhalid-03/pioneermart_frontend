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
import useSingleItemStore from "@/stores/singleItemStore";
import { useState } from "react";
import ZoomModal from "./ZoomModal";
import { useUserStore } from "@/stores/userStore";

type Props = {
  item: ItemType;
  source?: string;
};

const width = Dimensions.get("window").width - 40; // -40 b/c marginHorizontal in index.tsx is 20 so we need to reduce the width by 20x2

const SingleItem = ({ item, source }: Props) => {
  const route = useRoute();
  const { toggleFavorite } = useItemsStore();
  const { authToken } = useAuth();
  const { showFavoritesIcon, setShowFavoritesIcon } = useSingleItemStore();
  const { userData } = useUserStore();

  const [isZoomVisible, setIsZoomVisible] = useState(false);
  const [isFavorited, setIsFavorited] = useState(item.is_favorited);

  const handleItemPress = () => {
    //if coming from 'My Items' button, don't show favorites
    if (source === "myItems") {
      setShowFavoritesIcon(false);
      // router.push({
      //   pathname: "/ItemDetails",
      //   params: { item: JSON.stringify(item), source: source },
      // });
    } else {
      setShowFavoritesIcon(true);
    }
    // router.push({
    //   pathname: "/ItemDetails",
    //   params: { item: JSON.stringify(item) },
    // });
  };

  // get the latest item state for favorite status
  const handleFavoriteToggle = async (item: ItemType) => {
    await toggleFavorite(item.id, authToken || "");
    setIsFavorited(!isFavorited);
  };

  return (
    <TouchableOpacity
      onPress={
        route.name === "ItemDetails"
          ? () => setIsZoomVisible(true)
          : handleItemPress
      } //if on ItemDetails then do nothing
    >
      <View
        style={[
          styles.container,
          route.name === "ItemDetails" && { width: width },
        ]}
      >
        {isZoomVisible && ( //zoom functionality
          <ZoomModal
            isVisible={isZoomVisible}
            onClose={() => setIsZoomVisible(false)}
            item={item}
          />
        )}
        <Image source={{ uri: item.image }} style={styles.itemImage} />
        {
          item.seller === userData?.id && <View style={styles.myItemTag} /> //only show tag if user is not the seller
        }
        {showFavoritesIcon && // bunch of conditions for whether or not to show favorites icon based on who's the seller
        item.seller !== userData?.id &&
        route.name !== "additionalinfo/MyItems" ? (
          <TouchableOpacity
            style={styles.favBtn}
            onPress={() => handleFavoriteToggle(item)} //press function for favorite button
          >
            <AntDesign
              name={isFavorited ? "heart" : "hearto"} // if the item is favorited show filled out icon
              size={22}
              color="black"
            />
          </TouchableOpacity>
        ) : null}
        {route.name === "ItemDetails" ? null : ( // if it's the Item Details page don't show the price cause it's being shown already
          <Text style={styles.title}>${item.price}</Text>
        )}
        {route.name === "ItemDetails" ? null : ( // if it's the Item Details page don't show the title cause it's being shown already
          <Text style={styles.title}>{item.title}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default SingleItem;

const styles = StyleSheet.create({
  container: {
    width: (width - 10) / 2, // Ensure spacing works correctly
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
  myItemTag: {
    width: 10,
    height: 10,
    backgroundColor: "#ffd700",
    position: "absolute",
    borderRadius: 100 / 2,
    top: 20,
    left: 10,
  },
});
