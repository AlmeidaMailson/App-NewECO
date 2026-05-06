import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../routes";
import { styles } from "./style";

type NavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  "TelaEsqueceSenha"
>;

export default function TelaEsqueceSenha() {
  const navigation = useNavigation<NavigationProps>();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleResetPassword = async () => {
    if (!email.trim()) {
      setMessage("Digite seu e-mail para continuar.");
      return;
    }

    setLoading(true);
    setMessage("");

    setTimeout(() => {
      setLoading(false);
      setMessage("Link de recuperação enviado para seu e-mail.");
    }, 900);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.card}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.title}>Recuperar senha</Text>
        <Text style={styles.subtitle}>
          Informe seu e-mail para receber o link de recuperação.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Seu e-mail"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Enviar link</Text>
          )}
        </TouchableOpacity>

        {message !== "" && <Text style={styles.message}>{message}</Text>}
      </View>
    </KeyboardAvoidingView>
  );
}
