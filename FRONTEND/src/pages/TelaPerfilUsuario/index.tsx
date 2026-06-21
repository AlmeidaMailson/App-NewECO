import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
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
import PostCard from "../../components/PostCard";

type NavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  "TelaPerfilUsuario"
>;

export default function TelaPerfilUsuario() {
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute<any>();
  const user = route.params?.user ?? {};
  const profileUserId = Number(user.id ?? user.usuario_id);
  const [loggedUser, setLoggedUser] = useState<any>(null);
  const [following, setFollowing] = useState(false);
  const [loadingFollow, setLoadingFollow] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState("");
  const [followStats, setFollowStats] = useState({
    seguidores: 0,
    seguindo: 0,
  });

  useEffect(() => {
    async function loadProfileData() {
      let usuarioId: number | null = null;

      try {
        setLoadingProfile(true);
        setProfileError("");

        const storedUser = await AsyncStorage.getItem("user");

        if (!profileUserId) {
          setProfileError("Usuario do perfil nao encontrado.");
          return;
        }

        const parsedLoggedUser = storedUser ? JSON.parse(storedUser) : null;
        usuarioId = parsedLoggedUser?.id ? Number(parsedLoggedUser.id) : null;

        setLoggedUser(parsedLoggedUser);
        console.log("CARREGANDO PERFIL:", {
          profileUserId,
          usuarioLogadoId: usuarioId,
        });

        const statsResponse = await axios.get(
          `${API_URL}/seguidores/stats/${profileUserId}`
        );

        setFollowStats({
          seguidores: statsResponse.data?.seguidores ?? 0,
          seguindo: statsResponse.data?.seguindo ?? 0,
        });
      } catch (error: any) {
        console.log("ERRO STATS PERFIL:", error.response?.data || error.message);
      }

      try {
        const postsResponse = await axios.get(
          `${API_URL}/posts/user/${profileUserId}`,
          {
            params: usuarioId
              ? {
                  usuario_id: usuarioId
                }
              : {}
          }
        );

        setPosts(postsResponse.data ?? []);
        console.log("POSTS DO PERFIL:", postsResponse.data?.length ?? 0);
      } catch (error: any) {
        console.log("ERRO POSTS PERFIL:", error.response?.data || error.message);

        try {
          const feedResponse = await axios.get(`${API_URL}/posts/feed`, {
            params: {
              usuario_id: usuarioId ?? profileUserId
            }
          });
          const postsDoPerfil = (feedResponse.data ?? []).filter(
            (post: any) => Number(post.usuario_id) === Number(profileUserId)
          );

          setPosts(postsDoPerfil);
          console.log("POSTS DO PERFIL VIA FEED:", postsDoPerfil.length);
        } catch (feedError: any) {
          console.log("ERRO FEED PERFIL:", feedError.response?.data || feedError.message);
          setProfileError(
            error.response?.data?.detail ?? "Erro ao carregar publicacoes do perfil."
          );
        }
      }

      try {
        if (usuarioId && usuarioId !== profileUserId) {
          const statusResponse = await axios.get(
            `${API_URL}/seguidores/${profileUserId}/status`,
            {
              params: {
                usuario_id: usuarioId
              }
            }
          );

          setFollowing(statusResponse.data.following);
        }
      } catch (error: any) {
        console.log("ERRO STATUS SEGUIR:", error.response?.data || error.message);
      } finally {
        setLoadingProfile(false);
      }
    }

    loadProfileData();
  }, [profileUserId]);

  async function refreshProfileData() {
    if (!profileUserId) {
      return;
    }

    try {
      const statsResponse = await axios.get(`${API_URL}/seguidores/stats/${profileUserId}`);

      setFollowStats({
        seguidores: statsResponse.data?.seguidores ?? 0,
        seguindo: statsResponse.data?.seguindo ?? 0,
      });
    } catch (error: any) {
      console.log("ERRO ATUALIZAR STATS:", error.response?.data || error.message);
    }

    try {
      const postsResponse = await axios.get(`${API_URL}/posts/user/${profileUserId}`, {
        params: loggedUser?.id
          ? {
              usuario_id: loggedUser.id
            }
          : {}
      });

      setPosts(postsResponse.data ?? []);
    } catch (error: any) {
      console.log("ERRO ATUALIZAR POSTS:", error.response?.data || error.message);

      try {
        const feedResponse = await axios.get(`${API_URL}/posts/feed`, {
          params: loggedUser?.id
            ? {
                usuario_id: loggedUser.id
              }
            : {
                usuario_id: profileUserId
              }
        });
        const postsDoPerfil = (feedResponse.data ?? []).filter(
          (post: any) => Number(post.usuario_id) === Number(profileUserId)
        );

        setPosts(postsDoPerfil);
      } catch (feedError: any) {
        console.log("ERRO ATUALIZAR FEED:", feedError.response?.data || feedError.message);
        setProfileError(
          error.response?.data?.detail ?? "Erro ao atualizar publicacoes do perfil."
        );
      }
    }
  }

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
      const seguindoId = profileUserId;

      if (!seguindoId) {
        alert("Usuario do perfil nao encontrado");
        return;
      }

      if (usuarioId === seguindoId) {
        alert("Voce nao pode seguir a si mesmo");
        return;
      }

      if (following) {
        await axios.delete(`${API_URL}/seguidores/${seguindoId}`, {
          params: {
            usuario_id: usuarioId
          }
        });

        setFollowing(false);
        setFollowStats((current) => ({
          ...current,
          seguidores: Math.max(current.seguidores - 1, 0),
        }));
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
      setFollowStats((current) => ({
        ...current,
        seguidores: current.seguidores + 1,
      }));
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
            uri: user.avatar_url ?? user.avatar ?? `https://i.pravatar.cc/150?u=${profileUserId || "new-eco"}`,
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
            <Text style={styles.socialValue}>{followStats.seguidores}</Text>
            <Text style={styles.socialLabel}>Seguidores</Text>
          </View>

          <View style={styles.socialDivider} />

          <View style={styles.socialItem}>
            <Text style={styles.socialValue}>{followStats.seguindo}</Text>
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

      <View style={styles.posts}>
        {loadingProfile ? (
          <View style={styles.emptyPosts}>
            <ActivityIndicator color={theme.colors.primaryLight} />
            <Text style={styles.emptyPostsText}>Carregando publicacoes...</Text>
          </View>
        ) : profileError ? (
          <View style={styles.emptyPosts}>
            <Text style={styles.emptyPostsText}>{profileError}</Text>
          </View>
        ) : posts.length === 0 ? (
          <View style={styles.emptyPosts}>
            <Text style={styles.emptyPostsText}>Nenhuma publicacao encontrada.</Text>
          </View>
        ) : (
          posts.map((item) => (
            <PostCard
              key={String(item.id)}
              post={item}
              loggedUser={loggedUser}
              onChanged={refreshProfileData}
              canDelete={false}
            />
          ))
        )}
      </View>
    </ScrollView>
  );
}
