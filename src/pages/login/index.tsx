import React from "react";

import { Text, 
  View, 
  Image, 
  TextInput, 
  Button ,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableOpacity,
  Alert
} from "react-native";
import { style } from "./style";
import Logo from "../../assets/logo.png";
import Background from "../../components/Background";
import { Picker } from "@react-native-picker/picker";
import { theme } from "../../global/themes";
import Botao from "../../components/botao";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../routes";
import Cadastro from "../cadastro";

type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'Login'>;


export default function Login() {

  const navigation = useNavigation<NavigationProps>();
  const [selectedValue, setSelectedValue] = React.useState("opcao1");
  return (
    <Background>
      <KeyboardAvoidingView
      
      style={{flex:1}}
      behavior={Platform.OS ==="ios" ? "padding" : "height"}
      >
        <ScrollView
         contentContainerStyle={{ flexGrow: 1}}
         keyboardShouldPersistTaps="handled"
        >
         
      <View style={style.container}>
        <View style={style.boxTop}>
          <Image source={Logo} style={style.logo} resizeMode="contain" />
          <View style={style.textoTop}>
            <TouchableOpacity onPress={()=>navigation.navigate("Cadastro")}>
              <Text style={style.titletop}>Criar uma conta</Text>
            </TouchableOpacity>
            <Text style={{ color: "#D9DEEB" }}>
              Insira seu E-mail para se cadastrar neste
            </Text>
            <Text style={{ color: "#D9DEEB" }}>aplicativo</Text>
          </View>
        </View>

        <View style={style.boxMid}>
          <View style={style.boxMidPicker}>
            <Picker
              style={style.boxPicker}
              selectedValue={selectedValue}
              onValueChange={(itemValue) => setSelectedValue(itemValue)}
              selectionColor={theme.colors.button}
            >
              <Picker.Item label="SELECIONE O USUARIO" value="opcao1" />
              <Picker.Item label="Opçao 2" value="opcoao2" />
              <Picker.Item label="Opçao 3" value="opcoao3" />
              <Picker.Item label="Opçao 4" value="opcoao4" />
            </Picker>
          </View>
          <View style={style.boxIpunt}>
            <TextInput
              placeholder="Digite seu E-mail ou número"
              placeholderTextColor="#ffffff"
              style={[style.inpunt, { marginBottom: 20 }]}
            />
          </View>
          <View style={style.boxIpunt}>
            <TextInput
              placeholder="Digite sua senha"
              placeholderTextColor="#ffffff"
              style={style.inpunt}
            />
          </View>
        </View>

        <View style={style.boxBottom}>
          <Botao
            title="ENTRAR"
            onPress={() => {
              Alert.alert(
                "Aproveite",
                "nôs ajuda à ajudar o mundo",
                [
                  {
                    text:"OK",
                    onPress:() => navigation.navigate("TelaHome")
                  },
                ]
              )
            }}
          />
        </View>

  
      </View>
      </ScrollView>
      
      </KeyboardAvoidingView>
            <View style={style.boxTermos}>
          <Text>Ao criar em continuar, você concorda com</Text>
          <Text>
            os nossos <Text style={style.Tm}>Termos de Serviço</Text> e com a{" "}
            <Text style={style.Tm}>Politica</Text>{" "}
          </Text>
          <Text style={style.Tm}>de Privacidade</Text>
        </View>
    </Background>
  );
}
