import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { theme } from "../../global/themes";
import { styles } from "./style";

const privacyOptions = [
  {
    icon: "person-circle-outline",
    title: "Perfil privado",
    description: "Apenas conexões aprovadas podem ver suas publicações e dados.",
  },
  {
    icon: "location-outline",
    title: "Ocultar localização",
    description: "Impede que sua cidade ou pontos visitados apareçam no feed.",
  },
  {
    icon: "eye-off-outline",
    title: "Status invisível",
    description: "Esconde quando você está online nas conversas.",
  },
];

export default function TelaPrivacidade() {
  const navigation = useNavigation();
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    "Perfil privado": true,
    "Ocultar localização": true,
    "Status invisível": false,
  });

  const toggleOption = (title: string) => {
    setEnabled((current) => ({ ...current, [title]: !current[title] }));
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

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.summary}>
          <Ionicons name="lock-closed-outline" size={32} color={theme.colors.primaryLight} />
          <View style={styles.summaryTextBox}>
            <Text style={styles.summaryTitle}>Controle sua presença na rede</Text>
            <Text style={styles.summaryText}>
              Ajuste quem pode ver seu perfil, suas atividades e seus sinais de presença.
            </Text>
          </View>
        </View>

        {privacyOptions.map((item) => (
          <View key={item.title} style={styles.option}>
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

            <Switch
              value={enabled[item.title]}
              onValueChange={() => toggleOption(item.title)}
              trackColor={{ false: "#ddd", true: theme.colors.primaryLight }}
              thumbColor="#fff"
            />
          </View>
        ))}

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
