import Row from "@components/Row";
import Separator from "@components/Separator";
import TextDefault from "@components/TextDefault";
import MainLayout from "@layout/MainLayout";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, View } from "react-native";
import { normalize } from "src/Helper";
import Header from "./Header";
import ViewDetail from "./ViewDetail";

function HomeScreen() {
  return (
    <MainLayout>
      <StatusBar style="light" />

      <View style={[styles.headerView, { height: normalize(40) }]} />
      <Row full start direction="column" style={[styles.headerView]}>
        <Header />
        <TextDefault
          color="white"
          bold
          size={normalize(22)}
          style={{
            paddingHorizontal: normalize(10),
            maxWidth: normalize(300),
          }}
        >
          Do you need a tour guide for trip?
        </TextDefault>
        <Separator height={normalize(20)} />
        {/* <UserLocationPin /> */}
      </Row>

      <ViewDetail />
    </MainLayout>
  );
}
const styles = StyleSheet.create({
  headerView: {
    backgroundColor: "#1D1F24",
  },
});

export default HomeScreen;
