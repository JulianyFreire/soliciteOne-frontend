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
      }, 3500);

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
      {/* Área clicável que fecha o modal ao tocar fora */}
      <TouchableOpacity 
        className="flex-1 justify-start items-center mt-10"
        activeOpacity={1} 
        onPress={onClose} // Fecha o modal ao clicar fora
      >
        <View className="bg-secondary rounded-lg p-4 w-[90%] md:w-96 h-20 shadow-lg">
          <Text className="font-medium text-center text-primary">{title}</Text>
          <Text className="font-light text-center text-primary">{message}</Text>
        </View>
      </TouchableOpacity>
    </RNModal>
  );
};

export default Modal;
