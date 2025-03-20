import {
  Dimensions,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { router, Stack, useLocalSearchParams } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";
import { useState } from "react";
import ItemPurchaseModal from "@/components/ItemPurchaseModal";
import SingleItem from "@/components/SingleItem";
import { useItemsStore } from "@/stores/useSearchStore";

const width = Dimensions.get("window").width; // -40 b/c marginHorizontal in index.tsx is 20 so we need to reduce the width by 20x2

const ItemDetails = () => {
  const { item: itemString, source } = useLocalSearchParams(); // access the item parameter as a string
  const item = JSON.parse(itemString as string); // turn into JSON object for details page
  const { setIsReturningFromDetails } = useItemsStore();

  const [isVisible, setIsVisible] = useState(false);

  const openModal = () => {
    setIsVisible(true);
    console.log("Requested purchase...");
    console.log("Seller: ", item.seller_name);
  };

  const closeModal = () => {
    setIsVisible(false);
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: item.title,
          headerTitleAlign: "center",
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity
              style={{ padding: 8 }}
              onPress={() => {
                router.back();
                console.log("navigating back...");
              }}
            >
              <Entypo name="chevron-left" size={24} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <View style={styles.container}>
        <ItemPurchaseModal
          isVisible={isVisible}
          onClose={closeModal}
          email={item.seller_name}
        />
        <SingleItem item={item} />
        <Text style={styles.title}>Price: ${item.price}</Text>
        <Text style={styles.title}>Name: {item.title}</Text>
        <Text style={styles.title}>Description: {item.description}</Text>
        <Text style={styles.title}>Seller: {item.seller_name}</Text>
        <Text style={styles.title}>Date Posted: {item.created_at}</Text>
        <Text style={styles.title}>Category: {item.category_name}</Text>
        {source !== "myItems" && (
          <TouchableOpacity
            style={{ backgroundColor: "blue", padding: 15, borderRadius: 5 }}
            onPress={openModal}
          >
            <Text style={{ color: "white", fontSize: 16 }}>
              Request Puchase
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </>
  );
};

export default ItemDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    justifyContent: "center",
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
