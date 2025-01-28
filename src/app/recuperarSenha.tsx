import {Image, Text, TextInput, View, TouchableOpacity} from "react-native";
import { router } from 'expo-router';
import { useState } from "react";
import axios from "axios";

export default function RecuperarSenha() {

    const[email, setEmail] = useState("");

    const sendMail = async () => {
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
        }
    };

    return (
        <View className="flex-1">
            <View className="flex-row gap-10 items-center p-5 mt-2 justify-center mb-52">
                <Text className="text-4xl text-primary font-light w-44">Recuperar Senha</Text>
                <Image source={require('../assets/Image/Logo.png')} className="w-24 h-24 max-w-24 max-h-24 mt-2" resizeMode="contain"/>
            </View>
            <View className="flex-col gap-16 items-center">
                    <View className="w-80">
                        <Text className="text-sm font-medium text-primary mb-2">Digite seu email</Text>
                        <TextInput 
                            className="border border-primary rounded-xl p-3 mb-4"
                            placeholder="seuemail@gmail.com"
                            value={email}
                            onChangeText={setEmail}
                        />
                    </View>
                    <View className="flex-1 justify-center items-center">
                        <TouchableOpacity
                            className="flex items-center justify-center w-48 h-14 bg-secondary rounded-xl"
                            onPress={sendMail}>
                            <Text className="text-xl text-primary font-regular">Enviar Email</Text>
                        </TouchableOpacity>
                    </View>
            </View>
        </View>
    );
}

