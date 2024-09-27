import React from "react";
import { ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native";
import { COLORS } from "src/constant";
import { normalize } from "src/Helper";
import { styleGlobal } from "src/styles";
import TextDefault from "./TextDefault";

interface ButtonPrimaryProps {
  round?: number;
  onPress: () => void;
  title?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  isLoading?: boolean;
  minWidth?: number | "100%";
  disabled?: boolean;
  full?: boolean;
  borderColor?: string;
  textColor?: string;
}
interface IconButtonProps extends ButtonPrimaryProps {
  icon: React.ReactNode;
  size?: number;
}

const ButtonPrimary = ({
  full,
  round = 100,
  onPress,
  isLoading,
  title,
  iconLeft,
  iconRight,
  minWidth = 100,
  disabled = false,
}: ButtonPrimaryProps) => {
  return (
    <TouchableOpacity
      onPress={isLoading ? () => {} : onPress}
      disabled={disabled || isLoading}
      style={[
        style.btn,
        {
          backgroundColor: "black",
          minWidth: minWidth,
          borderRadius: round,
        },
        disabled && style.disabled,
        full && { width: "100%" },
      ]}
    >
      {isLoading && <ActivityIndicator color={"white"} />}
      {!isLoading && iconLeft && iconLeft}
      {title && (
        <TextDefault style={[{ color: "white", fontWeight: 600 }, style.txt]}>
          {title}
        </TextDefault>
      )}
      {!isLoading && iconRight && iconRight}
    </TouchableOpacity>
  );
};

const ButtonOutlined = ({
  full,
  round = 100,
  onPress,
  isLoading,
  title,
  iconLeft,
  iconRight,
  minWidth = 100,
  disabled = false,
  borderColor = "",
}: ButtonPrimaryProps) => {
  return (
    <TouchableOpacity
      onPress={isLoading ? () => {} : onPress}
      disabled={disabled || isLoading}
      style={[
        style.btn,
        styleGlobal.shadow,
        {
          backgroundColor: "transparent",
          minWidth: minWidth,
          borderRadius: round,
          borderWidth: 1,
          borderColor: "#000",
          borderStyle: "solid",
        },
        disabled && style.disabled,
        full && { width: "100%" },
      ]}
    >
      {isLoading && <ActivityIndicator color={"#000"} />}
      {!isLoading && iconLeft && iconLeft}
      {title && (
        <TextDefault
          style={[
            {
              color: borderColor ? borderColor : "#000",
              fontWeight: 600,
            },
            style.txt,
          ]}
        >
          {title}
        </TextDefault>
      )}
      {!isLoading && iconRight && iconRight}
    </TouchableOpacity>
  );
};

const ButtonSecond = ({
  round = 100,
  onPress,
  isLoading,
  title,
  iconLeft,
  iconRight,
  minWidth = 100,
  disabled = false,
  textColor,
}: ButtonPrimaryProps) => {
  return (
    <TouchableOpacity
      onPress={isLoading ? () => {} : onPress}
      disabled={disabled}
      style={[
        style.btn,
        {
          backgroundColor: "white",
          minWidth: minWidth,
          borderRadius: round,
        },
        disabled && style.disabled,
      ]}
    >
      {isLoading && <ActivityIndicator color={"black"} />}
      {!isLoading && iconLeft && iconLeft}
      {title && (
        <TextDefault style={[{ color: "black", fontWeight: 600 }, style.txt]}>
          {title}
        </TextDefault>
      )}
      {!isLoading && iconRight && iconRight}
    </TouchableOpacity>
  );
};

const ButtonLink = ({
  round = 100,
  onPress,
  title,
  minWidth = 100,
  disabled = false,
}: ButtonPrimaryProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        {
          minWidth: minWidth,
          borderRadius: round,
        },
        disabled && style.disabled,
      ]}
    >
      <TextDefault
        center
        style={[{ color: "black", fontSize: normalize(12), fontWeight: "600" }]}
      >
        {title}
      </TextDefault>
    </TouchableOpacity>
  );
};

const IconButton = ({
  round = 100,
  onPress,
  isLoading,
  iconLeft,
  iconRight,
  disabled = false,
  icon,
  size = normalize(40),
}: IconButtonProps) => {
  return (
    <TouchableOpacity
      onPress={isLoading ? () => {} : onPress}
      disabled={disabled}
      style={[
        styleGlobal.centerChild,
        {
          backgroundColor: COLORS.bgSecond,
          borderRadius: round,
          width: size,
          height: size,
        },
        disabled && style.disabled,
        disabled && style.disabled,
      ]}
    >
      {isLoading && <ActivityIndicator color={"black"} />}
      {!isLoading && iconLeft && iconLeft}
      {icon && icon}
      {!isLoading && iconRight && iconRight}
    </TouchableOpacity>
  );
};

const style = StyleSheet.create({
  btn: {
    padding: normalize(15),
    paddingVertical: 12,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    flexDirection: "row",
    columnGap: 10,
    minHeight: normalize(42),
    minWidth: normalize(42),
  },
  disabled: {
    opacity: 0.5,
  },
  txt: {
    fontSize: normalize(14),
  },
});

export { ButtonLink, ButtonOutlined, ButtonPrimary, ButtonSecond, IconButton };
