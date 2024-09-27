import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity } from "react-native";
import { goBack } from "src/nav/NavigationService";

function BackBtn({ color }: { color?: string }) {
  return (
    <TouchableOpacity onPress={goBack} style={{}}>
      <AntDesign name="arrowleft" size={24} color={color} />
    </TouchableOpacity>
  );
}

export default BackBtn;
