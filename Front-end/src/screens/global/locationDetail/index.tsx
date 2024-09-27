import BackBtn from "@components/BackBtn";
import Row from "@components/Row";
import Separator from "@components/Separator";
import TextDefault from "@components/TextDefault";
import MainLayout from "@layout/MainLayout";
import { useRoute } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { ActivityIndicator, Image, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { COLORS } from "src/constant";
import { useLoading } from "src/context/LoadingContext";
import { normalize } from "src/Helper";
import { navigate } from "src/nav/NavigationService";
import { APP_ROUTE } from "src/nav/route";
import useLocationDetail from "src/services/hooks/app/useLocationDetail";

export default function DetailLocationScreen() {
  const { startLoading, stopLoading } = useLoading();
  const [isExpand, setIsExpand] = useState(false);
  const [isViewerImg, setIsViewerImg] = useState(false);
  const { params } = useRoute();
  const { place } = params as {
    place: string;
  };

  const { data, isLoading } = useLocationDetail({ place });

  return (
    <MainLayout>
      <View
        style={{ position: "absolute", top: 50, left: 10, zIndex: 1000000 }}
      >
        <BackBtn />
      </View>
      <StatusBar style="dark" />
      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 10 }}>
        {isLoading && <ActivityIndicator size="large" color={COLORS.primary} />}
        <TouchableOpacity
          onPress={() =>
            navigate(APP_ROUTE.SHOW_IMG, {
              lstImg: data?.lstImgs,
            })
          }
        >
          <Row
            style={{
              height: 300,
              borderBottomEndRadius: 20,
              borderBottomStartRadius: 20,
              overflow: "hidden",
            }}
            full
          >
            <Image
              source={{
                uri: data?.lstImgs[0],
              }}
              style={{
                width: "100%",
                height: "100%",
              }}
            />
          </Row>
        </TouchableOpacity>
        <Row
          full
          start
          direction="column"
          rowGap={10}
          style={{
            padding: normalize(10),
          }}
        >
          <TextDefault bold size={22}>
            {data?.name}
          </TextDefault>
          <TextDefault>
            <TextDefault color="gray">History:</TextDefault> {data?.history}
          </TextDefault>
          <TextDefault>
            <TextDefault color="gray">Architecture:</TextDefault>{" "}
            {data?.architecture}
          </TextDefault>
          <TextDefault>
            <TextDefault color="gray">Culture:</TextDefault>{" "}
            {data?.culturalImportance}
          </TextDefault>
          <TextDefault>
            <TextDefault color="gray">Legend:</TextDefault> {data?.legend}
          </TextDefault>
          <TextDefault>
            <TextDefault color="gray">Address:</TextDefault> {data?.location}
          </TextDefault>
          <TextDefault color="gray">special:</TextDefault>
          <Row direction="column" start rowGap={5}>
            <TextDefault>
              {data?.special?.architecturalSignificance}
            </TextDefault>
            <TextDefault>{data?.special?.culturalSymbol}</TextDefault>
            <TextDefault>{data?.special?.historicalSignificance}</TextDefault>
          </Row>
          <TextDefault color="gray">Visit info:</TextDefault>
          <Row direction="column" start rowGap={5}>
            <TextDefault> {data?.visiting?.bestTimeToVisit}</TextDefault>
            <TextDefault> {data?.visiting?.expectCrowds}</TextDefault>
            <TextDefault> {data?.visiting?.mustSee}</TextDefault>
            <TextDefault> {data?.visiting?.respectfulVisiting}</TextDefault>
          </Row>
        </Row>
        <Separator height={20} />
        <Separator height={100} />
      </ScrollView>
    </MainLayout>
  );
}
