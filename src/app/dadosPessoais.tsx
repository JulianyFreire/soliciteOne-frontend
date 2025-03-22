import { Text, View, Image, ScrollView } from "react-native";
import { Navbar } from "../components/navbar";
import { useAuth } from "../context/authContext";
import { Header } from "../components/header";

export default function DadosPessoais() {
    // Dados do usuário
    const { user } = useAuth();

    return (
        <View className="flex-1">
            <Header title="Dados Pessoais" />
            <ScrollView contentContainerStyle={{ paddingHorizontal: 20 }}>
                <View className="bg-gray p-8 rounded-xl w-[90%] max-w-xl mx-auto mt-10 bg-gray-100 shadow-lg">
                    <View className="flex-row mb-6">
                        <Text className="text-primary font-semibold">Nome:</Text>
                        <Text className="text-primary font-light ml-2">{user?.name}</Text>
                    </View>
                    <View className="flex-row mb-6">
                        <Text className="text-primary font-semibold">CPF:</Text>
                        <Text className="text-primary font-light ml-2">{user?.document}</Text>
                    </View>
                    <View className="flex-row mb-6">
                        <Text className="text-primary font-semibold">Email:</Text>
                        <Text className="text-primary font-light ml-2">{user?.email}</Text>
                    </View>
                    <View className="flex-row mb-6">
                        <Text className="text-primary font-semibold">Telefone:</Text>
                        <Text className="text-primary font-light ml-2">{user?.phone}</Text>
                    </View>
                    <View className="flex-row mb-6">
                        <Text className="text-primary font-semibold">Cidade:</Text>
                        <Text className="text-primary font-light ml-2">Currais Novos</Text>
                    </View>
                </View>
            </ScrollView>
            <Navbar />
        </View>
    );
}

