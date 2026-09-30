import { Text, TextInput, View, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { router } from 'expo-router';
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import Modal from "../components/Modal";
import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import { Header } from "../components/Header";
import { CARD_SHADOW } from "../styles/shadow";

export default function NovaSenha() {

    const [code, setCode] = useState('');
    const [password, setSenha] = useState('');
    const [confirmPassword, setConfirmSenha] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [modalTitle, setModalTitle] = useState("");
    const [modalType, setModalType] = useState<"success" | "error" | "info">("error");
    const [focusedField, setFocusedField] = useState<string | null>(null);

    const { email } = useLocalSearchParams<{ email?: string }>();
    const [loading, setLoading] = useState(false);

    const borderClass = (field: string) =>
        focusedField === field ? 'border-2 border-primary' : 'border border-InputBorder';

    const updatePassword = async () => {

        if (password !== confirmPassword) {
            setModalTitle("Senhas diferentes");
            setModalMessage("As senhas digitadas devem ser iguais.");
            setModalType("error");
            setIsModalVisible(true);
            return;
        }

        if (!email) {
            setModalTitle("Erro");
            setModalMessage("Parâmetro de email não encontrado.");
            setModalType("error");
            setIsModalVisible(true);
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post('https://api.soliciteapp.com.br/users/confirm-recovery-password', {
                email,
                code,
                password
            });

            router.push("/login");
            console.log(password);
        } catch (error) {
            console.error("Erro ao enviar email:", error);
            setModalTitle("Erro");
            setModalMessage("Erro ao trocar senha, certifique-se que seja um codigo valido.");
            setModalType("error");
            setIsModalVisible(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView>
            <View className="flex-1">
                <Header title="Crie uma nova senha" />
                <View className="w-full max-w-md self-center px-6">
                    <View className="bg-surface rounded-2xl p-6" style={CARD_SHADOW}>
                    <View>
                        <Text className="text-sm font-medium text-inputText p-2">Código</Text>
                        <TextInput
                            className={`bg-background border border-borderColor rounded-xl p-3 mb-2 text-inputText ${borderClass('code')}`}
                            value={code}
                            onChangeText={setCode}
                            onFocus={() => setFocusedField('code')}
                            onBlur={() => setFocusedField(null)}
                        />
                    </View>

                    <View>
                        <Text className="text-sm font-medium text-inputText p-2">Nova Senha</Text>
                        <View className="relative">
                            <TextInput
                                className={`bg-background border border-borderColor rounded-xl p-3 mb-2 text-inputText ${borderClass('password')}`}
                                value={password}
                                onChangeText={setSenha}
                                secureTextEntry={!isPasswordVisible}
                                onFocus={() => setFocusedField('password')}
                                onBlur={() => setFocusedField(null)}
                            />
                            <TouchableOpacity
                                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                                className="absolute right-4 top-6 -translate-y-1/2"
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                accessibilityLabel={isPasswordVisible ? 'Ocultar senha' : 'Mostrar senha'}
                                accessibilityRole="button"
                            >
                                <Ionicons
                                    name={isPasswordVisible ? 'eye' : 'eye-off'}
                                    size={20}
                                    color="#90CAF9"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View>
                        <Text className="text-sm font-medium text-inputText p-2">Confirmar Senha</Text>
                        <View className="relative">
                            <TextInput
                                className={`bg-background border border-borderColor rounded-xl p-3 mb-2 text-inputText ${borderClass('confirmPassword')}`}
                                value={confirmPassword}
                                onChangeText={setConfirmSenha}
                                secureTextEntry={!isConfirmPasswordVisible}
                                onFocus={() => setFocusedField('confirmPassword')}
                                onBlur={() => setFocusedField(null)}
                            />
                            <TouchableOpacity
                                onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                                className="absolute right-4 top-6 -translate-y-1/2"
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                accessibilityLabel={isConfirmPasswordVisible ? 'Ocultar senha' : 'Mostrar senha'}
                                accessibilityRole="button"
                            >
                                <Ionicons
                                    name={isConfirmPasswordVisible ? 'eye' : 'eye-off'}
                                    size={20}
                                    color="#90CAF9"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    </View>
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color="#90CAF9" className="p-10" />
                ) : (
                    <View className="w-full max-w-md self-center px-6 mt-4 items-center">
                        <TouchableOpacity
                            className="w-full rounded-xl bg-secondary p-3 items-center mb-3"
                            onPress={updatePassword}
                        >
                            <Text className="text-primary font-semibold text-base">Atualizar senha</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
            <Modal
                isVisible={isModalVisible}
                title={modalTitle}
                message={modalMessage}
                type={modalType}
                onClose={() => setIsModalVisible(false)}
            />
        </ScrollView>
    );
}