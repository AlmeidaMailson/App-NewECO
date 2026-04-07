import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Login from "../pages/login";
import Cadastro from "../pages/cadastro";
import TelaHome from "../pages/TelaHome";
import Publicar from "../pages/Publicar";
import TroqueDoe from "../pages/TroqueDoe";
import Mapaverde  from "../pages/MapaVerde";
import TelaMissoes from "../pages/TelaMissoes";
import FinalizarPublicacao from "../pages/FinalizarPublicacao";
import UserSession from "../utils/UserSessions";
import TelaMensagem from "../pages/TelaMensagem";
import Coversa from "../pages/Conversa";

export type RootStackParamList = {
  Login: undefined;
  Cadastro: undefined;
  TelaHome: undefined;
  Publicar: undefined;
  TroqueDoe: { opcao: string };
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
        <stack.Screen name="Cadastro" component={Cadastro} />
        <stack.Screen name="TelaHome" component={TelaHome} />
        <stack.Screen name="Publicar" component={Publicar} />
        <stack.Screen name="TroqueDoe" component={TroqueDoe} />
         <stack.Screen name="MapaVerde" component={Mapaverde} />
         <stack.Screen name="TelaMissoes" component={TelaMissoes}/>
        <stack.Screen name="FinalizarPublicacao" component={FinalizarPublicacao}/>
        <stack.Screen name="TelaMensagem" component={TelaMensagem}/>
        <stack.Screen name="Conversa" component={Coversa}/>
      </stack.Navigator>
    </NavigationContainer>
  );
}
