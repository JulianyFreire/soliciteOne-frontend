import { Text, View } from "react-native";
import { Navbar } from "../components/navbar";

export default function Pedidos() {
    return (
        <View className="flex-1 items-center justify-center">
            <Text>Pedidos</Text>
            <Navbar />
        </View>
    );
}