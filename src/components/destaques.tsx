import { Link } from "expo-router";
import { useState } from "react";
import { Image, Text, View, TouchableOpacity } from "react-native";

export function Destaques({categoria, icon}: any) {


    const [isLoggedIn, setIsLoggedIn] = useState(false)

    return (
        <View className="mx-auto rounded-xl p-4 shadow-md bg-neutral-50">
            <View className="flex-row items-center justify-around">
                <Image 
                    source={icon}
                />
                <Text className="text-lg font-semibold">{categoria}</Text>
               
            </View>

            {isLoggedIn ? (
                <TouchableOpacity className="flex items-center justify-center w-36 h-10 mx-auto mt-3 bg-purple-300 rounded-xl p-3">
                    <Link href="/pedidos" className="text-sm text-purple-800">Solicitar</Link>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity className="flex items-center justify-center w-36 h-10 mx-auto mt-3 bg-purple-300 rounded-xl p-3">
                    <Link href="/login" className="text-sm text-purple-800">Solicitar</Link>
                </TouchableOpacity>
            )}

            
        </View>

        
    )
}