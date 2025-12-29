import { View } from "react-native";
import { Button } from "@rneui/themed";
import { HomeStatus } from "@/components/home/HomeContent";
import { Router } from "expo-router";

export default function HomeHeader({
  router,
  homeStatus,
  setHomeStatus,
}: {
  router: Router;
  homeStatus: HomeStatus;
  setHomeStatus: (status: HomeStatus) => void;
}) {
  const renderButtons = (
    status: HomeStatus | undefined,
    iconName: string,
    onPress: () => void,
  ) => (
    <Button
      type={homeStatus === status ? "solid" : "outline"}
      onPress={onPress}
      containerStyle={{
        flex: 1,
        marginHorizontal: 6,
      }}
      buttonStyle={{ borderRadius: 12 }}
      icon={{
        name: iconName,
        type: "font-awesome",
        color: homeStatus === status ? "#ffffff" : "#2089dc",
      }}
    />
  );

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 12,
      }}
    >
      {renderButtons(HomeStatus.FRIENDS, "users", () =>
        setHomeStatus(HomeStatus.FRIENDS),
      )}
      {renderButtons(HomeStatus.LIVE_MAP, "map-marker", () =>
        router.push("/map"),
      )}
      {renderButtons(HomeStatus.TIMELINE, "comments", () =>
        setHomeStatus(HomeStatus.TIMELINE),
      )}
      {renderButtons(HomeStatus.SETTINGS, "cog", () => {})}
    </View>
  );
}
