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
import { RootStackParamList } from "../../routes";
import UserSession from "../../utils/UserSessions";
import { style } from "./style";

type NavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  "TelaEditarPerfil"
>;

export default function TelaEditarPerfil() {
  const navigation = useNavigation<NavigationProps>();
  const session = UserSession.getInstance();
  const currentUser = session.getUser();

  const [name, setName] = useState(currentUser?.nome ?? "Seu Nome");
  const [email, setEmail] = useState("email@email.com");
  const [bio, setBio] = useState("Apaixonado por sustentabilidade");
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);

    setTimeout(() => {
      session.setUser({
        ...currentUser,
        nome: name,
        ecoBeneficios: currentUser?.ecoBeneficios ?? 0,
      });
      setLoading(false);
      Alert.alert("Perfil atualizado", "Suas alterações foram salvas.");
      navigation.goBack();
    }, 700);
  };

  return (
    <KeyboardAvoidingView
      style={style.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={style.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={style.iconButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={style.headerTitle}>Editar perfil</Text>
        <View style={style.iconButton} />
      </View>

      <ScrollView contentContainerStyle={style.scroll}>
        <View style={style.imageContainer}>
          <Image
            source={{ uri: currentUser?.avatarUri ?? "https://i.pravatar.cc/150?img=12" }}
            style={style.avatar}
          />
          <TouchableOpacity style={style.changePhoto}>
            <Ionicons name="camera-outline" size={18} color="#fff" />
            <Text style={style.changePhotoText}>Alterar foto</Text>
          </TouchableOpacity>
        </View>

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
          />
        </View>

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
