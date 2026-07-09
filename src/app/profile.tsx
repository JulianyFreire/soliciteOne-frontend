import { useState } from "react";
import { Text, View, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { router } from "expo-router";
import { useAuth } from "../contexts/AuthContext";
import { NavbarGestao } from "../components/Navbar";
import { Header } from "../components/Header";
import Ionicons from '@expo/vector-icons/Ionicons';

function InfoRow({ label, value }: { label: string; value?: string }) {
    return (
        <View>
            <Text className="text-xl font-medium text-inputText p-2">{label}</Text>
            <View className="bg-background border border-borderColor rounded-xl p-3 mb-2">
                <Text className="text-inputText">{value || '-'}</Text>
            </View>
        </View>
    );
}

type FormState = {
    profession: string;
    name: string;
    email: string;
    document: string;
    phone: string;
};

export default function Perfil() {

    const { user, logout, updateUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const [form, setForm] = useState<FormState>({
        profession: user?.profession || '',
        name: user?.name || '',
        email: user?.email || '',
        document: user?.document || '',
        phone: user?.phone || '',
    });

    const fields: { key: keyof FormState; label: string }[] = [
        { key: 'profession', label: 'Profissão' },
        { key: 'name', label: 'Nome completo' },
        { key: 'email', label: 'E-mail' },
        { key: 'document', label: 'CPF' },
        { key: 'phone', label: 'Telefone' },
    ];

    const borderClass = (field: string) =>
        focusedField === field ? 'border-2 border-primary' : 'border border-InputBorder';

    const resetForm = () => {
        setForm({
            profession: user?.profession || '',
            name: user?.name || '',
            email: user?.email || '',
            document: user?.document || '',
            phone: user?.phone || '',
        });
    };

    const startEditing = () => {
        resetForm();
        setIsEditing(true);
    };

    const cancelEditing = () => {
        resetForm();
        setIsEditing(false);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await updateUser(form);
            setIsEditing(false);
        } catch (error) {
            // erro já é sinalizado pelo modal de feedback do authContext
        } finally {
            setSaving(false);
        }
    };

    return (
        <View className="flex-1 bg-background">
            <Header title="Minha conta"/>
            <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
                <View className="w-full max-w-md self-center px-6 mt-6">
                    <View
                        className="bg-white rounded-2xl p-5"
                        style={{ elevation: 3, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10 }}
                    >
                        <View className="flex-row justify-end items-center mb-4">
                            {!isEditing && (
                                <TouchableOpacity onPress={startEditing}>
                                    <Ionicons name="create-outline" size={22} color="#1E3A8A" />
                                </TouchableOpacity>
                            )}
                        </View>

                        {isEditing
                            ? fields.map(({ key, label }) => (
                                <View key={key}>
                                    <Text className="text-xl font-medium text-inputText p-2">{label}</Text>
                                    <TextInput
                                        className={`bg-background border border-borderColor rounded-xl p-3 mb-2 text-inputText ${borderClass(key)}`}
                                        value={form[key]}
                                        onChangeText={(text) => setForm(prev => ({ ...prev, [key]: text }))}
                                        onFocus={() => setFocusedField(key)}
                                        onBlur={() => setFocusedField(null)}
                                    />
                                </View>
                            ))
                            : fields.map(({ key, label }) => (
                                <InfoRow key={key} label={label} value={form[key]} />
                            ))
                        }

                        {isEditing && (
                            <View className="flex-row mt-2" style={{ gap: 10 }}>
                                <TouchableOpacity
                                    className="flex-1 rounded-xl border border-InputBorder p-3 items-center"
                                    onPress={cancelEditing}
                                    disabled={saving}
                                >
                                    <Text className="text-inputText font-medium">Cancelar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    className="flex-1 rounded-xl bg-secondary p-3 items-center"
                                    onPress={handleSave}
                                    disabled={saving}
                                >
                                    <Text className="text-primary font-semibold">
                                        {saving ? 'Salvando...' : 'Salvar'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>

                    <TouchableOpacity
                        className="flex-row items-center self-center border border-InputBorder rounded-full px-5 py-2 mt-8"
                        onPress={() => router.push('/services')}
                    >
                        <Ionicons name="pricetags-outline" size={18} color="#1E3A8A" />
                        <Text className="text-primary font-medium ml-2">Meus Serviços</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="flex-row items-center self-center border border-InputBorder rounded-full px-5 py-2 mt-3"
                        onPress={() => router.push('/clients')}
                    >
                        <Ionicons name="people-outline" size={18} color="#1E3A8A" />
                        <Text className="text-primary font-medium ml-2">Meus Clientes</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="flex-row items-center self-center border border-InputBorder rounded-full px-5 py-2 mt-3"
                        onPress={logout}
                    >
                        <Ionicons name="log-out-outline" size={18} color="#1E3A8A" />
                        <Text className="text-primary font-medium ml-2">Sair</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <NavbarGestao />
        </View>
    );
}