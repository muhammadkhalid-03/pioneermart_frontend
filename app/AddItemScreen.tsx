import React, { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import {
  Alert,
  ScrollView,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { BASE_URL } from "@/config";
import { router } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import { useAuth } from "./contexts/AuthContext";
import { UserInfo } from "@/types/types";

const CATEGORIES = [
  { label: "Electronics", value: "electronics", id: 3 },
  { label: "Clothing", value: "clothing", id: 7 },
  { label: "Books", value: "books", id: 4 },
  { label: "Furniture", value: "furniture", id: 1 },
  { label: "Fitness", value: "fitness", id: 5 },
  { label: "Health", value: "health", id: 6 },
  { label: "Other", value: "other", id: 8 },
];

const AddItemScreen = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "other",
  });
  const [image, setImage] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<UserInfo>();
  const { authToken } = useAuth();

  const updateFormField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    if (!authToken) {
      Alert.alert("Error", "You must be logged in to add items.");
      router.back();
      return;
    }

    try {
      const cleanToken = authToken.trim();
      const response = await axios.get(`${BASE_URL}/api/users/`, {
        headers: {
          Authorization: `Bearer ${cleanToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (response.data && response.data.length > 0) {
        setUserData(response.data[0]);
      } else {
        Alert.alert("Error", "No user data found.");
      }
    } catch (error) {
      console.error("Error getting user profile:", error);
      Alert.alert("Error", "Failed to load profile. Please try again.");
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Please allow access to your photo library"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImage(result.assets[0].uri);
    }
  };

  const validateForm = () => {
    const { name, price } = formData;
    if (!name || !price || !image) {
      Alert.alert(
        "Missing information",
        "Please fill out all required fields and add an image"
      );
      return false;
    }
    return true;
  };

  const createFormData = () => {
    const { name, description, price, category } = formData;
    const formDataObj = new FormData();

    formDataObj.append("title", name);
    formDataObj.append("description", description);
    formDataObj.append("price", price);
    // Find the matching category object and send its ID instead of string value
    const selectedCategory = CATEGORIES.find((cat) => cat.value === category);
    formDataObj.append(
      "category",
      selectedCategory ? selectedCategory.id.toString() : "8"
    ); // Default to "Other" (8) if not found
    if (userData !== undefined) {
      formDataObj.append("seller", userData.id.toString());
    }

    if (image) {
      const imageFileName = image.split("/").pop() || "image.jpg";
      const imageType = imageFileName.endsWith("png")
        ? "image/png"
        : "image/jpeg";

      formDataObj.append("image", {
        uri: image,
        name: imageFileName,
        type: imageType,
      } as unknown as Blob);
    }

    return formDataObj;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      if (!userData) {
        await getProfile();
      }

      const formDataObj = createFormData();
      const cleanToken = authToken?.trim();

      await axios.post(`${BASE_URL}/api/items/create_item/`, formDataObj, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${cleanToken}`,
        },
      });

      Alert.alert("Success", "Item added successfully");
      router.back();
    } catch (error) {
      console.error("Error submitting item:", error);
      Alert.alert("Error", "Could not add item. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Add New Item</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Name *</Text>
        <TextInput
          style={styles.input}
          value={formData.name}
          onChangeText={(text) => updateFormField("name", text)}
          placeholder="Item name"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          value={formData.description}
          onChangeText={(text) => updateFormField("description", text)}
          placeholder="Item Description"
          multiline
          numberOfLines={4}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Price *</Text>
        <TextInput
          style={styles.input}
          value={formData.price}
          onChangeText={(text) => updateFormField("price", text)}
          placeholder="0.00"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Category</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.category}
            onValueChange={(value) => updateFormField("category", value)}
          >
            {CATEGORIES.map((cat) => (
              <Picker.Item
                key={cat.value}
                label={cat.label}
                value={cat.value}
              />
            ))}
          </Picker>
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Image *</Text>
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <Text style={styles.imagePickerText}>Tap to select an image</Text>
          )}
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Save Item</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textarea: {
    height: 100,
    textAlignVertical: "top",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
  },
  imagePicker: {
    height: 200,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imagePickerText: {
    color: "#777",
  },
  button: {
    backgroundColor: "#007BFF",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginVertical: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AddItemScreen;
