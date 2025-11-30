// src/components/ChatScreen.tsx
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  SafeAreaView,
} from "react-native";

import ChatBot from "../../utils/ChatBotSingleton";
import { chatObserver } from "../../utils/ChatObserver";
import ChatBubble from "../BalaoBatePapo";
import Message from "../../models/Message";
import User from "../../models/User";
import { scaleHeight } from "../../utils/responsive";

type Props = {
  currentUser: User;
};

export default function ChatScreen({ currentUser }: Props) {
  const [messages, setMessages] = useState<Message[]>(ChatBot.getInstance().getMessages());
  const [text, setText] = useState("");
  const flatRef = useRef<FlatList>(null);

  useEffect(() => {
    const cb = (ms: Message[]) => {
      setMessages(ms);
      setTimeout(() => flatRef.current?.scrollToEnd?.({ animated: true }), 50);
    };

    chatObserver.subscribe(cb);
    return () => chatObserver.unsubscribe(cb);
  }, []);

  const send = () => {
    if (!text.trim()) return;
    ChatBot.getInstance().receiveMessage(currentUser, text.trim());
    setText("");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
        <View style={{ flex: 1
        }}>
          <FlatList
            ref={flatRef}
            data={messages}
            keyExtractor={(i) => i.id}
            renderItem={({ item }) => (
              <ChatBubble
                message={item}
                isBot={item.authorId === "bot" || item.authorId === "system"}
              />
            )}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingVertical: 12 }}
            onContentSizeChange={() =>
              flatRef.current?.scrollToEnd?.({ animated: true })
            }
          />

    
          <View style={styles.inputRow}>
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="Pergunte algo..."
              style={styles.input}
            />

            <TouchableOpacity onPress={send} style={styles.sendBtn}>
              <Text style={{ color: "#fff", fontWeight: "bold" }}>Enviar</Text>
            </TouchableOpacity>
          </View>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  inputRow: {
  
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    marginBottom:scaleHeight(40)
  },
  input: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
  },
  sendBtn: {
    marginLeft: 8,
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
});
