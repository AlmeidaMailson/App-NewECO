import React from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Logo from "../../assets/logo.png";
import { theme } from "../../global/themes";
import { RootStackParamList } from "../../routes";
import { style } from "./style";

type NavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  "TelaMensagem"
>;

const contacts = [
  {
    id: "1",
    name: "Kitata Anth",
    username: "@kitataeco",
    lastMessage: "Oie! Tudo bem?",
    time: "15:45",
    avatar: "https://i.pravatar.cc/150?img=5",
  },
  {
    id: "2",
    name: "Coleta Verde",
    username: "@coletaverde",
    lastMessage: "Seu item ainda está disponível?",
    time: "12:10",
    avatar: "https://i.pravatar.cc/150?img=8",
  },
  {
    id: "3",
    name: "Ana Recicla",
    username: "@anarecicla",
    lastMessage: "Podemos combinar a troca amanhã.",
    time: "Ontem",
    avatar: "https://i.pravatar.cc/150?img=14",
  },
];

export default function TelaMensagem() {
  const navigation = useNavigation<NavigationProps>();

  return (
    <View style={style.container}>
      <View style={style.header}>
        <View style={style.headerTop}>
          <TouchableOpacity onPress={() => navigation.navigate("TelaHome")}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={style.title}>Conexões</Text>
          <TouchableOpacity onPress={() => navigation.navigate("TelaNotificacao")}>
            <Ionicons name="notifications-outline" size={26} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={style.searchContainer}>
          <TextInput
            placeholder="Pesquisar..."
            placeholderTextColor="#777"
            style={style.input}
          />
          <Ionicons name="search" size={20} color="#777" />
        </View>

        <Image source={Logo} style={style.logo} resizeMode="contain" />
      </View>

      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={style.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={style.card}
            onPress={() => navigation.navigate("Conversa")}
          >
            <Image source={{ uri: item.avatar }} style={style.avatar} />

            <View style={style.info}>
              <Text style={style.name}>{item.name}</Text>
              <Text style={style.lastMessage}>{item.lastMessage}</Text>
            </View>

            <Text style={style.time}>{item.time}</Text>
          </TouchableOpacity>
        )}
      />

      <View style={style.menu}>
        <TouchableOpacity onPress={() => navigation.navigate("TelaHome")}>
          <Ionicons name="home-outline" size={26} color={theme.colors.primaryDark} />
        </TouchableOpacity>

        <TouchableOpacity
          style={style.addButton}
          onPress={() => navigation.navigate("TelaAdicionarUsuario")}
        >
          <Ionicons name="person-add" size={26} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("TelaPerfil")}>
          <Ionicons name="person-outline" size={26} color={theme.colors.primaryDark} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
