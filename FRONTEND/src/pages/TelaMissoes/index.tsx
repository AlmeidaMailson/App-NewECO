import React, { useMemo, useState, useEffect } from "react";
import { Text, View, FlatList, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { theme } from "../../global/themes";
import { style } from "./style";

// 🟢 Seus imports de sessão e ambiente (iguais aos do Login)
import UserSession from "../../utils/UserSessions";
import { API_URL } from "../../config/api";

type Mission = {
  id: number;
  titulo: string;
  descricao: string;
  recompensa: number;
  total_acoes: number;
  local: string;
  tema: string;
  ativo: boolean;
  progresso_atual: number; // Agora o progresso real virá mapeado do banco por usuário
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

  useEffect(() => {
    const carregarMissoesDoUsuario = async () => {
      try {
        // 🟢 Resgata os dados salvos na Singleton do Singleton ao logar
        const usuarioLogado = UserSession.getInstance().getUser();
        const userId = usuarioLogado?.id;

        if (!userId) {
          Alert.alert("Erro de autenticação", "Usuário não identificado. Por favor, refça o login.");
          navigation.navigate("Login" as never);
          return;
        }

        // 🟢 Faz o Fetch enviando dinamicamente o ID do usuário logado
        const response = await fetch(`${API_URL}/missoes/usuario/${userId}`);
        const dados = await response.json();
        
        setMissoes(dados);
      } catch (error) {
        console.error("Erro ao puxar missões personalizadas:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarMissoesDoUsuario();
  }, [navigation]);

  // Lógica inteligente de somar pontos mantida com sucesso
  const totalEcoPontos = useMemo(
    () =>
      missoes
        .filter((m) => m.progresso_atual >= m.total_acoes)
        .reduce((total, m) => total + m.recompensa, 0),
    [missoes]
  );

  const completed = missoes.filter((m) => m.progresso_atual >= m.total_acoes).length;
  const progressPercent = missoes.length > 0 ? (completed / missoes.length) * 100 : 0;

  // 🟢 Envia a atualização de progresso para o back-end persistir no banco de dados real
  const registrarProgressoNoBanco = async (missaoId: number) => {
    try {
      const usuarioLogado = UserSession.getInstance().getUser();
      const userId = usuarioLogado?.id;

      // Chama o endpoint para atualizar progresso daquela missão para aquele usuário
      const response = await fetch(`${API_URL}/missoes/progresso`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuario_id: userId,
          missao_id: missaoId
        })
      });

      if (!response.ok) throw new Error();

      const missaoAtualizada = await response.json();

      // Atualiza o estado da lista localmente na tela refletindo a resposta do banco
      setMissoes((atuais) =>
        atuais.map((m) => (m.id === missaoId ? { ...m, progresso_atual: missaoAtualizada.progresso_atual } : m))
      );

      if (missaoAtualizada.progresso_atual >= missaoAtualizada.total_acoes) {
        Alert.alert("Missão Concluída!", `Sensacional! +${missaoAtualizada.recompensa} EcoPontos na conta.`);
      }

    } catch (error) {
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