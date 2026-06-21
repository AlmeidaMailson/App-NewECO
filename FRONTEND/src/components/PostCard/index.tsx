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
  Alert,
  Share,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { theme } from "../../global/themes";
import { API_URL } from "../../config/api";

const { width } = Dimensions.get("window");

export default function PostCard({ post, loggedUser, onChanged, canDelete = false }: any) {
  const navigation = useNavigation<any>();
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isLiked, setIsLiked] = useState(Boolean(post.curtido));
  const [likesCount, setLikesCount] = useState(post.curtidas_count ?? 0);
  const [isSaved, setIsSaved] = useState(Boolean(post.salvo));
  const [shareCount, setShareCount] = useState(post.compartilhamentos_count ?? 0);
  const [comments, setComments] = useState(post.comentarios ?? []);
  const [isFollowingAuthor, setIsFollowingAuthor] = useState(Boolean(post.seguindo_autor));
  const mediaUrl = post.midia_url?.startsWith("http")
    ? post.midia_url
    : `${API_URL}/${post.midia_url}`;
  const isOwner = Number(loggedUser?.id) === Number(post.usuario_id);

  const profile = {
    ...post.usuario,
    posts: [
      {
        id: post.id,
        image: mediaUrl,
        caption: post.legenda ?? post.titulo ?? "",
      },
    ],
  };

  const openProfile = () => {
    navigation.navigate("TelaPerfilUsuario", { user: profile });
  };

  const toggleLike = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/posts/${post.id}/curtir`,
        null,
        {
          params: {
            usuario_id: loggedUser.id
          }
        }
      );

      setIsLiked(response.data.curtido);
      setLikesCount(response.data.curtidas_count);
    } catch (error: any) {
      console.log(error.response?.data || error.message);
      Alert.alert("Erro", "Nao foi possivel curtir o post.");
    }
  };

  const addComment = async () => {
    const trimmed = commentText.trim();

    if (!trimmed) {
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/posts/${post.id}/comentarios`,
        {
          texto: trimmed
        },
        {
          params: {
            usuario_id: loggedUser.id
          }
        }
      );

      setComments((current: any[]) => [...current, response.data]);
      setCommentText("");
    } catch (error: any) {
      console.log(error.response?.data || error.message);
      Alert.alert("Erro", "Nao foi possivel comentar.");
    }
  };

  const toggleSave = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/posts/${post.id}/salvar`,
        null,
        {
          params: {
            usuario_id: loggedUser.id
          }
        }
      );

      setIsSaved(response.data.salvo);
    } catch (error: any) {
      console.log(error.response?.data || error.message);
      Alert.alert("Erro", "Nao foi possivel salvar o post.");
    }
  };

  const sharePost = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/posts/${post.id}/compartilhar`,
        null,
        {
          params: {
            usuario_id: loggedUser.id
          }
        }
      );

      setShareCount(response.data.compartilhamentos_count);
      setShareModalVisible(false);

      await Share.share({
        message: `${post.titulo ?? "Post NewEco"}\n${post.legenda ?? ""}\n${mediaUrl}`,
      });
    } catch (error: any) {
      console.log(error.response?.data || error.message);
      Alert.alert("Erro", "Nao foi possivel compartilhar.");
    }
  };

  const toggleFollowAuthor = async () => {
    try {
      if (isFollowingAuthor) {
        await axios.delete(`${API_URL}/seguidores/${post.usuario_id}`, {
          params: {
            usuario_id: loggedUser.id
          }
        });

        setIsFollowingAuthor(false);
        onChanged?.();
        return;
      }

      await axios.post(
        `${API_URL}/seguidores/`,
        {
          seguidor_id: loggedUser.id,
          seguindo_id: post.usuario_id
        },
        {
          params: {
            usuario_id: loggedUser.id
          }
        }
      );

      setIsFollowingAuthor(true);
      onChanged?.();
    } catch (error: any) {
      console.log(error.response?.data || error.message);
      Alert.alert("Erro", error.response?.data?.detail ?? "Nao foi possivel atualizar seguidor.");
    }
  };

  const deletePost = () => {
    Alert.alert(
      "Excluir post",
      "Tem certeza que deseja excluir esta publicacao?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await axios.delete(`${API_URL}/posts/${post.id}`, {
                params: {
                  usuario_id: loggedUser.id
                }
              });

              onChanged?.();
            } catch (error: any) {
              console.log(error.response?.data || error.message);
              Alert.alert("Erro", "Nao foi possivel excluir o post.");
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.profileArea} onPress={openProfile}>
          <Image
            source={{ uri: profile.avatar_url ?? `https://i.pravatar.cc/150?u=${profile.id}` }}
            style={styles.avatar}
          />

          <View>
            <Text style={styles.username}>{profile.nome}</Text>
            <Text style={styles.subtitle}>Toque para ver o perfil</Text>
          </View>
        </TouchableOpacity>

        {!isOwner && !isFollowingAuthor && (
          <TouchableOpacity style={styles.followSmallButton} onPress={toggleFollowAuthor}>
            <Text style={styles.followSmallText}>Seguir</Text>
          </TouchableOpacity>
        )}

        {isOwner && canDelete && (
          <TouchableOpacity onPress={deletePost}>
            <Ionicons name="trash-outline" size={22} color={theme.colors.primaryDark} />
          </TouchableOpacity>
        )}
      </View>

      {post.tipo_midia === "imagem" ? (
        <Image source={{ uri: mediaUrl }} style={styles.image} />
      ) : (
        <View style={styles.mediaPlaceholder}>
          <Ionicons name="play-circle-outline" size={42} color={theme.colors.primaryDark} />
          <Text style={styles.mediaPlaceholderText}>Midia publicada</Text>
        </View>
      )}

      <View style={styles.actions}>
        <View style={styles.left}>
          <TouchableOpacity onPress={toggleLike}>
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

        <TouchableOpacity onPress={toggleSave}>
          <Ionicons
            name={isSaved ? "bookmark" : "bookmark-outline"}
            size={24}
            color={theme.colors.primaryDark}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.likes}>{likesCount} curtidas</Text>
      <Text style={styles.shareCount}>{shareCount} compartilhamentos</Text>

      <Text style={styles.caption}>
        <Text style={styles.username}>{profile.nome} </Text>
        {post.legenda ?? post.titulo}
      </Text>

      <TouchableOpacity onPress={() => setCommentModalVisible(true)}>
        <Text style={styles.comments}>Ver {comments.length} comentarios</Text>
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
              <Text style={styles.modalTitle}>Comentarios</Text>
              <TouchableOpacity onPress={() => setCommentModalVisible(false)}>
                <Ionicons name="close" size={24} color={theme.colors.primaryDark} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={comments}
              keyExtractor={(item) => String(item.id)}
              style={styles.commentList}
              ListEmptyComponent={
                <Text style={styles.emptyComment}>Nenhum comentario ainda.</Text>
              }
              renderItem={({ item }) => (
                <View style={styles.commentItem}>
                  <Text style={styles.commentUser}>{item.usuario_nome ?? "Usuario"}</Text>
                  <Text style={styles.commentText}>{item.texto}</Text>
                </View>
              )}
            />

            <View style={styles.commentInputRow}>
              <TextInput
                placeholder="Escreva um comentario..."
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

            <TouchableOpacity style={styles.shareOption} onPress={sharePost}>
              <View style={styles.shareIconBox}>
                <Ionicons name="share-social-outline" size={22} color={theme.colors.primaryDark} />
              </View>
              <Text style={styles.shareOptionText}>Compartilhar fora do app</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.shareOption} onPress={toggleSave}>
              <View style={styles.shareIconBox}>
                <Ionicons name="bookmark-outline" size={22} color={theme.colors.primaryDark} />
              </View>
              <Text style={styles.shareOptionText}>
                {isSaved ? "Remover dos salvos" : "Salvar publicacao"}
              </Text>
            </TouchableOpacity>
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
    justifyContent: "space-between",
    padding: 12,
  },
  profileArea: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
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
  followSmallButton: {
    backgroundColor: theme.colors.primaryLight,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  followSmallText: {
    color: "#fff",
    fontWeight: "bold",
  },
  image: {
    width,
    height: width,
  },
  mediaPlaceholder: {
    width,
    height: width,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#eef3f1",
  },
  mediaPlaceholderText: {
    color: theme.colors.primaryDark,
    fontWeight: "bold",
    marginTop: 8,
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
  shareCount: {
    color: "#666",
    paddingHorizontal: 12,
    marginTop: 2,
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
  emptyComment: {
    color: "#666",
    paddingVertical: 16,
    textAlign: "center",
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
