import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../routes";
import { theme } from "../../global/themes";
import { API_URL } from "../../config/api";
import { styles } from "./style";

type NavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  "TelaPerfilUsuario"
>;

type ProfilePost = {
  id: number | string;
  image: string;
  caption: string;
};

export default function TelaPerfilUsuario() {
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute<any>();
  const user = route.params?.user ?? {};
  const [following, setFollowing] = useState(false);
  const [loadingFollow, setLoadingFollow] = useState(false);
  const posts: ProfilePost[] = user.posts ?? [];

  useEffect(() => {
    async function loadFollowStatus() {
      try {
        const storedUser = await AsyncStorage.getItem("user");

        if (!storedUser || !user.id) {
          return;
        }

        const loggedUser = JSON.parse(storedUser);
        const usuarioId = Number(loggedUser.id);
        const seguindoId = Number(user.id);

        const response = await axios.get(
          `${API_URL}/seguidores/${seguindoId}/status`,
          {
            params: {
              usuario_id: usuarioId
            }
          }
        );

        setFollowing(response.data.following);
      } catch (error: any) {
        console.log(error.response?.data || error.message);
      }
    }

    loadFollowStatus();
  }, [user.id]);

  async function toggleFollow() {
    if (loadingFollow) {
      return;
    }

    try {
      setLoadingFollow(true);

      const storedUser = await AsyncStorage.getItem("user");

      if (!storedUser) {
        alert("Faca login para seguir usuarios");
        return;
      }

      const loggedUser = JSON.parse(storedUser);
      const usuarioId = Number(loggedUser.id);
      const seguindoId = Number(user.id);

      if (!seguindoId) {
        alert("Usuario do perfil nao encontrado");
        return;
      }

      if (following) {
        await axios.delete(`${API_URL}/seguidores/${seguindoId}`, {
          params: {
            usuario_id: usuarioId
          }
        });

        setFollowing(false);
        return;
      }

      await axios.post(
        `${API_URL}/seguidores/`,
        {
          seguidor_id: usuarioId,
          seguindo_id: seguindoId
        },
        {
          params: {
            usuario_id: usuarioId
          }
        }
      );

      setFollowing(true);
    } catch (error: any) {
      console.log(error.response?.data || error.message);

      if (error.response?.status === 409) {
        setFollowing(true);
        return;
      }

      alert(error.response?.data?.detail ?? "Erro ao atualizar seguidor");
    } finally {
      setLoadingFollow(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <Image
          source={{
            uri: user.avatar_url ?? user.avatar ?? `https://i.pravatar.cc/150?u=${user.id ?? "new-eco"}`,
          }}
          style={styles.avatar}
        />

        <Text style={styles.name}>{user.nome ?? user.name ?? "Usuario NewEco"}</Text>
        <Text style={styles.username}>{user.email ?? user.username ?? "@neweco"}</Text>
        <Text style={styles.bio}>
          {user.bio ?? `${user.cidade ?? "Cidade"} - ${user.estado ?? "UF"}`}
        </Text>

        <View style={styles.socialStats}>
          <View style={styles.socialItem}>
            <Text style={styles.socialValue}>{posts.length}</Text>
            <Text style={styles.socialLabel}>Posts</Text>
          </View>

          <View style={styles.socialDivider} />

          <View style={styles.socialItem}>
            <Text style={styles.socialValue}>{user.followers ?? 0}</Text>
            <Text style={styles.socialLabel}>Seguidores</Text>
          </View>

          <View style={styles.socialDivider} />

          <View style={styles.socialItem}>
            <Text style={styles.socialValue}>{user.following ?? 0}</Text>
            <Text style={styles.socialLabel}>Seguindo</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.followButton, following && styles.followingButton]}
            onPress={toggleFollow}
            disabled={loadingFollow}
          >
            <Ionicons
              name={following ? "checkmark" : "person-add-outline"}
              size={18}
              color={following ? theme.colors.primaryDark : "#fff"}
            />
            <Text
              style={[
                styles.followButtonText,
                following && styles.followingButtonText,
              ]}
            >
              {following ? "Seguindo" : "Seguir"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.chatButton}
            onPress={() => navigation.navigate("Conversa")}
          >
            <Ionicons name="chatbubble-ellipses-outline" size={18} color="#fff" />
            <Text style={styles.chatButtonText}>Conversar</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Publicacoes</Text>
        <Text style={styles.sectionSubtitle}>Posts recentes do perfil</Text>
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => String(item.id)}
        scrollEnabled={false}
        contentContainerStyle={styles.posts}
        ListEmptyComponent={
          <View style={styles.emptyPosts}>
            <Text style={styles.emptyPostsText}>Nenhuma publicacao encontrada.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.postCard}>
            <Image source={{ uri: item.image }} style={styles.postImage} />
            <Text style={styles.postCaption}>{item.caption}</Text>
          </View>
        )}
      />
    </ScrollView>
  );
}
