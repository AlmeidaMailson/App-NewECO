import { Dimensions, StyleSheet } from "react-native";
import { scaleWidth, scaleHeight, scaleFont } from "../../assets/utils/responsive";
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
        shadowRadius:50,
        elevation:8
    },
    Saudacao:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        gap: scaleWidth(9),
        marginRight: scaleWidth(60),
        
    },
    boxMid:{
        //backgroundColor:'blue',
        width: scaleWidth (468),
        alignItems:'center',
        justifyContent:'center',
        gap: scaleWidth(17),
        flexDirection:'row',
        flex:1,

    },
    boxMidTroque:{
        backgroundColor:theme.colors.primaryLight,
        height: scaleHeight(140),
        width: scaleWidth(120),
        alignItems:'center',
        justifyContent:'center',
        borderRadius:20,
        margin:0,
        padding:0
    },
    boxFeed:{
       // backgroundColor:'green',
        height: scaleHeight(540),
        width: scaleWidth (412)


    },
    boxMenu:{
         backgroundColor:theme.colors.background,
          height: scaleHeight(50),
        width: scaleWidth (412),
        marginBottom: scaleHeight(50),
        alignItems:'center',
        flexDirection:'row'
    },
    menuContainer:{
        alignItems:'center',
        margin:5,
        flexDirection:'row',
        display:'flex',
        gap: scaleWidth(16),
        alignContent:'center'
    },
    button:{
    alignItems: "center",
    borderRadius: 30,
  },
    icon:{
        alignItems:'center'
    },
    menuLabel:{
        color: theme.colors.textDark,
    fontSize: 16,
  

    }
})