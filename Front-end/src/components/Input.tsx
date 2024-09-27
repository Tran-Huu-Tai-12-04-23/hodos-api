import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { normalize } from "src/Helper";
import Row from "./Row";
import TextDefault from "./TextDefault";

type InputProps = {
  onChangeText: (text: string) => void;
  text: string;
  label?: string;
  placeholder?: string;
  leftIcon?: React.ReactNode;
};
const Input = ({
  onChangeText,
  text,
  label,
  placeholder,
  leftIcon,
}: InputProps) => {
  const [isFocus, setIsFocus] = useState(false);
  return (
    <Row
      full
      direction="column"
      start
      rowGap={5}
      style={[
        styles.border,
        {
          borderColor: isFocus ? "black" : "transparent",
        },
      ]}
    >
      {label && (
        <TextDefault style={[styles.label, { color: "black" }]}>
          {label}
        </TextDefault>
      )}

      <Row
        full
        start
        style={{
          alignItems: "center",
        }}
      >
        {leftIcon && leftIcon}
        <TextInput
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          autoCapitalize="none"
          keyboardType="default"
          placeholder={placeholder}
          placeholderTextColor={"#ccc"}
          style={[styles.input, { width: "100%" }]}
          onChangeText={onChangeText}
          value={text}
        />
      </Row>
    </Row>
  );
};

const InputPassword = ({
  onChangeText,
  text,
  label,
  placeholder,
  leftIcon,
}: InputProps) => {
  const [isPass, setIsPass] = useState(true);
  const [isFocus, setIsFocus] = useState(false);

  return (
    <Row
      full
      direction="column"
      start
      rowGap={5}
      style={[
        { position: "relative" },
        styles.border,
        {
          borderColor: isFocus ? "black" : "transparent",
        },
      ]}
    >
      {label && (
        <TextDefault style={[styles.label, { color: "#ccc" }]}>
          {label}
        </TextDefault>
      )}

      <Row
        full
        start
        style={{
          alignItems: "center",
        }}
      >
        {leftIcon && leftIcon}
        <TextInput
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          autoCapitalize="none"
          keyboardType="default"
          secureTextEntry={isPass}
          placeholder={placeholder}
          placeholderTextColor={"#ccc"}
          style={[styles.input, { width: "100%" }]}
          onChangeText={onChangeText}
          value={text}
        />
      </Row>

      <TouchableOpacity
        style={styles.iconShowPass}
        onPress={() => setIsPass(!isPass)}
      >
        <Feather
          name={!isPass ? "eye" : "eye-off"}
          size={normalize(20)}
          color={"gray"}
        />
      </TouchableOpacity>
    </Row>
  );
};

const styles = StyleSheet.create({
  input: {
    padding: 10,
    paddingVertical: 12,
    borderRadius: 5,
  },
  label: {
    fontSize: 12,
    fontWeight: "bold",
  },
  iconShowPass: {
    position: "absolute",
    right: 10,
    top: "50%",
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderStyle: "solid",
  },
  border: {
    padding: normalize(10),
    borderWidth: 1,
    borderStyle: "solid",
    backgroundColor: "white",
    borderRadius: normalize(10),
  },
});

export { Input, InputPassword };
