import {Image, Text, TextInput, View, TouchableOpacity} from "react-native";
import { Link } from 'expo-router';

export default function RecuperarSenha() {
    return (
        <View className="flex-1">
            <View className="flex-row gap-10 items-center p-5 mt-2 justify-center">
                <Text className="text-4xl text-purple-800 font-medium w-52">Crie uma nova senha</Text>
                <Image source={require('../assets/Image/Logo.png')} className="w-24 h-24 max-w-24 max-h-24 mt-2" resizeMode="contain"/>
            </View>
            <View className="flex-col justify-center items-center my-48">
                <View className="w-80">
                    <Text className="text-sm font-semibold text-purple-800 mb-2">Senha</Text>
                    <TextInput className="border border-purple-800 rounded-xl p-3 mb-4" placeholder="Digite a senha"/>

                    <Text className="text-sm font-semibold text-purple-800 mb-2">Confirmar senha</Text>
                    <TextInput className="border border-purple-800 rounded-xl p-3 mb-4" placeholder="Digite a senha"/>

                    <View className="flex-1 justify-center items-center mt-20">
                        <TouchableOpacity className="flex items-center justify-center w-48 h-14 bg-purple-300 rounded-xl">
                            <Link href="/login" className="text-xl text-purple-800 font-semibold">Login</Link>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
}

