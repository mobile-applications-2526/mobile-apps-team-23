import { View, TouchableOpacity, Text } from "react-native";
import { usePathname, useRouter } from "expo-router";
import { Icon } from "@rneui/themed";

const TABS = [
  {
    label: "Home",
    route: "/home" as const,
    icon: { name: "users", type: "font-awesome" as const },
  },
  {
    label: "Map",
    route: "/map" as const,
    icon: { name: "map-marker", type: "font-awesome" as const },
  },
  {
    label: "Berichten",
    route: "/privateMessages" as const,
    icon: { name: "comments", type: "font-awesome" as const },
  },
  {
    label: "Account",
    route: "/account" as const,
    icon: { name: "user", type: "font-awesome" as const },
  },
];

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  const handlePress = (route: (typeof TABS)[number]["route"]) => {
    if (pathname === route) return;
    router.push(route);
  };

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        paddingVertical: 12,
        paddingBottom: 18,
        borderTopWidth: 0,
        backgroundColor: "#5cceb2", // groene/turquoise achtergrond
      }}
    >
      {TABS.map((tab) => {
        const isActive = pathname?.startsWith(tab.route);
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
      })}
    </View>
  );
}
