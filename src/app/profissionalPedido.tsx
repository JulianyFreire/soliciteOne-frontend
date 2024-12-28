import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Navbar } from "../components/navbar";
import { useState } from "react";
import Modal from "../components/modal";

export default function ProfissionalPedido() {
  const data = {
    categoria: "Diarista",
    nome: "Maria",
    disponibilidade: "Terça 14h",
    descricao: "Irei precisar de produtos de limpeza",
    orcamento: "R$ 50,00",
  };

  const [isModalVisible, setIsModalVisible] = useState(false); 
  const [modalMessage, setModalMessage] = useState(""); 
  const [modalTitle, setModalTitle] = useState(""); 

  // Funções para abrir o modal 
  const handleCancelarSolicitacao = () => {
    setModalTitle("Solicitação Cancelada");
    setModalMessage("A solicitação foi cancelada com sucesso!");
    setIsModalVisible(true);
  };

  const handleAceitarOrcamento = () => {
    setModalTitle("Orçamento Aceito");
    setModalMessage("O orçamento foi aceito! O serviço será iniciado.");
    setIsModalVisible(true);
  };

  return (
    <View className="flex-1">
      <View className="flex-row items-center gap-7 p-5 mt-2 justify-center">
        <Text className="text-4xl text-purple-800 font-medium w-64">
          Detalhe do Profissional
        </Text>
        <Image
          source={require("../assets/Image/Logo.png")}
          className="w-24 h-24 max-w-24 max-h-24"
          resizeMode="contain"
        />
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20 }}>
        <View className="bg-gray p-5 pt-8 rounded-xl w-full mx-auto mt-10 bg-gray-100 shadow-lg">
          <View className="flex-row mb-6">
            <Text className="text-purple-800 font-bold">Categoria:</Text>
            <Text className="text-purple-600 ml-2">{data.categoria}</Text>
          </View>
          <View className="flex-row mb-6">
            <Text className="text-purple-800 font-bold">Nome:</Text>
            <Text className="text-purple-600 ml-2">{data.nome}</Text>
          </View>
          <View className="flex-row mb-6">
            <Text className="text-purple-800 font-bold">Disponibilidade:</Text>
            <Text className="text-purple-600 ml-2">{data.disponibilidade}</Text>
          </View>
          <View className="flex-row mb-6">
            <Text className="text-purple-800 font-bold">Descrição:</Text>
            <Text className="text-purple-600 ml-2">{data.descricao}</Text>
          </View>
          <View className="flex-row mb-6">
            <Text className="text-purple-800 font-bold">Orçamento:</Text>
            <Text className="text-purple-600 ml-2">{data.orcamento}</Text>
          </View>

          <View className="flex-row gap-10 mx-auto">
            <TouchableOpacity
              className="flex items-center justify-center w-36 h-12 mx-auto my-10 bg-purple-300 rounded-xl px-3"
              onPress={handleCancelarSolicitacao}
            >
              <Text className="text-purple-800 font-medium text-center">
                Cancelar Solicitação
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex items-center justify-center w-36 h-12 mx-auto my-10 bg-purple-800 rounded-xl px-1"
              onPress={handleAceitarOrcamento}
            >
              <Text className="text-purple-300 font-medium text-center">
                Aceitar Orçamento
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Exibição do Navbar */}
      <Navbar />

      {/* Modal para mensagens */}
      <Modal
        isVisible={isModalVisible}
        title={modalTitle}
        message={modalMessage}
        onClose={() => setIsModalVisible(false)}
      />
    </View>
  );
}
