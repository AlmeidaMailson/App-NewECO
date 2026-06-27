import React, { useState } from "react";
import { Text, View, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons, Feather, AntDesign } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import FeedScreen from "../../components/feedCard";
import { theme } from "../../global/themes";
import { RootStackParamList } from "../../routes";
import UserSession from "../../utils/UserSessions";
import { style } from "./style";

// 🟢 MUDANÇA AQUI: Trazendo a nossa instância autenticada da API
import api from "../../config/api";

type NavigationProps = NativeStackNavigationProp<RootStackParamList, "TelaHome">;

export default function TelaHome() {
  const navigation = useNavigation<NavigationProps>();
  
  // Estados dinâmicos para gerenciar os dados em tempo real
  const [nomeUsuario, setNomeUsuario] = useState("Eco amigo");
  const [ecoBeneficios, setEcoBeneficios] = useState(0);
  const [refreshFeed, setRefreshFeed] = useState(0); // Gatilho para atualizar o feed interno

  // 🟢 useFocusEffect recarrega os dados do usuário toda vez que ele volta para a Home
  useFocusEffect(
    React.useCallback(() => {
      async function buscarDadosPerfil() {
        try {
          // Rota protegida por Token que busca as infos atualizadas do usuário logado
          const response = await api.get("/auth/users/me"); // Ajuste o endpoint conforme seu back
          
          if (response.data) {
            setNomeUsuario(response.data.nome);
            setEcoBeneficios(response.data.ecoBeneficios ?? 0);
            
            // Sincroniza também no Singleton da sessão do app
            UserSession.getInstance().setUser({
              ...UserSession.getInstance().getUser(),
              ...response.data
            });
          }
        } catch (error: any) {
          console.log("Erro ao sincronizar saldo na Home:", error.message);
          // Fallback seguro usando a sessão local em memória caso a API falhe temporariamente
          const localUser = UserSession.getInstance().getUser();
          setNomeUsuario(localUser?.nome ?? "Eco amigo");
          setEcoBeneficios(localUser?.ecoBeneficios ?? 0);
        }
      }

      buscarDadosPerfil();
      // Incrementa o gatilho para forçar o componente <FeedScreen /> a recarregar as postagens
      setRefreshFeed(prev => prev + 1); 
    }, [])
  );

  return (
    <View style={style.container}>
      {/* HEADER */}
      <View style={style.header}>
        <View>
          <Text style={style.greeting}>Olá, {nomeUsuario}</Text>
          <Text style={style.subText}>
            {ecoBeneficios} EcoBenefícios
          </Text>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate("TelaNotificacao")}>
          <Ionicons
            name="notifications"
            size={26}
            color={theme.colors.primaryDark}
          />
        </TouchableOpacity>
      </View>

      {/* QUICK ACTIONS */}
      <View style={style.quickActions}>
        <TouchableOpacity
          style={style.actionCard}
          onPress={() => navigation.navigate("MapaVerde")}
        >
          <Ionicons name="map-outline" size={22} color="#fff" />
          <Text style={style.actionText}>Mapa Verde</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={style.actionCard}
          onPress={() => navigation.navigate("TelaMissoes")}
        >
          <Ionicons name="leaf-outline" size={22} color="#fff" />
          <Text style={style.actionText}>Missões</Text>
        </TouchableOpacity>
      </View>

      {/* FEED DE POSTAGENS */}
      <View style={style.feedContainer}>
        {/* Passamos o refreshFeed como prop caso queira controlar o recarregamento lá dentro */}
        <FeedScreen key={refreshFeed} />
      </View>

      {/* FAB - BOTÃO FLUTUANTE PARA PUBLICAR */}
      <TouchableOpacity
        style={style.fab}
        onPress={() => navigation.navigate("Publicar")}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>

      {/* MENU INFERIOR */}
      <View style={style.bottomMenu}>
        <TouchableOpacity onPress={() => navigation.navigate("TelaMensagem")}>
          <AntDesign name="message" size={26} color={theme.colors.primaryDark} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setRefreshFeed(prev => prev + 1)}>
          <Ionicons name="home" size={28} color={theme.colors.primaryLight} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("TelaPerfil")}>
          <Feather name="user" size={26} color={theme.colors.primaryDark} />
        </TouchableOpacity>
      </View>
    </View>
  );
}