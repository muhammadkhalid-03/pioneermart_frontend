import { AuthContextType } from "@/app/contexts/AuthContext";
import { BASE_URL } from "@/config";
import { ItemType } from "@/types/types";
import axios from "axios";
import { create } from "zustand";

type ScreenId = "home" | "myItems" | "favorites";

// interface for the state and actions of each screen
interface ScreenState {
  items: ItemType[]; //all the items that could appear on the screen
  filteredItems: ItemType[]; //items that actually appear on the screen
  searchQuery: string; //query used to search thru items on a page
  selectedCategory: number | null; //category filter
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
  setIsReturningFromDetails: (value: boolean) => void;
  setActiveScreen: (screenId: ScreenId) => void;

  //data loading stuff
  isReturningFromDetails: boolean;
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
  isReturningFromDetails: false,
  setIsReturningFromDetails: (value) => set({ isReturningFromDetails: value }),

  //set active screen
  setActiveScreen: (screenId) => set({ activeScreen: screenId }),

  /**
   * Function to refresh items on screen.
   * @param {ScreenId} screenId - The screen that we want the items for
   * @param {string} authToken - User's authentication token to be provided in axios request
   * @example
   *  await refreshItems('home', authToken (from useAuth Context))
   */
  refreshItems: async (screenId: ScreenId, authToken: string) => {
    const currentScreen = get().screens[screenId]; //get the current using screenId
    const now = Date.now(); //get current time

    // Only refresh if it's been more than 60 seconds since last update or if no items exist
    if (
      now - currentScreen.lastUpdated < 60000 &&
      currentScreen.items.length > 0
    ) {
      return;
    }
    // Update loading state for a specific screen
    set((state) => ({
      //takes the current state as parameter
      screens: {
        ...state.screens, //create a shallow copy of the screens object
        [screenId]: {
          ...state.screens[screenId], //create a shallow copy of the specified screen
          isLoading: true, //set isLoading to true on that screen
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

      const cleanToken = authToken?.trim(); //trim to ensure token is correct
      const response = await axios.get(`${BASE_URL}/${endpoint}`, {
        //api call
        headers: {
          Authorization: `Bearer ${cleanToken}`,
          "Content-Type": "application/json",
        },
        // Add cache-busting parameter to ensure that we aren't using previously stored data
        params: { _t: Date.now() },
      });

      set((state) => ({
        //take state of screens
        screens: {
          ...state.screens, //create shallow copy of screens object
          [screenId]: {
            ...state.screens[screenId], //create shallow copy of specific screen
            items: response.data, //set items on that screen to response.data
            filteredItems:
              //if category is null, return everything else return matching items for our screen
              state.screens[screenId].selectedCategory === null //represents 'All' option in category bar
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

  /**
   * Function to load items on a specified screen when initially rendering the screen.
   * @param {ScreenId} screenId - The screen that we want the items for
   * @param {string} authToken - User's authentication token to be provided in axios request
   * @example
   *  loadItems(screenId, authToken || "");
   */
  loadItems: async (screenId: ScreenId, authToken: string) => {
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
      // console.log(response.data);
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

  /**
   * Function to load categories on a specified screen when initially rendering the screen. It loads all the categories in database
   * @param {string} authToken - User's authentication token to be provided in axios request
   * @example
   *  loadCategories(screenId, authToken || "");
   */
  loadCategories: async (authToken: string) => {
    try {
      const cleanToken = authToken?.trim();
      const response = await axios.get(`${BASE_URL}/api/categories/`, {
        headers: {
          Authorization: `Bearer ${cleanToken}`,
          "Content-Type": "application/json",
        },
      });
      set({ categories: response.data });
    } catch (error) {
      set({ categories: [] });
    }
  },

  /**
   * Function to search for items on a specified screen
   * @param {ScreenId} screenId - The screen that we want the items for
   * @param {string} query - User's search query
   * @param {AuthContextType} authToken - User's authentication token to be provided in axios request
   * @example
   *  performSearch(screenId, localQuery, authToken || null);
   */
  performSearch: async (
    screenId: ScreenId,
    query: string,
    authToken: AuthContextType
  ) => {
    //update search query and loading state
    set((state) => ({
      screens: {
        ...state.screens,
        [screenId]: {
          ...state.screens[screenId],
          searchQuery: query, //need this line cause otherwise it'll keep the same search query for all screens
          isLoading: true,
        },
      },
    }));

    try {
      const cleanToken = authToken.authToken?.trim(); //authToken is AuthContextType, it has a string field authToken which we want

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
        params, //includes the search query defined above
      });
      const results = response.data;
      //get the selected category for the current screen so that the selected category applies to search results as well
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

  /**
   * Function to filter items by category
   * @param {ScreenId} screenId - The screen that we want the items for
   * @param {number} categoryId - The category that we want to filter for
   * @example
   *  filterByCategory(screenId, category.id)
   */
  filterByCategory: (screenId: ScreenId, categoryId: number | null) => {
    const state = get(); //get the current state
    const screenState = state.screens[screenId];

    // Update selected category
    set((state) => ({
      screens: {
        ...state.screens,
        [screenId]: {
          ...state.screens[screenId],
          selectedCategory: categoryId, //
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

  /**
   * Function to clear the search results.
   * @param {ScreenId} screenId - The screen that we want to clear the items for
   * @example
   *  clearSearch(screenId);
   */
  clearSearch: (screenId: ScreenId) => {
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

  /**
   * Function to make an item a favorite
   * @param {number} itemId - The item that needs to be favorited
   * @param {string} authToken - User's authentication token
   * @example
   *  await toggleFavorite(item.id, authToken || "");
   */
  toggleFavorite: async (itemId: number, authToken: string) => {
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

      // mark is_favorited property of item if id matches. This just finds the item to favorite and updates on the frontend for user
      const homeScreenItems = get().screens.home.items.map((item) =>
        item.id === itemId
          ? { ...item, is_favorited: !item.is_favorited } //conditional
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
      get().loadItems("home", authToken); //reload home screen after toggling
      //reload favorites after toggling
      get().loadItems("favorites", authToken);
    } catch (error) {
      console.log("Error toggling favorite:", error);
    }
  },
}));
