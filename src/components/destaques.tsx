import { Link, router } from "expo-router";
import { useState } from "react";
import { Image, Text, View, TouchableOpacity } from "react-native";
import { useAuth } from "../context/authContext";

export function Destaques({categoria, onPress}: any) {

    const handlePress = () => {
        router.push(`/login`);
    }

    const { isLoggedIn } = useAuth()

    return (
        <View className="mx-auto rounded-xl p-3 shadow-md bg-neutral-50">
            <View className="flex-row items-center justify-around">
                <Image 
                    
                    className="hidden"
                />
                <Text className="text-lg font-semibold text-primary">{categoria}</Text>
               
            </View>

            {isLoggedIn ? (
                <TouchableOpacity
                    onPress={onPress} 
                    className="flex items-center justify-center w-28 h-10 mx-auto mt-3 bg-secondary rounded-xl p-3">
                    <Text className="text-sm text-primary font-light">Solicitar</Text>
                </TouchableOpacity>
            ) : (
                
                <TouchableOpacity
                    onPress={handlePress} 
                    className="flex items-center justify-center w-28 h-10 mx-auto mt-3 bg-secondary rounded-xl p-3">
                    <Text className="text-sm text-primary font-light">Solicitar</Text>
                </TouchableOpacity>
                
            )}

            
        </View>

        
    )
}