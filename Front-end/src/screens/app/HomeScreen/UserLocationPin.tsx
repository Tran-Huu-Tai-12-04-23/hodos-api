import React from "react";
import { StyleSheet, View } from "react-native";
import MapView from "react-native-maps";
import { deviceWidth, normalize } from "src/Helper";

export default function UserLocationPin() {
  return (
    <View style={styles.container}>
      <MapView style={styles.map} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: deviceWidth / 2,
    width: "100%",
    paddingHorizontal: normalize(10),
    zIndex: 10000,
    paddingBottom: normalize(10),
  },
  map: {
    width: "100%",
    height: "100%",
    borderRadius: normalize(20),
    overflow: "hidden",
  },
});
