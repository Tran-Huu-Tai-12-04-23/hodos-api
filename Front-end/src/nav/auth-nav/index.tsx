import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import IntroScreen from "src/screens/auth/Intro";
import LoginScreen from "src/screens/auth/Login";
import RegisterScreen from "src/screens/auth/Register";
import { config } from "../config";
import { AUTH_ROUTE_KEY } from "../route";
const { Navigator, Screen } = createStackNavigator();

const AuthNavigator = () => {
  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        ...config,
      }}
    >
      <Screen name={AUTH_ROUTE_KEY.INTRO} component={IntroScreen} />
      <Screen name={AUTH_ROUTE_KEY.LOGIN} component={LoginScreen} />
      <Screen name={AUTH_ROUTE_KEY.REGISTER} component={RegisterScreen} />
    </Navigator>
  );
};

export default AuthNavigator;
