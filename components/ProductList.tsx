import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { ItemType } from "@/types/types";
import SingleItem from "./SingleItem";
import { useRoute } from "@react-navigation/native";
import { useAuth } from "@/app/contexts/AuthContext";
import { useItemsStore } from "@/stores/useSearchStore";

type ProductListProps = {
  items: ItemType[] | null;
  isLoading?: boolean;
  source?: string; //tracks which page is rendering this list for favorite icon purpose
};

const ProductList = ({
  items,
  isLoading = false,
  source,
}: ProductListProps) => {
  const route = useRoute();

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4285F4" />
        <Text style={styles.loadingText}>Loading items...</Text>
      </View>
    );
  }

  if (items && items.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.noItemsText}>No items found in this category</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {route.name === "index" ? "Latest" : "Your"} Items
      </Text>
      <FlatList
        data={items}
        renderItem={({ item }) => <SingleItem item={item} source={source} />}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={{ justifyContent: "space-between" }} // Ensure even spacing
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default ProductList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 5,
    marginBottom: 10,
  },
  listContent: {
    paddingBottom: 20,
    justifyContent: "space-between", // Helps distribute items evenly
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  noItemsText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});
