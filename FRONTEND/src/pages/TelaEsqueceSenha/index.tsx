import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../routes";
import { styles } from "./style";

// Trazendo nossa instância centralizada do Axios
import api from "../../config/api";

type NavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  "TelaEsqueceSenha"
>;

export default function TelaEsqueceSenha() {
  const navigation = useNavigation<NavigationProps>();
  
  // Estados de controle
  const [email, setEmail] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [emailVerificado, setEmailVerificado] = useState(false); // Controla se exibe a troca de senha
  const [usuarioNaoExiste, setUsuarioNaoExiste] = useState(false); // Controla o estado de erro/sugestão

  //  ETAPA 1: Verificar se o e-mail existe no banco
  const handleVerifyEmail = async () => {
    if (!email.trim()) {
      Alert.alert("Atenção", "Por favor, digite seu e-mail.");
      return;
    }

    try {
      setLoading(true);
      setUsuarioNaoExiste(false);

      // Envia uma requisição para checar o e-mail. 
      // Dica: Seu back pode ser um POST para '/auth/verificar-email' retornando { existe: true }
      const response = await api.post("/auth/verificar-email", { email: email.trim() });

      if (response.data?.existe || response.status === 200) {
        setEmailVerificado(true);
      } else {
        setUsuarioNaoExiste(true);
      }
    } catch (error: any) {
      console.log("Erro ao verificar e-mail:", error.response?.data || error.message);
      
      // Se o seu backend retornar 404 quando o usuário não existe, tratamos aqui:
      if (error.response?.status === 404) {
        setUsuarioNaoExiste(true);
      } else {
        Alert.alert("Erro", "Ocorreu uma falha na conexão com o servidor.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Enviar a nova senha para o banco de dados
  const handleUpdatePassword = async () => {
    if (!novaSenha || !confirmarSenha) {
      Alert.alert("Atenção", "Preencha todos os campos de senha.");
      return;
    }

    if (novaSenha !== confirmarSenha) {
      Alert.alert("Erro", "As senhas digitadas não coincidem.");
      return;
    }

    if (novaSenha.length < 6) {
      Alert.alert("Atenção", "A senha deve conter no mínimo 6 caracteres.");
      return;
    }

    try {
      setLoading(true);

      // Envia o e-mail e a nova senha para atualizar no banco
      // Alinhe com a sua rota do FastAPI (ex: /auth/redefinir-senha)
      await api.put("/auth/redefinir-senha", {
        email: email.trim(),
        nova_senha: novaSenha,
      });

      Alert.alert("Sucesso!", "Sua senha foi alterada com sucesso.", [
        { text: "Ir para o Login", onPress: () => navigation.navigate("Login") },
      ]);
    } catch (error: any) {
      console.log("Erro ao mudar senha:", error.response?.data || error.message);
      Alert.alert("Erro ao redefinir", error.response?.data?.detail ?? "Não foi possível alterar a senha.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.card}>
        {/* BOTÃO VOLTAR */}
        <TouchableOpacity 
          onPress={() => {
            if (emailVerificado) {
              setEmailVerificado(false); // Se estiver na senha, volta para o email
            } else {
              navigation.goBack();
            }
          }} 
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.title}>Recuperar senha</Text>

        {/* ---------------- CASO 1: USUÁRIO NÃO EXISTE NO BANCO ---------------- */}
        {usuarioNaoExiste ? (
          <View style={{ alignItems: "center", marginTop: 10 }}>
            <Ionicons name="alert-circle-outline" size={48} color="#FF6B6B" />
            <Text style={[styles.subtitle, { textAlign: "center", color: "#FF6B6B", fontWeight: "bold" }]}>
              E-mail não cadastrado!
            </Text>
            <Text style={[styles.subtitle, { textAlign: "center", marginTop: 5 }]}>
              Não encontramos nenhuma conta vinculada a este e-mail no NewECO. Deseja criar uma nova conta agora?
            </Text>

            <TouchableOpacity 
              style={[styles.button, { backgroundColor: "#00B89A", marginTop: 15 }]} 
              onPress={() => navigation.navigate("Login")} // Altere para a sua tela de cadastro se houver ex: "Cadastro"
            >
              <Text style={styles.buttonText}>Criar Nova Conta</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={{ marginTop: 15 }} 
              onPress={() => setUsuarioNaoExiste(false)}
            >
              <Text style={{ color: "#999", textDecorationLine: "underline" }}>Tentar outro e-mail</Text>
            </TouchableOpacity>
          </View>
        ) : !emailVerificado ? (
          /* ---------------- CASO 2: DIGITAR E VERIFICAR O EMAIL ---------------- */
          <View style={{ width: "100%" }}>
            <Text style={styles.subtitle}>
              Informe seu e-mail cadastrado para prosseguir com a redefinição.
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Seu e-mail cadastrado"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
            />

            <TouchableOpacity 
              style={styles.button} 
              onPress={handleVerifyEmail}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Verificar Conta</Text>}
            </TouchableOpacity>
          </View>
        ) : (
          /* ---------------- CASO 3: EMAIL EXISTE -> EXIBIR FORMULÁRIO DE TROCA ---------------- */
          <View style={{ width: "100%" }}>
            <Text style={[styles.subtitle, { color: "#00B89A", fontWeight: "bold" }]}>
              Conta verificada para: {email}
            </Text>
            <Text style={styles.subtitle}>
              Digite e confirme a sua nova senha de acesso abaixo.
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Nova Senha"
              placeholderTextColor="#999"
              secureTextEntry
              value={novaSenha}
              onChangeText={setNovaSenha}
              autoCapitalize="none"
              editable={!loading}
            />

            <TextInput
              style={styles.input}
              placeholder="Confirme a Nova Senha"
              placeholderTextColor="#999"
              secureTextEntry
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
              autoCapitalize="none"
              editable={!loading}
            />

            <TouchableOpacity 
              style={[styles.button, { backgroundColor: "#00B89A" }]} 
              onPress={handleUpdatePassword}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Salvar Nova Senha</Text>}
            </TouchableOpacity>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}