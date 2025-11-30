import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, TextInput} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../routes";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp, useRoute } from "@react-navigation/native";
import { style } from "./style";
import { Ionicons } from "@expo/vector-icons";
import LogoPerfil from "../../assets/LogoPerfil.png";
import { scaleFont, scaleHeight, scaleWidth } from "../../utils/responsive";
import { theme } from "../../global/themes";

type TroqueDoeRouteProps = RouteProp<RootStackParamList, "TroqueDoe">;

export default function TroqueDoe() {
  const route = useRoute<TroqueDoeRouteProps>();

  const [telaAtiva, setTelaAtiva] = useState<"tela1" | "tela2" | null>(null);

  return (
    <View style={style.container}>
      <View style={style.boxHeader}>
        <View style={style.Titulo}>
          <Text
            style={{
              fontSize: scaleFont(30),
              fontWeight:'600',
              color:"#FFC107"
            }}
          >
            Troque
          </Text>
          <Text
            style={{
              fontSize: scaleFont(30),
               fontWeight:'400',
               color:"#4CAF50",
            }}
          >
            &
          </Text>
          <Text
            style={{
              fontSize: scaleFont(30),
               fontWeight:'300',
               color:"#1010fdff"
            }}
          >
            Doe
          </Text>
        </View>
        <View style={style.NotiPerfil}>
          <View>
            <Ionicons name="notifications-outline" color={"#11111"} size={30} />
          </View>
          <View>
            <Image
              source={LogoPerfil}
              style={{
                width: scaleWidth(45),
                height: scaleHeight(45),
                borderRadius: 200,
                borderWidth: 1,
              }}
            />
          </View>
        </View>
      </View>

      <View style={style.boxPesquisa}>
          <Ionicons name="search" size={20} color="#777" />

  <TextInput
    placeholder="Pesquisar..."
    style={{ flex: 1, marginLeft: 10,color:theme.colors.textDark
     }}
    placeholderTextColor="#111"
  />
      </View>

        {telaAtiva === null && (
          <View
            style={{  justifyContent: "center", alignItems: "center", flexDirection:'row',}}
          >
            <TouchableOpacity
              onPress={() => setTelaAtiva("tela1")}
              style={{
                padding: 20,
                backgroundColor: "green",
                justifyContent:"center", 
                alignItems:'center',
                flex:1
              }}
            >
              <Text style={{ color: "#fff" }}>Abrir Tela 1</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setTelaAtiva("tela2")}
              style={{flex:1, padding: 20, backgroundColor: "blue", justifyContent:"center", alignItems:'center' }}
            >
              <Text style={{ color: "#fff" }}>Abrir Tela 2</Text>
            </TouchableOpacity>
          </View>
        )}
        

        {telaAtiva === "tela1" && (
          <View style={{ flex: 1, backgroundColor: "#4CAF50", padding: 20, }}>
            <Text style={{ color: "#fff", fontSize: 30 }}>TELA 1</Text>

            <TouchableOpacity
              onPress={() => setTelaAtiva(null)}
              style={{
                marginTop: 30,
                backgroundColor: "black",
                padding: 10,
                borderRadius: 10,
                alignSelf: "flex-start",
              }}
            >
              <Text style={{ color: "#fff" }}>Voltar</Text>
            </TouchableOpacity>
          </View>
        )}

       
        {telaAtiva === "tela2" && (
          <View style={{ flex: 1, backgroundColor: "#0097FF", padding: 20 }}>
            <Text style={{ color: "#fff", fontSize: 30 }}>TELA 2</Text>

            <TouchableOpacity
              onPress={() => setTelaAtiva(null)}
              style={{
                marginTop: 30,
                backgroundColor: "black",
                padding: 10,
                borderRadius: 10,
                alignSelf: "flex-start",
              }}
            >
              <Text style={{ color: "#fff" }}>Voltar</Text>
            </TouchableOpacity>
          </View>
        )}
     

      <View style={style.boxMenu}></View>
    </View>
  );
}
