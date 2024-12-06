import { ScrollView, Text, View, Dimensions } from "react-native";
import { Navbar } from "../components/navbar";
import { Slider } from "../components/slider";
import { Stats } from "../components/stats";
import { Destaques } from "../components/destaques";
import { Cards } from "../components/cards";
import Swiper from 'react-native-swiper';

export default function Home() {

    return (
        <View className="flex-1">
            <ScrollView>

                <Slider/>
                <Stats />
                <View className="w-96 mx-auto">
                    <Text className="text-xl font-semibold text-purple-700 mt-8 mb-3">Serviços:</Text>
                    <View className="flex flex-wrap flex-row gap-4">
                        <Destaques/>
                        <Destaques/>
                        <Destaques/>
                        <Destaques/>
                    </View>
                </View>
                <View className="w-96 mx-auto">
                    <Text className="text-xl font-semibold text-purple-700 mt-8 mb-3">Como Funciona?</Text>
                    <View className="flex-row gap-4 h-72 mb-10">    
                        <Cards/>
                        <Cards/>
                    </View>
                </View>
            </ScrollView>
            <Navbar />
        </View>
    );
}