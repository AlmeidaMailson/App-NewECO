import React, { useState } from "react";
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import LogoPerfil from "../../assets/LogoPerfil.png";
import * as ImagePicker from "expo-image-picker";
import { theme } from "../../global/themes";

export default function ProfileImage() {
  const [imageUri, setImageUri] = useState<string | null>(null);

  async function pickImageFromGallery() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permissão necessária",
        "Precisamos da permissão para acessar suas fotos."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.9,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  }

  async function takePhoto() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permissão necessária",
        "Precisamos da permissão para usar a câmera."
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.9,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  }

  return (
    <View style={styles.container}>
      <Image
        source={
          imageUri ? { uri: imageUri } : require("../../assets/LogoPerfil.png")
        }
        style={styles.avatar}
      />

      <View style={styles.row}>

        <Text style={{ color:theme.colors.textLight }}> Clique em </Text>
        <TouchableOpacity style={styles.link} onPress={pickImageFromGallery}>
          <Text style={styles.linkText}>Adicionar Foto</Text>
        </TouchableOpacity>
        <Text style={{ color:theme.colors.textLight }} >ou</Text>
        <TouchableOpacity
          style={[styles.link, styles.camera]}
          onPress={takePhoto}
        >
          <Text style={styles.linkText}>Tirar Foto</Text>
        </TouchableOpacity>
        <Text style={{ color:theme.colors.textLight }}> Para Adicionaruma nova </Text>
        <Text style={{ color:theme.colors.textLight }}> foto de perfil.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection:'row',
    justifyContent:'center',
    gap:20,
    marginTop:10,
   

  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#e1e1e1",
  },
  link: {
  },
  row:{
    alignItems:"center",
     color:theme.colors.primaryLight,
     gap:0.5
  },
  camera: {

  },
  linkText: {
    color: "",
    textDecorationLine: "underline",
  },
});
