import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Navbar } from "../components/navbar";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Modal from "../components/modal";

export default function Orcamento() {
  
  interface Budget {
    _id: string
    solicitation: {
      _id: string,
      user: string,
      category: {
        _id: string,
        name: string
      },
      address: string,
      disponibility: string,
      description: string,
      status: string,
      budget: string
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
      
    const [isModalVisible, setIsModalVisible] = useState(false); 
    const [modalMessage, setModalMessage] = useState(""); 
    const [modalTitle, setModalTitle] = useState("");
    

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

          // Funções para abrir o modal 
      const ModalCancelarSolicitacao = () => {
        setModalTitle("Solicitação Cancelada");
        setModalMessage("A solicitação foi cancelada com sucesso!");
        setIsModalVisible(true);
      };

      const ModalAceitarOrcamento = () => {
        setModalTitle("Orçamento Aceito");
        setModalMessage("O orçamento foi aceito! O serviço será iniciado.");
        setIsModalVisible(true);
      };

      const handleRefuseBudget = async () => {
        const token = await AsyncStorage.getItem("token");
        try {
          const response = await axios.post(`https://api.soliciteapp.com.br/budgets/${budget?._id}/refuse`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          Alert.alert('Sucesso', 'Crçamento recusado com sucesso!');
          ModalCancelarSolicitacao();
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
          ModalAceitarOrcamento();
        } catch (error) {
          console.error('Erro ao aceitar orçamento:', error);
          Alert.alert('Erro', 'Não foi possível aceitar o orçamento.');
        }
      };

  

    return (
        <View className="flex-1">
            <View className="flex-row items-center gap-7 p-5 mt-2 justify-center">
                <Text className="text-4xl text-purple-800 font-medium w-64">Detalhe do Orçamento</Text>
                <Image source={require("../assets/Image/Logo.png")} className="w-24 h-24 max-w-24 max-h-24" resizeMode="contain"/>
            </View>
            <ScrollView contentContainerStyle={{ paddingHorizontal: 20 }}>
                <View className="bg-gray p-5 pt-8 rounded-xl w-full mx-auto mt-10 bg-gray-100 shadow-lg">
                    <View className="flex-row mb-6">
                        <Text className="text-purple-800 font-bold">Categoria:</Text>
                        <Text className="text-purple-600 ml-2">{budget?.solicitation.category.name}</Text>
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
                            <Text className="text-purple-800 font-medium text-center">Recusar Orçamento</Text>
                        </TouchableOpacity>
                    
                        <TouchableOpacity
                            onPress={handleAcceptBudget}
                            className="flex items-center justify-center w-36 h-12 mx-auto my-10 bg-purple-800 rounded-xl px-1">
                            <Text className="text-purple-300 font-medium text-center">Aceitar Orçamento</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            {/* Modal para mensagens */}
            <Modal
              isVisible={isModalVisible}
              title={modalTitle}
              message={modalMessage}
              onClose={() => setIsModalVisible(false)}
            />

            <Navbar />

        </View>
    );
}