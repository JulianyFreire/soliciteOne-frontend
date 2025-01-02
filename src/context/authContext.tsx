import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router } from "expo-router";
import Modal from "../components/modal";


interface User {
    _id: number;
    name: string;
    email: string;
    document: string;
    phone: string;
  }
  
  // Interface para o contexto
  interface AuthContextType {
    isLoggedIn: boolean;
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    loading: boolean;
  }


// Cria o contexto
const defaultValue: AuthContextType = {
  isLoggedIn: false,
  user: null,
  login: async () => {
    throw new Error("login não implementado");
  },
  logout: async () => {
    throw new Error("logout não implementado");
  },
  loading: false,
};

// Criando o contexto
const AuthContext = createContext<AuthContextType>(defaultValue);

// Provider do contexto
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const [isModalVisible, setIsModalVisible] = useState(false); 
    const [modalMessage, setModalMessage] = useState(""); 
    const [modalTitle, setModalTitle] = useState(""); 

    useEffect(() => {
        const restoreSession = async () => {
          try {
            const token = await AsyncStorage.getItem("token");
            if (token) {
              const { data: userData } = await axios.get("https://api.soliciteapp.com.br/users", {
                headers: { Authorization: `Bearer ${token}` },
              });
              setUser(userData);
              setIsLoggedIn(true);
            }
          } catch (error) {
            console.error("Erro ao restaurar sessão:", error);
          } finally {
            setLoading(false);
          }
        };
        restoreSession();
      }, []);
    
      const login = async (email: string, password: string) => {
        
        setLoading(true);
        try {
          const response = await axios.post("https://api.soliciteapp.com.br/users/login", {
            email,
            password,
          });
          const { token, user } = response.data;
          console.log("Token recebido:", token);
          await AsyncStorage.setItem("token", token);
          setUser(user);
          setIsLoggedIn(true);
          setModalTitle("Sucesso");
          setModalMessage("Login realizado com sucesso!");
          setIsModalVisible(true); // Exibe o modal
          router.push("/");
        } catch (error) {
          console.error("Erro no login:", error);
          setModalTitle("Email ou senha estão incorretos");
          setModalMessage("Verifique suas informações e tente novamente.");
          setIsModalVisible(true); 
          router.push("/login");
        } finally {
          setLoading(false);
        }
      };
    
      const logout = async () => {
        await AsyncStorage.removeItem("token");
        setUser(null);
        setIsLoggedIn(false);
        router.push("/");
      };
    
      return (
        <AuthContext.Provider value={{ isLoggedIn, user, login, logout, loading }}>
          {children}
          <Modal
              isVisible={isModalVisible}
              title={modalTitle}
              message={modalMessage}
              onClose={() => setIsModalVisible(false)}
            />
        </AuthContext.Provider>
      );
    };

    export const useAuth = () => useContext(AuthContext);