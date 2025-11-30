import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../global/themes";
import { Video, ResizeMode } from "expo-av";
import YoutubePlayer from "react-native-youtube-iframe";

const { width } = Dimensions.get("window");

export default function FeedScreen() {
  const [status, setStatus] = useState({});

  const [likedPosts, setLikedPosts] = useState<number[]>([]);

  const posts = [
    {
      id: 1,
      user: "Maria_user",
      image:
        "https://dicasmaonamassa.com.br/wp-content/uploads/2024/04/vasos-de-garrafa-pet-bichinhos-scaled.jpg",
      caption: "Fazendo vasos de garrafa Pet",
      likes: 120,
    },
    {
      id: 2,
      user: "ONG",
      image:
        "https://consed.org.br/storage/news/txlgf5cjybyj99x9cpxoitpwyyxsvv.jpeg",
      caption: "Ensinando com é a reciclagem para nossas crianças",
      likes: 245,
    },
    {
      id: 3,
      user: "supermercado_SóCachaça",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCS95zArfYdRJ1Y0HSJ7JpQjjAfCTMU4Thow&s",
      caption: "Aqui cuidamos do meio ambiente, como ninguem",
      likes: 245,
    },
    {
      id: 4,
      user: "Recicla_Sampa",
      image:
        "https://www.reciclasampa.com.br/imgs/conteudos/18_ong_internacional_promove_reciclagem_em_60_cidades_brasileiras_padrao.jpg",
      caption: "Aqui cuidamos do meio ambiente, como ninguem",
      likes: 245,
    },
    {
      id: 5,
      user: "ONG_SemFronteira",
      image:
        "https://noticias.unisanta.br/wp-content/uploads/2016/05/ong-sem-fronteira.jpg",
      caption: "Aqui cuidamos do meio ambiente, como ninguem",
      likes: 245,
    },
    {
      id: 6,
      user: "supermercado_SóCachaça",
      image:
        "data:image/jpeg;base64,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",
      caption: "Aqui cuidamos do meio ambiente, como ninguem",
      likes: 245,
    },
    {
      id: 7,
      user: "supermercado_SóCachaça",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCS95zArfYdRJ1Y0HSJ7JpQjjAfCTMU4Thow&s",
      caption: "Aqui cuidamos do meio ambiente, como ninguem",
      likes: 245,
    },
  ];

  // Função de curtir/descurtir
  const toggleLike = (postId: number) => {
    setLikedPosts((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {posts.map((post) => {
        const isLiked = likedPosts.includes(post.id);
        return (
          <View key={post.id} style={styles.card}>
            {/* Cabeçalho do Post */}
            <View style={styles.header}>
              <Ionicons name="leaf-outline" size={22} color="#b" />
              <Text style={styles.username}>@{post.user}</Text>
            </View>

            <Image source={{ uri: post.image }} style={styles.image} />

            <View style={styles.actions}>
              <TouchableOpacity onPress={() => toggleLike(post.id)}>
                <Ionicons
                  name={isLiked ? "heart" : "heart-outline"}
                  size={26}
                  color={isLiked ? "#ff3b30" : "#000"}
                />
              </TouchableOpacity>
              <Ionicons name="chatbubble-outline" size={24} />
              <Ionicons name="paper-plane-outline" size={24} />
            </View>

            {/* Contador de curtidas */}
            <Text style={styles.likes}>
              {isLiked ? post.likes + 1 : post.likes} curtidas
            </Text>

            {/* Legenda */}
            <Text style={styles.caption}>
              <Text style={styles.username}>@{post.user} </Text>
              {post.caption}
            </Text>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingVertical: 10,
  },
  card: {
    backgroundColor: theme.colors.textLight,
    borderRadius: 16,
    marginVertical: 10,
    padding: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  username: {
    color: "#bdd314",
    marginLeft: 8,
    fontWeight: "bold",
    fontSize: 15,
  },
  image: {
    width: "100%",
    aspectRatio: 4 / 5,
    borderRadius: 12,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 8,
  },
  likes: {
    color: "#fff",
    fontWeight: "bold",
    marginTop: 6,
    marginLeft: 10,
  },
  caption: {
    color: "#d9deeb",
    fontSize: 14,
    marginTop: 4,
    marginLeft: 10,
  },
});
