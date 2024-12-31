import { Alert, Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Navbar } from "../components/navbar";
import {Picker} from '@react-native-picker/picker';
import { useEffect, useState } from "react";
import { Link, router} from "expo-router";
import { useAuth } from "../context/authContext";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSearchParams } from "expo-router/build/hooks";


export default function Pedidos() {


  
  
  interface Category {
    _id: string; // ou number, dependendo do tipo do ID na API
    name: string;
  }
  
  const searchParams = useSearchParams(); // Para recuperar os parâmetros da URL
  const categoryId = searchParams.get('categoryId') || ''; // Obtém o parâmetro ou usa um valor padrão

    const [categories, setCategories] = useState<Category[]>([]);  // Armazena as categorias
    const [address, setEndereco] = useState("");
    const [disponibility, setDisponibilidade] = useState("");
    const [description, setDescricao] = useState("");
    const { isLoggedIn, user } = useAuth()

    const handlePickerChange = (itemValue: string) => {
      // Atualiza a URL com a nova categoria selecionada
      router.push(`/pedidos?categoryId=${itemValue}`);
    };

    useEffect(() => {
        axios.get('https://api.soliciteapp.com.br/categories') // URL da API para categorias
          .then(response => {
            setCategories(response.data); // Armazena as categorias no estado
          })
          .catch(error => {
            console.error("Erro ao buscar categorias:", error);
          });
      }, []);

    const criarSolicitacao = async () => {
        if (!categoryId || !address || !disponibility || !description) {
          Alert.alert("Erro", "Todos os campos são obrigatórios.");
          return;
        }

        if (!user) {
            Alert.alert("Erro", "Usuário não está logado.");
            return;
          }

        try {
            
            const token = await AsyncStorage.getItem("token"); // Recupera o token do AsyncStorage
            console.log("user", user);
            const response = await axios.post(
              "https://api.soliciteapp.com.br/solicitations", // URL da API para criar solicitações
              {
                user: user._id, // Identificador do usuário
                category: categoryId,
                address,
                disponibility,
                description,
              }
            );
      
            
            router.push("/detalhes");
            // Redirecionar para outra tela, se necessário
          } catch (error) {
            console.error(error);
            
            Alert.alert("Erro", "Não foi possível criar a solicitação.");
          }
        };    

    {if (isLoggedIn) {
        return (
            <View className="flex-1">
                <View className="flex-row items-center p-5 mt-2 justify-center">
                    <Text className="text-4xl text-purple-800 w-64 font-medium">Cadastre sua solicitação</Text>
                    <Image source={require('../assets/Image/Logo.png')} className="w-24 h-24 max-w-24 max-h-24" resizeMode="contain"/>
                </View>
                <View className="px-10 mt-4">
                    <Text className="text-sm font-semibold text-purple-800 p-2">Categoria</Text>
                        <View className="border border-purple-800 rounded-xl mb-2 p-2">
                        <Picker
                            selectedValue={categoryId}
                            onValueChange={handlePickerChange} // Atualiza o id selecionado
                        >
                            <Picker.Item label="Selecionar" value="" />
                                {categories.map((category) => {
                                 // Verifique se o id e name estão sendo passados corretamente
                                return (
                            <Picker.Item
                                key={category._id} // Usando o id da categoria como chave
                                label={category.name} // Exibe o nome da categoria
                                value={category._id} // Usa o id da categoria como valor
                            />
                                );
                            })}         
                        </Picker>
                    </View>
                    <Text className="text-sm font-semibold text-purple-800 p-2">Endereço</Text>
                    <TextInput
                        className="border border-purple-800 rounded-xl p-3 mb-2"
                        placeholder="Bairro, Rua e Numero"
                        value={address}
                        onChangeText={setEndereco}
                    />

                    <Text className="text-sm font-semibold text-purple-800 p-2">Disponibilidade</Text>
                    <TextInput
                        className="border border-purple-800 rounded-xl p-3 mb-2"
                        placeholder="Data e horário disponíevel"
                        value={disponibility}
                        onChangeText={setDisponibilidade}   
                    />

                    <Text className="text-sm font-semibold text-purple-800 p-2">Descrição</Text>
                    <TextInput
                        className="border border-purple-800 rounded-xl p-3 text-wrap mb-2 h-28"
                        placeholder="Descreva a situação do seu problema para uma solicitação mais efetica" 
                        multiline={true}
                        value={description}
                        onChangeText={setDescricao}
                    />

                    <TouchableOpacity
                        className=" flex items-center justify-center w-40 h-14 mx-auto my-10 bg-purple-300 rounded-xl p-3"
                        onPress={criarSolicitacao}
                        >
                        <Text className="text-2xl text-purple-800">Solicitar</Text>
                    </TouchableOpacity>
                </View>
                <Navbar />
            </View>
        )} else {
            return null
        }
}}