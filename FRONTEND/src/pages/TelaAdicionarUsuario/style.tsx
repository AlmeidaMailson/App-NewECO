import { StyleSheet } from "react-native";
import { theme } from "../../global/themes";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    height: 90,
    backgroundColor: theme.colors.primaryLight,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  iconButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  searchArea: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#edf1ef",
    backgroundColor: "#fff",
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f4f7f6",
    borderRadius: 14,
    paddingHorizontal: 14,
  },
  searchInput: {
    flex: 1,
    height: 48,
    color: theme.colors.textDark,
  },
  filters: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 18,
    alignItems: "center",
    backgroundColor: "#eafaf7",
  },
  filterButtonActive: {
    backgroundColor: theme.colors.primaryLight,
  },
  filterText: {
    color: theme.colors.primaryDark,
    fontWeight: "bold",
  },
  filterTextActive: {
    color: "#fff",
  },
  list: {
    padding: 16,
    paddingBottom: 30,
  },
  userCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#edf1ef",
    elevation: 2,
  },
  avatar: {
    width: 62,
    height: 62,
    borderRadius: 31,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  name: {
    flex: 1,
    color: theme.colors.primaryDark,
    fontSize: 17,
    fontWeight: "bold",
  },
  statusBadge: {
    backgroundColor: theme.colors.primaryDark,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  statusBadgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "bold",
  },
  username: {
    color: theme.colors.primaryLight,
    fontWeight: "600",
    marginTop: 2,
  },
  bio: {
    color: "#666",
    lineHeight: 19,
    marginTop: 6,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 8,
  },
  metaText: {
    color: theme.colors.primaryDark,
    fontSize: 13,
    fontWeight: "600",
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 9,
  },
  tag: {
    backgroundColor: "#eef3f1",
    borderRadius: 12,
    paddingVertical: 5,
    paddingHorizontal: 9,
  },
  tagText: {
    color: "#555",
    fontSize: 12,
    fontWeight: "600",
  },
  actions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },
  followButton: {
    flex: 1,
    backgroundColor: theme.colors.primaryLight,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
  },
  followingButton: {
    backgroundColor: "#eafaf7",
    borderWidth: 1,
    borderColor: theme.colors.primaryLight,
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
    borderWidth: 1,
    borderColor: theme.colors.primaryLight,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
  },
  chatButtonActive: {
    backgroundColor: theme.colors.button,
    borderColor: theme.colors.button,
  },
  chatButtonText: {
    color: theme.colors.primaryLight,
    fontWeight: "bold",
  },
  chatButtonTextActive: {
    color: "#fff",
  },
  empty: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    color: "#666",
    marginTop: 10,
    fontWeight: "600",
  },
});
