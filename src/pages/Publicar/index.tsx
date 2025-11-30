import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  TextInput,
  Pressable,
} from "react-native";
import * as MediaLibrary from "expo-media-library";
import { VideoView, useVideoPlayer } from "expo-video";
import { style } from "./style";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../global/themes";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { RootStackParamList } from "../../routes";
import TelaHome from "../TelaHome";

type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'Publicar'>;
export default function Publicar() {

    const navigation = useNavigation<NavigationProps>();
  const [gallery, setGallery] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);
  const [caption, setCaption] = useState("");

  const player = useVideoPlayer(null, (p) => (p.loop = false));

  useFocusEffect(
  React.useCallback(() => {

    return () => {
 
      if (player) {
        try {
          player.pause();
          player.replaceAsync(null); 
        } catch (e) {
          console.log("Erro ao parar vídeo:", e);
        }
      }
    };
  }, [])
);
  
  useEffect(() => {
    loadGallery();
  }, []);

  useEffect(() => {
    if (selected?.mediaType === "video") {
      player.replaceAsync(selected.uri);
    }
  }, [selected]);

  const loadGallery = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") return;

    const media = await MediaLibrary.getAssetsAsync({
      first: 80,
      sortBy: MediaLibrary.SortBy.creationTime,
      mediaType: ["photo", "video"],
    });

    setGallery(media.assets);
    setSelected(media.assets[0]);
  };

  const renderThumbnail = ({ item }: any) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("FinalizarPublicacao", { midia: item })}
      style={{
        margin: 2,
        borderWidth: selected?.id === item.id ? 2 : 0,
        borderColor: theme.colors.primaryLight,
      }}
    >
      <Image source={{ uri: item.uri }} style={{ width: 120, height: 120 }} />
      {item.mediaType === "video" && (
        <Text
          style={{ position: "absolute", bottom: 5, right: 5, color: "#fff" }}
        >
          🎥
        </Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={style.container}>
      <View style={style.boxtop}>
        <View style={style.boxHeader}>
          <View style={style.iconeHome}>
            <TouchableOpacity
             style={style.button}
              onPress={()=>navigation.navigate('TelaHome')}
             >
              <Ionicons name="close-circle-outline"  style={style.icon} />
            </TouchableOpacity>
          </View>

          <View style={style.textPub}>
            <Text style={style.title}>Nova</Text>
              <Text style={style.title}>Publicação</Text>
          </View>

          <View style={style.pressable}>
            <Pressable
               onPress={() => navigation.navigate("FinalizarPublicacao", { midia: selected })}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: 16,
                  fontWeight:'700'
                }}
              >
                CONTINUAR
              </Text>
            </Pressable>
          </View>
        </View>
      </View>

      <View style={style.previewContainer}>
        {selected?.mediaType === "video" ? (
          <VideoView
            player={player}
            style={style.preview}
            nativeControls
            contentFit="cover"
            
          />
        ) : (
          <Image source={{ uri: selected?.uri }} style={style.preview} />
        )}
      </View>

      <FlatList
        data={gallery}
        numColumns={3}
        keyExtractor={(item) => item.id}
        renderItem={renderThumbnail}
        contentContainerStyle={{ paddingBottom: 10 }}
      />
    </View>
  );
}
