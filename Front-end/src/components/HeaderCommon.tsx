import BackBtn from "@components/BackBtn";
import Row from "@components/Row";
import TextDefault from "@components/TextDefault";
import React from "react";
import { normalize } from "src/Helper";

function HeaderCommon({ title }: { title: string }) {
  return (
    <Row
      between
      style={{
        height: normalize(40),
        paddingHorizontal: normalize(10),
      }}
    >
      <BackBtn />
      {title && (
        <TextDefault bold style={{ fontSize: normalize(16) }}>
          {title}
        </TextDefault>
      )}
    </Row>
  );
}

export default HeaderCommon;
