import { View, Text } from "react-native";
import { Header } from "../components/Header";
import { NavbarGestao } from "../components/Navbar";

export default function Financeiro() {
    return (
        <View className="flex-1 bg-background">
            <Header title="Financeiro" />
            <View className="flex-1 items-center justify-center">
                <Text className="text-gray-400">Tela em construção</Text>
            </View>
            <NavbarGestao />
        </View>
    );
}