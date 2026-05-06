import React from "react";
import { TouchableOpacity, StyleSheet, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  onPress: () => void;
  style?: ViewStyle;
}

export default function FloatingButton({ onPress, style }: Props) {
  return (
    <TouchableOpacity
      style={[styles.button, style]}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <Ionicons name="chatbubble-ellipses" size={26} color="#fff" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    bottom: 30,
    right: 25,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
});
