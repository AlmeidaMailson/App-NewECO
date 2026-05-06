import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../routes";
import { theme } from "../../global/themes";
import { style } from "./style";

type NavigationProps = NativeStackNavigationProp<RootStackParamList, "MapaVerde">;

const greenPoints = [
  {
    id: "1",
    title: "Ecoponto Centro",
    type: "Reciclagem",
    distance: "1,2 km",
    reward: "50 EcoPontos",
    coordinate: {
      latitude: -23.5505,
      longitude: -46.6333,
    },
  },
  {
    id: "2",
    title: "Horta Comunitária Aurora",
    type: "Compostagem",
    distance: "2,4 km",
    reward: "35 EcoPontos",
    coordinate: {
      latitude: -23.5562,
      longitude: -46.6417,
    },
  },
  {
    id: "3",
    title: "Coleta de Óleo Usado",
    type: "Descarte correto",
    distance: "3,1 km",
    reward: "40 EcoPontos",
    coordinate: {
      latitude: -23.5443,
      longitude: -46.625,
    },
  },
];

export default function Mapaverde() {
  const navigation = useNavigation<NavigationProps>();
  const [selectedId, setSelectedId] = useState(greenPoints[0].id);
  const selectedPoint = greenPoints.find((point) => point.id === selectedId) ?? greenPoints[0];

  return (
    <View style={style.container}>
      <MapView
        style={style.map}
        initialRegion={{
          latitude: -23.5505,
          longitude: -46.6333,
          latitudeDelta: 0.035,
          longitudeDelta: 0.025,
        }}
      >
        {greenPoints.map((point) => (
          <Marker
            key={point.id}
            coordinate={point.coordinate}
            title={point.title}
            description={point.type}
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

      <View style={style.bottomPanel}>
        <View style={style.selectedCard}>
          <View style={style.selectedIcon}>
            <Ionicons name="leaf" size={24} color="#fff" />
          </View>

          <View style={style.selectedTextBox}>
            <Text style={style.selectedTitle}>{selectedPoint.title}</Text>
            <Text style={style.selectedMeta}>
              {selectedPoint.type} • {selectedPoint.distance}
            </Text>
            <Text style={style.reward}>{selectedPoint.reward}</Text>
          </View>

          <TouchableOpacity
            style={style.missionButton}
            onPress={() => navigation.navigate("TelaMissoes")}
          >
            <Text style={style.missionButtonText}>Missões</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          horizontal
          data={greenPoints}
          keyExtractor={(item) => item.id}
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
                {item.type}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
}
