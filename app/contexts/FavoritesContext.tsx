import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { ItemType } from "@/types/types";
import { useAuth } from "./AuthContext";
type FavoritesContextType = {
  favoriteIds: number[];
  favoriteItems: ItemType[];
  refreshFavorites: () => Promise<void>;
  toggleFavorite: (itemId: number) => Promise<void>;
  isFavorite: (itemId: number) => boolean;
};
const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);
export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [favoriteItems, setFavoriteItems] = useState<ItemType[]>([]);
  const { authToken } = useAuth();
  useEffect(() => {
    if (authToken) {
      refreshFavorites();
    }
  }, [authToken]);
  const refreshFavorites = async () => {
    try {
      const cleanToken = authToken?.trim();
      const URL = `http://127.0.0.1:8000/api/items/favorites/`;
      const response = await axios.get(URL, {
        headers: {
          Authorization: `Bearer ${cleanToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      // Ensure all items have is_favorite set to true
      const itemsWithFavoriteFlag = response.data.map((item: ItemType) => ({
        ...item,
        is_favorite: true,
      }));
      setFavoriteItems(response.data);
      // Extract just the IDs of favorite items
      const ids = response.data.map((item: ItemType) => item.id);
      setFavoriteIds(ids);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };
  const toggleFavorite = async (itemId: number) => {
    try {
      const cleanToken = authToken?.trim();
      const URL = `http://127.0.0.1:8000/api/items/${itemId}/toggle_favorite/`;
      await axios.post(
        URL,
        {},
        {
          headers: {
            Authorization: `Bearer ${cleanToken}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      await refreshFavorites(); //extra reliability to refresh favorites from server after toggling
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };
  const isFavorite = (itemId: number): boolean => {
    return favoriteIds.includes(itemId);
  };
  return (
    <FavoritesContext.Provider
      value={{
        favoriteIds,
        favoriteItems,
        refreshFavorites,
        toggleFavorite,
        isFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};
export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};
export default function FavoritesContextComponent() {
  return <></>; //satisfy the requirement for a component with empty fragment
}
