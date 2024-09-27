import React, { FC, ReactNode } from "react";
import {
  Text as RNText,
  TextProps as RNTextProps,
  StyleSheet,
} from "react-native";
import { COLORS } from "src/constant";
import { normalize } from "src/Helper";
import { styleGlobal } from "src/styles";

interface Props extends RNTextProps {
  children: ReactNode;
  bold?: boolean;
  center?: boolean;
  numberOfLine?: number;
  size?: number;
  color?: string;
}

const TextDefault: FC<Props> = ({
  children,
  style,
  bold,
  size = normalize(12),
  color = COLORS.primary,
  ...rest
}) => {
  return (
    <RNText
      numberOfLines={rest.numberOfLine}
      style={[
        styleGlobal.text,
        bold && styleText.bold,
        rest.center && styleText.center,
        {
          fontFamily: "Roboto",
          fontSize: size,
          color: color,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </RNText>
  );
};

export const Title: FC<Props> = ({ children, style, bold, ...rest }) => {
  return (
    <RNText
      numberOfLines={rest.numberOfLines}
      style={[
        styleText.title,

        bold && styleText.bold,
        rest.center && styleText.center,
        style,
        {
          fontFamily: "Roboto",
        },
      ]}
      {...rest}
    >
      {children}
    </RNText>
  );
};

const styleText = StyleSheet.create({
  center: { textAlign: "center" },
  bold: {
    fontWeight: "bold",
  },
  title: {
    fontSize: normalize(18),
    fontWeight: "bold",
  },
});
export default TextDefault;
