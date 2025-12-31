import { Text, TouchableOpacity, View } from "react-native";
import { Icon } from "@rneui/themed";
import { TABS } from "@/components/navBar/BottomNav";
import { Router } from "expo-router";

export default function NavTab({
  pathName,
  router,
  tab,
}: {
  pathName: string | null;
  router: Router;
  tab: (typeof TABS)[number];
}) {
  const handlePress = (route: (typeof TABS)[number]["route"]) => {
    if (pathName === route) return;
    router.replace(route);
  };

  const isActive = pathName?.startsWith(tab.route);
  const color = "#ffffff";

  return (
    <TouchableOpacity
      key={`${tab.route}-${tab.label}`}
      style={{ flex: 1, alignItems: "center" }}
      onPress={() => handlePress(tab.route)}
      activeOpacity={0.7}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          borderWidth: 0,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "transparent",
          opacity: isActive ? 1 : 0.7,
        }}
      >
        <Icon
          name={tab.icon.name}
          type={tab.icon.type}
          color={color}
          size={24}
        />
      </View>
      <Text
        style={{
          fontSize: 13,
          marginTop: 6,
          color,
          opacity: isActive ? 1 : 0.8,
        }}
      >
        {tab.label}
      </Text>
    </TouchableOpacity>
  );
}
