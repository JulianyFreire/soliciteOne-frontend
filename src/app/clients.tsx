import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Header } from "../components/Header";
import { NavbarGestao } from "../components/Navbar";
import { InputBase } from "../components/Input";
import Modal from "../components/Modal";
import api from "../services/api";

interface Client {
    _id: string;
    name: string;
    phone: string;
}

const formatPhoneNumber = (value: string): string => {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .substring(0, 15);
};

export default function Clientes() {
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [saving, setSaving] = useState(false);

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');

    const [feedbackVisible, setFeedbackVisible] = useState(false);
    const [feedbackTitle, setFeedbackTitle] = useState('');
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [feedbackType, setFeedbackType] = useState<"success" | "error">("error");

    const loadClients = () => {
        setLoading(true);
        api.get('/clients')
            .then(res => setClients(res.data))
            .catch(() => {
                setFeedbackTitle('Erro');
                setFeedbackMessage('Não foi possível carregar seus clientes.');
                setFeedbackType('error');
                setFeedbackVisible(true);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadClients();
    }, []);

    const resetForm = () => {
        setName('');
        setPhone('');
    };

    const save = async () => {
        if (!name || !phone) return;
        setSaving(true);
        try {
            await api.post('/clients', { name, phone });
            resetForm();
            setShowModal(false);
            loadClients();
        } catch (error) {
            setFeedbackTitle('Erro');
            setFeedbackMessage('Não foi possível salvar o cliente. Confira os campos e tente novamente.');
            setFeedbackType('error');
            setFeedbackVisible(true);
        } finally {
            setSaving(false);
        }
    };

    const remove = async (id: string) => {
        try {
            await api.delete(`/clients/${id}`);
            setClients(prev => prev.filter(c => c._id !== id));
        } catch (error) {
            setFeedbackTitle('Erro');
            setFeedbackMessage('Não foi possível remover o cliente.');
            setFeedbackType('error');
            setFeedbackVisible(true);
        }
    };

    return (
        <View className="flex-1 bg-background">
            <Header title="Meus Clientes" />

            <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                <View className="w-full max-w-md self-center px-6">
                    {loading ? (
                        <View className="items-center py-10">
                            <ActivityIndicator size="large" color="#1E3A8A" />
                        </View>
                    ) : clients.length === 0 ? (
                        <View className="bg-surface rounded-2xl p-8 items-center" style={{ elevation: 1 }}>
                            <Ionicons name="people-outline" size={40} color="#D1D5DB" />
                            <Text className="text-gray-400 text-sm mt-2">Você ainda não cadastrou nenhum cliente</Text>
                        </View>
                    ) : (
                        clients.map(client => (
                            <View
                                key={client._id}
                                className="flex-row justify-between items-center bg-surface rounded-2xl p-4 mb-3"
                                style={{ elevation: 1, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 6 }}
                            >
                                <View className="flex-1">
                                    <Text className="text-base font-semibold text-inputText">{client.name}</Text>
                                    <Text className="text-xs text-gray-400 mt-0.5">{client.phone}</Text>
                                </View>
                                <TouchableOpacity onPress={() => remove(client._id)}>
                                    <Ionicons name="trash-outline" size={20} color="#DC2626" />
                                </TouchableOpacity>
                            </View>
                        ))
                    )}

                    <TouchableOpacity
                        className="flex-row items-center justify-center border border-dashed border-primary rounded-2xl p-4 mt-2"
                        onPress={() => setShowModal(true)}
                    >
                        <Ionicons name="person-add-outline" size={20} color="#1E3A8A" />
                        <Text className="text-primary font-medium ml-2">Novo Cliente</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {showModal && (
                <View className="absolute inset-0 items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}>
                    <View className="bg-surface rounded-3xl p-6 w-11/12 max-w-md items-center">
                        <Text className="text-lg font-semibold text-primary self-start mb-4">Novo Cliente</Text>

                        <InputBase
                            label="Nome"
                            value={name}
                            onChangeText={setName}
                            placeholder="Nome do cliente"
                        />
                        <InputBase
                            label="Telefone"
                            value={phone}
                            onChangeText={(t) => setPhone(formatPhoneNumber(t))}
                            placeholder="(84) 9 9999-0000"
                        />

                        <View className="flex-row mt-2" style={{ gap: 10 }}>
                            <TouchableOpacity
                                className="flex-1 rounded-xl border border-InputBorder p-3 items-center"
                                onPress={() => { resetForm(); setShowModal(false); }}
                                disabled={saving}
                            >
                                <Text className="text-inputText font-medium">Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                className="flex-1 rounded-xl bg-secondary p-3 items-center"
                                onPress={save}
                                disabled={saving}
                            >
                                <Text className="text-primary font-semibold">
                                    {saving ? 'Salvando...' : 'Salvar'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}

            <Modal
                isVisible={feedbackVisible}
                title={feedbackTitle}
                message={feedbackMessage}
                type={feedbackType}
                onClose={() => setFeedbackVisible(false)}
            />

            <NavbarGestao />
        </View>
    );
}
