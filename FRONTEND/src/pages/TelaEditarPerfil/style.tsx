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
  scroll: {
    alignItems: "center",
    paddingVertical: 28,
    paddingBottom: 40,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  changePhoto: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: theme.colors.primaryDark,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  changePhotoText: {
    color: "#fff",
    fontWeight: "bold",
  },
  form: {
    width: "90%",
  },
  label: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
    marginTop: 10,
    fontWeight: "600",
  },
  input: {
    width: "100%",
    minHeight: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 15,
    color: theme.colors.textDark,
    backgroundColor: "#fff",
  },
  bioInput: {
    height: 100,
    paddingTop: 12,
    textAlignVertical: "top",
  },
  button: {
    width: "90%",
    height: 52,
    backgroundColor: theme.colors.primaryLight,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 28,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
