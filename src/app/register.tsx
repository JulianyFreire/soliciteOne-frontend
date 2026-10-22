import { ActivityIndicator, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import Modal from "../components/Modal";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { Header } from "../components/Header";
import { CARD_SHADOW } from "../styles/shadow";
import api from "../services/api";

export default function Cadastro() {

    const [name, setNome] = useState('');
    const [profession, setProfession] = useState('');
    const [document, setCpf] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setTelefone] = useState('');
    const [password, setSenha] = useState('');
    const [confirmPassword, setConfirmSenha] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [modalTitle, setModalTitle] = useState("");
    const [modalType, setModalType] = useState<"success" | "error" | "info">("info");
    const [loading, setLoading] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);

    const borderClass = (field: string) =>
        focusedField === field ? 'border-2 border-primary' : 'border border-InputBorder';

    const handleCadastro = async () => {

        if (!name.trim() || !profession.trim() || !email.trim() || !document.trim() || !phone.trim() || !password || !confirmPassword) {
            setModalTitle("Campos obrigatórios");
            setModalMessage("Preencha todos os campos para criar sua conta.");
            setModalType("error");
            setIsModalVisible(true);
            return;
        }

        if (password !== confirmPassword) {
            setModalTitle("Senhas diferentes");
            setModalMessage("As senhas digitadas devem ser iguais.");
            setModalType("error");
            setIsModalVisible(true);
            return;
        }
        
        try {
            setLoading(true);
            await api.post('/users', {
                name,
                profession,
                email,
                password,
                phone,
                document,
            });

            setModalTitle("Bem Vindo ao Solicite");
            setModalMessage("Cadastro realizado com sucesso!");
            setModalType("success");
            setIsModalVisible(true);
            // Navigate after the success message closes.
        } catch (error) {
            // Exibir mensagem de erro
            setModalTitle("Cadastro não realizado");
            setModalMessage("Não foi possível criar sua conta. Confira os dados e tente novamente.");
            setModalType("error");
            setIsModalVisible(true);
            console.log('Erro no cadastro');
        } finally {
            setLoading(false);
        }
    };

    const formatCpf = (value: string): string => {
        return value
          .replace(/\D/g, '') // Remove caracteres não numéricos
          .replace(/(\d{3})(\d)/, '$1.$2') // Adiciona o primeiro ponto
          .replace(/(\d{3})(\d)/, '$1.$2') // Adiciona o segundo ponto
          .replace(/(\d{3})(\d{1,2})$/, '$1-$2') // Adiciona o traço
          .substring(0, 14); // Limita o tamanho máximo
      };

      const formatPhoneNumber = (value: string): string => {
        return value
          .replace(/\D/g, '') // Remove caracteres não numéricos
          .replace(/(\d{2})(\d)/, '($1) $2') // Adiciona parênteses ao DDD
          .replace(/(\d{5})(\d)/, '$1-$2') // Adiciona o traço após os 5 dígitos
          .substring(0, 15); // Limita o tamanho máximo
      };

    return (
        <ScrollView>

            <View className="flex-1">
                <Header title="Cadastre-se" />
                <View className="w-full max-w-md self-center px-6">
                    <View className="bg-surface rounded-2xl p-6" style={CARD_SHADOW}>

                    <View>
                        <Text className="text-sm font-medium text-inputText p-2">Profissão</Text>
                        <TextInput
                            className={`bg-background border border-borderColor rounded-xl p-3 mb-2 text-inputText ${borderClass('profession')}`}
                            value={profession}
                            onChangeText={setProfession}
                            onFocus={() => setFocusedField('profession')}
                            onBlur={() => setFocusedField(null)}
                        />
                    </View>

                    <View>
                        <Text className="text-sm font-medium text-inputText p-2">Nome Completo</Text>
                        <TextInput
                            className={`bg-background border border-borderColor rounded-xl p-3 mb-2 text-inputText ${borderClass('name')}`}
                            value={name}
                            onChangeText={setNome}
                            onFocus={() => setFocusedField('name')}
                            onBlur={() => setFocusedField(null)}
                        />
                    </View>

                    <View>
                        <Text className="text-sm font-medium text-inputText p-2">E-mail</Text>
                        <TextInput
                            className={`bg-background border border-borderColor rounded-xl p-3 mb-2 text-inputText ${borderClass('email')}`}
                            value={email}
                            onChangeText={setEmail}
                            onFocus={() => setFocusedField('email')}
                            onBlur={() => setFocusedField(null)}
                        />
                    </View>

                    <View>
                        <Text className="text-sm font-medium text-inputText p-2">CPF</Text>
                        <TextInput
                            className={`bg-background border border-borderColor rounded-xl p-3 mb-2 text-inputText ${borderClass('document')}`}
                            value={document}
                            onChangeText={(text: string) => setCpf(formatCpf(text))}
                            onFocus={() => setFocusedField('document')}
                            onBlur={() => setFocusedField(null)}
                        />
                    </View>

                    <View>
                        <Text className="text-sm font-medium text-inputText p-2">Telefone</Text>
                        <TextInput
                            className={`bg-background border border-borderColor rounded-xl p-3 mb-2 text-inputText ${borderClass('phone')}`}
                            value={phone}
                            onChangeText={(text: string) => setTelefone(formatPhoneNumber(text))}
                            onFocus={() => setFocusedField('phone')}
                            onBlur={() => setFocusedField(null)}
                        />
                    </View>

                    <View>
                        <Text className="text-sm font-medium text-inputText p-2">Senha</Text>
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
                    <ActivityIndicator size="large" color="#90CAF9" className="p-10"/>
                ) : (
                    <View className="w-full max-w-md self-center px-6 mt-4 items-center">
                        <TouchableOpacity
                            className="w-full rounded-xl bg-secondary p-3 items-center mb-3"
                            onPress={handleCadastro}
                        >
                            <Text className="text-primary font-semibold text-base">Criar conta</Text>
                        </TouchableOpacity>
                    </View>
                )}

            </View>
            <Modal
                isVisible={isModalVisible}
                title={modalTitle}
                message={modalMessage}
                onClose={() => {
                    setIsModalVisible(false);
                    if (modalType === 'success') router.replace('/login');
                }}
            />
        </ScrollView>
    );
}
