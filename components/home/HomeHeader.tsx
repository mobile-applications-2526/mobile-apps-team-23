import { StyleProp, View, ViewStyle } from "react-native";
import { Button } from "@rneui/themed";
import { HomeStatus } from "@/components/home/HomeContent";

export default function HomeHeader({
  homeStatus,
  setHomeStatus,
}: {
  homeStatus: HomeStatus;
  setHomeStatus: (status: HomeStatus) => void;
}) {
  const getContrastColor = (bgColor: string): string => {
    // Remove the '#' if it's there
    const color = bgColor.charAt(0) === "#" ? bgColor.substring(1) : bgColor;

    // Convert to RGB
    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);

    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    // Return black for light backgrounds and white for dark backgrounds
    return luminance > 0.5 ? "#000000" : "#FFFFFF";
  };

  const renderButtons = (
    status: HomeStatus | undefined,
    iconName: string,
    onPress: () => void,
    color?: string,
  ) => (
    <Button
      type={homeStatus === status ? "solid" : "clear"}
      onPress={onPress}
      containerStyle={{
        flex: 1,
        marginHorizontal: 6,
      }}
      buttonStyle={{
        borderRadius: 12,
        backgroundColor:
          homeStatus === status ? (color ?? "#2089dc") : "#00000000",
        borderColor: color ?? "#2089dc",
        borderWidth: 1,
      }}
      icon={{
        name: iconName,
        type: "font-awesome",
        color:
          homeStatus === status
            ? getContrastColor(color ?? "#2089dc")
            : (color ?? "#2089dc"),
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
        setHomeStatus(HomeStatus.LIVE_MAP),
      )}
      {renderButtons(HomeStatus.TIMELINE, "comments", () =>
        setHomeStatus(HomeStatus.TIMELINE),
      )}
      {renderButtons(HomeStatus.SETTINGS, "cog", () => {
        setHomeStatus(HomeStatus.SETTINGS);
      })}
    </View>
  );
}
