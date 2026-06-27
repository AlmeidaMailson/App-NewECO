import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../routes";
import { style } from "./Style";
import { theme } from "../../global/themes";

// 🟢 MUDANÇA AQUI: Importando a nossa instância JWT autenticada
import api from "../../config/api"; 

type NavigationProps = NativeStackNavigationProp<RootStackParamList, "Conversa">;

export default function Conversa() {
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute<any>();
  
  // 🟢 Recebe dinamicamente os parâmetros de quem abriu o chat
  // Caso não venha nada da rota anterior, usamos o 'Kitata' como fallback temporário
  const { 
    conversa_id, 
    usuario_id_destino, 
    name = "Kitata Anth", 
    avatar = "https://i.pravatar.cc/150?img=5",
    username = "@kitataeco"
  } = route.params ?? {};

  const [message, setMessage] = useState("");
  const [messagesList, setMessagesList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Referência para rolar o chat para baixo automaticamente
  const scrollViewRef = useRef<ScrollView>(null);

  // Criamos o objeto profile baseado nos dados reais dinâmicos
  const chatUser = {
    id: usuario_id_destino,
    name,
    username,
    avatar,
    bio: "Conversa sobre sustentabilidade e o NewECO.",
    followers: 0,
    following: 0,
    posts: [],
  };

  // 🟢 BUSCAR MENSAGENS DO BACKEND (JWT automático)
  const loadMessages = async () => {
    if (!conversa_id) {
      setLoading(false);
      return; // Se for um chat novo sem ID de conversa ainda, para aqui
    }

    try {
      // Ajuste o endpoint conforme a assinatura do seu 'mensagens_routes' do FastAPI
      const response = await api.get(`/conversas/${conversa_id}/mensagens`);
      setMessagesList(response.data ?? []);
    } catch (error: any) {
      console.log("Erro ao carregar mensagens:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
    
    // Opcional: Criar um intervalo para simular um "polling" a cada 3 segundos,
    // já que o app ainda não está usando WebSockets.
    const interval = setInterval(loadMessages, 3000);
    return () => clearInterval(interval);
  }, [conversa_id]);

  // 🟢 ENVIAR MENSAGEM PARA O BACKEND
  const sendMessage = async () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;

    try {
      // Guardamos a mensagem localmente no estado para enviar rápido na UI (Optimistic Update)
      const novaMensagemMock = {
        id: String(Date.now()),
        texto: trimmedMessage,
        somente_texto: true,
        // O backend decide quem enviou inspecionando o token JWT, 
        // mas marcamos como true localmente para renderizar à direita
        enviado_por_mim: true, 
      };

      setMessagesList((prev) => [...prev, novaMensagemMock]);
      setMessage("");

      // Envia a requisição real para a sua API do FastAPI
      // Passa o ID da conversa e o texto do schema
      await api.post(`/conversas/${conversa_id}/mensagens`, {
        texto: trimmedMessage,
        // Caso seja uma conversa nova, você passaria também o usuario_id_destino
      });

    } catch (error: any) {
      console.log("Erro ao enviar mensagem:", error.response?.data || error.message);
      Alert.alert("Erro", "Não foi possível enviar a mensagem.");
    }
  };

  const openProfile = () => {
    navigation.navigate("TelaPerfilUsuario", { user: chatUser });
  };

  return (
    <KeyboardAvoidingView
      style={style.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      {/* HEADER */}
      <View style={style.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={style.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={style.profileButton} onPress={openProfile}>
          <Image source={{ uri: chatUser.avatar }} style={style.profileImage} />

          <View style={style.profileInfo}>
            <Text style={style.name}>{chatUser.name}</Text>
            <Text style={style.username}>{chatUser.username}</Text>
          </View>
        </TouchableOpacity>

        <Text style={style.status}>Online</Text>
      </View>

      {/* ÁREA DE MENSAGENS */}
      {loading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={theme.colors.primaryLight} />
        </View>
      ) : (
        <ScrollView
          ref={scrollViewRef}
          style={style.messages}
          contentContainerStyle={style.messagesContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messagesList.length === 0 ? (
            <Text style={{ textAlign: "center", color: "#999", marginTop: 20 }}>
              Diga um Olá para iniciar a conversa!
            </Text>
          ) : (
            messagesList.map((msg) => {
              // Verifica se a mensagem foi enviada pelo usuário logado.
              // Adapte o 'msg.enviado_por_mim' ou 'msg.usuario_id === loggedUser.id' conforme seu banco
              const isMine = msg.enviado_por_mim;

              return (
                <View 
                  key={msg.id} 
                  style={isMine ? style.messageRight : style.messageLeft}
                >
                  <Text style={isMine ? style.messageRightText : style.messageText}>
                    {msg.texto}
                  </Text>
                </View>
              );
            })
          )}
        </ScrollView>
      )}

      {/* FOOTER INPUT */}
      <View style={style.inputContainer}>
        <TextInput
          placeholder="Digite uma mensagem..."
          placeholderTextColor="#999"
          style={style.input}
          value={message}
          onChangeText={setMessage}
        />

        <TouchableOpacity style={style.sendButton} onPress={sendMessage}>
          <Ionicons name="send" size={22} color={theme.colors.primaryLight} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}