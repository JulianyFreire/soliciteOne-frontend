import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Link } from "expo-router";
import { useState } from "react";
import axios from 'axios';

export default function Cadastro() {

    const [name, setNome] = useState('');
    const [document, setCpf] = useState('');
    const [email, setEmail] = useState('');
    const [cidade, setCidade] = useState('');
    const [phone, setTelefone] = useState('');
    const [password, setSenha] = useState('');

    const handleCadastro = async () => {
        try {
            const response = await axios.post('https://api.soliciteapp.com.br/users', {
                name,
                email,
                password,
                phone,
                document,
            });
            
            // Exibir mensagem de sucesso
            console.log(response.data);
            console.log('Cadastro com sucesso');
        } catch (error) {
            // Exibir mensagem de erro
            console.log('Erro no cadastro');
            console.error(error);
        }
    };

    return (
        <View className="flex-1">
            <View className="flex-row items-center p-5 mt-2 justify-center">
                <Text className="text-4xl text-primary w-64 font-light">Cadastre sua conta</Text>
                <Image source={require('../assets/Image/Logo.png')} className="w-24 h-24 max-w-24 max-h-24" resizeMode="contain"/>
            </View>
            <View className="px-10 mt-4">
                <Text className="text-sm font-semibold text-primary p-2">Nome Completo</Text>
                <TextInput 
                    className="border border-primary rounded-xl p-3 mb-2"
                    placeholder="João"
                    value={name}
                    onChangeText={setNome}/>

                <Text className="text-sm font-semibold text-primary p-2">CPF</Text>
                <TextInput 
                    className="border border-primary rounded-xl p-3 mb-2"
                    placeholder="000.000.000-00"
                    value={document}
                    onChangeText={setCpf}/>

                <Text className="text-sm font-semibold text-primary p-2">Cidade</Text>
                <TextInput
                    className="border border-primary rounded-xl p-3 mb-2"
                    placeholder="Currais Novos"
                    value={cidade}
                    onChangeText={setCidade}/>

                <Text className="text-sm font-semibold text-primary p-2">Email</Text>
                <TextInput
                    className="border border-primary rounded-xl p-3 mb-2"
                    placeholder="user@email.com"
                    value={email}
                    onChangeText={setEmail}/>

                <Text className="text-sm font-semibold text-primary p-2">Telefone</Text>
                <TextInput
                    className="border border-primary rounded-xl p-3 mb-2"
                    placeholder="84 99999-9999"
                    value={phone}
                    onChangeText={setTelefone}/>

                <Text className="text-sm font-semibold text-primary p-2">Senha</Text>
                <TextInput
                    className="border border-primary rounded-xl p-3 mb-2"
                    placeholder="Senha"
                    secureTextEntry={true}
                    value={password}
                    onChangeText={setSenha}/>

            </View>
            <TouchableOpacity
                className=" flex items-center justify-center w-40 h-14 mx-auto my-10 bg-purple-300 rounded-xl p-3"
                onPress={handleCadastro}
                >
                <Link href="/login" className="text-2xl text-primary" onPress={handleCadastro}>Cadastrar</Link>
            </TouchableOpacity>
        </View>
    );
}