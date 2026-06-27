import React, { useCallback, useEffect, useState } from "react";
import { View, FlatList, StyleSheet, Text, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { theme } from "../../global/themes";
import api from "../../config/api";
import { feedObserver } from "../../utils/FeedObserver";
import PostCard from "../PostCard";


export default function FeedScreen() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loggedUser, setLoggedUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

const loadFeed = useCallback(async () => {
    try {
      const storedUser = await AsyncStorage.getItem("user");
      const user = storedUser ? JSON.parse(storedUser) : null;

      if (!user?.id) {
        setPosts([]);
        return;
      }

      setLoggedUser(user);

      // CORREÇÃO AQUI: Mudamos de 'axios.get' para 'api.get'
      // E removemos o '?usuario_id=86' da URL, deixando apenas a rota limpa!
      const response = await api.get("/posts/feed");

      setPosts(response.data ?? []);
    } catch (error: any) {
      console.log("Erro ao carregar o feed:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFeed();
    feedObserver.subscribe(loadFeed);

    return () => {
      feedObserver.unsubscribe(loadFeed);
    };
  }, [loadFeed]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={theme.colors.primaryLight} />
        <Text style={styles.centerText}>Carregando feed...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        onRefresh={loadFeed}
        refreshing={loading}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.centerText}>Nenhuma publicacao encontrada.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <PostCard
            post={item}
            loggedUser={loggedUser}
            onChanged={loadFeed}
            canDelete={false}
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
  center: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 30,
  },
  centerText: {
    color: "#666",
    fontWeight: "600",
    marginTop: 8,
  },
});
