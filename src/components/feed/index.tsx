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

const { width } = Dimensions.get("window");

export default function FeedScreen() {
  // Estado para armazenar curtidas
  const [likedPosts, setLikedPosts] = useState<number[]>([]);

  // Simulação de posts
  const posts = [
    {
      id: 1,
      user: "eco_user",
      image: "https://picsum.photos/600/750?1",
      caption: "Curtindo a natureza 🌿",
      likes: 120,
    },
    {
      id: 2,
      user: "nature_lover",
      image: "https://picsum.photos/600/750?2",
      caption: "Respirando ar puro ☀️",
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

            {/* Imagem do Post */}
            <Image source={{ uri: post.image }} style={styles.image} />

            {/* Ações */}
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => toggleLike(post.id)}>
                <Ionicons
                  name={isLiked ? "heart" : "heart-outline"}
                  size={26}
                  color={isLiked ? "#ff3b30" : "#000"}
                />
              </TouchableOpacity>
              <Ionicons name="chatbubble-outline" size={24} />
              <Ionicons name="paper-plane-outline" size={24}  />
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
