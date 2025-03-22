import { ActivityIndicator, Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Navbar } from "../components/navbar";
import {Picker} from '@react-native-picker/picker';
import { useEffect, useState } from "react";
import { Link, router} from "expo-router";
import { useAuth } from "../context/authContext";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSearchParams } from "expo-router/build/hooks";
import { InputBase } from "../components/inputBase";
import { Button } from "../components/button";
import { Header } from "../components/header";
import Modal from "../components/modal";

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
    const [loading, setLoading] = useState(false);
    const { isLoggedIn, user } = useAuth()
    const [isModalVisible, setIsModalVisible] = useState(false); 
    const [modalMessage, setModalMessage] = useState(""); 
    const [modalTitle, setModalTitle] = useState(""); 

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
            setModalTitle("Campos obrigatórios não preenchidos");
            setModalMessage("Por favor, preencha todos os campos para continuar.");
            setIsModalVisible(true);
            return;
        }
    
        if (!user) {
            setModalTitle("Login necessário");
            setModalMessage("Você precisa estar logado para fazer uma solicitação.");
            setIsModalVisible(true);
            return;
        }
    
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                setModalTitle("Erro de autenticação");
                setModalMessage("Token não encontrado. Faça login novamente.");
                setIsModalVisible(true);
                return;
            }
    
            const response = await axios.post(
                "https://api.soliciteapp.com.br/solicitations",
                {
                    user: user._id,
                    category: categoryId,
                    address,
                    disponibility,
                    description,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
    
            router.push("/detalhes");
        } catch (error) {
            setModalTitle("Erro ao criar solicitação");
            setModalMessage("Não foi possível criar a solicitação. Tente novamente mais tarde.");
            setIsModalVisible(true);
        } finally {
            setLoading(false);
        }
    };    

        return (
            <View className="flex-1">
              <ScrollView>
              <Header title="Cadastre sua solicitação" />
                <View className="flex-col gap-3 items-center mt-14">

                    <InputBase
                      label="Categoria*"
                      value={categoryId}
                      onChangeText={handlePickerChange}
                      options={categories.map((category) => ({
                        key: category._id,
                        label: category.name,
                        value: category._id
                      }))}
                    />

                    <InputBase
                      label="Endereço*"
                      value={address}
                      onChangeText={setEndereco}
                      placeholder="Bairro, Rua e Numero"
                    />

                    <InputBase
                      label="Disponibilidade*"
                      value={disponibility}
                      onChangeText={setDisponibilidade}
                      placeholder="Data e horário disponíevel"
                    />

                    <InputBase
                      label="Descrição*"
                      value={description}
                      onChangeText={setDescricao}
                      placeholder="Descreva a situação do seu problema"
                      isMultiline={true} 
                    />

                    {loading ? (
                      <ActivityIndicator size="large" color="#DBCAFD" />
                    ) : (
                      <Button title="Solicitar" onPress={criarSolicitacao}></Button>
                    )}

                </View>
              </ScrollView>
                
                <Navbar />
                <Modal
                    isVisible={isModalVisible}
                    title={modalTitle}
                    message={modalMessage}
                    onClose={() => setIsModalVisible(false)}
                />
            </View>
        )}