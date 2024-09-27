import Avatar from "@components/Avatar";
import Badge from "@components/Badge";
import { IconButton } from "@components/Button";
import Row from "@components/Row";
import TextDefault from "@components/TextDefault";
import { IMG } from "assets/img";
import BellIcon from "assets/svg/bell-icon";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { COLORS } from "src/constant";
import { normalize } from "src/Helper";
import { styleGlobal } from "src/styles";
function Header() {
  return (
    <Row style={[styleGlobal.centerAlign, style.container]} full between>
      <UserInfo />

      <IconButton
        size={normalize(45)}
        icon={
          <Badge number={2}>
            <BellIcon size={normalize(30)} />
          </Badge>
        }
        onPress={function (): void {}}
      />
    </Row>
  );
}

const UserInfo = () => {
  return (
    <TouchableOpacity>
      <Row
        center
        colGap={10}
        style={{
          padding: normalize(5),
          backgroundColor: COLORS.bgSecond,
          borderRadius: normalize(1000),
          paddingHorizontal: normalize(20),
        }}
      >
        <Avatar source={IMG().introIcon} />

        <Row direction="column" start rowGap={2}>
          <TextDefault color="gray">Welcome back!</TextDefault>
          <TextDefault color="white" bold>
            Robert S. Flores
          </TextDefault>
        </Row>
      </Row>
    </TouchableOpacity>
  );
};
const style = StyleSheet.create({
  container: {
    padding: normalize(10),
    backgroundColor: COLORS.primary,
  },
});

export default Header;
