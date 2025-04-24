import { ActivityIndicator, Alert, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Navbar } from "../components/navbar";
import { Link, router } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Modal from "../components/modal";
import { useSearchParams } from "expo-router/build/hooks";
import { Header } from "../components/header";

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
    const [loading, setLoading] = useState(false);
    const searchParams = useSearchParams();
    const budgetId = searchParams.get("budgetId");
    

    const [budget, setBudget] = useState<Budget | null>(null);

    useEffect(() => {
        const fetchbudget = async () => {
          try {
            const token = await AsyncStorage.getItem("token");
            const { data: budgetData } = await axios.get(`https://api.soliciteapp.com.br/budgets/${budgetId}`, {
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
        setLoading(true);
        const token = await AsyncStorage.getItem("token");
        try {
          const response = await axios.post(`https://api.soliciteapp.com.br/budgets/${budget?._id}/refuse`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          Alert.alert('Sucesso', 'Orçamento recusado com sucesso!');
          ModalCancelarSolicitacao();
          router.back();
        } catch (error) {
          console.error('Erro ao recusar orçamento:', error);
          Alert.alert('Erro', 'Não foi possível recusar o orçamento.');
        } finally {
          setLoading(false);
        }
      };

      const handleAcceptBudget = async () => {
        setLoading(true);
        const token = await AsyncStorage.getItem("token");
        try {
          const response = await axios.post(`https://api.soliciteapp.com.br/budgets/${budget?._id}/accept`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          Alert.alert('Sucesso', 'Orçamento aceito com sucesso!');
          ModalAceitarOrcamento();
          router.back();
        } catch (error) {
          console.error('Erro ao aceitar orçamento:', error);
          Alert.alert('Erro', 'Não foi possível aceitar o orçamento.');
        } finally {
          setLoading(false);
        }
      };

      console.log("Status do orçamento:", budget?.status);

  

    return (
        <View className="flex-1">
            <Header title="Detalhe do Orçamento" />
            <ScrollView contentContainerStyle={{ paddingHorizontal: 20 }}>
                <View className="bg-gray p-5 pt-8 rounded-xl w-full max-w-xl mx-auto mt-10 bg-gray-100 shadow-lg">
                    <View className="flex-row mb-6">
                        <Text className="text-primary font-bold">Categoria:</Text>
                        <Text className="text-primary font-regular ml-2">{budget?.solicitation.category.name}</Text>
                    </View>
                    <View className="flex-row mb-6">
                        <Text className="text-primary font-bold">Nome:</Text>
                        <Text className="text-primary font-regular ml-2">{budget?.worker.name}</Text>
                    </View>
                    <View className="flex-row mb-6">
                        <Text className="text-primary font-bold">Disponibilidade:</Text>
                        <Text className="text-primary font-regular ml-2">{budget?.solicitation.disponibility}</Text>
                    </View>
                    <View className="flex-row mb-6">
                        <Text className="text-primary font-bold">Descrição:</Text>
                        <Text className="text-primary font-regular ml-2">{budget?.description}</Text>
                    </View>
                    <View className="flex-row mb-14">
                        <Text className="text-primary font-bold">Orçamento:</Text>
                        <Text className="text-primary ml-2">{budget?.value}</Text>
                    </View>

                    {loading ? (
                      <ActivityIndicator size="large" color="#DBCAFD" />
                    ) : (
                      
                      budget?.status !== "approved" && ( // Verifica se o orçamento ainda não foi aceito
                        <View className="flex-row gap-6 mx-auto"> 
                          <TouchableOpacity
                            onPress={handleRefuseBudget}
                            className="flex items-center justify-center w-28 md:w-52 h-12 mx-auto mb-4 border-primary border-2 rounded-xl px-3">
                            <Text className="text-primary font-medium text-center">Recusar Orçamento</Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={handleAcceptBudget}
                            className="flex items-center justify-center w-28 md:w-52 h-12 mx-auto mb-4 bg-primary rounded-xl px-1">
                            <Text className="text-secondary font-medium text-center">Aceitar Orçamento</Text>
                          </TouchableOpacity>
                        </View>
                      )
                    )}


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