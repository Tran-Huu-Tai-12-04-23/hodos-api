import Row from "@components/Row";
import Separator from "@components/Separator";
import TextDefault from "@components/TextDefault";
import React from "react";
import { ActivityIndicator, FlatList, StyleSheet } from "react-native";
import { COLORS } from "src/constant";
import { deviceHeight, normalize } from "src/Helper";
import useFoodPagination from "src/services/hooks/app/useFoodPagination";
import LocationItem from "./LocationItem";

function FoodView() {
  const { data, isLoading, isFetching, fetchNextPage, refetch } =
    useFoodPagination();
  return (
    <Row direction="column" start full style={styles.container}>
      {/* <CategorySelect /> */}
      {/* <Separator height={normalize(20)} /> */}
      <TextDefault bold>Your most visited location</TextDefault>
      <Separator height={normalize(10)} />
      <FlatList
        showsVerticalScrollIndicator={false}
        onRefresh={refetch}
        style={{ flex: 1 }}
        refreshing={isFetching}
        ListHeaderComponent={() => <Separator height={20} />}
        onEndReached={() => () => fetchNextPage()}
        ItemSeparatorComponent={() => <Separator height={10} />}
        ListFooterComponent={() =>
          isLoading && !isFetching ? (
            <ActivityIndicator color={COLORS.primary} />
          ) : null
        }
        ListEmptyComponent={() =>
          isFetching && !isLoading ? (
            <ActivityIndicator color={COLORS.primary} />
          ) : null
        }
        data={data?.result}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <LocationItem data={item} />}
        ListFooterComponentStyle={{ marginBottom: normalize(100) }}
      />
    </Row>
  );
}

const styles = StyleSheet.create({
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
});

export default FoodView;
