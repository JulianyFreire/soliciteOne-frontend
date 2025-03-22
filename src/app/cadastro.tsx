import { ActivityIndicator, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Link, router } from "expo-router";
import { useState } from "react";
import axios from 'axios';
import Modal from "../components/modal";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { InputBase } from "../components/inputBase";
import { Button } from "../components/button";
import {Header}  from "../components/header";

export default function Cadastro() {

    const [name, setNome] = useState('');
    const [document, setCpf] = useState('');
    const [email, setEmail] = useState('');
    const [cidade, setCidade] = useState('');
    const [phone, setTelefone] = useState('');
    const [password, setSenha] = useState('');
    const [confirmPassword, setConfirmSenha] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false); 
    const [modalMessage, setModalMessage] = useState(""); 
    const [modalTitle, setModalTitle] = useState("");
    const [loading, setLoading] = useState(false);

    const handleCadastro = async () => {

        if (password !== confirmPassword) {
            setModalTitle("Senhas diferentes");
            setModalMessage("As senhas digitadas devem ser iguais.");
            setIsModalVisible(true); 
            return;
        }
        
        try {
            setLoading(true);
            const response = await axios.post('https://api.soliciteapp.com.br/users', {
                name,
                email,
                password,
                phone,
                document,
            });

            setModalTitle("Bem Vindo ao Solicite");
            setIsModalVisible(true);
            
            console.log('Cadastro com sucesso');
            // Exibir mensagem de sucesso
            console.log(response.data);
            router.push('/login');
        } catch (error) {
            // Exibir mensagem de erro
            setModalTitle("Campos obrigatórios não preenchidos");
            setModalMessage("Por favor, preencha todos os campos para continuar o cadastro.");
            setIsModalVisible(true); 
            console.log('Erro no cadastro');
        } finally {
            setLoading(false);
        }
    };

    const formatCpf = (value: string): string => {
        return value
          .replace(/\D/g, '') // Remove caracteres não numéricos
          .replace(/(\d{3})(\d)/, '$1.$2') // Adiciona o primeiro ponto
          .replace(/(\d{3})(\d)/, '$1.$2') // Adiciona o segundo ponto
          .replace(/(\d{3})(\d{1,2})$/, '$1-$2') // Adiciona o traço
          .substring(0, 14); // Limita o tamanho máximo
      };

      const formatPhoneNumber = (value: string): string => {
        return value
          .replace(/\D/g, '') // Remove caracteres não numéricos
          .replace(/(\d{2})(\d)/, '($1) $2') // Adiciona parênteses ao DDD
          .replace(/(\d{5})(\d)/, '$1-$2') // Adiciona o traço após os 5 dígitos
          .substring(0, 15); // Limita o tamanho máximo
      };

    return (
        <ScrollView>

            <View className="flex-1">
                <Header title="Cadastre sua conta" />
                <View className="flex-col items-center gap-4">
                    <InputBase
                        label="Nome Completo*"
                        placeholder="Digite seu nome completo"
                        value={name}
                        onChangeText={setNome}
                    />

                    <InputBase
                        label="CPF*"
                        placeholder="000.000.000-00"
                        value={document}
                        onChangeText={(text) => setCpf(formatCpf(text))}
                    />

                    <InputBase
                        label="Cidade*"
                        value={cidade}
                        onChangeText={setCidade}
                        options={[
                            { label: "Currais Novos", value: "Currais Novos" }
                        ]}
                    />

                    <InputBase
                        label="Email*"
                        placeholder="user@email.com"
                        value={email}
                        onChangeText={setEmail}
                    />

                    <InputBase
                        label="Telefone*"
                        placeholder="(84) 99999-9999"
                        value={phone}
                        onChangeText={(text) => setTelefone(formatPhoneNumber(text))}
                    />

                    <InputBase 
                    label="Senha*" 
                    placeholder="Digite sua Senha" 
                    value={password} 
                    onChangeText={setSenha} 
                    isPassword={true} 
                    />
                    
                    <InputBase 
                    label="Cofirme a Senha*" 
                    placeholder="Confirme a Senha" 
                    value={confirmPassword} 
                    onChangeText={setConfirmSenha} 
                    isPassword={true} 
                    />

                </View>

                {loading ? (
                    <ActivityIndicator size="large" color="#DBCAFD" className="p-10"/>
                ) : (
                    <View className="flex-1 justify-center items-center">
                        <Button title="Cadastrar" onPress={handleCadastro}></Button>
                    </View>
                )}

            </View>
            <Modal
                isVisible={isModalVisible}
                title={modalTitle}
                message={modalMessage}
                onClose={() => setIsModalVisible(false)}
            />
        </ScrollView>
    );
}