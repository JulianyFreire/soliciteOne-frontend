import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Link, router } from "expo-router";
import { useState } from "react";
import axios from 'axios';
import Modal from "../components/modal";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";

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

    const handleCadastro = async () => {

        if (password !== confirmPassword) {
            setModalTitle("Senhas diferentes");
            setModalMessage("As senhas digitadas devem ser iguais.");
            setIsModalVisible(true); 
            return;
        }
        
        try {
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
                <View className="flex-row items-center p-5 mt-2 justify-center">
                    <Text className="text-4xl text-primary w-64 font-light">Cadastre sua conta</Text>
                    <Image source={require('../assets/Image/Logo.png')} className="w-24 h-24 max-w-24 max-h-24" resizeMode="contain"/>
                </View>
                <View className="px-10 mt-4">
                    <Text className="text-sm font-semibold text-primary p-2">Nome Completo *</Text>
                    <TextInput 
                        className="border border-primary rounded-xl p-3 mb-2"
                        placeholder="João"
                        value={name}
                        onChangeText={setNome}/>

                    <Text className="text-sm font-semibold text-primary p-2">CPF *</Text>
                    <TextInput 
                        className="border border-primary rounded-xl p-3 mb-2"
                        placeholder="000.000.000-00"
                        value={document}
                        onChangeText={(text) => setCpf(formatCpf(text))}/>

                    <Text className="text-sm font-semibold text-primary p-2">Cidade *</Text>
                    <View className="border border-primary rounded-2xl mb-2">
                        <Picker
                            selectedValue={cidade}
                            onValueChange={setCidade}
                            mode="dropdown">
                            <Picker.Item label="Selecione" value="" enabled={false}/>
                            <Picker.Item label="Currais Novos" value="Currais Novos" />
                        </Picker>
                    </View>

                    <Text className="text-sm font-semibold text-primary p-2">Email *</Text>
                    <TextInput
                        className="border border-primary rounded-xl p-3 mb-2"
                        placeholder="user@email.com"
                        value={email}
                        onChangeText={setEmail}/>

                    <Text className="text-sm font-semibold text-primary p-2">Telefone *</Text>
                    <TextInput
                        className="border border-primary rounded-xl p-3 mb-2"
                        placeholder="84 99999-9999"
                        value={phone}
                        onChangeText={(text) => setTelefone(formatPhoneNumber(text))}/>

                    <Text className="text-sm font-semibold text-primary p-2">Senha *</Text>
                    <View>
                        <TextInput
                            className="border border-primary rounded-xl p-3 mb-2"
                            placeholder="Senha"
                            secureTextEntry={!isPasswordVisible}
                            value={password}
                            onChangeText={setSenha}
                        />
                        <TouchableOpacity
                            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                            className="absolute right-4 top-6 -translate-y-1/2"
                        >
                            <Ionicons
                                name={isPasswordVisible ? 'eye' : 'eye-off'}
                                size={20}
                                color="#DBCAFD" // Escolha a cor que combina com seu design
                            />
                        </TouchableOpacity>
                    </View>

                    <Text className="text-sm font-semibold text-primary p-2">Confirme a Senha *</Text>
                    <View>
                        <TextInput
                            className="border border-primary rounded-xl p-3 mb-2"
                            placeholder="Senha"
                            secureTextEntry={!isConfirmPasswordVisible}
                            value={confirmPassword}
                            onChangeText={setConfirmSenha}
                        />

                        <TouchableOpacity
                            onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                            className="absolute right-4 top-6 -translate-y-1/2"
                        >
                            <Ionicons
                                name={isConfirmPasswordVisible ? 'eye' : 'eye-off'}
                                size={20}
                                color="#DBCAFD" // Escolha a cor que combina com seu design
                            />
                        </TouchableOpacity>
                    </View>

                </View>
                <TouchableOpacity
                    className=" flex items-center justify-center w-40 h-14 mx-auto my-10 bg-purple-300 rounded-xl p-3"
                    onPress={handleCadastro}
                    >
                    <Text className="text-2xl text-primary">Cadastrar</Text>
                </TouchableOpacity>
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