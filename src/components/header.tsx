import { View, Text } from "react-native";

type HeaderProps = {
  title: string;
  subtitle?: string;
};

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <View
      className="w-full px-5 pt-8 pb-5 bg-primary"
      style={{ borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}
    >
      <Text className="text-white text-2xl font-semibold">{title}</Text>
      {subtitle ? <Text className="text-secondary text-sm mt-1">{subtitle}</Text> : null}
    </View>
  );
}
