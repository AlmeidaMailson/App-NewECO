import { Dimensions, StyleSheet } from "react-native";
import { scaleWidth, scaleHeight, scaleFont } from "../../utils/responsive";
import { theme } from "../../global/themes";

export const style = StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
        backgroundColor:theme.colors.background

    },

    boxHeader:{
        backgroundColor:'#FFFFFF',
        height: scaleHeight(130),
        width: scaleWidth(412),  
        alignItems:'center',
        justifyContent:'center',
        gap:scaleWidth(9),
        padding:10,
        borderColor:theme.colors.primaryDark,
        borderWidth: scaleWidth(2),
        borderBottomLeftRadius:20,
        borderBottomRightRadius:20,
        shadowColor:theme.colors.primaryDark,
        shadowOffset:{ width: 0, height:50 },
        shadowOpacity:0.9,
        shadowRadius:50

    },
    Saudacao:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        gap: scaleWidth(10),
        marginRight: scaleWidth(40),
        marginTop:scaleHeight(30)
        
    },
    boxMid:{
        height:scaleHeight(),
        width:"100%",
        padding:8,
        position:'absolute',
        alignItems:'flex-end'

  
    },
    boxFeed:{
       // backgroundColor:'green',
        height: scaleHeight(650),
        width: scaleWidth (412)


    },
    boxMenu:{
         backgroundColor:theme.colors.background,
          height: scaleHeight(90),
        width: scaleWidth (412),
        marginBottom: scaleHeight(50),
        alignItems:'center',
        justifyContent:'center',
        flexDirection:'row'
    },
    menuContainer:{
        width:'100%',
        height:'100%',        
        alignItems:'center',
        margin:5,
        flexDirection:'row',
        display:'flex',
        gap: scaleWidth(16),
        alignContent:'center',
        justifyContent:'center'
    },
    button:{
    alignItems: "center",
    borderRadius: 30,
    flex:1
  },
    icon:{
        alignItems:'center',
     
    },
    menuLabel:{
        color: theme.colors.textDark,
    fontSize: 16,
  

    }
})