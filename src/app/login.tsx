import { Link } from "expo-router";
import { Text, View, Image, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { useAuth } from "../context/authContext";
import { useState } from "react";
import { useRouter } from "expo-router";
import Modal from "../components/modal";

export default function Login() {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      setModalTitle("Sucesso");
      setModalMessage("Login realizado com sucesso!");
      setIsModalVisible(true); // Exibe o modal
    } catch (error) {
      // não está chamando por aqui e sim pelo authContext
      setModalTitle("Email ou senha estão incorretos");
      setModalMessage("Verifique suas informações e tente novamente.");
      setIsModalVisible(true); 
    }
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
        <Text className="text-sm font-regular text-white p-2">Email</Text>
        <TextInput
          className="border-b border-secondary rounded-xl p-3 mb-2 text-secondary"
          value={email}
          onChangeText={setEmail}
        />

        <Text className="text-sm font-regular text-white p-2">Senha</Text>
        <TextInput
          className="border-b border-secondary rounded-xl p-3 mb-2 text-secondary"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
        />
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

          <TouchableOpacity className="flex items-center justify-center w-40 h-14 mx-auto my-10 bg-secondary rounded-xl p-3">
            <Link href="/cadastro" className="text-center font-regular">
              Cadastre-se
            </Link>
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
