import { Link } from 'expo-router';
import { Text, View, Image, TextInput, TouchableOpacity, ActivityIndicator} from 'react-native';
import { useAuth } from "../context/authContext";
import { useState } from 'react';
import { useRouter } from "expo-router"; 

export default function Login() {

  const { login, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Preencha todos os campos.");
      return;
    }
    try {
      await login(email, password);
    } catch (error) {
      alert("Credenciais inválidas.");
    }
  };

  return (
    <View className="flex-1 items-center justify-center min-h-screen bg-purple-800">
      <View>
        <Image source={require('../assets/Image/Logo.png')} className="w-60 h-60 max-w-60 max-h-60" resizeMode="contain"/>
      </View>       
      <View className="px-10 mt-4 w-full">

        <Text className="text-sm font-semibold text-white p-2">Email</Text>
        <TextInput
          className="border-b border-gray-300 rounded-xl p-3 mb-2 text-gray-200"
          value={email}
          onChangeText={setEmail}/>

        <Text className="text-sm font-semibold text-white p-2">Senha</Text>
        <TextInput className="border-b border-gray-300 rounded-xl p-3 mb-2 text-gray-200"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}/>

      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#FFF" />
      ) : (
        <View className= "flex flex-row gap-x-10 mx-auto"> 
          <TouchableOpacity
            className= "flex items-center justify-center w-40 h-14 mx-auto my-10 bg-purple-300 rounded-xl p-3"
            onPress={handleLogin}>
            <Text className="text-center">Entrar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="flex items-center justify-center w-40 h-14 mx-auto my-10 bg-purple-300 rounded-xl p-3">
            <Link href="/cadastro" className="text-center">Cadastre-se</Link>
          </TouchableOpacity>
      </View>
      )}
      
      {/* Link de recuperação , 'custom-purple': '#AF49FC'*/}
      <View className="flex justify-start "> 
        <Link className="text-sm text-purple-300 hover:text-purple-200" href="/recuperarSenha">Esqueceu a senha? Clique aqui</Link>
      </View>
    </View>
  )
}
