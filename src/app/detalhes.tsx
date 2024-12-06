import { Image, Text, TouchableOpacity, View } from "react-native";
import { Stats } from "../components/stats";
import { Link } from "expo-router";
import { Navbar } from "../components/navbar";

export default function Detalhes() {
  return (
    <View className="flex-1">
        <View className="flex-row items-center p-5 mt-2 justify-center">
            <Text className="text-4xl text-purple-800 w-64 font-medium">Detalhes da Solicitação</Text>
            <Image source={require('../assets/Image/Logo.png')} className="w-24 h-24 max-w-24 max-h-24" resizeMode="contain"/>
        </View>
        <View className="w-full p-10 flex-col gap-4 justify-start">
            <Text className="text-purple-800 font-semibold">Categoria: <Text className="font-normal">Limpeza</Text></Text>
            <Text className="text-purple-800 font-semibold">Endereço: <Text className="font-normal">Centro, rua meio, 45</Text></Text>
            <Text className="text-purple-800 font-semibold">Disponibilidade: <Text className="font-normal">Sábados e Domingos pela manhã</Text></Text>
            <Text className="text-purple-800 font-semibold">Descrição: <Text className="font-normal">fazer fachina em uma casa com 5 comodos</Text></Text>
            <Text className="text-purple-800 font-semibold mb-40">Imagens</Text>
        </View>
        <Stats />
        <View className= "flex flex-row gap-x-10 mx-auto"> 
          <TouchableOpacity className= "flex items-center justify-center w-40 h-14 mx-auto my-10 bg-purple-800 rounded-xl p-2">
            <Link href="/home" className="text-purple-300 font-medium text-center">Cancelar Solicitação</Link>
          </TouchableOpacity>
      
          <TouchableOpacity className="flex items-center justify-center w-40 h-14 mx-auto my-10 bg-purple-300 rounded-xl p-2">
            <Link href="/pedidos" className="text-purple-800 font-medium text-center">Solicitações Anteriores</Link>
          </TouchableOpacity>
      </View>
    <Navbar/>
    </View>
  )
}
