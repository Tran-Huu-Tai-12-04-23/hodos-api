import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import Ionicons from "@expo/vector-icons/Ionicons";
import LocationIcon from "assets/svg/location-icon";
import NotfoundIcon from "assets/svg/not-found-icon";
import React, { useState } from "react";
import { Modal, Platform, View } from "react-native";
import { useBottomSheet } from "src/context/BottomSheetContext";
import { useLoading } from "src/context/LoadingContext";
import { normalize } from "src/Helper";
import UseTakePictureHelper from "src/Helper/SelectPictureHelper";
import LocationItem from "src/screens/app/HomeScreen/Tab/LocationItem";
import usePredictFood from "src/services/hooks/app/usePerdictFood";
import usePredictLocation from "src/services/hooks/app/usePerdictLocation";
import { ButtonOutlined, ButtonPrimary, IconButton } from "./Button";
import Row from "./Row";
import Separator from "./Separator";
import TextDefault from "./TextDefault";

function PredictOptions() {
  const { hideBottomSheet } = useBottomSheet();
  const [type, setType] = useState<string>("");
  const [result, setResult] = useState<any>(null);
  const { onPredict: onPredictFood } = usePredictFood();
  const { onPredict: onPredictLocation } = usePredictLocation();
  const { startLoading, stopLoading } = useLoading();

  const { onPressCamera, onPressTakePicture } = UseTakePictureHelper();

  const handlePredict = async (urlImg: string) => {
    startLoading();
    try {
      if (type === "location") {
        await onPredictLocation({ imgUrl: urlImg }).then((res) => {
          setResult(res?.data);
        });
      } else
        await onPredictFood({ imgUrl: urlImg }).then((res) => {
          setResult(res?.data);
        });

      stopLoading();
      setType("");
    } catch (error) {
      stopLoading();
      setType("");
    }
  };

  return (
    <Row
      direction="column"
      center
      style={{
        padding: normalize(10),
      }}
    >
      {type && (
        <>
          <>
            <ButtonOutlined
              iconLeft={<Entypo name="images" size={24} color="black" />}
              minWidth={"100%"}
              title="Choose image from gallery"
              onPress={async () => {
                const urlImg = await onPressTakePicture();
                if (urlImg) {
                  await handlePredict(urlImg);
                }
              }}
            />
            <ButtonPrimary
              iconLeft={<Entypo name="camera" size={24} color="white" />}
              minWidth={"100%"}
              title="Take new picture from camera"
              onPress={async () => {
                const urlImg = await onPressCamera();
                if (urlImg) {
                  await handlePredict(urlImg);
                }
              }}
            />
          </>
        </>
      )}
      {!type && (
        <>
          <ButtonOutlined
            iconLeft={<LocationIcon color="black" />}
            minWidth={"100%"}
            title="Predict location base Img"
            onPress={function (): void {
              setType("location");
            }}
          />
          <ButtonPrimary
            iconLeft={
              <Ionicons name="fast-food-sharp" size={24} color="white" />
            }
            minWidth={"100%"}
            title="Predict food base Img"
            onPress={function (): void {
              setType("food");
            }}
          />
        </>
      )}

      {result && (
        <Modal animationType="slide" style={{ padding: normalize(10) }}>
          {Platform.OS === "ios" && <Separator height={40} />}
          <View style={{ padding: normalize(10) }}>
            <View
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                zIndex: 100000,
              }}
            >
              <IconButton
                icon={<AntDesign name="close" size={24} color="red" />}
                onPress={() => {
                  hideBottomSheet();
                  setResult(null);
                  setType("");
                }}
              />
            </View>
            <TextDefault bold size={normalize(18)}>
              Result for images
            </TextDefault>
            {result.length === 0 && (
              <Row full center direction="column" rowGap={10}>
                <NotfoundIcon />
                <TextDefault>Not found any result</TextDefault>
              </Row>
            )}
            {result?.map((item: any, index: number) => (
              <LocationItem key={index} data={item} />
            ))}
          </View>
        </Modal>
      )}
    </Row>
  );
}

export default PredictOptions;
