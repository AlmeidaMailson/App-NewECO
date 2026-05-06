import { StyleSheet } from "react-native";
import { theme } from "../../global/themes";

export const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingTop: 44,
    paddingHorizontal: 15,
    paddingBottom: 16,
    backgroundColor: theme.colors.primaryLight,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingHorizontal: 15,
    marginTop: 14,
  },
  input: {
    flex: 1,
    height: 45,
    color: theme.colors.textDark,
  },
  logo: {
    width: 56,
    height: 56,
    alignSelf: "center",
    marginTop: 10,
  },
  list: {
    padding: 12,
    paddingBottom: 90,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#edf1ef",
    elevation: 2,
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 17,
    fontWeight: "bold",
    color: theme.colors.primaryDark,
  },
  lastMessage: {
    fontSize: 14,
    color: "#666",
    marginTop: 3,
  },
  time: {
    fontSize: 12,
    color: "#777",
  },
  menu: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 70,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#eee",
  },
  addButton: {
    backgroundColor: theme.colors.primaryLight,
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
  },
});
