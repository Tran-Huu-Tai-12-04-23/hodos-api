import React from "react";
import { Keyboard, View } from "react-native";
import { styleGlobal } from "src/styles";

type PropsType = {
  children: React.ReactNode;
};
function MainLayout({ children }: PropsType) {
  return (
    <View
      onTouchStart={() => Keyboard.dismiss()}
      style={[styleGlobal.container, { backgroundColor: "white" }]}
    >
      {children}
    </View>
  );
}

export default MainLayout;
