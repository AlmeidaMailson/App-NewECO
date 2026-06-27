import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../routes";
import { theme } from "../../global/themes";
import { styles } from "./style";

// 🟢 CORREÇÃO: Centralização segura de chamadas de API e Sessão
import api from "../../config/api";
import UserSession from "../../utils/UserSessions";

type NavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  "TelaAdicionarUsuario"
>;

type Filter = "todos" | "seguir" | "conversar";

type BackendUser = {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
  estado?: string;
  cidade?: string;
  bio?: string | null;
  avatar_url?: string | null;
  eco_beneficios?: number;
};

export default function TelaAdicionarUsuario() {
  const navigation = useNavigation<NavigationProps>();
  const [users, setUsers] = useState<BackendUser[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("todos");
  const [following, setFollowing] = useState<string[]>([]);
  const [loadingFollowIds, setLoadingFollowIds] = useState<string[]>([]);
  const [chatOnly, setChatOnly] = useState<string[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // 🟢 Resgata o ID do usuário logado de forma síncrona e limpa usando o Singleton
  const loggedUserId = UserSession.getInstance().getUser()?.id;

  useEffect(() => {
    async function loadData() {
      if (!loggedUserId) {
        setLoadingUsers(false);
        return;
      }

      try {
        // 1. Carrega todos os usuários da plataforma (Passando pelo prefixo /auth configurado no FastAPI)
        const responseUsers = await api.get("/auth/users");
        const databaseUsers: BackendUser[] = responseUsers.data ?? [];

        // Filtra para remover o próprio usuário logado da lista de descoberta
        const usersWithoutLoggedUser = databaseUsers.filter(
          (user) => Number(user.id) !== Number(loggedUserId)
        );
        setUsers(usersWithoutLoggedUser);

        // 2. 🟢 OTIMIZAÇÃO: Busca quem você segue de uma vez só, sem fazer loops infinitos
        const responseFollowing = await api.get(`/seguidores/usuario/${loggedUserId}`);
        // Supondo que o back devolva uma lista de IDs ou objetos com id_seguido
        const idsSeguindo = responseFollowing.data.map((f: any) => String(f.id_seguido || f.id));
        setFollowing(idsSeguindo);

      } catch (error: any) {
        console.log("Erro na tela de descoberta:", error.message);
      } finally {
        setLoadingUsers(false);
      }
    }

    loadData();
  }, [loggedUserId]);

  const filteredUsers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        user.nome.toLowerCase().includes(normalizedSearch) ||
        user.email.toLowerCase().includes(normalizedSearch) ||
        (user.cidade ?? "").toLowerCase().includes(normalizedSearch) ||
        (user.estado ?? "").toLowerCase().includes(normalizedSearch);

      if (!matchesSearch) return false;

      if (filter === "seguir") {
        return !following.includes(String(user.id));
      }

      if (filter === "conversar") {
        return !chatOnly.includes(String(user.id));
      }

      return true;
    });
  }, [chatOnly, filter, following, search, users]);

  const toggleFollow = async (id: number) => {
    if (!loggedUserId) {
      alert("Faça login para seguir usuários");
      return;
    }

    const userId = String(id);
    if (loadingFollowIds.includes(userId)) return;

    try {
      setLoadingFollowIds((current) => [...current, userId]);

      if (following.includes(userId)) {
        // Unfollow
        await api.delete(`/seguidores/${id}`);
        setFollowing((current) => current.filter((item) => item !== userId));
        return;
      }

      // Follow
      await api.post("/seguidores/", {
        seguindo_id: id
      });

      setFollowing((current) => [...current, userId]);
    } catch (error: any) {
      console.log("Erro ao atualizar seguidor:", error.message);
      alert("Não foi possível atualizar o status de seguidor.");
    } finally {
      setLoadingFollowIds((current) => current.filter((item) => item !== userId));
    }
  };

  const startChat = (id: number) => {
    const userId = String(id);
    setChatOnly((current) => (current.includes(userId) ? current : [...current, userId]));
    navigation.navigate("Conversa");
  };

  const openProfile = (user: BackendUser) => {
    // Redireciona para o perfil passando o objeto mapeado
    navigation.navigate("TelaPerfilUsuario", { user });
  };

  const renderUser = ({ item }: { item: BackendUser }) => {
    const userId = String(item.id);
    const isFollowing = following.includes(userId);
    const hasChat = chatOnly.includes(userId);
    const isLoadingFollow = loadingFollowIds.includes(userId);

    return (
      <View style={styles.userCard}>
        <TouchableOpacity onPress={() => openProfile(item)}>
          <Image
            source={{ uri: item.avatar_url ?? `https://i.pravatar.cc/150?u=${item.id}` }}
            style={styles.avatar}
          />
        </TouchableOpacity>

        <View style={styles.userInfo}>
          <TouchableOpacity onPress={() => openProfile(item)}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{item.nome}</Text>
              {isFollowing && hasChat && (
                <View style={styles.statusBadge}>
                  <Text style={styles.statusBadgeText}>Ambos</Text>
                </View>
              )}
            </View>

            <Text style={styles.username}>{item.email}</Text>
            <Text style={styles.bio}>
              {item.bio ?? `${item.cidade ?? "Cidade"} - ${item.estado ?? "UF"}`}
            </Text>
          </TouchableOpacity>

          <View style={styles.metaRow}>
            <Ionicons name="leaf-outline" size={15} color={theme.colors.primaryDark} />
            <Text style={styles.metaText}>
              {item.eco_beneficios ?? 0} eco benefícios
            </Text>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.followButton, isFollowing && styles.followingButton]}
              onPress={() => toggleFollow(item.id)}
              disabled={isLoadingFollow}
            >
              {isLoadingFollow ? (
                <ActivityIndicator size="small" color={isFollowing ? theme.colors.primaryDark : "#fff"} />
              ) : (
                <>
                  <Ionicons
                    name={isFollowing ? "checkmark" : "person-add-outline"}
                    size={17}
                    color={isFollowing ? theme.colors.primaryDark : "#fff"}
                  />
                  <Text style={[styles.followButtonText, isFollowing && styles.followingButtonText]}>
                    {isFollowing ? "Seguindo" : "Seguir"}
                  </Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.chatButton, hasChat && styles.chatButtonActive]}
              onPress={() => startChat(item.id)}
            >
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={17}
                color={hasChat ? "#fff" : theme.colors.primaryLight}
              />
              <Text style={[styles.chatButtonText, hasChat && styles.chatButtonTextActive]}>
                Conversar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Adicionar usuários</Text>
        <View style={styles.iconButton} />
      </View>

      <View style={styles.searchArea}>
        <View style={styles.searchBox}>
          <TextInput
            placeholder="Buscar por nome, email, cidade ou estado"
            placeholderTextColor="#777"
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
          />
          <Ionicons name="search" size={20} color="#777" />
        </View>

        <View style={styles.filters}>
          {(["todos", "seguir", "conversar"] as Filter[]).map((item) => (
            <TouchableOpacity
              key={item}
              style={[styles.filterButton, filter === item && styles.filterButtonActive]}
              onPress={() => setFilter(item)}
            >
              <Text style={[styles.filterText, filter === item && styles.filterTextActive]}>
                {item === "todos" ? "Todos" : item === "seguir" ? "Seguir" : "Conversar"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderUser}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            {loadingUsers ? (
              <ActivityIndicator size="large" color={theme.colors.primaryLight} />
            ) : (
              <>
                <Ionicons name="search-outline" size={34} color={theme.colors.primaryLight} />
                <Text style={styles.emptyText}>Nenhum usuário encontrado.</Text>
              </>
            )}
          </View>
        }
      />
    </View>
  );
}