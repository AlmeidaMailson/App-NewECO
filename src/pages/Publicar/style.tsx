import { StyleSheet, Dimensions } from "react-native";
import { theme } from "../../global/themes";
import { scaleFont, scaleHeight, scaleWidth } from "../../utils/responsive";

export const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
  boxtop: {
    backgroundColor: theme.colors.primaryLight,
    height: scaleHeight(100),
    width: scaleWidth(412),
    padding:1
  },
  boxHeader:{
    flexDirection:'row',
    height:"100%",
    justifyContent:'center',
    alignItems:'center',
    marginTop:scaleHeight(30),
    gap:scaleWidth(50),
    flex:1,
    padding:15

  },
  iconeHome:{

    
  },
  textPub:{
    alignItems:'center',
    marginLeft:scaleWidth(40),
    textAlign:"center"
  },
  pressable:{
    marginRight:20
    
  },
  boxmid: {
    flex:1,
    marginTop:scaleHeight(40),
    height: scaleHeight(100),
    width: "100%",
    alignItems: "center",
    padding: 0,
  },
  title: {
    color: theme.colors.textLight,
    fontWeight: "bold",
    fontSize: scaleFont(25),

    
  },
  buttonRow: {
    flexDirection: "row",
    gap: scaleWidth(10),
    justifyContent: "space-around",
    marginBottom: 20,
  },
  buttonPublicacao: {
    backgroundColor: theme.colors.primaryDark,
    padding: 12,
    borderRadius: 8,
    gap: scaleWidth(2),
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
    previewContainer: {
    width: "100%",
    height: 350,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
  },
  preview: {
    width: "100%",
    height: scaleHeight(300),
    borderRadius: 12,
    marginBottom: scaleHeight(20),
    resizeMode: "cover",
    backgroundColor: "#222", // caso a imagem não carregue
  },
  input: {
    backgroundColor: theme.colors.textLight,
    color: "#fff",
    borderRadius: 10,
    padding: 40,
    fontSize: scaleFont(20),
    minWidth:'90%',
    minHeight: scaleHeight(100),
    marginBottom: scaleHeight(20),
  },
  publishBtn: {
    padding: 16,
    borderRadius: 12,
  },
  publishText: {
    color: "#000",
    fontSize: scaleFont(20),
    fontWeight: "bold",
    textAlign: "center",
  },
  PublicScreen:{
 
  },
  boxmenu: {
    height: scaleHeight(100),
    width: scaleWidth(412),
    backgroundColor: theme.colors.textLight,
    borderWidth: 1,
    borderColor: theme.colors.textDark,
  },
  menuContainer: {
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
    flexDirection: "row",
    gap: scaleWidth(60),
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
  },
  icon:{
    fontSize:35,
    color: theme.colors.textLight,
    marginLeft:20
  }
});
