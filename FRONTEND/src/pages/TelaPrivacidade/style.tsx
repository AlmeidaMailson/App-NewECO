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
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  content: {
    padding: 16,
    paddingBottom: 30,
  },
  summary: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#edf1ef",
    marginBottom: 16,
    elevation: 2,
  },
  summaryTextBox: {
    flex: 1,
    marginLeft: 12,
  },
  summaryTitle: {
    color: theme.colors.primaryDark,
    fontSize: 17,
    fontWeight: "bold",
  },
  summaryText: {
    color: "#666",
    lineHeight: 20,
    marginTop: 4,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#edf1ef",
    marginBottom: 12,
  },
  optionIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#eafaf7",
    alignItems: "center",
    justifyContent: "center",
  },
  optionTextBox: {
    flex: 1,
    marginHorizontal: 12,
  },
  optionTitle: {
    color: theme.colors.textDark,
    fontSize: 16,
    fontWeight: "bold",
  },
  optionDescription: {
    color: "#666",
    fontSize: 13,
    lineHeight: 18,
    marginTop: 3,
  },
  notice: {
    backgroundColor: theme.colors.primaryDark,
    borderRadius: 14,
    padding: 16,
    marginTop: 8,
  },
  noticeTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
  },
  noticeText: {
    color: "#eefaf7",
    lineHeight: 20,
  },
});
