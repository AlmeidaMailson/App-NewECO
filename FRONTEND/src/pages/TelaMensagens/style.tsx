import { StyleSheet } from "react-native";

import { theme } from "../../global/themes";

export const styles = StyleSheet.create({

container:{

flex:1,

backgroundColor:"#FFF"

},

titulo:{

fontSize:30,

fontWeight:"bold",

color:theme.colors.primaryDark,

marginTop:60,

marginLeft:20,

marginBottom:20

},

input:{

height:50,

marginHorizontal:15,

borderRadius:15,

backgroundColor:"#F5F5F5",

paddingHorizontal:20,

marginBottom:15

},

loading:{

flex:1,

justifyContent:"center",

alignItems:"center"

}

});