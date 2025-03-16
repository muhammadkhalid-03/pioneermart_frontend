import { useFonts } from "expo-font";
import { router, Stack, usePathname } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { AuthProvider } from "./contexts/AuthContext";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import { SearchProvider } from "./contexts/SearchContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useSingleItemStore from "@/stores/singleItemStore";

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
        router.replace("/signin");
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (!pathname.includes("MyItems") && !pathname.includes("ItemDetails")) {
      setShowFavoritesIcon(true);
    }
    console.log("Pathname:", pathname);
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
      <SearchProvider>
        <FavoritesProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="signin" options={{ presentation: "modal" }} />
            <Stack.Screen name="signup" options={{ presentation: "modal" }} />
            <Stack.Screen name="ItemDetails" options={{ headerShown: true }} />
          </Stack>
        </FavoritesProvider>
      </SearchProvider>
    </AuthProvider>
  );
}
