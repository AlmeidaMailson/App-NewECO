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
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  listContent: {
    paddingBottom: 20,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#eafaf7",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  textBox: {
    flex: 1,
  },
  text: {
    fontSize: 15,
    color: theme.colors.textDark,
    lineHeight: 20,
  },
  time: {
    marginTop: 4,
    fontSize: 12,
    color: "#777",
  },
  badge: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.primaryLight,
    marginLeft: 8,
  },
});
