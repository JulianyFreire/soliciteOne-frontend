import { Image, View } from "react-native";
import Entypo from '@expo/vector-icons/Entypo';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Link } from "expo-router";

export function Navbar() {
    return (
        <View className="flex-row absolute bottom-0 left-0 right-0 h-16 justify-around items-center border-t border-purple-600 py-2">
            <Link href="/home">
                <Entypo name="home" size={24} color="#520C87"/>
            </Link>
            <Link href="/pedidos">
                <Image source={require('../assets/logo.png')} className="w-14 h-14 max-w-14 max-h-14" resizeMode="contain"/>
            </Link>
            <Link href="/perfil">
                <MaterialCommunityIcons name="account" size={24} color="#520C87" />
            </Link>            

        </View>
    )
}