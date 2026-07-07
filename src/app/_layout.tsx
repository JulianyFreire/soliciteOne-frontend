import "../styles/global.css"; 
import { Slot } from "expo-router";
import { useFonts } from "expo-font";
import {
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold
} from "@expo-google-fonts/poppins"
import { AuthProvider } from "../contexts/AuthContext";

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
      <AuthProvider>
        <Slot />
      </AuthProvider>
  )
}
