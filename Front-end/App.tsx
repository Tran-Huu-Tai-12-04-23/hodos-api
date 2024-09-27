import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "src/context/AuthContext";
import BottomSheetProvider from "src/context/BottomSheetContext";
import { LoadingProvider } from "src/context/LoadingContext";
import { ToastProvider } from "src/context/ToastContext";
import MainNavigation from "src/nav/navigator";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <LoadingProvider>
            <ToastProvider>
              <BottomSheetProvider>
                <AuthProvider>
                  <MainNavigation />
                </AuthProvider>
              </BottomSheetProvider>
            </ToastProvider>
          </LoadingProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
