import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { theme } from "../../global/themes";
import { styles } from "./style";

// CORREÇÃO: Usando nossa instância autenticada da API
import api from "../../config/api";

type Notification = {
  id: string;
  type: "like" | "comment" | "mission" | "reward";
  text: string;
  read: boolean;
  time?: string; // Campo opcional para trazer datas formatadas do back
};

export default function TelaNotificacao() {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  // Carrega as notificações do banco toda vez que o usuário focar a tela
  useFocusEffect(
    React.useCallback(() => {
      const buscarNotificacoes = async () => {
        try {
          // O token JWT no interceptor garante que o FastAPI trará apenas as notificações do usuário logado
          const response = await api.get("/notificacoes/");
          console.log(JSON.stringify(response.data, null, 2));

          const notificacoes = response.data.map((item: any) => ({
            id: String(item.id),
            type: item.tipo,
            text: item.mensagem,
            read: item.lida,
            time: new Date(item.criado_em).toLocaleString(),
          }));

          setNotifications(notificacoes);
        } catch (error: any) {
          console.error(
            "Erro ao buscar notificações do usuário:",
            error.message,
          );
        } finally {
          setLoading(false);
        }
      };

      buscarNotificacoes();
    }, []),
  );

  const getIcon = (type: string) => {
  switch (type.toUpperCase()) {
    case "SEGUIDOR":
      return "person-add";

    case "CURTIDA":
      return "heart";

    case "COMENTARIO":
      return "chatbubble";

    case "COMPARTILHAMENTO":
      return "share-social";

    case "MISSAO":
      return "leaf";

    case "RECOMPENSA":
      return "trophy";

    default:
      return "notifications";
  }
};

  // Atualiza o status de leitura de forma persistente no servidor
  const markAsRead = async (id: string) => {
    try {
      // Otimismo na UI: atualiza localmente na hora para dar feedback instantâneo
      setNotifications((items) =>
        items.map((item) => (item.id === id ? { ...item, read: true } : item)),
      );

      // Dispara a alteração para persistir no FastAPI
      await api.patch(`/notificacoes/${id}/ler`);
    } catch (error: any) {
      console.log(
        "Erro ao marcar notificação como lida no back:",
        error.message,
      );
    }
  };

  const renderItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity style={styles.item} onPress={() => markAsRead(item.id)}>
      <View style={styles.iconBox}>
        <Ionicons
          name={getIcon(item.type)}
          size={22}
          color={theme.colors.primaryLight}
        />
      </View>

      <View style={styles.textBox}>
        <Text style={styles.text}>{item.text}</Text>
        <Text style={styles.time}>{item.time ?? "Agora há pouco"}</Text>
      </View>

      {!item.read && <View style={styles.badge} />}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.iconButton}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Notificações</Text>
        <View style={styles.iconButton} />
      </View>

      {/* BODY COM LOADING CONDICIONAL */}
      {loading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color={theme.colors.primaryLight} />
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", marginTop: 40, color: "#999" }}>
              Tudo limpo por aqui! Nenhuma nova notificação.
            </Text>
          }
        />
      )}
    </View>
  );
}
