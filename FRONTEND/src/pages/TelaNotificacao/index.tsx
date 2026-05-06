import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { theme } from "../../global/themes";
import { styles } from "./style";

type Notification = {
  id: string;
  type: "like" | "comment" | "mission" | "reward";
  text: string;
  read: boolean;
};

export default function TelaNotificacao() {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "like",
      text: "Alguém curtiu sua publicação sustentável.",
      read: false,
    },
    {
      id: "2",
      type: "comment",
      text: "Comentaram na sua foto de reciclagem.",
      read: false,
    },
    {
      id: "3",
      type: "mission",
      text: "Nova missão ecológica disponível.",
      read: true,
    },
    {
      id: "4",
      type: "reward",
      text: "Você ganhou EcoPontos pela sua atividade.",
      read: true,
    },
  ]);

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "like":
        return "heart";
      case "comment":
        return "chatbubble";
      case "mission":
        return "leaf";
      case "reward":
        return "trophy";
      default:
        return "notifications";
    }
  };

  const markAsRead = (id: string) => {
    setNotifications((items) =>
      items.map((item) => (item.id === id ? { ...item, read: true } : item))
    );
  };

  const renderItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity style={styles.item} onPress={() => markAsRead(item.id)}>
      <View style={styles.iconBox}>
        <Ionicons
          name={getIcon(item.type)}
          size={22}
          color={theme.colors.primaryLight}
        />
      </View>

      <View style={styles.textBox}>
        <Text style={styles.text}>{item.text}</Text>
        <Text style={styles.time}>Agora há pouco</Text>
      </View>

      {!item.read && <View style={styles.badge} />}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Notificações</Text>
        <View style={styles.iconButton} />
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}
