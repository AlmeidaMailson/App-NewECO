import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../routes";
import { theme } from "../../global/themes";
import { API_URL } from "../../config/api";
import { styles } from "./style";

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
  const [loggedUserId, setLoggedUserId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("todos");
  const [following, setFollowing] = useState<string[]>([]);
  const [loadingFollowIds, setLoadingFollowIds] = useState<string[]>([]);
  const [chatOnly, setChatOnly] = useState<string[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    async function loadUsers() {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        const parsedUser = storedUser ? JSON.parse(storedUser) : null;
        const usuarioId = parsedUser?.id ? Number(parsedUser.id) : null;

        setLoggedUserId(usuarioId);

        const response = await axios.get(`${API_URL}/users/`);
        const databaseUsers: BackendUser[] = response.data ?? [];
        const usersWithoutLoggedUser = usuarioId
          ? databaseUsers.filter((user) => Number(user.id) !== usuarioId)
          : databaseUsers;

        setUsers(usersWithoutLoggedUser);

        if (usuarioId) {
          const statusResponses = await Promise.all(
            usersWithoutLoggedUser.map(async (user) => {
              try {
                const status = await axios.get(
                  `${API_URL}/seguidores/${user.id}/status`,
                  {
                    params: {
                      usuario_id: usuarioId
                    }
                  }
                );

                return status.data.following ? String(user.id) : null;
              } catch {
                return null;
              }
            })
          );

          setFollowing(
            statusResponses.filter((id): id is string => id !== null)
          );
        }
      } catch (error: any) {
        console.log(error.response?.data || error.message);
        alert("Erro ao carregar usuarios do banco");
      } finally {
        setLoadingUsers(false);
      }
    }

    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        user.nome.toLowerCase().includes(normalizedSearch) ||
        user.email.toLowerCase().includes(normalizedSearch) ||
        (user.cidade ?? "").toLowerCase().includes(normalizedSearch) ||
        (user.estado ?? "").toLowerCase().includes(normalizedSearch);

      if (!matchesSearch) {
        return false;
      }

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
      alert("Faca login para seguir usuarios");
      return;
    }

    const userId = String(id);

    if (loadingFollowIds.includes(userId)) {
      return;
    }

    try {
      setLoadingFollowIds((current) => [...current, userId]);

      if (following.includes(userId)) {
        await axios.delete(`${API_URL}/seguidores/${id}`, {
          params: {
            usuario_id: loggedUserId
          }
        });

        setFollowing((current) => current.filter((item) => item !== userId));
        return;
      }

      await axios.post(
        `${API_URL}/seguidores/`,
        {
          seguidor_id: loggedUserId,
          seguindo_id: id
        },
        {
          params: {
            usuario_id: loggedUserId
          }
        }
      );

      setFollowing((current) =>
        current.includes(userId) ? current : [...current, userId]
      );
    } catch (error: any) {
      console.log(error.response?.data || error.message);

      if (error.response?.status === 409) {
        setFollowing((current) =>
          current.includes(userId) ? current : [...current, userId]
        );
        return;
      }

      alert(error.response?.data?.detail ?? "Erro ao atualizar seguidor");
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
              {item.eco_beneficios ?? 0} eco beneficios
            </Text>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.followButton, isFollowing && styles.followingButton]}
              onPress={() => toggleFollow(item.id)}
              disabled={isLoadingFollow}
            >
              <Ionicons
                name={isFollowing ? "checkmark" : "person-add-outline"}
                size={17}
                color={isFollowing ? theme.colors.primaryDark : "#fff"}
              />
              <Text
                style={[
                  styles.followButtonText,
                  isFollowing && styles.followingButtonText,
                ]}
              >
                {isFollowing ? "Seguindo" : "Seguir"}
              </Text>
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
              <Text
                style={[
                  styles.chatButtonText,
                  hasChat && styles.chatButtonTextActive,
                ]}
              >
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
        <Text style={styles.headerTitle}>Adicionar usuarios</Text>
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
              <Text
                style={[
                  styles.filterText,
                  filter === item && styles.filterTextActive,
                ]}
              >
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
            <Ionicons name="search-outline" size={34} color={theme.colors.primaryLight} />
            <Text style={styles.emptyText}>
              {loadingUsers ? "Carregando usuarios..." : "Nenhum usuario encontrado."}
            </Text>
          </View>
        }
      />
    </View>
  );
}
