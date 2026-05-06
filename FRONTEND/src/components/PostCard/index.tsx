import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
  TextInput,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { theme } from "../../global/themes";

const { width } = Dimensions.get("window");

const shareOptions = [
  { id: "1", label: "Enviar no chat", icon: "chatbubble-ellipses-outline" },
  { id: "2", label: "Copiar link", icon: "link-outline" },
  { id: "3", label: "Compartilhar fora do app", icon: "share-social-outline" },
  { id: "4", label: "Salvar publicação", icon: "bookmark-outline" },
];

export default function PostCard({ post, isLiked, onLike }: any) {
  const navigation = useNavigation<any>();
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([
    {
      id: "1",
      user: "Ana Recicla",
      text: "Ficou ótimo! Vou tentar fazer em casa.",
    },
    {
      id: "2",
      user: "Coleta Verde",
      text: "Ideia perfeita para reduzir descarte.",
    },
  ]);

  const profile = post.profile ?? {
    name: post.user,
    username: `@${post.user}`,
    avatar: "https://i.pravatar.cc/150?img=" + post.id,
    followers: 120,
    following: 44,
    posts: [
      {
        id: String(post.id),
        image: post.image,
        caption: post.caption,
      },
    ],
  };

  const openProfile = () => {
    navigation.navigate("TelaPerfilUsuario", { user: profile });
  };

  const addComment = () => {
    const trimmed = commentText.trim();

    if (!trimmed) {
      return;
    }

    setComments((current) => [
      ...current,
      {
        id: String(Date.now()),
        user: "Você",
        text: trimmed,
      },
    ]);
    setCommentText("");
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.header} onPress={openProfile}>
        <Image source={{ uri: profile.avatar }} style={styles.avatar} />

        <View>
          <Text style={styles.username}>{profile.username}</Text>
          <Text style={styles.subtitle}>Toque para ver o perfil</Text>
        </View>
      </TouchableOpacity>

      <Image source={{ uri: post.image }} style={styles.image} />

      <View style={styles.actions}>
        <View style={styles.left}>
          <TouchableOpacity onPress={onLike}>
            <Ionicons
              name={isLiked ? "heart" : "heart-outline"}
              size={26}
              color={isLiked ? theme.colors.primaryLight : theme.colors.primaryDark}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setCommentModalVisible(true)}>
            <Ionicons
              name="chatbubble-outline"
              size={24}
              color={theme.colors.primaryDark}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setShareModalVisible(true)}>
            <Ionicons
              name="paper-plane-outline"
              size={24}
              color={theme.colors.primaryDark}
            />
          </TouchableOpacity>
        </View>

        <Ionicons
          name="bookmark-outline"
          size={24}
          color={theme.colors.primaryDark}
        />
      </View>

      <Text style={styles.likes}>
        {isLiked ? post.likes + 1 : post.likes} curtidas
      </Text>

      <Text style={styles.caption}>
        <Text style={styles.username}>{profile.username} </Text>
        {post.caption}
      </Text>

      <TouchableOpacity onPress={() => setCommentModalVisible(true)}>
        <Text style={styles.comments}>Ver todos os comentários</Text>
      </TouchableOpacity>

      <Modal
        visible={commentModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setCommentModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Comentários</Text>
              <TouchableOpacity onPress={() => setCommentModalVisible(false)}>
                <Ionicons name="close" size={24} color={theme.colors.primaryDark} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={comments}
              keyExtractor={(item) => item.id}
              style={styles.commentList}
              renderItem={({ item }) => (
                <View style={styles.commentItem}>
                  <Text style={styles.commentUser}>{item.user}</Text>
                  <Text style={styles.commentText}>{item.text}</Text>
                </View>
              )}
            />

            <View style={styles.commentInputRow}>
              <TextInput
                placeholder="Escreva um comentário..."
                placeholderTextColor="#777"
                style={styles.commentInput}
                value={commentText}
                onChangeText={setCommentText}
              />
              <TouchableOpacity style={styles.sendCommentButton} onPress={addComment}>
                <Ionicons name="send" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={shareModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setShareModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.shareContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Compartilhar</Text>
              <TouchableOpacity onPress={() => setShareModalVisible(false)}>
                <Ionicons name="close" size={24} color={theme.colors.primaryDark} />
              </TouchableOpacity>
            </View>

            {shareOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={styles.shareOption}
                onPress={() => setShareModalVisible(false)}
              >
                <View style={styles.shareIconBox}>
                  <Ionicons
                    name={option.icon as any}
                    size={22}
                    color={theme.colors.primaryDark}
                  />
                </View>
                <Text style={styles.shareOptionText}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    marginBottom: 25,
    paddingBottom: 10,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 50,
    marginRight: 10,
  },
  username: {
    color: theme.colors.primaryDark,
    fontWeight: "bold",
    fontSize: 16,
  },
  subtitle: {
    color: "#666",
    fontSize: 12,
  },
  image: {
    width,
    height: width,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
  },
  left: {
    flexDirection: "row",
    gap: 18,
  },
  likes: {
    color: theme.colors.textDark,
    fontWeight: "bold",
    paddingHorizontal: 12,
  },
  caption: {
    color: theme.colors.textDark,
    paddingHorizontal: 12,
    marginTop: 4,
    lineHeight: 18,
  },
  comments: {
    color: "#666",
    paddingHorizontal: 12,
    marginTop: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    padding: 16,
    maxHeight: "78%",
  },
  shareContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    padding: 16,
    paddingBottom: 26,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  modalTitle: {
    color: theme.colors.primaryDark,
    fontSize: 20,
    fontWeight: "bold",
  },
  commentList: {
    maxHeight: 320,
  },
  commentItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#eef3f1",
  },
  commentUser: {
    color: theme.colors.primaryDark,
    fontWeight: "bold",
  },
  commentText: {
    color: theme.colors.textDark,
    marginTop: 4,
    lineHeight: 20,
  },
  commentInputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 14,
  },
  commentInput: {
    flex: 1,
    minHeight: 46,
    borderRadius: 23,
    backgroundColor: "#f4f7f6",
    paddingHorizontal: 14,
    color: theme.colors.textDark,
  },
  sendCommentButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: theme.colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  shareOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  shareIconBox: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#eafaf7",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  shareOptionText: {
    color: theme.colors.textDark,
    fontSize: 16,
    fontWeight: "600",
  },
});
