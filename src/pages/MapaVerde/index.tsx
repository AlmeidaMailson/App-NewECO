import React, { use, useEffect, useState } from "react";
import {
  Text,
  View,
  ScrollView,
  Button,
  TouchableOpacity,
  Modal,
  FlatList,
} from "react-native";
import { style } from "./style";
import ScreenInfo from "../../components/ScreenInfo";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../global/themes";
import { scaleFont, scaleHeight } from "../../utils/responsive";
import FeedScreen from "../../components/feedCard";
import { Feather } from "@expo/vector-icons";
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Picker } from "@react-native-picker/picker";
import Publicar from "../Publicar";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../routes";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import TroqueDoe from "../TroqueDoe";
import UserSession from "../../utils/UserSessions";
import { feedObserver } from "../../utils/FeedObserver";
import { Video } from "expo-av";
import FloatingButton from "../../components/FloatingButton";

type NavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  "TelaHome"
>;
export default function Mapaverde(){
    return(
        <View>
            
        </View>

    );
}