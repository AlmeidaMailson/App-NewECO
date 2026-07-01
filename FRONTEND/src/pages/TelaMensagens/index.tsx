import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  ActivityIndicator,
} from "react-native";

import { useNavigation, useFocusEffect } from "@react-navigation/native";

import ConversationCard from "../../components/ConversationCard";

import api from "../../config/api";

import { styles } from "./style";

interface Conversa {
  conversa_id: number;

  criado_em: string;

  ultima_mensagem?: string;

  horario?: string;

  nao_lidas?: number;

  usuario: {
    id: number;

    nome: string;

    foto_perfil?: string;
  };
}

export default function TelaMensagens() {
  const navigation = useNavigation<any>();

  const [loading, setLoading] = useState(true);

  const [pesquisa, setPesquisa] = useState("");

  const [conversas, setConversas] = useState<Conversa[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      carregarConversas();
    }, []),
  );

  async function carregarConversas() {
    try {
      setLoading(true);

      const response = await api.get("/conversas/");

      console.log("CONVERSAS:");
      console.log(JSON.stringify(response.data, null, 2));

      setConversas(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const conversasFiltradas = conversas.filter((item) =>
    item.usuario.nome

      .toLowerCase()

      .includes(pesquisa.toLowerCase()),
  );

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Mensagens</Text>

      <TextInput
        style={styles.input}
        placeholder="Pesquisar..."
        value={pesquisa}
        onChangeText={setPesquisa}
      />

      <FlatList
        data={conversasFiltradas}
        keyExtractor={(item) => String(item.conversa_id)}
        renderItem={({ item }) => (
          <ConversationCard
            nome={item.usuario.nome}
            avatar={item.usuario.foto_perfil}
            ultimaMensagem={item.ultima_mensagem}
            horario={item.horario}
            naoLidas={item.nao_lidas}
            onPress={() => {
              navigation.navigate(
                "TelaConversa",

                {
                  conversaId: item.conversa_id,

                  usuario: item.usuario,
                },
              );
            }}
          />
        )}
      />
    </View>
  );
}
