import { StyleSheet } from "react-native";
import { theme } from "../../global/themes";

export const style = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    alignItems: "center",
    padding: 20,
  },

  logo: {
    width: 180,
    height: 180,
    marginTop: 40,
  },

  header: {
    alignItems: "center",
    marginVertical: 20,
  },

  subtitle: {
    color: "#ccc",
    marginTop: 10,
  },

  link: {
    color: "#fff",
    fontSize: 18,
    textDecorationLine: "underline",
  },

  form: {
    width: "100%",
    gap: 15,
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

  forgot: {
    color: "#fff",
    textAlign: "right",
    marginTop: 5,
  },

  button: {
    width: "100%",
    marginTop: 20,
  },

  terms: {
    padding: 15,
    alignItems: "center",
  },
});