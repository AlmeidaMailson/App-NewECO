import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage"; // 🟢 Para salvar o novo estado do user fisicamente

import { RootStackParamList } from "../../routes";
import UserSession from "../../utils/UserSessions";
import { style } from "./style";

// 🟢 MUDANÇA AQUI: Trazendo nossa instância HTTP com token injetado
import api from "../../config/api";

type NavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  "TelaEditarPerfil"
>;

export default function TelaEditarPerfil() {
  const navigation = useNavigation<NavigationProps>();
  const session = UserSession.getInstance();
  const currentUser = session.getUser();

  // Estados agora inicializam buscando as propriedades reais do Singleton
  const [name, setName] = useState(currentUser?.nome ?? "");
  const [email, setEmail] = useState(currentUser?.email ?? "");
  const [bio, setBio] = useState(currentUser?.bio ?? "");
  const [loading, setLoading] = useState(false);

  // 🟢 ENVIAR ALTERAÇÕES PARA O FASTAPI
  const handleSave = async () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert("Atenção", "Os campos Nome e E-mail são obrigatórios.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        nome: name,
        email: email,
        bio: bio,
      };

      // Dispara a requisição para a sua rota de atualização do FastAPI
      // Alinhe o endpoint conforme configurado no seu router (ex: /users/update ou /users/me)
      const response = await api.put("/users/me", payload);
      
      // O backend costuma retornar o usuário atualizado completo. 
      // Se não retornar, mesclamos localmente com o response.data
      const updatedUser = {
        ...currentUser,
        ...response.data,
      };

      // 1. Atualiza a sessão em memória (Singleton)
      session.setUser(updatedUser);

      // 2. Sincroniza e persiste no armazenamento do celular para o próximo App Boot
      await AsyncStorage.setItem("user", JSON.stringify(updatedUser));

      Alert.alert("Sucesso", "Perfil atualizado com a comunidade NewECO!");
      navigation.goBack();

    } catch (error: any) {
      console.log("Erro ao atualizar perfil:", error.response?.data || error.message);
      
      const msgErro = error.response?.data?.detail ?? "Não foi possível salvar as alterações.";
      Alert.alert("Erro ao salvar", msgErro);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={style.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* HEADER */}
      <View style={style.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={style.iconButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={style.headerTitle}>Editar perfil</Text>
        <View style={style.iconButton} />
      </View>

      <ScrollView contentContainerStyle={style.scroll} showsVerticalScrollIndicator={false}>
        {/* AVATAR BOX */}
        <View style={style.imageContainer}>
          <Image
            source={{ uri: currentUser?.avatarUri ?? "https://i.pravatar.cc/150?img=12" }}
            style={style.avatar}
          />
          <TouchableOpacity style={style.changePhoto} onPress={() => Alert.alert("Upload", "Integração com a câmera em breve!")}>
            <Ionicons name="camera-outline" size={18} color="#fff" />
            <Text style={style.changePhotoText}>Alterar foto</Text>
          </TouchableOpacity>
        </View>

        {/* INPUTS DO FORMULÁRIO */}
        <View style={style.form}>
          <Text style={style.label}>Nome</Text>
          <TextInput style={style.input} value={name} onChangeText={setName} />

          <Text style={style.label}>E-mail</Text>
          <TextInput
            style={style.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={style.label}>Bio</Text>
          <TextInput
            style={[style.input, style.bioInput]}
            value={bio}
            onChangeText={setBio}
            multiline
            placeholder="Conte um pouco sobre suas ações sustentáveis..."
            placeholderTextColor="#666"
          />
        </View>

        {/* BOTÃO SALVAR */}
        <TouchableOpacity style={style.button} onPress={handleSave} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={style.buttonText}>Salvar alterações</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}