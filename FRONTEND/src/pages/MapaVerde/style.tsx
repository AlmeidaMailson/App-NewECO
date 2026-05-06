import { StyleSheet } from "react-native";
import { theme } from "../../global/themes";

export const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  map: {
    flex: 1,
  },
  header: {
    position: "absolute",
    top: 44,
    left: 16,
    right: 16,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "#edf1ef",
    elevation: 5,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#eafaf7",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    color: theme.colors.primaryDark,
    fontSize: 20,
    fontWeight: "bold",
  },
  headerSubtitle: {
    color: "#666",
    marginTop: 2,
  },
  bottomPanel: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    padding: 16,
    paddingBottom: 22,
    elevation: 8,
  },
  selectedCard: {
    flexDirection: "row",
    alignItems: "center",
  },
  selectedIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedTextBox: {
    flex: 1,
    marginLeft: 12,
  },
  selectedTitle: {
    color: theme.colors.primaryDark,
    fontSize: 16,
    fontWeight: "bold",
  },
  selectedMeta: {
    color: "#666",
    marginTop: 2,
  },
  reward: {
    color: theme.colors.button,
    marginTop: 3,
    fontWeight: "bold",
  },
  missionButton: {
    backgroundColor: theme.colors.primaryDark,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  missionButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  pointList: {
    gap: 8,
    paddingTop: 14,
  },
  pointChip: {
    paddingVertical: 9,
    paddingHorizontal: 13,
    borderRadius: 18,
    backgroundColor: "#eef3f1",
  },
  pointChipActive: {
    backgroundColor: theme.colors.primaryLight,
  },
  pointChipText: {
    color: theme.colors.primaryDark,
    fontWeight: "600",
  },
  pointChipTextActive: {
    color: "#fff",
  },
});
