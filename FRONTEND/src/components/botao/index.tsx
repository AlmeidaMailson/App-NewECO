import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  GestureResponderEvent,
} from "react-native";
import { theme } from "../../global/themes";

export type BotaoProps = {
  title: React.ReactNode;
  onPress?: (event: GestureResponderEvent) => void;
  disabled?: boolean;
};

export default function Botao({ title, onPress, disabled }: BotaoProps) {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
    >
      {typeof title === "string" ? <Text style={styles.text}>{title}</Text> : title}
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
  disabled: {
    opacity: 0.6,
  },
  text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
