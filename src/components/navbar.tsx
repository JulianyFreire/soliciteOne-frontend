import { Image, Text, View } from "react-native";
import Entypo from '@expo/vector-icons/Entypo';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import { useAuth } from '../context/authContext';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export function Navbar() {

    interface Solicitation {
        _id: string;
        user: string;
        category: {
          _id: string;
          name: string;
        };
        address: string;
        disponibility: string;
        description: string;
        status: string;
        budget?: string
      }

    const [solicitation, setSolicitation] = useState<Solicitation | null>(null);

    const { isLoggedIn } = useAuth()

    useEffect(() => {
        const fetchSolicitation = async () => {
          try {
            const token = await AsyncStorage.getItem("token");
            const { data: solicitationData } = await axios.get("https://api.soliciteapp.com.br/solicitations/current", {
              headers: { Authorization: `Bearer ${token}` },
            });
            setSolicitation(solicitationData);
            console.log(solicitation?.budget)
    
          } catch (error) {
            console.error('Erro ao buscar categorias:', error);
          } finally {
          
          }
        };
      
        fetchSolicitation();
      }, []);

    return (
        <View className="flex-row bottom-0 left-0 right-0 h-16 justify-around items-center bg-white border-t border-secondary py-2">
            <Link href="/">
                <View className="flex-col items-center">
                    <Entypo name="home" size={24} color="#520C87" />
                    <Text>Início</Text>
                </View>
            </Link>
                <>
                {solicitation ?  (
                    <>
                    <Link href="/detalhes">
                        <View className="flex-col items-center">
                            <Image source={require('../assets/Image/Logo.png')} className="w-8 h-8 max-w-8 max-h-8" resizeMode="contain"/>
                            <Text>Solicitar</Text>
                        </View>
                    </Link>
                    <Link href="/perfil">
                        <View className="flex-col items-center">
                            <MaterialCommunityIcons name="account" size={28} color="#520C87" />
                            <Text>Perfil</Text>
                        </View>
                    </Link>
                    </>
                ) : (
                    <>
                    <Link href="/pedidos">
                        <View className="flex-col items-center">
                            <Image source={require('../assets/Image/Logo.png')} className="w-8 h-8 max-w-8 max-h-8" resizeMode="contain"/>
                            <Text>Solicitar</Text>
                        </View>
                    </Link>
                    <Link href="/perfil">
                        <View className="flex-col items-center">
                            <MaterialCommunityIcons name="account" size={28} color="#520C87" />
                            <Text>Perfil</Text>
                        </View>
                    </Link>
                    </> 
                )}
                </>
                
       
        </View>
    )
}