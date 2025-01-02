import { Text, View, Image, Linking, TouchableOpacity} from "react-native";
import { Navbar } from "../components/navbar";
import { Link } from "expo-router";
import { useAuth } from "../context/authContext";
import Ionicons from '@expo/vector-icons/Ionicons';

export default function Perfil() {

    const { user, logout } = useAuth()

    const openWhatsApp = () => {
        const url = 'https://wa.me/'; // Substitua com o número do WhatsApp
        Linking.openURL(url);
    };
     
    return (
        <View className="flex-1 ">
            <View className="w-full h-64 bg-primary flex justify-center items-center">
                <View className="w-24 h-24 bg-white rounded-full flex justify-center items-center">
                    <Image source={require('../assets/Icons/User.png')} className="w-16 h-16"/>
                </View>
                <Text className="text-white text-lg font-medium mt-4">{user?.name || 'Nome do Usuário'}</Text>
            </View>
            <View className="justify-center items-center">
                <Image source={require('../assets/Image/Logotipo.png')} className="w-20 h-20 max-w-20 max-h-20"/>
            </View>
            <View className="border-t border-primary py-2 flex-row items-center">
                <Image source={require('../assets/Icons/Activity History.png')} className="m-4 w-15 h-15 max-w-15 max-h-15"/>
                <Link className="font-regular" href="/dadosPessoais">Dados Pessoais</Link>
            </View>
            <View className="border-t border-primary py-2 flex-row items-center">
                <TouchableOpacity onPress={openWhatsApp} className="flex-row items-center">
                    <Image source={require('../assets/Icons/Headset.png')} className="m-4 w-15 h-15 max-w-15 max-h-15"/>
                    <Text className="font-regular">Suporte</Text>
                </TouchableOpacity>
            </View>
            <View className="border-t border-primary py-2 flex-row items-center">
                <TouchableOpacity onPress={logout} className="flex-row items-center">
                    <Image source={require('../assets/Icons/Logout.png')} className="m-4 w-15 h-15 max-w-15 max-h-15"/>
                    <Text className="font-regular">Sair</Text>
                </TouchableOpacity>
            </View>
            <View className="border-t border-primary py-2"></View>
            <Navbar />
        </View>
    );
}