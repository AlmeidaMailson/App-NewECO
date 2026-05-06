import React from "react";
import { TextInput, View, TextInputProps, StyleSheet, Dimensions} from "react-native";
import { theme } from "../../global/themes";


type InputProps = TextInputProps & {
    placeholder: string;
};

export  default function TextInputComponent({ placeholder, ...rest }: InputProps) {
    return(
        <View style={style.container}>
            <TextInput
               style={style.inpunt}
               placeholder={placeholder} 
               placeholderTextColor="#ffffff"
               
               {...rest}   // permite usar propriedades extras, tipo onChangeText, secureTextEntry etc.                         
            />
        </View>
    );
    
}

const style = StyleSheet.create({
    container:{
        width: "100%",
    marginVertical: 8,
    },
    inpunt:{
       gap: 80,
       height: 50,
       width: Dimensions.get("window").width * 0.9,
       borderWidth: 1,
       borderColor: "#000000",
       borderRadius: 40,
       color: theme.colors.textLight,
       textAlign: "center",
       fontSize:17,
    }
})