import { Text, View, Image, ScrollView } from "react-native";
import { Navbar } from "../components/navbar";


export default function DadosPessoais() {
    // Dados do usuário
    const userData = {
        nome: "Nome Sobrenome",
        cpf: "000.000.000-00",
        email: "example@email.com",
        telefone: "(84) 9999-9999",
        endereco: "Centro, rua meio, 45",
        cidade: "Currais Novos",
    };

    return (
        <View className="flex-1">
            <View className="flex-row items-center p-5 mt-2 justify-center">
                <Text className="text-4xl text-purple-800 w-64 font-medium">Dados Pessoais</Text>
                <Image source={require("../assets/Image/Logo.png")} className="w-24 h-24 max-w-24 max-h-24" resizeMode="contain"/>
            </View>
            <ScrollView contentContainerStyle={{ paddingHorizontal: 20 }}>
                <View className="bg-gray p-6 rounded-lg shadow-lg">
                    <View className="flex-row mb-4">
                        <Text className="text-purple-800 font-bold">Nome:</Text>
                        <Text className="text-purple-600 ml-2">{userData.nome}</Text>
                    </View>
                    <View className="flex-row mb-4">
                        <Text className="text-purple-800 font-bold">CPF:</Text>
                        <Text className="text-purple-600 ml-2">{userData.cpf}</Text>
                    </View>
                    <View className="flex-row mb-4">
                        <Text className="text-purple-800 font-bold">Email:</Text>
                        <Text className="text-purple-600 ml-2">{userData.email}</Text>
                    </View>
                    <View className="flex-row mb-4">
                        <Text className="text-purple-800 font-bold">Telefone:</Text>
                        <Text className="text-purple-600 ml-2">{userData.telefone}</Text>
                    </View>
                    <View className="flex-row mb-4">
                        <Text className="text-purple-800 font-bold">Endereço:</Text>
                        <Text className="text-purple-600 ml-2">{userData.endereco}</Text>
                    </View>
                    <View className="flex-row mb-4">
                        <Text className="text-purple-800 font-bold">Cidade:</Text>
                        <Text className="text-purple-600 ml-2">{userData.cidade}</Text>
                    </View>
                </View>
            </ScrollView>
            <Navbar />
        </View>
    );
}

