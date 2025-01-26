import React, { useEffect, useState } from "react";
import { Link } from "expo-router";
import { Text, View } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const statusDetails: Record<string, { progress: number; description: string }> = {
  created: { progress: 10, description: "Solicitação criada" },
  received: { progress: 20, description: "Buscando profissional" },
  send_to_customer: { progress: 40, description: "Profissional encontrado: calculando orçamento" },
  refused_by_customer: { progress: 30, description: "Recusado pelo cliente" },
  cancelled_by_customer: { progress: 30, description: "Cancelado pelo cliente" },
  cancelled_by_admin: { progress: 30, description: "Cancelada pelo administrador" },
  accepted_by_customer: { progress: 60, description: "Aceito pelo cliente" },
  in_progress: { progress: 80, description: "Em andamento" },
  finished: { progress: 100, description: "Finalizado" },
};

export function Stats() {
  const [status, setStatus] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    const fetchSolicitation = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const { data: solicitationData } = await axios.get(
          "https://api.soliciteapp.com.br/solicitations/current",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const currentStatus = solicitationData.status;
        const statusInfo = statusDetails[currentStatus] || {
          progress: 0,
          description: "Status desconhecido",
        };

        setStatus(currentStatus);
        setDescription(statusInfo.description);
        setProgress(statusInfo.progress);
      } catch (error) {
        console.error("Erro ao buscar solicitação:", error);
      }
    };

    fetchSolicitation();
  }, []);

  return (
    <Link href="/detalhes" className="flex mx-auto">
      <View className="flex-col gap-5 w-96 bg-neutral-50 h-32 mx-auto rounded-3xl p-5 shadow-md">
        <Text>Progresso da solicitação:  {description}</Text>
        <View className="w-full bg-gray-200 my-auto rounded-full h-3">
          <View
            className="bg-secondary h-3 rounded-full"
            style={{ width: `${progress}%` }}
          ></View>
        </View>
      </View>
    </Link>
  );
}
