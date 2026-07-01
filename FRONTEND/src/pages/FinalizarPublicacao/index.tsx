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
import { VideoView, useVideoPlayer } from "expo-video";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import { style } from "./style";
import { feedObserver } from "../../utils/FeedObserver";
import UserSession from "../../utils/UserSessions"; // 🟢 Utilizando nosso Singleton estruturado
import { RootStackParamList } from "../../routes"; // 🟢 Tipagem global de rotas
import api from "../../config/api";

type FinalizarPublicacaoRouteProp = RouteProp<RootStackParamList, "FinalizarPublicacao">;

export default function FinalizarPublicacao() {
  const navigation = useNavigation<any>();
  const route = useRoute<FinalizarPublicacaoRouteProp>();
  const { midia } = route.params;

  const player = useVideoPlayer(midia.uri, (player) => {
  player.loop = true;
});

  const [user, setUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const [titulo, setTitulo] = useState("");
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);

  // Carrega o usuário da sessão ativa ao montar a tela
  useEffect(() => {
    function loadUser() {
      const loggedUser = UserSession.getInstance().getUser();
      if (loggedUser) {
        setUser(loggedUser);
      }
      setLoadingUser(false);
    }

    loadUser();
  }, []);

  async function publicar() {
    // Validação básica de campos obrigatórios no Front-end
    if (!titulo.trim() || !caption.trim()) {
      Alert.alert("Atenção", "Preencha o título e a legenda do seu post!");
      return;
    }

    try {
      setLoading(true);

      // Instancia o FormData para envio de arquivos binários (Multipart)
      const formData = new FormData();

      // 1. Campos de texto mapeados com o backend
      formData.append("titulo", titulo);
      formData.append("legenda", caption);

      //  Adicionado o campo obrigatório que o Pydantic exige
      const tipoMidiaValor = midia.mediaType === "video" ? "video" : "image";
      formData.append("tipo_midia", tipoMidiaValor);

      // 2. Anexando o arquivo binário bruto de forma correta
      // Chave alterada para 'file' (padrão FastAPI UploadFile)
      formData.append("midia_url", {
        uri: midia.uri,
        name: midia.mediaType === "video" ? "video.mp4" : "post.jpg",
        type: midia.mediaType === "video" ? "video/mp4" : "image/jpeg",
      } as any);

      // Requisição POST injetando o cabeçalho multipart/form-data
      await api.post("/posts/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      Alert.alert("Sucesso", "Publicação compartilhada com a comunidade!");

      // Notifica a TelaHome (via padrão Observer) para recarregar o feed automaticamente
      feedObserver.notify();

      navigation.navigate("TelaHome");

    } catch (error: any) {
      //Log detalhado que abre o erro de validação (Array loc) do Pydantic no terminal
      if (error.response) {
        console.log("ERRO DETALHADO DO FASTAPI (422/500):", JSON.stringify(error.response.data, null, 2));
      } else {
        console.log("ERRO NA REQUISIÇÃO:", error.message);
      }

      const erroServidor = error.response?.data?.detail;
      const mensagemErro = typeof erroServidor === "string"
        ? erroServidor
        : "Verifique os dados preenchidos ou o tamanho do arquivo.";

      Alert.alert("Erro ao publicar", mensagemErro);
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
  <VideoView
    player={player}
    style={style.media}
    nativeControls
    contentFit="cover"
    allowsFullscreen
    allowsPictureInPicture
  />
) : (
  <Image
    source={{ uri: midia.uri }}
    style={style.media}
    resizeMode="cover"
  />
)}
      </View>

      <TextInput
        style={style.input}
        placeholder="Título do Post"
        placeholderTextColor="#999"
        value={titulo}
        onChangeText={setTitulo}
      />

      <TextInput
        style={style.input}
        placeholder="Escreva uma legenda sobre sustentabilidade..."
        placeholderTextColor="#999"
        value={caption}
        onChangeText={setCaption}
        multiline
      />

      <TouchableOpacity
        style={style.button}
        onPress={publicar}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={style.buttonText}>Publicar no NewEco</Text>
        )}
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}
