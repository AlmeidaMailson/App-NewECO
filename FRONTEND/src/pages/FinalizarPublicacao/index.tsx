import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from "react-native";
import { Video, ResizeMode } from "expo-av";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { style } from "./style";
import { feedObserver } from "../../utils/FeedObserver";
import { theme } from "../../global/themes";

export default function FinalizarPublicacao() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const { midia } = route.params;

  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePublish = () => {
    setLoading(true);

    setTimeout(() => {
      feedObserver.notify();
      setLoading(false);
      navigation.navigate("TelaHome");
    }, 1500);
  };

  return (
    <KeyboardAvoidingView
      style={style.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* HEADER */}
      <View style={style.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>

        <Text style={style.title}>Finalizar</Text>

        <View style={{ width: 26 }} />
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

      {/* INPUT */}
      <View style={style.inputContainer}>
        <TextInput
          style={style.input}
          placeholder="Escreva uma legenda ecológica 🌱"
          placeholderTextColor="#999"
          multiline
          value={caption}
          onChangeText={setCaption}
        />
      </View>

      {/* BOTÃO */}
      <TouchableOpacity style={style.button} onPress={handlePublish}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={style.buttonText}>Publicar</Text>
        )}
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}