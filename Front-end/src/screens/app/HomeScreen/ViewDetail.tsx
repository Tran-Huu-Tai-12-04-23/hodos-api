import Row from "@components/Row";
import TextDefault from "@components/TextDefault";
import React, { useRef, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import PagerView from "react-native-pager-view";
import { COLORS } from "src/constant";
import { deviceHeight, deviceWidth, normalize } from "src/Helper";
import FoodView from "./Tab/FoodView";
import LocationView from "./Tab/LocationView";

export interface ILocation {
  name: string;
  address: string;
  distance: string;
  lstImgs: string;
  price?: number;
  rangePrice?: any;
}

function ViewDetail() {
  const slideRef = useRef<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleChangeTab = (index: number) => {
    slideRef?.current?.setPage(index);
    setCurrentIndex(index);
  };
  return (
    <>
      <Row center colGap={10} full>
        <Row center colGap={5} style={styles.wrapperTabHeader}>
          <TouchableOpacity
            onPress={() => {
              handleChangeTab(0);
            }}
            style={[
              styles.buttonTab,
              {
                backgroundColor:
                  currentIndex === 0 ? COLORS.primary : "transparent",
              },
            ]}
          >
            <TextDefault
              color={currentIndex === 0 ? "white" : "black"}
              center
              bold
              size={normalize(12)}
            >
              Location
            </TextDefault>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              handleChangeTab(1);
            }}
            style={[
              styles.buttonTab,
              {
                backgroundColor:
                  currentIndex === 1 ? COLORS.primary : "transparent",
              },
            ]}
          >
            <TextDefault
              color={currentIndex === 1 ? "white" : "black"}
              center
              bold
              size={normalize(12)}
            >
              Food
            </TextDefault>
          </TouchableOpacity>
        </Row>
      </Row>
      <PagerView
        scrollEnabled={false}
        onPageSelected={(e) => setCurrentIndex(e.nativeEvent.position)}
        ref={slideRef}
        style={styles.pagerView}
        initialPage={currentIndex}
      >
        <View style={styles.page} key="1">
          <LocationView />
        </View>
        <View style={styles.page} key="2">
          <FoodView />
        </View>
      </PagerView>
    </>
  );
}

const styles = StyleSheet.create({
  buttonTab: {
    padding: normalize(10),
    borderRadius: normalize(10),
    minWidth: deviceWidth / 2.5,
  },
  container: {
    backgroundColor: "white",
    minHeight: deviceHeight / 2,
    transform: [{ translateY: -normalize(50) }],
    padding: normalize(10),
    flex: 1,
  },
  pagerView: {
    flex: 1,
  },
  page: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  wrapperTabHeader: {
    padding: normalize(5),
    marginVertical: normalize(10),
    backgroundColor: COLORS.bgSecond,
    borderRadius: normalize(10),
  },
});

export default ViewDetail;
