import React, { useState } from "react";
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { style } from "./style";

export default function TelaMissoes() {

  const [missoes, setMissoes] = useState<any[]>([
    {
      id: 1,
      titulo: "Reciclar em ponto próximo",
      progresso: 0,
      total: 1,
      recompensa: 50,
      local: "Ponto de reciclagem"
    },
    {
      id: 2,
      titulo: "Usar transporte sustentável",
      progresso: 0,
      total: 3,
      recompensa: 100,
      local: "Zona urbana"
    },
  ]);

  const validarLocalizacao = async () => {
    // 🔥 depois você integra com GPS real
    return true; // simulação
  };

  const completarMissao = async (id: any) => {

    const permitido = await validarLocalizacao();

    if (!permitido) {
      Alert.alert("Erro", "Você precisa estar no local correto 📍");
      return;
    }

    const novas = missoes.map((missao: any) => {
      if (missao.id === id && missao.progresso < missao.total) {

        const novoProgresso = missao.progresso + 1;

        // 🎁 recompensa
        if (novoProgresso === missao.total) {
          Alert.alert(
            "Missão concluída 🌱",
            `Você ganhou ${missao.recompensa} EcoPontos!`
          );
        }

        return { ...missao, progresso: novoProgresso };
      }
      return missao;
    });

    setMissoes(novas);
  };

  const renderItem = ({ item }: any) => {
    const concluida = item.progresso >= item.total;

    return (
      <View style={style.card}>

        <Text style={style.titulo}>{item.titulo}</Text>

        <Text style={style.local}>📍 {item.local}</Text>

        <Text style={style.progresso}>
          {item.progresso} / {item.total}
        </Text>

        <View style={style.barraContainer}>
          <View
            style={[
              style.barra,
              { width: `${(item.progresso / item.total) * 100}%` }
            ]}
          />
        </View>

        <Text style={style.recompensa}>
          🎁 {item.recompensa} EcoPontos
        </Text>

        <TouchableOpacity
          style={[
            style.botao,
            concluida && style.botaoDesativado
          ]}
          onPress={() => completarMissao(item.id)}
          disabled={concluida}
        >
          <Text style={style.botaoTexto}>
            {concluida ? "Concluída" : "Validar ação"}
          </Text>
        </TouchableOpacity>

      </View>
    );
  };

  return (
    <View style={style.container}>
      <Text style={style.tituloTela}>🌱 Missões NewEco</Text>

      <FlatList
        data={missoes}
        keyExtractor={(item: any) => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
}