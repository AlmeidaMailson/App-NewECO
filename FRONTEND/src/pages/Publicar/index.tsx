import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";

import * as MediaLibrary from "expo-media-library";
import { VideoView, useVideoPlayer } from "expo-video";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../routes";
import { styles } from "./style";
import { theme } from "../../global/themes";

type NavigationProps = NativeStackNavigationProp<RootStackParamList, "Publicar">;

export default function Publicar() {
  const navigation = useNavigation<NavigationProps>();
  const [gallery, setGallery] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // PLAYER DE VÍDEO
  const player = useVideoPlayer(null, (p) => {
    p.loop = false;
  });

  // LIMPAR PLAYER AO SAIR DA TELA
 useFocusEffect(
    React.useCallback(() => {
      return () => {
        try {
          player.pause();
        } catch (error) {
          console.log("Player já liberado");
        }
      };
    }, [player])
  );

  // CARREGAR GALERIA
  useEffect(() => {
    loadGallery();
  }, []);

  // TROCAR VÍDEO AO SELECIONAR
  useEffect(() => {
    if (selected && selected.mediaType === "video") {
      player.replaceAsync({
        uri: selected.uri,
      });
    }
  }, [selected]);

  // CARREGAR MÍDIAS
  const loadGallery = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permissão necessária",
          "Precisamos do acesso à sua galeria para você conseguir publicar no NewECO."
        );
        setLoading(false);
        return;
      }

      const media = await MediaLibrary.getAssetsAsync({
        first: 60,
        sortBy: MediaLibrary.SortBy.creationTime,
        mediaType: ["photo", "video"],
      });

      setGallery(media.assets);

      if (media.assets.length > 0) {
        setSelected(media.assets[0]);
      }
    } catch (error) {
      console.log("Erro ao carregar galeria:", error);
    } finally {
      setLoading(false);
    }
  };

  // BOTÃO AVANÇAR SEGURO
  const handleAvançar = () => {
    if (!selected) {
      Alert.alert("Atenção", "Por favor, selecione uma foto ou vídeo antes de avançar.");
      return;
    }
    
    navigation.navigate("FinalizarPublicacao", {
      midia: selected,
    });
  };

  // THUMBNAIL
  const renderThumbnail = ({ item }: any) => (
    <TouchableOpacity
      onPress={() => setSelected(item)}
      style={[
        styles.thumbBox,
        selected?.id === item.id && styles.selectedThumb,
      ]}
    >
      <Image source={{ uri: item.uri }} style={styles.thumb} />

      {item.mediaType === "video" && (
        <View style={styles.videoBadge}>
          <Ionicons name="videocam" size={16} color="#fff" />
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={28} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Nova publicação</Text>

        <Pressable onPress={handleAvançar}>
          <Text style={styles.continue}>Avançar</Text>
        </Pressable>
      </View>

      {/* PREVIEW */}
      <View style={styles.previewContainer}>
        {loading ? (
          <ActivityIndicator size="large" color={theme.colors.primaryLight} />
        ) : selected?.mediaType === "video" ? (
          <VideoView player={player} style={styles.preview} nativeControls />
        ) : selected ? (
          <Image source={{ uri: selected?.uri }} style={styles.preview} />
        ) : (
          <Text style={{ color: "#999" }}>Nenhuma mídia encontrada</Text>
        )}
      </View>

      {/* GALERIA */}
      {loading ? (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <ActivityIndicator size="small" color="#fff" />
        </View>
      ) : (
        <FlatList
          data={gallery}
          numColumns={3}
          keyExtractor={(item) => item.id}
          renderItem={renderThumbnail}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}