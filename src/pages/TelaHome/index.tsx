import React from "react";
import { Text, View, ScrollView, Button, TouchableOpacity } from "react-native";
import { style } from "./style";
import ScreenInfo from "../../components/ScreenInfo";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../global/themes";
import { scaleFont } from "../../assets/utils/responsive";
import FeedScreen from "../../components/feed";
import { Feather } from "@expo/vector-icons";
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function TelaHome({}) {
  return (
    <View style={style.container}>
      <View style={style.boxHeader}>
        <View style={style.Saudacao}>
          <Text style={{ fontSize: 28, color: "#000000", fontWeight: "bold" }}>
            Bom Dia, Maria
          </Text>
          I<Ionicons name="sunny" size={28} color={"#FFD700"} />
        </View>
        <View>
          <Text
            style={{
              color: theme.colors.primaryDark,
              fontSize: scaleFont(20),
              marginLeft: 50,
            }}
          >
            Você tem 🌿 120 EcoBeneficios
          </Text>
        </View>
      </View>
      <View style={style.boxMid}>
        <View style={style.boxMidTroque}>
          <Text style={{ fontSize: scaleFont(40) }}>🔄</Text>
          <Text style={{ fontSize: scaleFont(20) }}>Troque</Text>
          <Text style={{ fontSize: scaleFont(20) }}>&</Text>
          <Text style={{ fontSize: scaleFont(20) }}>Doe</Text>
        </View>
        <View style={style.boxMidTroque}>
          <Text style={{ fontSize: scaleFont(40) }}>🗺️</Text>
          <Text style={{ fontSize: scaleFont(20) }}>Mapa</Text>
          <Text style={{ fontSize: scaleFont(20) }}>Verde</Text>
        </View>
        <View style={style.boxMidTroque}>
          <Text style={{ fontSize: scaleFont(40) }}> 🎯</Text>
          <Text style={{ fontSize: scaleFont(20) }}>Missões</Text>
        </View>
      </View>
      <View style={style.boxFeed}>
        <FeedScreen />
      </View>
      <View style={style.boxMenu}>
        <View style={style.menuContainer}>
          <TouchableOpacity style={style.button}>
            <Ionicons name="home" size={20} style={style.icon} />

            <Text style={style.menuLabel}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity style={style.button}>
           <AntDesign name="comment" size={20} color="black" />

            <Text style={style.menuLabel}>comunidade</Text>
          </TouchableOpacity>

          <TouchableOpacity style={style.button}>
            <Ionicons name="add-circle-outline" size={30} style={style.icon} />

            <Text style={style.menuLabel}>Publicar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={style.button}>
            <Entypo name="credit" size={20} color="black" />

            <Text style={style.menuLabel}>Créditos</Text>
          </TouchableOpacity>

          <TouchableOpacity style={style.button}>
           <Feather name="user" size={20} color="black" />

            <Text style={style.menuLabel}>Perfi</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
