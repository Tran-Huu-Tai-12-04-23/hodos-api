import BackBtn from "@components/BackBtn";
import MainLayout from "@layout/MainLayout";
import { useRoute } from "@react-navigation/native";
import React from "react";
import { FlatList, Image, StyleSheet, View } from "react-native";
import { deviceHeight, deviceWidth } from "src/Helper";

function PerformImageLocation({}: any) {
  const { lstImg } = useRoute().params as {
    lstImg: string[];
  };

  const renderItem = ({ item }: { item: string }) => (
    <Image
      style={[styles.item, { height: deviceHeight / 3 }]}
      source={{ uri: item }}
    />
  );

  return (
    <MainLayout>
      <View
        style={{ position: "absolute", top: 50, left: 10, zIndex: 1000000 }}
      >
        <BackBtn />
      </View>
      <FlatList
        data={lstImg}
        numColumns={2}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.container}
      />
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 5,
  },
  item: {
    width: deviceWidth / 2 - 10,
    marginVertical: 5,
  },
});

export default PerformImageLocation;
