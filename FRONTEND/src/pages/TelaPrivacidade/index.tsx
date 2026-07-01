import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Switch, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { theme } from "../../global/themes";
import { styles } from "./style";

// Utilizando a infraestrutura global de API e Sessão
import api from "../../config/api";
import UserSession from "../../utils/UserSessions";

// Mapeamento profissional casando a interface visual com as propriedades do banco
const privacyOptions = [
  {
    key: "perfil_privado",
    icon: "person-circle-outline",
    title: "Perfil privado",
    description: "Apenas conexões aprovadas podem ver suas publicações e dados.",
  },
  {
    key: "ocultar_localizacao",
    icon: "location-outline",
    title: "Ocultar localização",
    description: "Impede que sua cidade ou pontos visitados apareçam no feed.",
  },
  {
    key: "status_invisivel",
    icon: "eye-off-outline",
    title: "Status invisível",
    description: "Esconde quando você está online nas conversas.",
  },
];

export default function TelaPrivacidade() {
  const navigation = useNavigation();
  const session = UserSession.getInstance();
  const loggedUser = session.getUser();

  // Inicializa o estado lendo direto os dados reais da sessão do usuário
  const [settings, setSettings] = useState<Record<string, boolean>>({
    perfil_privado: loggedUser?.perfil_privado ?? false,
    ocultar_localizacao: loggedUser?.ocultar_localizacao ?? false,
    status_invisivel: loggedUser?.status_invisivel ?? false,
  });

  const [updatingKey, setUpdatingKey] = useState<string | null>(null);

  // Sincroniza a alteração do Switch diretamente com o FastAPI e o Singleton
  const toggleOption = async (key: string, currentValue: boolean) => {
    if (updatingKey) return; // Evita cliques duplos simultâneos

    const newValue = !currentValue;

    try {
      setUpdatingKey(key);

      // Otimismo visual: atualiza o estado local para dar feedback imediato
      setSettings((current) => ({ ...current, [key]: newValue }));

      // Envia o payload dinâmico para a rota de atualização cadastrada no FastAPI
      const response = await api.put("/auth/users/update", {
        [key]: newValue,
      });

      //Atualiza o Singleton global para manter o app inteiro sincronizado
      if (response.data) {
        session.setUser(response.data);
      }

    } catch (error: any) {
      console.log(`Erro ao atualizar a configuração ${key}:`, error.message);
      alert("Não foi possível salvar sua alteração de privacidade no servidor.");
      
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
        <Text style={styles.headerTitle}>Privacidade</Text>
        <View style={styles.iconButton} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.summary}>
          <Ionicons name="lock-closed-outline" size={32} color={theme.colors.primaryLight} />
          <View style={styles.summaryTextBox}>
            <Text style={styles.summaryTitle}>Controle sua presença na rede</Text>
            <Text style={styles.summaryText}>
              Ajuste quem pode ver seu perfil, suas atividades e seus sinais de presença.
            </Text>
          </View>
        </View>

        {privacyOptions.map((item) => {
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
          <Text style={styles.noticeTitle}>Dados compartilhados</Text>
          <Text style={styles.noticeText}>
            A NewEco usa seus dados apenas para melhorar conexões, missões e recomendações
            sustentáveis dentro do app.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}