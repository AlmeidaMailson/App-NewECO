import { StyleSheet } from "react-native";
import { theme } from "../../global/themes";

export const styles = StyleSheet.create({

container:{

flex:1,

backgroundColor:"#FFF"

},

header:{

height:90,

paddingHorizontal:20,

paddingTop:35,

flexDirection:"row",

alignItems:"center",

borderBottomWidth:1,

borderBottomColor:"#EEE"

},

nome:{

marginLeft:10,

fontWeight:"bold",

fontSize:20,

color:theme.colors.primaryDark

},

lista:{

padding:15

},

balao:{

maxWidth:"75%",

padding:12,

borderRadius:18,

marginBottom:10

},

direita:{

alignSelf:"flex-end",

backgroundColor:theme.colors.primaryLight

},

esquerda:{

alignSelf:"flex-start",

backgroundColor:"#ECECEC"

},

texto:{

fontSize:16,

color:"#000"

},

horario:{

marginTop:5,

fontSize:11,

alignSelf:"flex-end",

color:"#666"

},

footer:{

padding:10,

borderTopWidth:1,

borderColor:"#EEE",

flexDirection:"row",

alignItems:"center"

},

input:{

flex:1,

height:45,

backgroundColor:"#F5F5F5",

borderRadius:30,

paddingHorizontal:20

},

botao:{

marginLeft:10,

backgroundColor:theme.colors.primaryLight,

width:50,

height:50,

borderRadius:25,

justifyContent:"center",

alignItems:"center"

}

});