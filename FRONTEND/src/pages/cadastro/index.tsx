import React, {useState} from "react";
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
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../routes";
import axios from "axios";

type NavigationProps = NativeStackNavigationProp<RootStackParamList, "Cadastro">;



export default function Cadastro() {

   const navigation = useNavigation<NavigationProps>();


  const [nome, setNome] = useState("");
  const [email, setEmail]= useState("");
  const [telefone, setTelefone] = useState("");
  const [estado, setEstado] = useState("");
  const [cidade, setCidade] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmasenha, setConfirmasenha] = useState("");

  async function cadastrar() {
    try{
      if (senha !== confirmasenha){
        alert("As senhas não coincidem");
      }else{
      const response = await axios.post("http://localhost:8000/users/",
         {
        nome, 
        email,
        telefone,
        estado,
        cidade,
        senha
      }
     );
     alert("cadastro realizado com sucesso");

     navigation.navigate("Login")
    }
  } catch (error: any) {
  console.log(error.response?.data);
  console.log(error.message);

  alert("Erro ao cadastrar");
}
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
          <Image source={Logo} style={style.logo} resizeMode="contain" />

          {/* PERFIL */}
          <View style={style.perfil}>
            <Text style={style.title}>Crie sua conta</Text>
            <ProfileImage />
          </View>

          {/* FORM */}
          <View style={style.form}>
            <Input label="Nome Completo" placeholder="Digite seu nome" value= {nome} onChangeText={setNome} />
            <Input label="E-mail" placeholder="Digite seu e-mail" value={email} onChangeText={setEmail}  />
            <Input label="telefone" placeholder="Telefone/WhatsApp" value={telefone} onChangeText={setTelefone} />

            {/* LINHA DUPLA */}
            <View style={style.row}>  
              <Input label="Estado" placeholder="UF" small value={estado} onChangeText={setEstado} />
              <Input label="Cidade" placeholder="Cidade" small value={cidade} onChangeText={setCidade} />
            </View>

            <Input label="Senha" placeholder="Digite sua senha" secure value={senha} onChangeText={setSenha} />
            <Input
              label="Confirmar Senha"
              placeholder="Confirme a senha"
              secure
              value = {confirmasenha}
              onChangeText= {setConfirmasenha}
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
              onPress={cadastrar}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Background>
  );
}

/* COMPONENTE REUTILIZÁVEL */
function Input({
  label,
  placeholder,
  secure,
  small,
  value,
  onChangeText,
}: any) {
  return (
    <View style={[style.inputGroup, small && style.inputSmall]}>
      <Text style={style.label}>{label}</Text>

      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#ccc"
        secureTextEntry={secure}
        style={style.input}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}