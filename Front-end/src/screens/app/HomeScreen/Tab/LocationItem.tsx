import Row from "@components/Row";
import TextDefault from "@components/TextDefault";
import React from "react";
import { Image, TouchableOpacity } from "react-native";
import { useBottomSheet } from "src/context/BottomSheetContext";
import { useToast } from "src/context/ToastContext";
import { normalize } from "src/Helper";
import { navigate } from "src/nav/NavigationService";
import { APP_ROUTE } from "src/nav/route";
import { styleGlobal } from "src/styles";
import { ILocation } from "../ViewDetail";

function LocationItem({ data }: { data: ILocation }) {
  const { hideBottomSheet } = useBottomSheet();
  const { showToast } = useToast();
  return (
    <TouchableOpacity
      onPress={() => {
        hideBottomSheet();
        navigate(APP_ROUTE.LOCATION_DETAIL, { place: data.name });
      }}
      style={{ width: "100%" }}
    >
      <Row
        direction="row"
        start
        colGap={10}
        full
        style={[
          styleGlobal.shadow,
          {
            backgroundColor: "white",
            padding: normalize(5),
            borderRadius: normalize(10),
          },
        ]}
      >
        <Image
          style={{
            height: normalize(80),
            width: normalize(100),
            borderRadius: normalize(10),
          }}
          source={{ uri: data?.lstImgs?.split(",")[0] }}
        />
        <Row direction="column" start rowGap={5} style={{ maxWidth: "60%" }}>
          <TextDefault bold size={normalize(16)}>
            {data.name}
          </TextDefault>
          <TextDefault color="gray" numberOfLine={1}>
            {data.address}
          </TextDefault>

          <Row start colGap={10}>
            {data.distance && (
              <>
                <TextDefault bold style={{ color: "orange" }}>
                  {data.distance}
                </TextDefault>
                <TextDefault>/</TextDefault>
              </>
            )}

            {data?.rangePrice && (
              <TextDefault bold style={{ color: "orange" }}>
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(data?.rangePrice?.split(",")[0])}
                -
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(data?.rangePrice?.split(",")[1])}
              </TextDefault>
            )}
            {data?.price && (
              <TextDefault bold style={{ color: "orange" }}>
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(data?.price)}
              </TextDefault>
            )}
          </Row>
        </Row>
      </Row>
    </TouchableOpacity>
  );
}

export default LocationItem;
