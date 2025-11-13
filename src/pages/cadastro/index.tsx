import React from "react";
import {
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  Dimensions,
} from "react-native";
import { style } from "./style";
import Background from "../../components/Background";
import Logo from "../../assets/logo.png";
import LogoPerfil from "../../assets/LogoPerfil.png";
import ProfileImage from "../../components/ProfileImage";
import TextInputComponent from "../../components/TextInputComponent";
import { theme } from "../../global/themes";
import Botao from "../../components/botao";
import { Ionicons } from "@expo/vector-icons";


export default function Cadastro() {
  return (
    <Background>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={style.container}>
          <View style={style.boxlogo}>
            <Image source={Logo} style={style.logo} resizeMode="contain" />
          </View>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            <View style={style.boxPerfil}>
              <Text style={style.text}>Crie sua conta agora mesmo!</Text>
              <View>
                <ProfileImage />
              </View>
            </View>
            <View style={style.boxCadastro}>
              <View>
                <Text style={style.text}>Nome Completo:</Text>
                <TextInputComponent
                 placeholder="Digite seu nome completo"
                ></TextInputComponent>

                <Text style={style.text}>E-Mail:</Text>
                <TextInputComponent placeholder="Digite seu E-Mail"></TextInputComponent>
                <Text style={style.text}>Contato:</Text>
                <TextInputComponent placeholder="Telefone/WhatsApp"></TextInputComponent>
                <View style={style.inpuntContainer}>
                  <View
                    style={{
                      width: Dimensions.get("window").width * 0.4,
                    }}
                  >
                    <Text style={style.text}>Estado:</Text>
                    <TextInput
                      placeholder="Estado"
                      placeholderTextColor="#ffffff"
                      style={{
                        gap: 80,
                        height: 50,
                        borderWidth: 1,
                        borderColor: "#000000",
                        borderRadius: 40,
                        color: theme.colors.textLight,
                        textAlign: "center",
                        fontSize: 17,
                      }}
                    ></TextInput>
                  </View>

                  <View
                    style={{
                      width: Dimensions.get("window").width * 0.4,
                    }}
                  >
                    <Text style={style.text}>Cidade:</Text>
                    <TextInput
                      placeholder="Cidade"
                      placeholderTextColor="#ffffff"
                      style={{
                        gap: 80,
                        height: 50,
                        borderWidth: 1,
                        borderColor: "#000000",
                        borderRadius: 40,
                        color: theme.colors.textLight,
                        textAlign: "center",
                        fontSize: 17,
                      }}
                    ></TextInput>
                  </View>
                </View>
                <View style={style.boxSenha}>
                  <View>
                    <Text style={style.text}>Senha:</Text>
                    <TextInput
                      placeholder="Digite uma senha"
                      placeholderTextColor="#ffffff"
                      style={{
                        gap: 80,
                        height: 50,
                        width: Dimensions.get("window").width * 0.6,
                        borderWidth: 1,
                        borderColor: "#000000",
                        borderRadius: 40,
                        color: theme.colors.textLight,
                        textAlign: "center",
                        fontSize: 17,
                      }}
                    ></TextInput>
                  </View>
                  <View>
                    <Text style={style.text}>Confirma senha:</Text>
                    <TextInput
                      placeholder="Confirma Senha"
                      placeholderTextColor="#ffffff"
                      style={{
                        gap: 80,
                        height: 50,
                        width: Dimensions.get("window").width * 0.6,
                        borderWidth: 1,
                        borderColor: "#000000",
                        borderRadius: 40,
                        color: theme.colors.textLight,
                        textAlign: "center",
                        fontSize: 17,
                      }}
                    ></TextInput>
                  </View>
                </View>
              </View>
              <View style={{ flex: 1, marginBottom: 50, marginLeft: 60 }}>
                <Botao
                  title={
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Text
                        style={{ color: "#fff", fontSize: 18, marginRight: 8 }}
                      >
                        Concluir
                      </Text>
                      <Ionicons
                        name="arrow-forward-circle"
                        size={28}
                        color="#fff"
                      />
                    </View>
                  }
                  onPress={() => alert("Cadastro finalizado!")}
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Background>
  );
}
