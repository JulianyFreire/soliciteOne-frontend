import {Image, Text, TextInput, View, TouchableOpacity} from "react-native";
import { router } from 'expo-router';
import { useState } from "react";

export default function RecuperarSenha() {

    const[email, setEmail] = useState("");

    const sendMail = () => {
        router.push("/novaSenha");
        console.log(email);
    }

    return (
        <View className="flex-1">
            <View className="flex-row gap-10 items-center p-5 mt-2 justify-center mb-52">
                <Text className="text-4xl text-purple-800 font-medium w-44">Recuperar Senha</Text>
                <Image source={require('../assets/Image/Logo.png')} className="w-24 h-24 max-w-24 max-h-24 mt-2" resizeMode="contain"/>
            </View>
            <View className="flex-col gap-16 items-center">
                    <View className="w-80">
                        <Text className="text-sm font-semibold text-purple-800 mb-2">Digite seu email</Text>
                        <TextInput 
                            className="border border-purple-800 rounded-xl p-3 mb-4"
                            placeholder="user@gmail.com"
                            value={email}
                            onChangeText={setEmail}
                        />
                    </View>
                    <View className="flex-1 justify-center items-center">
                        <TouchableOpacity
                            className="flex items-center justify-center w-48 h-14 bg-purple-300 rounded-xl"
                            onPress={sendMail}>
                            <Text className="text-xl text-purple-800 font-semibold">Enviar Email</Text>
                        </TouchableOpacity>
                    </View>
            </View>
        </View>
    );
}

