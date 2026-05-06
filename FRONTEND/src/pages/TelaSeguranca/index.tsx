import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { theme } from "../../global/themes";
import { styles } from "./style";

const securityOptions = [
  {
    icon: "key-outline",
    title: "Autenticação em duas etapas",
    description: "Solicita uma confirmação extra ao acessar sua conta.",
  },
  {
    icon: "shield-checkmark-outline",
    title: "Alertas de login",
    description: "Receba aviso quando sua conta for acessada em um novo aparelho.",
  },
  {
    icon: "chatbox-ellipses-outline",
    title: "Filtro de mensagens",
    description: "Reduz contatos suspeitos e pedidos de conversa indesejados.",
  },
];

export default function TelaSeguranca() {
  const navigation = useNavigation();
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    "Autenticação em duas etapas": false,
    "Alertas de login": true,
    "Filtro de mensagens": true,
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
        <Text style={styles.headerTitle}>Segurança</Text>
        <View style={styles.iconButton} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.summary}>
          <Ionicons name="shield-outline" size={34} color={theme.colors.primaryLight} />
          <View style={styles.summaryTextBox}>
            <Text style={styles.summaryTitle}>Proteja sua conta social</Text>
            <Text style={styles.summaryText}>
              Ative recursos que reduzem invasões, mensagens suspeitas e acessos não autorizados.
            </Text>
          </View>
        </View>

        {securityOptions.map((item) => (
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
