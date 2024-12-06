import { Link } from "expo-router";
import { Image, Text, View, TouchableOpacity } from "react-native";

export function Destaques() {
    return (
        <View className="mx-auto rounded-xl p-4 shadow-md bg-neutral-50">
            <View className="flex-row items-center justify-around">
                <Image 
                    source={require('../assets/Icons/Broom.png')}
                />
                <Text className="text-lg font-semibold">Limpeza</Text>
            </View>
            <TouchableOpacity className="flex items-center justify-center w-36 h-10 mx-auto mt-3 bg-purple-300 rounded-xl p-3">
                <Link href="/pedidos" className="text-sm text-purple-800">Solicitar</Link>
            </TouchableOpacity>
        </View>

        
    )
}