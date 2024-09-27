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
import useRegister from "src/services/hooks/auth/useRegister";
import { styleGlobal } from "src/styles";

interface RegisterBody {
  username: string;
  password: string;
  confirmPassword: string;
}
export default function RegisterScreen() {
  const { showToast } = useToast();
  const { onRegister } = useRegister();
  const { startLoading, stopLoading } = useLoading();
  const [userInput, setUserInput] = useState<RegisterBody>({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const handleSubmit = async () => {
    if (userInput.username === "" || userInput.password === "") {
      showToast("Please fill all fields", "ERROR");
      return;
    }

    if (userInput.password !== userInput.confirmPassword) {
      showToast("Password and confirm password do not match", "ERROR");
      return;
    }

    // Call login API
    startLoading();

    await onRegister({
      username: userInput.username,
      password: userInput.password,
      confirmPassword: userInput.confirmPassword,
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
            Sign Up to travel assistant
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
            <InputPassword
              leftIcon={<LockIcon size={normalize(20)} />}
              placeholder={"Confirm password"}
              onChangeText={(txt) => handleChangeInput("confirmPassword", txt)}
              text={userInput.confirmPassword}
            />

            <ButtonPrimary
              full
              onPress={handleSubmit}
              title={"Sign Up"}
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
              You have an account?
            </TextDefault>
            <TextDefault
              bold
              style={{ color: "gray" }}
              onPress={() => {
                replace(AUTH_ROUTE_KEY.LOGIN);
              }}
            >
              Sign In
            </TextDefault>
          </Row>
        </Row>
      </ScrollView>
    </MainLayout>
  );
}
