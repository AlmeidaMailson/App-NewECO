import React from "react";
import {
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
} from "react-native";
import { style } from "./style";
import Background from "../../components/Background";
import Logo from "../../assets/logo.png";
import ProfileImage from "../../components/ProfileImage";
import TextInputComponent from "../../components/TextInputComponent";
import Botao from "../../components/botao";
import { Ionicons } from "@expo/vector-icons";

export default function Cadastro() {
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
          <Image source={Logo} style={style.logo} resizeMode="contain" />

          {/* PERFIL */}
          <View style={style.perfil}>
            <Text style={style.title}>Crie sua conta</Text>
            <ProfileImage />
          </View>

          {/* FORM */}
          <View style={style.form}>
            <Input label="Nome Completo" placeholder="Digite seu nome" />
            <Input label="E-mail" placeholder="Digite seu e-mail" />
            <Input label="Contato" placeholder="Telefone/WhatsApp" />

            {/* LINHA DUPLA */}
            <View style={style.row}>
              <Input label="Estado" placeholder="UF" small />
              <Input label="Cidade" placeholder="Cidade" small />
            </View>

            <Input label="Senha" placeholder="Digite sua senha" secure />
            <Input
              label="Confirmar Senha"
              placeholder="Confirme a senha"
              secure
            />

            {/* BOTÃO */}
            <Botao
              title={
                <View style={style.buttonContent}>
                  <Text style={style.buttonText}>Concluir</Text>
                  <Ionicons
                    name="arrow-forward-circle"
                    size={26}
                    color="#fff"
                  />
                </View>
              }
              onPress={() => alert("Cadastro finalizado!")}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Background>
  );
}

/* COMPONENTE REUTILIZÁVEL */
function Input({ label, placeholder, secure, small }: any) {
  return (
    <View style={[style.inputGroup, small && style.inputSmall]}>
      <Text style={style.label}>{label}</Text>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#ccc"
        secureTextEntry={secure}
        style={style.input}
      />
    </View>
  );
}