import { Image, Text, View } from "react-native";

export function Cards() {
    return (
        <View className="flex-col w-44 h-60 mx-auto p-2 shadow-md bg-neutral-50">
            <Image source={require('../assets/banner3.png')} className="w-40 mx-auto"></Image>
            <View className="p-1">
                <Text className="text-md font-semibold text-center text-purple-800 mb-2">
                    Solicitação
                </Text>
                <Text className="text-justify">
                    Escolha o serviço que você deseja, iremos recomendar o profissional e faça sua solicitação
                </Text>
            </View>
        </View>
    )
}