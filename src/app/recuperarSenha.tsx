import {Image, Text, TextInput, View, TouchableOpacity, ActivityIndicator, ScrollView} from "react-native";
import { router } from 'expo-router';
import { useState } from "react";
import axios from "axios";
import { Button } from "../components/button";
import { InputBase } from "../components/inputBase";
import Modal from "../components/modal";
import { Header } from "../components/header";

export default function RecuperarSenha() {

    const[email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false); 
    const [modalMessage, setModalMessage] = useState(""); 
    const [modalTitle, setModalTitle] = useState("");  

    const sendMail = async () => {

        if (!email) {
            setModalTitle("Erro");
            setModalMessage("Preencha o campo de email para alterar sua senha");
            setIsModalVisible(true);
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post('https://api.soliciteapp.com.br/users/recovery-password', {
                email
            });
    
            // Navegar para a tela de novaSenha passando o email como parâmetro
            router.push({
                pathname: "/novaSenha",
                params: { email }, // Passa o email como parâmetro
            });
    
            console.log(email);
        } catch (error) {
            console.error("Erro ao enviar email:", error);
            setModalTitle("Erro");
            setModalMessage("Erro no envio do email, certifique-se que é um email existente");
            setIsModalVisible(true);
            
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView>
            <View className="flex-1">
                <Header title="Recuperar Senha" />
                <View className="flex-col gap-16 items-center top-40">
                <InputBase
                    label="Digite seu email"
                    placeholder="seuemail@gmail.com"
                    value={email}
                    onChangeText={setEmail}
                    />
                        <View className="flex-1 justify-center items-center">
                            {loading ? (
                                <ActivityIndicator size="large" color="#DBCAFD" />
                            ) : (
                                <Button title="Enviar Email" onPress={sendMail}></Button>
                            )}
                        </View>
                </View>
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

