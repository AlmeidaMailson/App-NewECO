import { StyleSheet } from "react-native";
import { theme } from "../../global/themes";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primaryDark,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 22,
    borderRadius: 16,
    elevation: 5,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primaryLight,
    marginBottom: 18,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.primaryDark,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    lineHeight: 20,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    color: theme.colors.textDark,
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: theme.colors.primaryLight,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  message: {
    marginTop: 15,
    color: theme.colors.primaryDark,
    textAlign: "center",
    fontWeight: "600",
  },
});
