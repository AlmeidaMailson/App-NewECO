import React, { useEffect, useState } from "react";
import { View, Text, Dimensions, PixelRatio, StyleSheet } from "react-native";

export default function ScreenInfo() {
  const [screen, setScreen] = useState(() => Dimensions.get("window"));

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setScreen(window);
    });

    return () => subscription?.remove?.();
  }, []);

  const scale = PixelRatio.get();
  const widthPx = Math.round(screen.width * scale);
  const heightPx = Math.round(screen.height * scale);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Informações da Tela</Text>
      <Text style={styles.text}>Largura (dp): {Math.round(screen.width)}</Text>
      <Text style={styles.text}>Altura (dp): {Math.round(screen.height)}</Text>
      <Text style={styles.text}>Pixel Ratio: {scale}</Text>
      <Text style={styles.text}>
        Largura (px): {widthPx} | Altura (px): {heightPx}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0D1117",
    padding: 20,
  },
  title: {
    fontSize: 20,
    color: "#00B89A",
    marginBottom: 20,
    fontWeight: "bold",
  },
  text: {
    fontSize: 16,
    color: "#E1E1E1",
    marginBottom: 8,
  },
});
