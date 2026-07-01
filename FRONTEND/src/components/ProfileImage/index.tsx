import React, { useState } from "react";
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { theme } from "../../global/themes";

interface ProfileImageProps {
  imageUri?: string;
  onImageSelected: (uri: string) => void;
}

export default function ProfileImage({
  imageUri,
  onImageSelected,
}: ProfileImageProps) {
  const [localImage, setLocalImage] = useState<string | null>(
    imageUri ?? null
  );

  async function pickImageFromGallery() {
    const { status } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permissão necessária",
        "Precisamos da permissão para acessar suas fotos."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
  mediaTypes: ["images"],
  allowsEditing: true,
  aspect: [1, 1],
  quality: 0.9,
});

    if (!result.canceled) {
      const uri = result.assets[0].uri;

      setLocalImage(uri);

      onImageSelected(uri);
    }
  }

  async function takePhoto() {
    const { status } =
      await ImagePicker.requestCameraPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permissão necessária",
        "Precisamos da permissão para usar a câmera."
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
  mediaTypes: ["images"],
  allowsEditing: true,
  aspect: [1, 1],
  quality: 0.9,
});

    if (!result.canceled) {
      const uri = result.assets[0].uri;

      setLocalImage(uri);

      onImageSelected(uri);
    }
  }

  return (
    <View style={styles.container}>
      <Image
        source={
          localImage
            ? { uri: localImage }
            : require("../../assets/LogoPerfil.png")
        }
        style={styles.avatar}
      />

      <View style={styles.row}>
        <Text style={styles.text}>Clique em </Text>

        <TouchableOpacity onPress={pickImageFromGallery}>
          <Text style={styles.linkText}>Adicionar Foto</Text>
        </TouchableOpacity>

        {/* <Text style={styles.text}> ou </Text>

        <TouchableOpacity onPress={takePhoto}>
          <Text style={styles.linkText}>Tirar Foto</Text>
        </TouchableOpacity> */}

        <Text style={styles.text}> para adicionar uma nova foto.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginTop: 10,
  },

  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#e1e1e1",
  },

  row: {
    alignItems: "center",
    gap: 2,
  },

  text: {
    color: theme.colors.primaryDark,
  },

  linkText: {
    color: theme.colors.primaryLight,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});