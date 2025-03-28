import React, { useEffect } from "react";
import ProductList from "@/components/ProductList";
import Categories from "@/components/Categories";
import { Stack } from "expo-router";
import Header from "@/components/Header";
import { useAuth } from "../contexts/AuthContext";
import { useItemsStore } from "@/stores/useSearchStore";

const FavoritesScreen = () => {
  const { screens, setActiveScreen, loadItems, loadCategories, categories } =
    useItemsStore();
  const { authToken } = useAuth();

  const screenId = "favorites"; // current screen state
  const { filteredItems, isLoading } = screens[screenId];

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
      <ProductList
        items={filteredItems}
        isLoading={isLoading}
        source={"favorites"}
      />
    </>
  );
};
export default FavoritesScreen;
