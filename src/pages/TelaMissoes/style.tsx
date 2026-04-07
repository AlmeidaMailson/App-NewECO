import { StyleSheet } from "react-native";
import { scaleHeight } from "../../utils/responsive";

export const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 20,
    top: scaleHeight(40)
  },

  tituloTela: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#005244",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#F0F0F0",
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
  },

  titulo: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000000",
  },

  local: {
    color: "#00B89A",
    marginTop: 5,
    marginBottom: 5,
  },

  progresso: {
    color: "#005244",
    marginBottom: 10,
  },

  barraContainer: {
    height: 8,
    backgroundColor: "#ddd",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 10,
  },

  barra: {
    height: "100%",
    backgroundColor: "#00B89A",
  },

  recompensa: {
    color: "#0984E3",
    marginBottom: 10,
    fontWeight: "bold",
  },

  botao: {
    backgroundColor: "#00B89A",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  botaoDesativado: {
    backgroundColor: "#ccc",
  },

  botaoTexto: {
    color: "#fff",
    fontWeight: "bold",
  },
});