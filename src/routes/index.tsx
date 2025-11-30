import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Login from "../pages/login";
import Cadastro from "../pages/cadastro";
import TelaHome from "../pages/TelaHome";
import Publicar from "../pages/Publicar";
import TroqueDoe from "../pages/TroqueDoe";
import FinalizarPublicacao from "../pages/FinalizarPublicacao";
import ChatScreen from "../components/ChatScreen";
import UserSession from "../utils/UserSessions";

export type RootStackParamList = {
  Login: undefined;
  Cadastro: undefined;
  TelaHome: undefined;
  Publicar: undefined;
  TroqueDoe: { opcao: string };
  FinalizarPublicacao: { midia: any };
  ChatScreen: undefined;
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
        <stack.Screen name="FinalizarPublicacao" component={FinalizarPublicacao}/>
        <stack.Screen name="ChatScreen">
  {() => (
    <ChatScreen currentUser={UserSession.getInstance().getUser()} />
  )}
</stack.Screen>
      </stack.Navigator>
    </NavigationContainer>
  );
}
