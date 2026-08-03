import React, { useState } from "react";
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
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../routes";
import { theme } from "../../global/themes";
import { styles } from "./styles";

//Usando a infraestrutura de sessão e API centralizada
import api,{API_URL} from "../../config/api";
import UserSession from "../../utils/UserSessions";
import PostCard from "../../components/PostCard";

type NavigationProps = NativeStackNavigationProp<RootStackParamList, "TelaPerfil">;

export default function TelaPerfil() {
  const navigation = useNavigation<NavigationProps>();


  const handleLogout = () => {
    UserSession.getInstance().clear();
    navigation.navigate("Login");
  }
  // Coleta os dados em tempo real da sessão gerenciada pelo Singleton
  const [user, setUser] = useState<any>(UserSession.getInstance().getUser());
  const [posts, setPosts] = useState<any[]>([]);
  const [followStats, setFollowStats] = useState({
    seguidores: 0,
    seguindo: 0,
  });
  const [loadingPosts, setLoadingPosts] = useState(true);

  // CORREÇÃO: useFocusEffect recarrega os dados atualizados sempre que a tela ganha foco
  useFocusEffect(
    React.useCallback(() => {
      const loadProfileData = async () => {
        const loggedUser = UserSession.getInstance().getUser();
        if (!loggedUser?.id) return;

        // Sincroniza o estado local do usuário com o Singleton atualizado
        setUser(loggedUser);

        try {
          setLoadingPosts(true);
          
          //Usando a nossa instância 'api' (o JWT vai implícito)
          const [postsResponse, statsResponse] = await Promise.all([
            api.get("/posts/me"), 
            api.get(`/seguidores/stats/${loggedUser.id}`)
          ]);

          setPosts(postsResponse.data ?? []);
          setFollowStats({
            seguidores: statsResponse.data?.seguidores ?? 0,
            seguindo: statsResponse.data?.seguindo ?? 0,
          });
        } catch (error: any) {
          console.log("Erro ao carregar dados do perfil:", error.message);
        } finally {
          setLoadingPosts(false);
        }
      };

      loadProfileData();
    }, [])
  );

  const goToEcoBeneficios = () => {
    navigation.navigate("TelaEcoBeneficios");
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate("TelaHome")}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.name}>{user?.nome ?? "Usuário NewEco"}</Text>
        <Text style={styles.email}>{user?.email ?? ""}</Text>


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
      </View>

      {/* SHORTCUT BANNER */}
      <Pressable style={styles.ecoBenefitShortcut} onPress={goToEcoBeneficios}>
        <View style={styles.ecoBenefitIcon}>
          <Ionicons name="gift-outline" size={22} color="#fff" />
        </View>
        <View style={styles.ecoBenefitTextBox}>
          <Text style={styles.ecoBenefitTitle}>Meus EcoBenefícios</Text>
          <Text style={styles.ecoBenefitText}>
            Toque aqui para ver saldo, histórico e formas de ganhar mais pontos.
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={22} color="#fff" />
      </Pressable>

      {/* ACTION BUTTONS */}
      <View style={styles.actions}>
        <Pressable onPress={goToEcoBeneficios} style={styles.ecoBenefitButton}>
          <Ionicons name="gift-outline" size={20} color="#fff" />
          <Text style={styles.ecoBenefitButtonText}>Abrir EcoBenefícios</Text>
        </Pressable>

        <TouchableOpacity
          onPress={() => navigation.navigate("TelaEditarPerfil")}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Editar perfil</Text>
        </TouchableOpacity>

         <TouchableOpacity style={styles.buttonSecondary } onPress={handleLogout}>
              <Text  style={styles.buttonTextSecondary} >Sair da conta</Text>
            </TouchableOpacity>
        
      </View>

     

      {/* POSTS SECTION */}
      <View style={styles.postsSection}>
        <View style={styles.postsHeader}>
          <View>
            <Text style={styles.postsTitle}>Meus posts</Text>
            <Text style={styles.postsSubtitle}>Suas publicações sustentáveis</Text>
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
          <View style={{ paddingVertical: 32 }}>
            <ActivityIndicator size="large" color={theme.colors.primaryLight} />
          </View>
        ) : posts.length === 0 ? (
          <Text style={[styles.postsSubtitle, { textAlign: "center", marginTop: 16 }]}>
            Você ainda não publicou nenhum post.
          </Text>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              loggedUser={user}
              onChanged={() => {}} // Atualizado automaticamente via useFocusEffect
              canDelete
            />
          ))
        )}
      </View>
    </ScrollView>
  );
}