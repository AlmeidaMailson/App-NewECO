import { StyleSheet } from "react-native";
import { theme } from "../../global/themes";

export const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 44,
    paddingHorizontal: 15,
    paddingBottom: 16,
    backgroundColor: theme.colors.primaryLight,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backButton: {
    marginRight: 10,
  },
  profileButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 2,
    borderColor: "#fff",
  },
  profileInfo: {
    marginLeft: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  username: {
    fontSize: 14,
    color: "#e7fffb",
  },
  status: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "bold",
  },
  messages: {
    flex: 1,
  },
  messagesContent: {
    padding: 12,
    gap: 12,
  },
  messageLeft: {
    alignSelf: "flex-start",
    backgroundColor: "#eef3f1",
    padding: 12,
    borderRadius: 15,
    maxWidth: "78%",
  },
  messageRight: {
    alignSelf: "flex-end",
    backgroundColor: theme.colors.primaryLight,
    padding: 12,
    borderRadius: 15,
    maxWidth: "78%",
  },
  messageText: {
    color: theme.colors.textDark,
    lineHeight: 20,
  },
  messageRightText: {
    color: "#fff",
    lineHeight: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    minHeight: 45,
    backgroundColor: "#f1f1f1",
    borderRadius: 25,
    paddingHorizontal: 15,
    marginRight: 10,
    color: theme.colors.textDark,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#eafaf7",
  },
});
