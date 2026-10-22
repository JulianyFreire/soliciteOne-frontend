import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import Modal from "../components/Modal";
import api from "../services/api";

interface User {
  _id: number | string;
  name: string;
  email: string;
  document: string;
  phone: string;
  profession?: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
  loading: boolean;
}

const defaultValue: AuthContextType = {
  isLoggedIn: false,
  user: null,
  login: async () => { throw new Error("login não implementado"); },
  logout: async () => { throw new Error("logout não implementado"); },
  updateUser: async () => { throw new Error("updateUser não implementado"); },
  loading: false,
};

const AuthContext = createContext<AuthContextType>(defaultValue);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [modalType, setModalType] = useState<"success" | "error" | "info">("info");

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const [token, savedUser] = await Promise.all([
          AsyncStorage.getItem("token"),
          AsyncStorage.getItem("user"),
        ]);
        // Remove credentials saved by older versions; the password is never needed to restore the token session.
        await AsyncStorage.multiRemove(["email", "password"]);
        if (token) {
          setUser(savedUser ? JSON.parse(savedUser) : null);
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error("Erro ao restaurar sessão:", error);
        await AsyncStorage.multiRemove(["token", "user", "email", "password"]);
        setUser(null);
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };
    void restoreSession();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await api.post("/users/login", { email, password });
      const { token, user } = response.data;
      await AsyncStorage.multiRemove(["email", "password"]);
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      setIsLoggedIn(true);
      setModalTitle("Sucesso");
      setModalMessage("Login realizado com sucesso!");
      setModalType("success");
      setIsModalVisible(true);
      router.replace("/");
    } catch (error) {
      console.error("Erro no login:", error);
      setModalTitle("Email ou senha incorretos");
      setModalMessage("Verifique suas informações e tente novamente.");
      setModalType("error");
      setIsModalVisible(true);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (data: Partial<User>) => {
    if (!user) return;
    try {
      await api.put(`/users/${user._id}`, data);
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
      setModalTitle("Sucesso");
      setModalMessage("Dados atualizados com sucesso!");
      setModalType("success");
      setIsModalVisible(true);
    } catch (error) {
      console.error("Erro ao atualizar dados:", error);
      setModalTitle("Erro");
      setModalMessage("Não foi possível salvar seus dados. Tente novamente.");
      setModalType("error");
      setIsModalVisible(true);
      throw error;
    }
  };

  const logout = async () => {
    await AsyncStorage.multiRemove(["token", "user", "email", "password"]);
    setUser(null);
    setIsLoggedIn(false);
    router.replace("/login");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout, updateUser, loading }}>
      {children}
      <Modal
        isVisible={isModalVisible}
        title={modalTitle}
        message={modalMessage}
        type={modalType}
        onClose={() => setIsModalVisible(false)}
      />
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
