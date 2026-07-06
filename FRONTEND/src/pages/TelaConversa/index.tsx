import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../routes";
import api from '../../config/api'; 

export const theme = {
  colors: {
    primaryLight: "#00B89A",
    primaryDark: "#005244",
    background: "#FFFFFF",
    textLight: "#F0F0F0",
    textDark: "#000000",
    button: "#0984E3",
  },
};

interface Conversa {
  contato_id: number;
  contato_nome: string;
  ultima_mensagem: string;
  horario: string;
}

export default function ConversasScreen() {
  const [conversas, setConversas] = useState<Conversa[]>([]);
  // Usando o hook para garantir a estabilidade da rota
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    api.get("/chat/conversas")
      .then(res => setConversas(res.data))
      .catch(err => console.error("Erro ao buscar conversas:", err));
  }, []);

  const renderItem = ({ item }: { item: Conversa }) => (
    <TouchableOpacity 
      style={styles.conversaCard}
      // Navegando para o Chat Ativo mapeado no seu Routes.tsx
      onPress={() => navigation.navigate('TelaMensagens', { 
        contatoId: item.contato_id, 
        contatoNome: item.contato_nome 
      })}
    >
      <View style={styles.infoContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.nomeText}>{item.contato_nome}</Text>
          <Text style={styles.tempoText}>{item.horario}</Text>
        </View>
        <Text numberOfLines={1} style={styles.ultimaMensagemText}>
          {item.ultima_mensagem}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mensagens</Text>
      </View>
      <FlatList
        data={conversas}
        keyExtractor={(item) => item.contato_id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: { backgroundColor: theme.colors.primaryDark, padding: 20, alignItems: 'center' },
  headerTitle: { color: theme.colors.textLight, fontSize: 20, fontWeight: 'bold' },
  listContainer: { paddingHorizontal: 16 },
  conversaCard: { paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#EBEBEB' },
  infoContainer: { flex: 1 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  nomeText: { fontSize: 16, fontWeight: '600', color: theme.colors.textDark },
  tempoText: { fontSize: 12, color: '#888' },
  ultimaMensagemText: { fontSize: 14, color: '#666' },
});