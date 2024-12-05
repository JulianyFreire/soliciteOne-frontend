import "../styles/global.css"; 
import { Slot } from "expo-router";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold
} from "@expo-google-fonts/poppins"

export default function Layout() {

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold
  })

  if (!fontsLoaded) {
    return null
  }

  return (
      <Slot />
  )
}
