import { TouchableOpacity, Text } from "react-native";

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: "default" | "dark" | "outlined";
};

export function Button({ title, onPress, variant = "default" }: ButtonProps) {
  const getButtonStyles = () => {
    switch (variant) {
      case "dark":
        return "bg-primary text-secondary"; // Fundo primary, texto secondary
      case "outlined":
        return "border-2 border-primary bg-transparent text-primary"; // Sem fundo, borda primary, texto primary
      default:
        return "bg-secondary"; // Estilo padrão
    }
  };

  return (
    <TouchableOpacity
      className={`flex justify-center w-5/6 md:w-80 rounded-2xl p-3 ${getButtonStyles()}`}
      onPress={onPress}
    >
      <Text className={`text-center font-regular ${variant === "dark" ? "text-secondary" : "text-primary"}`}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}