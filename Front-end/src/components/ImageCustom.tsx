import React, { useState } from "react";
import { Image } from "react-native";

type PropsType = {
  link: string;
  style?: any;
};
const ImageCustom = ({ link, style }: PropsType) => {
  const [isLoading, setIsLoading] = useState(true);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  return (
    <>
      {/* {isLoading && Platform.OS !== "ios" ? (
        <Row full center style={[{ width: 250, height: 120 }]}>
          <ActivityIndicator color={COLORS.primary} />
        </Row>
      ) : (
        <Image
          style={{ width: 250, minHeight: 100, ...style }}
          source={{ uri: link }}
          resizeMode="cover"
          // onLoadEnd={handleImageLoad}
          // onLoad={handleImageLoad}
        />
      )} */}
      <Image
        style={{ width: 250, height: 100, ...style }}
        source={{ uri: link }}
        // onLoadEnd={handleImageLoad}
      />
    </>
  );
};

export default ImageCustom;
