import {Image, Text, TextInput, View, TouchableOpacity, ScrollView} from "react-native";
import { router } from 'expo-router';
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import Modal from "../components/modal";
import axios from "axios";
import { useSearchParams } from "expo-router/build/hooks";


export default function RecuperarSenha() {

    const [code, setCode] = useState('');
    const [password, setSenha] = useState('');
    const [confirmPassword, setConfirmSenha] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false); 
    const [modalMessage, setModalMessage] = useState(""); 
    const [modalTitle, setModalTitle] = useState("");  
    
    const searchParams = useSearchParams();
    const email = searchParams.get("email");

    const updatePassword = async () => {

        if (password !== confirmPassword) {
            setModalTitle("Senhas diferentes");
            setModalMessage("As senhas digitadas devem ser iguais.");
            setIsModalVisible(true); 
            return;
        }


        if (!email) {
            setModalTitle("Erro");
            setModalMessage("Parâmetro de email não encontrado.");
            setIsModalVisible(true);
            return;
        }


        const response = await axios.post('https://api.soliciteapp.com.br/users/confirm-recovery-password', {
            email,
            code,
            password
        });

        router.push("/login");
        console.log(password);
    }

    return (
        <ScrollView>
            
            <View className="flex-1">
                <View className="flex-row gap-10 items-center p-5 mt-2 justify-center">
                    <Text className="text-4xl text-primary font-light w-52">Crie uma nova senha</Text>
                    <Image source={require('../assets/Image/Logo.png')} className="w-24 h-24 max-w-24 max-h-24 mt-2" resizeMode="contain"/>
                </View>
                <View className="flex-col justify-center items-center my-48">
                    <View className="w-80">
                        <Text className="text-sm font-medium text-primary mb-2">Codigo de recuperação</Text>
                        <TextInput
                            className="border border-primary rounded-xl p-3 mb-4"
                            placeholder="Recuperação"
                            value={code}
                            onChangeText={setCode}
                            />

                        <Text className="text-sm font-medium text-primary mb-2">Nova Senha</Text>
                        <View>
                            <TextInput
                                className="border border-primary rounded-xl p-3 mb-4"
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

                        <Text className="text-sm font-medium text-primary mb-2">Confirme Nova Senha</Text>
                        <View>
                            <TextInput
                                className="border border-primary rounded-xl p-3 mb-4"
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

                        <View className="flex-1 justify-center items-center mt-20">
                            <TouchableOpacity 
                                className="flex items-center justify-center w-48 h-14 bg-secondary rounded-xl"
                                onPress={updatePassword}>
                                <Text className="text-xl text-primary font-semibold">Atualizar senha</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            <Modal
            isVisible={isModalVisible}
            title={modalTitle}
            message={modalMessage}
            onClose={() => setIsModalVisible(false)}
            />
            </View>
        </ScrollView>
    );
}

