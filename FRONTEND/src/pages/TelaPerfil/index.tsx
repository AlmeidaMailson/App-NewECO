import React from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../routes";
import UserSession from "../../utils/UserSessions";
import { styles } from "./styles";

type NavigationProps = NativeStackNavigationProp<RootStackParamList, "TelaPerfil">;

const myPosts = [
  {
    id: "1",
    image:
      "https://dicasmaonamassa.com.br/wp-content/uploads/2024/04/vasos-de-garrafa-pet-bichinhos-scaled.jpg",
    caption: "Transformei garrafas PET em vasos para minha varanda.",
    likes: 86,
    comments: 12,
  },
  {
    id: "2",
    image: "https://consed.org.br/storage/news/txlgf5cjybyj99x9cpxoitpwyyxsvv.jpeg",
    caption: "Participei de uma ação de reciclagem com a comunidade.",
    likes: 134,
    comments: 21,
  },
];

export default function TelaPerfil() {
  const navigation = useNavigation<NavigationProps>();
  const sessionUser = UserSession.getInstance().getUser();
  const user = {
    name: sessionUser?.nome ?? "Mailson",
    email: "mailson@email.com",
    ecoPoints: sessionUser?.ecoBeneficios ?? 1250,
    missionsCompleted: 18,
    benefits: 5,
    followers: 328,
    following: 92,
    co2Saved: "32 kg",
  };

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
          source={{ uri: sessionUser?.avatarUri ?? "https://i.pravatar.cc/150?img=12" }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>

        <View style={styles.socialStats}>
          <View style={styles.socialItem}>
            <Text style={styles.socialValue}>{user.followers}</Text>
            <Text style={styles.socialLabel}>Seguidores</Text>
          </View>

          <View style={styles.socialDivider} />

          <View style={styles.socialItem}>
            <Text style={styles.socialValue}>{user.following}</Text>
            <Text style={styles.socialLabel}>Seguindo</Text>
          </View>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <Pressable
          style={styles.card}
          onPress={goToEcoBeneficios}
        >
          <Text style={styles.cardValue}>{user.ecoPoints}</Text>
          <Text style={styles.cardLabel}>EcoPontos</Text>
          <Text style={styles.cardHint}>Abrir</Text>
        </Pressable>

        <View style={styles.card}>
          <Text style={styles.cardValue}>{user.missionsCompleted}</Text>
          <Text style={styles.cardLabel}>Missões</Text>
        </View>

        <Pressable
          style={styles.card}
          onPress={goToEcoBeneficios}
        >
          <Text style={styles.cardValue}>{user.benefits}</Text>
          <Text style={styles.cardLabel}>Benefícios</Text>
          <Text style={styles.cardHint}>Abrir</Text>
        </Pressable>
      </View>

      <Pressable
        style={styles.ecoBenefitShortcut}
        onPress={goToEcoBeneficios}
      >
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

      <View style={styles.impactBox}>
        <View style={styles.impactHeader}>
          <Ionicons name="earth-outline" size={22} color="#fff" />
          <Text style={styles.impactTitle}>Impacto ambiental</Text>
        </View>
        <Text style={styles.impactText}>
          Você já economizou {user.co2Saved} de CO2 com ações sustentáveis.
        </Text>
      </View>

      <View style={styles.actions}>
        <Pressable
          onPress={goToEcoBeneficios}
          style={styles.ecoBenefitButton}
        >
          <Ionicons name="gift-outline" size={20} color="#fff" />
          <Text style={styles.ecoBenefitButtonText}>Abrir EcoBenefícios</Text>
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
          <Text style={styles.buttonTextSecondary}>Configurações</Text>
        </TouchableOpacity>
      </View>

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

        {myPosts.map((post) => (
          <View key={post.id} style={styles.postCard}>
            <Image source={{ uri: post.image }} style={styles.postImage} />
            <View style={styles.postBody}>
              <Text style={styles.postCaption}>{post.caption}</Text>

              <View style={styles.postStats}>
                <View style={styles.postStat}>
                  <Ionicons name="heart-outline" size={18} color="#00B89A" />
                  <Text style={styles.postStatText}>{post.likes} curtidas</Text>
                </View>

                <View style={styles.postStat}>
                  <Ionicons
                    name="chatbubble-outline"
                    size={17}
                    color="#005244"
                  />
                  <Text style={styles.postStatText}>{post.comments} comentários</Text>
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
