import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Navbar } from "../components/navbar";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export default function Orcamento() {

    interface Budget {
        _id: string
        solicitation: {
            _id: string,
            user: string,
            category: string,
            address: string,
            disponibility: string,
            status: string,
        },
        worker: {
            _id: string,
            name: string,
            email: string,
            document: string,
            phone: string,
        },
        value: number,
        status: string,
        description: string,
        
    }

    const [budget, setBudget] = useState<Budget | null>(null);

    useEffect(() => {
        const fetchbudget = async () => {
          try {
            const token = await AsyncStorage.getItem("token");
            const { data: budgetData } = await axios.get(`https://api.soliciteapp.com.br/budgets/${budget?._id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            setBudget(budgetData);
          } catch (error) {
            console.error('Erro ao buscar categorias:', error);
          }
        };
      
        fetchbudget();
      }, []);

      const handleRefuseBudget = async () => {
        const token = await AsyncStorage.getItem("token");
        try {
          const response = await axios.post(`https://api.soliciteapp.com.br/budgets/${budget?._id}/refuse`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          Alert.alert('Sucesso', 'Crçamento recusado com sucesso!');
        } catch (error) {
          console.error('Erro ao recusar orçamento:', error);
          Alert.alert('Erro', 'Não foi possível recusar o orçamento.');
        }
      };

      const handleAcceptBudget = async () => {
        const token = await AsyncStorage.getItem("token");
        try {
          const response = await axios.post(`https://api.soliciteapp.com.br/budgets/${budget?._id}/accept`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          Alert.alert('Sucesso', 'Orçamento aceito com sucesso!');
        } catch (error) {
          console.error('Erro ao aceitar orçamento:', error);
          Alert.alert('Erro', 'Não foi possível aceitar o orçamento.');
        }
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
                        <Text className="text-purple-600 ml-2">{budget?.solicitation.category}</Text>
                    </View>
                    <View className="flex-row mb-6">
                        <Text className="text-purple-800 font-bold">Nome:</Text>
                        <Text className="text-purple-600 ml-2">{budget?.worker.name}</Text>
                    </View>
                    <View className="flex-row mb-6">
                        <Text className="text-purple-800 font-bold">Disponibilidade:</Text>
                        <Text className="text-purple-600 ml-2">{budget?.solicitation.disponibility}</Text>
                    </View>
                    <View className="flex-row mb-6">
                        <Text className="text-purple-800 font-bold">Descrição:</Text>
                        <Text className="text-purple-600 ml-2">{budget?.description}</Text>
                    </View>
                    <View className="flex-row mb-6">
                        <Text className="text-purple-800 font-bold">Orçamento:</Text>
                        <Text className="text-purple-600 ml-2">{budget?.value}</Text>
                    </View>
                    <View className= "flex-row gap-10 mx-auto"> 
                        <TouchableOpacity
                            onPress={handleRefuseBudget}
                            className= "flex items-center justify-center w-36 h-12 mx-auto my-10 bg-purple-300 rounded-xl px-3">
                            <Link href="/detalhes" className="text-purple-800 font-medium text-center">Recusar Orçamento</Link>
                        </TouchableOpacity>
                    
                        <TouchableOpacity
                            onPress={handleAcceptBudget}
                            className="flex items-center justify-center w-36 h-12 mx-auto my-10 bg-purple-800 rounded-xl px-1">
                            <Link href="/" className="text-purple-300 font-medium text-center">Aceitar Orçamento</Link>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
            <Navbar />
        </View>
    );
}