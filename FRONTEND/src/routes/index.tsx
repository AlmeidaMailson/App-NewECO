import React from "react";
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
import Mapaverde  from "../pages/MapaVerde";
import TelaMissoes from "../pages/TelaMissoes";
import FinalizarPublicacao from "../pages/FinalizarPublicacao";
import UserSession from "../utils/UserSessions";
import TelaMensagem from "../pages/TelaMensagem";
import Coversa from "../pages/Conversa";

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
  ChatScreen: undefined;
  TelaMensagem: undefined;
  Conversa: undefined;
  MapaVerde: undefined;
};

const stack = createNativeStackNavigator<RootStackParamList>();

export default function Routes() {
  return (
    <NavigationContainer>
      <stack.Navigator screenOptions={{ headerShown: false }}>
        <stack.Screen name="Login" component={Login} />
        <stack.Screen name="TelaEsqueceSenha" component={TelaEsqueceSenha} />
        <stack.Screen name="Cadastro" component={Cadastro} />
        <stack.Screen name="TelaHome" component={TelaHome} />
        <stack.Screen name="TelaNotificacao" component={TelaNotificacao}/>
        <stack.Screen name="Publicar" component={Publicar} />
        <stack.Screen name="TelaPerfil" component={TelaPerfil}/>
        <stack.Screen name="TelaEditarPerfil" component={TelaEditarPerfil}/>
        <stack.Screen name="TelaConfiguracao" component={TelaConfiguracao}/>
        <stack.Screen name="TelaPrivacidade" component={TelaPrivacidade}/>
        <stack.Screen name="TelaSeguranca" component={TelaSeguranca}/>
        <stack.Screen name="TelaAdicionarUsuario" component={TelaAdicionarUsuario}/>
        <stack.Screen name="TelaPerfilUsuario" component={TelaPerfilUsuario}/>
        <stack.Screen name="TelaEcoBeneficios" component={TelaEcoBeneficios}/>
         <stack.Screen name="MapaVerde" component={Mapaverde} />
         <stack.Screen name="TelaMissoes" component={TelaMissoes}/>
        <stack.Screen name="FinalizarPublicacao" component={FinalizarPublicacao}/>
        <stack.Screen name="TelaMensagem" component={TelaMensagem}/>
        <stack.Screen name="Conversa" component={Coversa}/>
      </stack.Navigator>
    </NavigationContainer>
  );
}
