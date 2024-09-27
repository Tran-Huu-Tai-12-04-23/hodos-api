import { ExpoConfig } from "@expo/config";
import dotenv from "dotenv";

dotenv.config();

const envs = {
  EXPO_PUBLIC_APP_VARIANT: "production",
  EXPO_PUBLIC_APP_NAME: "Hodos-Hackaton",
  EXPO_PUBLIC_BUNDLE_ID: "com.hodos.hackaton",
  EXPO_PUBLIC_API: "https://hodos-hackaton.genny.id.vn",
};

const { EXPO_PUBLIC_APP_VARIANT, EXPO_PUBLIC_APP_NAME, EXPO_PUBLIC_BUNDLE_ID } =
  envs;

if (EXPO_PUBLIC_BUNDLE_ID == null) {
  throw new Error("EXPO_PUBLIC_BUNDLE_ID is not defined");
}

if (EXPO_PUBLIC_APP_NAME == null) {
  throw new Error("EXPO_PUBLIC_APP_NAME is not defined");
}

if (EXPO_PUBLIC_APP_VARIANT == null) {
  throw new Error("EXPO_PUBLIC_APP_VARIANT is not defined");
}

export default (): ExpoConfig => ({
  orientation: "portrait",
  userInterfaceStyle: "automatic",
  name: EXPO_PUBLIC_APP_NAME,
  slug: "hodos-hackaton",
  version: "1.0.0",
  icon: "./assets/icon.png",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "cover",
    backgroundColor: "#ffffff",
  },
  assetBundlePatterns: ["**/*"],
  web: {
    favicon: "./assets/favicon.png",
  },
  owner: "huutaidev",
  extra: {
    eas: {
      projectId: "6e46b7fa-ba54-40f2-93bd-513827e3687e",
    },
  },
  runtimeVersion: "1.0.0",
  updates: {
    enabled: true,
    fallbackToCacheTimeout: 60_000,
    checkAutomatically: "ON_LOAD",
    url: "https://u.expo.dev/6e46b7fa-ba54-40f2-93bd-513827e3687e",
  },
  ios: {
    bundleIdentifier: EXPO_PUBLIC_BUNDLE_ID,
    buildNumber: "1",
    infoPlist: {
      VietMapAPIBaseURL: "https://maps.vietmap.vn/api/navigations/route/",
      VietMapAccessToken: "9cbf0bc15d3901b7e043d8f76be8d73f370a82fe629a2d46",
      VietMapURL:
        "https://maps.vietmap.vn/api/maps/light/styles.json?apikey=9cbf0bc15d3901b7e043d8f76be8d73f370a82fe629a2d46",
      CFBundleAllowMixedLocalizations: true,
      NSLocationAlwaysAndWhenInUseUsageDescription:
        "Your request location description",
      NSLocationAlwaysUsageDescription: "Your request location description",
      NSLocationWhenInUseUsageDescription: "Your request location description",
      NSCameraUsageDescription: "Your request camera description",
    },
    config: {
      usesNonExemptEncryption: false,
      googleMapsApiKey: "AIzaSyACFEyucHfjhPUl88GCY1spvYuHi8lNEUA",
    },
  },
  android: {
    versionCode: 1,
    package: EXPO_PUBLIC_BUNDLE_ID,
    userInterfaceStyle: "automatic",
    config: {
      googleMaps: {
        apiKey: "AIzaSyACFEyucHfjhPUl88GCY1spvYuHi8lNEUA",
      },
    },
  },
  plugins: [
    [
      "expo-image-picker",
      {
        photosPermission:
          "The app accesses your photos to let you share them with your friends.",
      },
    ],
    [
      "expo-build-properties",
      {
        android: {
          usesCleartextTraffic: true, // ? enable HTTP requests
        },
        ios: {
          infoPlist: {
            NSAppTransportSecurity: { NSAllowsArbitraryLoads: true },
          },
          useFrameworks: "static",
        },
      },
    ],
  ],
});
