import React, { use, useEffect, useState } from "react";
import {
  Text,
  View,
  ScrollView,
  Button,
  TouchableOpacity,
  Modal,
  FlatList,
} from "react-native";
import { style } from "./style";
import ScreenInfo from "../../components/ScreenInfo";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../global/themes";
import { scaleFont, scaleHeight } from "../../utils/responsive";
import FeedScreen from "../../components/feedCard";
import { Feather } from "@expo/vector-icons";
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Picker } from "@react-native-picker/picker";
import Publicar from "../Publicar";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../routes";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import TroqueDoe from "../TroqueDoe";
import UserSession from "../../utils/UserSessions";
import { feedObserver } from "../../utils/FeedObserver";
import ChatScreen from "../../components/ChatScreen";
import { Video } from "expo-av";
import FloatingButton from "../../components/FloatingButton";

type NavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  "TelaHome"
>;

export default function TelaHome() {
  const [posts, setPosts] = useState<any[]>([]);

   const [isChatOpen, setIsChatOpen] = useState(false);


  const atualizarFeed = () => {
    console.log(" Feed atualizado automaticamente!");
    carregarPosts();
  };

  const carregarPosts = () => {
    setPosts((prev) => [...prev]);
  };

  useEffect(() => {
    feedObserver.subscribe(atualizarFeed);
    return () => {
      feedObserver.unsubscribe(atualizarFeed);
    };
  }, []);
  const user = UserSession.getInstance().getUser();

  const [mostrarOpcoes, setMostrarOpcoes] = useState(false);

  const OPCOES = [
    { id: "1", nome: "TROQUE E DOE" },
    { id: "2", nome: "MAPA VERDE" },
    { id: "3", nome: "MISSÕES" },
  ];

  const [selecaoAtual, setSelecaoAtual] = useState(OPCOES[0]);

  const navigation = useNavigation<NavigationProps>();

  const [selectedValue, setSelectedValue] = React.useState("opcao1");

  return (
    <View style={style.container}>
      <View style={style.boxHeader}>
        <View style={style.Saudacao}>
          <Text style={{ fontSize: 28, color: "#000000", fontWeight: "bold" }}>
            Bom Dia, {user?.nome}
          </Text>
          <Ionicons name="sunny-outline" size={28} />
        </View>
        <View>
          <Text
            style={{
              color: theme.colors.primaryDark,
              fontSize: scaleFont(20),
              marginLeft: 50,
            }}
          >
            Você tem 🌿 {user?.ecoBeneficios} EcoBeneficios
          </Text>
        </View>
      </View>

      <View style={style.boxFeed}>
        <FeedScreen />
        {/* <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 20, margin: 20 }}>Feed</Text>

          <FlatList
            data={posts}
            renderItem={({ item }) => <Text>{item.caption}</Text>}
          />
        </View> */}
        <View>
         <FloatingButton onPress={() => navigation.navigate("ChatScreen")} />
          
        </View>

        <View style={style.boxMid}>
          <TouchableOpacity
            style={{
              backgroundColor: "#4CAF50",
              width: 40,
              height: 40,
              borderRadius: 20,
              justifyContent: "center",
              alignItems: "center",
              gap: 10,
            }}
            onPress={() => setMostrarOpcoes(!mostrarOpcoes)}
          >
            <Text style={{ position: "absolute", color: "#fff", fontSize: 22 }}>
              +
            </Text>
          </TouchableOpacity>

          {mostrarOpcoes && (
            <ScrollView
              showsVerticalScrollIndicator
              style={{ marginTop: 10, marginLeft: 60, position: "absolute" }}
            >
              {OPCOES.map((opcao) => (
                <TouchableOpacity
                  key={opcao.id}
                  onPress={() => {
                    setSelecaoAtual(opcao);
                    setMostrarOpcoes(false);

                    if (opcao.id === "1")
                      navigation.navigate("TroqueDoe", { opcao: opcao.id });
                  }}
                  style={{
                    backgroundColor:
                      selecaoAtual.id === opcao.id ? "#4CAF50" : "#DDD",
                    paddingVertical: 20,
                    paddingHorizontal: 40,
                    borderRadius: 20,
                    marginRight: 50,
                    marginTop: 10,
                  }}
                >
                  <Text
                    style={{
                      color: selecaoAtual.id === opcao.id ? "#FFF" : "#333",
                      fontWeight: "bold",
                      gap: 10,
                    }}
                  >
                    {opcao.nome}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      </View>
      <View style={style.boxMenu}>
        <View style={style.menuContainer}>
          <TouchableOpacity style={style.button}>
            <AntDesign name="comment" size={30} color="black" />
          </TouchableOpacity>

          <TouchableOpacity
            style={style.button}
            onPress={() => navigation.navigate("Publicar")}
          >
            <Ionicons name="add-circle-outline" size={50} style={style.icon} />
          </TouchableOpacity>

          <TouchableOpacity style={style.button}>
            <Feather name="user" size={30} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
