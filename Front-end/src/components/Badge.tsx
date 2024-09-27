import React from "react";
import { View } from "react-native";
import TextDefault from "./TextDefault";

import { StyleSheet } from "react-native";
import { COLORS } from "src/constant";

function Badge({
  number,
  children,
}: {
  number: number;
  children: React.ReactNode;
}) {
  return (
    <View>
      {children}
      <View style={styles.badge}>
        <TextDefault color="white">{number}</TextDefault>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  badge: {
    backgroundColor: COLORS.danger,
    borderRadius: 100,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    right: 0,
    top: 0,
  },
});

export default Badge;
