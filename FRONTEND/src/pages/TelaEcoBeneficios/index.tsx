import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { theme } from "../../global/themes";
import UserSession from "../../utils/UserSessions";
import { styles } from "./style";

// 🟢 MUDANÇA AQUI: Importando a nossa instância autenticada
import api from "../../config/api";

const actions = [
  {
    icon: "leaf-outline",
    title: "Complete missões",
    description: "Ganhe pontos registrando ações sustentáveis.",
  },
  {
    icon: "map-outline",
    title: "Use o Mapa Verde",
    description: "Encontre ecopontos e locais parceiros próximos.",
  },
  {
    icon: "gift-outline",
    title: "Resgate benefícios",
    description: "Troque pontos por recompensas ecológicas.",
  },
];

interface TransacaoHistorico {
  id: string;
  title: string; // ou 'descricao' conforme o seu modelo do banco
  date: string;  // ou 'criado_em'
  points: string; // ex: "+50" ou "-100"
}

export default function TelaEcoBeneficios() {
  const navigation = useNavigation();
  
  // Estados dinâmicos para substituir os mocks
  const [ecoBeneficios, setEcoBeneficios] = useState(0);
  const [historyList, setHistoryList] = useState<TransacaoHistorico[]>([]);
  const [loading, setLoading] = useState(true);

  // 🟢 useFocusEffect recarrega os pontos toda vez que a tela ganha foco
  useFocusEffect(
    React.useCallback(() => {
      async function carregarDadosEco() {
        try {
          // 1. Busca os dados de saldo e perfil atualizados do usuário logado
          // O JWT no interceptor garante que o back sabe quem é o usuário
          const userResponse = await api.get("/users/me"); 
          setEcoBeneficios(userResponse.data?.ecoBeneficios ?? 0);

          // Atualiza também o Singleton local para manter o app em sincronia
          if (userResponse.data) {
            UserSession.getInstance().setUser(userResponse.data);
          }

          // 2. Busca o histórico de transações/extrato de pontos do usuário
          // Adapte essa rota para bater exatamente com o seu router do FastAPI (ex: /usuarios/extrato)
          const historyResponse = await api.get("/users/me/extrato-pontos");
          setHistoryList(historyResponse.data ?? []);

        } catch (error: any) {
          console.log("Erro ao buscar dados ecológicos:", error.response?.data || error.message);
          
          // Fallback seguro caso suas rotas de extrato ainda estejam em desenvolvimento
          const fallbackUser = UserSession.getInstance().getUser();
          setEcoBeneficios(fallbackUser?.ecoBeneficios ?? 0);
        } finally {
          setLoading(false);
        }
      }

      carregarDadosEco();
    }, [])
  );

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>EcoBenefícios</Text>
        <View style={styles.iconButton} />
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={theme.colors.primaryLight} />
          <Text style={{ color: "#fff", marginTop: 10 }}>Atualizando seus EcoPontos...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* CARD DE SALDO */}
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Seu saldo atual</Text>
            <Text style={styles.balanceValue}>{ecoBeneficios}</Text>
            <Text style={styles.balanceText}>
              Use seus EcoPontos para desbloquear benefícios e acompanhar seu impacto.
            </Text>
          </View>

          {/* CARDS DE AÇÕES */}
          <Text style={styles.sectionTitle}>Como ganhar mais</Text>
          {actions.map((item) => (
            <View key={item.title} style={styles.actionCard}>
              <View style={styles.actionIcon}>
                <Ionicons
                  name={item.icon as any}
                  size={23}
                  color={theme.colors.primaryDark}
                />
              </View>
              <View style={styles.actionTextBox}>
                <Text style={styles.actionTitle}>{item.title}</Text>
                <Text style={styles.actionDescription}>{item.description}</Text>
              </View>
            </View>
          ))}

          {/* HISTÓRICO REAL */}
          <Text style={styles.sectionTitle}>Histórico</Text>
          {historyList.length === 0 ? (
            <Text style={{ textAlign: "center", color: "#999", marginTop: 15 }}>
              Nenhuma movimentação de pontos encontrada.
            </Text>
          ) : (
            historyList.map((item) => {
              const isNegative = String(item.points).startsWith("-");
              return (
                <View key={item.id} style={styles.historyItem}>
                  <View>
                    <Text style={styles.historyTitle}>{item.title}</Text>
                    <Text style={styles.historyDate}>{item.date}</Text>
                  </View>
                  <Text
                    style={[
                      styles.historyPoints,
                      isNegative && styles.historyPointsNegative,
                    ]}
                  >
                    {item.points}
                  </Text>
                </View>
              );
            })
          )}
        </ScrollView>
      )}
    </View>
  );
}