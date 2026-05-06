import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { theme } from "../../global/themes";
import UserSession from "../../utils/UserSessions";
import { styles } from "./style";

const history = [
  {
    id: "1",
    title: "Missão de reciclagem concluída",
    date: "Hoje",
    points: "+50",
  },
  {
    id: "2",
    title: "Publicação sustentável curtida",
    date: "Ontem",
    points: "+20",
  },
  {
    id: "3",
    title: "Resgate em benefício ecológico",
    date: "Esta semana",
    points: "-100",
  },
];

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

export default function TelaEcoBeneficios() {
  const navigation = useNavigation();
  const user = UserSession.getInstance().getUser();
  const ecoBeneficios = user?.ecoBeneficios ?? 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>EcoBenefícios</Text>
        <View style={styles.iconButton} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Seu saldo atual</Text>
          <Text style={styles.balanceValue}>{ecoBeneficios}</Text>
          <Text style={styles.balanceText}>
            Use seus EcoPontos para desbloquear benefícios e acompanhar seu impacto.
          </Text>
        </View>

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

        <Text style={styles.sectionTitle}>Histórico</Text>
        {history.map((item) => (
          <View key={item.id} style={styles.historyItem}>
            <View>
              <Text style={styles.historyTitle}>{item.title}</Text>
              <Text style={styles.historyDate}>{item.date}</Text>
            </View>
            <Text
              style={[
                styles.historyPoints,
                item.points.startsWith("-") && styles.historyPointsNegative,
              ]}
            >
              {item.points}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
