import { StyleSheet } from "react-native";
import { theme } from "../../global/themes";
import { scaleHeight, scaleWidth } from "../../utils/responsive";

export const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    top: scaleHeight(40),
  },
  BoxHeader: {},
  CardMensagen: {
    width: scaleWidth(407),
    height: scaleHeight(122),
    backgroundColor: theme.colors.primaryLight,
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: scaleWidth(20),
  },
  fotoPerfil: {
    width: scaleWidth(88),
    height: scaleHeight(88),
    backgroundColor: theme.colors.textLight,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  InfoPerfil: {
    gap: scaleHeight(-50),
    marginBottom: scaleHeight(30),
    marginRight: scaleWidth(90),
  },
  Status: {
    marginLeft: scaleWidth(40),
    marginRight: scaleWidth(150),
    marginTop: scaleHeight(80),
    position: "absolute",
  },

  boxMensagen: {
    top: scaleHeight(30),
    width: scaleWidth(412),
    height: scaleHeight(692),
    alignItems: "center",
  },

  BalaoMensagemUser: {
    borderWidth: 1,
    width: scaleWidth(357),
    height: scaleHeight(76),
    borderTopLeftRadius: 90,
    borderTopRightRadius: 100,
    borderBottomRightRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    marginRight: scaleWidth(50),
  },
  MensagemUser: {
    padding: 20,
  },
  BalaoMensagemLogado: {
    borderWidth: 1,
    width: scaleWidth(357),
    height: scaleHeight(76),
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
    borderBottomLeftRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: scaleWidth(50),

  },
  MensagemUserLogado: {
    padding:20
  },
  BoxEnviar:{
    width: scaleHeight(389),
    height: scaleHeight(76),
    bottom: scaleHeight(35),
    top:scaleHeight(350)


  },
  boxInput:{
    flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 100,
        paddingHorizontal: 10,
        margin: 10,
        marginLeft: scaleWidth(20),
        backgroundColor:theme.colors.textLight,
  }
});
