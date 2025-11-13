import { Dimensions, StyleSheet } from "react-native";
import { theme } from "../../global/themes";

export const style = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  boxTop: {
    textAlign: "center",
    color:'#D9DEEB',
    display: "flex",
    marginTop: "35%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    
  },
  boxMid: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  boxBottom: {
    marginTop: 30,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    //backgroundColor:'blue'
  },
  boxMidPicker: {
    width: "100%",
    color: "#F0F0F0",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  boxPicker: {
    color: "#F0F0F0",
    width: Dimensions.get("window").width * 0.6,
  },
  logo: {
    width: 215,
    height: 215,
  },

  textoTop: {
    alignItems: "center",
    color:'#D9DEEB',
    marginBottom: Dimensions.get('window').height * 0.05
  },

  titletop: {
    color:'#F0F0F0',
    fontSize: 20,
    textDecorationLine:'underline'

  },

  Tm: {
    color: "#fff",
    textDecorationLine: "underline",
  },
  boxIpunt: {
    width: "70%",
    height: 40,
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  inpunt: {
    gap: 80,
    height: 50,
    width: Dimensions.get("window").width * 0.7,
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 40,
    color: theme.colors.primaryLight,
    textAlign: "center",
    fontSize:17
  },
  boxTermos: {
   
    marginBottom: Dimensions.get('window').height * 0.10,
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
  },
});
