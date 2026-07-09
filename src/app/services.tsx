import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Header } from "../components/Header";
import { NavbarGestao } from "../components/Navbar";
import { InputBase } from "../components/Input";
import Modal from "../components/Modal";
import api from "../services/api";

interface Category {
    _id: string;
    name: string;
}

interface Service {
    _id: string;
    name: string;
    value: number;
    duration: string;
    active: boolean;
    category: Category;
}

const fmtCurrency = (v: number) =>
    "R$ " + v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function Servicos() {
    const [services, setServices] = useState<Service[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [saving, setSaving] = useState(false);

    const [categoryId, setCategoryId] = useState('');
    const [name, setName] = useState('');
    const [value, setValue] = useState('');
    const [duration, setDuration] = useState('');

    const [feedbackVisible, setFeedbackVisible] = useState(false);
    const [feedbackTitle, setFeedbackTitle] = useState('');
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [feedbackType, setFeedbackType] = useState<"success" | "error">("error");

    const loadServices = () => {
        setLoading(true);
        api.get('/services')
            .then(res => setServices(res.data))
            .catch(() => {
                setFeedbackTitle('Erro');
                setFeedbackMessage('Não foi possível carregar seus serviços.');
                setFeedbackType('error');
                setFeedbackVisible(true);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadServices();
        api.get('/categories').then(res => setCategories(res.data)).catch(() => setCategories([]));
    }, []);

    const resetForm = () => {
        setCategoryId('');
        setName('');
        setValue('');
        setDuration('');
    };

    const save = async () => {
        if (!categoryId || !name || !value || !duration) return;
        setSaving(true);
        try {
            await api.post('/services', {
                category: categoryId,
                name,
                value: Number(value.replace(',', '.')) || 0,
                duration,
            });
            resetForm();
            setShowModal(false);
            loadServices();
        } catch (error) {
            setFeedbackTitle('Erro');
            setFeedbackMessage('Não foi possível salvar o serviço. Confira os campos e tente novamente.');
            setFeedbackType('error');
            setFeedbackVisible(true);
        } finally {
            setSaving(false);
        }
    };

    const remove = async (id: string) => {
        try {
            await api.delete(`/services/${id}`);
            setServices(prev => prev.filter(s => s._id !== id));
        } catch (error) {
            setFeedbackTitle('Erro');
            setFeedbackMessage('Não foi possível remover o serviço.');
            setFeedbackType('error');
            setFeedbackVisible(true);
        }
    };

    return (
        <View className="flex-1 bg-background">
            <Header title="Meus Serviços" />

            <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                <View className="w-full max-w-md self-center px-6">
                    {loading ? (
                        <View className="items-center py-10">
                            <ActivityIndicator size="large" color="#1E3A8A" />
                        </View>
                    ) : services.length === 0 ? (
                        <View className="bg-surface rounded-2xl p-8 items-center" style={{ elevation: 1 }}>
                            <Ionicons name="pricetags-outline" size={40} color="#D1D5DB" />
                            <Text className="text-gray-400 text-sm mt-2">Você ainda não cadastrou nenhum serviço</Text>
                        </View>
                    ) : (
                        services.map(service => (
                            <View
                                key={service._id}
                                className="flex-row justify-between items-center bg-surface rounded-2xl p-4 mb-3"
                                style={{ elevation: 1, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 6 }}
                            >
                                <View className="flex-1">
                                    <Text className="text-base font-semibold text-inputText">{service.name}</Text>
                                    <Text className="text-xs text-gray-400 mt-0.5">
                                        {service.category?.name} · {service.duration}
                                    </Text>
                                </View>
                                <Text className="text-sm font-bold text-primary mr-3">{fmtCurrency(service.value)}</Text>
                                <TouchableOpacity onPress={() => remove(service._id)}>
                                    <Ionicons name="trash-outline" size={20} color="#DC2626" />
                                </TouchableOpacity>
                            </View>
                        ))
                    )}

                    <TouchableOpacity
                        className="flex-row items-center justify-center border border-dashed border-primary rounded-2xl p-4 mt-2"
                        onPress={() => setShowModal(true)}
                    >
                        <Ionicons name="add-circle-outline" size={20} color="#1E3A8A" />
                        <Text className="text-primary font-medium ml-2">Novo Serviço</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {showModal && (
                <View className="absolute inset-0 items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}>
                    <View className="bg-surface rounded-3xl p-6 w-11/12 max-w-md items-center">
                        <Text className="text-lg font-semibold text-primary self-start mb-4">Novo Serviço</Text>

                        <InputBase
                            label="Categoria"
                            value={categoryId}
                            onChangeText={setCategoryId}
                            options={categories.map(c => ({ label: c.name, value: c._id }))}
                        />
                        <InputBase
                            label="Nome do serviço"
                            value={name}
                            onChangeText={setName}
                            placeholder="Ex: Manicure"
                        />
                        <InputBase
                            label="Valor (R$)"
                            value={value}
                            onChangeText={setValue}
                            placeholder="45,00"
                        />
                        <InputBase
                            label="Duração"
                            value={duration}
                            onChangeText={setDuration}
                            placeholder="1h"
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
