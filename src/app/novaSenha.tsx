import {Image, Text, TextInput, View, TouchableOpacity, ScrollView, ActivityIndicator} from "react-native";
import { router } from 'expo-router';
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import Modal from "../components/modal";
import axios from "axios";
import { useSearchParams } from "expo-router/build/hooks";
import { InputBase } from "../components/inputBase";
import { Button } from "../components/button";
import { Header } from "../components/header";

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
    const [loading, setLoading] = useState(false);

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

        try {
            setLoading(true);
            const response = await axios.post('https://api.soliciteapp.com.br/users/confirm-recovery-password', {
                email,
                code,
                password
            });
        
            router.push("/login");
            console.log(password);
        } catch (error) {
            console.error("Erro ao enviar email:", error);
            setModalTitle("Erro");
            setModalMessage("Erro ao trocar senha, certifique-se que seja um codigo valido.");
            setIsModalVisible(true);
        } finally {
            setLoading(false);
        }

    }

    return (
        <ScrollView>
            
            <View className="flex-1">
                <Header title="Crie uma nova senha" />
                <View className="flex-col justify-center items-center gap-3 mt-32">
                    
                        <InputBase
                            label="Codigo*"
                            placeholder="Codigo"
                            value={code}
                            onChangeText={setCode}
                        />

                        <InputBase
                            label="Nova Senha*"
                            placeholder="Nova Senha"
                            value={password}
                            onChangeText={setSenha}
                            isPassword={true}
                        />

                        <InputBase
                            label="Confirme Nova Senha*"
                            placeholder="Confirme Nova senha"
                            value={confirmPassword}
                            onChangeText={setConfirmSenha}
                            isPassword={true}
                        />

                        {loading ? (
                            <ActivityIndicator size="large" color="#DBCAFD" />
                        ) : (
                            <Button title="Atualizar senha" onPress={updatePassword}></Button>
                        )}

                    
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

