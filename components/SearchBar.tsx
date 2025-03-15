import React, { useState } from "react";
import { TextInput, View, StyleSheet, TouchableOpacity } from "react-native";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { useSearch } from "../app/contexts/SearchContext";

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState("");
  const { performSearch } = useSearch();

  const handleSearch = () => {
    performSearch(query);
  };
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
