import { Text, View } from "react-native";
import { Navbar } from "../components/navbar";

export default function Cadastro() {
    return (
        <View className="flex-1 items-center justify-center">
            <Text>Perfil</Text>
            <Navbar />
        </View>
    );
}