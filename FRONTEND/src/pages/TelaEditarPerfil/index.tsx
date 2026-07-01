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
import AsyncStorage from "@react-native-async-storage/async-storage"; //
import ProfileImage from "../../components/ProfileImage";
import { RootStackParamList } from "../../routes";
import UserSession from "../../utils/UserSessions";
import { style } from "./style";

// MUDANÇA AQUI: Trazendo nossa instância HTTP com token injetado
import api, { API_URL } from "../../config/api";

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
  const [avatarUri, setAvatarUri] = useState(
    currentUser?.avatar_url || ""
);

  // ENVIAR ALTERAÇÕES PARA O FASTAPI
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
        avatar_url: avatarUri,
      };

      const response = await api.put("/users/me", payload);

      

      const updatedUser = response.data;

      // Atualiza o Singleton
      await UserSession.getInstance().setUser(updatedUser);

      // Salva no AsyncStorage (caso ainda use)
      await AsyncStorage.setItem("user", JSON.stringify(updatedUser));

      Alert.alert("Sucesso", "Perfil atualizado com sucesso!");

      navigation.goBack();
    } catch (error: any) {
      console.log(error.response?.data || error.message);

      Alert.alert(
        "Erro",
        error.response?.data?.detail ?? "Erro ao atualizar perfil.",
      );
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
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={style.iconButton}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={style.headerTitle}>Editar perfil</Text>
        <View style={style.iconButton} />
      </View>

      <ScrollView
        contentContainerStyle={style.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* AVATAR BOX */}
        <View style={style.imageContainer}>
          <ProfileImage
    imageUri={avatarUri}
    onImageSelected={setAvatarUri}
/>
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
        <TouchableOpacity
          style={style.button}
          onPress={handleSave}
          disabled={loading}
        >
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
