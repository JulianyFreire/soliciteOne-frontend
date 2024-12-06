import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Navbar } from "../components/navbar";
import { Link } from "expo-router";

export default function ProfissionalPedido() {
    const data = {
        categoria: "Diarista",
        nome: "Maria",
        disponibilidade: "Terça 14h",
        descricao: "irei precisar de produtos de limpeza",
        orcamento: "R$ 50,00",
    };

    return (
        <View className="flex-1">
            <View className="flex-row items-center gap-7 p-5 mt-2 justify-center">
                <Text className="text-4xl text-purple-800 font-medium w-64">Detalhe do Profissional</Text>
                <Image source={require("../assets/Image/Logo.png")} className="w-24 h-24 max-w-24 max-h-24" resizeMode="contain"/>
            </View>
            <ScrollView contentContainerStyle={{ paddingHorizontal: 20 }}>
                <View className="bg-gray p-5 pt-8 rounded-xl w-full mx-auto mt-10 bg-gray-100 shadow-lg">
                    <View className="flex-row mb-6">
                        <Text className="text-purple-800 font-bold">Categoria:</Text>
                        <Text className="text-purple-600 ml-2">{data.categoria}</Text>
                    </View>
                    <View className="flex-row mb-6">
                        <Text className="text-purple-800 font-bold">Nome:</Text>
                        <Text className="text-purple-600 ml-2">{data.nome}</Text>
                    </View>
                    <View className="flex-row mb-6">
                        <Text className="text-purple-800 font-bold">Disponibilidade:</Text>
                        <Text className="text-purple-600 ml-2">{data.disponibilidade}</Text>
                    </View>
                    <View className="flex-row mb-6">
                        <Text className="text-purple-800 font-bold">Descrição:</Text>
                        <Text className="text-purple-600 ml-2">{data.descricao}</Text>
                    </View>
                    <View className="flex-row mb-6">
                        <Text className="text-purple-800 font-bold">Orçamento:</Text>
                        <Text className="text-purple-600 ml-2">{data.orcamento}</Text>
                    </View>
                    <View className= "flex-row gap-10 mx-auto"> 
                        <TouchableOpacity className= "flex items-center justify-center w-36 h-12 mx-auto my-10 bg-purple-800 rounded-xl px-3">
                            <Link href="/" className="text-purple-300 font-medium text-center">Cancelar Solicitação</Link>
                        </TouchableOpacity>
                    
                        <TouchableOpacity className="flex items-center justify-center w-36 h-12 mx-auto my-10 bg-purple-300 rounded-xl px-1">
                            <Link href="/" className="text-purple-800 font-medium text-center">Aceitar Orçamento</Link>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
            <Navbar />
        </View>
    );
}