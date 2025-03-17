import { Entypo } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";

const PurchaseRequests = () => {
  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Purchase Requests",
          headerTitleAlign: "center",
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity
              style={{ padding: 8 }}
              onPress={() => router.back()}
            >
              <Entypo name="chevron-left" size={24} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
    </>
  );
};

export default PurchaseRequests;
