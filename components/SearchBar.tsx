import React, { useState, useEffect } from "react";
import { TextInput, View, StyleSheet, TouchableOpacity } from "react-native";
import axios from "axios";
import { useAuth } from "../app/contexts/AuthContext";
import ProductList from "./ProductList";
import { ItemType } from "@/types/types";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { useSearch } from "../app/contexts/SearchContext";
// import { debounce } from "lodash"; // Install lodash for debouncing

// interface SearchBarProps {
//   onSearch: (results: ItemType[]) => void;
// }

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState("");
  const { performSearch, isLoading } = useSearch();

  const handleSearch = () => {
    performSearch(query);
  };
  // const [results, setResults] = useState<ItemType[]>([]); // 10x searching
  const { authToken } = useAuth();

  // // function to fetch search results 10x
  // const fetchSearchResults = async (searchQuery: string) => {
  //   if (!searchQuery) {
  //     setResults([]); // Clear results if query is empty
  //     return;
  //   }
  //   try {
  //     const cleanToken = authToken?.trim();
  //     const response = await axios.get(
  //       `http://127.0.0.1:8000/api/items/search_items/`,
  //       {
  //         params: { q: searchQuery },
  //         headers: {
  //           Authorization: `Bearer ${cleanToken}`,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );
  //     setResults(response.data);
  //     onSearch(results)
  //   } catch (error) {
  //     console.error("Error fetching search results:", error);
  //     setResults([]); // Clear results if error occurs
  //     onSearch([]); // Clear results if error occurs
  //   }
  // };

  // const handleSearch = async () => {
  //   try {
  //     const cleanToken = authToken?.trim();
  //     const response = await axios.get(
  //       `http://127.0.0.1:8000/api/items/search_items/`,
  //       {
  //         params: { q: query },
  //         headers: {
  //           Authorization: `Bearer ${cleanToken}`,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );
  //     onSearch(response.data);
  //   } catch (error) {
  //     console.error("Error fetching search results:", error);
  //     onSearch([]); // Clear results if error occurs
  //   }
  // };

  // // this is for 10x searching if we're loaded and can afford a billion API calls per second
  // const debouncedSearch = debounce(fetchSearchResults, 300);

  // // this is for 10x searching if we're loaded and can afford a billion API calls per second
  // useEffect(() => {
  //   debouncedSearch(query);
  //   return () => debouncedSearch.cancel(); // Cleanup debounce on unmount
  // }, [query]);

  return (
    <View>
      <TouchableOpacity style={styles.searchBar}>
        <TextInput
          style={styles.searchTxt}
          placeholder="Search items..."
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
        />
        <EvilIcons
          name="search"
          size={20}
          onPress={handleSearch}
          color="black"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  searchBar: {
    flex: 1,
    backgroundColor: "#D3D3D3",
    paddingVertical: 4,
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "center",
    borderRadius: 15,
  },
  searchTxt: {
    color: "black",
  },
});

export default SearchBar;
