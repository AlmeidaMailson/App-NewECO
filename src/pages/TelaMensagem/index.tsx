import React from "react";
import Logo from "../../assets/logo.png";
import {
  View,
  Text,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { style } from "./style";
import TelaHome from "../TelaHome";
import UserSession from "../../utils/UserSessions";
import { useNavigation } from "@react-navigation/native";
import {
  NativeStackNavigationProp,
  NativeStackNavigatorProps,
} from "@react-navigation/native-stack";
import { RootStackParamList } from "../../routes";
import { theme } from "../../global/themes";
type NavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  "TelaMensagem"
>;

export default function TelaMensagem() {
  const navigation = useNavigation<NavigationProps>();

  return (
    <View style={style.container}>
      <View style={style.boxHeader}>
        <View style={style.boxHeaderInicio}>
          <Text
            style={{
              fontSize: 40,
              fontFamily: "roboto-slab-regular",
            }}
          >
            Conexões
          </Text>
          <Ionicons name="notifications" size={41} />
        </View>
        <View style={style.boxHeaderLogo}>
          <View style={style.pesquisar}>
            <TextInput
              placeholder="Pesquisar..."
              style={{
                height: 52,
                flex: 1,
                fontSize: 20,
              }}
            />
            <Ionicons name="search" size={20} color="#b92929" />
          </View>

          <View style={style.LogoContainer}>
            <Image source={Logo} style={style.logo} resizeMode="contain" />
          </View>
        </View>
      </View>

      <View style={style.boxMensagen}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 2 }}
        >
          <TouchableOpacity onPress={() => navigation.navigate("Conversa")}>
            <View style={style.CardMensagen}>
              <View style={style.fotoPerfil}>
                <Text> Perfil</Text>
              </View>
              <View style={style.NotifiConversas}>
                <Text
                  style={{
                    fontSize: 40,
                    fontFamily: "roboto-slab-regular",
                    color: theme.colors.textLight,
                  }}
                >
                  Kitata Anth
                </Text>
                <Text
                  style={{
                    fontSize: 25,
                    fontFamily: "roboto",
                    color: theme.colors.textLight,
                    marginLeft: 20,
                  }}
                >
                  Oie! Tudo Bem..
                </Text>
              </View>
              <View style={style.boxHora}>
                <Text
                  style={{
                    fontSize: 20,
                    fontFamily: "roboto-slab-regular",
                    color: theme.colors.textLight,
                  }}
                >
                  3:45 PM
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <View style={style.boxMenu}>
        <View style={style.BoxMenuHome}>
          <TouchableOpacity onPress={() => navigation.navigate("TelaHome")}>
            <Ionicons name="home" size={30} color={theme.colors.textDark} />
          </TouchableOpacity>
        </View>
        <View style={style.BoxMenuAdd}>
          <Ionicons name="person-add" size={30} color={theme.colors.textDark} />
        </View>
        <View style={style.boxMenuicons}>
          <Ionicons name="menu" size={30} color={theme.colors.textDark} />
        </View>
      </View>
    </View>
  );
}
