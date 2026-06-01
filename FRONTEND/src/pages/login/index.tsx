import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { style } from "./style";
import Logo from "../../assets/logo.png";
import Background from "../../components/Background";
import Botao from "../../components/botao";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../routes";
import UserSession from "../../utils/UserSessions";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../config/api";


type NavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  "Login"
>;

export default function Login() {
  const navigation = useNavigation<NavigationProps>();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
async function login() {
  try {
    const response = await axios.post(
      `${API_URL}/users/login`,
      { email, senha }
    );

    if (!response.data) {
      alert("Erro no login");
      return;
    }

    console.log("LOGIN OK:", response.data);

    const loggedUser = response.data.user;

    await AsyncStorage.setItem(
      "user",
      JSON.stringify(loggedUser)
    );

    UserSession.getInstance().setUser(loggedUser);

    navigation.replace("TelaHome"); // 🔥 melhor que navigate

  } catch (error: any) {
    console.log(error.response?.data || error.message);
    alert("Email ou senha inválidos");
  }
}
  async function handleLogin() {
  if (!email || !senha) {
    alert("Preencha todos os campos");
    return;
  }

  await login();
}

  return (
    <Background>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={style.scroll}
          keyboardShouldPersistTaps="handled"
        >
          {/* LOGO */}
          <Image source={Logo} style={style.logo} />

          {/* TEXTO */}
          <View style={style.header}>
            <TouchableOpacity onPress={() => navigation.navigate("Cadastro")}>
              <Text style={style.link}>Criar uma conta</Text>
            </TouchableOpacity>

            <Text style={style.subtitle}>
              Insira seu e-mail para continuar
            </Text>
          </View>

          {/* INPUTS */}
          <View style={style.form}>
            <TextInput
              placeholder="E-mail ou telefone"
              placeholderTextColor="#ccc"
              style={style.input}
              value={email}
              onChangeText={setEmail}
            />

            <TextInput
              placeholder="Senha"
              placeholderTextColor="#ccc"
              secureTextEntry
              style={style.input}
              value={senha}
              onChangeText={setSenha}
            />

            <TouchableOpacity
            onPress={()=> navigation.navigate("TelaEsqueceSenha")}
            >
              <Text style={style.forgot}>Esqueceu a senha?</Text>
            </TouchableOpacity>
          </View>

          {/* BOTÃO */}
          <View style={style.button}>
            <Botao title="Entrar" onPress={handleLogin} />
          </View>
        </ScrollView>

        {/* TERMOS */}
        <View style={style.terms}>
          <Text>
            Ao continuar, você concorda com nossos{" "}
            <Text style={style.link}>Termos</Text> e{" "}
            <Text style={style.link}>Privacidade</Text>
          </Text>
        </View>
      </KeyboardAvoidingView>
    </Background>
  );
}
