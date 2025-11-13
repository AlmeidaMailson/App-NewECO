import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Login from "../pages/login";
import Cadastro from "../pages/cadastro";
import TelaHome from "../TelaHome";


export type RootStackParamList = {
  Login: undefined;
  Cadastro: undefined;
  TelaHome: undefined;
};

const stack = createNativeStackNavigator<RootStackParamList>();

export default function Routes() {
    return(
        <NavigationContainer>
            <stack.Navigator screenOptions={{headerShown:false}}>
                <stack.Screen name="Login" component={Login}/>
                <stack.Screen name="Cadastro" component={Cadastro}/>
                <stack.Screen name="TelaHome" component={TelaHome}/>
            </stack.Navigator>
        </NavigationContainer>
    );
} 