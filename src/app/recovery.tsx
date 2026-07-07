import { Text, TextInput, View, TouchableOpacity, ActivityIndicator, ScrollView } from "react-native";
import { router } from 'expo-router';
import { useState } from "react";
import axios from "axios";
import Modal from "../components/Modal";
import { Header } from "../components/Header";

export default function RecuperarSenha() {

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [modalTitle, setModalTitle] = useState("");
    const [modalType, setModalType] = useState<"success" | "error" | "info">("error");
    const [focusedField, setFocusedField] = useState<string | null>(null);

    const borderClass = (field: string) =>
        focusedField === field ? 'border-2 border-primary' : 'border border-InputBorder';

    const sendMail = async () => {

        if (!email) {
            setModalTitle("Erro");
            setModalMessage("Preencha o campo de email para alterar sua senha");
            setIsModalVisible(true);
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post('https://api.soliciteapp.com.br/users/recovery-password', {
                email
            });

            // Navegar para a tela de nova senha passando o email como parâmetro
            router.push({
                pathname: "/newPassword",
                params: { email },
            });

            console.log(email);
        } catch (error) {
            console.error("Erro ao enviar email:", error);
            setModalTitle("Erro");
            setModalMessage("Erro no envio do email, certifique-se que é um email existente");
            setIsModalVisible(true);

        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView>
            <View className="flex-1">
                <Header title="Recuperação de senha" />
                <View className="w-full max-w-md self-center px-6">
                    <View>
                        <Text className="text-xl font-medium text-inputText p-2">
                            E-mail<Text className="text-red-500">*</Text>
                        </Text>
                        <TextInput
                            className={`bg-background border border-borderColor rounded-xl p-3 mb-2 text-inputText ${borderClass('email')}`}
                            value={email}
                            onChangeText={setEmail}
                            onFocus={() => setFocusedField('email')}
                            onBlur={() => setFocusedField(null)}
                        />
                    </View>
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color="#90CAF9" className="p-10" />
                ) : (
                    <View className="w-full max-w-md self-center px-6 mt-4 items-center">
                        <TouchableOpacity
                            className="w-full rounded-xl bg-secondary p-3 items-center mb-3"
                            onPress={sendMail}
                        >
                            <Text className="text-primary font-semibold text-xl">Continuar</Text>
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