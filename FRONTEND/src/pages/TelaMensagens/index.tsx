import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, SafeAreaView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import UserSession from '../../utils/UserSessions';
import api from '../../config/api'; 

interface Mensagem {
  id: string;
  remetente_id: number;
  destinatario_id: number;
  conteudo: string;
  horario?: string;
}

export default function TelaMensagens() {
  const route = useRoute<any>();
  const navigation = useNavigation();

  const contatoId = route.params?.contatoId;
  const contatoNome = route.params?.contatoNome;

  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [inputText, setInputText] = useState('');
  const [meuId, setMeuId] = useState<number | null>(null);
  const [carregandoChat, setCarregandoChat] = useState(true);

  const puxarMensagensDoServidor = async () => {
    if (!contatoId) return;
    try {
      const response = await api.get(`/chat/historico/${contatoId}`);
      if (Array.isArray(response.data)) {
        setMensagens(response.data);
      }
    } catch (error) {
      console.log("Erro ao atualizar mensagens via GET:", error);
    }
  };

  useEffect(() => {
    if (!contatoId) return;

    async function inicializarChat() {
      try {
        const session = UserSession.getInstance() as any;
        await session.loadStoredSession();
        
        const meuUsuarioId = session.userData?.id;
        if (meuUsuarioId) {
          setMeuId(Number(meuUsuarioId));
        }

        await puxarMensagensDoServidor();
        setCarregandoChat(false);
      } catch (error) {
        console.error("Erro ao iniciar chat:", error);
        setCarregandoChat(false);
      }
    }

    inicializarChat();

    const intervalo = setInterval(() => {
      puxarMensagensDoServidor();
    }, 4000);

    return () => clearInterval(intervalo);
  }, [contatoId]);

  const enviarMensagem = async () => {
    if (!inputText.trim() || !meuId) return;

    const textoMensagem = inputText.trim();
    setInputText('');

    try {
      await api.post('/chat/enviar', {
        destinatario_id: contatoId,
        conteudo: textoMensagem
      });
      
      await puxarMensagensDoServidor();
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    }
  };

  if (carregandoChat || !contatoId || !contatoNome) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#005244" />
        <Text style={{ marginTop: 10, color: '#666' }}>Carregando conversa...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{contatoNome}</Text>
      </View>

      {/* Lista de Mensagens - Espaço vazio acima removido para evitar o crash */}
      <FlatList
        data={mensagens}
        keyExtractor={(item) => String(item.id)}
        inverted={true}
        renderItem={({ item }) => {
          const ehMinha = item.remetente_id === meuId;
          return (
            <View style={{ marginBottom: 12 }}>
              <View style={[styles.msgBalao, ehMinha ? styles.msgEnviada : styles.msgRecebida]}>
                <Text style={[styles.msgTexto, ehMinha ? { color: '#FFF' } : { color: '#000' }]}>
                  {item.conteudo}
                </Text>
              </View>
              <Text style={[
                { fontSize: 11, color: '#888', marginTop: 2 },
                ehMinha ? { alignSelf: 'flex-end', marginRight: 4 } : { alignSelf: 'flex-start', marginLeft: 4 }
              ]}>
                {item.horario || "00:00"}
              </Text>
            </View>
          );
        }}
        contentContainerStyle={{ padding: 16 }}
      />

      {/* Caixa de Entrada */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Digite sua mensagem..."
            placeholderTextColor="#888"
          />
          <TouchableOpacity style={styles.botaoEnviar} onPress={enviarMensagem}>
            <Text style={styles.enviarTexto}>➔</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {  flex: 1, backgroundColor: '#F5F5F5' },
  header: { height: 60, backgroundColor: '#005244', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16 },
  backText: { color: '#FFF', fontSize: 24, marginRight: 16 },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  msgBalao: { padding: 10, borderRadius: 12, marginBottom: 8, maxWidth: '80%' },
  msgEnviada: { backgroundColor: '#00B89A', alignSelf: 'flex-end', borderBottomRightRadius: 0 },
  msgRecebida: { backgroundColor: '#FFF', alignSelf: 'flex-start', borderBottomLeftRadius: 0, borderWidth: 1, borderColor: '#E0E0E0' },
  msgTexto: { fontSize: 16 },
  inputContainer: { flexDirection: 'row', padding: 8, backgroundColor: '#FFF', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#E0E0E0' },
  input: { flex: 1, height: 40, borderWidth: 1, borderColor: '#DDD', borderRadius: 20, paddingHorizontal: 16, color: '#000' },
  botaoEnviar: { marginLeft: 8, backgroundColor: '#0984E3', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  enviarTexto: { color: '#FFF', fontWeight: 'bold', fontSize: 18 }
});