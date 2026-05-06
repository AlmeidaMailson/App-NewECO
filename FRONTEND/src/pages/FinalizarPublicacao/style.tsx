import { StyleSheet } from "react-native";
import { theme } from "../../global/themes";

export const style = StyleSheet.create({
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
    paddingHorizontal: 15,
    paddingBottom: 10,
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },

  mediaBox: {
    width: "100%",
    height: 300,
    backgroundColor: "#000",
  },

  media: {
    width: "100%",
    height: "100%",
  },

  inputContainer: {
    padding: 15,
  },

  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 15,
    minHeight: 120,
    textAlignVertical: "top",
    fontSize: 16,
    color: theme.colors.textDark,
  },

  button: {
    margin: 15,
    height: 55,
    backgroundColor: theme.colors.primaryLight,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});