import { StyleSheet } from "react-native";
import { theme } from "../../global/themes";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    paddingBottom: 30,
  },
  header: {
    backgroundColor: theme.colors.primaryLight,
    alignItems: "center",
    paddingTop: 44,
    paddingHorizontal: 18,
    paddingBottom: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  backButton: {
    position: "absolute",
    top: 44,
    left: 16,
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: 104,
    height: 104,
    borderRadius: 52,
    borderWidth: 3,
    borderColor: "#fff",
    marginBottom: 10,
  },
  name: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
  username: {
    color: "#e7fffb",
    fontSize: 14,
    marginTop: 2,
  },
  bio: {
    color: "#fff",
    textAlign: "center",
    lineHeight: 20,
    marginTop: 10,
  },
  socialStats: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.16)",
    borderRadius: 16,
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  socialItem: {
    alignItems: "center",
    minWidth: 78,
  },
  socialValue: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  socialLabel: {
    color: "#e7fffb",
    fontSize: 12,
    marginTop: 2,
  },
  socialDivider: {
    width: 1,
    height: 34,
    backgroundColor: "rgba(255,255,255,0.35)",
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
    width: "100%",
  },
  followButton: {
    flex: 1,
    backgroundColor: theme.colors.primaryDark,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
  },
  followingButton: {
    backgroundColor: "#eafaf7",
  },
  followButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  followingButtonText: {
    color: theme.colors.primaryDark,
  },
  chatButton: {
    flex: 1,
    backgroundColor: theme.colors.button,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
  },
  chatButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 8,
  },
  sectionTitle: {
    color: theme.colors.primaryDark,
    fontSize: 20,
    fontWeight: "bold",
  },
  sectionSubtitle: {
    color: "#666",
    marginTop: 3,
  },
  posts: {
    padding: 16,
    paddingTop: 8,
    gap: 14,
  },
  postCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#edf1ef",
    overflow: "hidden",
    elevation: 2,
  },
  postImage: {
    width: "100%",
    height: 230,
  },
  postCaption: {
    color: theme.colors.textDark,
    lineHeight: 20,
    padding: 14,
  },
});
