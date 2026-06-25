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

// 🟢 Seus gerenciadores de sessão e API
import UserSession from "../../utils/UserSessions";
import { API_URL } from "../../config/api";
import axios from "axios";

type NavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  "TelaMensagem"
>;

// Tipagem profissional para a lista de contatos ativos
interface ContactProps {
  id: string; // ID da conversa ou do usuário destino
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

  // Pega o ID do usuário que está logado no app
  const meuUsuario = UserSession.getInstance().getUser();
  const meuId = meuUsuario?.id;

  // 🟢 Carrega a lista de chats ativos do usuário vinda do Back-end
  useEffect(() => {
    const carregarListaDeConversas = async () => {
      try {
        const response = await axios.get(`${API_URL}/conversas/usuario/${meuId}`);
        setConversas(response.data);
      } catch (error) {
        console.error("Erro ao carregar lista de conversas:", error);
      } finally {
        setLoading(false);
      }
    };

    if (meuId) {
      carregarListaDeConversas();
    }
  }, [meuId]);

  // 🟢 Filtro dinâmico da barra de pesquisa em tempo real
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

        {/* INPUT DE PESQUISA COM ESTADO */}
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

      {/* RENDERIZAÇÃO DA LISTA OU FEEDBACK DE LOADING */}
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
              onPress={() => abrirChat(item)} // 🟢 Agora envia o ID e dados corretos!
            >
              <Image source={{ uri: item.avatar }} style={style.avatar} />

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

      {/* SEU MENU INFERIOR MANTIDO */}
      <View style={style.menu}>
        <TouchableOpacity onPress={() => navigation.navigate("TelaHome")}>
          <Ionicons name="home-outline" size={26} color={theme.colors.primaryDark} />
        </TouchableOpacity>

        <TouchableOpacity
          style={style.addButton}
          onPress={() => navigation.navigate("TelaAdicionarUsuario")}
        >
          <PersonAddIcon />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("TelaPerfil")}>
          <Ionicons name="person-outline" size={26} color={theme.colors.primaryDark} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Pequeno ajuste auxiliar para renderizar o ícone de adicionar
const PersonAddIcon = () => (
  <Ionicons name="person-add" size={26} color="#fff" />
);