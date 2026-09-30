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
          <Slot />
        </AuthProvider>
      </PaperProvider>
  )
}