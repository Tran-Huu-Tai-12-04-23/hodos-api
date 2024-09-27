import HomeIcon from "assets/svg/home-icon";
import PersonalIcon from "assets/svg/personal-icon";
import SearchIcon from "assets/svg/search-icon";

import { BlurView } from "expo-blur";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { normalize } from "src/Helper";
import { BOTTOM_TAB_ROUTE } from "../route";

import PredictOptions from "@components/PredictOption";
import MapIcon from "assets/svg/map-icon";
import ScanLocationIcon from "assets/svg/scan-location";
import { StyleSheet } from "react-native";
import { useBottomSheet } from "src/context/BottomSheetContext";

function CustomBottomBar({ state, descriptors, navigation }: any) {
  const bottomBarRoutes = [
    {
      name: BOTTOM_TAB_ROUTE.HOME,
      key: BOTTOM_TAB_ROUTE.HOME,
      iconDefault: <HomeIcon />,
      iconActive: <HomeIcon color="white" />,
    },
    {
      name: BOTTOM_TAB_ROUTE.SEARCH,
      key: BOTTOM_TAB_ROUTE.SEARCH,
      iconDefault: <SearchIcon />,
      iconActive: <SearchIcon color="white" />,
    },
    {
      name: BOTTOM_TAB_ROUTE.PREDICT_IMG,
      key: BOTTOM_TAB_ROUTE.PREDICT_IMG,
      iconDefault: <ScanLocationIcon color={"black"} />,
      iconActive: <ScanLocationIcon color={"black"} />,
    },
    {
      name: BOTTOM_TAB_ROUTE.SCHEDULE,
      key: BOTTOM_TAB_ROUTE.SCHEDULE,
      iconDefault: <MapIcon color="gray" />,
      iconActive: <MapIcon color="white" />,
    },
    {
      name: BOTTOM_TAB_ROUTE.PERSONAL,
      key: BOTTOM_TAB_ROUTE.PERSONAL,
      iconDefault: <PersonalIcon />,
      iconActive: <PersonalIcon color="white" />,
    },
  ];

  const { openBottomSheet } = useBottomSheet();

  return (
    <BlurView
      intensity={40}
      tint="dark"
      style={[
        {
          position: "absolute",
          bottom: 0,
          zIndex: 100,
          backgroundColor: "black",
          left: 0,
          right: 0,
        },
      ]}
    >
      <View style={[styles.container]}>
        {bottomBarRoutes.map((route, index) => {
          const options = descriptors[state.routes[index]?.key]?.options;
          const isFocused = state.index === index;
          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: state.routes[index]?.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: state.routes[index]?.key,
            });
          };

          const handlePredictImg = () => {
            openBottomSheet({
              snapPoints: [normalize(150)],
              content: <PredictOptions />,
            });
          };

          return (
            <TouchableOpacity
              key={route.name}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={
                route.key === BOTTOM_TAB_ROUTE.PREDICT_IMG
                  ? handlePredictImg
                  : onPress
              }
              onLongPress={
                route.key === BOTTOM_TAB_ROUTE.PREDICT_IMG
                  ? handlePredictImg
                  : onLongPress
              }
              style={
                route.key === BOTTOM_TAB_ROUTE.PREDICT_IMG
                  ? styles.predictButton
                  : styles.tab
              }
            >
              {isFocused ? route.iconActive : route.iconDefault}
            </TouchableOpacity>
          );
        })}
      </View>
    </BlurView>
  );
}

export default CustomBottomBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: normalize(10),
    paddingBottom: normalize(20),
    backgroundColor: "transparent",
    justifyContent: "space-between",
  },
  tab: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    width: "18%",
  },
  predictButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: normalize(1000),
    height: normalize(55),
    width: normalize(55),
  },
});
