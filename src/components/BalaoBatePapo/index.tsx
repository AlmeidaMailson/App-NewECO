
import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { theme } from "../../global/themes";
import botavatar from "../../assets/botavatar.png";

interface Props {
  message: any;
  isBot?: boolean;
}

export default function ChatBubble({ message, isBot }: Props) {
  return (
    <View style={[styles.container, isBot ? styles.bot : styles.user]}>
      {isBot && (
        <Image
          source={botavatar}
          style={styles.avatar}
        />
      )}
      <View style={styles.bubble}>
        <Text style={styles.text}>{message.content}</Text>
        <Text style={styles.time}>
          {new Date(message.createdAt).toLocaleTimeString()}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginVertical: 6,
    alignItems: "flex-end",
    paddingHorizontal: 10,
  },
  bot: { justifyContent: "flex-start" },
  user: { justifyContent: "flex-end" },
  bubble: {
    maxWidth: "78%",
    padding: 10,
    borderRadius: 12,
    backgroundColor: theme.colors.textLight,
  },
  text: { color: "#111" },
  time: { fontSize: 10, color: "#666", marginTop: 6, textAlign: "right" },
  avatar: { width: 36, height: 36, borderRadius: 18, marginRight: 8 },
});
