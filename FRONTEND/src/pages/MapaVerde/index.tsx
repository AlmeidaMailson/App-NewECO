import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../routes";
import { theme } from "../../global/themes";
import { style } from "./style";

type NavigationProps = NativeStackNavigationProp<RootStackParamList, "MapaVerde">;

// 🟢 Tipagem batendo certinho com o que o seu back-end em FastAPI devolve
interface PontoEcologico {
  id: number;
  nome: string;
  tipo: string;
  descricao: string;
  latitude: number;
  longitude: number;
  recompensa: number;
  ativo: boolean;
}

export default function Mapaverde() {
  const navigation = useNavigation<NavigationProps>();
  
  // Estados para gerenciar os dados da API
  const [pontos, setPontos] = useState<PontoEcologico[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // 🟢 Busca os 70 pontos reais direto do seu back-end
  useEffect(() => {
    const buscarPontosDoBanco = async () => {
      try {
        // Altere o IP abaixo para o IP da sua máquina (evite usar localhost no emulador android)
        const response = await fetch("http://10.0.2.2:8000/mapa-verde/pontos");
        const dados = await response.json();
        
        setPontos(dados);
        if (dados.length > 0) {
          setSelectedId(dados[0].id); // Seleciona o primeiro ponto por padrão
        }
      } catch (error) {
        console.error("Erro ao carregar pontos do mapa verde:", error);
      } finally {
        setLoading(false);
      }
    };

    buscarPontosDoBanco();
  }, []);

  // Encontra o ponto selecionado dinamicamente
  const selectedPoint = pontos.find((p) => p.id === selectedId) ?? pontos[0];

  // Tela de carregamento enquanto a API responde
  if (loading) {
    return (
      <View style={[style.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={theme.colors.primaryDark} />
        <Text style={{ marginTop: 10, color: theme.colors.primaryDark }}>Carregando pontos de Brasília...</Text>
      </View>
    );
  }

  return (
    <View style={style.container}>
      <MapView
        style={style.map}
        //  Centralizado estrategicamente no centro de Brasília
        initialRegion={{
          latitude: -15.793889,
          longitude: -47.882778,
          latitudeDelta: 0.25, // Zoom um pouco mais aberto para ver os 70 pontos espalhados
          longitudeDelta: 0.25,
        }}
      >
        {/* Renderiza dinamicamente os 70 pontos do banco no mapa */}
        {pontos.map((point) => (
          <Marker
            key={point.id.toString()}
            coordinate={{
              latitude: Number(point.latitude),  // Força conversão caso venha string do banco
              longitude: Number(point.longitude),
            }}
            title={point.nome}
            description={point.tipo}
            pinColor={theme.colors.primaryLight}
            onPress={() => setSelectedId(point.id)}
          />
        ))}
      </MapView>

      <View style={style.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={style.iconButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.primaryDark} />
        </TouchableOpacity>
        <View>
          <Text style={style.headerTitle}>Mapa Verde</Text>
          <Text style={style.headerSubtitle}>Pontos sustentáveis perto de você</Text>
        </View>
      </View>

      {/* Exibe o card do ponto clicado na tela */}
      {selectedPoint && (
        <View style={style.bottomPanel}>
          <View style={style.selectedCard}>
            <View style={style.selectedIcon}>
              <Ionicons name="leaf" size={24} color="#fff" />
            </View>

            <View style={style.selectedTextBox}>
              <Text style={style.selectedTitle} numberOfLines={1}>{selectedPoint.nome}</Text>
              <Text style={style.selectedMeta}>
                {selectedPoint.tipo}
              </Text>
              <Text style={style.reward}>{selectedPoint.recompensa} EcoPontos</Text>
            </View>

            <TouchableOpacity
              style={style.missionButton}
              onPress={() => navigation.navigate("TelaMissoes")}
            >
              <Text style={style.missionButtonText}>Missões</Text>
            </TouchableOpacity>
          </View>

          {/* Lista Horizontal de Chips com os tipos de pontos encontrados */}
          <FlatList
            horizontal
            data={pontos}
            keyExtractor={(item) => item.id.toString()}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={style.pointList}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[style.pointChip, selectedId === item.id && style.pointChipActive]}
                onPress={() => setSelectedId(item.id)}
              >
                <Text
                  style={[
                    style.pointChipText,
                    selectedId === item.id && style.pointChipTextActive,
                  ]}
                >
                  {item.tipo}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
}