import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export function CardProfe() {
  const router = useRouter();

  return (
    <View className="flex-col gap-2 w-[85%] max-w-sm bg-neutral-50 mx-auto rounded-3xl p-4 shadow-lg items-center text-center h-40 my-8">
      <Text className="text-sm font-bold text-center mt-2">É um profissional? Inscreva-se aqui!</Text>
      <Text className="text-xs text-gray-600 text-center">
        Cadastre-se na nossa base de dados e fique disponível para novas oportunidades.
      </Text>
      <TouchableOpacity
        className="bg-primary px-3 py-2 rounded-full my-2 w-full"
        onPress={() => router.push("https://docs.google.com/forms/d/e/1FAIpQLSeEZIKc_jhx_iN8-SOWFkHvMawjf-Wd6MHhHevJBxt2HrsGiw/viewform?usp=header")}
      >
        <Text className="text-white text-center font-semibold text-sm">Inscreva-se agora</Text>
      </TouchableOpacity>
    </View>
  );
}
