import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Pressable,
} from "react-native";

import * as MediaLibrary from "expo-media-library";

import { VideoView, useVideoPlayer } from "expo-video";

import { Ionicons } from "@expo/vector-icons";

import {
  useNavigation,
  useFocusEffect,
} from "@react-navigation/native";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { RootStackParamList } from "../../routes";

import { styles } from "./style";

import { theme } from "../../global/themes";

type NavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  "Publicar"
>;

export default function Publicar() {

  const navigation = useNavigation<NavigationProps>();

  const [gallery, setGallery] = useState<any[]>([]);

  const [selected, setSelected] = useState<any | null>(null);

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

    if (
      selected &&
      selected.mediaType === "video"
    ) {

      player.replaceAsync({
        uri: selected.uri,
      });

    }

  }, [selected]);

  // CARREGAR MÍDIAS
  const loadGallery = async () => {

    const { status } =
      await MediaLibrary.requestPermissionsAsync();

    if (status !== "granted") return;

    const media =
      await MediaLibrary.getAssetsAsync({
        first: 60,

        sortBy: MediaLibrary.SortBy.creationTime,

        mediaType: ["photo", "video"],
      });

    setGallery(media.assets);

    setSelected(media.assets[0]);

  };

  // THUMBNAIL
  const renderThumbnail = ({ item }: any) => (

    <TouchableOpacity
      onPress={() => setSelected(item)}

      style={[
        styles.thumbBox,

        selected?.id === item.id &&
          styles.selectedThumb,
      ]}
    >

      <Image
        source={{ uri: item.uri }}
        style={styles.thumb}
      />

      {item.mediaType === "video" && (
        <View style={styles.videoBadge}>
          <Text style={{ color: "#fff" }}>
            🎥
          </Text>
        </View>
      )}

    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
        >
          <Ionicons
            name="close"
            size={28}
            color="#fff"
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Nova publicação
        </Text>

        <Pressable
          onPress={() =>
            navigation.navigate(
              "FinalizarPublicacao",
              {
                midia: selected,
              }
            )
          }
        >
          <Text style={styles.continue}>
            Avançar
          </Text>
        </Pressable>

      </View>

      {/* PREVIEW */}
      <View style={styles.previewContainer}>

        {selected?.mediaType === "video" ? (

          <VideoView
            player={player}
            style={styles.preview}
            nativeControls
          />

        ) : (

          <Image
            source={{ uri: selected?.uri }}
            style={styles.preview}
          />

        )}

      </View>

      {/* GALERIA */}
      <FlatList
        data={gallery}

        numColumns={3}

        keyExtractor={(item) => item.id}

        renderItem={renderThumbnail}

        showsVerticalScrollIndicator={false}
      />

    </View>
  );
}