import React, { useEffect } from "react";
import { View, Text, Modal as RNModal, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

type ModalType = "success" | "error" | "info";

interface ModalProps {
  isVisible: boolean;
  title: string;
  message: string;
  onClose: () => void;
  type?: ModalType;
}

const TYPE_STYLES: Record<ModalType, { icon: keyof typeof Ionicons.glyphMap; color: string; bgClass: string }> = {
  success: { icon: "checkmark-circle", color: "#059669", bgClass: "bg-green-100" },
  error: { icon: "close-circle", color: "#DC2626", bgClass: "bg-red-100" },
  info: { icon: "information-circle", color: "#1E3A8A", bgClass: "bg-secondary" },
};

const Modal: React.FC<ModalProps> = ({ isVisible, title, message, onClose, type = "info" }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 3500);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  const { icon, color, bgClass } = TYPE_STYLES[type];

  return (
    <RNModal transparent visible={isVisible} animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity
        className="flex-1 justify-start items-center bg-black/30 px-6 pt-16"
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity activeOpacity={1} onPress={() => {}} className="w-full max-w-sm">
          <View
            className="bg-surface rounded-3xl p-6 items-center shadow-2xl"
            accessibilityRole="alert"
          >
            <TouchableOpacity
              onPress={onClose}
              className="absolute right-3 top-3 p-1"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessibilityLabel="Fechar"
              accessibilityRole="button"
            >
              <Ionicons name="close" size={20} color="#9CA3AF" />
            </TouchableOpacity>

            <View className={`w-14 h-14 rounded-full items-center justify-center mb-4 ${bgClass}`}>
              <Ionicons name={icon} size={30} color={color} />
            </View>

            <Text className="text-base font-semibold text-inputText text-center mb-1">{title}</Text>
            {message ? (
              <Text className="text-sm text-gray-500 text-center leading-5">{message}</Text>
            ) : null}

          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </RNModal>
  );
};

export default Modal;