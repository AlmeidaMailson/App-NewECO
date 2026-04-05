import React from "react";
import Logo from "../../assets/logo.png";
import {
  View,
  Text,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { style } from "./Style";
import TelaHome from "../TelaHome";
import UserSession from "../../utils/UserSessions";
import { useNavigation } from "@react-navigation/native";
import {
  NativeStackNavigationProp,
  NativeStackNavigatorProps,
} from "@react-navigation/native-stack";
import { RootStackParamList } from "../../routes";
import { theme } from "../../global/themes";
import { scaleHeight } from "../../utils/responsive";
type NavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  "Conversa"
>;

export default function Coversa() {
  const navigation = useNavigation<NavigationProps>();

  return (
    <View style={style.container}>
      <View style={style.BoxHeader}>
        <View style={style.CardMensagen}>
          <View style={style.fotoPerfil}>
            <Text> Perfil</Text>
          </View>
          <View style={style.InfoPerfil}>
            <Text
              style={{
                fontSize: 40,
                fontFamily: "roboto-slab-regular",
                color: theme.colors.textLight,
                marginTop: 2,
              }}
            >
              Kitata Anth
            </Text>
            <Text
              style={{
                fontSize: 25,
                fontFamily: "roboto",
                color: theme.colors.textLight,
                marginLeft: 20,
              }}
            >
              @KirataKirataAnth
            </Text>
          </View>
          <View style={style.Status}>
            <Text
              style={{
                fontSize: 25,
                fontFamily: "roboto-slab-regular",
                color: theme.colors.textLight,
              }}
            >
              On-line
            </Text>
          </View>
        </View>
      </View>
     

      <View style={style.boxMensagen}>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 2, gap: scaleHeight(25), height: '100%' }}
        >
          <View style={style.BalaoMensagemUser}>
            <View style={style.MensagemUser}>
              <Text
                style={{
                  fontSize: 15,
                  color: theme.colors.textDark,
                }}
              >
                Ola bom dia, tudo bem?
              </Text>
            </View>
          </View>
          <View style={style.BalaoMensagemLogado}>
            <View style={style.MensagemUserLogado}>
              <Text
                style={{
                  fontSize: 15,
                  color: theme.colors.textDark,
                }}
              >
                Ola bom dia, tudo bem?
              </Text>
            </View>
          </View>
            <View style={style.BoxEnviar}>
        <View style={style.boxInput}>
          
          <TextInput
            placeholder="Escreva algo..."
            style={{
              height: 52,
              fontSize: 20,
              flex:1
            }}
          />
          <Ionicons name="send" size={20} color="#b92929" />
        </View>
      </View>
        </ScrollView>

      </View>
   
    
    </View>
      
  );
}
