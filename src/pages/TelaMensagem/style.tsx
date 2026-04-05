import { StyleSheet } from "react-native";
import { theme } from "../../global/themes";
import { scaleHeight, scaleWidth } from "../../utils/responsive";

export const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    top: scaleHeight(25)
  },
  boxHeader:{
    width: 'auto',

  },
  boxHeaderInicio:{
    flexDirection:'row',
    gap: scaleWidth(230),
    alignItems:'center',
    justifyContent:"center",
    width: scaleWidth(412),
    height: scaleHeight(101),
    


  },
  pesquisar:{
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 100,
        paddingHorizontal: 10,
        margin: 10,
        marginLeft: scaleWidth(20),
        backgroundColor:theme.colors.textLight
  },
    boxHeaderLogo:{
    gap: scaleWidth(5),
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    width: scaleWidth(397),
    height: scaleHeight(113),
    backgroundColor: theme.colors.primaryLight,
    borderTopLeftRadius:100,
    borderBottomLeftRadius:100,
    marginLeft: scaleWidth(5),
    marginRight: scaleWidth(2),
    padding: 60,
    borderWidth: scaleWidth(0.80)
  },
  LogoContainer:{
    width: scaleWidth(94),
    height: scaleHeight(94),
    backgroundColor: theme.colors.textLight,
    borderRadius:100,
    alignItems:'center',
    justifyContent:'center',
    marginRight: scaleWidth(10),
    borderWidth: scaleWidth(0.80)
    



  },
   logo: {
    width:scaleWidth(69),
    height: scaleHeight(69),

  },
  boxMensagen:{
     top: scaleHeight(30),
     width:scaleWidth(411),
     height: scaleHeight(560),
     alignItems:'center'

  },
  CardMensagen:{
    width:scaleWidth(402),
    height: scaleHeight(134),
    backgroundColor: theme.colors.button,
    borderTopLeftRadius: 50,
    borderBottomLeftRadius:50,
    borderTopRightRadius:30,
    borderBottomRightRadius:30,
    alignItems:'center',
    justifyContent:'center',
    flexDirection:'row',
    gap: scaleWidth(20)

  },
  fotoPerfil:{
  width:scaleWidth(88),
  height:scaleHeight(88),
  backgroundColor: theme.colors.textLight,
  borderRadius:100,
  alignItems:'center',
  justifyContent:'center',


  },
  NotifiConversas:{
    gap: scaleHeight(5),
    marginBottom: scaleHeight(20)

  },
  boxHora:{
    marginBottom: scaleHeight(90),
    marginLeft: scaleWidth(40),
    marginRight:scaleWidth(10)

  },
  boxMenu:{
    
      alignItems:'center',
      justifyContent:'center',
      flexDirection:'row',
      gap: scaleWidth(19)
  },
  BoxMenuHome:{
      backgroundColor: theme.colors.background,
      borderWidth: scaleWidth(0.80),
      borderRadius:100,
      width: scaleWidth(75),
      height: scaleHeight(75),
      alignItems:'center',
      justifyContent:'center',
       position:'absolute',
       marginRight:scaleWidth(250)

  },
  BoxMenuAdd:{
    backgroundColor: theme.colors.background,
      borderWidth: scaleWidth(0.80),
      borderRadius:100,
      width: scaleWidth(100),
      height: scaleHeight(100),
      alignItems:'center',
      justifyContent:'center',
      marginBottom: scaleHeight(90),
      position:'absolute'
  },

  boxMenuicons:{
        backgroundColor: theme.colors.background,
      borderWidth: scaleWidth(0.80),
      borderRadius:100,
      width: scaleWidth(75),
      height: scaleHeight(75),
      alignItems:'center',
      justifyContent:'center',
      position:'absolute',
      marginLeft:scaleWidth(250)
  }
});
