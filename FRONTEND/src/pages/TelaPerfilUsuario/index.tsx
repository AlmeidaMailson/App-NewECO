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
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../routes";
import { theme } from "../../global/themes";
import { styles } from "./style";

// Utilizando a infraestrutura global de API e Sessão
import api from "../../config/api";
import UserSession from "../../utils/UserSessions";
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

  // Resgata os dados síncronos da sessão logada usando o Singleton
  const loggedUser = UserSession.getInstance().getUser();
  const loggedUserId = loggedUser?.id;

  const [following, setFollowing] = useState(false);
  const [loadingFollow, setLoadingFollow] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState("");
  const [followStats, setFollowStats] = useState({
    seguidores: 0,
    seguindo: 0,
  });

  // Função unificada e limpa para buscar dados do perfil via API autenticada
  const loadProfileData = React.useCallback(async () => {
    if (!profileUserId) {
      setProfileError("Usuário do perfil não encontrado.");
      setLoadingProfile(false);
      return;
    }

    try {
      setProfileError("");

      // Realiza chamadas simultâneas e limpas para buscar posts e estatísticas
      const [statsResponse, postsResponse] = await Promise.all([
        api.get(`/seguidores/stats/${profileUserId}`),
        api.get(`/posts/user/${profileUserId}`), // Rota combinada com o seu FastAPI
      ]);

      setFollowStats({
        seguidores: statsResponse.data?.seguidores ?? 0,
        seguindo: statsResponse.data?.seguindo ?? 0,
      });

      setPosts(postsResponse.data ?? []);

      // Se não for o próprio perfil do usuário logado, verifica o status de seguidor
      if (loggedUserId && Number(loggedUserId) !== profileUserId) {
        try {
          const statusResponse = await api.get(
            `/seguidores/${profileUserId}/status`,
          );
          setFollowing(statusResponse.data.following);
        } catch (error: any) {
          console.log(error.response?.status);
          console.log(JSON.stringify(error.response?.data, null, 2));
        }
      }
    } catch (error: any) {
      console.log(error.response?.status);
      console.log(JSON.stringify(error.response?.data, null, 2));
    } finally {
      setLoadingProfile(false);
    }
  }, [profileUserId, loggedUserId]);

  useEffect(() => {
    setLoadingProfile(true);
    loadProfileData();
  }, [loadProfileData]);

  async function toggleFollow() {
    if (loadingFollow) return;
    if (!loggedUserId) {
      alert("Faça login para seguir usuários");
      return;
    }

    if (Number(loggedUserId) === profileUserId) {
      alert("Você não pode seguir a si mesmo");
      return;
    }

    try {
      setLoadingFollow(true);

      if (following) {
        // Unfollow
        await api.delete(`/seguidores/${profileUserId}`);
        setFollowing(false);
        setFollowStats((current) => ({
          ...current,
          seguidores: Math.max(current.seguidores - 1, 0),
        }));
        return;
      }

      // Follow
      await api.post("/seguidores/", {
        seguindo_id: profileUserId,
      });

      setFollowing(true);
      setFollowStats((current) => ({
        ...current,
        seguidores: current.seguidores + 1,
      }));
    } catch (error: any) {
      console.log("Erro ao alternar seguidor:", error.message);
      alert("Não foi possível atualizar o status de seguidor.");
    } finally {
      setLoadingFollow(false);
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.name}>{user.nome ?? "Usuário NewEco"}</Text>
        <Text style={styles.username}>{user.email ?? "@neweco"}</Text>
        <Text style={styles.bio}>
          {user.bio ?? `${user.cidade ?? "Cidade"} - ${user.estado ?? "UF"}`}
        </Text>

        {/* SOCIAL STATS */}
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

        {/* INTERACTION BUTTONS */}
        {Number(loggedUserId) !== profileUserId && (
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.followButton, following && styles.followingButton]}
              onPress={toggleFollow}
              disabled={loadingFollow}
            >
              {loadingFollow ? (
                <ActivityIndicator
                  size="small"
                  color={following ? theme.colors.primaryDark : "#fff"}
                />
              ) : (
                <>
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
                </>
              )}
            </TouchableOpacity>

          </View>
        )}
      </View>

      {/* RECENT POSTS TITLE */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Publicações</Text>
        <Text style={styles.sectionSubtitle}>Posts recentes do perfil</Text>
      </View>

      {/* POSTS LISTING */}
      <View style={styles.posts}>
        {loadingProfile ? (
          <View style={styles.emptyPosts}>
            <ActivityIndicator size="large" color={theme.colors.primaryLight} />
            <Text style={styles.emptyPostsText}>Carregando publicações...</Text>
          </View>
        ) : profileError ? (
          <View style={styles.emptyPosts}>
            <Text style={styles.emptyPostsText}>{profileError}</Text>
          </View>
        ) : posts.length === 0 ? (
          <View style={styles.emptyPosts}>
            <Text style={styles.emptyPostsText}>
              Nenhuma publicação encontrada.
            </Text>
          </View>
        ) : (
          posts.map((item) => (
            <PostCard
              key={String(item.id)}
              post={item}
              loggedUser={loggedUser}
              onChanged={loadProfileData}
              canDelete={false}
            />
          ))
        )}
      </View>
    </ScrollView>
  );
}
