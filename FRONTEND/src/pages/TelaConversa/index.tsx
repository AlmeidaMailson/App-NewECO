import React, { useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import {
  useRoute,
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";

import { useEffect } from "react";

import api from "../../config/api";
import { styles } from "./style";
import { theme } from "../../global/themes";
import UserSession from "../../utils/UserSessions";

interface Mensagem {
  id: number;
  remetente_id: number;
  conversa_id: number;
  mensagem: string;
  criado_em: string;
  lida: boolean;
}

export default function TelaConversa() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const { conversaId, usuario } = route.params;

  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [texto, setTexto] = useState("");

  const flatListRef = useRef<FlatList>(null);

  const usuarioLogado = UserSession.getInstance().getUser()?.id;

  useFocusEffect(
    React.useCallback(() => {
      carregarMensagens();
    }, []),
  );

  //   Atualizar automaticamente
  useEffect(() => {
    const intervalo = setInterval(() => {
      carregarMensagens();
    }, 2000);

    return () => clearInterval(intervalo);
  }, []);

  async function carregarMensagens() {
    try {
      const response = await api.get(`/mensagens/${conversaId}`);

      //   Não atualizar sem necessidade
      //   tela só renderiza novamente quando realmente houver mensagens novas.
      setMensagens((mensagensAtuais) => {
        if (JSON.stringify(mensagensAtuais) === JSON.stringify(response.data)) {
          return mensagensAtuais;
        }

        return response.data;
      });

      if (response.data.length !== mensagens.length) {
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({
            animated: true,
          });
        }, 200);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function enviarMensagem() {
    if (texto.trim() === "") return;

    try {
      await api.post("/mensagens", {
        conversa_id: conversaId,
        mensagem: texto,
      });

      setTexto("");

      carregarMensagens();
    } catch (error: any) {
      console.log(error.response?.data || error.message);
    }
  }

  function renderMensagem({ item }: { item: Mensagem }) {
    const minhaMensagem = item.remetente_id === usuarioLogado;

    return (
      <View
        style={[styles.balao, minhaMensagem ? styles.direita : styles.esquerda]}
      >
        <Text style={styles.texto}>{item.mensagem}</Text>

        <Text style={styles.horario}>
          {new Date(item.criado_em).toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons
            name="arrow-back"
            size={26}
            color={theme.colors.primaryDark}
          />
        </TouchableOpacity>

        <Ionicons
          name="person-circle"
          size={50}
          color={theme.colors.primaryDark}
          style={{ marginLeft: 10 }}
        />

        <Text style={styles.nome}>{usuario.nome}</Text>
      </View>

      {/* Lista de mensagens */}
      <FlatList
        ref={flatListRef}
        data={mensagens}
        renderItem={renderMensagem}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.lista}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({
            animated: true,
          })
        }
      />

      {/* Rodapé */}
      <View style={styles.footer}>
        <TextInput
          style={styles.input}
          placeholder="Digite uma mensagem..."
          value={texto}
          onChangeText={setTexto}
        />

        <TouchableOpacity style={styles.botao} onPress={enviarMensagem}>
          <Ionicons name="send" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
