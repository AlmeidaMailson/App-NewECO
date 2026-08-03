import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Login from "../pages/login";
import TelaEsqueceSenha from "../pages/TelaEsqueceSenha";
import Cadastro from "../pages/cadastro";
import TelaHome from "../pages/TelaHome";
import TelaNotificacao from "../pages/TelaNotificacao";
import Publicar from "../pages/Publicar";
import TelaPerfil from "../pages/TelaPerfil";
import TelaEditarPerfil from "../pages/TelaEditarPerfil";
import TelaConfiguracao from "../pages/TelaConfiguracao";
import TelaPrivacidade from "../pages/TelaPrivacidade";
import TelaSeguranca from "../pages/TelaSeguranca";
import TelaAdicionarUsuario from "../pages/TelaAdicionarUsuario";
import TelaPerfilUsuario from "../pages/TelaPerfilUsuario";
import TelaEcoBeneficios from "../pages/TelaEcoBeneficios";
import MapaVerde from "../pages/MapaVerde";
import TelaMissoes from "../pages/TelaMissoes";
import FinalizarPublicacao from "../pages/FinalizarPublicacao";
import TelaMensagens from "../pages/TelaMensagens";
import TelaConversa from "../pages/TelaConversa";

// Importando o Singleton de Sessão para gerenciar o estado inicial
import UserSession from "../utils/UserSessions";

export type RootStackParamList = {
  Login: undefined;
  TelaEsqueceSenha: undefined;
  Cadastro: undefined;
  TelaHome: undefined;
  TelaNotificacao: undefined;
  Publicar: undefined;
  TelaPerfil: undefined;
  TelaEditarPerfil: undefined;
  TelaConfiguracao: undefined;
  TelaPrivacidade: undefined;
  TelaSeguranca: undefined;
  TelaAdicionarUsuario: undefined;
  TelaPerfilUsuario: { user: any };
  TelaEcoBeneficios: undefined;
  TelaMissoes: undefined;
  FinalizarPublicacao: { midia: any };
  TelaConversa: undefined; 
  MapaVerde: undefined;
  TelaMensagens: { contatoId: number; contatoNome: string };
};

// Alterado para "Stack" com inicial maiúscula para seguir a convenção de Componentes do React
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Routes() {
  const [loading, setLoading] = useState(true);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    async function checkActiveSession() {
      try {
        const session = UserSession.getInstance();
        const isLogged = await session.loadStoredSession();
        setHasSession(isLogged);
      } catch (error) {
        console.log("Erro ao checar sessão ativa na inicialização:", error);
      } finally {
        setLoading(false);
      }
    }

    checkActiveSession();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#121212" }}>
        <ActivityIndicator size="large" color="#00FF66" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName={hasSession ? "TelaHome" : "Login"} 
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="TelaEsqueceSenha" component={TelaEsqueceSenha} />
        <Stack.Screen name="Cadastro" component={Cadastro} />
        <Stack.Screen name="TelaHome" component={TelaHome} />
        <Stack.Screen name="TelaNotificacao" component={TelaNotificacao} />
        <Stack.Screen name="Publicar" component={Publicar} />
        <Stack.Screen name="TelaPerfil" component={TelaPerfil} />
        <Stack.Screen name="TelaEditarPerfil" component={TelaEditarPerfil} />
        <Stack.Screen name="TelaConfiguracao" component={TelaConfiguracao} />
        <Stack.Screen name="TelaPrivacidade" component={TelaPrivacidade} />
        <Stack.Screen name="TelaSeguranca" component={TelaSeguranca} />
        <Stack.Screen name="TelaAdicionarUsuario" component={TelaAdicionarUsuario} />
        <Stack.Screen name="TelaPerfilUsuario" component={TelaPerfilUsuario} />
        <Stack.Screen name="TelaEcoBeneficios" component={TelaEcoBeneficios} />
        <Stack.Screen name="MapaVerde" component={MapaVerde} />
        <Stack.Screen name="TelaMissoes" component={TelaMissoes} />
        <Stack.Screen name="FinalizarPublicacao" component={FinalizarPublicacao} />
        <Stack.Screen name="TelaMensagens" component={TelaMensagens} />
        <Stack.Screen name="TelaConversa" component={TelaConversa} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}