import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from "react-native";
import { Video, ResizeMode } from "expo-av";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { style } from "./style";
import { feedObserver } from "../../utils/FeedObserver";

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
          setUser(parsed);
          console.log("USER LOGADO:", parsed);
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
    try {
      setLoading(true);

      if (!user?.id) {
        console.log("Usuário não encontrado");
        return;
      }

      const formData = new FormData();

      formData.append("usuario_id", String(user.id));
      formData.append("titulo", titulo);
      formData.append("legenda", caption);

      formData.append("midia", {
        uri: midia.uri,
        name: midia.mediaType === "video" ? "video.mp4" : "post.jpg",
        type: midia.mediaType === "video" ? "video/mp4" : "image/jpeg",
      } as any);

      console.log("USER ID:", user?.id);
      const response = await fetch(
        "http://192.168.0.10:8000/posts/",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      console.log("STATUS:", response.status);
      console.log("RESPOSTA:", data);

      feedObserver.notify();
      navigation.navigate("TelaHome");

    } catch (error) {
      console.log("ERRO AO PUBLICAR:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loadingUser) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator color="#fff" />
        <Text style={{ color: "#fff" }}>Carregando usuário...</Text>
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