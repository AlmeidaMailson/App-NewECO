import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { theme } from "../../global/themes";
import UserSession from "../../utils/UserSessions";
import { styles } from "./style";

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
  id: number;
  descricao: string;
  criado_em: string;
  pontos: number;
  tipo: "CREDITO" | "DEBITO";
}
export default function TelaEcoBeneficios() {
  const navigation = useNavigation();
  
  // Estados dinâmicos para substituir os mocks
  const [saldoTotal, setSaldoTotal] = useState(0);
  const [ecoBeneficios, setEcoBeneficios] = useState(0);
  const [historyList, setHistoryList] = useState<TransacaoHistorico[]>([]);
  const [loading, setLoading] = useState(true);

  // useFocusEffect recarrega os pontos toda vez que a tela ganha foco
  useFocusEffect(
    React.useCallback(() => {
      async function carregarDadosEco() {
        try {
          //  Busca o histórico de transações/extrato de pontos do usuário
          const historyResponse = await api.get("/users/me/extrato-pontos");
          console.log(historyResponse.data);

          setHistoryList(historyResponse.data.historico);
          setSaldoTotal(historyResponse.data.saldo_total);

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
            <Text style={styles.balanceValue}>{saldoTotal}</Text>
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
    const isNegative = item.tipo === "DEBITO";

    return (
        <View key={item.id} style={styles.historyItem}>
            <View>
                <Text style={styles.historyTitle}>
                    {item.descricao}
                </Text>

                <Text style={styles.historyDate}>
                    {new Date(item.criado_em).toLocaleDateString("pt-BR")}
                </Text>
            </View>

            <Text
                style={[
                    styles.historyPoints,
                    isNegative && styles.historyPointsNegative,
                ]}
            >
                {isNegative ? "-" : "+"}
                {item.pontos}
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