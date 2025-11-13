import React from "react";
import { TouchableOpacity, Text, StyleSheet, GestureResponderEvent,} from "react-native";
import { theme } from "../../global/themes";


export type BotaoProps = {
  title: React.ReactNode;
  onPress?: (event: GestureResponderEvent) => void;
  disabled?: boolean;
};
export default function Botao({ title, onPress }:BotaoProps) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.colors.button,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    width: "55%",
    alignSelf: "center",
   
  },
  text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
