import axios from "axios";
import * as SecureStore from "expo-secure-store";

// 🟢 Mantém a sua linha original (mudando para o IP da sua máquina se testar no celular físico)
export const API_URL = "http://localhost:8000"; 

// 🟢 Cria a instância do Axios usando a sua API_URL
const api = axios.create({
  baseURL: API_URL,
});

// 🔥 O Interceptador que injeta o Token JWT automaticamente
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync("token_neweco");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.log("Erro ao buscar token no SecureStore", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 🟢 Exporta o cliente configurado para as telas usarem
export default api;