import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert
} from "react-native";
import { Video, ResizeMode } from "expo-av";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { style } from "./style";
import { feedObserver } from "../../utils/FeedObserver";


import api from "../../config/api";

export default function FinalizarPublicacao() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { midia } = route.params;

  const [user, setUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const [titulo, setTitulo] = useState("");
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadUser() {
      try {
        const data = await AsyncStorage.getItem("user");

        if (data) {
          const parsed = JSON.parse(data);
          const loggedUser = parsed?.user ?? parsed;
          setUser(loggedUser);
          console.log("USER LOGADO:", loggedUser);
        } else {
          console.log("Nenhum usuário logado");
        }

      } catch (err) {
        console.log("Erro ao carregar usuário:", err);
      } finally {
        setLoadingUser(false);
      }
    }

    loadUser();
  }, []);

  async function publicar() {
    // Validação básica antes de subir
    if (!titulo.trim() || !caption.trim()) {
      Alert.alert("Atenção", "Preencha o título e a legenda do seu post!");
      return;
    }

    try {
      setLoading(true);

      // multipart form data normalmente para carregar a foto/vídeo
      const formData = new FormData();

      // 🟢 REMOVIDO: formData.append("usuario_id", ...) -> O backend descobre quem posta pelo Token JWT!
      formData.append("titulo", titulo);
      formData.append("legenda", caption);

      formData.append("midia_url", {
        uri: midia.uri,
        name: midia.mediaType === "video" ? "video.mp4" : "post.jpg",
        type: midia.mediaType === "video" ? "video/mp4" : "image/jpeg",
      } as any);

      console.log("Enviando publicação via Axios (Multipart Form Data)...");

      // instância 'api' injetando o cabeçalho 'multipart/form-data'
      const response = await api.post("/posts/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("STATUS:", response.status);
      console.log("RESPOSTA:", response.data);

      Alert.alert("Sucesso", "Publicação compartilhada com a comunidade!");
      feedObserver.notify();
      navigation.navigate("TelaHome");

    } catch (error: any) {
      console.log("ERRO AO PUBLICAR:", error.response?.data || error.message);
      
      const erroServidor = error.response?.data?.detail ?? "Não foi possível salvar o seu post.";
      Alert.alert("Erro ao publicar", erroServidor);
    } finally {
      setLoading(false);
    }
  }

  if (loadingUser) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0D1117" }}>
        <ActivityIndicator color="#00B89A" size="large" />
        <Text style={{ color: "#fff", marginTop: 10 }}>Carregando usuário...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={style.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={style.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>

        <Text style={style.title}>Finalizar</Text>
      </View>

      <View style={style.mediaBox}>
        {midia.mediaType === "video" ? (
          <Video
            source={{ uri: midia.uri }}
            style={style.media}
            useNativeControls
            resizeMode={ResizeMode.COVER}
          />
        ) : (
          <Image source={{ uri: midia.uri }} style={style.media} />
        )}
      </View>

      <TextInput
        style={style.input}
        placeholder="Título"
        placeholderTextColor="#999"
        value={titulo}
        onChangeText={setTitulo}
      />

      <TextInput
        style={style.input}
        placeholder="Legenda"
        placeholderTextColor="#999"
        value={caption}
        onChangeText={setCaption}
      />

      <TouchableOpacity
        style={style.button}
        onPress={publicar}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={style.buttonText}>Publicar</Text>
        )}
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}