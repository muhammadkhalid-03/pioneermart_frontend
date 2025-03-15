import Categories from "@/components/Categories";
import Header from "@/components/Header";
import ProductList from "@/components/ProductList";
import { CategoryType, ItemType } from "@/types/types";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { useSearch } from "../contexts/SearchContext";
import axios from "axios";
import { BASE_URL } from "@/config";

const MyItems = () => {
  const [items, setItems] = useState<ItemType[]>([]);
  const [filteredItems, setFilteredItems] = useState<ItemType[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);

  const { authToken } = useAuth(); //auth context

  const {
    searchQuery,
    filteredResults,
    isLoading,
    toggleCategory,
    clearCategories,
    selectedCategory,
    setSelectedCategory,
  } = useSearch(); // search context

  // Decide which items to show:
  const itemsToDisplay = searchQuery !== "" ? filteredResults : filteredItems;

  //this will run every time authToken changes
  useEffect(() => {
    if (authToken) {
      console.log("Token has been updated:", authToken);
    }
  }, [authToken]); // dependency for authToken changes

  //this will run ONLY once when the component initially mounts
  useEffect(() => {
    // getCategories();
    getUserItems();
  }, []);

  //this will run whenever items or selectedCategory is changed. It essentually just filters by category right now
  useEffect(() => {
    if (selectedCategory === null) {
      setFilteredItems(items);
    } else {
      const filtered = items.filter(
        (item) => Number(item.category) === Number(selectedCategory)
      );
      setFilteredItems(filtered);
    }
  }, [items, selectedCategory]);

  function processCategoryData(data: ItemType[]): CategoryType[] {
    const categoryMap: { [key: number]: CategoryType } = {}; // Use a map to avoid duplicates

    data.forEach((item) => {
      const categoryId = item.category;
      const categoryName = item.category_name;

      if (!categoryMap[categoryId]) {
        categoryMap[categoryId] = { id: categoryId, name: categoryName };
      }
    });

    return Object.values(categoryMap);
  }

  const getUserItems = async () => {
    try {
      const cleanToken = authToken?.trim();
      const URL = `${BASE_URL}/api/items/my_items/`; // get users posted items
      const response = await axios.get(URL, {
        headers: {
          Authorization: `Bearer ${cleanToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (response.data && response.data.length > 0) {
        setItems(response.data);
        setCategories(processCategoryData(response.data));
      } else {
        console.error("No user data found in the response.");
        Alert.alert("Error", "No user items found.");
      }
    } catch (error) {
      console.error("Error getting user items:", error);
      Alert.alert("Error", "Failed to get user items. Please try again.");
    }
  };

  const handleCategorySelect = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    if (categoryId === null) {
      clearCategories();
    } else {
      toggleCategory(categoryId);
    }
  };
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          header: () => <Header />,
        }}
      />
      <Categories
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategorySelect}
      />
      <ProductList items={itemsToDisplay} isLoading={isLoading} />
    </>
  );
};

export default MyItems;
