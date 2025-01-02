import React, { useEffect } from "react";
import { View, Text, Modal as RNModal, TouchableOpacity } from "react-native";

interface ModalProps {
  isVisible: boolean; // Controle de visibilidade
  title: string; 
  message: string; 
  onClose: () => void; 
}

const Modal: React.FC<ModalProps> = ({ isVisible, title, message, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      // Define um timer para fechar o modal após 5 segundos
      const timer = setTimeout(() => {
        onClose();
      }, 5000); 

      return () => clearTimeout(timer); // Limpa o timer se o modal for desmontado ou `isVisible` mudar
    }
  }, [isVisible, onClose]);
  return (
    <RNModal
      transparent
      visible={isVisible}
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* Área clicável para fechar o modal */}
      <TouchableOpacity 
        className="flex "
        activeOpacity={1}
        onPress={onClose} // Fecha o modal ao clicar fora
      >
        
      </TouchableOpacity>
      <View className="flex-1 items-center mt-4">
        <View className="bg-secondary rounded-lg p-4 w-96 h-20 shadow-lg">
          <Text className="font-bold text-center text-black">{title}</Text>
          <Text className="text-center text-black">{message}</Text>
        </View>
      </View>
    </RNModal>
  );
};

export default Modal;