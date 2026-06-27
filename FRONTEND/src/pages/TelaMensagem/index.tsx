import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Logo from "../../assets/logo.png";
import { theme } from "../../global/themes";
import { RootStackParamList } from "../../routes";
import { style } from "./style";

import UserSession from "../../utils/UserSessions";

// 🟢 CORREÇÃO: Usando nossa instância configurada e segura que já injeta o JWT
import api from "../../config/api"; 

type NavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  "TelaMensagem"
>;

interface ContactProps {
  id: string; 
  name: string;
  username: string;
  lastMessage: string;
  time: string;
  avatar: string;
}

export default function TelaMensagem() {
  const navigation = useNavigation<NavigationProps>();
  
  const [conversas, setConversas] = useState<ContactProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [termoPesquisa, setTermoPesquisa] = useState("");

  const meuUsuario = UserSession.getInstance().getUser();
  const meuId = meuUsuario?.id;

  // 🟢 Carrega a lista de chats ativos passando o JWT implicitamente
  useEffect(() => {
    const carregarListaDeConversas = async () => {
      try {
        // Como usamos a 'api', o interceptor adiciona o Authorization Header sozinho!
        const response = await api.get(`/conversas/usuario/${meuId}`);
        setConversas(response.data || []);
      } catch (error: any) {
        console.error("Erro ao carregar lista de conversas:", error.message);
      } finally {
        setLoading(false);
      }
    };

    if (meuId) {
      carregarListaDeConversas();
    }
  }, [meuId]);

  const conversasFiltradas = conversas.filter((contato) =>
    contato.name.toLowerCase().includes(termoPesquisa.toLowerCase()) ||
    contato.username.toLowerCase().includes(termoPesquisa.toLowerCase())
  );

  const abrirChat = (contato: ContactProps) => {
    (navigation as any).navigate("Conversa", {
      recipientUser: {
        id: contato.id,
        name: contato.name,
        username: contato.username,
        avatar: contato.avatar,
      },
    });
  };

  return (
    <View style={style.container}>
      {/* HEADER */}
      <View style={style.header}>
        <View style={style.headerTop}>
          <TouchableOpacity onPress={() => navigation.navigate("TelaHome")}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={style.title}>Conexões</Text>
          <TouchableOpacity onPress={() => navigation.navigate("TelaNotificacao")}>
            <Ionicons name="notifications-outline" size={26} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* INPUT DE PESQUISA */}
        <View style={style.searchContainer}>
          <TextInput
            placeholder="Pesquisar..."
            placeholderTextColor="#777"
            style={style.input}
            value={termoPesquisa}
            onChangeText={setTermoPesquisa}
          />
          <Ionicons name="search" size={20} color="#777" />
        </View>

        <Image source={Logo} style={style.logo} resizeMode="contain" />
      </View>

      {/* RENDERIZAÇÃO DA LISTA */}
      {loading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={theme.colors.primaryDark} />
        </View>
      ) : (
        <FlatList
          data={conversasFiltradas}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={style.list}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", marginTop: 40, color: "#999" }}>
              Nenhuma conexão ecoeficiente encontrada.
            </Text>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={style.card}
              onPress={() => abrirChat(item)}
            >
              <Image source={{ uri: item.avatar ?? "https://i.pravatar.cc/150?img=32" }} style={style.avatar} />

              <View style={style.info}>
                <Text style={style.name}>{item.name}</Text>
                <Text style={style.lastMessage} numberOfLines={1}>
                  {item.lastMessage}
                </Text>
              </View>

              <Text style={style.time}>{item.time}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      {/* MENU INFERIOR PADRONIZADO */}
      <View style={style.menu}>
        <TouchableOpacity onPress={() => navigation.navigate("TelaHome")}>
          <Ionicons name="home-outline" size={26} color={theme.colors.primaryDark} />
        </TouchableOpacity>

        <TouchableOpacity
          style={style.addButton}
          onPress={() => navigation.navigate("TelaAdicionarUsuario")}
        >
          <Ionicons name="person-add" size={22} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("TelaPerfil")}>
          <Ionicons name="person-outline" size={26} color={theme.colors.primaryDark} />
        </TouchableOpacity>
      </View>
    </View>
  );
}