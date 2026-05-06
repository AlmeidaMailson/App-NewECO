import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../routes";
import { theme } from "../../global/themes";
import { styles } from "./style";

type NavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  "TelaAdicionarUsuario"
>;

type Filter = "todos" | "seguir" | "conversar";

const users = [
  {
    id: "1",
    name: "Ana Recicla",
    username: "@anarecicla",
    bio: "Compartilha ideias de reaproveitamento e descarte correto.",
    avatar: "https://i.pravatar.cc/150?img=14",
    followers: 328,
    following: 91,
    interests: ["Reciclagem", "Educação ambiental"],
    posts: [
      {
        id: "1",
        image:
          "https://dicasmaonamassa.com.br/wp-content/uploads/2024/04/vasos-de-garrafa-pet-bichinhos-scaled.jpg",
        caption: "Transformando garrafas PET em vasos para casa.",
      },
    ],
  },
  {
    id: "2",
    name: "Coleta Verde",
    username: "@coletaverde",
    bio: "Organiza pontos de coleta e ações sustentáveis no bairro.",
    avatar: "https://i.pravatar.cc/150?img=8",
    followers: 512,
    following: 126,
    interests: ["Coleta seletiva", "Comunidade"],
    posts: [
      {
        id: "1",
        image: "https://consed.org.br/storage/news/txlgf5cjybyj99x9cpxoitpwyyxsvv.jpeg",
        caption: "Mutirão de coleta seletiva com a comunidade.",
      },
    ],
  },
  {
    id: "3",
    name: "Lucas Horta",
    username: "@lucashorta",
    bio: "Cultiva horta urbana e troca dicas de compostagem.",
    avatar: "https://i.pravatar.cc/150?img=11",
    followers: 214,
    following: 74,
    interests: ["Horta", "Compostagem"],
    posts: [
      {
        id: "1",
        image: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=900",
        caption: "Compostagem simples para horta urbana.",
      },
    ],
  },
  {
    id: "4",
    name: "Marina Eco",
    username: "@marinaeco",
    bio: "Cria desafios de baixo lixo e consumo consciente.",
    avatar: "https://i.pravatar.cc/150?img=9",
    followers: 447,
    following: 108,
    interests: ["Consumo consciente", "Missões"],
    posts: [
      {
        id: "1",
        image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=900",
        caption: "Semana de baixo lixo: pequenos hábitos, grande impacto.",
      },
    ],
  },
];

export default function TelaAdicionarUsuario() {
  const navigation = useNavigation<NavigationProps>();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("todos");
  const [following, setFollowing] = useState<string[]>([]);
  const [chatOnly, setChatOnly] = useState<string[]>([]);

  const filteredUsers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(normalizedSearch) ||
        user.username.toLowerCase().includes(normalizedSearch) ||
        user.interests.some((interest) =>
          interest.toLowerCase().includes(normalizedSearch)
        );

      if (!matchesSearch) {
        return false;
      }

      if (filter === "seguir") {
        return !following.includes(user.id);
      }

      if (filter === "conversar") {
        return !chatOnly.includes(user.id);
      }

      return true;
    });
  }, [chatOnly, filter, following, search]);

  const toggleFollow = (id: string) => {
    setFollowing((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  };

  const startChat = (id: string) => {
    setChatOnly((current) => (current.includes(id) ? current : [...current, id]));
    navigation.navigate("Conversa");
  };

  const openProfile = (user: (typeof users)[number]) => {
    navigation.navigate("TelaPerfilUsuario", { user });
  };

  const renderUser = ({ item }: { item: (typeof users)[number] }) => {
    const isFollowing = following.includes(item.id);
    const hasChat = chatOnly.includes(item.id);

    return (
      <View style={styles.userCard}>
        <TouchableOpacity onPress={() => openProfile(item)}>
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
        </TouchableOpacity>

        <View style={styles.userInfo}>
          <TouchableOpacity onPress={() => openProfile(item)}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{item.name}</Text>
              {isFollowing && hasChat && (
                <View style={styles.statusBadge}>
                  <Text style={styles.statusBadgeText}>Ambos</Text>
                </View>
              )}
            </View>

            <Text style={styles.username}>{item.username}</Text>
            <Text style={styles.bio}>{item.bio}</Text>
          </TouchableOpacity>

          <View style={styles.metaRow}>
            <Ionicons name="people-outline" size={15} color={theme.colors.primaryDark} />
            <Text style={styles.metaText}>{item.followers} seguidores</Text>
          </View>

          <View style={styles.tags}>
            {item.interests.map((interest) => (
              <View key={interest} style={styles.tag}>
                <Text style={styles.tagText}>{interest}</Text>
              </View>
            ))}
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.followButton, isFollowing && styles.followingButton]}
              onPress={() => toggleFollow(item.id)}
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
        <Text style={styles.headerTitle}>Adicionar usuários</Text>
        <View style={styles.iconButton} />
      </View>

      <View style={styles.searchArea}>
        <View style={styles.searchBox}>
          <TextInput
            placeholder="Buscar por nome, @usuário ou interesse"
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
        keyExtractor={(item) => item.id}
        renderItem={renderUser}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="search-outline" size={34} color={theme.colors.primaryLight} />
            <Text style={styles.emptyText}>Nenhum usuário encontrado.</Text>
          </View>
        }
      />
    </View>
  );
}
