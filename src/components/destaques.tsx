import { Link, router } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Text, View, TouchableOpacity } from "react-native";
import { useAuth } from "../context/authContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export function Destaques({ categoria, onPress }: any) {
    const { isLoggedIn } = useAuth();
    const [solicitation, setSolicitation] = useState<boolean>(false);

    // Função para buscar a solicitação ativa
    useEffect(() => {
        const fetchSolicitation = async () => {
            try {
                const token = await AsyncStorage.getItem("token");
                if (!token) return;
                
                const { data: solicitationData } = await axios.get(
                    "https://api.soliciteapp.com.br/solicitations/current",
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                if (solicitationData) {
                    setSolicitation(true);
                }
            } catch (error) {
                console.error("Erro ao buscar solicitação:", error);
            }
        };

        fetchSolicitation();
    }, []);

    const handlePress = () => {
        if (solicitation) {
            router.push("/detalhes"); // Redireciona se houver solicitação ativa
        } else if (isLoggedIn) {
            onPress(); // Permite solicitar normalmente se estiver logado e sem solicitação ativa
        } else {
            router.push("/login"); // Redireciona para login se não estiver logado
        }
    };

    return (
            <View className="mx-auto rounded-xl p-6 shadow-md bg-neutral-50">
                <View className="flex-row items-center justify-around">
                    <Image className="hidden" />
                    <Text className="text-xl font-semibold text-primary ">{categoria}</Text>
                </View>

                <TouchableOpacity
                    onPress={handlePress}
                    className={`flex items-center justify-center w-28 h-10 mx-auto mt-3 rounded-xl p-3 bg-secondary`}
                    // Desativa o botão caso haja uma solicitação ativa
                >
                    <Text className="text-sm text-primary font-light">
                        Solicitar
                    </Text>
                </TouchableOpacity>
            </View>
    );
}
