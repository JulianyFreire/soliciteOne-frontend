import { Link } from "expo-router";
import { Text, View, Image, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { useAuth } from "../context/authContext";
import { useState } from "react";
import { useRouter } from "expo-router";
import Modal from "../components/modal";
import { Ionicons } from '@expo/vector-icons';

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

  const handleCadastro = () => {
    router.push("/cadastro");
  };

  return (
    <View className="flex-1 items-center justify-center min-h-screen bg-primary">
      <View>
        <Image
          source={require("../assets/Image/Logo.png")}
          className="w-60 h-60 max-w-60 max-h-60"
          resizeMode="contain"
        />
      </View>
      <View className="px-10 mt-4 w-full">
        <View>
          <Text className="text-sm font-regular text-white p-2">Email</Text>
          <TextInput
            className="border-b border-secondary rounded-xl p-3 mb-2 text-secondary"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View>
          <Text className="text-sm font-regular text-white p-2">Senha</Text>
          <View className="relative">
            <TextInput
              className="border-b border-secondary rounded-xl p-3 mb-2 text-secondary"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!isPasswordVisible} // Alterna entre os modos de exibição
            />
            <TouchableOpacity
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              className="absolute right-4 top-6 -translate-y-1/2"
            >
              <Ionicons
                name={isPasswordVisible ? 'eye' : 'eye-off'}
                size={20}
                color="white" // Escolha a cor que combina com seu design
              />
            </TouchableOpacity>
          </View>
        </View>
        </View>
      {loading ? (
        <ActivityIndicator size="large" color="#FFF" />
      ) : (
        <View style={{ flexDirection: "row", gap: 20 }}>
          <TouchableOpacity
            className="flex items-center justify-center w-40 h-14 mx-auto my-10 bg-secondary rounded-xl p-3"
            onPress={handleLogin}
          >
            <Text className="text-center font-regular">Entrar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex items-center justify-center w-40 h-14 mx-auto my-10 bg-secondary rounded-xl p-3"
            onPress={handleCadastro}>
            <Text className="text-center font-regular">
              Cadastre-se
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Link de recuperação , 'custom-purple': '#AF49FC'*/}
      <View className="flex justify-start ">
        <Link className="text-sm text-tertiary hover:text-purple-200 font-light" href="/recuperarSenha">
          Esqueceu a senha? Clique aqui
        </Link>
      </View>

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
