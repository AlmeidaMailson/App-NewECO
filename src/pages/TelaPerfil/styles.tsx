
import { StyleSheet } from "react-native";
import { scaleHeight } from "../../utils/responsive";
import { Theme } from "@react-navigation/native";
import { theme } from "../../global/themes";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  header: {
    backgroundColor: theme.colors.primaryLight,
    alignItems: "center",
    paddingVertical: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },

  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: theme.colors.textLight,
  },

  email: {
    fontSize: 14,
    color: theme.colors.textLight,
    opacity: 0.8,
  },

  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },

  card: {
    backgroundColor: "#fff",
    width: 100,
    height: 100,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },

  cardValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.primaryDark,
  },

  cardLabel: {
    fontSize: 12,
    color: "#666",
  },

  impactBox: {
    margin: 20,
    padding: 20,
    borderRadius: 20,
    backgroundColor: theme.colors.primaryDark,
  },

  impactTitle: {
    color: theme.colors.textLight,
    fontSize: 16,
    fontWeight: "bold",
  },

  impactText: {
    color: theme.colors.textLight,
    marginTop: 5,
  },

  actions: {
    marginHorizontal: 20,
    marginTop: 10,
  },

  button: {
    backgroundColor: theme.colors.button,
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 10,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },

  buttonSecondary: {
    borderWidth: 1,
    borderColor: theme.colors.primaryLight,
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
  },

  buttonTextSecondary: {
    color: theme.colors.primaryLight,
    fontWeight: "bold",
  },
});