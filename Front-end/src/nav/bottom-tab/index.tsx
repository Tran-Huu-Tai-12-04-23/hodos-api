import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { Platform } from "react-native";

import HomeScreen from "src/screens/app/HomeScreen";
import PersonalScreen from "src/screens/app/PersonalScreen";
import PredictImageScreen from "src/screens/app/PredictImage";
import ScheduleScreen from "src/screens/app/ScheudleScreen";
import SearchScreen from "src/screens/app/SearchScreen";
import { BOTTOM_TAB_ROUTE } from "../route";
import CustomBottomBar from "./CustomTabBar";

const { Navigator, Screen } = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Navigator
      screenOptions={{
        tabBarStyle: {
          height: Platform.OS == "android" ? 60 : 80,
        },
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: false,
      }}
      initialRouteName={BOTTOM_TAB_ROUTE.HOME}
      tabBar={(props) => <CustomBottomBar {...props} />}
    >
      <Screen name={BOTTOM_TAB_ROUTE.HOME} component={HomeScreen} />
      <Screen name={BOTTOM_TAB_ROUTE.SEARCH} component={SearchScreen} />
      <Screen
        name={BOTTOM_TAB_ROUTE.PREDICT_IMG}
        component={PredictImageScreen}
      />
      <Screen name={BOTTOM_TAB_ROUTE.SCHEDULE} component={ScheduleScreen} />
      <Screen name={BOTTOM_TAB_ROUTE.PERSONAL} component={PersonalScreen} />
    </Navigator>
  );
};

export default BottomTabNavigator;
