import Separator from "@components/Separator";
import TextDefault from "@components/TextDefault";
import MainLayout from "@layout/MainLayout";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { ScrollView } from "react-native-gesture-handler";
import { normalize } from "src/Helper";

function PredictImageScreen() {
  return (
    <MainLayout>
      <StatusBar style="dark" />
      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        <Separator height={normalize(40)} />
        <Separator height={20} />
        <TextDefault>PredictImageScreen</TextDefault>
      </ScrollView>
    </MainLayout>
  );
}

export default PredictImageScreen;
