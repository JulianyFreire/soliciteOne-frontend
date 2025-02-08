import { Image, Text, View } from "react-native";
import Entypo from '@expo/vector-icons/Entypo';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Link } from "expo-router";
import React from "react";
import { useAuth } from '../context/authContext';

export function Navbar() {

    const { isLoggedIn } = useAuth()

    return (
        <View className="flex-row bottom-0 left-0 right-0 h-16 justify-around items-center bg-white border-t border-secondary py-2">
            <Link href="/">
                <View className="flex-col items-center">
                    <Entypo name="home" size={24} color="#520C87" />
                    <Text>Início</Text>
                </View>
            </Link>
            {isLoggedIn ? (
                <>
                    <Link href="/pedidos">
                        <View className="flex-col items-center">
                            <Image source={require('../assets/Image/Logo.png')} className="w-8 h-8 max-w-8 max-h-8" resizeMode="contain"/>
                            <Text>Solicitar</Text>
                        </View>
                    </Link>
                    <Link href="/perfil">
                        <View className="flex-col items-center">
                            <MaterialCommunityIcons name="account" size={28} color="#520C87" />
                            <Text>Perfil</Text>
                        </View>
                    </Link> 
                </>
                
            ) : (
                <>
                    <Link href="/login">
                        <View className="flex-col items-center">
                            <Image source={require('../assets/Image/Logo.png')} className="w-8 h-8 max-w-8 max-h-8" resizeMode="contain"/>
                            <Text>Solicitar</Text>
                        </View>
                    </Link>
                    <Link href="/login">
                        <View className="flex-col items-center">
                            <MaterialCommunityIcons name="account" size={28} color="#520C87" />
                            <Text>Perfil</Text>
                        </View>
                    </Link> 
                </>
            )}             
        </View>
    )
}