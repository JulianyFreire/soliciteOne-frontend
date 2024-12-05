import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Navbar } from "../components/navbar";
import {Picker} from '@react-native-picker/picker';
import { useState } from "react";
import { Link } from "expo-router";

export default function Pedidos() {

    const [categoria, setCategoria] = useState("Categoria");

    return (
        <View className="flex-1">
            <View className="flex-row items-center p-5 mt-2 justify-center">
                <Text className="text-4xl text-purple-800 w-64 font-medium">Cadastre sua solicitação</Text>
                <Image source={require('../assets/logo.png')} className="w-24 h-24 max-w-24 max-h-24" resizeMode="contain"/>
            </View>
            <View className="px-10 mt-4">
                <Text className="text-sm font-semibold text-purple-800 p-2">Categoria</Text>
                    <View className="border border-purple-800 rounded-xl mb-2">
                        <Picker
                            className=""
                            selectedValue={categoria}
                            onValueChange={(itemValue, itemIndex) => setCategoria(itemValue)}
                            >
                            <Picker.Item label="Limpeza" value="limpeza" />
                            <Picker.Item label="Eletricista" value="eletricista" />
                            <Picker.Item label="Pedreiro" value="pedreiro" />
                            <Picker.Item label="Encanador" value="encanador" />
                        </Picker>
                </View>
                <Text className="text-sm font-semibold text-purple-800 p-2">Endereço</Text>
                <TextInput className="border border-purple-800 rounded-xl p-3 mb-2" placeholder="Bairro, Rua e Numero"></TextInput>
                <Text className="text-sm font-semibold text-purple-800 p-2">Disponibilidade</Text>
                <TextInput className="border border-purple-800 rounded-xl p-3 mb-2" placeholder="Data e horário disponíevel"></TextInput>
                <Text className="text-sm font-semibold text-purple-800 p-2">Descrição</Text>
                <TextInput className="border border-purple-800 rounded-xl p-3 text-wrap mb-2 h-28" placeholder="Descreva a situação do seu problema para uma solicitação mais efetica" multiline={true}></TextInput>
                <Text className="text-sm font-semibold text-purple-800 p-2">Imagens</Text>
                <TextInput className="border border-purple-800 rounded-xl p-3 mb-2" placeholder="Adicionar imagem"></TextInput>
                <TouchableOpacity className=" flex items-center justify-center w-40 h-14 mx-auto my-10 bg-purple-300 rounded-xl p-3">
                    <Link href="/detalhes" className="text-2xl text-purple-800">Solicitar</Link>
                </TouchableOpacity>
            </View>
            <Navbar />
        </View>
    );
}