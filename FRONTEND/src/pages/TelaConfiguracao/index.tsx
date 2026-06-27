import React from "react";
import { View, Text, TouchableOpacity, Switch, Image, ScrollView, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage"; // 🟢 Importado para limpar o JWT

import { theme } from "../../global/themes";
import { RootStackParamList } from "../../routes";
import UserSession from "../../utils/UserSessions";
import { styles } from "./style";

type NavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  "TelaConfiguracao"
>;

export default function TelaConfiguracao() {
  const navigation = useNavigation<NavigationProps>();
  const [notifications, setNotifications] = React.useState(true);
  const user = UserSession.getInstance().getUser();

  // 🟢 CORREÇÃO: Tornamos a função assíncrona para limpar o AsyncStorage com segurança
  const handleLogout = async () => {
    Alert.alert(
      "Sair da conta",
      "Tem certeza que deseja sair do NewECO?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sair",
          style: "destructive",
          onPress: async () => {
            try {
              // 1. Limpa o Singleton da sessão em memória
              UserSession.getInstance().clear();

              // 2. Remove o Token JWT e os dados do usuário salvos no armazenamento físico
              await AsyncStorage.multiRemove(["token", "user"]);

              console.log("Sessão e tokens destruídos com sucesso.");
              
              // 3. Despacha o usuário para a tela de autenticação
              navigation.navigate("Login");
            } catch (error) {
              console.log("Erro ao efetuar logout:", error);
              Alert.alert("Erro", "Não foi possível sair com segurança. Tente novamente.");
            }
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Configurações</Text>
        <View style={styles.iconButton} />
      </View>

      {/* PERFIL BOX */}
      <View style={styles.profileBox}>
        <Image
          source={{ uri: user?.avatarUri ?? "https://i.pravatar.cc/150?img=12" }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{user?.nome ?? "Seu Nome"}</Text>
        <Text style={styles.email}>Conta NewEco</Text>
      </View>

      {/* SEÇÃO DE OPÇÕES */}
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.item}
          onPress={() => navigation.navigate("TelaEditarPerfil")}
        >
          <View style={styles.itemLeft}>
            <Ionicons name="person-outline" size={22} color={theme.colors.primaryDark} />
            <Text style={styles.itemText}>Editar perfil</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        <View style={styles.item}>
          <View style={styles.itemLeft}>
            <Ionicons
              name="notifications-outline"
              size={22}
              color={theme.colors.primaryDark}
            />
            <Text style={styles.itemText}>Notificações</Text>
          </View>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: "#ddd", true: theme.colors.primaryLight }}
            thumbColor="#fff"
          />
        </View>

        <TouchableOpacity
          style={styles.item}
          onPress={() => navigation.navigate("TelaPrivacidade")}
        >
          <View style={styles.itemLeft}>
            <Ionicons name="lock-closed-outline" size={22} color={theme.colors.primaryDark} />
            <Text style={styles.itemText}>Privacidade</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.item}
          onPress={() => navigation.navigate("TelaSeguranca")}
        >
          <View style={styles.itemLeft}>
            <Ionicons name="shield-checkmark-outline" size={22} color={theme.colors.primaryDark} />
            <Text style={styles.itemText}>Segurança</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>
      </View>

      {/* BOTÃO LOGOUT */}
      <TouchableOpacity style={styles.logout} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={22} color="#fff" />
        <Text style={styles.logoutText}>Sair da conta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}