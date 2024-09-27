import Row from "@components/Row";
import TextDefault from "@components/TextDefault";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { TouchableOpacity } from "react-native";
import { deviceWidth, normalize } from "src/Helper";
import { styleGlobal } from "src/styles";

const category = [
  {
    name: "Location",
    icon: <Entypo name="location" size={35} color="gray" />,
    key: "LOCATION",
  },
  {
    name: "Food",
    icon: <Ionicons name="fast-food" size={35} color="gray" />,
    key: "FOOD",
  },
  {
    name: "More",
    icon: <FontAwesome name="map" size={35} color="gray" />,
    key: "MORE",
  },
];
function CategorySelect() {
  return (
    <Row direction="column" start full rowGap={10}>
      <TextDefault bold>Category</TextDefault>
      <Row full center colGap={normalize(20)}>
        {category.map((item) => (
          <TouchableOpacity
            key={item.key}
            style={{
              backgroundColor: "white",
              padding: normalize(10),
              borderRadius: normalize(10),
              justifyContent: "center",
              alignItems: "center",
              rowGap: normalize(10),
              width: deviceWidth / 4,
              ...styleGlobal.shadow,
            }}
          >
            {item?.icon}
            <TextDefault bold color="gray">
              {item.name}
            </TextDefault>
          </TouchableOpacity>
        ))}
      </Row>
    </Row>
  );
}

export default CategorySelect;
