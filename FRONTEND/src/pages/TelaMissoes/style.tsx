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
  tituloTela: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  listContent: {
    padding: 16,
    paddingBottom: 30,
  },
  summary: {
    backgroundColor: theme.colors.primaryDark,
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  summaryTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  summaryTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  summaryText: {
    color: "#e6f7f3",
    marginTop: 5,
    lineHeight: 20,
    maxWidth: 220,
  },
  pointsBadge: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: theme.colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  pointsValue: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  pointsLabel: {
    color: "#fff",
    fontSize: 12,
  },
  summaryBarBackground: {
    height: 8,
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 16,
  },
  summaryBar: {
    height: "100%",
    backgroundColor: theme.colors.primaryLight,
  },
  summaryActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 14,
    gap: 10,
  },
  mapButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: theme.colors.button,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  mapButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  completedText: {
    color: "#fff",
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#edf1ef",
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  missionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#eafaf7",
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitleBox: {
    flex: 1,
  },
  titulo: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.textDark,
  },
  local: {
    color: theme.colors.primaryLight,
    marginTop: 3,
    fontWeight: "600",
  },
  descricao: {
    color: "#666",
    marginTop: 12,
    lineHeight: 20,
  },
  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    gap: 10,
  },
  progresso: {
    color: theme.colors.primaryDark,
    fontWeight: "600",
  },
  barraContainer: {
    height: 8,
    backgroundColor: "#ddd",
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 10,
    marginBottom: 12,
  },
  barra: {
    height: "100%",
    backgroundColor: theme.colors.primaryLight,
  },
  recompensa: {
    color: theme.colors.button,
    fontWeight: "bold",
  },
  botao: {
    backgroundColor: theme.colors.primaryLight,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  botaoDesativado: {
    backgroundColor: "#a7c9c1",
  },
  botaoTexto: {
    color: "#fff",
    fontWeight: "bold",
  },
});
