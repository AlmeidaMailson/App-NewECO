import React, { useState } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { theme } from "../../global/themes";
import PostCard from "../PostCard";

export default function FeedScreen() {
  const [likedPosts, setLikedPosts] = useState<number[]>([]);

  const posts = [
    {
      id: 1,
      user: "Maria_user",
      image:
        "https://dicasmaonamassa.com.br/wp-content/uploads/2024/04/vasos-de-garrafa-pet-bichinhos-scaled.jpg",
      caption: "Fazendo vasos de garrafa PET",
      likes: 120,
      profile: {
        id: "feed-1",
        name: "Maria User",
        username: "@Maria_user",
        avatar: "https://i.pravatar.cc/150?img=1",
        bio: "Crio ideias simples de reaproveitamento para o dia a dia.",
        followers: 682,
        following: 144,
        posts: [
          {
            id: "1",
            image:
              "https://dicasmaonamassa.com.br/wp-content/uploads/2024/04/vasos-de-garrafa-pet-bichinhos-scaled.jpg",
            caption: "Fazendo vasos de garrafa PET.",
          },
        ],
      },
    },
    {
      id: 2,
      user: "ONG",
      image:
        "https://consed.org.br/storage/news/txlgf5cjybyj99x9cpxoitpwyyxsvv.jpeg",
      caption: "Ensinando reciclagem para crianças",
      likes: 245,
      profile: {
        id: "feed-2",
        name: "ONG Verde",
        username: "@ONG",
        avatar: "https://i.pravatar.cc/150?img=2",
        bio: "Educação ambiental, reciclagem e ações comunitárias.",
        followers: 1240,
        following: 238,
        posts: [
          {
            id: "1",
            image: "https://consed.org.br/storage/news/txlgf5cjybyj99x9cpxoitpwyyxsvv.jpeg",
            caption: "Ensinando reciclagem para crianças.",
          },
        ],
      },
    },
  ];

  const toggleLike = (postId: number) => {
    setLikedPosts((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId]
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            isLiked={likedPosts.includes(item.id)}
            onLike={() => toggleLike(item.id)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: 10,
  },
});
