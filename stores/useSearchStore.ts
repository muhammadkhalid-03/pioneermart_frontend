import { AuthContextType } from "@/app/contexts/AuthContext";
import { BASE_URL } from "@/config";
import { ItemType } from "@/types/types";
import axios from "axios";
import { create } from "zustand";

type ScreenId = "home" | "myItems" | "favorites";

// interface for the state and actions of each screen
interface ScreenState {
  items: ItemType[];
  filteredItems: ItemType[];
  searchQuery: string;
  selectedCategory: number | null;
  isLoading: boolean;
  lastUpdated: number; // Timestamp to track when data was last refreshed
}

//main store interface
interface ItemsStoreState {
  //screen specific states
  screens: Record<ScreenId, ScreenState>; //don't really know what this is but ok
  activeScreen: ScreenId;
  categories: Array<{ id: number; name: string }>;
  refreshItems: (screenId: ScreenId, authToken: string) => Promise<void>; // New function to force refresh

  //actions
  setActiveScreen: (screenId: ScreenId) => void;

  //data loading stuff
  loadItems: (screenId: ScreenId, authToken: string) => Promise<void>;
  loadCategories: (authToken: string) => Promise<void>;

  //search actions
  performSearch: (
    screenId: ScreenId,
    query: string,
    authToken: AuthContextType
  ) => Promise<void>;
  filterByCategory: (screenId: ScreenId, categoryId: number | null) => void;
  clearSearch: (screenId: ScreenId) => void;

  //toggling favorites function
  toggleFavorite: (itemId: number, authToken: string) => Promise<void>;
}

//initial state for a screen
const initialScreenState: ScreenState = {
  items: [],
  filteredItems: [],
  searchQuery: "",
  selectedCategory: null,
  isLoading: false,
  lastUpdated: 0,
};

export const useItemsStore = create<ItemsStoreState>((set, get) => ({
  //initial states
  screens: {
    home: { ...initialScreenState },
    favorites: { ...initialScreenState },
    myItems: { ...initialScreenState },
  },
  activeScreen: "home",
  categories: [],

  //set active screen
  setActiveScreen: (screenId) => set({ activeScreen: screenId }),

  refreshItems: async (screenId: ScreenId, authToken: string) => {
    // Update loading state for a specific screen
    set((state) => ({
      screens: {
        ...state.screens,
        [screenId]: {
          ...state.screens[screenId],
          isLoading: true,
        },
      },
    }));

    try {
      let endpoint = "";
      // Different endpoints based on screen
      if (screenId === "home") {
        endpoint = "api/items/";
      } else if (screenId === "favorites") {
        endpoint = "api/items/favorites/";
      } else {
        endpoint = "api/items/my_items/";
      }

      const cleanToken = authToken?.trim();
      const response = await axios.get(`${BASE_URL}/${endpoint}`, {
        headers: {
          Authorization: `Bearer ${cleanToken}`,
          "Content-Type": "application/json",
        },
        // Add cache-busting parameter
        params: { _t: Date.now() },
      });

      set((state) => ({
        screens: {
          ...state.screens,
          [screenId]: {
            ...state.screens[screenId],
            items: response.data,
            filteredItems:
              state.screens[screenId].selectedCategory === null
                ? response.data
                : response.data.filter(
                    (item: ItemType) =>
                      Number(item.category) ===
                      state.screens[screenId].selectedCategory
                  ),
            isLoading: false,
            lastUpdated: Date.now(),
          },
        },
      }));
    } catch (error) {
      console.error(`Error refreshing items for ${screenId}:`, error);

      // Set loading to false on error
      set((state) => ({
        screens: {
          ...state.screens,
          [screenId]: {
            ...state.screens[screenId],
            isLoading: false,
          },
        },
      }));
    }
  },

  //load items for a specific screen
  loadItems: async (screenId, authToken) => {
    const currentScreen = get().screens[screenId];
    const now = Date.now();
    if (
      now - currentScreen.lastUpdated < 2000 &&
      currentScreen.items.length > 0
    ) {
      return;
    }
    //update loading state for a specific screen
    set((state) => ({
      screens: {
        ...state.screens,
        [screenId]: {
          ...state.screens[screenId],
          isLoading: true,
        },
      },
    }));
    try {
      let endpoint = "";
      //different endpoints based on screen
      if (screenId === "home") {
        endpoint = "api/items/";
      } else if (screenId == "favorites") {
        endpoint = "api/items/favorites/";
      } else {
        endpoint = "api/items/my_items/";
      }

      const cleanToken = authToken?.trim();
      const response = await axios.get(`${BASE_URL}/${endpoint}`, {
        headers: {
          Authorization: `Bearer ${cleanToken}`,
          "Content-Type": "application/json",
        },
      });
      set((state) => ({
        screens: {
          ...state.screens,
          [screenId]: {
            ...state.screens[screenId],
            items: response.data,
            filteredItems: response.data,
            isLoading: false,
          },
        },
      }));
      console.log(response.data);
    } catch (error) {
      console.error(`Error loading items for ${screenId}:`, error);

      //clear items and set loading to false on error
      set((state) => ({
        screens: {
          ...state.screens,
          [screenId]: {
            ...state.screens[screenId],
            items: [],
            filteredItems: [],
            isLoading: false,
          },
        },
      }));
    }
  },

  //load categories (shared across screens)
  loadCategories: async (authToken) => {
    try {
      const cleanToken = authToken?.trim();
      const response = await axios.get(`${BASE_URL}/api/categories/`, {
        headers: {
          Authorization: `Bearer ${cleanToken}`,
          "Content-Type": "application/json",
        },
      });
      console.log("\n\nCategory:", response.data);
      set({ categories: response.data });
    } catch (error) {
      set({ categories: [] });
    }
  },

  //perform search for a specific screen
  performSearch: async (screenId, query, authToken) => {
    //update search query and loading state
    set((state) => ({
      screens: {
        ...state.screens,
        [screenId]: {
          ...state.screens[screenId],
          searchQuery: query,
          isLoading: true,
        },
      },
    }));

    try {
      const cleanToken = authToken.authToken?.trim();

      //different endpoints based on screen
      let endpoint = "api/items/search_items/";
      let params: Record<string, string> = { q: query }; //query to include in the request

      if (screenId === "favorites") {
        endpoint = "api/items/search_favorites/";
      } else if (screenId === "myItems") {
        endpoint = "api/items/search_my_items/";
      }
      console.log("This is the endpoint:", endpoint);
      const response = await axios.get(`${BASE_URL}/${endpoint}`, {
        headers: {
          Authorization: `Bearer ${cleanToken}`,
          "Content-Type": "application/json",
        },
        params,
      });
      const results = response.data;
      const { selectedCategory } = get().screens[screenId];

      //filter results by category if one is selected
      const filteredResults =
        selectedCategory === null
          ? results
          : results.filter(
              (item: ItemType) => Number(item.category) === selectedCategory
            );

      //update state with search results
      set((state) => ({
        screens: {
          ...state.screens,
          [screenId]: {
            ...state.screens[screenId],
            items: results,
            filteredItems: filteredResults,
            isLoading: false,
          },
        },
      }));
    } catch (error) {
      console.error(`Error searching items for ${screenId}:`, error);
      // Clear items and set loading to false on error
      set((state) => ({
        screens: {
          ...state.screens,
          [screenId]: {
            ...state.screens[screenId],
            isLoading: false,
          },
        },
      }));
    }
  },

  // Filter by category for a specific screen
  filterByCategory: (screenId, categoryId) => {
    const state = get(); //get the current state
    const screenState = state.screens[screenId];

    // Update selected category
    set((state) => ({
      screens: {
        ...state.screens,
        [screenId]: {
          ...state.screens[screenId],
          selectedCategory: categoryId,
        },
      },
    }));

    //apply category filter
    if (categoryId === null) {
      // Show all items if no category selected
      set((state) => ({
        screens: {
          ...state.screens,
          [screenId]: {
            ...state.screens[screenId],
            filteredItems: screenState.items,
          },
        },
      }));
    } else {
      //filter items by category
      const filtered = screenState.items.filter(
        (item) => Number(item.category) === categoryId
      );

      set((state) => ({
        screens: {
          ...state.screens,
          [screenId]: {
            ...state.screens[screenId],
            filteredItems: filtered,
          },
        },
      }));
    }
  },
  clearSearch: (screenId) => {
    const state = get();
    // Reset search query
    set((state) => ({
      screens: {
        ...state.screens,
        [screenId]: {
          ...state.screens[screenId],
          searchQuery: "",
        },
      },
    }));

    //reload initial items for the screen
    get().loadItems(screenId, ""); //empty token will be replaced with real one in the component
  },

  //toggle favorite status of an item (specific to home screen)
  toggleFavorite: async (itemId, authToken) => {
    try {
      const cleanToken = authToken?.trim();
      const URL = `${BASE_URL}/api/items/${itemId}/toggle_favorite/`;
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

      //update both home and favorites screens
      //first update home screen items
      const homeScreenItems = get().screens.home.items.map((item) =>
        item.id === itemId
          ? { ...item, is_favorited: !item.is_favorited }
          : item
      );

      //update home screen state
      set((state) => ({
        //take the current state as parameter
        screens: {
          //entire thing updates screens object within the state
          ...state.screens, //creates a copy of existing screens object
          home: {
            ...state.screens.home, //creates a copy of the existing home object to update it
            items: homeScreenItems, //sets items property of home screen's state to homeScreenItems
            filteredItems:
              state.screens.home.selectedCategory === null
                ? homeScreenItems
                : homeScreenItems.filter(
                    (item) =>
                      Number(item.category) ===
                      state.screens.home.selectedCategory
                  ),
          },
        },
      }));

      //reload favorites after toggling
      get().loadItems("favorites", authToken);
    } catch (error) {
      console.log("Error toggling favorite:", error);
    }
  },
}));
