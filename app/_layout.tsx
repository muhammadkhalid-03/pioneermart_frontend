import { useFonts } from "expo-font";
import { router, Stack, usePathname } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { AuthProvider } from "./contexts/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useSingleItemStore from "@/stores/singleItemStore";
import { AppInitialier } from "@/components/AppInitializer";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const { setShowFavoritesIcon } = useSingleItemStore();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        router.replace("/(auth)");
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (!pathname.includes("MyItems") && !pathname.includes("ItemDetails")) {
      setShowFavoritesIcon(true);
    }
  }, [pathname]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      {/* <SearchProvider> */}
      <AppInitialier />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="ItemDetails" options={{ headerShown: true }} />
      </Stack>
      {/* </SearchProvider> */}
    </AuthProvider>
  );
}
