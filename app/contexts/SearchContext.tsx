import { ItemType } from "@/types/types";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import axios from "axios";

type SearchContextType = {
  searchQuery: string;
  searchResults: ItemType[] | null;
  filteredResults: ItemType[] | null; // results after any client-side category filtering
  selectedCategory: number | null;
  isLoading: boolean;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: number | null) => void;
  performSearch: (query: string) => Promise<void>;
  toggleCategory: (category: number) => void;
  clearSearch: () => void;
  clearCategories: () => void;
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ItemType[]>([]);
  const [filteredResults, setFilteredResults] = useState<ItemType[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { authToken } = useAuth();

  const performSearch = async (query: string) => {
    setSearchQuery(query);
    setIsLoading(true);
    try {
      // calling the search_items endpoint to perform a search query on the backend of items
      const cleanToken = authToken?.trim();
      const response = await axios.get(
        `http://127.0.0.1:8000/api/items/search_items/`,
        {
          headers: {
            Authorization: `Bearer ${cleanToken}`,
            "Content-Type": "application/json",
          },
          params: {
            q: query,
          },
        }
      );
      setSearchResults(response.data); // setting searchresults properly
      applyFilters(response.data); // apply existing category filters
    } catch (error) {
      console.error("Error fetching search results:", error);
      setSearchResults([]);
      setFilteredResults([]);
    } finally {
      setIsLoading(false); // set loading to false in any case after either API call successfull or error
    }
  };

  // function to update filteredResults
  const applyFilters = (results: ItemType[]) => {
    if (selectedCategory === null) {
      // if 'All' category is selected, selectedCategory is null so show all
      setFilteredResults(results);
    } else {
      // filter items by category
      const filtered = results.filter(
        (item) => Number(item.category) === selectedCategory
      );
      setFilteredResults(filtered); // set the filtered results
    }
  };

  // Update filtered results when categories change
  useEffect(() => {
    applyFilters(searchResults);
  }, [selectedCategory, searchResults]);

  // when the user clicks a category this will set the selectedCategory to the category NUMBER
  const toggleCategory = (category: number) => {
    setSelectedCategory(category);
  };

  // clear the search results by emptying search query & all arrays
  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setFilteredResults([]);
  };

  // this will trigger the useEffect to update filteredResults because selectedCategory is a dependency for the useEffect
  const clearCategories = () => {
    setSelectedCategory(null);
  };

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        searchResults,
        filteredResults,
        selectedCategory,
        isLoading,
        setSearchQuery,
        setSelectedCategory,
        performSearch,
        toggleCategory, // toggled category NUMBER
        clearSearch,
        clearCategories,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
};
export default function SearchContextComponent() {
  return <></>; //satisfy the requirement for a component with empty fragment
}
