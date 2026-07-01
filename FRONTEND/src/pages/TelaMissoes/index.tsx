import React, { useMemo, useState } from "react";
import { Text, View, FlatList, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { theme } from "../../global/themes";
import { style } from "./style";

// Usando a nossa instância do Axios com JWT acoplado
import api from "../../config/api";
import UserSession from "../../utils/UserSessions";

type Mission = {
  id: number;
  titulo: string;
  descricao: string;
  recompensa: number;
  total_acoes: number;
  local: string;
  tema: string;
  ativo: boolean;
  progresso_atual: number; 
};

const obterIconePorTema = (tema: string): keyof typeof Ionicons.glyphMap => {
  switch (tema?.toLowerCase()) {
    case "plástico":
      return "refresh-circle-outline";
    case "eletrônicos":
    case "eletrónicos":
      return "flash-outline";
    case "vidro":
      return "wine-outline";
    default:
      return "leaf-outline";
  }
};

export default function TelaMissoes() {
  const navigation = useNavigation();
  
  const [missoes, setMissoes] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);

  // 🟢 MUDANÇA: useFocusEffect recarrega a lista sempre que o usuário abre a tela
  useFocusEffect(
    React.useCallback(() => {
      const carregarMissoesDoUsuario = async () => {
        try {
          const usuarioLogado = UserSession.getInstance().getUser();
          const userId = usuarioLogado?.id;

          if (!userId) {
            Alert.alert("Erro de autenticação", "Usuário não identificado. Por favor, refaça o login.");
            navigation.navigate("Login" as never);
            return;
          }

          // Busca as missões personalizadas passando o JWT de forma implícita
          const response = await api.get(`/missoes/usuario/${userId}`);
          setMissoes(response.data || []);
        } catch (error: any) {
          console.error("Erro ao puxar missões personalizadas:", error.message);
          Alert.alert("Erro", "Não foi possível carregar as missões.");
        } finally {
          setLoading(false);
        }
      };

      carregarMissoesDoUsuario();
    }, [navigation])
  );

  const totalEcoPontos = useMemo(
    () =>
      missoes
        .filter((m) => m.progresso_atual >= m.total_acoes)
        .reduce((total, m) => total + m.recompensa, 0),
    [missoes]
  );

  const completed = missoes.filter((m) => m.progresso_atual >= m.total_acoes).length;
  const progressPercent = missoes.length > 0 ? (completed / missoes.length) * 100 : 0;

  // 🟢 CORREÇÃO: Enviando o incremento usando o Axios centralizado
  const registrarProgressoNoBanco = async (missaoId: number) => {
    try {
      const usuarioLogado = UserSession.getInstance().getUser();
      const userId = usuarioLogado?.id;

      const response = await api.post("/missoes/progresso", {
        usuario_id: userId,
        missao_id: missaoId
      });

      const missaoAtualizada = response.data;

      // Atualiza o estado da lista localmente na tela
      setMissoes((atuais) =>
        atuais.map((m) => (m.id === missaoId ? { ...m, progresso_atual: missaoAtualizada.progresso_atual } : m))
      );

      if (missaoAtualizada.progresso_atual >= missaoAtualizada.total_acoes) {
        Alert.alert("Missão Concluída!", `Sensacional! +${missaoAtualizada.recompensa} EcoPontos na conta.`);
      }

    } catch (error: any) {
      console.log("Erro ao registrar progresso:", error.response?.data || error.message);
      Alert.alert("Erro", "Não foi possível registrar o progresso no servidor.");
    }
  };

  const renderItem = ({ item }: { item: Mission }) => {
    const concluida = item.progresso_atual >= item.total_acoes;
    const itemProgress = (item.progresso_atual / item.total_acoes) * 100;
    const iconeCalculado = obterIconePorTema(item.tema);

    return (
      <View style={style.card}>
        <View style={style.cardHeader}>
          <View style={style.missionIcon}>
            <Ionicons name={iconeCalculado} size={24} color={theme.colors.primaryDark} />
          </View>

          <View style={style.cardTitleBox}>
            <Text style={style.titulo}>{item.titulo}</Text>
            <Text style={style.local}>{item.local || "Posto Ecológico"}</Text>
          </View>

          {concluida && (
            <Ionicons name="checkmark-circle" size={24} color={theme.colors.primaryLight} />
          )}
        </View>

        <Text style={style.descricao}>{item.descricao}</Text>

        <View style={style.progressRow}>
          <Text style={style.progresso}>
            {item.progresso_atual} de {item.total_acoes} ações
          </Text>
          <Text style={style.recompensa}>{item.recompensa} EcoPontos</Text>
        </View>

        <View style={style.barraContainer}>
          <View style={[style.barra, { width: `${itemProgress}%` }]} />
        </View>

        <TouchableOpacity
          style={[style.botao, concluida && style.botaoDesativado]}
          onPress={() => registrarProgressoNoBanco(item.id)}
          disabled={concluida}
        >
          <Text style={style.botaoTexto}>
            {concluida ? "Concluída" : "Registrar progresso"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[style.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={{ marginTop: 10, color: "#fff" }}>Carregando suas EcoMissões...</Text>
      </View>
    );
  }

  return (
    <View style={style.container}>
      <View style={style.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={style.iconButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={style.tituloTela}>Missões NewEco</Text>
        <View style={style.iconButton} />
      </View>

      <FlatList
        data={missoes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={style.listContent}
        ListHeaderComponent={
          <View style={style.summary}>
            <View style={style.summaryTop}>
              <View style={{ flex: 1, paddingRight: 8 }}>
                <Text style={style.summaryTitle}>Seu impacto da semana</Text>
                <Text style={style.summaryText}>
                  Cada descarte correto conta pontos para salvar o planeta.
                </Text>
              </View>
              <View style={style.pointsBadge}>
                <Text style={style.pointsValue}>{totalEcoPontos}</Text>
                <Text style={style.pointsLabel}>pontos</Text>
              </View>
            </View>

            <View style={style.summaryBarBackground}>
              <View style={[style.summaryBar, { width: `${progressPercent}%` }]} />
            </View>

            <View style={style.summaryActions}>
              <TouchableOpacity
                style={style.mapButton}
                onPress={() => navigation.navigate("MapaVerde" as never)}
              >
                <Ionicons name="map-outline" size={18} color="#fff" />
                <Text style={style.mapButtonText}>Ver pontos no mapa</Text>
              </TouchableOpacity>
              <Text style={style.completedText}>
                {completed}/{missoes.length} concluídas
              </Text>
            </View>
          </View>
        }
      />
    </View>
  );
}