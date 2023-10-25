import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";

const EmojiPicker = ({ onEmojiSelect }) => {
  const emojis = ["😀", "😍", "👍", "🙌", "👏"]; // Define your list of emojis

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        width: "90%",
        marginLeft: RFPercentage(1.5),
        marginBottom: RFPercentage(1),
      }}
    >
      {emojis.map((emoji, index) => (
        <TouchableOpacity key={index} onPress={() => onEmojiSelect(emoji)}>
          <Text style={{ fontSize: RFPercentage(3) }}>{emoji}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default EmojiPicker;
