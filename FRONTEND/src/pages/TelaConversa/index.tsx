import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, Platform } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons'; 
import api from '../../config/api';

interface Conversa {
  contato_id: number;
  contato_nome: string;
  ultima_mensagem: string;
  horario: string;
  timestamp: number;
}

export default function TelaConversas() {
  const navigation = useNavigation<any>(); 
  const [conversas, setConversas] = useState<Conversa[]>([]);

  const puxarListaDeConversas = async () => {
    try {
      const response = await api.get('/chat/conversas');
      if (Array.isArray(response.data)) {
        const listaOrdenada = response.data.sort((a, b) => b.timestamp - a.timestamp);
        setConversas(listaOrdenada);
      }
    } catch (error) {
      console.log("Erro ao buscar conversas:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      puxarListaDeConversas();
      const timer = setInterval(puxarListaDeConversas, 4000);
      return () => clearInterval(timer);
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Força uma cor legal na barra de status do celular */}
      <StatusBar barStyle="light-content" backgroundColor="#005244" />
      
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.botaoHome} 
          onPress={() => navigation.navigate('TelaHome')}
        >
          <AntDesign name="home" size={24} color="#FFF" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Minhas Conversas</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Lista de Conversas */}
      <FlatList
        data={conversas}
        keyExtractor={(item) => String(item.contato_id)}
        contentContainerStyle={styles.listaContainer}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.itemConversa}
            onPress={() => navigation.navigate('TelaMensagens', { 
              contatoId: item.contato_id, 
              contatoNome: item.contato_nome 
            })}
          >
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={styles.nomeContato}>{item.contato_nome}</Text>
              <Text style={styles.ultimaMsg} numberOfLines={1}>{item.ultima_mensagem}</Text>
            </View>
            <Text style={styles.horarioMsg}>{item.horario}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Botão Flutuante */}
      <TouchableOpacity 
        style={styles.botaoFlutuante} 
        onPress={() => navigation.navigate('TelaAdicionarUsuario')}
      >
        <AntDesign name="user" size={26} color="#FFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFF',
    // Corrige o espaçamento do topo no Android de forma segura
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 
  },
  header: { 
    height: 60, 
    backgroundColor: '#005244', 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 16
  },
  botaoHome: { padding: 4 },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  listaContainer: {
    paddingTop: 10, // Substitui o 'top: 10' perigoso do item anterior
    paddingBottom: 100 // Espaço para a lista não ficar escondida atrás do botão flutuante
  },
  itemConversa: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    padding: 16, 
    borderBottomWidth: 1, 
    borderBottomColor: '#E0E0E0', 
    alignItems: 'center' 
  },
  nomeContato: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  ultimaMsg: { fontSize: 14, color: '#666', marginTop: 4 },
  horarioMsg: { fontSize: 12, color: '#999' },
  botaoFlutuante: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#00B89A',
    justifyContent: 'center',
    alignItems: 'center',
    right: 20,
    bottom: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  }
});