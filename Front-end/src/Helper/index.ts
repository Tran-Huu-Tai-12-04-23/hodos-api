import * as SecureStore from "expo-secure-store";
import { Dimensions, PixelRatio, Platform, StatusBar } from "react-native";
import { ACCESS_TOKEN, USER_LOGIN } from "./keys";

export function isIphoneX() {
  const dim = Dimensions.get("window");
  return (
    Platform.OS === "ios" &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    (dim.height === 780 ||
      dim.width === 780 ||
      dim.height === 812 || //iphone X, 12 mini, iphone 11 pro,
      dim.width === 812 ||
      dim.height === 844 || //12 pro
      dim.width === 844 ||
      dim.height === 896 || //iphone 11 pro max
      dim.width === 896 ||
      dim.height === 926 || //iphone 12 pro max
      dim.width === 926 ||
      dim.height === 932 || //iphone 14 pro max
      dim.width === 430)
  );
}
const { width, height } = Dimensions.get("window");

export const deviceWidth = width;
export const deviceHeight = height;
export function ifIphoneX(iphoneXStyle, regularStyle) {
  if (isIphoneX()) {
    return iphoneXStyle;
  }
  return regularStyle;
}

export function getStatusBarHeight(safe) {
  return Platform.select({
    ios: ifIphoneX(safe ? 44 : 35, 20),
    android: StatusBar.currentHeight,
    default: 0,
  });
}

export function getBottomSpace() {
  return isIphoneX() ? 34 : 0;
}

export const widthPercentageToDP = (widthPercent) => {
  const elemWidth =
    typeof widthPercent === "number" ? widthPercent : parseFloat(widthPercent);
  return PixelRatio.roundToNearestPixel((deviceWidth * elemWidth) / 100);
};

export function getCurrentMonth() {
  const date = new Date();
  const currentMonth = date.getMonth() + 1; // Tháng trong JavaScript bắt đầu từ 0
  return currentMonth;
}

export function getMonth() {
  return new Date();
}

export function isDateInCurrentMonth(dateString) {
  // Tạo đối tượng ngày từ chuỗi ngày
  const date = new Date(dateString);

  // Lấy ngày, tháng, và năm từ đối tượng ngày
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();

  // Lấy ngày hiện tại
  const currentDate = new Date();

  // So sánh ngày và tháng của ngày được cung cấp với ngày hiện tại
  return (
    day === currentDate.getDate() &&
    month === currentDate.getMonth() &&
    year === currentDate.getFullYear()
  );
}

export const isIOS = Platform.OS === "ios";

export const normalize = (fontSize: number, standardScreenHeight = 680) => {
  const standardLength =
    deviceWidth > deviceHeight ? deviceWidth : deviceHeight;
  const offset =
    deviceWidth > deviceHeight
      ? 0
      : Platform.OS === "ios"
      ? 78
      : StatusBar.currentHeight;
  const dvHeight =
    isIphoneX() || Platform.OS === "android"
      ? standardLength - (offset || 0)
      : standardLength;
  const heightPercent = (fontSize * dvHeight) / standardScreenHeight;
  return Math.round(heightPercent);
};

const AuthenticationHelper = {
  saveToken: async (value: string) => {
    await SecureStore.setItemAsync(ACCESS_TOKEN, value);
  },
  saveUserLoginData: async (value: { username: string; password: string }) => {
    await SecureStore.setItemAsync(USER_LOGIN, JSON.stringify(value));
  },
  getUserLoginData: async () => {
    return await SecureStore.getItemAsync(USER_LOGIN);
  },
  getToken: async () => {
    let result = await SecureStore.getItemAsync(ACCESS_TOKEN);
    return result;
  },
  clearDataLogin: async () => {
    await SecureStore.deleteItemAsync(ACCESS_TOKEN);
    await SecureStore.deleteItemAsync(USER_LOGIN);
  },
};

export default AuthenticationHelper;

export const getImageHeight = () => {
  const minHeight = 200;
  const maxHeight = 300;
  return Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;
};
