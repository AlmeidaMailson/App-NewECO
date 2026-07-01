import { StyleSheet } from "react-native";
import { theme } from "../../global/themes";

export const styles = StyleSheet.create({

    container:{

        flexDirection:"row",

        alignItems:"center",

        padding:15,

        borderBottomWidth:1,

        borderBottomColor:"#EFEFEF",

        backgroundColor:"#FFF"

    },

    avatar:{

        width:60,

        height:60,

        borderRadius:30,

        backgroundColor:"#DDD"

    },

    center:{

        flex:1,

        marginLeft:15

    },

    nome:{

        fontSize:17,

        fontWeight:"bold",

        color:theme.colors.primaryDark

    },

    mensagem:{

        marginTop:4,

        color:"#666"

    },

    right:{

        alignItems:"flex-end"

    },

    horario:{

        fontSize:12,

        color:"#999"

    },

    badge:{

        marginTop:10,

        backgroundColor:theme.colors.primaryLight,

        width:22,

        height:22,

        borderRadius:11,

        justifyContent:"center",

        alignItems:"center"

    },

    badgeText:{

        color:"#FFF",

        fontWeight:"bold",

        fontSize:11

    }

});