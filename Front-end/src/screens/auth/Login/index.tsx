import BackBtn from "@components/BackBtn";
import BackgroundImage from "@components/BackgroundImage";
import { ButtonPrimary, Input, InputPassword } from "@components/index";
import Row from "@components/Row";
import Separator from "@components/Separator";
import TextDefault from "@components/TextDefault";
import MainLayout from "@layout/MainLayout";
import { IMG } from "assets/img";
import EmailIcon from "assets/svg/email-icon";
import LockIcon from "assets/svg/lock-icon";
import React, { useState } from "react";
import { Image, ScrollView } from "react-native";
import { useLoading } from "src/context/LoadingContext";
import { useToast } from "src/context/ToastContext";
import { deviceHeight, normalize } from "src/Helper";
import { navigate, replace } from "src/nav/NavigationService";
import { AUTH_ROUTE_KEY, BOTTOM_TAB_ROUTE } from "src/nav/route";
import useLogin from "src/services/hooks/auth/useLogin";
import { styleGlobal } from "src/styles";

interface LoginBody {
  username: string;
  password: string;
}
export default function LoginScreen() {
  const { showToast } = useToast();
  const { onLogin } = useLogin();
  const { startLoading, stopLoading } = useLoading();
  const [userInput, setUserInput] = useState<LoginBody>({
    username: "",
    password: "",
  });
  const handleSubmit = async () => {
    if (userInput.username === "" || userInput.password === "") {
      showToast("Please fill all fields", "ERROR");
      return;
    }

    // Call login API
    startLoading();

    await onLogin({
      username: userInput.username,
      password: userInput.password,
    })
      .then((res) => {
        stopLoading();
        if (res) {
          navigate("BOTTOM_TAB", {
            screen: BOTTOM_TAB_ROUTE.HOME,
          });
        }
      })
      .catch((err) => {
        stopLoading();
      });
  };

  const handleChangeInput = (key: string, value: string) => {
    setUserInput({
      ...userInput,
      [key]: value,
    });
  };

  return (
    <MainLayout>
      <BackgroundImage>
        <Image source={IMG().autBackground} style={styleGlobal.background} />
      </BackgroundImage>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ flex: 1, minHeight: deviceHeight }}
      >
        <Separator height={normalize(40)} />
        <Row
          full
          direction="column"
          style={{ flex: 1, paddingHorizontal: 20 }}
          rowGap={10}
          start
        >
          <BackBtn />
          <Separator height={normalize(10)} />
          <TextDefault center bold style={{ fontSize: normalize(20) }}>
            Sign In to recharge Direct
          </TextDefault>

          <Separator height={normalize(10)} />
          <Row
            full
            direction="column"
            start
            rowGap={20}
            style={{ marginTop: 10 }}
          >
            <Input
              leftIcon={<EmailIcon />}
              placeholder={"Username"}
              onChangeText={(txt) => handleChangeInput("username", txt)}
              text={userInput.username}
            />
            <InputPassword
              leftIcon={<LockIcon size={normalize(20)} />}
              placeholder={"Password"}
              onChangeText={(txt) => handleChangeInput("password", txt)}
              text={userInput.password}
            />

            <ButtonPrimary
              full
              onPress={async () => await handleSubmit()}
              title={"Sign In"}
              isLoading={false}
            />
          </Row>

          <Row
            center
            full
            colGap={10}
            style={{
              marginTop: "auto",
            }}
          >
            <TextDefault style={{ color: "gray" }}>
              Don't have an account?
            </TextDefault>
            <TextDefault
              bold
              style={{ color: "gray" }}
              onPress={() => {
                replace(AUTH_ROUTE_KEY.REGISTER);
              }}
            >
              Register
            </TextDefault>
          </Row>
        </Row>
      </ScrollView>
    </MainLayout>
  );
}
