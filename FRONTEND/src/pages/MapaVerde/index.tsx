import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../routes";
import { theme } from "../../global/themes";
import { style } from "./style";
import api from "../../config/api";

type NavigationProps = NativeStackNavigationProp<RootStackParamList, "MapaVerde">;

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

const PointChip = React.memo(({ 
  item, 
  isSelected, 
  onPress 
}: { 
  item: PontoEcologico; 
  isSelected: boolean; 
  onPress: (item: PontoEcologico, index: number) => void;
  index: number;
}) => (
  <TouchableOpacity
    style={[style.pointChip, isSelected && style.pointChipActive]}
    onPress={() => onPress(item, item.id)}
  >
    <Text style={[style.pointChipText, isSelected && style.pointChipTextActive]}>
      {item.tipo}
    </Text>
  </TouchableOpacity>
));

export default function Mapaverde() {
  const navigation = useNavigation<NavigationProps>();
  
  const mapRef = useRef<MapView>(null);
  const flatListRef = useRef<FlatList>(null);

  const [pontos, setPontos] = useState<PontoEcologico[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    const buscarPontosDoBanco = async () => {
      try {
        const response = await api.get("/mapa-verde/pontos");
        const dados = response.data;
        
        if (dados && dados.length > 0) {
          setPontos(dados);
          setSelectedId(dados[0].id);
        }
      } catch (error: any) {
        console.error("Erro ao carregar pontos:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    buscarPontosDoBanco();
  }, []);

  const selectedPoint = useMemo(() => {
    if (!selectedId) return pontos[0] || null;
    return pontos.find((p) => p.id === selectedId) ?? pontos[0] ?? null;
  }, [pontos, selectedId]);

  const handleSelectPoint = useCallback((point: PontoEcologico, index: number) => {
    setSelectedId(point.id);

    mapRef.current?.animateToRegion({
      latitude: Number(point.latitude),
      longitude: Number(point.longitude),
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }, 400);

    if (index !== -1) {
      flatListRef.current?.scrollToIndex({
        index,
        animated: true,
        viewPosition: 0.5
      });
    }
  }, []);

  if (loading) {
    return (
      <View style={[style.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={theme.colors.primaryDark} />
        <Text style={{ marginTop: 10, color: theme.colors.primaryDark }}>
          Carregando pontos de Brasília...
        </Text>
      </View>
    );
  }

  return (
    // Forçando flex: 1 no container principal para não esmagar o mapa
    <View style={[style.container, { flex: 1 }]}>
      
      <MapView
        ref={mapRef}
        // O truque tá aqui: Forçamos o mapa a preencher absolutamente todo o container de fundo
        style={[style.map, StyleSheet.absoluteFillObject]}
        initialRegion={{
          latitude: -15.793889,
          longitude: -47.882778,
          latitudeDelta: 0.25,
          longitudeDelta: 0.25,
        }}
      >
        {pontos.map((point) => {
          const isSelected = point.id === selectedId;
          return (
            <Marker
              key={point.id.toString()}
              coordinate={{
                latitude: Number(point.latitude),
                longitude: Number(point.longitude),
              }}
              title={point.nome}
              description={point.tipo}
              tracksViewChanges={false} 
              pinColor={isSelected ? theme.colors.primaryDark : theme.colors.primaryLight}
              onPress={() => {
                const idx = pontos.findIndex((p) => p.id === point.id);
                handleSelectPoint(point, idx);
              }}
            />
          );
        })}
      </MapView>

      {/* HEADER - Agora garantindo que ele fique por CIMA do mapa */}
      <View style={[style.header, { position: 'absolute', top: 40, left: 0, right: 0, zIndex: 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={style.iconButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.primaryDark} />
        </TouchableOpacity>
        <View>
          <Text style={style.headerTitle}>Mapa Verde</Text>
          <Text style={style.headerSubtitle}>Pontos sustentáveis perto de você</Text>
        </View>
      </View>

      {/* PAINEL INFERIOR - Também flutuando por cima do mapa na base da tela */}
      {selectedPoint && (
        <View style={[style.bottomPanel, { position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10 }]}>
          <View style={style.selectedCard}>
            <View style={style.selectedIcon}>
              <Ionicons name="leaf" size={24} color="#fff" />
            </View>

            <View style={style.selectedTextBox}>
              <Text style={style.selectedTitle} numberOfLines={1}>
                {selectedPoint.nome}
              </Text>
              <Text style={style.selectedMeta}>{selectedPoint.tipo}</Text>
              <Text style={style.reward}>{selectedPoint.recompensa} EcoPontos</Text>
            </View>

            <TouchableOpacity
              style={style.missionButton}
              onPress={() => navigation.navigate("TelaMissoes")}
            >
              <Text style={style.missionButtonText}>Missões</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            ref={flatListRef}
            horizontal
            data={pontos}
            keyExtractor={(item) => item.id.toString()}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={style.pointList}
            onScrollToIndexFailed={(info) => {
              flatListRef.current?.scrollToIndex({ index: info.index, animated: false });
            }}
            renderItem={({ item, index }) => (
              <PointChip
                item={item}
                index={index}
                isSelected={selectedId === item.id}
                onPress={() => handleSelectPoint(item, index)}
              />
            )}
          />
        </View>
      )}
    </View>
  );
}