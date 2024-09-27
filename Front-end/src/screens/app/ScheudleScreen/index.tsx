import { ButtonPrimary, IconButton } from "@components/Button";
import Row from "@components/Row";
import Separator from "@components/Separator";
import TextDefault from "@components/TextDefault";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";
import MainLayout from "@layout/MainLayout";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { StatusBar } from "expo-status-bar";
import moment from "moment";
import React from "react";
import { Modal, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { COLORS } from "src/constant";
import { useLoading } from "src/context/LoadingContext";
import { normalize } from "src/Helper";
import { goBack, navigate } from "src/nav/NavigationService";
import { APP_ROUTE } from "src/nav/route";
import useCreateSchedule, {
  IScheduleItem,
} from "src/services/hooks/app/useCreateSchedule";
import { useCurrentLocation } from "src/services/hooks/useCurrentLocation";
import { styleGlobal } from "src/styles";

enum TYPE_OF_SCHEDULE {
  "HISTORY" = "HISTORY",
  "NATURAL" = "NATURAL",
  "CULTURE" = "CULTURE",
  "FOOD" = "FOOD",
}

const SCHEDULES_TYPE = [
  {
    name: "History",
    type: TYPE_OF_SCHEDULE.HISTORY,
    icon: <FontAwesome name="history" size={24} color="gray" />,
  },
  {
    name: "Natural",
    type: TYPE_OF_SCHEDULE.NATURAL,
    icon: <FontAwesome5 name="tree" size={24} color="gray" />,
  },
  {
    name: "Culture",
    type: TYPE_OF_SCHEDULE.CULTURE,
    icon: <Entypo name="location" size={24} color="gray" />,
  },
  {
    name: "Food",
    type: TYPE_OF_SCHEDULE.FOOD,
    icon: <Ionicons name="fast-food" size={24} color="gray" />,
  },
];

function ScheduleScreen() {
  const [location] = useCurrentLocation();
  const { onCreate } = useCreateSchedule();
  const { startLoading, stopLoading } = useLoading();
  const [typeSelected, setTypeSelected] = React.useState<TYPE_OF_SCHEDULE[]>(
    []
  );
  const [startTime, setStartTime] = React.useState<Date | null>(null);
  const [endTime, setEndTime] = React.useState<Date | null>(null);
  const [result, setResult] = React.useState<IScheduleItem[]>([]);

  const handleCreateSchedule = async () => {
    const body: any = {
      kind:
        typeSelected?.length > 0
          ? typeSelected
          : [
              TYPE_OF_SCHEDULE.FOOD,
              TYPE_OF_SCHEDULE.CULTURE,
              TYPE_OF_SCHEDULE.NATURAL,
              TYPE_OF_SCHEDULE.HISTORY,
            ],
      long: location?.coords?.longitude || 10.782920865147576,
      lat: location?.coords?.latitude || 106.69800860703285,
      startTime: startTime ? startTime : new Date().toISOString(),
      endTime: endTime ? endTime : new Date().toISOString(),
    };

    startLoading();

    await onCreate(body)
      .then((res) => {
        setResult(res?.data ?? []);
        stopLoading();
      })
      .catch((err) => {
        stopLoading();
      });
  };

  return (
    <MainLayout>
      <StatusBar style="dark" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ flex: 1, padding: normalize(10) }}
      >
        <Separator height={normalize(40)} />
        <TextDefault bold size={normalize(16)}>
          Create your own schedule
        </TextDefault>

        <Separator height={normalize(20)} />

        <Row direction="row" center wrap full rowGap={20} colGap={20}>
          <TextDefault size={normalize(12)} color={"gray"}>
            Select your favorite type of schedule (optional)
          </TextDefault>
          {SCHEDULES_TYPE.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setTypeSelected((prev) => {
                  if (prev.includes(item.type)) {
                    return prev.filter((type) => type !== item.type);
                  }
                  return [...prev, item.type];
                });
              }}
              style={{
                width: "45%",
              }}
            >
              <Row
                start
                style={{
                  padding: normalize(10),
                  borderRadius: normalize(10),
                  backgroundColor: "rgba(0,0,0,0.1)",
                  alignItems: "center",
                }}
                colGap={10}
              >
                <View
                  style={{
                    height: 15,
                    width: 15,
                    borderRadius: 100,
                    backgroundColor: typeSelected.includes(item.type)
                      ? "black"
                      : "white",
                  }}
                />
                <Row key={index} full colGap={10}>
                  {item.icon}
                  <TextDefault color={"gray"} bold size={normalize(12)}>
                    {item.name}
                  </TextDefault>
                </Row>
              </Row>
            </TouchableOpacity>
          ))}
        </Row>
        <Separator height={normalize(20)} />
        <Row direction="row" center wrap full rowGap={20} colGap={20}>
          <TextDefault size={normalize(12)} color={"gray"}>
            Select range time for your schedule (optional)
          </TextDefault>
          <Row
            full
            direction="row"
            between
            wrap
            rowGap={10}
            style={{ paddingHorizontal: normalize(10) }}
          >
            <Row between full colGap={10} style={{ alignItems: "center" }}>
              <TextDefault bold>Start time: </TextDefault>
              <RNDateTimePicker
                mode={"datetime"}
                value={startTime || new Date()}
                onChange={(ev, date) => {
                  setStartTime(date as Date);
                }}
              />
            </Row>
            <Row full between colGap={10} style={{ alignItems: "center" }}>
              <TextDefault bold>End time: </TextDefault>
              <RNDateTimePicker
                mode={"datetime"}
                value={endTime || new Date()}
                onChange={(ev, date) => {
                  setEndTime(date as Date);
                }}
              />
            </Row>
          </Row>
        </Row>

        <Separator height={normalize(20)} />

        <ButtonPrimary title="Create schedule" onPress={handleCreateSchedule} />
      </ScrollView>

      {result.length > 0 && (
        <Modal animationType="slide" visible={true}>
          <View
            style={{
              position: "absolute",
              top: 50,
              right: 10,
              paddingHorizontal: 20,
              zIndex: 1000000,
            }}
          >
            <IconButton
              icon={<Entypo name="cross" size={24} color="black" />}
              onPress={() => {
                setResult([]);
                setTimeout(() => {
                  goBack();
                }, 100);
              }}
            />
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Separator height={normalize(40)} />

            <Row full center style={{ padding: normalize(10) }}>
              <TextDefault bold size={normalize(16)}>
                Your schedule
              </TextDefault>
            </Row>

            {result?.map((item, index) => (
              <ScheduleItem
                onClose={() => {
                  setResult([]);
                }}
                data={item}
                key={index}
                isHasLine={index < result?.length - 1}
              />
            ))}
          </ScrollView>
        </Modal>
      )}
    </MainLayout>
  );
}

const ScheduleItem = ({
  data,
  isHasLine,
  onClose,
}: {
  data: IScheduleItem;
  isHasLine: boolean;
  onClose: () => void;
}) => {
  return (
    <Row full start colGap={10} style={{ padding: normalize(10) }}>
      <Row
        end
        colGap={10}
        style={{
          width: "35%",
          minWidth: 100,
          justifyContent: "flex-end",
          alignItems: "flex-end",
        }}
        rowGap={10}
        direction="row"
      >
        <Row direction="column" center rowGap={5} style={{ paddingLeft: 10 }}>
          <TextDefault bold size={10} color="green">
            {moment(data?.startTime, "HH:mm YYYY:MM:D").format(
              "HH:mm DD/MM/YYYY"
            )}
          </TextDefault>
          <TextDefault bold size={10}>
            -
          </TextDefault>
          <TextDefault bold size={10} color="red">
            {moment(data?.endTime, "HH:mm YYYY:MM:D").format(
              "HH:mm DD/MM/YYYY"
            )}
          </TextDefault>
        </Row>
        <View
          style={{
            height: 20,
            width: 20,
            borderRadius: 100,
            backgroundColor: COLORS.primary,
          }}
        />
        {isHasLine && (
          <View
            style={{
              width: 1,
              height: "120%",
              backgroundColor: "black",
              position: "absolute",
              top: 40,
              right: 10,
              zIndex: -1,
            }}
          />
        )}
      </Row>

      <TouchableOpacity
        style={{ width: "60%" }}
        onPress={() => {
          onClose();

          navigate(APP_ROUTE.LOCATION_DETAIL, { place: data?.name });
        }}
      >
        <Row
          colGap={10}
          direction="column"
          start
          full
          style={{
            minHeight: 100,
            borderRadius: 10,
            padding: 10,
            ...styleGlobal.shadow,
          }}
          rowGap={5}
        >
          <TextDefault
            bold
            size={normalize(14)}
            style={{
              width: "80%",
            }}
          >
            {data?.name}
          </TextDefault>
          <Row start colGap={5} style={{ alignItems: "center" }}>
            <Entypo name="location-pin" size={24} color={COLORS.primary} />
            <TextDefault
              style={{
                width: "80%",
              }}
              size={normalize(12)}
            >
              {data?.description}
            </TextDefault>
          </Row>
          {data?.cost && (
            <Row start colGap={5}>
              <FontAwesome6 name="money-bills" size={16} color="orange" />
              <TextDefault bold style={{ color: "orange" }}>
                {data?.cost}
              </TextDefault>
            </Row>
          )}
        </Row>
      </TouchableOpacity>
    </Row>
  );
};

export default ScheduleScreen;
