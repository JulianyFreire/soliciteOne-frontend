import "../styles/global.css";
import { Slot } from "expo-router";
import { useFonts } from "expo-font";
import {
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold
} from "@expo-google-fonts/poppins"
import { PaperProvider, MD3LightTheme } from "react-native-paper";
import { AuthProvider } from "../contexts/AuthContext";
import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { useRouter, useSegments } from "expo-router";

const paperTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#1E3A8A",
    secondary: "#90CAF9",
    surface: "#FFFFFF",
    background: "#F5F6F8",
  },
};

function RouteGate() {
  const { isLoggedIn, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const currentRoute = segments[0];
  const isPublicRoute = ["login", "register", "recovery", "newPassword"].includes(currentRoute);

  useEffect(() => {
    if (loading) return;
    if (!isLoggedIn && !isPublicRoute) router.replace("/login");
    if (isLoggedIn && isPublicRoute) router.replace("/");
  }, [isLoggedIn, isPublicRoute, loading, router]);

  if (loading || (!isLoggedIn && !isPublicRoute)) {
    return <View className="flex-1 items-center justify-center bg-background"><ActivityIndicator color="#1E3A8A" /></View>;
  }
  return <Slot />;
}

export default function Layout() {

  const [fontsLoaded] = useFonts({
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold
  })

  if (!fontsLoaded) {
    return null
  }

  return (
      <PaperProvider theme={paperTheme}>
        <AuthProvider>
          <RouteGate />
        </AuthProvider>
      </PaperProvider>
  )
}
