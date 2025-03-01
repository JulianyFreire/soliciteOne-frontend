import { ActivityIndicator, Alert, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Stats } from "../components/stats";
import { Link, router } from "expo-router";
import { Navbar } from "../components/navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Header } from "../components/header";

export default function Detalhes() {

  interface Solicitation {
    _id: string;
    user: string;
    category: {
      _id: string;
      name: string;
    };
    address: string;
    disponibility: string;
    description: string;
    status: string;
    budget?: string
  }

  const [solicitation, setSolicitation] = useState<Solicitation | null>(null);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const fetchSolicitation = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem("token");
        const { data: solicitationData } = await axios.get("https://api.soliciteapp.com.br/solicitations/current", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSolicitation(solicitationData);
        console.log(solicitation?.budget)

      } catch (error) {
        console.error('Erro ao buscar categorias:', error);
      } finally {
        setLoading(false);
      }
      
    };
  
    fetchSolicitation();
  }, []);

  const handleCancelRequest = async () => {
    const token = await AsyncStorage.getItem("token");
    try {
      const response = await axios.delete(`https://api.soliciteapp.com.br/solicitations/${solicitation?._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Alert.alert('Sucesso', 'Solicitação cancelada com sucesso!');
      router.back();
    } catch (error) {
      console.error('Erro ao cancelar solicitação:', error);
      Alert.alert('Erro', 'Não foi possível cancelar a solicitação.');
    }
  };

  return (
    <View className="flex-1">
      <ScrollView>
          <Header title="Detalhes da Solicitação" />
          <View className="w-96 mx-auto px-5 py-10 flex-col gap-4">
              <Text className="text-primary font-semibold">Categoria: <Text className="font-regular">{solicitation?.category.name}</Text></Text>
              <Text className="text-primary font-semibold">Endereço: <Text className="font-regular">{solicitation?.address}</Text></Text>
              <Text className="text-primary font-semibold">Disponibilidade: <Text className="font-regular">{solicitation?.disponibility}</Text></Text>
              <Text className="text-primary font-semibold">Descrição: <Text className="font-regular">{solicitation?.description}</Text></Text>
          </View>
          <Stats /> 
          {/**<View className="justify-end w-80 h-20 border mx-auto border-primary rounded-b-lg">*/}
            {solicitation?.budget && (
              <View className="flex-row justify-end items-center p-2 w-5/6 h-10 max-w-96 mx-auto bg-primary rounded-b-lg">
                <Link
                  href={{
                    pathname: "/orcamento",
                    params: { budgetId: solicitation.budget },
                  }}
                  className="text-secondary"
                >
                  Detalhar
                </Link>
              </View>
          )}
          {/**</View>*/}

            {loading ? (
              <ActivityIndicator size="large" color="#DBCAFD" className="p-10"/>
            ) : (
              <View className="w-96 mx-auto">
                <TouchableOpacity
                  onPress={handleCancelRequest}
                  className= "flex items-center justify-center w-40 h-14 ml-5 mt-32 border border-primary rounded-xl p-2 m-5">
                  <Text className="text-primary font-medium text-center">Cancelar Solicitação</Text>
                </TouchableOpacity>
              </View>
            )}


      </ScrollView>
      
      <Navbar/>
    </View>
    
  )
}
