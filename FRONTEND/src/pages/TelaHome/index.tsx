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

//  Trazendo a nossa instância autenticada da API
import api from "../../config/api";

type NavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  "TelaHome"
>;

export default function TelaHome() {
  const navigation = useNavigation<NavigationProps>();

  // Estados dinâmicos para gerenciar os dados em tempo real
  const [nomeUsuario, setNomeUsuario] = useState("Eco amigo");
  const [ecoBeneficios, setEcoBeneficios] = useState(0);
  const [refreshFeed, setRefreshFeed] = useState(0);
  const [saldoTotal, setSaldoTotal] = useState(0);
  //  useFocusEffect recarrega os dados do usuário toda vez que ele volta para a Home
  useFocusEffect(
    React.useCallback(() => {
      async function buscarDadosPerfil() {
        try {
          // Removido o prefixo "/auth" se o seu FastAPI estiver configurado sem ele
          const response = await api.get("/users/me");

          if (response.data) {
            setNomeUsuario(response.data.nome);
            setEcoBeneficios(response.data.ecoBeneficios ?? 0);

            UserSession.getInstance().setUser({
              ...UserSession.getInstance().getUser(),
              ...response.data,
            });
          }

          const extrato = await api.get("/carteira/extrato");

          console.log(extrato.data);

          setSaldoTotal(extrato.data.saldo_total);
        } catch (error: any) {
          // Fallback seguro usando a sessão local em memória caso a API falhe temporariamente
          const localUser = UserSession.getInstance().getUser();
          setNomeUsuario(localUser?.nome ?? "Eco amigo");
          setEcoBeneficios(localUser?.ecoBeneficios ?? 0);
        }
      }

      buscarDadosPerfil();
      // Incrementa o gatilho para forçar o componente <FeedScreen /> a recarregar as postagens
      setRefreshFeed((prev) => prev + 1);
    }, []),
  );

  return (
    <View style={style.container}>
      {/* HEADER */}
      <View style={style.header}>
        <View>
          <Text style={style.greeting}>Olá, {nomeUsuario}</Text>
          <Text style={style.subText}>{saldoTotal} EcoBenefícios</Text>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate("TelaNotificacao")}
        >
          <Ionicons
            name="notifications"
            size={40}
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
        <TouchableOpacity
          onPress={() => navigation.navigate("TelaConversa")}
        >
          <AntDesign
            name="wechat"
            size={28}
            color={theme.colors.primaryDark}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setRefreshFeed((prev) => prev + 1)}>
          <Ionicons name="home" size={28} color={theme.colors.primaryLight} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("TelaPerfil")}>
          <Feather name="user" size={28} color={theme.colors.primaryDark} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
