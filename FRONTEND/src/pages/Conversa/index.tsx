import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../routes";
import { style } from "./Style";
import { theme } from "../../global/themes";

type NavigationProps = NativeStackNavigationProp<RootStackParamList, "Conversa">;

const chatUser = {
  id: "chat-1",
  name: "Kitata Anth",
  username: "@kitataeco",
  avatar: "https://i.pravatar.cc/150?img=5",
  bio: "Conversa sobre reciclagem, doações verdes e mudas para a comunidade.",
  followers: 354,
  following: 88,
  posts: [
    {
      id: "1",
      image:
        "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=900",
      caption: "Separando materiais recicláveis para trocar por mudas.",
    },
  ],
};

export default function Conversa() {
  const navigation = useNavigation<NavigationProps>();
  const [message, setMessage] = useState("");

  const openProfile = () => {
    navigation.navigate("TelaPerfilUsuario", { user: chatUser });
  };

  return (
    <KeyboardAvoidingView
      style={style.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <View style={style.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={style.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={style.profileButton} onPress={openProfile}>
          <Image source={{ uri: chatUser.avatar }} style={style.profileImage} />

          <View style={style.profileInfo}>
            <Text style={style.name}>{chatUser.name}</Text>
            <Text style={style.username}>{chatUser.username}</Text>
          </View>
        </TouchableOpacity>

        <Text style={style.status}>Online</Text>
      </View>

      <ScrollView
        style={style.messages}
        contentContainerStyle={style.messagesContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={style.messageLeft}>
          <Text style={style.messageText}>Olá, bom dia! Tudo bem?</Text>
        </View>

        <View style={style.messageRight}>
          <Text style={style.messageRightText}>Tudo sim! E você?</Text>
        </View>

        <View style={style.messageLeft}>
          <Text style={style.messageText}>
            Tenho materiais recicláveis para trocar por mudas.
          </Text>
        </View>
      </ScrollView>

      <View style={style.inputContainer}>
        <TextInput
          placeholder="Digite uma mensagem..."
          placeholderTextColor="#999"
          style={style.input}
          value={message}
          onChangeText={setMessage}
        />

        <TouchableOpacity style={style.sendButton} onPress={() => setMessage("")}>
          <Ionicons name="send" size={22} color={theme.colors.primaryLight} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
