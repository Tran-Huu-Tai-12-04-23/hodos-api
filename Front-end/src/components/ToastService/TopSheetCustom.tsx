import { BlurView } from "expo-blur";
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
} from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { deviceWidth, normalize } from "src/Helper";

type Props = {
  children: React.ReactNode;
};

export interface BottomSheetMethods {
  expand: () => void;
  close: () => void;
}

// eslint-disable-next-line react/display-name
const TopSheetCustom = forwardRef<BottomSheetMethods, Props>(
  ({ children }, ref) => {
    const insets = useSafeAreaInsets();
    const { width, height } = useWindowDimensions();
    const [topSheetHeight, setTopSheetHeight] = useState(1000);
    const OPEN = 0;
    const CLOSE = -topSheetHeight - insets.top;
    const translateY = useSharedValue(CLOSE);

    const expand = useCallback(() => {
      translateY.value = withTiming(OPEN);
    }, [translateY]);

    const close = useCallback(() => {
      translateY.value = withTiming(CLOSE);
    }, [CLOSE, translateY]);

    useImperativeHandle(
      ref,
      () => ({
        expand,
        close,
      }),
      [expand, close]
    );

    const animationStyle = useAnimatedStyle(() => {
      return {
        transform: [{ translateY: translateY.value }],
      };
    });

    const pan = Gesture.Pan()
      .onUpdate((event) => {
        if (event.translationY > 0) {
          translateY.value = withSpring(OPEN, {
            damping: 200,
            stiffness: 800,
          });
        } else {
          translateY.value = withSpring(event.translationY, {
            damping: 100,
            stiffness: 400,
          });
        }
      })
      .onEnd(() => {
        if (translateY.value < -50) {
          translateY.value = withSpring(CLOSE, {
            damping: 100,
            stiffness: 400,
          });
        } else {
          translateY.value = withSpring(OPEN, {
            damping: 100,
            stiffness: 400,
          });
        }
      });

    return (
      <>
        <GestureDetector gesture={pan}>
          <Animated.View
            style={[
              styles.container,
              {
                width: width * 0.92,
                top: insets.top,
              },
              animationStyle,
            ]}
            onLayout={({ nativeEvent }) => {
              const { height } = nativeEvent.layout;
              if (height) {
                setTopSheetHeight(height);
                translateY.value = withTiming(-height - insets.top);
              }
            }}
          >
            <View
              style={{
                borderRadius: normalize(12),
                overflow: "hidden",
              }}
            >
              <BlurView
                intensity={40}
                experimentalBlurMethod="dimezisBlurView"
                tint="dark"
                style={{
                  width: deviceWidth - normalize(20),
                  padding: normalize(10),
                  borderRadius: normalize(5),
                }}
              >
                {children}
              </BlurView>
            </View>
          </Animated.View>
        </GestureDetector>
      </>
    );
  }
);

export default TopSheetCustom;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  line: {
    position: "absolute",
    bottom: 8,
    width: 40,
    height: 4,
    borderRadius: 8,
  },
  textTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 40,
    marginBottom: 14,
  },
  text: {
    fontSize: 16,
    fontWeight: "500",
  },
});
