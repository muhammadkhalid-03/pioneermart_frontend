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
      <TouchableOpacity style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchTxt}
          placeholder="Search items..."
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.searchIcon}>
          <EvilIcons
            name="search"
            size={24}
            onPress={handleSearch}
            color="black"
          />
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  searchBarContainer: {
    width: "90%",
    alignSelf: "center",
    backgroundColor: "#D3D3D3",
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "center",
    borderRadius: 15,
    alignItems: "center",
    marginTop: 20,
  },
  searchTxt: {
    flex: 1,
    paddingVertical: 8,
    color: "black",
  },
  searchIcon: {
    padding: 5,
  },
});

export default SearchBar;
