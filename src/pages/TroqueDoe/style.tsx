import { StyleSheet } from "react-native";
import { theme } from "../../global/themes";
import { scaleFont, scaleHeight, scaleWidth } from "../../utils/responsive";

export const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
  boxHeader: {
    width: "100%",
    height: scaleHeight(120),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.textLight,
    flexDirection: "row",
    gap: scaleWidth(60),
    borderWidth: 1,
    opacity: 6,
  },
  Titulo: {
    flexDirection: "row",
    marginTop: scaleHeight(50),
  },
  NotiPerfil: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: scaleWidth(20),
    marginTop: scaleHeight(50),
    marginLeft: scaleWidth(6),
  },
  boxPesquisa: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 45,
    borderWidth: 1,
    borderColor: "#ddd",
    margin:10,
    color:theme.colors.textDark
  },


  boxMenu: {
     width: "100%",
    height: scaleHeight(90),

  },
});
