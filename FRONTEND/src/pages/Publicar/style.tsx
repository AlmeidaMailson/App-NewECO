import { StyleSheet, Dimensions } from "react-native";
import { theme } from "../../global/themes";

const size = Dimensions.get("window").width / 3;

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
    paddingHorizontal: 15,
    paddingBottom: 10,
  },

  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  continue: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  previewContainer: {
    width: "100%",
    height: 300,
    backgroundColor: "#000",
  },

  preview: {
    width: "100%",
    height: "100%",
  },

  thumbBox: {
    width: size,
    height: size,
  },

  thumb: {
    width: "100%",
    height: "100%",
  },

  selectedThumb: {
    borderWidth: 3,
    borderColor: theme.colors.primaryLight,
  },

  videoBadge: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 3,
    borderRadius: 5,
  },
});