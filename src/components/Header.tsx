import { View, Text, Image, TouchableOpacity } from 'react-native';
import { router } from "expo-router";
import Ionicons from '@expo/vector-icons/Ionicons';

type HeaderProps = {
  title: string;
};

export function Header({ title }: HeaderProps) {
  return (
    <View className="w-full max-w-md self-center px-6 pt-4 pb-2">
      <View className="relative flex-row items-center" style={{ height: 150 }}>
        <TouchableOpacity onPress={() => router.push('/login')}>
          <Ionicons name="arrow-back" size={36} color="#90CAF9" />
        </TouchableOpacity>

        <View className="absolute inset-0 items-center justify-center" pointerEvents="none">
          <Image
            source={require('../assets/Image/Logotipo.png')}
            className="w-36 h-36 max-w-36 max-h-36"
            resizeMode="contain"
          />
        </View>
      </View>

      <View className="mb-2 px-1">
            <Text className="text-3xl text-inputText font-medium text-left">{title}</Text>
        </View>
    </View>
  );
}