import axios from "axios";
import * as SecureStore from "expo-secure-store";

export const API_URL = "https://comment-geologist-image.ngrok-free.dev" ; // ou "http://192.168.1.X:8000" para teste em rede local

//  Cria a instância do Axios usando a sua API_URL
const api = axios.create({
  baseURL: API_URL,
});

// O Interceptador que injeta o Token JWT automaticamente
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