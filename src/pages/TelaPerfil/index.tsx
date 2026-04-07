import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { styles } from "./styles";

const theme = {
  colors: {
    primaryLight: "#00B89A",
    primaryDark: "#005244",
    gradient: ["#00B89A", "#005244"],
    background: "#FFFFFF",
    textLight: "#F0F0F0",
    textDark: "#000000",
    button: "#0984E3",
  },
};

const ProfileScreen = () => {
  const user: any = {
    name: "Mailson",
    email: "mailson@email.com",
    ecoPoints: 1250,
    missionsCompleted: 18,
    benefits: 5,
    co2Saved: "32kg",
  };

  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Image
          source={{
            uri: "https://i.pravatar.cc/150?img=12",
          }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      {/* ECO STATS */}
      <View style={styles.statsContainer}>
        <View style={styles.card}>
          <Text style={styles.cardValue}>{user.ecoPoints}</Text>
          <Text style={styles.cardLabel}>EcoPoints</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardValue}>{user.missionsCompleted}</Text>
          <Text style={styles.cardLabel}>Missões</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardValue}>{user.benefits}</Text>
          <Text style={styles.cardLabel}>Benefícios</Text>
        </View>
      </View>

      {/* IMPACTO */}
      <View style={styles.impactBox}>
        <Text style={styles.impactTitle}>🌍 Impacto Ambiental</Text>
        <Text style={styles.impactText}>
          Você já economizou {user.co2Saved} de CO₂
        </Text>
      </View>

      {/* BOTÕES */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Editar Perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonSecondary}>
          <Text style={styles.buttonTextSecondary}>Configurações</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};
