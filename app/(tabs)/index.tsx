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
import { BASE_URL } from "@/config";
import { useItemsStore } from "@/stores/useSearchStore";

const HomeScreen = () => {
  const { screens, setActiveScreen, loadItems, loadCategories, categories } =
    useItemsStore();

  const screenId = "home";
  const { filteredItems, isLoading } = screens[screenId];

  const { authToken } = useAuth(); //auth context

  // Load items and categories when component mounts
  useEffect(() => {
    setActiveScreen(screenId);
    loadItems(screenId, authToken || "");
    loadCategories(authToken || "");
  }, [authToken]);
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          header: () => <Header screenId={screenId} />,
        }}
      />
      <Categories screenId={screenId} categories={categories} />
      <ProductList items={filteredItems} isLoading={isLoading} />
    </>
  );
};

export default HomeScreen;
