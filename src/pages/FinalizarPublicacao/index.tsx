import React, { useState } from "react";
import { View, Text, Image, TextInput, TouchableOpacity } from "react-native";
import { Video, ResizeMode } from "expo-av";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../../routes";
import { style } from "./style";
import { Ionicons } from "@expo/vector-icons";
import { feedObserver } from "../../utils/FeedObserver";

type NavProps = NativeStackNavigationProp<
  RootStackParamList,
  "FinalizarPublicacao"
>;

export default function FinalizarPublicacao() {
  const navigation = useNavigation<NavProps>();
  const route = useRoute<any>();

  const { midia } = route.params;
  const [caption, setCaption] = useState("");

  return (
    <View style={style.container}>
      {/* HEADER */}
      <View style={style.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={30} color="#000" />
        </TouchableOpacity>

        <Text style={style.title}>Finalizar Publicação</Text>

        <View style={{ width: 30 }}></View>
      </View>

      {/* MÍDIA */}
      <View style={style.mediaBox}>
        {midia.mediaType === "video" ? (
          <Video
            source={{ uri: midia.uri }}
            style={style.media}
            useNativeControls
            resizeMode={ResizeMode.COVER}
          />
        ) : (
          <Image source={{ uri: midia.uri }} style={style.media} />
        )}
      </View>

      {/* LEGENDA */}
      <Text style={style.label}>Legenda</Text>
      <TextInput
        style={style.input}
        placeholder="Escreva algo..."
        placeholderTextColor="#999"
        multiline
        value={caption}
        onChangeText={setCaption}
      />

      {/* BOTÃO PUBLICAR */}
      <TouchableOpacity
        style={style.button}
        onPress={() => {
             feedObserver.notify();
          alert("Publicação realizada!");
          navigation.navigate("TelaHome");
        }}
      >
        <Text style={style.buttonText}>Publicar</Text>
      </TouchableOpacity>
    </View>
  );
}
