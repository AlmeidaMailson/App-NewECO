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
  TelaMensagens: undefined;
};

const stack = createNativeStackNavigator<RootStackParamList>();

export default function Routes() {
  const [loading, setLoading] = useState(true);
  const [hasSession, setHasSession] = useState(false);

  // CORREÇÃO: Hook para restaurar a sessão do usuário assim que o app abrir
  useEffect(() => {
    async function checkActiveSession() {
      try {
        const session = UserSession.getInstance();
        // Carrega os dados salvos no AsyncStorage para a memória RAM
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

  // Splash screen/Loading nativo enquanto lê o armazenamento local
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#121212" }}>
        <ActivityIndicator size="large" color="#00FF66" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {/* O PULO DO GATO: Define a rota inicial dinamicamente com base na sessão */}
      <stack.Navigator 
        initialRouteName={hasSession ? "TelaHome" : "Login"} 
        screenOptions={{ headerShown: false }}
      >
        <stack.Screen name="Login" component={Login} />
        <stack.Screen name="TelaEsqueceSenha" component={TelaEsqueceSenha} />
        <stack.Screen name="Cadastro" component={Cadastro} />
        <stack.Screen name="TelaHome" component={TelaHome} />
        <stack.Screen name="TelaNotificacao" component={TelaNotificacao} />
        <stack.Screen name="Publicar" component={Publicar} />
        <stack.Screen name="TelaPerfil" component={TelaPerfil} />
        <stack.Screen name="TelaEditarPerfil" component={TelaEditarPerfil} />
        <stack.Screen name="TelaConfiguracao" component={TelaConfiguracao} />
        <stack.Screen name="TelaPrivacidade" component={TelaPrivacidade} />
        <stack.Screen name="TelaSeguranca" component={TelaSeguranca} />
        <stack.Screen name="TelaAdicionarUsuario" component={TelaAdicionarUsuario} />
        <stack.Screen name="TelaPerfilUsuario" component={TelaPerfilUsuario} />
        <stack.Screen name="TelaEcoBeneficios" component={TelaEcoBeneficios} />
        <stack.Screen name="MapaVerde" component={MapaVerde} />
        <stack.Screen name="TelaMissoes" component={TelaMissoes} />
        <stack.Screen name="FinalizarPublicacao" component={FinalizarPublicacao} />
        <stack.Screen name="TelaMensagens" component={TelaMensagens}/>
        <stack.Screen name="TelaConversa" component={TelaConversa}/>

      </stack.Navigator>
    </NavigationContainer>
  );
}