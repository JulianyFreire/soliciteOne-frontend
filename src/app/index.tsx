import { ScrollView, Text, View, Dimensions, Image } from "react-native";
import { Navbar } from "../components/navbar";
import { Slider } from "../components/slider";
import { Stats } from "../components/stats";
import { Destaques } from "../components/destaques";
import Swiper from 'react-native-swiper';
import { useState } from "react";

export default function Index() {

    const data = [
        { categoria: "Diarista", icon: require('../assets/Icons/Broom.png') },
        { categoria: "Jardineiro", icon: require('../assets/Icons/Broom.png') },
        { categoria: "Eletricista", icon: require('../assets/Icons/Broom.png') },
        { categoria: "Pedreiro", icon: require('../assets/Icons/Broom.png') },
    ];

    const [pedidos, setPedidos] = useState(false)

    return (
        <View className="flex-1">
            <ScrollView>

                <Slider/>
                {pedidos ? (<Stats />) : null}
                <View className="w-96 mx-auto">
                    <Text className="text-xl font-semibold text-purple-700 mt-8 mb-3">Serviços:</Text>
                    <View className="flex flex-wrap flex-row gap-4">
                        {data.map((item, index) => (
                            <Destaques key={index} categoria={item.categoria} icon={item.icon} />
                        ))}
                    </View>
                </View>
                <View className="w-96 mx-auto">
                    <Text className="text-xl font-semibold text-purple-700 mt-8 mb-3">Como Funciona?</Text>
                    <View className="flex-row gap-4 h-72 mb-10">    
                        <View className="flex-col w-44 h-60 mx-auto p-1 shadow-md bg-neutral-50">
                            <Image source={require('../assets/Banners/banner4.png')} className="mx-auto"></Image>
                            <View className="p-1">
                                <Text className="text-md font-semibold text-center text-purple-800 mb-2">
                                    Solicitação
                                </Text>
                                <Text className="text-justify">
                                    Escolha o serviço que você precisa, iremos recomendar um dos nossos profissionais e faça sua solicitação
                                </Text>
                            </View>
                        </View>
                        <View className="flex-col w-44 h-60 mx-auto p-2 shadow-md bg-neutral-50">
                            <Image source={require('../assets/Banners/banner3.png')} className="w-40 mx-auto"></Image>
                            <View className="p-2">
                                <Text className="text-md font-semibold text-center text-purple-800 mb-2">
                                    Duvidas?
                                </Text>
                                <Text className="text-justify my-auto">
                                    Entre em contato com o nosso atendimento online através do nosso <Text className="text-purple-800">Whatsapp</Text>.
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
            <Navbar />
        </View>
    );
}