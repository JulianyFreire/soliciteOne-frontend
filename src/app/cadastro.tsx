import { Button, Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Navbar } from "../components/navbar";
import { Link } from "expo-router";

export default function Cadastro() {
    return (
        <View className="flex-1">
            <View className="flex-row items-center p-5 mt-2 justify-center">
                <Text className="text-4xl text-purple-800 w-64 font-medium">Cadastre sua conta</Text>
                <Image source={require('../assets/Image/Logo.png')} className="w-24 h-24 max-w-24 max-h-24" resizeMode="contain"/>
            </View>
            <View className="px-10 mt-4">
                <Text className="text-sm font-semibold text-purple-800 p-2">Nome Completo</Text>
                <TextInput className="border border-purple-800 rounded-xl p-3 mb-2" placeholder="João"></TextInput>
                <Text className="text-sm font-semibold text-purple-800 p-2">CPF</Text>
                <TextInput className="border border-purple-800 rounded-xl p-3 mb-2" placeholder="000.000.000-00"></TextInput>
                <Text className="text-sm font-semibold text-purple-800 p-2">Cidade</Text>
                <TextInput className="border border-purple-800 rounded-xl p-3 mb-2" placeholder="Currais Novos"></TextInput>
                <Text className="text-sm font-semibold text-purple-800 p-2">Email</Text>
                <TextInput className="border border-purple-800 rounded-xl p-3 mb-2" placeholder="user@email.com"></TextInput>
                <Text className="text-sm font-semibold text-purple-800 p-2">Telefone</Text>
                <TextInput className="border border-purple-800 rounded-xl p-3 mb-2" placeholder="84 99999-9999"></TextInput>
                <Text className="text-sm font-semibold text-purple-800 p-2">Senha</Text>
                <TextInput className="border border-purple-800 rounded-xl p-3 mb-2" placeholder="Senha"></TextInput>
            </View>
            <TouchableOpacity className=" flex items-center justify-center w-40 h-14 mx-auto my-10 bg-purple-300 rounded-xl p-3">
                <Link href="/login" className="text-2xl text-purple-800">Cadastrar</Link>
            </TouchableOpacity>
        </View>
    );
}