import Row from "@components/Row";
import TextDefault from "@components/TextDefault";
import TopSheetCustom, {
  BottomSheetMethods,
} from "@components/ToastService/TopSheetCustom";
import ToastFailedIcon from "assets/svg/toast-failed-icon";
import ToastSuccessIcon from "assets/svg/toast-success-icon";
import ToastWarningIcon from "assets/svg/toast-warning-icon";
import React, { createContext, useContext, useRef, useState } from "react";
import { StyleSheet } from "react-native";

interface ToastContextValue {
  showToast: (
    message: string,
    type: "ERROR" | "SUCCESS" | "WARN",
    subTitle?: string
  ) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

interface PropsType {
  children: React.ReactNode;
}

export const ToastProvider = ({ children }: PropsType) => {
  const topSheetRef = useRef<BottomSheetMethods>(null);
  const [type, setType] = useState<"ERROR" | "SUCCESS" | "WARN">("WARN");
  const [message, setMessage] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = (
    msg: string,
    type: "ERROR" | "SUCCESS" | "WARN",
    subTitle = ""
  ) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      topSheetRef.current?.close();
    }

    setMessage(msg);
    setSubTitle(subTitle);
    setType(type);
    topSheetRef.current?.expand();

    timeoutRef.current = setTimeout(() => {
      topSheetRef.current?.close();
    }, 3000); // Hide toast after 3 seconds
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <TopSheetCustom ref={topSheetRef}>
        <Row start colGap={10} full style={{ alignItems: "center" }}>
          {type === "ERROR" && <ToastFailedIcon />}
          {type === "WARN" && <ToastWarningIcon />}
          {type === "SUCCESS" && <ToastSuccessIcon />}
          <Row
            direction="column"
            start
            rowGap={5}
            full
            style={[styles.toast, { width: "80%" }]}
          >
            <TextDefault bold color="white">
              {message}
            </TextDefault>
            {subTitle && <TextDefault color="gray">{subTitle}</TextDefault>}
          </Row>
        </Row>
      </TopSheetCustom>
    </ToastContext.Provider>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  toast: {
    borderRadius: 5,
  },
  toastText: {
    color: "white",
  },
});
