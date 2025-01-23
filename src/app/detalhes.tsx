import { Alert, Image, Text, TouchableOpacity, View } from "react-native";
import { Stats } from "../components/stats";
import { Link, router } from "expo-router";
import { Navbar } from "../components/navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

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


  useEffect(() => {
    const fetchSolicitation = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const { data: solicitationData } = await axios.get("https://api.soliciteapp.com.br/solicitations/current", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSolicitation(solicitationData);
        console.log(solicitation?.budget)

      } catch (error) {
        console.error('Erro ao buscar categorias:', error);
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
      <View className="flex-1">
          <View className="flex-row items-center p-5 mt-2 justify-center">
              <Text className="text-4xl text-purple-800 w-64 font-medium">Detalhes da Solicitação</Text>
              <Image source={require('../assets/Image/Logo.png')} className="w-24 h-24 max-w-24 max-h-24" resizeMode="contain"/>
          </View>
          <View className="w-full p-10 flex-col gap-4 justify-start">
              <Text className="text-purple-800 font-semibold">Categoria: <Text className="font-normal">{solicitation?.category.name}</Text></Text>
              <Text className="text-purple-800 font-semibold">Endereço: <Text className="font-normal">{solicitation?.address}</Text></Text>
              <Text className="text-purple-800 font-semibold">Disponibilidade: <Text className="font-normal">{solicitation?.disponibility}</Text></Text>
              <Text className="text-purple-800 font-semibold">Descrição: <Text className="font-normal">{solicitation?.description}</Text></Text>
          </View>
          <Stats /> 
          {/**<View className="justify-end w-80 h-20 border mx-auto border-purple-800 rounded-b-lg">*/}
            {solicitation?.budget && (
              <View className="flex-row justify-end items-center p-2 w-80 h-10 mx-auto bg-purple-800 rounded-b-lg">
                <Link
                  href={{
                    pathname: "/orcamento",
                    params: { budgetId: solicitation.budget },
                  }}
                  className="text-purple-300"
                >
                  Detalhar
                </Link>
              </View>
          )}
          {/**</View>*/}
            <TouchableOpacity
              onPress={handleCancelRequest}
              className= "flex items-center justify-center w-40 h-14 ml-5 mt-48  bg-purple-800 rounded-xl p-2">
              <Text className="text-purple-300 font-medium text-center">Cancelar Solicitação</Text>
            </TouchableOpacity>
      </View>
      <Navbar/>
    </View>
    
  )
}
