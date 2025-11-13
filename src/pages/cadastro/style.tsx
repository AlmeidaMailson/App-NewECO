import { Dimensions, StyleSheet, } from "react-native";
import { theme } from "../../global/themes";

export const style = StyleSheet.create({
      container: {
    flex: 1,
    alignItems:'center'

  },
  boxlogo:{
    marginTop:Dimensions.get('window').height * 0.06,
    width:'100%',
    alignItems:'center'

  },
  logo:{
     width: 215,
    height: 215,
  },
    boxPerfil:{
      width:'100%',
      height:Dimensions.get('window').height * 0.2,
      alignItems:'center',
    },
    boxCadastro:{
      height:"100%",
      width:'100%',
      
    },
    inpuntContainer:{
      flexDirection:'row',
       width:'80%',
       gap:20,
       alignItems:'center',
       justifyContent:'center',
       marginLeft:30
    },
    boxSenha:{
      width:'100%',
      marginTop:10,
      marginBottom:Dimensions.get('window').height * 0.04,
      alignItems:'center',
      justifyContent:'center',
      gap:10
    },
  text: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    alignItems:'flex-start',
    marginBottom:2

  },
})
