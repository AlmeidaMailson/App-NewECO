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
  content: {
    padding: 16,
    paddingBottom: 30,
  },
  balanceCard: {
    backgroundColor: theme.colors.primaryDark,
    borderRadius: 18,
    padding: 20,
    marginBottom: 18,
  },
  balanceLabel: {
    color: "#e7fffb",
    fontWeight: "600",
  },
  balanceValue: {
    color: "#fff",
    fontSize: 42,
    fontWeight: "bold",
    marginTop: 6,
  },
  balanceText: {
    color: "#e7fffb",
    lineHeight: 20,
    marginTop: 8,
  },
  sectionTitle: {
    color: theme.colors.primaryDark,
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 8,
    marginBottom: 10,
  },
  actionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#edf1ef",
    marginBottom: 10,
    elevation: 2,
  },
  actionIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#eafaf7",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  actionTextBox: {
    flex: 1,
  },
  actionTitle: {
    color: theme.colors.textDark,
    fontSize: 16,
    fontWeight: "bold",
  },
  actionDescription: {
    color: "#666",
    lineHeight: 18,
    marginTop: 3,
  },
  historyItem: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#edf1ef",
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  historyTitle: {
    color: theme.colors.textDark,
    fontWeight: "bold",
  },
  historyDate: {
    color: "#666",
    marginTop: 4,
  },
  historyPoints: {
    color: theme.colors.primaryLight,
    fontWeight: "bold",
    fontSize: 16,
  },
  historyPointsNegative: {
    color: theme.colors.button,
  },
});
