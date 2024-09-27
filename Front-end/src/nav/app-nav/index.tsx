import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import DetailLocationScreen from "src/screens/global/locationDetail";
import PerformImageLocation from "src/screens/global/showImgs";
import AuthNavigator from "../auth-nav";
import BottomTabNavigator from "../bottom-tab";
import { config } from "../config";
import { APP_ROUTE } from "../route";

const { Navigator, Screen } = createStackNavigator();

const AppNavigator = () => {
  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        ...config,
      }}
      initialRouteName="AUTH"
    >
      <Screen name={"AUTH"} component={AuthNavigator} />
      <Screen name={"BOTTOM_TAB"} component={BottomTabNavigator} />
      <Screen
        name={APP_ROUTE.LOCATION_DETAIL}
        component={DetailLocationScreen}
      />
      <Screen name={APP_ROUTE.SHOW_IMG} component={PerformImageLocation} />
    </Navigator>
  );
};

export default AppNavigator;
