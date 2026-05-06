import React, { useMemo, useState } from "react";
import { Text, View, FlatList, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { theme } from "../../global/themes";
import { style } from "./style";

type Mission = {
  id: number;
  titulo: string;
  descricao: string;
  progresso: number;
  total: number;
  recompensa: number;
  local: string;
  icon: keyof typeof Ionicons.glyphMap;
};

export default function TelaMissoes() {
  const navigation = useNavigation();
  const [missoes, setMissoes] = useState<Mission[]>([
    {
      id: 1,
      titulo: "Levar recicláveis ao ecoponto",
      descricao: "Separe papel, plástico ou metal e registre sua entrega no ponto mais próximo.",
      progresso: 0,
      total: 1,
      recompensa: 50,
      local: "Ecoponto Centro",
      icon: "refresh-circle-outline",
    },
    {
      id: 2,
      titulo: "Escolher transporte sustentável",
      descricao: "Use bicicleta, caminhada ou transporte público em três deslocamentos.",
      progresso: 1,
      total: 3,
      recompensa: 100,
      local: "Zona urbana",
      icon: "bicycle-outline",
    },
    {
      id: 3,
      titulo: "Reduzir descarte incorreto",
      descricao: "Entregue óleo usado, pilhas ou eletrônicos em um local indicado no Mapa Verde.",
      progresso: 0,
      total: 2,
      recompensa: 80,
      local: "Ponto de descarte correto",
      icon: "trash-bin-outline",
    },
    {
      id: 4,
      titulo: "Participar de ação comunitária",
      descricao: "Ajude uma horta, mutirão de limpeza ou oficina ambiental da sua região.",
      progresso: 0,
      total: 1,
      recompensa: 120,
      local: "Comunidade parceira",
      icon: "people-outline",
    },
  ]);

  const totalEcoPontos = useMemo(
    () =>
      missoes
        .filter((missao) => missao.progresso >= missao.total)
        .reduce((total, missao) => total + missao.recompensa, 0),
    [missoes]
  );

  const completed = missoes.filter((missao) => missao.progresso >= missao.total).length;
  const progressPercent = (completed / missoes.length) * 100;

  const completarMissao = (id: number) => {
    setMissoes((atuais) =>
      atuais.map((missao) => {
        if (missao.id !== id || missao.progresso >= missao.total) {
          return missao;
        }

        const novoProgresso = missao.progresso + 1;

        if (novoProgresso === missao.total) {
          Alert.alert(
            "Missão concluída",
            `Boa! Você ganhou ${missao.recompensa} EcoPontos.`
          );
        }

        return { ...missao, progresso: novoProgresso };
      })
    );
  };

  const renderItem = ({ item }: { item: Mission }) => {
    const concluida = item.progresso >= item.total;
    const itemProgress = (item.progresso / item.total) * 100;

    return (
      <View style={style.card}>
        <View style={style.cardHeader}>
          <View style={style.missionIcon}>
            <Ionicons name={item.icon} size={24} color={theme.colors.primaryDark} />
          </View>

          <View style={style.cardTitleBox}>
            <Text style={style.titulo}>{item.titulo}</Text>
            <Text style={style.local}>{item.local}</Text>
          </View>

          {concluida && (
            <Ionicons name="checkmark-circle" size={24} color={theme.colors.primaryLight} />
          )}
        </View>

        <Text style={style.descricao}>{item.descricao}</Text>

        <View style={style.progressRow}>
          <Text style={style.progresso}>
            {item.progresso} de {item.total} ações
          </Text>
          <Text style={style.recompensa}>{item.recompensa} EcoPontos</Text>
        </View>

        <View style={style.barraContainer}>
          <View style={[style.barra, { width: `${itemProgress}%` }]} />
        </View>

        <TouchableOpacity
          style={[style.botao, concluida && style.botaoDesativado]}
          onPress={() => completarMissao(item.id)}
          disabled={concluida}
        >
          <Text style={style.botaoTexto}>
            {concluida ? "Concluída" : "Registrar progresso"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

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
              <View>
                <Text style={style.summaryTitle}>Seu impacto da semana</Text>
                <Text style={style.summaryText}>
                  Complete missões para ganhar pontos e criar hábitos sustentáveis.
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
