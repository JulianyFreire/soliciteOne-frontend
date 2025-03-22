import { Link } from "expo-router";
import { Text, View, Image, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { useAuth } from "../context/authContext";
import { useState } from "react";
import { useRouter } from "expo-router";
import Modal from "../components/modal";
import { Ionicons } from '@expo/vector-icons';
import { Button } from "../components/button";

export default function Login() {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false); 
  const [modalMessage, setModalMessage] = useState(""); 
  const [modalTitle, setModalTitle] = useState("");  
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      setModalTitle("Campos obrigatórios não preenchidos");
      setModalMessage("Por favor, preencha todos os campos para continuar com o login.");
      setIsModalVisible(true); 
      return;
    }

    try {
      
      await login(email, password);

    } catch (error) {
    }
  };


  return (
    <View className="flex-1 items-center justify-center min-h-screen">
      <View>
        <Image
          source={require("../assets/Image/LogoAlt.png")}
          className="w-60 h-60 max-w-60 max-h-60"
          resizeMode="contain"
        />
      </View>
      <View className="px-10 mt-4 w-full">
        <View>
          <Text className="text-sm font-regular text-white p-2">Email</Text>
          <TextInput
            className="border border-primary rounded-xl p-3 text-primary"
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
          />
        </View>

        <View>
          <Text className="text-sm font-regular text-white p-2">Senha</Text>
          <View className="relative">
            <TextInput
              className="border border-primary rounded-xl p-3 mb-2 text-primary"
              value={password}
              onChangeText={setPassword}
              placeholder="Senha"
              secureTextEntry={!isPasswordVisible} // Alterna entre os modos de exibição
            />
            <TouchableOpacity
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              className="absolute right-4 top-6 -translate-y-1/2"
            >
              <Ionicons
                name={isPasswordVisible ? 'eye' : 'eye-off'}
                size={20}
                color="#AF49FC" // Escolha a cor que combina com seu design
              />
            </TouchableOpacity>
          </View>
        </View>
        </View>
      {loading ? (
        <ActivityIndicator size="large" color="#FFF" />
      ) : (
        <View className="w-full flex-row items-center justify-between md:justify-around p-10">

          <View className="flex p-2 gap-2">
            <Link href={"/cadastro"} className="text-sm text-tertiary hover:text-purple-200 font-light">
             Cadastre-se
            </Link>
            <Link className="text-sm text-tertiary hover:text-purple-200 font-light" href="/recuperarSenha">
              Recuperar Senha
            </Link>
          </View>

          <Button title="Entrar" onPress={handleLogin} variant="dark"></Button>
          
        </View>
      )}

      {/* Link de recuperação , 'custom-purple': '#AF49FC'*/}

      {/* Modal */}
      <Modal
        isVisible={isModalVisible}
        title={modalTitle}
        message={modalMessage}
        onClose={() => setIsModalVisible(false)}
      />
    </View>
  );
}
