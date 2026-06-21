import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../routes";
import UserSession from "../../utils/UserSessions";
import { API_URL } from "../../config/api";
import { feedObserver } from "../../utils/FeedObserver";
import PostCard from "../../components/PostCard";
import { styles } from "./styles";

type NavigationProps = NativeStackNavigationProp<RootStackParamList, "TelaPerfil">;

export default function TelaPerfil() {
  const navigation = useNavigation<NavigationProps>();
  const sessionUser = UserSession.getInstance().getUser();
  const [user, setUser] = useState<any>(sessionUser);
  const [posts, setPosts] = useState<any[]>([]);
  const [followStats, setFollowStats] = useState({
    seguidores: 0,
    seguindo: 0,
  });
  const [loadingPosts, setLoadingPosts] = useState(true);

  const loadMyPosts = useCallback(async () => {
    try {
      const storedUser = await AsyncStorage.getItem("user");
      const loggedUser = storedUser ? JSON.parse(storedUser) : sessionUser;

      if (!loggedUser?.id) {
        setPosts([]);
        return;
      }

      setUser(loggedUser);

      const [postsResponse, statsResponse] = await Promise.all([
        axios.get(`${API_URL}/posts/me`, {
          params: {
            usuario_id: loggedUser.id
          }
        }),
        axios.get(`${API_URL}/seguidores/stats/${loggedUser.id}`)
      ]);

      setPosts(postsResponse.data ?? []);
      setFollowStats({
        seguidores: statsResponse.data?.seguidores ?? 0,
        seguindo: statsResponse.data?.seguindo ?? 0,
      });
    } catch (error: any) {
      console.log(error.response?.data || error.message);
    } finally {
      setLoadingPosts(false);
    }
  }, [sessionUser]);

  useEffect(() => {
    loadMyPosts();
    feedObserver.subscribe(loadMyPosts);

    return () => {
      feedObserver.unsubscribe(loadMyPosts);
    };
  }, [loadMyPosts]);

  const goToEcoBeneficios = () => {
    navigation.navigate("TelaEcoBeneficios");
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate("TelaHome")}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <Image
          source={{ uri: user?.avatar_url ?? user?.avatarUri ?? "https://i.pravatar.cc/150?img=12" }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{user?.nome ?? "Usuario NewEco"}</Text>
        <Text style={styles.email}>{user?.email ?? ""}</Text>

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
      </View>

      <View style={styles.statsContainer}>
        <Pressable style={styles.card} onPress={goToEcoBeneficios}>
          <Text style={styles.cardValue}>{user?.eco_beneficios ?? user?.ecoBeneficios ?? 0}</Text>
          <Text style={styles.cardLabel}>EcoPontos</Text>
          <Text style={styles.cardHint}>Abrir</Text>
        </Pressable>

        <View style={styles.card}>
          <Text style={styles.cardValue}>0</Text>
          <Text style={styles.cardLabel}>Missoes</Text>
        </View>

        <Pressable style={styles.card} onPress={goToEcoBeneficios}>
          <Text style={styles.cardValue}>0</Text>
          <Text style={styles.cardLabel}>Beneficios</Text>
          <Text style={styles.cardHint}>Abrir</Text>
        </Pressable>
      </View>

      <Pressable style={styles.ecoBenefitShortcut} onPress={goToEcoBeneficios}>
        <View style={styles.ecoBenefitIcon}>
          <Ionicons name="gift-outline" size={22} color="#fff" />
        </View>
        <View style={styles.ecoBenefitTextBox}>
          <Text style={styles.ecoBenefitTitle}>Meus EcoBeneficios</Text>
          <Text style={styles.ecoBenefitText}>
            Toque aqui para ver saldo, historico e formas de ganhar mais pontos.
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={22} color="#fff" />
      </Pressable>

      <View style={styles.actions}>
        <Pressable onPress={goToEcoBeneficios} style={styles.ecoBenefitButton}>
          <Ionicons name="gift-outline" size={20} color="#fff" />
          <Text style={styles.ecoBenefitButtonText}>Abrir EcoBeneficios</Text>
        </Pressable>

        <TouchableOpacity
          onPress={() => navigation.navigate("TelaEditarPerfil")}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Editar perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("TelaConfiguracao")}
          style={styles.buttonSecondary}
        >
          <Text style={styles.buttonTextSecondary}>Configuracoes</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.postsSection}>
        <View style={styles.postsHeader}>
          <View>
            <Text style={styles.postsTitle}>Meus posts</Text>
            <Text style={styles.postsSubtitle}>Suas publicacoes sustentaveis</Text>
          </View>

          <TouchableOpacity
            style={styles.newPostButton}
            onPress={() => navigation.navigate("Publicar")}
          >
            <Ionicons name="add" size={18} color="#fff" />
            <Text style={styles.newPostButtonText}>Novo</Text>
          </TouchableOpacity>
        </View>

        {loadingPosts ? (
          <View style={{ paddingVertical: 24 }}>
            <ActivityIndicator color="#00B89A" />
          </View>
        ) : posts.length === 0 ? (
          <Text style={styles.postsSubtitle}>Voce ainda nao publicou nenhum post.</Text>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              loggedUser={user}
              onChanged={loadMyPosts}
              canDelete
            />
          ))
        )}
      </View>
    </ScrollView>
  );
}
