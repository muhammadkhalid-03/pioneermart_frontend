import React, { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { CategoryType, ItemType } from "@/types/types";
import axios from "axios";
import Header from "@/components/Header";
import ProductList from "@/components/ProductList";
import Categories from "@/components/Categories";
import { useAuth } from "../contexts/AuthContext";
import { useFavorites } from "../contexts/FavoritesContext";
import { useSearch } from "../contexts/SearchContext";

const HomeScreen = () => {
  const [items, setItems] = useState<ItemType[]>([]);
  const [filteredItems, setFilteredItems] = useState<ItemType[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);

  const { authToken } = useAuth(); //auth context
  const { favoriteIds, toggleFavorite, isFavorite } = useFavorites(); //favorites context
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
    getCategories();
    getProducts();
  }, []);

  //this will run every time favoriteIds changes i.e when a new id is added or removed
  useEffect(() => {
    if (items.length > 0 && favoriteIds.length >= 0) {
      updateItemsWithFavoriteStatus();
    }
  }, [favoriteIds]);

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

  const updateItemsWithFavoriteStatus = () => {
    const updatedItems = items.map((item) => ({
      ...item,
      is_favorite: isFavorite(item.id), //isFavorite is a context function that just checks if the item is in the favorites context list
    }));
    setItems(updatedItems); //update the items initially

    // also update filtered favorited items if user presses on a favorited item category frontend
    const updatedFilteredItems = filteredItems.map((item) => ({
      ...item,
      is_favorite: isFavorite(item.id), //isFavorite is a context function that just checks if the item is in the favorites context list
    }));
    setFilteredItems(updatedFilteredItems); //update the filtered items
  };

  const getProducts = async () => {
    try {
      const cleanToken = authToken?.trim();
      const URL = `http://127.0.0.1:8000/api/items/`;
      const response = await axios.get(URL, {
        headers: {
          Authorization: `Bearer ${cleanToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      // If we already have favorites, mark the items
      const itemsData = response.data.map((item: ItemType) => ({
        ...item,
        is_favorite: isFavorite(item.id),
      }));

      setItems(itemsData);
      setFilteredItems(itemsData);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const getCategories = async () => {
    try {
      const cleanToken = authToken?.trim();
      const URL = `http://127.0.0.1:8000/api/categories/`;
      const response = await axios.get(URL, {
        headers: {
          Authorization: `Bearer ${cleanToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleCategorySelect = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    if (categoryId === null) {
      clearCategories();
      console.log("\n\nSelected category:", selectedCategory);
    } else {
      toggleCategory(categoryId);
    }
  };

  // handle favorite toggle using the context
  const handleFavoriteToggle = async (itemId: number) => {
    await toggleFavorite(itemId);

    // The UI will update automatically via the useEffect that watches favoriteIds
  };

  const displayItems =
    filteredResults && filteredResults.length > 0
      ? filteredResults.map((item) => ({
          ...item,
          is_favorite: isFavorite(item.id),
        }))
      : items;

  // Add this useEffect to mark search results with favorite status
  useEffect(() => {
    if (filteredResults && filteredResults.length > 0) {
      // Update the search results with favorite status
      const updatedSearchResults = filteredResults.map((item) => ({
        ...item,
        is_favorite: isFavorite(item.id),
      }));
    }
  }, [filteredResults, favoriteIds]);

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
        items={itemsToDisplay}
        isLoading={isLoading}
        onFavoriteToggle={handleFavoriteToggle}
      />
    </>
  );
};

export default HomeScreen;
