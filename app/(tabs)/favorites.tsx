import { Alert, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { CategoryType, ItemType } from "@/types/types";
import axios from "axios";
import ProductList from "@/components/ProductList";
import Categories from "@/components/Categories";
import { Stack } from "expo-router";
import Header from "@/components/Header";
import { useAuth } from "../contexts/AuthContext";
import { useFavorites } from "../contexts/FavoritesContext";
type Props = {};
const FavoritesScreen = () => {
  // const [favorites, setFavorites] = useState<ItemType[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]); // creates an array items with ItemType objects defined in types/types.tsx interface
  const [isLoading, setIsLoading] = useState<boolean>(true); // isLoading state for animation while getting data
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [filteredItems, setFilteredItems] = useState<ItemType[]>([]); // state for filtered items
  const { authToken } = useAuth();
  const { favoriteItems, toggleFavorite, refreshFavorites } = useFavorites();
  // currently just telling us new token if it changes kinda useless rn
  useEffect(() => {
    if (authToken) {
    }
  }, [authToken]);
  // fetch all categories and favorites when component mounts...will only run once
  useEffect(() => {
    const fetchData = async () => {
      await refreshFavorites();
      await getFavoritesCategories();
      setIsLoading(false);
    };
    fetchData();
    // setIsLoading(false);
  }, []);

  useEffect(() => {
    getFavoritesCategories();
  }, [favoriteItems]);

  // update filtered favorites when favorites or selectedCategory changes
  useEffect(() => {
    if (selectedCategory === null) {
      // if no category is selected, show all items
      setFilteredItems(favoriteItems);
    } else {
      // filter favorites by the selected category id
      const filtered = favoriteItems.filter(
        (item) => Number(item.category) === Number(selectedCategory)
      );
      setFilteredItems(filtered);
    }
  }, [favoriteItems, selectedCategory]);
  // get all the favorites item categories
  const getFavoritesCategories = async () => {
    try {
      const cleanToken = authToken?.trim();
      const URL = `http://127.0.0.1:8000/api/items/favorites_categories/`;
      const response = await axios.get(URL, {
        headers: {
          Authorization: `Bearer ${cleanToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      setCategories(response.data);
    } catch (error) {
      console.log("Error getting favorites categories...", error);
    }
  };
  // handle favorite toggle button click
  const handleFavoriteToggle = async (itemId: number) => {
    // Store the item's category before removing it
    const itemToRemove = favoriteItems.find((item) => item.id === itemId);
    const categoryOfRemovedItem = itemToRemove?.category;
    await toggleFavorite(itemId);
    // Refresh categories after toggling the favorite
    // This ensures we have the latest data
    await getFavoritesCategories();
  };
  // handle category selection
  const handleCategorySelect = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
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
      <ProductList
        items={filteredItems}
        isLoading={isLoading}
        onFavoriteToggle={handleFavoriteToggle}
      />
    </>
  );
};
export default FavoritesScreen;
