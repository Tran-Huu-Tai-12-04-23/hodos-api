import React, { useRef } from "react";
import { Image, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import PagerView from "react-native-pager-view";

type PropType = {
  images: string[];
  onPressImage: () => void;
};
function SlideImage({ images = [], onPressImage }: PropType) {
  const slide = useRef<PagerView | null>(null);
  return (
    <PagerView
      ref={slide}
      style={{ flex: 1, height: "100%", width: "100%", backgroundColor: "red" }}
    >
      {images &&
        images.map((img, index) => (
          <View
            style={[
              {
                backgroundColor: "red",
              },
            ]}
            key={index}
          >
            <TouchableOpacity onPress={onPressImage}>
              <Image
                source={{
                  uri: "https://cms.imgworlds.com/assets/a5366382-0c26-4726-9873-45d69d24f819.jpg?key=home-gallery",
                }}
                style={{
                  width: 200,
                  height: 100,
                  backgroundColor: "red",
                }}
              />
            </TouchableOpacity>
          </View>
        ))}
    </PagerView>
  );
}

export default SlideImage;
