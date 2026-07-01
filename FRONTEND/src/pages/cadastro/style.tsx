import { StyleSheet } from "react-native";
import { theme } from "../../global/themes";

export const style = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    alignItems: "center",
    padding: 20,
  },

  logo: {
    width: 250,
    height: 250,
    marginBottom: 120,
    top: 80
  },

  perfil: {
    alignItems: "center",
    marginBottom: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },

  form: {
    width: "100%",
    gap: 12,
  },

  inputGroup: {
    width: "100%",
  },

  inputSmall: {
    flex: 1,
  },

  label: {
    color: "#fff",
    marginBottom: 5,
    fontWeight: "bold",
  },

  input: {
    height: 50,
    borderWidth: 1,
    borderColor: theme.colors.primaryLight,
    borderRadius: 25,
    paddingHorizontal: 15,
    color: "#fff",
    backgroundColor: "rgba(255,255,255,0.1)",
  },

  row: {
    flexDirection: "row",
    gap: 10,
  },

  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});