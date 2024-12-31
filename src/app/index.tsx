import { ScrollView, Text, View, Dimensions, Image } from "react-native";
import { Navbar } from "../components/navbar";
import { Slider } from "../components/slider";
import { Stats } from "../components/stats";
import { Destaques } from "../components/destaques";
import Swiper from 'react-native-swiper';
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/authContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";


export default function Index() {

    interface Solicitation {
        user: string;
        category: {
          _id: string;
          name: string;
        };
        address: string;
        disponibility: string;
        description: string;
        status: string;
      }

      interface Category {
        _id: string;
        name: string;
      }

      
      
        
    const { isLoggedIn } = useAuth();
    const [solicitation, setSolicitation] = useState<Solicitation | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [categoryId, setCategoryId] = useState('')

    useEffect(() => {
        const fetchSolicitation = async () => {
          try {
            const token = await AsyncStorage.getItem("token");
            const { data: solicitationData } = await axios.get("https://api.soliciteapp.com.br/solicitations/current", {
              headers: { Authorization: `Bearer ${token}` },
            });
            setSolicitation(solicitationData);
          } catch (error) {
            console.error('Erro ao buscar categorias:', error);
          }
        };
      
        fetchSolicitation();
      }, []);

      useEffect(() => {
        axios.get('https://api.soliciteapp.com.br/categories') // URL da API para categorias
          .then(response => {
            setCategories(response.data); // Armazena as categorias no estado
          })
          .catch(error => {
            console.error("Erro ao buscar categorias:", error);
          });
      }, []);

      const handleCategoryClick = ({category}: any) => {
        setCategoryId(category._id); // Atualiza o estado com a categoria selecionada
        router.push(`/pedidos?categoryId=${category._id}`); // Redireciona para a rota com query string
      };

      
    return (
        <View className="flex-1">
            <ScrollView>

                <Slider/>
                {solicitation && isLoggedIn ? (<Stats />) : null}
                <View className="w-96 mx-auto">
                    <Text className="text-xl font-semibold text-purple-700 mt-8 mb-3">Serviços:</Text>
                    <View className="flex flex-wrap flex-row gap-4">
                        {categories.map((categories) => (
                            <Destaques
                              key={categories._id}
                              categoria={categories.name}
                              onPress={() => handleCategoryClick({category: categories})}
                              />
                        ))}
                    </View>
                </View>
                <View className="w-96 mx-auto">
                    <Text className="text-xl font-semibold text-purple-700 mt-8 mb-3">Como Funciona?</Text>
                    <View className="flex-row gap-4 h-72 mb-10">    
                        <View className="flex-col w-44 h-60 mx-auto p-1 shadow-md bg-neutral-50">
                            <Image source={require('../assets/Banners/banner4.png')} className="mx-auto"></Image>
                            <View className="p-1">
                                <Text className="text-md font-semibold text-center text-purple-800 mb-2">
                                    Solicitação
                                </Text>
                                <Text className="text-justify text-xs">
                                    Escolha o serviço que você precisa, iremos recomendar um dos nossos profissionais e faça sua solicitação
                                </Text>
                            </View>
                        </View>
                        <View className="flex-col w-44 h-60 mx-auto p-2 shadow-md bg-neutral-50">
                            <Image source={require('../assets/Banners/banner3.png')} className="w-40 mx-auto"></Image>
                            <View className="p-2">
                                <Text className="text-md font-semibold text-center text-purple-800 mb-2">
                                    Duvidas?
                                </Text>
                                <Text className="text-justify text-xs">
                                    Entre em contato com o nosso atendimento online através do nosso <Text className="text-purple-800">Whatsapp</Text>.
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
            <Navbar />
        </View>
    );
}