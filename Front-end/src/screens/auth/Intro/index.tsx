import BackgroundImage from "@components/BackgroundImage";
import { ButtonLink, ButtonPrimary, ButtonSecond } from "@components/Button";
import Row from "@components/Row";
import Separator from "@components/Separator";
import MainLayout from "@layout/MainLayout";
import { IMG } from "assets/img";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Image, ScrollView } from "react-native";
import { deviceHeight, deviceWidth, normalize } from "src/Helper";
import { navigate } from "src/nav/NavigationService";
import { AUTH_ROUTE_KEY, BOTTOM_TAB_ROUTE } from "src/nav/route";
import { styleGlobal } from "src/styles";

export default function IntroScreen() {
  return (
    <MainLayout>
      <BackgroundImage>
        <Image
          source={IMG().introBackgroundIcon}
          style={styleGlobal.background}
        />
      </BackgroundImage>
      <StatusBar style="dark" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ flex: 1, minHeight: deviceHeight }}
      >
        <Separator height={normalize(40)} />

        <Row center full>
          <Image
            source={IMG().introIcon}
            style={{
              width: deviceWidth,
              height: deviceWidth,
              objectFit: "contain",
            }}
          />
        </Row>

        <Separator height={normalize(deviceHeight / 5)} />

        <Row center colGap={normalize(20)} full>
          <ButtonPrimary
            title="Sign In"
            onPress={() => navigate(AUTH_ROUTE_KEY.LOGIN)}
          />
          <ButtonSecond
            title="Register"
            onPress={() => navigate(AUTH_ROUTE_KEY.REGISTER)}
          />
        </Row>

        <Separator height={normalize(20)} />

        <Row center full>
          <ButtonLink
            title="Skip>>"
            onPress={() =>
              navigate("BOTTOM_TAB", {
                screen: BOTTOM_TAB_ROUTE.HOME,
              })
            }
          />
        </Row>
      </ScrollView>
    </MainLayout>
  );
}
