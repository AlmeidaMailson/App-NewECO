import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { styles } from "./style";

interface Props {
    nome: string;
    avatar?: string;
    ultimaMensagem?: string;
    horario?: string;
    naoLidas?: number;
    onPress: () => void;
}

export default function ConversationCard({
    nome,
    avatar,
    ultimaMensagem,
    horario,
    naoLidas,
    onPress
}: Props) {

    return (

        <TouchableOpacity
            style={styles.container}
            onPress={onPress}
        >

            <Image

                source={{
                    uri:
                        avatar ||
                        "https://i.pravatar.cc/300"
                }}

                style={styles.avatar}

            />

            <View style={styles.center}>

                <Text style={styles.nome}>
                    {nome}
                </Text>

                <Text
                    numberOfLines={1}
                    style={styles.mensagem}
                >
                    {ultimaMensagem || "Nenhuma mensagem"}
                </Text>

            </View>

            <View style={styles.right}>

                <Text style={styles.horario}>
                    {horario}
                </Text>

                {naoLidas! > 0 && (

                    <View style={styles.badge}>

                        <Text style={styles.badgeText}>
                            {naoLidas}
                        </Text>

                    </View>

                )}

            </View>

        </TouchableOpacity>

    );

}