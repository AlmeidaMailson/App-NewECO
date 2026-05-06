import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../routes";
import { theme } from "../../global/themes";
import { styles } from "./style";

type NavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  "TelaPerfilUsuario"
>;

const fallbackPosts = [
  {
    id: "1",
    image:
      "https://dicasmaonamassa.com.br/wp-content/uploads/2024/04/vasos-de-garrafa-pet-bichinhos-scaled.jpg",
    caption: "Ideia simples para reaproveitar garrafas PET.",
  },
  {
    id: "2",
    image: "https://consed.org.br/storage/news/txlgf5cjybyj99x9cpxoitpwyyxsvv.jpeg",
    caption: "Educação ambiental também começa em comunidade.",
  },
];

export default function TelaPerfilUsuario() {
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute<any>();
  const user = route.params?.user ?? {};
  const [following, setFollowing] = useState(false);
  const posts = user.posts ?? fallbackPosts;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <Image
          source={{
            uri: user.avatar ?? "https://i.pravatar.cc/150?img=14",
          }}
          style={styles.avatar}
        />

        <Text style={styles.name}>{user.name ?? "Usuário NewEco"}</Text>
        <Text style={styles.username}>{user.username ?? "@neweco"}</Text>
        <Text style={styles.bio}>
          {user.bio ?? "Perfil focado em hábitos sustentáveis e conexões verdes."}
        </Text>

        <View style={styles.socialStats}>
          <View style={styles.socialItem}>
            <Text style={styles.socialValue}>{posts.length}</Text>
            <Text style={styles.socialLabel}>Posts</Text>
          </View>

          <View style={styles.socialDivider} />

          <View style={styles.socialItem}>
            <Text style={styles.socialValue}>{user.followers ?? 328}</Text>
            <Text style={styles.socialLabel}>Seguidores</Text>
          </View>

          <View style={styles.socialDivider} />

          <View style={styles.socialItem}>
            <Text style={styles.socialValue}>{user.following ?? 86}</Text>
            <Text style={styles.socialLabel}>Seguindo</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.followButton, following && styles.followingButton]}
            onPress={() => setFollowing((current) => !current)}
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
        <Text style={styles.sectionTitle}>Publicações</Text>
        <Text style={styles.sectionSubtitle}>Posts recentes do perfil</Text>
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        contentContainerStyle={styles.posts}
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
