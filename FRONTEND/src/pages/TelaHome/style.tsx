import { StyleSheet } from "react-native";
import { theme } from "../../global/themes";

export const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },

  greeting: {
    fontSize: 22,
    fontWeight: "bold",
    color: theme.colors.primaryDark,
  },

  subText: {
    fontSize: 14,
    color: "#555",
  },

  quickActions: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
    marginVertical: 10,
  },

  actionCard: {
    flex: 1,
    backgroundColor: theme.colors.primaryLight,
    minHeight: 74,
    padding: 12,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },

  actionText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },

  feedContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },

  fab: {
    position: "absolute",
    bottom: 90,
    right: 20,
    backgroundColor: theme.colors.primaryDark,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },

  bottomMenu: {
    height: 70,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
  },
});
