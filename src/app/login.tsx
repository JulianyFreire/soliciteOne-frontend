import { Link } from "expo-router";
import { Text, View, Image, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import { useRouter } from "expo-router";
import Modal from "../components/Modal";
import { Ionicons } from '@expo/vector-icons';

export default function Login() {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [modalType, setModalType] = useState<"success" | "error" | "info">("error");
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
    <View className="flex-1 justify-center items-center px-6 w-full">
      <View className="w-full max-w-md self-center">
        <View className="mb-6">
          <Image
            source={require("../assets/Image/Logo.png")}
            className="w-24 h-24 max-w-24 max-h-24 mb-4"
            resizeMode="contain"
          />
          <Text className="text-2xl font-semibold text-primary mb-1">Solicite One</Text>
          <Text className="text-sm text-inputText">Gerencie seu negócio de forma inteligente.</Text>
        </View>

        <View>
          <Text className="text-base font-medium text-inputText p-2">Email</Text>
          <TextInput
            className="bg-background border border-borderColor rounded-xl p-3 text-inputText"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View>
          <Text className="text-base font-medium text-inputText p-2">Senha</Text>
          <View className="relative">
            <TextInput
              className="bg-background border border-borderColor rounded-xl p-3 mb-2 text-inputText"
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
                color="#90CAF9"
              />
            </TouchableOpacity>
          </View>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#90CAF9" />
        ) : (
          <View className="w-full mt-4 items-center">
            <View className="w-full items-end mb-4">
              <Link className="text-sm text-inputText font-regular" href="/recovery">
                Esqueci minha senha
              </Link>
            </View>

            <TouchableOpacity
              className="w-full rounded-xl bg-secondary p-3 items-center mb-3"
              onPress={handleLogin}
            >
              <Text className="text-primary font-semibold text-base">Entrar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row justify-center mt-3"
              onPress={() => router.push('/register')}
            >
              <Text className="text-sm text-inputText">Não tem uma conta? </Text>
              <Text className="text-sm font-bold text-primary">Cadastre-se!</Text>
            </TouchableOpacity>
          </View>
        )}

        <Modal
          isVisible={isModalVisible}
          title={modalTitle}
          message={modalMessage}
          type={modalType}
          onClose={() => setIsModalVisible(false)}
        />
      </View>
    </View>
  );
}