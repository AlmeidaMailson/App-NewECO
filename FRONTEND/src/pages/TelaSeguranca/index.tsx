import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Switch, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { theme } from "../../global/themes";
import { styles } from "./style";

// Utilizando a infraestrutura global de API e Sessão
import api from "../../config/api";
import UserSession from "../../utils/UserSessions";

// Mapeamento casando a interface visual com as propriedades do banco
const securityOptions = [
  {
    key: "dois_fatores",
    icon: "key-outline",
    title: "Autenticação em duas etapas",
    description: "Solicita uma confirmação extra ao acessar sua conta.",
  },
  {
    key: "alertas_login",
    icon: "shield-checkmark-outline",
    title: "Alertas de login",
    description: "Receba aviso quando sua conta for acessada em um novo aparelho.",
  },
  {
    key: "filtro_mensagens",
    icon: "chatbox-ellipses-outline",
    title: "Filtro de mensagens",
    description: "Reduz contatos suspeitos e pedidos de conversa indesejados.",
  },
];

export default function TelaSeguranca() {
  const navigation = useNavigation();
  const session = UserSession.getInstance();
  const loggedUser = session.getUser();

  //  Inicializa lendo os dados reais salvos no Singleton
  const [settings, setSettings] = useState<Record<string, boolean>>({
    dois_fatores: loggedUser?.dois_fatores ?? false,
    alertas_login: loggedUser?.alertas_login ?? true,
    filtro_mensagens: loggedUser?.filtro_mensagens ?? true,
  });

  const [updatingKey, setUpdatingKey] = useState<string | null>(null);

  // Sincroniza a alteração do Switch diretamente com o FastAPI e o Singleton
  const toggleOption = async (key: string, currentValue: boolean) => {
    if (updatingKey) return; 

    const newValue = !currentValue;

    try {
      setUpdatingKey(key);

      // Otimismo visual para dar feedback instantâneo ao usuário
      setSettings((current) => ({ ...current, [key]: newValue }));

      // Envia o payload dinâmico para a rota de atualização cadastrada no FastAPI
      const response = await api.put("/auth/users/update", {
        [key]: newValue,
      });

      //  Atualiza o Singleton global para manter o app inteiro sincronizado
      if (response.data) {
        session.setUser(response.data);
      }

    } catch (error: any) {
      console.log(`Erro ao atualizar a configuração de segurança ${key}:`, error.message);
      alert("Não foi possível salvar sua alteração de segurança no servidor.");
      
      // Reverte o estado visual caso a requisição web falhe
      setSettings((current) => ({ ...current, [key]: currentValue }));
    } finally {
      setUpdatingKey(null);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Segurança</Text>
        <View style={styles.iconButton} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.summary}>
          <Ionicons name="shield-outline" size={34} color={theme.colors.primaryLight} />
          <View style={styles.summaryTextBox}>
            <Text style={styles.summaryTitle}>Proteja sua conta social</Text>
            <Text style={styles.summaryText}>
              Ative recursos que reduzem invasões, mensagens suspeitas e acessos não autorizados.
            </Text>
          </View>
        </View>

        {securityOptions.map((item) => {
          const isSelected = settings[item.key];
          const isThisUpdating = updatingKey === item.key;

          return (
            <View key={item.key} style={styles.option}>
              <View style={styles.optionIcon}>
                <Ionicons
                  name={item.icon as any}
                  size={23}
                  color={theme.colors.primaryDark}
                />
              </View>

              <View style={styles.optionTextBox}>
                <Text style={styles.optionTitle}>{item.title}</Text>
                <Text style={styles.optionDescription}>{item.description}</Text>
              </View>

              {isThisUpdating ? (
                <ActivityIndicator size="small" color={theme.colors.primaryLight} style={{ marginRight: 10 }} />
              ) : (
                <Switch
                  value={isSelected}
                  onValueChange={() => toggleOption(item.key, isSelected)}
                  trackColor={{ false: "#ddd", true: theme.colors.primaryLight }}
                  thumbColor="#fff"
                  disabled={updatingKey !== null}
                />
              )}
            </View>
          );
        })}

        <View style={styles.notice}>
          <Text style={styles.noticeTitle}>Recomendações</Text>
          <Text style={styles.noticeText}>
            Use uma senha forte, não compartilhe códigos de acesso e revise conexões
            desconhecidas com frequência.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}