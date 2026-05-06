import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { Ionicons, Feather, AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import FeedScreen from "../../components/feedCard";
import { theme } from "../../global/themes";
import { RootStackParamList } from "../../routes";
import UserSession from "../../utils/UserSessions";
import { style } from "./style";

type NavigationProps = NativeStackNavigationProp<RootStackParamList, "TelaHome">;

export default function TelaHome() {
  const navigation = useNavigation<NavigationProps>();
  const user = UserSession.getInstance().getUser();

  return (
    <View style={style.container}>
      <View style={style.header}>
        <View>
          <Text style={style.greeting}>Olá, {user?.nome ?? "Eco amigo"}</Text>
          <Text style={style.subText}>
            {user?.ecoBeneficios ?? 0} EcoBenefícios
          </Text>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate("TelaNotificacao")}>
          <Ionicons
            name="notifications"
            size={26}
            color={theme.colors.primaryDark}
          />
        </TouchableOpacity>
      </View>

      <View style={style.quickActions}>
        <TouchableOpacity
          style={style.actionCard}
          onPress={() => navigation.navigate("MapaVerde")}
        >
          <Ionicons name="map-outline" size={22} color="#fff" />
          <Text style={style.actionText}>Mapa Verde</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={style.actionCard}
          onPress={() => navigation.navigate("TelaMissoes")}
        >
          <Ionicons name="leaf-outline" size={22} color="#fff" />
          <Text style={style.actionText}>Missões</Text>
        </TouchableOpacity>
      </View>

      <View style={style.feedContainer}>
        <FeedScreen />
      </View>

      <TouchableOpacity
        style={style.fab}
        onPress={() => navigation.navigate("Publicar")}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>

      <View style={style.bottomMenu}>
        <TouchableOpacity onPress={() => navigation.navigate("TelaMensagem")}>
          <AntDesign name="message" size={26} color={theme.colors.primaryDark} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("TelaHome")}>
          <Ionicons name="home" size={28} color={theme.colors.primaryLight} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("TelaPerfil")}>
          <Feather name="user" size={26} color={theme.colors.primaryDark} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
